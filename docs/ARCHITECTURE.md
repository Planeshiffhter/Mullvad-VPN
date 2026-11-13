# Technical architecture (local prototype; not deployed)

## Implemented baseline

`services/control-api` uses TypeScript on Node 24 with built-in SQLite and scrypt password hashing. `services/gateway` integrates established proxy-chain 3.0.3 for HTTP forwarding and HTTPS CONNECT over a native TLS proxy listener. A conservative ipaddr.js policy checks all DNS answers and pins a validated address. The same process authorizes unique grants against SQLite and persists quota accounting; expiry and revocation terminate active source and destination sockets. Only one founder grant is active at once, with four concurrent sockets.

`apps/extension` is original typed MV3 code over official Chrome APIs. No WXT, vendor extension, Better Auth or UI framework code is copied. The browser build strips checked TypeScript to packaged JavaScript; Node directly runs erasable TypeScript. `apps/website` provides the private operations/help UI. `scripts/dev.mjs` binds everything to loopback, while `infrastructure/serve.mjs` is an operator-configured deployment entry point, not a deployed endpoint.

See [REPO_AUDIT.md](REPO_AUDIT.md), [DECISIONS.md](DECISIONS.md) and [VALIDATION.md](VALIDATION.md) for evidence and limits. Control API origin bypass and non-proxied browser traffic remain explicit exclusions; no global kill-switch claim is made.

## Guiding separation

**Control plane** manages identities, approved locations, short-lived grants, account status and health. **Data plane** carries browser traffic through a separately deployed authenticated proxy. Never route traffic through the admin API. The Chrome extension **does not** tunnel all OS traffic.

```text
  Chrome desktop
  +------------------------+
  | MV3 extension (WXT?)   |
  | popup / state / auth   |
  | chrome.proxy API      |
  +-----------+------------+
              | control API over HTTPS
              v
  +------------------------+
  | Control API (Node/TS)  |---- SQLite initially
  | founder auth/grants    |
  | revocation / policy    |
  +-----------+------------+
              | approved gateway settings /
              | scoped connection grants
              v
  +------------------------+      encrypted proxy hop
  | Authenticated US proxy |<------------------- Chrome
  | Linux TLS + firewall   |-------------------> Destination sites
  | egress limits / quotas |
  +------------------------+
```

Actual request routing is browser → proxy → destination; the control-plane diagram is schematic, not a guarantee of particular protocol flow.

## Proposed future monorepo shape

```text
apps/
  extension/             # WXT/Manifest V3, TS; Chrome first
  website/               # Later product/help site
  admin/                 # Later private operations dashboard
services/
  control-api/           # Node/TS API, founder account, grants
packages/
  shared/                # Schemas/types/config validation
infrastructure/
  proxy/                 # Evaluated proxy config and TLS
  deployment/            # Repeatable setup and rollback
tests/
  integration/           # Controlled proxy and browser checks
docs/                    # Architecture, status, ADRs, plans
```

Only create source directories when there is code to put in them.

## Trust boundaries

1. **Untrusted browser/client:** extension code and any stored config are inspectable. Never ship gateway root credentials.
2. **Control API:** authenticate account requests, authorize grants, rate-limit and validate every input.
3. **Gateway:** enforce credential expiry/revocation, destinations, port restrictions, concurrency and quotas **at server side**, not only in UI.
4. **Target websites:** preserve end-to-end HTTPS; no TLS interception or content decryption for filtering.
5. **Operations:** admin API must never be public by default; backups/keys kept outside source control.
6. **External hosting:** region, availability, pricing, billable bandwidth and applicable usage terms must be independently verified.

## Connection lifecycle

Disconnected → Connecting → Connected (verified route) → Reconnecting or Error on failed check, expiry or outage → Disconnected after restoring only settings the extension owns.

The browser proxy API and competing policy/extension settings can prevent exclusive proxy control. Test interactions and report conflicts. Protect against fail-open behavior for precisely the categories of traffic the product promises to cover; browser-global fail-closed behavior may not be possible and must be verified, not assumed.

## Protocol decisions still open

- Exact Chrome-supported proxy scheme and TLS behavior across test environments.
- Gateway implementation: 3proxy or another maintained proxy supporting required TLS/auth/quotas; perform proof-of-concept before committing.
- How revocation of **active** connections is enforced.
- HTTPS control API origin and private founder recovery flow.
- Browser DNS, WebRTC and IPv6 coverage; do not claim native kill-switch behavior.

## Native expansion

System-wide apps require real VPN tunnel integration, OS networking privileges, WireGuard or another reviewed protocol, per-OS protection/kill-switch testing, app signing/distribution and separate threat models. Do **not** simply rename a browser-proxy extension a native VPN.

See [BUILD_VS_REUSE.md](BUILD_VS_REUSE.md) and [DECISIONS.md](DECISIONS.md).
