# Task tracker — one authoritative sequence

Updated 2026-11-13 for the local prototype. Original acceptance criteria remain in [the source plan](docs/source-plans/VPN_Company_Launch_Plan_2026-11-12.md). Evidence is in [VALIDATION.md](docs/VALIDATION.md). Done means the scoped local deliverable passed its stated checks; it never implies a deployed US service.

| ID | Task | Status | Evidence / remaining requirement |
| --- | --- | --- | --- |
| 01 | Freeze MVP scope and zero-additional-cost policy | Done | Browser-only founder scope, acceptance gates and cost inventory documented; no paid dependency |
| 02 | Repository structure and task tracking | Done | Source, lockfile, version pin, tests, installation docs, private examples and ignore rules |
| 03 | Verify authorized truly free US host | Blocked | Owner must supply authorized US compute, region, terms, IP/egress limits and actual billing evidence |
| 04 | Reproducible development/test environment | Done | Frozen install, build, explicit loopback fixture, startup/stop/restart and isolated TLS tests; actual extension browser policy limitation documented |
| 05 | Prove authenticated TLS proxy path locally | Done | Real HTTP and nested target HTTPS CONNECT; valid/invalid auth and trusted TLS tests |
| 06 | Harden gateway, firewall, destination restrictions | In progress | Public-only pinned DNS, IPv4/IPv6/port denial and resource limits tested; host firewall template not applied or production-tested |
| 07 | Founder account and SQLite migrations | Done | Creation, scrypt hashes, failed login, rate limit, logout, recovery and database upgrade tests |
| 08 | Authenticated control API | Done | TLS API auth, session expiry, origin policy, status and founder authorization tested |
| 09 | Issue, renew and revoke scoped proxy grants | Done | Replacement grants, five-minute expiry, four-socket limit, durable usage, active revocation and cross-session founder revocation tested |
| 10 | Manifest V3 Chrome extension scaffold | In progress | Typed worker/popup built, controller and UI tested; installed cloud Chromium blocks actual extension load by managed policy |
| 11 | Connect/Disconnect + precise proxy auth scoping | In progress | Lifecycle/ownership/exact challenge tests; actual Chrome proxy events and restored live route not yet verified |
| 12 | Truthful route/IP verification and states | In progress | Expected-IP, mismatch, expiry-during-check and outage tests; local fixtures visibly labelled, live US verifier pending |
| 13 | Server-enforced quotas and budget controls | In progress | Persistent lifetime application quota and exhaustion tests; provider-level caps/overhead/billing comparison await host |
| 14 | Deploy live free US service | Blocked | Task 03, owner preflight, public TLS/renewal and authorized connectivity required |
| 15 | Leak, outage, lifecycle, error tests | In progress | Local outage/restart/auth/IPv4/IPv6 rules tested; owner-browser DNS/WebRTC/IPv6, sleep/wake and network changes unrun |
| 16 | Private operations dashboard | In progress | Authenticated usage/grant view/revoke tested in Chromium; deployed host/resource health and operator retention review pending |
| 17 | Backup, restore and rollback tests | In progress | Encrypted WAL-safe restore and restored account/usage/revocation tested; off-host recovery copy and deployed rollback drill pending |
| 18 | Accurate website and help/privacy drafts | Done | Private operations/help page works, no nonexistent US/country claims, browser-only and review boundaries explicit |
| 19 | Package/install private browser release | In progress | Deterministic ZIP/hash and install guide exist; owner Chrome install/live route gates blocked |
| 20 | One-user observation period and handoff | Blocked | Needs deployed service, owner usage period and actual cost reconciliation |
| 21–26 | External users, extra countries, payments, stores, native VPN | Deferred | Separate scope, licenses, operating obligations, authorized hosts and budget decisions |

All 19 upstream shortlist projects received explicit decisions in [REPO_AUDIT.md](docs/REPO_AUDIT.md). Only dependencies needed for this prototype were integrated; no competitor source, unsupported protocol, paid service or wholesale repository merge was added.
