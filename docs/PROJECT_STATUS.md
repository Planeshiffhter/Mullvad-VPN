# Project status — factual inventory

Updated 2026-11-13. **Locally tested prototype; live US release blocked.** See [VALIDATION.md](VALIDATION.md) for exact results and [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) for commands.

| Capability | Implemented | Evidence / limitation |
| --- | --- | --- |
| Upstream selection | All 19 shortlisted repositories checked | Exact revisions, licenses and integration/deferral decisions in REPO_AUDIT; not independent security audits |
| Founder/control API | TypeScript, SQLite, scrypt, expiring bearer sessions, closed signup, recovery | Real TLS API and persisted database tests |
| Proxy gateway | Established proxy-chain TLS listener, HTTP and CONNECT | Real HTTP and nested HTTPS requests; site TLS validation preserved |
| Gateway controls | DNS/IP/port checks, pinned DNS, quotas, concurrency, active revocation/expiry | Controlled negative tests, durable accounting and fail-closed persistence tests; production firewall uninstalled |
| Chrome extension | TypeScript MV3, scoped auth, routing lifecycle, verification, privacy restoration | Controller tests and popup DOM checks; actual MV3 install blocked by managed Chromium policy |
| Real US exit | Not verified | No authorized zero-cost US host supplied/configured |
| Private operations/help | Local login, aggregate usage/grants and revocation | Real Chromium UI tests; no public launch |
| Backups/recovery | Encrypted online SQLite backup and atomic restore | Tamper/wrong-password/WAL tests plus restored founder login/usage; off-host backup not verified |
| Distribution | Reproducible private extension ZIP and hash | No store publication; owner installation still required |
| Deployed operations | Config runner and service/firewall templates | No live deployment, renewal automation, provider billing or rollback drill verified |
| Full-device VPN | Not implemented | Separate deferred native client workstream |

**Implemented** and **automatically tested** above do not mean manually verified on the owner's device. The local verifier is a controlled fixture, not a live route/location service. No new paid resource, account, external service or public proxy was provisioned. Whole-project licensing remains an owner decision; third-party obligations are inventoried separately.

Next gate: authorized US host and provider cost/terms preflight, followed by trusted public TLS, owner Chrome installation and leak/failure acceptance. Continue development with `npm run check` and explicit local fixture mode; do not mark Tasks 14, 19 or 20 complete from local tests.
