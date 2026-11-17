import https from 'node:https';
import { randomBytes } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { chmod, lstat, mkdir, mkdtemp, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store } from '../../services/control-api/store.ts';
import { createControlApi } from '../../services/control-api/server.ts';
import { createGateway } from '../../services/gateway/index.js';
import { createDestinationPolicy } from '../../services/gateway/policy.js';

const execFile = promisify(execFileCallback);
const defaultDirectory = fileURLToPath(new URL('../../.local/', import.meta.url));

async function exists(path) {
  try { return await lstat(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function readJson(path) { return JSON.parse(await readFile(path, 'utf8')); }

/** Local-only development state; safe to repeat without resetting the founder account. */
export async function initDevelopment({ stateDir = defaultDirectory, founderPassword = process.env.FOUNDER_PASSWORD } = {}) {
  stateDir = resolve(stateDir);
  const info = await exists(stateDir);
  if (info?.isSymbolicLink() || (info && !info.isDirectory())) throw new Error('State directory must be a real directory');
  await mkdir(stateDir, { recursive: true, mode: 0o700 });
  await chmod(stateDir, 0o700);
  const paths = { key: join(stateDir, 'localhost.key'), cert: join(stateDir, 'localhost.pem'),
    config: join(stateDir, 'config.json'), credentials: join(stateDir, 'credentials.json'), database: join(stateDir, 'control.sqlite') };
  for (const path of Object.values(paths)) if ((await exists(path))?.isSymbolicLink()) throw new Error('State file symbolic links are forbidden');
  const haveKey = Boolean(await exists(paths.key)), haveCert = Boolean(await exists(paths.cert));
  if (haveKey !== haveCert) throw new Error('Incomplete local TLS identity: preserve or remove both local certificate/key files before retrying');
  if (!haveKey) {
    const temp = await mkdtemp(join(stateDir, '.tls-'));
    try {
      await execFile('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-noenc', '-days', '30',
        '-keyout', join(temp, 'localhost.key'), '-out', join(temp, 'localhost.pem'), '-subj', '/CN=localhost',
        '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1', '-addext', 'basicConstraints=critical,CA:TRUE'], { timeout: 30000 });
      await chmod(join(temp, 'localhost.key'), 0o600);
      await chmod(join(temp, 'localhost.pem'), 0o600);
      await rename(join(temp, 'localhost.key'), paths.key);
      await rename(join(temp, 'localhost.pem'), paths.cert);
    } finally { await rm(temp, { recursive: true, force: true }); }
  }
  if (!await exists(paths.config)) await writeFile(paths.config, JSON.stringify({ apiPort: 9443, gatewayPort: 9444, fixturePort: 9445, extensionOrigins: [] }, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
  const store = new Store(paths.database);
  try {
    if (!store.status().account) {
      const previous = await exists(paths.credentials) ? await readJson(paths.credentials) : null;
      if (previous && (previous.username !== 'founder' || typeof previous.password !== 'string' || (founderPassword && founderPassword !== previous.password))) throw new Error('Existing local credentials conflict with initialization');
      const password = founderPassword || previous?.password || randomBytes(32).toString('base64url');
      // Store validates password before plaintext local test credentials are written.
      store.createAccount('founder', password);
      try { await writeFile(paths.credentials, JSON.stringify({ username: 'founder', password }, null, 2) + '\n', { flag: 'wx', mode: 0o600 }); }
      catch (error) { if (error.code !== 'EEXIST') throw error; }
    }
  } finally { store.close(); }
  for (const path of [paths.key, paths.cert, paths.config, paths.database]) await chmod(path, 0o600);
  if (await exists(paths.credentials)) await chmod(paths.credentials, 0o600);
  return { stateDir, ...paths };
}

function validateConfig(config) {
  for (const name of ['apiPort', 'gatewayPort', 'fixturePort']) {
    if (!Number.isInteger(config[name]) || config[name] < 0 || config[name] > 65535) throw new Error(`Invalid ${name}`);
  }
  if (new Set([config.apiPort, config.gatewayPort, config.fixturePort].filter(Boolean)).size !== [config.apiPort, config.gatewayPort, config.fixturePort].filter(Boolean).length) throw new Error('Development ports must differ');
  if (!Array.isArray(config.extensionOrigins) || config.extensionOrigins.some((origin) => !/^chrome-extension:\/\/[a-p]{32}$/.test(origin))) throw new Error('extensionOrigins must contain exact Chrome extension origins');
}

/** Starts only loopback services. Fixture mode is explicit and never a US-route claim. */
export async function startDevelopment({ stateDir = defaultDirectory, fixture = false } = {}) {
  stateDir = resolve(stateDir);
  const config = await readJson(join(stateDir, 'config.json'));
  validateConfig(config);
  const tls = { key: await readFile(join(stateDir, 'localhost.key')), cert: await readFile(join(stateDir, 'localhost.pem')) };
  const store = new Store(join(stateDir, 'control.sqlite'));
  let fixtureServer, gateway, api;
  let closing;
  const close = () => closing ||= (async () => {
    if (api) await api.close();
    if (gateway) await gateway.close();
    if (fixtureServer) await new Promise((resolve) => { fixtureServer.close(resolve); fixtureServer.closeAllConnections(); });
    store.close();
  })();
  try {
    let fixtureAddress;
    if (fixture) {
      fixtureServer = https.createServer({ ...tls, minVersion: 'TLSv1.2' }, (req, res) => {
        res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'GET' || req.url !== '/ip') { res.writeHead(404); return res.end(JSON.stringify({ error: 'Not found' })); }
        res.end(JSON.stringify({ ip: '127.0.0.1', fixture: true }));
      });
      await new Promise((resolve, reject) => { fixtureServer.once('error', reject); fixtureServer.listen(config.fixturePort, '127.0.0.1', () => { fixtureServer.off('error', reject); resolve(); }); });
      fixtureAddress = fixtureServer.address();
    }
    const productionPolicy = createDestinationPolicy();
    const policy = fixture ? async (host, port, isHttp) => {
      if (!isHttp && host === 'localhost' && port === fixtureAddress.port) return { address: '127.0.0.1', family: 4 };
      return productionPolicy(host, port, isHttp);
    } : productionPolicy;
    gateway = createGateway({ tls, host: '127.0.0.1', port: config.gatewayPort, authorize: (username, password) => store.authorize(username, password), onUsage: (id, bytes) => store.addUsage(id, bytes), policy });
    const gatewayAddress = await gateway.listen();
    const gateways = fixture ? [{ id: 'fixture', name: 'Local fixture (not US)', country: 'LOCAL', host: 'localhost', port: gatewayAddress.port,
      scheme: 'https', verificationUrl: `https://localhost:${fixtureAddress.port}/ip`, expectedIp: '127.0.0.1', live: false }] : [];
    api = createControlApi({ tls, store, gateways, revoke: (id) => gateway.revoke(id), allowedOrigins: config.extensionOrigins, host: '127.0.0.1', port: config.apiPort });
    const apiAddress = await api.listen();
    return { apiAddress, gatewayAddress, fixtureAddress, gateways, close };
  } catch (error) { await close(); throw error; }
}

async function main() {
  const [command, ...flags] = process.argv.slice(2);
  if (!['init', 'start'].includes(command) || flags.some((flag) => flag !== '--fixture') || (command === 'init' && flags.length) || flags.length > 1) throw new Error('Usage: node scripts/development/dev.mjs init | start [--fixture]');
  if (command === 'init') {
    await initDevelopment();
    console.log('Private local development state initialized in .local. Credentials were not printed. See scripts/README.md.');
    return;
  }
  const running = await startDevelopment({ fixture: flags.includes('--fixture') });
  console.log(`Local TLS API listening on port ${running.apiAddress.port}; local TLS gateway on port ${running.gatewayAddress.port}.`);
  console.log(running.fixtureAddress ? 'Explicit local fixture enabled. This is not a US exit or production VPN.' : 'No gateway is advertised. Live US hosting remains unconfigured.');
  console.log('Trust .local/localhost.pem only for local development; certificate verification remains enabled. Press Ctrl+C to stop.');
  let stopped = false;
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
    if (stopped) return; stopped = true;
    running.close().catch(() => { console.error('Local shutdown failed'); process.exitCode = 1; });
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(() => {
  console.error('Local development command failed. Check initialization, private configuration, TLS files and available ports. No credentials were printed.'); process.exitCode = 1;
});
