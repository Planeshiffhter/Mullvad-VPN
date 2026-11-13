# Cost policy — prototype hard limit

**Owner instruction: exactly $0 additional out-of-pocket spend for the private pilot.** Existing already-paid Codex access may be used subject to its usage allowance; it is **not** unlimited and is not the same as paid OpenAI API billing.

## Allowed

- Open-source code, normal GitHub development, local/cloud sandbox tests available within existing entitlements.
- CI only where verified to be free under the account's actual quotas.
- A legitimately authorized US host only after account region, terms, bandwidth/storage/IP cost and actual billable settings are checked.
- Free DNS/TLS resources if truly free for the use and lawful under their terms.

## Not authorized

Paid proxy/VPS/cloud instance, credit top-up, commercial VPN API, domain, app-store fees, SMS/email provider, paid CI, managed database, analytics, payment processing, free trial that silently turns billable, bypass of free-tier restrictions, or spending company funds without explicit owner authorization.

## Operating procedure

1. Document every external service and whether it has a card on file, trial expiration, region constraint, public IP cost, egress cost and hard quota.
2. Do not provision resources before verifying free eligibility and provider policy; never assume credits guarantee $0 forever.
3. Implement server-enforced quotas, safe traffic limits, logs without browsing history and a shutdown procedure.
4. When the US host cannot be acquired at $0, mark deployment **Blocked**; continue independently testable local work.
5. Record actual cost and resource dashboard observations at release and throughout the founder pilot.
6. No paid fallback without an explicit owner decision recorded in [DECISIONS.md](DECISIONS.md).

**Possible candidate, not an approved or guaranteed resource:** Oracle Cloud Always Free (home-region / availability / card-verification constraints apply). See the historical plan for source references. The user remains responsible for owner-controlled cloud verification.
