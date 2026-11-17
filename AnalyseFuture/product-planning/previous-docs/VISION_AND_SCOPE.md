# Vision, audience and product boundaries

## Long-term vision

A company-owned consumer VPN platform competing on **trust, network security, reliable performance, usability and price/value** with major commercial VPN offerings. The benchmark set for planning includes NordVPN, Proton VPN, and ExpressVPN; a claim to be market #1 requires independent measurement and is **not** a current product fact.

## Product principles

- A product with our own identity, user experience, domain knowledge, policies, and operations.
- Reuse maintained upstream engines/libraries where appropriate; don't reinvent crypto or network protocols.
- Do not misrepresent proxy protection as device-wide VPN protection.
- Truthful privacy claims backed by tests and documented operational practices; collect the minimum information needed.
- Modular, testable, reproducible software that new developers can understand from GitHub alone.
- Stay within the **$0 additional-spending** private-pilot requirement until explicitly revised.

## First user/persona

Single founder/tester operating Chrome desktop. No public signup; one authorized US exit location only. The product must tolerate unavailable free hosting by offering an honest **blocked** state while development proceeds with local fixtures.

## Prototype definition of success

- Extension can connect/disconnect using allowed Chrome APIs without taking over unrelated browser settings.
- Gateway requires authentication and encrypts browser-to-gateway traffic in the verified supported configuration; destination restrictions apply.
- Credentials are per-user/connection, short-lived, revocable, and not permanently embedded.
- Real remote egress IP/route matches the confirmed US host, and UI status is grounded in route checks.
- Explicit DNS/WebRTC/IPv6/network-failure assessment with no unacknowledged silent direct fallbacks for traffic claimed protected.
- Quotas and cost limits enforced, not merely displayed.
- Reproducible build, controlled deployment, backup/restore, reliable rollback and documented known limitations.
- Actual additional spending for pilot is recorded and remains $0; if not possible, deployment remains blocked.

## Later scope (not MVP requirements)

Two or three countries, free/premium tiers, subscriptions, account/device management, ad/tracker blocking, split tunneling, multi-hop, obfuscation, native WireGuard-based clients, app stores, global infrastructure, audited privacy practices, customer support.

## Exclusions for prototype

No proprietary provider infrastructure borrowing; no HTTPS interception; no unreviewed telemetry; no custom VPN cryptography; no false no-logs claim; no payment flows, public accounts, unsupported country badges, paid-domain purchase, or unbudgeted services.
