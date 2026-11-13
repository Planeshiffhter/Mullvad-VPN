# Task tracker — one authoritative sequence

**Status at documentation initialization (2026-11-13):** no implementation claims. Update the Status/Evidence columns in PRs. This summary is based on the original [20-task plan](docs/source-plans/VPN_Company_Launch_Plan_2026-11-12.md), which contains the detailed acceptance checks.

Status vocabulary: **Not started**, **In progress**, **Blocked**, **Done**, **Deferred**. Every Done item needs a test log, committed artifact, and accepted behavior. Documentation-only progress does not mean runtime implementation exists.

| ID | Task | Status | Evidence / immediate next action |
| --- | --- | --- | --- |
| 01 | Freeze MVP scope and zero-additional-cost policy | In progress | Docs drafted; owner/developer review and formal acceptance pending |
| 02 | Repository structure and task tracking | In progress | Onboarding/docs committed; source code scaffold and security checks still pending |
| 03 | Verify authorized truly free US host | Blocked | Owner/provider region, terms, resource and billing preflight |
| 04 | Reproducible development/test environment | Not started | Set up isolated reproducible networking tests |
| 05 | Prove authenticated TLS proxy path locally | Not started | Real HTTP/HTTPS routing, invalid auth and TLS evidence |
| 06 | Harden gateway, firewall, destination restrictions | Not started | SSRF/private range/DNS-rebinding negative tests |
| 07 | Founder account and SQLite migrations | Not started | Secure login/logout/recovery/rate-limit tests |
| 08 | Authenticated control API | Not started | Auth, gateway list, admin boundary tests |
| 09 | Issue, renew and revoke scoped proxy grants | Not started | Expiry and active-connection semantics evidence |
| 10 | Manifest V3 Chrome extension scaffold | Not started | Worker lifecycle, API communication tests |
| 11 | Connect/Disconnect + precise proxy auth scoping | Not started | Live routing/restore/conflict behavior |
| 12 | Truthful route/IP verification and states | Not started | Failure/mismatch never shown as Connected |
| 13 | Server-enforced quotas and budget controls | Not started | Exhaustion blocks protected use without bypass |
| 14 | Deploy live free US service | Blocked | Depends on Task 03; actual verified US route |
| 15 | Leak, outage, lifecycle, error tests | Not started | DNS/WebRTC/IPv6/failover test report |
| 16 | Private operations dashboard | Not started | Health/usage/revocation + access-control proof |
| 17 | Backup, restore and rollback tests | Not started | Completed restore drill |
| 18 | Accurate website and help/privacy drafts | Not started | No false live countries/features |
| 19 | Package/install private browser release | Blocked | Needs live tested gateway and browser installation |
| 20 | One-user observation period and handoff | Blocked | Needs working service; reconcile actual charges |

## Later tasks — not authorized for launch

| ID | Future work | Status |
| --- | --- | --- |
| 21 | Separate customers, invitations and quotas | Deferred |
| 22 | Second-country gateway | Deferred |
| 23 | Third-country gateway | Deferred |
| 24 | Billing abstraction and sandbox payment tests | Deferred |
| 25 | Store assets / public release review | Deferred |
| 26 | Native full-device clients | Deferred |

## Parallel low-risk research before code

- [ ] Audit WXT vs SuperTunnel and official Chrome proxy/auth APIs.
- [ ] Audit gateway candidates and TLS/auth/expiry/quota/revocation capabilities.
- [ ] Prepare pinned direct/transitive dependency licenses, security and maintenance matrix.
- [ ] Write actual MVP architecture and test fixtures after those choices.
- [ ] Verify GitHub Actions free usage and avoid enabling paid jobs.

**Working order:** initial review → first unblocked task → small implementation + checks → update task/status evidence → next task. Continue unblocked work when hosting is blocked, but never claim a live US server based on local mocks.
