# Security, commercial licensing, infrastructure and zero-cost guardrails

**As of 2026-11-16. Security guidance, not an independent certification or legal opinion.**

## Mandatory separation: source code versus operating rights

Open source can grant rights to program code, **not** cloud CPU, bandwidth, static public IP, datacenter rack, TLS cert/domain ownership, VPN exit location, private API account, paid subscription, or permission to use another provider's production servers. A published provider server list is informational; never scrape private endpoints, extract credentials or treat it as our service.

If adding United States, Germany, Japan, Singapore (or any other country), independently confirm per location:
- A real physical or disclosed virtual server/VM with provider authorization, allowed VPN/proxy use, provider region, egress source IP and routing.
- Public reachable IP and approved firewall ports, trusted TLS issuance/renewal, secret storage, safe patching, emergency shutdown.
- CPU/RAM/disk/network/bandwidth/egress/IPv4 pricing and maximum liabilities, data retention, abuse complaints, provider terms, jurisdiction.
- Actual route/exit IP observed from the client AND separate independent verifier; GeoIP is evidence with limitations, not absolute proof.
- Key lifecycle, per-gateway entitlement/auth, quotas, live session revocation, replay prevention, health checks, monitoring, incident response and backups.
- Hard provider budget controls or genuine independently free permission. Application quotas alone do NOT cap provider bills.

Our company currently owns/operates **zero verified live locations** in this project. **$0 additional spending** remains a hard constraint. Do not provision a "free trial" that can charge after credits unless owner explicitly approves.

## Browser-proxy versus native VPN boundary

**Existing:** Chrome Manifest V3 `chrome.proxy`/`chrome.webRequest` and HTTPS forward proxy protect only Chrome traffic actually routed through that proxy. Destination website HTTPS remains end-to-end via CONNECT. Chrome proxy/UDP/DNS/WebRTC/IPv6, incognito, browser policy, PAC/fallback, worker suspension and network changes require real acceptance checks.

**Not implemented:** Windows/Android/Linux/macOS OS-level TUN device, routing table, firewall kill switch, OS DNS capture, device-wide VPN, native split tunneling or global fail-closed coverage. WireGuard userspace and other OS drivers are later separately audited native components.

"Proxy rules retained" is a verified programmatic property in one test; "**all traffic cannot leak**" is not proven.

## Security minimums

- TLS 1.2+ or better, fail closed on certificate errors; **never disable destination/provider TLS validation** to make test pass.
- Verify auth challenge exact proxy host/port; never forward proxy creds to website auth challenges.
- Server-side short-lived, independent, revokeable connection grants; never store permanent admin/proxy secrets in extension or Git.
- Destination-IP and port allow policy; all DNS answers checked, safe egress/firewall, IPv4-mapped-IPv6 and metadata/private/special-use networks blocked; DNS-pinning defenses against rebinding.
- Connection limits, bandwidth byte quotas, retention bounded, rate limits; do not expose anonymous or unrestricted proxy publicly.
- Browser route verifier must prove its requests actually crossed intended gateway; do not equate popup text with a working connection.
- Controlled revocation tests must assert zero destination arrivals after grant invalidation; distinguish real-browser evidence from simulated controller tests.
- Protect country-directory authenticity/freshness and secure backend entitlements; untrusted local UI flags do not authorize service.
- No unsupported "no logs", "fully anonymous", "unbreakable privacy", global kill switch, complete IPv6/WebRTC/DNS protection or independent audit claim.

## Licensing matrix: commercial relevance

| License | General commercial position | Obligations/review |
|---|---|---|
| MIT | Commercial and proprietary integration usually allowed | Retain license/copyright notices |
| Apache-2.0 | Commercial integration generally allowed | License/NOTICE, changed-file/patent/trademark conditions |
| GPL-3.0 | Commercial use allowed; distribution of covered derivative brings strong copyleft/source obligations | Legal review for intended product license, linking, bundling, modified binaries, distribution |
| AGPL-3.0 | Commercial use allowed; source obligations can apply to modified network-accessed software | Separate legal review for service/network distribution and code interactions |
| LGPL | Library-based copyleft | Linking/relinkability/version requirements |
| MPL-2.0 | File-level copyleft | Covered source-files and notices |
| Non-SPDX/custom/no-license | Cannot assume permission from stars/public availability | Inspect actual repository, submodules and third-party asset terms |

**Winning study repos Mullvad and Amnezia are GPL-3.0; architecture reference only.** Amnezia's [third-party list](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/THIRD_PARTY_LICENSES.md) explicitly records LGPL, MPL, AGPL, GPL and special Windows binary licenses. Their private provider service endpoints and trademarks are separately restricted and cannot become our service.

**Current permissive components:** `proxy-chain@3.0.3` Apache-2.0, `ipaddr.js@2.3.0` MIT, Playwright Apache-2.0, Gitleaks MIT, Node built-ins. Audit exact lockfile and transitive licenses when changed. Existing repo lacks a project-wide LICENSE decision; public GitHub visibility is not a reuse grant.

## Provider country snapshots are evidence only

| Source | Dated finding | Never infer |
|---|---|---|
| [Mullvad servers](https://mullvad.net/en/servers) | 2026-11-16: 50 countries, 91 cities, 570 relay records, 539 online / 31 offline at response snapshot | A free Mullvad tier, permission to resell/use their servers, or our live deployment |
| [Amnezia FAQ](https://docs.amnezia.org/faq/) | 2026-11-16: 61 Premium location entries incl US New York and Los Angeles and specialized labels; Free has no freely selectable country | 61 countries, independently deployable free servers, or full-tunnel Free coverage |
| [Proton free server help](https://protonvpn.com/support/change-server-free-plan) | Ten Free country entries with automatic fastest, randomized subsequent switch and cooldown | Country picker is unrestricted, or third parties may use provider network |
| [Outline Apps](https://github.com/OutlineFoundation/outline-apps) | Apache-2.0 client/manager supports admin deployment of independent Shadowsocks servers | Free cloud VPS, a global public country network, or native full-device VPN |

Counts change; refresh on next implementation and **do not hard-code marketing snapshots as live configuration**.

## Infrastructure cost and authorization preflight

Before even a one-user authorized US pilot, owner/engineer must explicitly verify:
- Provider plan, country, VM allocation, floating/stable IPv4 charge, inbound/outbound rates, expected costs and hard billing cap.
- Provider terms expressly permit VPN/proxy exit operations and acceptable port/network use.
- What the host bills when idle, across month-end and after free credits expire.
- Trusted DNS name/certificate (may use approved no-cost alternatives only with verified terms), firewall and graceful rollback.
- Test infrastructure remains loopback/isolated while blocked.
- No payment details, provider tokens, SSH keys, personal identifiers or billing secrets in repository docs.

## Verification-status vocabulary

- **Implemented:** source exists.
- **Automatically tested:** exact CI commit/test/log verified; no skipped browser proof.
- **Manually verified:** owner-controlled actual client/device and real authorized endpoint separately checked.
- **Simulated:** fake browser/runtime, fixture IP, local loopback or synthetic country.
- **Blocked:** a prerequisite such as paid/authorized hosting, owner acceptance or license is missing.
- **Deferred:** intentionally later feature.
