import { readFileSync, realpathSync, existsSync, lstatSync } from 'node:fs';
import { isAbsolute, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Store } from '../services/control-api/store.ts';
import { createControlApi } from '../services/control-api/server.ts';
import { createGateway } from '../services/gateway/index.js';
import { validateGateway } from '../apps/extension/core.ts';

const checkout = realpathSync(fileURLToPath(new URL('..', import.meta.url)));
function externalFile(path) {
  if (typeof path !== 'string' || !isAbsolute(path)) throw new Error('Runtime files require absolute paths outside checkout');
  const parent = realpathSync(dirname(path));
  const actual = resolve(parent, path.split('/').at(-1));
  if (existsSync(actual) && lstatSync(actual).isSymbolicLink()) throw new Error('Runtime file symlinks are forbidden');
  const rel = relative(checkout, actual);
  if (!(rel === '..' || rel.startsWith('../')) || isAbsolute(rel)) throw new Error('Runtime secrets and database must remain outside checkout');
  return actual;
}
function listener(input, management = false) {
  if (!input || typeof input.host !== 'string' || !Number.isInteger(input.port)
    || input.port < 1024 || input.port > 65535) throw new Error('Use an explicit unprivileged listener port');
  if (management && !['127.0.0.1', '::1'].includes(input.host)) throw new Error('Management must bind loopback');
  return { host: input.host, port: input.port };
}

export function validateConfig(input) {
  if (!input || typeof input !== 'object') throw new Error('Configuration object required');
  const management = listener(input.management, true), proxy = listener(input.proxy);
  if (management.port === proxy.port) throw new Error('Separate management and proxy ports are required');
  const origin = new URL(input.apiOrigin);
  if (origin.protocol !== 'https:' || origin.username || origin.password || origin.pathname !== '/' || origin.search || origin.hash)
    throw new Error('HTTPS API origin required');
  const gateway = validateGateway(input.gateway, origin.origin);
  if (gateway.port !== proxy.port) throw new Error('Advertised gateway port must match listener');
  if (gateway.live && !['authorized', 'zeroAdditionalCostVerified', 'providerPermitsProxy', 'usRegionVerified']
    .every(name => input.preflight?.[name] === true)) throw new Error('Live gateway requires completed owner preflight attestations');
  const allowedOrigins = input.extensionOrigins ?? [];
  if (!Array.isArray(allowedOrigins) || allowedOrigins.length > 10 || allowedOrigins.some(value =>
    typeof value !== 'string' || !/^chrome-extension:\/\/[a-p]{32}$/.test(value))) throw new Error('Exact extension origins required');
  return { management, proxy, gateway, allowedOrigins,
    database: externalFile(input.database),
    tls: { key: externalFile(input.tls?.key), cert: externalFile(input.tls?.cert) } };
}

export async function start(config) {
  const tls = { key: readFileSync(config.tls.key), cert: readFileSync(config.tls.cert) };
  const store = new Store(config.database);
  if (!store.status().account) { store.close(); throw new Error('Create founder account before starting services'); }
  const gateway = createGateway({ tls, authorize: (u, p) => store.authorize(u, p),
    onUsage: (id, bytes) => store.addUsage(id, bytes), ...config.proxy });
  const api = createControlApi({ tls, store, gateways: [config.gateway],
    revoke: id => gateway.revoke(id), allowedOrigins: config.allowedOrigins, ...config.management });
  try { await gateway.listen(); await api.listen(); }
  catch (error) { await Promise.allSettled([gateway.close(), api.close()]); store.close(); throw error; }
  let closing = false;
  return { async close() {
    if (closing) return; closing = true;
    await Promise.all([api.close(), gateway.close()]); store.close();
  } };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let runtime;
  try {
    if (!process.env.PROXY_CONFIG) throw new Error('Set PROXY_CONFIG to an absolute external configuration path');
    const configPath = externalFile(process.env.PROXY_CONFIG);
    const config = validateConfig(JSON.parse(readFileSync(configPath, 'utf8')));
    runtime = await start(config);
    console.log('Configured proxy and loopback management listeners started. Live deployment acceptance remains required.');
    for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => { await runtime.close(); process.exitCode = 0; });
  } catch (error) {
    console.error(`Service startup failed: ${error.message}`); process.exitCode = 1;
  }
}
