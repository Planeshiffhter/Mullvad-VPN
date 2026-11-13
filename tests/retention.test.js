import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { scryptSync } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import https from 'node:https';
import { Store } from '../services/control-api/store.ts';
import { createControlApi } from '../services/control-api/server.ts';
import { createTlsFixture } from './helpers/tls.js';

const day = 24 * 60 * 60 * 1000;
const password = 'retention-regression-password-123';

test('migrates legacy usage before pruning and preserves cumulative quota through restart', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'vpn-migration-'));
  const path = join(dir, 'state.sqlite');
  let now = Date.now();
  const legacy = new DatabaseSync(path);
  legacy.exec(`CREATE TABLE accounts(id INTEGER PRIMARY KEY CHECK(id=1),username TEXT UNIQUE NOT NULL,salt TEXT NOT NULL,password_hash TEXT NOT NULL,quota_bytes INTEGER NOT NULL);
    CREATE TABLE sessions(hash TEXT PRIMARY KEY,account_id INTEGER NOT NULL REFERENCES accounts(id),expires_at INTEGER NOT NULL);
    CREATE TABLE grants(id TEXT PRIMARY KEY,session_hash TEXT NOT NULL,password_hash TEXT NOT NULL,gateway_id TEXT NOT NULL,expires_at INTEGER NOT NULL,max_bytes INTEGER NOT NULL,used_bytes INTEGER NOT NULL DEFAULT 0,revoked INTEGER NOT NULL DEFAULT 0);
    PRAGMA user_version=1;`);
  legacy.prepare('INSERT INTO accounts VALUES(1,?,?,?,?)').run('founder', 'legacy-salt', scryptSync(password, 'legacy-salt', 64).toString('hex'), 10000);
  legacy.prepare('INSERT INTO grants VALUES(?,?,?,?,?,?,?,?)').run('legacy-grant', 'expired-session', 'unused-test-hash', 'fixture', now - 8 * day, 10000, 1234, 1);
  legacy.close();
  let store;
  try {
    store = new Store(path, { now: () => now });
    assert.equal(store.db.prepare('PRAGMA user_version').get().user_version, 2);
    assert.equal(store.status().account.usedBytes, 1234);
    assert.equal(store.db.prepare('SELECT count(*) AS total FROM grants').get().total, 0);
    const session = store.login('founder', password);
    const grant = store.issue(store.session(session.token).hash, 'fixture');
    store.addUsage(grant.id, 2000);
    assert.equal(store.status().account.usedBytes, 3234);
    // A failure updating cumulative usage must roll back the grant counter too.
    store.db.exec("CREATE TRIGGER usage_fault BEFORE UPDATE OF used_bytes ON accounts BEGIN SELECT RAISE(ABORT,'fixture persistence fault'); END;");
    assert.throws(() => store.addUsage(grant.id, 100), /persistence fault/);
    assert.equal(store.db.prepare('SELECT used_bytes FROM grants WHERE id=?').get(grant.id).used_bytes, 2000);
    store.db.exec('DROP TRIGGER usage_fault');
    assert.throws(() => store.addUsage('missing-grant', 999), /persistence/);
    assert.equal(store.status().account.usedBytes, 3234);
    now += 8 * day;
    store.prune();
    assert.equal(store.status().grants.length, 0);
    assert.equal(store.db.prepare('SELECT count(*) AS total FROM sessions').get().total, 0);
    store.close(); store = new Store(path, { now: () => now });
    assert.equal(store.status().account.usedBytes, 3234, 'Pruning/reopening must never restore spent quota');
  } finally { store?.close(); await rm(dir, { recursive: true, force: true }); }
});

test('revocation retention and grant states use actual expiry/quota with independent session cleanup', () => {
  let now = Date.now();
  const store = new Store(':memory:', { now: () => now, sessionMs: 30 * day, grantMs: 20 * day });
  try {
    store.createAccount('founder', password, 10000);
    const session = store.login('founder', password);
    const hash = store.session(session.token).hash;
    const revoked = store.issue(hash, 'fixture');
    assert.equal(store.status().grants[0].state, 'active');
    assert.equal(store.revoke(revoked.id, hash), true);
    assert.equal(store.status().grants[0].state, 'revoked');
    const active = store.issue(hash, 'fixture');
    store.addUsage(active.id, 10000);
    assert.equal(store.status().grants.find(g => g.id === active.id).state, 'exhausted');
    now += 8 * day;
    store.prune();
    assert.ok(!store.status().grants.some(g => g.id === revoked.id), 'Revoked rows expire seven days after revocation even with later grant expiry');
    assert.equal(store.status().account.usedBytes, 10000);
    now += 13 * day;
    assert.equal(store.status().grants.find(g => g.id === active.id).state, 'expired');
    assert.equal(store.status().grants.find(g => g.id === active.id).active, false);
  } finally { store.close(); }
});

test('TLS API limits authenticated mutations to thirty per session per minute', async () => {
  const tls = await createTlsFixture();
  const store = new Store(':memory:');
  store.createAccount('founder', password);
  const api = createControlApi({ tls, store, gateways: [{ id: 'fixture', live: false }] });
  const address = await api.listen();
  const session = store.login('founder', password);
  const request = (path, method, body) => new Promise((resolve, reject) => {
    const data = body === undefined ? undefined : JSON.stringify(body);
    const req = https.request({ host: '127.0.0.1', port: address.port, ca: tls.ca, path, method,
      headers: { Authorization: `Bearer ${session.token}`, ...(data ? { 'Content-Type': 'application/json' } : {}) } }, res => {
      let text = '';
      res.on('data', b => text += b);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(text) }));
    });
    req.on('error', reject); req.end(data);
  });
  try {
    for (let i = 0; i < 30; i++) assert.equal((await request('/v1/grants', 'POST', { gatewayId: 'fixture' })).status, 201);
    const limited = await request('/v1/grants', 'POST', { gatewayId: 'fixture' });
    assert.equal(limited.status, 429);
    assert.ok(Number(limited.headers['retry-after']) > 0);
    assert.equal((await request('/v1/status', 'GET')).status, 200, 'Read-only operations remain available');
    assert.equal(store.status().grants.filter(g => g.active).length, 1);
  } finally { await api.close(); store.close(); await tls.cleanup(); }
});
