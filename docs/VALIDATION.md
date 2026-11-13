# Validation report — local prototype, 2026-11-13

## Executed results

Environment: Linux cloud task, Node 24.22.1, npm 11.9.0, installed Chromium, OpenSSL, zip. Run `npm ci --ignore-scripts`, then `npm run check` and `npm run package` from the repository root.

| Check | Result | What it proves |
| --- | --- | --- |
| `npm run typecheck` | Passed | Strict TypeScript control API and extension contracts |
| `npm test` | **57 total: 56 passed, 1 skipped, 0 failed** | See boundaries below; skipped actual MV3 integration remains unverified |
| `npm run build` | Passed | Six packaged MV3 extension assets; no remote executable code |
| `npm run package` | Passed | Deterministic private ZIP, checksum, runtime upstream LICENSE/NOTICE retention |
| `npm audit --json` | Passed: 0 reported advisories | Registry advisory result for locked package tree, not independent security assurance |
| `git diff --check` | Passed | Whitespace validation |
| Development CLI | Passed | Initialization, verified-TLS API/fixture requests, SIGTERM shutdown, no secret output |

Package: `dist/private-route-extension-0.1.0.zip`; SHA-256 `076387f8b6e6d8ec57c9aeac6e6782664625837be8a4b5ce14cb5878f8c93bc6`. Rebuild with `npm run package`; compare the generated `.sha256` file. Generated artifacts stay ignored rather than being committed. No services are intentionally left running.

## Test scope

- **Control API (2):** founder/password/session/grant behavior, database persistence and recovery, real trusted TLS, unauthorized requests, origin rules, input/body/rate limits.
- **Development integration (4):** idempotent initialization, private permissions, TLS trust enforcement, no default gateway, restart, explicit LOCAL fixture over authenticated TLS CONNECT, persisted usage, restored API after owner password recovery invalidates old authorization.
- **Extension lifecycle/security (20):** exact proxy auth matching/retry boundaries, proxy and WebRTC ownership, grant rejection/expiry, route mismatch/outage, restart recovery, expiry or changed settings during verification, JSON logout contract. These use Chrome API fakes and controlled verifier responses; they are not browser-network certification.
- **Extension browser checks (2):** actual MV3 worker load is **skipped** because installed Chromium enforces `ExtensionInstallBlocklist: ["*"]` in `/etc/chromium/policies/managed/extensions.json`. Real Chromium popup DOM/UI test **passes with a simulated runtime**. Managed policy is preserved; no TLS verification bypass is used.
- **Gateway (13):** actual HTTP response and target TLS over CONNECT, required trusted proxy TLS, credential stripping, auth rejection, pinned DNS/private IPv4/IPv6/metadata/port denial, active expiry/revoke, concurrency, incoming/outgoing quota enforcement, persistent usage failure and restart, half-open upstream socket cleanup, bounded retention.
- **Cross-component integration (2):** actual TLS API issues a grant that forwards a controlled origin through the real gateway; traffic persists to SQLite, API revocation denies reuse, encrypted restore retains account/usage/revocation. Extension controller logout invalidates an actual TLS API session.
- **Encrypted backup (6):** online WAL-safe SQLite snapshot, private permissions, deterministic refusal to overwrite without explicit force, wrong password, tampering, truncation, sidecars, symlinks and invalid inputs.
- **Packaging (1):** identical ZIP bytes for identical inputs, notice retention and explicit asset allowlist excludes secrets.
- **Retention/rate limits (3):** schema migration preserves usage before pruning, atomic rollback on failed accounting, cumulative quota through restart, truthful grant states and bounded mutation rate.
- **Configured runtime (2):** owner configuration validation, private management and external secret paths, real TLS startup/stop/restart and unauthorized admin rejection.
- **Founder authorization (1):** separate founder dashboard session revokes extension session's grant; invalid bearer cannot.
- **Operations UI (1):** real Chromium login/error/status/revoke/logout, XSS-safe rendering, password clearing and no persisted token. Uses a loopback HTTP UI fixture; real API TLS/business logic is covered separately.

Tests generate local certificates/credentials and inject narrow loopback destination policies for controlled targets. They do not use or claim a public US route. Certificate and package verification stay enabled.

## Findings corrected during review

Revocation now destroys both source and outbound CONNECT sockets, including half-open peers. Both clients send valid JSON logout requests so server sessions actually invalidate. Founder authorization now allows the dashboard to revoke the same founder's separate extension session. Route verification rechecks expiry/ownership after the request. Cumulative quota survives grant pruning; grant/revocation caches and mutation rates are bounded. Restoring older backups requires account recovery before startup so historical authorization cannot silently revive.

## Release checks not executed

No authorized US account/host, provider terms/billing preflight, public DNS/TLS renewal, host firewall installation, public route verifier or observed US exit exists. No owner Chrome installation, real extension auth challenge/Connect/Disconnect route behavior, DNS/WebRTC/IPv6 leak certification, sleep/wake, real network switch, off-host recovery, production rollback or observation-period billing reconciliation has passed. Store/public signup, payments, extra countries and native full-device VPN clients remain deferred.

Application counters exclude TLS/IP/provider overhead and are not billing caps. A configured single HTTPS proxy and unchanged failure routing do not prove a browser-global or OS kill switch. See [TASKS.md](../TASKS.md), [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md), [REPO_AUDIT.md](REPO_AUDIT.md) and [COST_POLICY.md](COST_POLICY.md).
