import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import https from 'node:https';
import net from 'node:net';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { validateConfig, start } from '../infrastructure/serve.mjs';
import { Store } from '../services/control-api/store.ts';
import { createTlsFixture } from './helpers/tls.js';

async function freePort() {
  const socket = net.createServer(); socket.listen(0, '127.0.0.1'); await once(socket, 'listening');
  const { port } = socket.address(); await new Promise(resolve => socket.close(resolve)); return port;
}
async function config(t) {
  const dir = await mkdtemp(join(tmpdir(), 'runtime-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const tls = await createTlsFixture(); t.after(tls.cleanup);
  await writeFile(join(dir, 'key.pem'), tls.key, { mode: 0o600 });
  await writeFile(join(dir, 'cert.pem'), tls.cert);
  const proxyPort = await freePort();
  let apiPort = await freePort(); while (apiPort === proxyPort) apiPort = await freePort();
  return { tls, dir, input: {
    database: join(dir, 'runtime.sqlite'), tls: { key: join(dir, 'key.pem'), cert: join(dir, 'cert.pem') },
    apiOrigin: 'https://control.example.invalid',
    management: { host: '127.0.0.1', port: apiPort }, proxy: { host: '127.0.0.1', port: proxyPort },
    extensionOrigins: [], gateway: { id: 'fixture', name: 'Local fixture', host: 'localhost', port: proxyPort,
      scheme: 'https', country: 'US', live: false, expectedIp: '203.0.113.10', verificationUrl: 'https://route.example.invalid/ip' },
  } };
}
function request(port, ca, path) {
  return new Promise((resolve, reject) => {
    https.get({ host: '127.0.0.1', port, ca, path, agent: false }, res => {
      let body = ''; res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    }).on('error', reject);
  });
}

test('runtime validation requires private management, external files, honest live preflight', async t => {
  const { input, dir } = await config(t);
  assert.equal(validateConfig(input).gateway.live, false);
  assert.throws(() => validateConfig({ ...input, management: { host: '0.0.0.0', port: 9443 } }), /loopback/);
  assert.throws(() => validateConfig({ ...input, database: fileURLToPath(new URL('../runtime.sqlite', import.meta.url)) }), /outside checkout/);
  assert.throws(() => validateConfig({ ...input, database: fileURLToPath(new URL('../..secret.sqlite', import.meta.url)) }), /outside checkout/);
  assert.throws(() => validateConfig({ ...input, gateway: { ...input.gateway, live: true } }), /preflight/);
  await symlink(input.tls.key, join(dir, 'linked.key'));
  assert.throws(() => validateConfig({ ...input, tls: { ...input.tls, key: join(dir, 'linked.key') } }), /symlinks/);
});

test('configured runtime starts real TLS API, rejects unauthenticated admin, stops and restarts', async t => {
  const { input, tls } = await config(t);
  const validated = validateConfig(input);
  const seed = new Store(input.database); seed.createAccount('founder', 'test-only-long-password'); seed.close();
  let running = await start(validated);
  try {
    const health = await request(input.management.port, tls.ca, '/healthz');
    assert.equal(health.status, 200); assert.equal(health.body.releaseBlocked, true);
    assert.equal((await request(input.management.port, tls.ca, '/v1/status')).status, 401);
    await running.close();
    running = await start(validated);
    assert.equal((await request(input.management.port, tls.ca, '/healthz')).status, 200);
  } finally { await running.close(); }
});
