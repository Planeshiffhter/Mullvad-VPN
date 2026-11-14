# Task tracker — one authoritative sequence

Updated 2026-11-15 following independent GitHub Actions verification (original local evidence is retained). Original acceptance criteria remain in [the source plan](docs/source-plans/VPN_Company_Launch_Plan_2026-11-12.md). Evidence is in [VALIDATION.md](docs/VALIDATION.md). Done means the scoped local deliverable passed its stated checks; it never implies a deployed US service.

| ID | Task | Status | Evidence / remaining requirement |
| --- | --- | --- | --- |
| 01 | Freeze MVP scope and zero-additional-cost policy | Done | Browser-only founder scope, acceptance gates and cost inventory documented; no paid dependency |
| 02 | Repository structure and task tracking | Done | Source, lockfile, version pin, tests, installation docs, private examples and ignore rules |
| 03 | Verify authorized truly free US host | Blocked | Owner must supply authorized US compute, region, terms, IP/egress limits and actual billing evidence |
| 04 | Reproducible development/test environment | Done | Node 24.22.1 GitHub-hosted Ubuntu CI: frozen install, strict types, 59/59 tests including authenticated Chromium HTTP/HTTPS proxy routing, six-file build, package, checksum, audit; fixed nonportable npm cache; see validation |
| 05 | Prove authenticated TLS proxy path locally | Done | Real HTTP and nested target HTTPS CONNECT; valid/invalid auth and trusted TLS tests |
| 06 | Harden gateway, firewall, destination restrictions | In progress | Pinned DNS and additional special-use/mapped IPv4/IPv6 CIDR denials regression-tested in CI; gateway authentication/quotas tested; host firewall, abuse review and production network not yet verified |
| 07 | Founder account and SQLite migrations | Done | Creation, scrypt hashes, failed login, rate limit, logout, recovery and database upgrade tests |
| 08 | Authenticated control API | Done | TLS API auth, session expiry, origin policy, status and founder authorization tested |
| 09 | Issue, renew and revoke scoped proxy grants | Done | Replacement grants, five-minute expiry, four-socket limit, durable usage, active revocation and cross-session founder revocation tested |
| 10 | Manifest V3 Chrome extension scaffold | In progress | GitHub Actions Chromium verifies real MV3 worker/popup, HTTPS API login, authenticated local HTTP/HTTPS proxy routing; owner Chrome and live US host remain unverified |
| 11 | Connect/Disconnect + precise proxy auth scoping | In progress | Real Chromium fixture verifies Connect, authenticated HTTP/HTTPS, gateway metering, Disconnect, proxy/privacy restoration and gateway revocation; live owner route unverified |
| 12 | Truthful route/IP verification and states | In progress | Real Chromium fixture verification is explicitly non-US; mismatch/expiry/outage tests exist; live US verifier pending |
| 13 | Server-enforced quotas and budget controls | In progress | Persistent lifetime application quota and exhaustion tests; provider-level caps/overhead/billing comparison await host |
| 14 | Deploy live free US service | Blocked | Task 03, owner preflight, public TLS/renewal and authorized connectivity required |
| 15 | Leak, outage, lifecycle, error tests | In progress | Local outage/restart/auth/IPv4/IPv6 rules tested; owner-browser DNS/WebRTC/IPv6, sleep/wake and network changes unrun |
| 16 | Private operations dashboard | In progress | Authenticated usage/grant view/revoke tested in Chromium; deployed host/resource health and operator retention review pending |
| 17 | Backup, restore and rollback tests | In progress | Encrypted WAL-safe restore and restored account/usage/revocation tested; off-host recovery copy and deployed rollback drill pending |
| 18 | Accurate website and help/privacy drafts | Done | Private operations/help page works, no nonexistent US/country claims, browser-only and review boundaries explicit |
| 19 | Package/install private browser release | In progress | GitHub Actions verified deterministic ZIP, SHA-256 and zip structure with retained third-party notices; owner installation/live route gates remain blocked |
| 20 | One-user observation period and handoff | Blocked | Needs deployed service, owner usage period and actual cost reconciliation |
| 21–26 | External users, extra countries, payments, stores, native VPN | Deferred | Separate scope, licenses, operating obligations, authorized hosts and budget decisions |

All 19 upstream shortlist projects received explicit decisions in [REPO_AUDIT.md](docs/REPO_AUDIT.md). Only dependencies needed for this prototype were integrated; no competitor source, unsupported protocol, paid service or wholesale repository merge was added.

## Verification and review checkpoint — 2026-11-15

- Implemented: restricted no-secret GitHub Actions verification workflow for the public repository's standard no-charge runners; no self-hosted or billable resources. Runner installs pinned Node 24.22.1, frozen npm tree and Playwright Chromium. **Actual successful execution**: [run 43647697066](https://github.com/rejoansardar23/vpn/actions/runs/43647697066), commit `91e90c1d`: 57 passed, 0 failed, 0 skipped; install, types, build, package, archive integrity, npm advisory audit and whitespace check passed. The follow-on action-version upgrade and documentation commits require their own passing checks before merge.
- Fixed: a reproducible npm `EACCES` build failure from a workspace-specific `.npmrc` cache path; explicit special-use IPv4/IPv6 destination denials and regression assertions. No new runtime dependencies or paid services.
- Open safety/release gates: authorized US exit/terms/real $0 spend, public TLS/renewal and firewall, real owner Chrome Connect/Disconnect/auth/DNS/WebRTC/IPv6 and outage checks, remote recovery drill, retention/log review, provider-level egress cap and project license choice. Do **not** mark Tasks 03, 14, 15, 19, 20 or 21–26 complete from CI alone.
- Read [docs/VALIDATION.md](docs/VALIDATION.md) and the review PR before extending the implementation. **Never merge automatically.**

## Latest engineering checkpoint — 2026-11-15

- **Real browser milestone passed:** [GitHub CI run 43651036666](https://github.com/rejoansardar23/vpn/actions/runs/43651036666), code commit `f0535cb`: **59 passed, 0 failed, 0 skipped**. Real Chrome MV3 login, authenticated HTTPS proxy, actual HTTP and HTTPS CONNECT, metered traffic, Connect/Disconnect, proxy/privacy restoration and server revocation tested. UI labels local fixture accurately.
- **Production defect fixed:** worker sign-in's unbound `fetch` caused Chrome's `Illegal invocation`. Default fetch is now bound; regression test included.
- NSS certificate trust is restricted to a disposable test HOME; production destination policy is unchanged. No new runtime dependency, public deployment or incremental spending.
- **Outstanding:** authorized US host and billing terms, trusted public TLS/firewall, owner-device DNS/WebRTC/IPv6/outage acceptance, independent review and owner commercial licensing decision. PR #1 remains open; never auto-merge.
