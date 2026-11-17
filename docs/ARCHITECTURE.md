# Current architecture and native development boundary

The existing implementation is a founder-only Chrome browser-proxy prototype. The broader native VPN product is described in [PROJECT_IDEA.txt](../PROJECT_IDEA.txt). See [STATUS.md](STATUS.md) for current validation; source archives and configuration labels do not prove live service or location.

| Component | Current responsibility |
| --- | --- |
| `apps/extension/` | TypeScript Chrome MV3 popup and worker; proxy ownership, scoped authentication, route verification and privacy-setting restoration |
| `services/control-api/` | HTTPS founder authentication, session and grant lifecycle, gateway descriptions, aggregate status and private operations UI serving |
| `services/gateway/` | Authenticated TLS forward proxy using `proxy-chain`, with destination restrictions, DNS pinning, expiry/revocation, connection limits and durable traffic accounting |
| `apps/operations/` | Founder operations/help UI served by the control API |
| `scripts/` | Loopback development services, deterministic extension packaging and encrypted SQLite recovery |
| `infrastructure/` | Operator-configured runtime and unapplied service/firewall examples |
| `upstream/archives/` | Preserved Mullvad and Amnezia native application ZIPs; no integration into the prototype |

The control plane carries login, grants, status and revocation over HTTPS. Browsing uses the separately authenticated TLS proxy. HTTP sites remain HTTP beyond the gateway; HTTPS sites use CONNECT and retain end-to-end destination certificate verification. The gateway does not intercept website TLS.

SQLite stores the single founder account, salted scrypt password hash, hashed session and proxy secrets, expiry/revocation state and aggregate usage. Defaults are a one-hour control session and five-minute connection grant. The gateway enforces authorization and quotas independently of client UI state. New grant issuance replaces the previous active grant.

The extension accepts HTTPS control and verifier origins. It returns credentials only for a Basic proxy challenge from the exact configured gateway host and port. A route becomes verified only after the configured verifier reports the expected IP. Explicit fixture mode uses a controlled local route and must remain labeled a fixture. Errors retain proxy configuration; explicit Disconnect restores only settings still owned by the extension.

The exact control API origin bypasses the proxy so account and revocation actions remain reachable. Incognito, other applications, browser background traffic and operating-system networking are outside the claimed coverage. Retaining proxy settings and limiting non-proxied WebRTC UDP do not establish a universal kill switch or leak certification.

Native clients require a separate tracked implementation, chosen license model, platform tunnel APIs, authorized gateway, DNS/routing/firewall handling, signing and update authority, and platform-specific failure tests. Upstream vendor accounts, backends, relays, trademarks and release keys do not become ours through source possession. Extracted `build/upstream/` trees are ignored study/build outputs; keep original development in tracked components.

Earlier design decisions and research remain in [the preserved architecture](../AnalyseFuture/previous-docs/ARCHITECTURE.md) and [build-versus-reuse review](../AnalyseFuture/previous-docs/BUILD_VS_REUSE.md). Their dated branch directions and release claims are historical.
