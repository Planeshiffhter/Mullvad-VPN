# Product requirements (living specification)

## MVP functional requirements

| ID | Requirement | How to prove it |
| --- | --- | --- |
| FR-01 | Private founder account; no public sign-up | Unauthorized sign-up fails; user login/logout works |
| FR-02 | One actual US gateway | Provider region + observed exit IP verified |
| FR-03 | Authenticated TLS-secured browser-to-gateway proxy where supported | Valid and invalid credentials, TLS verification, CONNECT tested |
| FR-04 | MV3 Chrome extension popup with Connect/Disconnect | Browser traffic routes as expected and restores owner-controlled previous state |
| FR-05 | Connected status only on live route verification | Route check mismatch/failure shows error/reconnecting, not connected |
| FR-06 | Short-lived, revocable proxy credentials | Expiry, revocation, renewal, wrong challenge origin tests |
| FR-07 | Server-side private network / metadata access controls | Attempted internal destination access blocked even after DNS changes |
| FR-08 | Server-side traffic quota and connection limits | Exceeding quota prevents protected use; no silent direct fallback |
| FR-09 | Private operational overview | Admin sees health/usage; unauthorized requests rejected |
| FR-10 | Reproducible setup + private install | Clean checkout build; actual browser install & recovery verified |

## Nonfunctional requirements

- **Security:** no embedded permanent keys; credential-specific matching on proxy-auth challenges; authenticated APIs; validated inputs; least privilege; locked admin interfaces.
- **Privacy:** no browsing history for vanity analytics; publish measured data retention and real limitations; no claims that have not been independently validated.
- **Reliability:** predictable failure behavior; session/service-worker restart handling; defined behavior under network changes, expired credentials, and provider outages.
- **Cost:** $0 incremental budget for initial private pilot, including hosting and third-party service spend; no automatic paid fallback.
- **Engineering:** tests before declaring milestones done; pinned versions, clean builds, small reviewable PRs and documentation.
- **Cross-platform:** native system-wide clients are a separate workstream, not a browser extension mode.

## Acceptance gates

Pass requirements in [TEST_STRATEGY.md](TEST_STRATEGY.md), [SECURITY_AND_PRIVACY.md](SECURITY_AND_PRIVACY.md), and [../TASKS.md](../TASKS.md). If a requirement is untested, mark it **Unverified**. If impossible with the selected Chrome API, narrow scope/claims rather than fabricate support.

## Future feature candidates

Browser: ad/tracker filtering, malicious site filtering, contextual routing, WebRTC mitigation, Firefox compatibility.

Native: WireGuard tunneling, OS-specific kill switch, split tunneling, DNS controls, reconnect/roaming, Android/iOS/macOS/Windows/Linux.

Platform: multi-region availability, account plans, device entitlements, subscription/billing, capacity monitoring, incident response, customer support. All require separate security and business readiness gates.
