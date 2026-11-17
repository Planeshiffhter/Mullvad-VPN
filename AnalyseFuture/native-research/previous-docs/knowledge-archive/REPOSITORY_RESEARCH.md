# Open-source VPN research — all 23 candidates and independent shortlist

**Research snapshot:** 2026-11-15, consolidated 2026-11-16. This document preserves a research comparison, **not** a claim of full upstream binary builds or a private-provider security audit. Revision hashes were inspected through GitHub source and REST metadata. Re-check upstream on integration day.

## Scope and evaluation

Product target: original multi-country browser-proxy service initially; separate later **full-device VPN** client/server ecosystem on Windows, Android, Linux, macOS (potential iOS). Need country/city datamodel, dynamic gateway directory, entitlement and load checks, honest exit routing, revocation, reliable reconnect, owned authorized infrastructure, minimal cost. Scores weigh country/server design 25, VPN networking 20, fit 15, security 15, licensing 10, maintenance 10, cost/integration 5 (total 100).

## All 23 pre-existing candidates

| # | Repository (source) | Primary category | License / observed caveat | Decision |
|---|---|---|---|---|
| 1 | [wxt-dev/wxt](https://github.com/wxt-dev/wxt) | Browser extension build framework | MIT | Not a VPN; no migration of working MV3 |
| 2 | [SuperPlugs/SuperTunnel](https://github.com/SuperPlugs/SuperTunnel) | Browser proxy/controller | MIT | Study UX/extension separation only |
| 3 | [Hiddence/Hiddence-Shield-Extension](https://github.com/Hiddence/Hiddence-Shield-Extension) | Browser proxy extension | MIT metadata | Secondary example, provider-dependency caution |
| 4 | [Windscribe/browser-extension-mv3](https://github.com/Windscribe/browser-extension-mv3) | Provider-operated browser VPN/proxy | MIT metadata (audit assets) | Study UX; proprietary service network not ours |
| 5 | [Windscribe/browser-extension](https://github.com/Windscribe/browser-extension) | Older browser extension | GPL-3.0 | Legacy; 2024 source push; not current foundation |
| 6 | [ProtonVPN/proton-vpn-browser-extension](https://github.com/ProtonVPN/proton-vpn-browser-extension) | Provider browser extension | GPL-3.0 | Study entitlement/UX, no code copying |
| 7 | [apify/proxy-chain](https://github.com/apify/proxy-chain) | TLS HTTP/CONNECT proxy engine | Apache-2.0 | **Already used `3.0.3`**, KEEP |
| 8 | [3proxy/3proxy](https://github.com/3proxy/3proxy) | Proxy daemon | GitHub SPDX NOASSERTION; audit exact license | Alternative, no demonstrated migration need |
| 9 | [OutlineFoundation/outline-server](https://github.com/OutlineFoundation/outline-server) | Shadowsocks proxy server + key REST API | Apache-2.0 | Real deployable proxy, different architecture |
| 10 | [WireGuard/wireguard-go](https://github.com/WireGuard/wireguard-go) | Userspace WireGuard protocol engine | MIT | **Future native candidate only**, NOT integrated |
| 11 | [OutlineFoundation/outline-apps](https://github.com/OutlineFoundation/outline-apps) | Proxy client, server manager/cloud regions | Apache-2.0 | Strong self-hosting comparison; not native tunnel equivalent |
| 12 | [mullvad/mullvadvpn-app](https://github.com/mullvad/mullvadvpn-app) | Complete native VPN client apps | GPL-3.0 | **FINAL STUDY WINNER #1** |
| 13 | [better-auth/better-auth](https://github.com/better-auth/better-auth) | Auth framework | MIT | Defer until external identities |
| 14 | [keycloak/keycloak](https://github.com/keycloak/keycloak) | IAM platform | Apache-2.0 | Excessive for founder account; defer |
| 15 | [0xERR0R/blocky](https://github.com/0xERR0R/blocky) | DNS blocking | Apache-2.0 | DNS/filtering later, not country system |
| 16 | [AdguardTeam/dnsproxy](https://github.com/AdguardTeam/dnsproxy) | Encrypted DNS proxy | Apache-2.0 | Alternative to Blocky; not both by default |
| 17 | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | Reusable UI | MIT | Optional later |
| 18 | [caddyserver/caddy](https://github.com/caddyserver/caddy) | HTTPS service | Apache-2.0 | TLS/deployment phase only |
| 19 | [prometheus/prometheus](https://github.com/prometheus/prometheus) | Metrics/monitoring | Apache-2.0 | Multi-server operations later |
| 20 | [microsoft/playwright](https://github.com/microsoft/playwright) | Browser testing | Apache-2.0 | **Already used `1.65.0`**, KEEP |
| 21 | [gitleaks/gitleaks](https://github.com/gitleaks/gitleaks) | Secret detection | MIT | **Pinned CI `v8.30.1`**, KEEP |
| 22 | [aquasecurity/trivy](https://github.com/aquasecurity/trivy) | Dependency/container vulnerability scanner | Apache-2.0 | Deferred |
| 23 | [whitequark/ipaddr.js](https://github.com/whitequark/ipaddr.js) | IPv4/IPv6 parsing | MIT | **Already used `2.3.0`**, KEEP |

Classification buckets: complete VPN applications (#12); browser proxy/VPN extensions (#2–6); VPN engines (#10); proxy data-plane/manager (#7–9, #11); authentication (#13–14); DNS privacy (#15–16); development UI (#1, #17); infrastructure (#18–19); validation/supply chain (#20–22); IP policy (#23). A framework, DNS utility or protocol engine is NOT a complete VPN service.

## Additional candidates screened

| Repository | Type, useful capability | Limit |
|---|---|---|
| [ProtonVPN/android-app](https://github.com/ProtonVPN/android-app) | Android native VPN, server tier/free access, score/load, country/city, connect/fallback | GPL and Proton's backend |
| [ProtonVPN/win-app](https://github.com/ProtonVPN/win-app) | Windows native client | GPL, proprietary provider service |
| [amnezia-vpn/amnezia-client](https://github.com/amnezia-vpn/amnezia-client) | Multi-platform VPN; SSH/self-hosted install and provider accounts | GPL and dependency complexity; **winner #2** |
| [ivpn/desktop-app](https://github.com/ivpn/desktop-app) | Native daemon/client, privacy and connection ops | GPL, provider infrastructure |
| [pia-foss/desktop](https://github.com/pia-foss/desktop) | C++ desktop region metadata and services | Provider-specific directory |
| [wg-easy/wg-easy](https://github.com/wg-easy/wg-easy) | Self-hosted WireGuard management UI | Not consumer country/relay catalog |
| [netbirdio/netbird](https://github.com/netbirdio/netbird) | WireGuard enterprise/private network control plane | Zero-trust private network focus; exact license terms must be audited |
| [firezone/firezone](https://github.com/firezone/firezone) | Identity-oriented network access | Not a consumer public exit-country service |

## Weighted shortlist (comparative, uncertainty +/- several points)

| Candidate | Country/25 | Network/20 | Fit/15 | Security/15 | License/10 | Maint./10 | Cost/5 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| **Mullvad VPN App** | 23 | 19 | 8 | 12 | 5 | 9 | 2 | **78** |
| **Amnezia VPN Client** | 20 | 17 | 12 | 9 | 5 | 8 | 3 | **74** |
| Proton VPN Android | 24 | 17 | 5 | 12 | 5 | 8 | 1 | 72 |
| PIA Desktop | 20 | 18 | 5 | 11 | 5 | 8 | 1 | 68 |
| IVPN Desktop | 17 | 17 | 6 | 11 | 5 | 8 | 2 | 66 |
| Outline Apps | 11 | 11 | 10 | 11 | 10 | 8 | 3 | 64 |
| Windscribe MV3 | 18 | 5 | 11 | 9 | 6 | 7 | 2 | 58 |

Rationale: Mullvad has inspectable country->city->relay->WireGuard selector/daemon code. Amnezia offers independent server provisioning and separate provider-vs-selfhosted config. Proton Android's free/premium/data design is excellent but Android/provider-specific. Outline is permissively licensed and useful for cloud geography but is a Shadowsocks proxy/control application, not a complete native-country VPN.

## EXACT two architectural-study selections

### 1. Mullvad — https://github.com/mullvad/mullvadvpn-app

Inspected revision: [`e8fd32f6bb7969e095b3a8056d3c39424861cd86`](https://github.com/mullvad/mullvadvpn-app/tree/e8fd32f6bb7969e095b3a8056d3c39424861cd86). GPL-3.0. Rust/native cross-platform. Real country/city/relay representations; cached remote relay directory; active/weight/filtering; single/multihop constrained endpoint selection; daemon and WireGuard configuration. Provider-owned servers, credentials and backend **do not ship as ours**. Large build/platform complexity and GPL obligations; do not copy into TypeScript MVP. Recent source activity inspected 2026-11-13; releases inspected 2026-11-10 beta / 2026-09-30 stable Android. No full upstream build/security verification performed.

Inspect source: [relay directory API](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-api/src/relay_list.rs), [relay geographic types](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-types/src/relay_list.rs), [relay filtering](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-relay-selector/src/relay_selector/filter.rs), [endpoint selection](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-relay-selector/src/relay_selector/mod.rs), [daemon tunnel params](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-daemon/src/tunnel.rs), [selector documentation](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/docs/relay-selector.md).

Source warning: `RelayListProxy::relay_list()` has a code comment indicating some transparency verification failures are logged without failing that fetch path. This is NOT proof of an exploitable vulnerability, but a verification-policy design point worth reviewing.

### 2. Amnezia — https://github.com/amnezia-vpn/amnezia-client

Inspected revision: [`5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7`](https://github.com/amnezia-vpn/amnezia-client/tree/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7). GPL-3.0. C++/Qt, native Windows/macOS/Linux/Android/iOS. Separate provider Free/Premium subscription data vs self-hosted server SSH/install/protocol configuration; actual location flags in `ApiConfig` and selectable country restrictions in `ServerDescription`. SSH/Docker/protocol installers and platform routing/killswitch code; large external dependency surface with some AGPL/GPL/LGPL/MPL obligations. Do not copy private provider API implementation or deployment scripts without technical/legal review. Recent source 2026-11-14; stable release `5.1.0.6` observed 2026-11-02.

Inspect source: [provider config model](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/models/api/apiConfig.h), [country display/entitlement](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/models/serverDescription.cpp), [subscription/country configuration request](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/api/subscriptionController.cpp), [gateway API](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/gatewayController.cpp), [owned server registry](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/repositories/secureServersRepository.cpp), [self-hosted installer](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/selfhosted/installController.cpp), [VPN connect/disconnect controller](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/connectionController.cpp), [platform killswitch](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/service/server/killswitch.cpp).

Security limitations: Amnezia Free intentionally does selective destination tunneling; never use as proof of a full-tunnel fail-closed app. A reported macOS waking/DNS status issue must be independently reproduced before drawing global conclusions. Third-party licenses require per-artifact audit.

## Provider country facts (NOT our operational inventory)

| Provider | Official observed offerings on 2026-11-16 | Free behavior | User selection |
|---|---|---|---|
| Mullvad | [Live servers](https://mullvad.net/en/servers): **50 countries, 91 cities, 570 records**; site snapshot **539 online, 31 offline** | No provider free-country plan | Country/city/relay selection for subscribed users |
| Amnezia Premium | [FAQ](https://docs.amnezia.org/faq/): **61 named location entries**, which are **not** 61 distinct countries; US NY and LA are separate | [Amnezia Free](https://docs.amnezia.org/faq/) has NO user-selectable country list | Premium location choice; country options can disappear due to restrictions |
| Proton Free (comparison only) | [Official](https://protonvpn.com/support/change-server-free-plan): Netherlands, Japan, Romania, Poland, Norway, Switzerland, Singapore, Mexico, Canada, USA | Ten listed country choices form backend pool, not unconstrained country picking | Automatic fastest; subsequent random server change with cooldown |
| Windscribe Free (comparison only) | Official list historically included US, Canada, UK, Hong Kong, France, Germany, Netherlands, Switzerland, Norway, Romania; verify live policy before using as current | Free allowance and account status restrictions | Provider-controlled |
| OUR company | **Zero authorized, live, verified country endpoints** | No actual service yet | Local fixture only |

**Do not confuse:** (A) advertised provider locations, (B) source fixtures, (C) backend API response, (D) independently deployable software, (E) **actual authorized and owned server**. Provider IPs/keys are not ours; never scrape, bypass restrictions or advertise these countries.

## Strongest rejected option: Proton Android (source-level note)

Inspected revision [`deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e`](https://github.com/ProtonVPN/android-app/tree/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e), GPL-3.0. `app/src/main/java/com/protonvpn/android/servers/Server.kt` has `tier`, `score`, `load`, `online`, `city`, `hostCountry`, and separate `entry/exitCountry`. `utils/ServerManager.kt` provides `getBestScoreServer()` and `forConnectIntent()` for fastest-in-country/city/exact server; `servers/UpdateServerListFromApi.kt` fetches provider list; `servers/UpdateLoadsFromApi.kt` applies dynamic binary status. `vpn/VpnConnectionManager.kt` checks online and `hasAccessToServer()` before connecting; reports Maintenance/upgrade restrictions. High research value but Android and proprietary backend prevent it from replacing our owned multi-platform infrastructure.

## Decision and uncertainty

These **two** winners are best architecture-study complements, not mandatory dependencies. Direct Chrome MV3 and proxy-chain remain current. Country counts and prices are snapshots. GitHub SPDX alone does not settle submodule/dependency/trademark/API rights. No independent repository build, penetration test, or end-to-end provider API test was performed during this research.
