# Architecture decisions and open questions

**Decision states: Accepted / Proposed / Rejected / Superseded.** Proposals should never be silently treated as an implemented stack.

| ID | Decision | State | Rationale |
| --- | --- | --- | --- |
| ADR-001 | One owner-controlled monorepo | **Accepted (planning)** | Simple contributor workflow, modular code ownership |
| ADR-002 | Chrome MV3 browser proxy is first deliverable | **Accepted (planning)** | US-first single-user prototype |
| ADR-003 | Strict $0 incremental pilot budget | **Accepted** | Owner explicit instruction; no paid fallback |
| ADR-004 | Full-device VPN is separate later architecture | **Accepted** | Browser proxy API cannot protect entire OS |
| ADR-005 | Prefer maintained upstream networking/auth over custom engines | **Accepted (principle)** | Reduce security risk and wasted Codex work |
| ADR-006 | WXT + official Chrome API vs SuperTunnel | **Proposed / audit needed** | Dependency maturity vs reuse efficiency |
| ADR-007 | 3proxy as US proxy gateway | **Proposed / POC needed** | Check transport/auth/revocation/cost/licensing |
| ADR-008 | TypeScript + small Node API + SQLite | **Proposed MVP baseline** | Low-cost maintainability |
| ADR-009 | Better Auth / shadcn UI / Playwright / Gitleaks | **Candidate** | Use only if MVP benefits |
| ADR-010 | Later WireGuard-based native clients | **Proposed** | Established protocol implementation |
| ADR-011 | Public repo code-license choice | **Open** | No general LICENSE is granted yet |
| ADR-012 | Free US hosting provider and endpoint | **Open / blocked** | Provider/account preflight is missing |
| ADR-013 | Explicit active-session revocation semantics | **Open** | Must be enforced/tested or limitations stated |

## How to record decisions

Add date, owner, options evaluated, direct upstream source/license/version, security/cost tradeoffs, what was tested, and a reversal plan. Prefer one decision change per focused PR.

## Avoid unapproved assumptions

No automatic paid hosting, public users, charging customers, full no-logs promises, vendor API usage, telemetry collection, domain purchases, proprietary competitor code copying, or "all features now" rewrites.


## 2026-11-13 — local prototype implementation decisions

- **ADR-014 (implemented locally):** use proxy-chain 3.0.3 through its native HTTPS server and per-request hooks, with ipaddr.js 2.3.0 for conservative destination classification. This replaces 3proxy as the immediate proof-of-concept candidate because authorization, DNS pinning and per-grant enforcement can be integrated without an external auth/reload protocol. 3proxy remains evaluated, not vendored. Exact licenses and release refs: REPO_AUDIT.md.
- **ADR-015 (implemented locally):** original TypeScript MV3 adapter over official Chrome APIs rather than importing WXT, SuperTunnel, Proton or Windscribe. The small extension needs no UI/build framework; executable code is bundled locally with no remote scripts. TypeScript control API and extension are strictly checked; Node 24 runs erasable TS and strips it for browser distribution.
- **ADR-016 (implemented locally):** single founder, built-in Node SQLite and scrypt; no public signup, OAuth/email/SMS, paid API or authentication framework. Sessions last one hour; one active grant lasts five minutes, with up to four sockets. Replacement revokes previous access; renewal is explicit reconnect. Separate sessions for the same founder can revoke each other's grants. Native crypto primitives implement password hashing and authenticated backup encryption, not a networking protocol.
- **ADR-017 (implemented locally):** persistent lifetime founder quota, no automatic refill, and seven-day expired/revoked grant retention. Account totals survive pruning/recovery. Usage records aggregate bytes, timestamps and revocation state, not browsing history. Application counters exclude provider overhead; a host must supply independent limits before deployment.
- **ADR-018 (release boundary):** loopback development and explicit LOCAL fixture; management remains loopback in the operator runner. An SSH/VPN management path and certificate setup are operator prerequisites. Managed cloud browser policy is preserved. No real US route, global browser kill switch, native protection, no-logs audit or legal compliance is claimed. Project license remains undecided.

Reversal: keep the thin API/grant contract and replace the separate proxy adapter or extension build tooling behind its tests. No upstream whole repository was merged.
