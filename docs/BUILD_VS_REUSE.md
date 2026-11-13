# Build vs reuse — upstream research shortlist

**All entries below are research candidates, not imported dependencies or verified security audits.** Pin to exact commits/releases and review LICENSE, NOTICE, transitive dependencies, project health, threat model, browser permissions and compatibility before incorporation. Verify upstream repository status at decision time.

| Capability | Candidate | Proposed use | Integration decision |
| --- | --- | --- | --- |
| Chrome/Firefox MV3 framework | [WXT](https://github.com/wxt-dev/wxt) | Extension scaffolding, TS, builds | **Evaluate first** |
| Browser proxy reference | [SuperTunnel](https://github.com/SuperPlugs/SuperTunnel) | Learn extension+controller flow | Compare; not automatic foundation |
| Advanced extension reference | [Windscribe MV3](https://github.com/Windscribe/browser-extension-mv3) | UX/privacy patterns | Reference; audit all license/dependency issues |
| Authentication | [Better Auth](https://github.com/better-auth/better-auth) | Session/account building blocks | Evaluate for minimal founder account |
| UI | [shadcn/ui](https://github.com/shadcn-ui/ui) | Extensible components | Use selectively |
| Browser testing | [Playwright](https://github.com/microsoft/playwright) | Integration/e2e tests | Strong candidate |
| Secret scanning | [Gitleaks](https://github.com/gitleaks/gitleaks) | Pre-commit/CI checks | Strong candidate |
| Proxy data plane | [3proxy](https://github.com/3proxy/3proxy) | Authenticated forward proxy | **Proof-of-capability + license first** |
| Proxy / Shadowsocks alternative | [Outline Server](https://github.com/OutlineFoundation/outline-server) | Server concepts/alternative protocols | Not interchangeable with Chrome proxy APIs |
| Future real VPN tunnel | [wireguard-go](https://github.com/WireGuard/wireguard-go) | Reviewed tunnel implementation | Native-only future work |
| Future client reference | [Outline Apps](https://github.com/OutlineFoundation/outline-apps) | Desktop/mobile lessons | Later; architecture/protocol assessment |
| Native app reference | [Mullvad app](https://github.com/mullvad/mullvadvpn-app) | Network protection architecture | GPL conditions: primarily reference unless compliance approved |
| Extension reference | [Proton extension](https://github.com/ProtonVPN/proton-vpn-browser-extension) | UX, state management concepts | GPL: primarily reference unless compliance approved |
| DNS filtering | [Blocky](https://github.com/0xERR0R/blocky) | Domain blocking | Later if needed |
| DNS proxy | [AdGuard dnsproxy](https://github.com/AdguardTeam/dnsproxy) | Encrypted DNS | Later if needed |
| Monitoring | [Prometheus](https://github.com/prometheus/prometheus) | Self-hosted metrics | Later; don't overbuild for one server |
| HTTPS frontend | [Caddy](https://github.com/caddyserver/caddy) | TLS/web serving | Evaluate at deployment |
| Vulnerability scanning | [Trivy](https://github.com/aquasecurity/trivy) | Dependency/container scans | Use where justified |
| Complex identity alternative | [Keycloak](https://github.com/keycloak/keycloak) | Full IAM | Not needed for founder-only MVP |

## Preferred architecture

**One owned monorepo; multiple dependencies/services, not a megamerge.** Pick one extension framework, one auth stack, one primary proxy implementation, and as few supporting packages as possible. Keep proxy server software separately deployed, with configuration and integrations in our repository; do not vendor unnecessary upstream code.

## Mandatory selection checklist

1. Is the capability needed for a task that is currently unblocked?
2. Does the upstream project support the **exact** browser/network protocol we need?
3. Is commercial use compatible with the desired project distribution model?
4. What upstream license, notices, transitive copyleft, export/distribution restrictions apply?
5. Are there known vulnerabilities, abandoned dependencies, weak tests or high-risk permissions?
6. What is the minimum supported version/commit and reproducible build path?
7. Is reuse cheaper in integration, maintenance and Codex effort than writing a thin adapter?
8. Can we remove the dependency later without rewriting the system?

## Current provisional recommendation

Use WXT + official Chrome proxy/auth APIs as a **primary evaluation candidate**; compare with selectively adapting SuperTunnel before writing code. Investigate 3proxy for gateway behavior. Use mature auth, UI and testing libraries only if they simplify the **actual MVP**. WireGuard and full-device clients remain later. Do not import Windscribe/Mullvad/Proton source just to gain a feature list.

## Audit deliverables before implementation

`REPO_AUDIT.md`, `DEPENDENCY_LICENSE_MATRIX.md`, `BUILD_VS_REUSE.md` update, dependency/commit pin table, one-page trade-off decision in [DECISIONS.md](DECISIONS.md). Label assumptions vs tested evidence.
