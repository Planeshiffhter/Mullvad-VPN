import test from 'node:test';
import assert from 'node:assert/strict';
import https from 'node:https';
import tls from 'node:tls';
import { once } from 'node:events';
import { mkdtemp, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { initDevelopment, startDevelopment } from '../../scripts/development/dev.mjs';
import { createBackup, restoreBackup } from '../../scripts/recovery/backup.mjs';
import { Store } from '../../services/control-api/store.ts';

async function setup(t) {
  const stateDir = await mkdtemp(join(tmpdir(), 'private-route-dev-'));
  t.after(() => rm(stateDir, { recursive: true, force: true }));
  const paths = await initDevelopment({ stateDir, founderPassword: 'local-test-founder-password' });
  const credentials = JSON.parse(await readFile(paths.credentials, 'utf8'));
  const ca = await readFile(paths.cert);
  await writeFile(paths.config, JSON.stringify({ apiPort: 0, gatewayPort: 0, fixturePort: 0, extensionOrigins: [] }));
  return { stateDir, paths, credentials, ca };
}
function request(port, ca, path, { method = 'GET', body, token } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host: '127.0.0.1', port, ca, path, method, agent: false,
      headers: { ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) } }, (res) => {
      const chunks = []; res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString()) }));
    });
    req.on('error', reject); req.end(body ? JSON.stringify(body) : undefined);
  });
}

test('development initialization is repeatable and never rotates existing account credentials', async (t) => {
  const f = await setup(t);
  const before = await readFile(f.paths.credentials, 'utf8');
  const certBefore = await readFile(f.paths.cert, 'utf8');
  await initDevelopment({ stateDir: f.stateDir, founderPassword: 'different-local-test-password' });
  assert.equal(await readFile(f.paths.credentials, 'utf8'), before);
  assert.equal(await readFile(f.paths.cert, 'utf8'), certBefore);
  for (const path of Object.values(f.paths).filter((p) => p !== f.stateDir)) assert.equal((await stat(path)).mode & 0o777, 0o600);
  assert.equal((await stat(f.stateDir)).mode & 0o777, 0o700);
});

test('default local services require trusted TLS and advertise no live gateway', async (t) => {
  const f = await setup(t);
  const running = await startDevelopment({ stateDir: f.stateDir });
  try {
    const port = running.apiAddress.port;
    assert.equal(running.apiAddress.address, '127.0.0.1');
    assert.equal(running.gatewayAddress.address, '127.0.0.1');
    assert.equal((await request(port, f.ca, '/healthz')).body.status, 'ok');
    await assert.rejects(request(port, undefined, '/healthz'), /certificate|self.signed/);
    const login = await request(port, f.ca, '/v1/login', { method: 'POST', body: f.credentials });
    assert.equal(login.status, 200);
    const gateways = await request(port, f.ca, '/v1/gateways', { token: login.body.token });
    assert.deepEqual(gateways.body.gateways, []);
    assert.equal((await request(port, f.ca, '/v1/status')).status, 401);
  } finally { await running.close(); }
  // Restarting from retained state must not need undocumented initialization.
  const restarted = await startDevelopment({ stateDir: f.stateDir });
  try { assert.equal((await request(restarted.apiAddress.port, f.ca, '/healthz')).status, 200); }
  finally { await restarted.close(); }
});

test('explicit fixture uses an issued grant and real TLS CONNECT without claiming a US exit', async (t) => {
  const f = await setup(t);
  const running = await startDevelopment({ stateDir: f.stateDir, fixture: true });
  let socket, inner;
  try {
    const login = await request(running.apiAddress.port, f.ca, '/v1/login', { method: 'POST', body: f.credentials });
    const grants = await request(running.apiAddress.port, f.ca, '/v1/grants', { method: 'POST', body: { gatewayId: 'fixture' }, token: login.body.token });
    assert.equal(grants.status, 201);
    assert.equal(grants.body.gateway.live, false);
    assert.equal(grants.body.gateway.country, 'LOCAL');
    socket = tls.connect({ host: '127.0.0.1', port: running.gatewayAddress.port, ca: f.ca });
    socket.on('error', () => {});
    await once(socket, 'secureConnect');
    const authorization = Buffer.from(`${grants.body.username}:${grants.body.password}`).toString('base64');
    socket.write(`CONNECT localhost:${running.fixtureAddress.port} HTTP/1.1\r\nHost: localhost:${running.fixtureAddress.port}\r\nProxy-Authorization: Basic ${authorization}\r\n\r\n`);
    const [header] = await once(socket, 'data');
    assert.match(header.toString(), /200 Connection Established/);
    inner = tls.connect({ socket, servername: 'localhost', ca: f.ca });
    inner.on('error', () => {});
    await once(inner, 'secureConnect');
    assert.equal(inner.authorized, true);
    inner.write(`GET /ip HTTP/1.1\r\nHost: localhost:${running.fixtureAddress.port}\r\nConnection: close\r\n\r\n`);
    let response = '';
    inner.on('data', (chunk) => { response += chunk; });
    await once(inner, 'end');
    assert.match(response, /"ip":"127\.0\.0\.1","fixture":true/);
    const status = await request(running.apiAddress.port, f.ca, '/v1/status', { token: login.body.token });
    assert.ok(status.body.account.usedBytes > 0);
    const revoke = await request(running.apiAddress.port, f.ca, `/v1/grants/${grants.body.id}`, { method: 'DELETE', token: login.body.token });
    assert.equal(revoke.body.revoked, true);
  } finally { inner?.destroy(); socket?.destroy(); await running.close(); }
});


test('restored database starts the real API after owner recovery invalidates old sessions and grants', async (t) => {
  const f = await setup(t);
  let running = await startDevelopment({ stateDir: f.stateDir, fixture: true });
  let oldToken;
  try {
    const login = await request(running.apiAddress.port, f.ca, '/v1/login', { method: 'POST', body: f.credentials });
    oldToken = login.body.token;
    assert.equal((await request(running.apiAddress.port, f.ca, '/v1/grants', { method: 'POST', body: { gatewayId: 'fixture' }, token: oldToken })).status, 201);
  } finally { await running.close(); }
  const archive = join(f.stateDir, 'recovery.enc');
  const backupPassword = 'fixture-only-database-backup-passphrase';
  await createBackup(f.paths.database, archive, { password: backupPassword });
  await rename(f.paths.database, join(f.stateDir, 'before-restore.sqlite'));
  await restoreBackup(archive, f.paths.database, { password: backupPassword });
  const recoveredPassword = 'fixture-only-new-founder-password';
  const store = new Store(f.paths.database);
  try { store.recover(recoveredPassword); } finally { store.close(); }
  running = await startDevelopment({ stateDir: f.stateDir });
  try {
    const port = running.apiAddress.port;
    assert.equal((await request(port, f.ca, '/v1/status', { token: oldToken })).status, 401);
    assert.equal((await request(port, f.ca, '/v1/login', { method: 'POST', body: f.credentials })).status, 401);
    const login = await request(port, f.ca, '/v1/login', { method: 'POST', body: { username: 'founder', password: recoveredPassword } });
    assert.equal(login.status, 200);
    const status = await request(port, f.ca, '/v1/status', { token: login.body.token });
    assert.equal(status.body.account.username, 'founder');
    assert.equal(status.body.grants.length, 1);
    assert.equal(status.body.grants[0].revoked, 1);
  } finally { await running.close(); }
});
