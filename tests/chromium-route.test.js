import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import {execFileSync, spawnSync} from 'node:child_process';
import {once} from 'node:events';
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {chromium} from '@playwright/test';
import {Store} from '../services/control-api/store.ts';
import {createControlApi} from '../services/control-api/server.ts';
import {createGateway} from '../services/gateway/index.js';
import {createTlsFixture} from './helpers/tls.js';

test('real Chromium connects via authenticated TLS proxy, forwards HTTP and HTTPS, and disconnects', {timeout: 90000}, async t => {
  // The existing managed-environment guard is intentionally retained. Never
  // remove enterprise policy or disable certificate verification for this test.
  if (!process.env.CHROMIUM_PATH) {
    const policy = await readFile('/etc/chromium/policies/managed/extensions.json', 'utf8').then(JSON.parse).catch(() => null);
    if (policy?.ExtensionInstallBlocklist?.includes('*')) {
      t.skip('Managed Chromium forbids unpacked extensions; test on an authorized browser runner.');
      return;
    }
  }
  if (spawnSync('certutil', ['-H'], {stdio: 'ignore'}).error?.code === 'ENOENT') {
    t.skip('NSS certutil is required to trust the isolated local TLS fixture (install libnss3-tools).');
    return;
  }

  execFileSync(process.execPath, ['apps/extension/build.js', 'chromium-route']);
  const extension = path.resolve('dist/extension-chromium-route');
  const dir = await mkdtemp(path.join(tmpdir(), 'private-route-real-browser-'));
  const tls = await createTlsFixture();
  let context, api, gateway, httpsTarget, httpTarget, store;
  t.after(async () => {
    if (context) await context.close();
    if (api) await api.close();
    if (gateway) await gateway.close();
    for (const server of [httpsTarget, httpTarget]) {
      if (server?.listening) {
        server.closeAllConnections();
        await new Promise(resolve => server.close(resolve));
      }
    }
    if (store) store.close();
    await tls.cleanup();
    await rm(dir, {recursive: true, force: true});
  });

  // Chromium on Linux uses the NSS shared DB. Import only this ephemeral
  // self-signed localhost certificate into a dedicated test HOME. Both NSS
  // locations are initialized for Chromium versions before and after M146.
  const home = path.join(dir, 'home');
  const cert = path.join(dir, 'localhost-cert.pem');
  await writeFile(cert, tls.cert);
  for (const subdir of ['.pki/nssdb', '.local/share/pki/nssdb']) {
    const db = path.join(home, subdir);
    await mkdir(db, {recursive: true});
    execFileSync('certutil', ['-N', '-d', 'sql:' + db, '--empty-password'], {stdio: 'ignore'});
    execFileSync('certutil', ['-A', '-d', 'sql:' + db, '-n', 'Private Route test localhost only',
      '-t', 'P,,', '-i', cert], {stdio: 'ignore'});
  }

  httpsTarget = https.createServer({key: tls.key, cert: tls.cert}, (req, res) => {
    res.setHeader('Content-Type', req.url === '/ip' ? 'application/json' : 'text/plain');
    if (req.url === '/ip') return res.end(JSON.stringify({ip: '127.0.0.1', fixture: true}));
    if (req.url === '/content') return res.end('controlled-https-through-authenticated-proxy');
    res.writeHead(404).end('Not found');
  });
  httpsTarget.listen(0, '127.0.0.1');
  await once(httpsTarget, 'listening');
  httpTarget = http.createServer((req, res) => {
    if (req.url === '/content') return res.end('controlled-http-through-authenticated-proxy');
    res.writeHead(404).end('Not found');
  });
  httpTarget.listen(0, '127.0.0.1');
  await once(httpTarget, 'listening');

  const httpsPort = httpsTarget.address().port;
  const httpPort = httpTarget.address().port;
  store = new Store(path.join(dir, 'test.sqlite'));
  store.createAccount('founder', 'ephemeral-browser-test-credential');
  gateway = createGateway({
    tls, authorize: (u, p) => store.authorize(u, p),
    onUsage: (id, bytes) => store.addUsage(id, bytes),
    // Test-only dependency injection: never modify or bypass production policy.
    policy: async (host, port, isHttp) => {
      if (host !== 'localhost' ||
          !((isHttp && port === httpPort) || (!isHttp && port === httpsPort))) {
        throw new Error('Fixture destination denied');
      }
      return {address: '127.0.0.1', family: 4};
    },
  });
  const gatewayPort = (await gateway.listen()).port;

  // The worker ID determines the exact allowed extension origin for the API.
  // No wildcard CORS, public listener, or mocked chrome.runtime is used.
  context = await chromium.launchPersistentContext(path.join(dir, 'chrome-profile'), {
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-extensions-except=' + extension, '--load-extension=' + extension],
    env: {...process.env, HOME: home, XDG_DATA_HOME: path.join(home, '.local/share')},
  });
  const worker = context.serviceWorkers()[0] || await context.waitForEvent('serviceworker', {timeout: 15000});
  const extensionId = new URL(worker.url()).host;
  const gatewayDescription = {
    id: 'fixture', name: 'Local browser integration fixture', country: 'LOCAL',
    host: '127.0.0.1', port: gatewayPort, scheme: 'https',
    verificationUrl: 'https://localhost:' + httpsPort + '/ip',
    expectedIp: '127.0.0.1', live: false,
  };
  api = createControlApi({
    tls, store, gateways: [gatewayDescription],
    revoke: id => gateway.revoke(id),
    allowedOrigins: ['chrome-extension://' + extensionId],
  });
  const apiPort = (await api.listen()).port;

  const apiProbe = await worker.evaluate(async url => {
    try {
      const response = await fetch(url, {cache: 'no-store'});
      return {status: response.status, body: (await response.text()).slice(0, 100)};
    } catch (error) { return {error: String(error)}; }
  }, 'https://localhost:' + apiPort + '/healthz');
  assert.equal(apiProbe.status, 200, 'Chromium HTTPS/API access failed: ' + JSON.stringify(apiProbe));

  const page = await context.newPage();
  await page.goto('chrome-extension://' + extensionId + '/popup.html');
  await page.locator('#message').filter({hasText: 'No browser proxy is active.'}).waitFor();
  assert.equal(await page.locator('#status').textContent(), 'Disconnected');

  const privacyBefore = await worker.evaluate(async () =>
    (await chrome.privacy.network.webRTCIPHandlingPolicy.get({})).value);
  await page.locator('#origin').fill('https://localhost:' + apiPort);
  await page.locator('#username').fill('founder');
  await page.locator('#password').fill('ephemeral-browser-test-credential');
  await page.getByRole('button', {name: 'Sign in securely'}).click();
  await page.waitForFunction(() => !document.querySelector('#controls').hidden ||
    !document.querySelector('#error').hidden, null, {timeout: 15000});
  assert.equal(await page.locator('#error').isVisible(), false,
    'Real browser sign-in failed: ' + (await page.locator('#error').textContent()));
  assert.equal(await page.locator('#gateways option').count(), 1);

  await page.getByRole('button', {name: 'Connect browser'}).click();
  await page.locator('#status').filter({hasText: 'Fixture verified'}).waitFor({timeout: 20000});
  assert.match(await page.locator('#message').textContent(), /not a live US connection/);
  const connected = await worker.evaluate(async () => {
    const routing = await chrome.proxy.settings.get({incognito: false});
    const session = (await chrome.storage.session.get('session')).session;
    return {control: routing.levelOfControl, mode: routing.value.mode,
      grantId: session.active?.id, status: session.state.status};
  });
  assert.equal(connected.control, 'controlled_by_this_extension');
  assert.equal(connected.mode, 'fixed_servers');
  assert.equal(connected.status, 'fixture');
  assert.ok(connected.grantId);

  // These are real Chromium navigations through its configured TLS proxy,
  // not simulated extension messages or Node.js requests using credentials.
  const beforeHttp = gateway.usage(connected.grantId)?.bytes ?? 0;
  await page.goto('http://localhost:' + httpPort + '/content');
  assert.match(await page.locator('body').textContent(), /controlled-http-through-authenticated-proxy/);
  const afterHttp = gateway.usage(connected.grantId)?.bytes ?? 0;
  assert.ok(afterHttp > beforeHttp, 'Actual HTTP navigation must cross the gateway');
  await page.goto('https://localhost:' + httpsPort + '/content');
  assert.match(await page.locator('body').textContent(), /controlled-https-through-authenticated-proxy/);
  assert.ok((gateway.usage(connected.grantId)?.bytes ?? 0) > afterHttp,
    'Actual HTTPS CONNECT navigation must cross the gateway');

  await page.goto('chrome-extension://' + extensionId + '/popup.html');
  await page.getByRole('button', {name: 'Disconnect & restore routing'}).click();
  await page.locator('#status').filter({hasText: 'Disconnected'}).waitFor({timeout: 15000});
  const disconnected = await worker.evaluate(async () => ({
    proxy: await chrome.proxy.settings.get({incognito: false}),
    privacy: await chrome.privacy.network.webRTCIPHandlingPolicy.get({}),
    session: (await chrome.storage.session.get('session')).session,
  }));
  assert.equal(disconnected.proxy.levelOfControl, 'controllable_by_this_extension');
  assert.equal(disconnected.privacy.value, privacyBefore);
  assert.equal(disconnected.session.active, null);
  assert.equal(disconnected.session.state.status, 'disconnected');
  assert.equal(gateway.usage(connected.grantId)?.revoked, true,
    'Disconnect must revoke the grant at the gateway');
});
