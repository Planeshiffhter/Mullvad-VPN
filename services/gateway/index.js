import { Server, RequestError } from 'proxy-chain';
import { createDestinationPolicy } from './policy.js';

/** TLS-only forward proxy backed by proxy-chain; no website TLS interception. */
export function createGateway({
  tls, authorize, onUsage = () => {}, policy = createDestinationPolicy(),
  host = '127.0.0.1', port = 0, maxSockets = 64,
}) {
  if (!tls?.key || !tls?.cert || typeof authorize !== 'function') {
    throw new Error('TLS key/certificate and grant authorization are required');
  }
  const grants = new Map();
  const revoked = new Map();
  const maxLifetime = 60 * 60 * 1000;
  const maxRetainedGrants = 4096;
  let overloaded = false;
  // In-memory aggregate only: never retain rejected credentials or target URLs.
  let rejectedProxyAuthentications = 0;
  function sweep() {
    const now = Date.now();
    for (const [id, state] of grants) {
      if (state.expiresAt <= now && state.sockets.size === 0) grants.delete(id);
    }
    for (const [id, expiresAt] of revoked) if (expiresAt <= now) revoked.delete(id);
  }
  const sockets = new Map();
  const rawSockets = new Set();
  let proxy;
  function terminate(state) {
    // An error also invokes proxy-chain's source error handler, which destroys
    // its outbound CONNECT socket. A clean close only half-closes that socket
    // and a hostile allowHalfOpen destination could retain the local resource.
    for (const socket of state.sockets) socket.destroy(new Error('Connection grant ended'));
  }
  function charge(state, count, incoming = false) {
    if (!Number.isSafeInteger(count) || count < 0) return false;
    const overQuota = state.bytes + count > state.maxBytes;
    const blocked = state.revoked || state.expiresAt <= Date.now() || overQuota;
    // Received bytes count even when the offending chunk is discarded. An
    // oversized outbound write exhausts the remaining quota durably so restart
    // cannot restore that grant. This is conservative quota accounting, not a
    // provider billing meter; kernel/TLS overhead is outside this counter.
    const debit = incoming || !blocked ? count
      : overQuota ? Math.max(0, state.maxBytes - state.bytes) : 0;
    if (debit > 0) {
      try { onUsage(state.id, debit); } catch {
        state.revoked = true;
        terminate(state);
        return false;
      }
      state.bytes += debit;
    }
    if (blocked) {
      state.exhausted = state.exhausted || overQuota || state.bytes >= state.maxBytes;
      terminate(state);
      return false;
    }
    return true;
  }
  proxy = new Server({
    host, port, serverType: 'https',
    httpsOptions: { ...tls, minVersion: 'TLSv1.2' },
    authRealm: 'Private browser proxy', verbose: false,
    async prepareRequestFunction({ request, username, password, hostname, port: targetPort, isHttp }) {
      const grant = username && password ? await authorize(username, password) : null;
      if (overloaded || !grant || revoked.has(grant.id) || grant.expiresAt <= Date.now()) {
        rejectedProxyAuthentications++;
        return { requestAuthentication: true, failMsg: 'Valid connection grant required' };
      }
      if (typeof grant.id !== 'string' || grant.id.length > 128 || !Number.isSafeInteger(grant.maxBytes) || grant.maxBytes <= 0
        || !Number.isSafeInteger(grant.maxConnections) || grant.maxConnections < 1
        || !Number.isSafeInteger(grant.expiresAt) || grant.expiresAt > Date.now() + maxLifetime) throw new RequestError('Invalid grant', 403);
      let state = grants.get(grant.id);
      if (!state) {
        sweep();
        if (grants.size >= maxRetainedGrants) throw new RequestError('Gateway grant capacity reached', 503);
        const used = grant.usedBytes ?? 0;
        if (!Number.isSafeInteger(used) || used < 0) throw new RequestError('Invalid usage', 403);
        state = { id: grant.id, bytes: used, maxBytes: grant.maxBytes,
          expiresAt: grant.expiresAt, sockets: new Set(), revoked: false, exhausted: false };
        grants.set(grant.id, state);
      }
      if (state.revoked || state.exhausted || state.bytes >= state.maxBytes || state.expiresAt <= Date.now()) {
        throw new RequestError('Connection grant unavailable', 403);
      }
      const socket = request.socket;
      const previous = sockets.get(socket);
      if (previous && previous !== state) throw new RequestError('Grant change on connection denied', 403);
      if (!previous) {
        if (state.sockets.size >= grant.maxConnections) throw new RequestError('Connection limit reached', 429);
        sockets.set(socket, state);
        state.sockets.add(socket);
        const timer = setTimeout(() => { state.revoked = true; terminate(state); },
          Math.max(1, Math.min(state.expiresAt - Date.now(), 2147483647)));
        timer.unref();
        socket.once('close', () => { clearTimeout(timer); state.sockets.delete(socket); sockets.delete(socket); });
        // Meter before Node's parser and proxy-chain's pipe consumers receive
        // each chunk; a rejected chunk never reaches an outbound target socket.
        const emit = socket.emit;
        socket.emit = function(event, ...args) {
          if (event === 'data' && !charge(state, args[0].length, true)) return false;
          return emit.call(this, event, ...args);
        };
        const write = socket.write;
        socket.write = function(chunk, encoding, callback) {
          const size = Buffer.isBuffer(chunk) || ArrayBuffer.isView(chunk)
            ? chunk.byteLength : Buffer.byteLength(chunk, typeof encoding === 'string' ? encoding : undefined);
          if (!charge(state, size)) return false;
          return write.call(this, chunk, encoding, callback);
        };
        if (!charge(state, socket.bytesRead, true)) throw new RequestError('Traffic quota exhausted', 403);
      }
      let answer;
      try { answer = await policy(hostname, targetPort, isHttp); }
      catch { throw new RequestError('Destination denied', 403); }
      // Authorization may have changed while the resolver was awaiting DNS.
      const rechecked = await authorize(username, password);
      if (!rechecked || rechecked.id !== grant.id || revoked.has(grant.id)
        || state.revoked || state.exhausted || state.expiresAt <= Date.now() || socket.destroyed) {
        throw new RequestError('Connection grant unavailable', 403);
      }
      if (!answer || ![4, 6].includes(answer.family)) throw new RequestError('Destination denied', 403);
      return {
        dnsLookup: (_host, options, callback) => {
          if (typeof options === 'function') { callback = options; options = {}; }
          queueMicrotask(() => options?.all
            ? callback(null, [{ address: answer.address, family: answer.family }])
            : callback(null, answer.address, answer.family));
        },
        // No cross-request pooled sockets can bypass the current destination check.
        httpAgent: false, httpsAgent: false,
      };
    },
  });
  // Bound unauthenticated handshakes, idle connections, header/body stalls.
  proxy.server.maxConnections = maxSockets;
  proxy.server.headersTimeout = 10_000;
  proxy.server.requestTimeout = 30_000;
  proxy.server.setTimeout(30_000);
  proxy.server.on('secureConnection', socket => {
    socket.prependListener('timeout', () => socket.destroy(new Error('Proxy connection idle timeout')));
  });
  proxy.server.on('connection', (socket) => {
    rawSockets.add(socket);
    socket.once('close', () => rawSockets.delete(socket));
    socket.setTimeout(30_000, () => socket.destroy());
  });
  const sweepTimer = setInterval(sweep, 60_000);
  sweepTimer.unref();
  return {
    async listen() { await proxy.listen(); return proxy.server.address(); },
    async close() {
      clearInterval(sweepTimer);
      for (const state of grants.values()) terminate(state);
      for (const socket of rawSockets) socket.destroy();
      await proxy.close(true);
    },
    revoke(id) {
      if (typeof id !== 'string' || id.length > 128) return;
      sweep();
      const state = grants.get(id);
      if (!revoked.has(id) && revoked.size >= maxRetainedGrants) {
        // Durable authorization is authoritative after restart. Until then, a
        // full deny-list must reject all grants rather than forget revocations.
        overloaded = true;
        for (const retained of grants.values()) terminate(retained);
      } else revoked.set(id, state?.expiresAt ?? Date.now() + maxLifetime);
      if (state) { state.revoked = true; terminate(state); }
    },
    usage(id) {
      const state = grants.get(id);
      return state ? { bytes: state.bytes, connections: state.sockets.size,
        revoked: state.revoked, exhausted: state.exhausted } : null;
    },
    stats() { return { rejectedProxyAuthentications }; },
    address() { return proxy.server.address(); },
  };
}
