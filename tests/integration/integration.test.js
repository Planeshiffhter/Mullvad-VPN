import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Store } from '../../services/control-api/store.ts';
import { createControlApi } from '../../services/control-api/server.ts';
import { createGateway } from '../../services/gateway/index.js';
import { createBackup, restoreBackup } from '../../scripts/recovery/backup.mjs';
import { RouteController } from '../../apps/extension/core.ts';
import { createTlsFixture } from '../helpers/tls.js';

test('control-issued grant actually forwards, accounts traffic, revokes and survives encrypted recovery', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'vpn-e2e-')), tls = await createTlsFixture();
  const store = new Store(join(dir, 'live.sqlite'));
  store.createAccount('founder', 'only-for-integration-test-123');
  const target = http.createServer((req, res) => res.end('controlled-origin-content'));
  await new Promise(resolve => target.listen(0, '127.0.0.1', resolve));
  const targetPort = target.address().port;
  const gateway = createGateway({ tls, authorize: (u, p) => store.authorize(u, p), onUsage: (id, count) => store.addUsage(id, count),
    policy: async (host, port) => { assert.equal(host, 'fixture.invalid'); assert.equal(port, targetPort); return { address: '127.0.0.1', family: 4 }; } });
  const proxyAddress = await gateway.listen();
  const api = createControlApi({ tls, store, gateways: [{ id: 'fixture', live: false }], revoke: id => gateway.revoke(id) });
  const apiAddress = await api.listen();
  const request = (path, { method = 'GET', body, token } = {}) => new Promise((resolve, reject) => {
    const req = https.request({ hostname: '127.0.0.1', port: apiAddress.port, ca: tls.ca, path, method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } }, res => {
      let content = ''; res.on('data', b => content += b); res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(content) }));
    }); req.on('error', reject); req.end(body === undefined ? undefined : JSON.stringify(body));
  });
  const forward = grant => new Promise((resolve, reject) => {
    const req = https.request({ hostname: '127.0.0.1', port: proxyAddress.port, ca: tls.ca,
      path: `http://fixture.invalid:${targetPort}/resource`, headers: {
        'Proxy-Authorization': `Basic ${Buffer.from(`${grant.username}:${grant.password}`).toString('base64')}`,
      } }, res => { let text = ''; res.on('data', b => text += b); res.on('end', () => resolve({ status: res.statusCode, text })); });
    req.on('error', reject); req.end();
  });
  try {
    const login = await request('/v1/login', { method: 'POST', body: { username: 'founder', password: 'only-for-integration-test-123' } });
    const token = login.data.token;
    const issued = await request('/v1/grants', { method: 'POST', token, body: { gatewayId: 'fixture' } });
    assert.equal(issued.status, 201);
    const grant = issued.data;
    assert.deepEqual(await forward(grant), { status: 200, text: 'controlled-origin-content' });
    const state = await request('/v1/status', { token });
    assert.ok(state.data.account.usedBytes > 0);
    assert.equal((await request(`/v1/grants/${grant.id}`, { method: 'DELETE', token })).status, 200);
    assert.equal((await forward(grant)).status, 407);
    const backup = join(dir, 'state.enc'), restoredPath = join(dir, 'restored.sqlite');
    await createBackup(join(dir, 'live.sqlite'), backup, { password: 'integration-backup-passphrase-123' });
    await restoreBackup(backup, restoredPath, { password: 'integration-backup-passphrase-123' });
    const restored = new Store(restoredPath);
    try {
      assert.ok(restored.login('founder', 'only-for-integration-test-123'));
      assert.equal(restored.status().account.usedBytes, store.status().account.usedBytes);
      assert.equal(restored.authorize(grant.username, grant.password), null);
    } finally { restored.close(); }
  } finally {
    await api.close(); await gateway.close(); store.close();
    await new Promise(resolve => target.close(resolve)); await tls.cleanup(); await rm(dir, { recursive: true, force: true });
  }
});

test('extension controller logout invalidates a real API session', async () => {
  const tls = await createTlsFixture(), store = new Store(':memory:');
  store.createAccount('founder', 'integration-logout-passphrase');
  const api = createControlApi({ tls, store });
  const { port } = await api.listen();
  const local = {}, session = {};
  const area = data => ({ get: async () => data, set: async values => Object.assign(data, values),
    remove: async key => delete data[key], setAccessLevel: async () => {} });
  const browser = { storage: { local: area(local), session: area(session) }, alarms: { clear: async () => {} } };
  const trustedRequest = (url, options = {}) => new Promise((resolve, reject) => {
    const req = https.request(url, { ...options, ca: tls.ca }, res => {
      let body = ''; res.on('data', b => body += b); res.on('end', () => resolve({ ok: res.statusCode < 300, status: res.statusCode, json: async () => JSON.parse(body) }));
    }); req.on('error', reject); req.end(options.body);
  });
  try {
    const controller = new RouteController(browser, trustedRequest);
    await controller.login({ origin: `https://localhost:${port}`, username: 'founder', password: 'integration-logout-passphrase' });
    const token = controller.auth.token;
    assert.ok(store.session(token));
    await controller.logout();
    assert.equal(store.session(token), null);
    assert.equal(controller.snapshot().signedIn, false);
  } finally { await api.close(); store.close(); await tls.cleanup(); }
});
