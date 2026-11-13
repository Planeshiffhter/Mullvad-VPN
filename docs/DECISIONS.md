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
