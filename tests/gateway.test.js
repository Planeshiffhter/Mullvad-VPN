import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import tls from 'node:tls';
import net from 'node:net';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createGateway } from '../services/gateway/index.js';
import { createDestinationPolicy, isPublicAddress } from '../services/gateway/policy.js';

const directory = mkdtempSync(join(tmpdir(), 'gateway-test-'));
execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1',
  '-keyout', join(directory, 'key.pem'), '-out', join(directory, 'cert.pem'),
  '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1'], { stdio: 'ignore' });
const cert = { key: readFileSync(join(directory, 'key.pem')), cert: readFileSync(join(directory, 'cert.pem')) };
test.after(() => rmSync(directory, { recursive: true, force: true }));
const auth = `Basic ${Buffer.from('grant:test-secret').toString('base64')}`;

async function fixture(t, overrides = {}) {
  const grant = { id: 'grant', expiresAt: Date.now() + 60000, maxBytes: 1e6, maxConnections: 3, ...overrides };
  let bytes = 0;
  const gateway = createGateway({ tls: cert,
    authorize: (user, password) => user === 'grant' && password === 'test-secret' ? grant : null,
    onUsage: (_id, count) => { bytes += count; },
    // Explicit test-only policy; production policy denies loopback and random ports.
    policy: async (host) => {
      if (host !== 'test.invalid') throw new Error('Test host denied');
      return { address: '127.0.0.1', family: 4 };
    },
  });
  await gateway.listen();
  t.after(() => gateway.close());
  return { gateway, grant, bytes: () => bytes };
}
async function server(t, handler, secure = false) {
  const s = secure ? https.createServer(cert, handler) : http.createServer(handler);
  s.listen(0, '127.0.0.1'); await once(s, 'listening');
  t.after(() => new Promise(resolve => { s.closeAllConnections?.(); s.close(resolve); }));
  return s.address().port;
}
async function request(gateway, target, authorization = auth, ca = cert.cert) {
  return new Promise((resolve, reject) => {
    const req = https.request({ host: '127.0.0.1', port: gateway.address().port, ca,
      method: 'GET', path: target, headers: authorization ? { 'Proxy-Authorization': authorization } : {},
      agent: false }, res => {
      const chunks = []; res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString() }));
    });
    req.on('error', reject); req.end();
  });
}
async function tunnel(gateway, targetPort, authorization = auth) {
  const socket = tls.connect({ host: '127.0.0.1', port: gateway.address().port, ca: cert.cert });
  socket.on('error', () => {});
  await once(socket, 'secureConnect');
  socket.write(`CONNECT test.invalid:${targetPort} HTTP/1.1\r\nHost: test.invalid:${targetPort}\r\nProxy-Authorization: ${authorization}\r\n\r\n`);
  let header = '';
  while (!header.includes('\r\n\r\n')) {
    const [chunk] = await once(socket, 'data'); header += chunk.toString();
  }
  return { socket, header };
}

test('public destination policy rejects private and special-use IPv4/IPv6, mixed answers and ports', async () => {
  for (const address of ['127.0.0.1', '10.0.0.1', '172.16.1.1', '192.168.0.1', '169.254.169.254',
    '100.64.0.1', '0.0.0.0', '192.0.0.9', '192.0.2.1', '198.18.0.1',
    '198.51.100.20', '203.0.113.9', '224.0.0.1', '::1', '::', 'fd00::1',
    'fe80::1', '::ffff:127.0.0.1', '::ffff:198.18.0.1', 'fec0::1',
    '2001:db8::1', '2002::1', '3fff::1', '64:ff9b:1::1', '5f00::1']) {
    assert.equal(isPublicAddress(address), false, address);
  }
  assert.equal(isPublicAddress('93.184.216.34'), true);
  assert.equal(isPublicAddress('2606:4700:4700::1111'), true);
  const policy = createDestinationPolicy({ resolve: async () => [
    { address: '93.184.216.34', family: 4 }, { address: '127.0.0.1', family: 4 }] });
  await assert.rejects(policy('rebinding.invalid', 443, false), /address denied/);
  const publicPlusSpecial = createDestinationPolicy({ resolve: async () => [
    { address: '93.184.216.34', family: 4 }, { address: '198.18.0.1', family: 4 },
  ] });
  await assert.rejects(publicPlusSpecial('special-use.invalid', 443, false), /address denied/);
  await assert.rejects(policy('93.184.216.34', 22, false), /port denied/);
  await assert.rejects(policy('127.1', 80, true));
});

test('authenticated TLS proxy forwards real HTTP with pinned DNS and strips proxy credentials', async t => {
  let receivedAuthorization;
  const target = await server(t, (req, res) => { receivedAuthorization = req.headers['proxy-authorization']; res.end('origin response'); });
  const { gateway, bytes } = await fixture(t);
  const result = await request(gateway, `http://test.invalid:${target}/hello`);
  assert.deepEqual(result, { status: 200, body: 'origin response' });
  assert.equal(receivedAuthorization, undefined);
  assert.ok(bytes() > 20);
  assert.equal(bytes(), gateway.usage('grant').bytes);
});

test('missing/invalid/expired credentials fail and TLS trust is mandatory', async t => {
  const { gateway, grant } = await fixture(t);
  assert.equal((await request(gateway, 'http://test.invalid/', null)).status, 407);
  assert.equal((await request(gateway, 'http://test.invalid/', 'Basic YmFkOmJhZA==')).status, 407);
  await assert.rejects(request(gateway, 'http://test.invalid/', auth, null), /self.signed|certificate/);
  grant.expiresAt = Date.now() - 1;
  assert.equal((await request(gateway, 'http://test.invalid/')).status, 407);
  assert.ok(gateway.stats().rejectedProxyAuthentications >= 3,
    'Gateway must observe the denied proxy authentication attempts');
});

test('CONNECT preserves target HTTPS certificate validation without interception', async t => {
  const target = await server(t, (_req, res) => res.end('HTTPS origin response'), true);
  const { gateway } = await fixture(t);
  const { socket, header } = await tunnel(gateway, target);
  assert.match(header, /200 Connection Established/);
  const secured = tls.connect({ socket, ca: cert.cert, servername: 'localhost' });
  secured.on('error', () => {});
  await once(secured, 'secureConnect');
  assert.equal(secured.authorized, true);
  assert.equal(secured.getPeerCertificate().subject.CN, 'localhost');
  secured.write('GET / HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n');
  const chunks = [];
  for await (const chunk of secured) chunks.push(chunk);
  assert.match(Buffer.concat(chunks).toString(), /HTTPS origin response/);
});

test('revocation closes active tunnel and prevents credential reuse', async t => {
  const echo = net.createServer(s => s.pipe(s)); echo.listen(0, '127.0.0.1'); await once(echo, 'listening');
  t.after(() => new Promise(resolve => echo.close(resolve)));
  const { gateway } = await fixture(t);
  const { socket } = await tunnel(gateway, echo.address().port);
  const ended = once(socket, 'close');
  gateway.revoke('grant');
  await ended;
  const rejectedBefore = gateway.stats().rejectedProxyAuthentications;
  assert.equal((await request(gateway, 'http://test.invalid/')).status, 407);
  assert.ok(gateway.stats().rejectedProxyAuthentications > rejectedBefore,
    'Revoked credentials must reach the gateway and be rejected');
});

test('server connection limit and expiry terminate established tunnels', async t => {
  const echo = net.createServer(s => s.pipe(s)); echo.listen(0, '127.0.0.1'); await once(echo, 'listening');
  t.after(() => new Promise(resolve => echo.close(resolve)));
  const { gateway } = await fixture(t, { maxConnections: 1, expiresAt: Date.now() + 1000 });
  const { socket } = await tunnel(gateway, echo.address().port);
  assert.equal((await request(gateway, 'http://test.invalid/')).status, 429);
  await once(socket, 'close');
  assert.equal((await request(gateway, 'http://test.invalid/')).status, 407);
});

test('quota blocks oversized incoming tunnel chunk before destination receives it', async t => {
  let received = 0;
  const target = net.createServer(s => s.on('data', chunk => { received += chunk.length; }));
  target.listen(0, '127.0.0.1'); await once(target, 'listening');
  t.after(() => new Promise(resolve => target.close(resolve)));
  const { gateway } = await fixture(t, { maxBytes: 1000 });
  const { socket } = await tunnel(gateway, target.address().port);
  const ended = once(socket, 'close');
  socket.write(Buffer.alloc(2000, 65));
  await ended;
  assert.equal(received, 0);
  assert.equal(gateway.usage('grant').exhausted, true);
});

test('production destination rules deny private literals before opening target socket', async t => {
  const gateway = createGateway({ tls: cert, authorize: () => ({ id: 'g', expiresAt: Date.now()+10000, maxBytes: 10000, maxConnections: 2 }) });
  await gateway.listen(); t.after(() => gateway.close());
  const result = await request(gateway, 'http://127.0.0.1/');
  assert.equal(result.status, 403);
});

test('outbound quota stops a large response and rejects further use', async t => {
  const target = await server(t, (_req, res) => res.end(Buffer.alloc(20000, 65)));
  const { gateway } = await fixture(t, { maxBytes: 1000 });
  await assert.rejects(request(gateway, `http://test.invalid:${target}/`));
  assert.equal(gateway.usage('grant').exhausted, true);
  assert.equal((await request(gateway, `http://test.invalid:${target}/`)).status, 403);
});

test('failed durable usage recording fails closed before forwarding', async t => {
  let hits = 0;
  const target = await server(t, (_req, res) => { hits++; res.end('must not forward'); });
  const gateway = createGateway({ tls: cert,
    authorize: () => ({ id: 'g', expiresAt: Date.now()+10000, maxBytes: 10000, maxConnections: 2 }),
    onUsage() { throw new Error('Storage unavailable'); },
    policy: async () => ({ address: '127.0.0.1', family: 4 }),
  });
  await gateway.listen(); t.after(() => gateway.close());
  await assert.rejects(request(gateway, `http://test.invalid:${target}/`));
  assert.equal(hits, 0);
  assert.equal(gateway.usage('g').revoked, true);
});

test('persistent previously consumed quota cannot reset on gateway restart', async t => {
  const gateway = createGateway({ tls: cert,
    authorize: () => ({ id: 'g', expiresAt: Date.now()+10000, maxBytes: 10000, maxConnections: 2, usedBytes: 10000 }),
  });
  await gateway.listen(); t.after(() => gateway.close());
  assert.equal((await request(gateway, 'http://127.0.0.1/')).status, 403);
});


test('revocation releases outbound CONNECT socket when peer remains half open', async t => {
  const peers = new Set();
  const target = net.createServer({ allowHalfOpen: true }, socket => {
    peers.add(socket); socket.on('error', () => {});
    socket.on('close', () => peers.delete(socket));
  });
  target.listen(0, '127.0.0.1'); await once(target, 'listening');
  t.after(() => new Promise(resolve => { for (const peer of peers) peer.destroy(); target.close(resolve); }));
  const { gateway } = await fixture(t);
  const { socket } = await tunnel(gateway, target.address().port);
  const closed = once(socket, 'close');
  gateway.revoke('grant'); await closed;
  // Node does not expose proxy-chain's destination socket. Inspect active local
  // socket handles only in this regression test to catch leaked half-open fds.
  await new Promise(resolve => setImmediate(resolve));
  const outgoing = process._getActiveHandles().filter(handle =>
    handle instanceof net.Socket && handle.remotePort === target.address().port && !handle.destroyed);
  assert.equal(outgoing.length, 0);
});

test('gateway refuses long-lived grants and fails closed at revocation retention bound', async t => {
  const { gateway, grant } = await fixture(t, { expiresAt: Date.now() + 3_700_000 });
  assert.equal((await request(gateway, 'http://test.invalid/')).status, 403);
  grant.expiresAt = Date.now() + 60000;
  for (let i = 0; i <= 4096; i++) gateway.revoke(`unused-${i}`);
  assert.equal((await request(gateway, 'http://test.invalid/')).status, 407);
});
