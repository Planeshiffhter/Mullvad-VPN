# Hosting and deployment runbook — not yet deployed

**No server is currently confirmed or provisioned by this repository.** This page defines the preflight needed before any real US endpoint.

## Preflight gate (Task 3)

- Owner has an authorized hosting account and **US region** available at $0 incremental cost.
- Verify instance, public IPv4/IPv6, disk, CPU, bandwidth/egress, network terms, billing and trial-expiry effects.
- Verify provider policy permits the intended traffic and proxy/VPN use.
- Validate provider's free tier on the actual billing screen, not by advertising alone.
- Document emergency shutdown and quota monitoring; no paid fallback.

Potential free-host candidate: Oracle Cloud Always Free, **not guaranteed** (home-region restrictions, capacity availability, identification/payment-card verification rules, and possible idle-instance reclamation). A user-owned, authorized US host may be another option subject to network and provider rules.

## Deployment design

- Reproducible minimal Linux setup, isolated service identities, outbound firewall/destination rules.
- Proxy service with authenticated encrypted incoming hop, limited ports and access to internet destinations only.
- HTTPS control API with strong auth, server-side grants and safe logging.
- TLS certificates with automated renewal; verify trust, no skipping certificate checks.
- Securely inject secrets outside GitHub commits. No admin passwords in extension bundle.
- Implement quota enforcement and observed usage versus provider billing.
- Automatic service restart, backups, **tested** restoration and rollback.
- Keep management interfaces private.

## Validation after deployment

1. Confirm real location and public egress IP of the gateway.
2. Observe successful browser-to-proxy request with valid credential.
3. Confirm invalid/expired credentials and restricted destinations fail.
4. Connect Chrome extension; verify expected external IP, disconnect/restore behavior.
5. Test DNS/WebRTC/IPv6, outages, sleep/wake, credential rotation/revocation and quota exhaustion.
6. Record actual service costs and resource limits.

## Release boundaries

A script, Dockerfile, README screenshot, mock region list, or passing isolated test **does not** equal a deployed US VPN service. Deployment, security-sensitive owner account actions, Chrome Web Store publication and public customer launch require separate permission and verification.
