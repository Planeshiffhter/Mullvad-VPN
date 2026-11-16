# Project status — factual inventory

## Proposed Task 15 regression (awaiting CI on review branch)

Implemented in a separate PR targeting `feat/tested-private-browser-proxy`: a real Chromium negative-route check after revoking an active grant through the founder HTTPS API. The test measures authenticated gateway rejection and asserts a unique URL never reaches the destination, while Chrome retains extension-owned TLS proxy and WebRTC settings until explicit Disconnect. An in-memory rejected-authentication counter stores no URLs or credentials. **Automatically tested:** pending the new PR's GitHub Actions run; the previous implementation baseline passed 59/59 at run 43651339909. **Manually verified:** not on the owner's Chrome. **Simulated:** no fake browser or HTTP mock is used for the new test, but destinations and TLS trust are controlled loopback fixtures. **Blocked:** real US endpoint, DNS/WebRTC/IPv6 and browser outage/restart acceptance. **Deferred:** full-device VPN and public release. This does not establish a universal browser kill switch.

Updated 2026-11-15 following real Chromium integration CI (59/59). **Locally tested browser-proxy prototype; live US release blocked.** See [VALIDATION.md](VALIDATION.md) for exact results and [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) for commands.

| Capability | Implemented | Evidence / limitation |
| --- | --- | --- |
| Upstream selection | All 19 shortlisted repositories checked | Exact revisions, licenses and integration/deferral decisions in REPO_AUDIT; not independent security audits |
| Founder/control API | TypeScript, SQLite, scrypt, expiring bearer sessions, closed signup, recovery | Real TLS API and persisted database tests |
| Proxy gateway | Established proxy-chain TLS listener, HTTP and CONNECT | Real HTTP and nested HTTPS requests; site TLS validation preserved |
| Gateway controls | DNS/IP/port checks, pinned DNS, special-use IPv4/IPv6 denials, quotas, concurrency, active revocation/expiry | Controlled negative regression tests including special-use and mapped IPv4/IPv6, durable accounting and fail-closed persistence; production firewall uninstalled |
| Chrome extension | TypeScript MV3, scoped auth, routing lifecycle, verification, privacy restoration | Real GitHub-hosted Chromium independently verified HTTPS API sign-in, issued grant, authenticated HTTP and HTTPS CONNECT through Chrome TLS proxy, metering, fixture-only status, Disconnect, privacy restoration and revocation (59/59 tests); owner-device and US exit remain unverified |
| Real US exit | Not verified | No authorized zero-cost US host supplied/configured |
| Private operations/help | Local login, aggregate usage/grants and revocation | Real Chromium UI tests; no public launch |
| Backups/recovery | Encrypted online SQLite backup and atomic restore | Tamper/wrong-password/WAL tests plus restored founder login/usage; off-host backup not verified |
| Distribution | Reproducible private extension ZIP and hash | Clean GitHub Actions archive checksum and integrity check passed; no store publication or owner installation |
| Deployed operations | Config runner and service/firewall templates | No live deployment, renewal automation, provider billing or rollback drill verified |
| Full-device VPN | Not implemented | Separate deferred native client workstream |

**Implemented** and **automatically tested** above do not mean manually verified on the owner's device. The local verifier is a controlled fixture, not a live route/location service. No new paid resource, account, external service or public proxy was provisioned. Whole-project licensing remains an owner decision; third-party obligations are inventoried separately.

Next gate: authorized US host and provider cost/terms preflight, followed by trusted public TLS, owner Chrome installation and leak/failure acceptance. Continue development with `npm run check` and explicit local fixture mode; do not mark Tasks 14, 19 or 20 complete from local tests.

## Independent CI/review checkpoint — 2026-11-15

The development branch now has an automatically triggered GitHub Actions workflow on standard public-repository runners. [Successful verification run 43647697066](https://github.com/rejoansardar23/vpn/actions/runs/43647697066) ran `npm ci --ignore-scripts`, `npm run typecheck`, `npm test` (**57 passed, zero failed, zero skipped**), `npm run build`, `npm run package`, SHA-256/ZIP integrity checks, `npm audit` (**zero reported npm advisories**) and `git diff --check`. Unlike the earlier managed cloud environment, the runner loaded the actual Manifest V3 Chromium worker. It did **not** exercise an owner's live browser/proxy route, DNS/WebRTC/IPv6 leak protection or a real US gateway. Build-generated ZIP and credentials remain outside source control.

The review uncovered and corrected a hard-coded workspace-specific npm cache that prevented clean CI installation, and improved fail-closed blocking of special-use IPv4/IPv6 destination ranges (including mapped IPv4) with regression cases. The GitHub Actions verification workflow uses `contents: read` and has no deployment, publishing, billing or secrets steps. No extra production library, paid hosting or deployment was introduced. Updated maintained GitHub action versions are separately subject to current workflow status.

**Security/release blockers** remain: founder-approved/authorized no-cost US hosting and actual exit proof; production proxy TLS and firewall; owner-browser end-to-end proxy-auth/renewal/revocation, leaks, restarts and outage checks; independent network abuse, quota/provider overhead, data-retention and secrets review; real recovery/rollback and project distribution license. This is a **review candidate**, not a commercial VPN or complete full-device tunnel.


## Open-source reuse / credit-optimization audit — 2026-11-15

The required architecture gate is documented in [REPOSITORY_AUDIT.md](REPOSITORY_AUDIT.md), [BUILD_VS_REUSE.md](BUILD_VS_REUSE.md), [COMPETITOR_FEATURE_MATRIX.md](COMPETITOR_FEATURE_MATRIX.md), [ARCHITECTURE.md](ARCHITECTURE.md), [LICENSE_AND_DEPENDENCY_AUDIT.md](LICENSE_AND_DEPENDENCY_AUDIT.md), [SECURITY_THREAT_MODEL.md](SECURITY_THREAT_MODEL.md), and [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md).

The audit selects the existing direct TypeScript MV3 implementation, `proxy-chain@3.0.3`, `ipaddr.js@2.3.0`, founder-only Node/SQLite auth, and Playwright `1.65.0` for the current milestone. WXT, 3proxy, Better Auth, Keycloak, shadcn, Blocky, dnsproxy, Caddy, Prometheus, Trivy, Outline and WireGuard are deferred to explicit requirement gates rather than added speculatively.

Current audited implementation HEAD `15c8fb9` passed GitHub Actions run `43648138870`. A pinned Gitleaks `v8.30.1` CLI history scan is now implemented on the security-tooling branch; it must not be called validated until the latest PR #1 workflow run passes after integration. Owner-Chrome/live-route acceptance remains next. No framework rewrite or paid deployment is justified by this audit.
