# Validation report — private proxy prototype (latest verified 2026-11-15)

## Task 15 proposal — revoked grant must not fall back directly (new PR, results pending)

**Implemented (not yet certified):** `tests/chromium-route.test.js` adds an authenticated founder control-API DELETE for the live test grant, verifies gateway-side revocation and rejection, attempts a brand-new HTTP destination URL in real Chromium, asserts the destination receives **zero** requests, and checks Chrome's proxy and WebRTC settings remain extension-owned until explicit Disconnect. The existing real HTTP and HTTPS CONNECT metering evidence remains intact. `services/gateway/index.js` exposes an aggregate in-memory denied-authentication count; no browsing URLs, username, password or secret material are logged. A gateway unit assertion covers rejected credentials. The CI workflow now validates PRs targeting the implementation branch as well as main.

**Automatic verification:** not yet run for this new change; run `npm ci --ignore-scripts`, `npm run typecheck`, `node --test --test-timeout=30000 tests/gateway.test.js tests/extension.test.js`, `node --test --test-timeout=30000 tests/chromium-route.test.js`, `npm run check`, `npm run package` and `git diff --check`. The known prior implementation head `8eeb33e` passed [CI 43651339909](https://github.com/rejoansardar23/vpn/actions/runs/43651339909); this is **not** evidence of the new change. **Manual verification:** none on owner Chrome. **Controlled fixture:** localhost TLS trust only in isolated NSS profile; never a US exit. **Blocked/deferred:** real gateway outage, service-worker suspension/restart, DNS/WebRTC/IPv6 leaks and public release acceptance. Passing this one proxy route test cannot prove a universal browser kill switch.

---

## 2026-11-15 — independently verified real Chromium proxy integration

**Source commit:** [`f0535cb`](https://github.com/rejoansardar23/vpn/commit/f0535cb43eb769e2cd7805a3bfd3d41e73f405e9). **Successful CI:** [run 43651036666](https://github.com/rejoansardar23/vpn/actions/runs/43651036666), job 132619327998 (Ubuntu 24.04, pinned Node 24.22.1, Playwright Chromium 158).

**Checks passed:** `npm ci --ignore-scripts`, `npm run typecheck`, `npm test` (**59 passed / 0 failed / 0 skipped**), `npm run build`, `npm run package`, SHA-256 checksum check, ZIP integrity, `npm audit` (0 reported vulnerabilities), whitespace check, and pinned Gitleaks history scan.

**New concrete evidence:** the actual unpacked Chrome MV3 popup/worker authenticated to the local HTTPS control API, obtained a short-lived proxy grant and configured Chrome's TLS proxy. Controlled Chromium HTTP and HTTPS CONNECT navigations passed **through the real gateway**, with usage increasing after each navigation. Disconnect restored Chrome proxy and WebRTC privacy settings, cleared the active grant and revoked it server-side. The popup explicitly displayed **Fixture verified**, not a live US connection. This goes beyond the separate existing simulated-runtime popup test.

**Application bug discovered and fixed:** the worker's default `fetch` had been invoked without a `WorkerGlobalScope` receiver and threw `Illegal invocation` on real sign-in. `RouteController` now binds default fetch to `globalThis`, with a unit regression test. An isolated extension build suffix prevents test workers from overwriting one another.

**Testing safety:** ephemeral localhost certificate trust is imported with NSS `certutil` only into a disposable Chromium HOME; no TLS-verification override, public listener or managed browser-policy bypass. A *test-only* injected policy permits exactly two local fixture destinations; the real production destination policy remains unchanged. No runtime dependency, new paid cloud service or deployment was introduced.

**Still unverified/blocked:** actual US exit and owner-host authorization/costs, public TLS lifecycle, owner-device Chrome acceptance, DNS/WebRTC/IPv6 leak behavior, network-change and browser restart coverage, production firewall, independent security review, project license and commercial launch. This successful local fixture cannot certify a full-device VPN or a browser-wide kill switch. PR #1 remains open for owner review.

---


## 2026-11-15 — independently reproduced on GitHub-hosted Ubuntu

Source: `feat/tested-private-browser-proxy`, commit [`91e90c1d`](https://github.com/rejoansardar23/vpn/commit/91e90c1df91c5d4e0c3a7e4c3598bb824c6c2c96), [successful Actions run 43647697066](https://github.com/rejoansardar23/vpn/actions/runs/43647697066), job 132609050725. The workflow was created during this review, and uses an Ubuntu 24.04 GitHub-hosted runner with Node 24.22.1, lockfile-based dependencies and Playwright Chromium. **This is fresh execution evidence**, distinct from the older original cloud-task report below.

| Command/check executed in CI | Actual observation |
| --- | --- |
| `npm ci --ignore-scripts` | **Passed** after fixing nonportable `.npmrc` cache path; earlier run 43647644278 failed `EACCES: mkdir /workspace` before tests |
| `npm run typecheck` | **Passed** with repository strict TypeScript config; JS files are not under `tsconfig.json`'s checked include paths |
| `npx playwright install --with-deps chromium` | **Passed**; browser executable supplied as `CHROMIUM_PATH` without disabling managed policies or TLS validation |
| `npm test` | **57 tests, 57 passed, 0 failed, 0 skipped, 0 todo**; includes real unpacked Manifest V3 worker load/popup test and a separate browser popup test with simulated runtime |
| `npm run build` | **Passed**; 6 local MV3 extension files |
| `npm run package` | **Passed**; `dist/private-route-extension-0.1.0.zip`; packaging includes 6 assets and `THIRD_PARTY_NOTICES.txt` |
| `sha256sum -c ...sha256` and `unzip -t` | **Passed**; archive SHA-256 `02331f7667bc387f866867e330553d5bb184657971fcf54d50ce3b286aaa9e70` |
| `npm audit` | **Passed: 0 reported vulnerabilities** for the frozen npm dependency tree at that time, not a comprehensive software security certification |
| `git diff --check` | **Passed** |

**Security changes covered by the successful run:** explicit denials for special-use IPv4, IPv4-mapped and IPv6 ranges and a mixed-DNS-answer regression check; unchanged authenticated gateway/credential/usage integration tests. Exact dependency versions and third-party license obligations remain in `package-lock.json` and [DEPENDENCY_LICENSE_MATRIX.md](DEPENDENCY_LICENSE_MATRIX.md). There are 38 locked npm packages, with ten production packages (two direct); no npm integrity or registry URL exceptions were observed in static lockfile inspection. The overall product license is still undecided. The updated workflow action versions (`actions/checkout@v7.0.1`, `actions/setup-node@v7.1.0`) are later CI-only commits; check the current branch/PR status before merging.

**Unverified/not implied by this CI:** an actual US exit and authorized zero-cost host, live proxy-auth and public TLS route on the owner's Chrome, DNS/WebRTC/IPv6 leak tests, browser network-change/restart failure and routing-bypass behavior, production firewall, independent security audit, provider-level bandwidth and billing controls, off-host backup/restore, and commercial or native-device VPN. The GitHub runner's MV3 test asserts loading and disconnected popup, not complete browser network tunneling. The prior cloud Chromium's managed `ExtensionInstallBlocklist` continues to explain why its earlier run skipped the same test. No paid or deployed infrastructure was created.

---

# Previous validation report — local prototype, 2026-11-13

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
| Independent clean checkout at source commit `3843d3e` | Passed | Local clone outside the workspace; frozen install, strict types, all 56 passing tests/1 documented skip, build and identical package hash; checkout remained clean |
| Local Markdown links / limited secret patterns | Passed | 84 local Markdown links resolve; staged private-key/GitHub-token/AWS-access-key patterns absent. This limited check is not a full Gitleaks audit |

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
