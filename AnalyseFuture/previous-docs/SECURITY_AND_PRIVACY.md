# Security and privacy baseline

This is the release requirements and threat model. A subset of controls is implemented and locally tested; see [VALIDATION.md](VALIDATION.md) for exact evidence. It is not a security certification or live-deployment claim.

## Threats

- Credential or session theft; exposed admin endpoints.
- Unauthorized open proxy / illicit destination abuse.
- Access to gateway host internals, cloud metadata, link-local/private address ranges, or unintended ports (SSRF).
- MITM or downgrade on browser-to-proxy connection; mistaken trust in a plain HTTP proxy.
- Direct-connection leaks from failure, DNS, WebRTC, IPv6, browser policy conflicts or service-worker lifecycle.
- Over-broad browser permissions and credential leakage via wrong-origin auth challenges.
- Excess bandwidth, unbounded storage and accidental paid resource use.
- Hidden tracking, unsafe logs, misleading no-logs and kill-switch claims.
- Dependency supply-chain compromise and secret leakage through public GitHub/CI.

## Baseline controls

1. TLS-protect the control API and any claimed encrypted proxy transport; preserve end-to-end HTTPS to sites; **do not intercept website TLS**.
2. Single founder account initially, secure hashing, rate limits, session expiry, owner-controlled recovery.
3. Independent, scoped, short-lived and revocable proxy grants. Admin secrets never packaged with extension. Match challenge origin to allowlisted proxy **host + port**, not webpage challenges.
4. Gateway-side authentication, destination IP/port restrictions (IPv4/IPv6, DNS rebinding), firewall, connection/rate limits, bandwidth quotas and minimum exposed ports.
5. Admin operations private, role-checked, authenticated, logged minimally; redact tokens and credentials.
6. Observe, test and document DNS/WebRTC/IPv6 and failure behavior; no unsupported claim of OS-wide kill switch.
7. Minimal extension permissions and strict data-schema validation; no remote executable code.
8. Dependency pinning and scanning, review before upstream code reuse, no credentials committed to Git.
9. Encrypted backup, tested restore and rollback; certificate renewal without bypassing trust checks.
10. No full browsing history collection; define minimal diagnostics, retention windows and deletion procedure before public release.

## Required negative tests

- Missing/expired/revoked credentials and active-tunnel revocation behavior.
- Proxy auth challenge from a non-approved host or destination.
- Gateway to localhost, RFC1918, link-local, metadata service, prohibited ports and DNS-rebound targets.
- Wrong US IP, proxy failure, browser restart, service-worker restart, sleep/wake, network switches, quota exhaustion.
- IPv4/IPv6, DNS, WebRTC and browser traffic categories actually covered.
- Simulated API failure without false "Connected" status.
- Admin endpoints without authorization; public secret scans.

## Privacy and legal

A VPN service is a trust-sensitive network operator. We cannot claim independently audited, no logs, anonymous, no leak, guaranteed streaming access, or comprehensive protection until evidence exists. Check jurisdiction-specific hosting, privacy, consumer-protection, payment and cyber-incident rules before external users; the earlier plan flags India's CERT-In directions for legal review where applicable.

## Reporting security issues

Follow [../SECURITY.md](../SECURITY.md). Avoid publishing exploit details or live credentials in public issues.


## Current retention and recovery behavior

The local service stores salted password hashes, hashed random bearer/proxy secrets, expiration/revocation timestamps and aggregate traffic totals. It does not implement browsing-history logs. Expired sessions are removed; expired/revoked grants prune after seven days while a cumulative account counter preserves consumed quota. Host/platform logs and deployment access policies still need review; this is not a no-logs promise. Raw account credentials created by development initialization are test-only, private and ignored. Runtime client credentials are ephemeral restricted Chrome session data.

Backups faithfully preserve historical authorization. After restoring an older database, stop services and run owner recovery with a new securely supplied password before starting; this revokes all restored sessions/grants. Off-host encrypted backup and deployed rollback remain release requirements.
