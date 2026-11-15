# Complete clickable source and evidence index

**Snapshot:** 2026-11-16. Sources are stable repository URLs or official pages where possible. For any volatile count, consult the site and record the new retrieval date.

## Our repository and PR/CI evidence

- Project: https://github.com/rejoansardar23/vpn
- Working implementation: https://github.com/rejoansardar23/vpn/tree/feat/tested-private-browser-proxy
- Open implementation PR #1: https://github.com/rejoansardar23/vpn/pull/1
- Open Chromium revocation PR #4: https://github.com/rejoansardar23/vpn/pull/4
- Green implementation CI: https://github.com/rejoansardar23/vpn/actions/runs/43651339909
- Green revoked-grant CI: https://github.com/rejoansardar23/vpn/actions/runs/43653964275
- Past 23-list: https://github.com/rejoansardar23/vpn/blob/main/ALL_SUGGESTED_VPN_REPOSITORIES.txt
- Past networking selections: https://github.com/rejoansardar23/vpn/blob/main/SELECTED_VPN_REPOSITORIES.txt
- Existing architecture (working branch): https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/ARCHITECTURE.md
- Existing security: https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/SECURITY_AND_PRIVACY.md
- Existing validation: https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/VALIDATION.md

## All 23 candidate GitHub repositories (original order)

1. https://github.com/wxt-dev/wxt
2. https://github.com/SuperPlugs/SuperTunnel
3. https://github.com/Hiddence/Hiddence-Shield-Extension
4. https://github.com/Windscribe/browser-extension-mv3
5. https://github.com/Windscribe/browser-extension
6. https://github.com/ProtonVPN/proton-vpn-browser-extension
7. https://github.com/apify/proxy-chain
8. https://github.com/3proxy/3proxy
9. https://github.com/OutlineFoundation/outline-server
10. https://github.com/WireGuard/wireguard-go
11. https://github.com/OutlineFoundation/outline-apps
12. https://github.com/mullvad/mullvadvpn-app
13. https://github.com/better-auth/better-auth
14. https://github.com/keycloak/keycloak
15. https://github.com/0xERR0R/blocky
16. https://github.com/AdguardTeam/dnsproxy
17. https://github.com/shadcn-ui/ui
18. https://github.com/caddyserver/caddy
19. https://github.com/prometheus/prometheus
20. https://github.com/microsoft/playwright
21. https://github.com/gitleaks/gitleaks
22. https://github.com/aquasecurity/trivy
23. https://github.com/whitequark/ipaddr.js

## Additional discovered candidates

- https://github.com/ProtonVPN/android-app
- https://github.com/ProtonVPN/win-app
- https://github.com/amnezia-vpn/amnezia-client
- https://github.com/ivpn/desktop-app
- https://github.com/pia-foss/desktop
- https://github.com/wg-easy/wg-easy
- https://github.com/netbirdio/netbird
- https://github.com/firezone/firezone

## Winner 1 pinned sources — Mullvad

Revision: https://github.com/mullvad/mullvadvpn-app/tree/e8fd32f6bb7969e095b3a8056d3c39424861cd86

- Country/relay API: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-api/src/relay_list.rs
- Country/city/relay data: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-types/src/relay_list.rs
- Relay selector: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-relay-selector/src/relay_selector/mod.rs
- Filter/reject reasons: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-relay-selector/src/relay_selector/filter.rs
- Daemon connection params: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-daemon/src/tunnel.rs
- Selection design: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/docs/relay-selector.md
- GPL license: https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/LICENSE.md

## Winner 2 pinned sources — Amnezia

Revision: https://github.com/amnezia-vpn/amnezia-client/tree/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7

- Provider account/country metadata: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/models/api/apiConfig.h
- Availability/premium UI: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/models/serverDescription.cpp
- Country-specific config/API: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/api/subscriptionController.cpp
- Backend gateway controller: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/gatewayController.cpp
- Self-hosted server repo: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/repositories/secureServersRepository.cpp
- SSH/protocol install: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/selfhosted/installController.cpp
- Connection controller: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/connectionController.cpp
- OS connection: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/vpnConnection.cpp
- Kill switch service: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/service/server/killswitch.cpp
- GPL license: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/LICENSE
- Third-party licenses: https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/THIRD_PARTY_LICENSES.md

## Third-place comparison source (not a winner)

Proton Android revision: https://github.com/ProtonVPN/android-app/tree/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e

- Server tier, score, load and country: https://github.com/ProtonVPN/android-app/blob/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e/app/src/main/java/com/protonvpn/android/servers/Server.kt
- Selection: https://github.com/ProtonVPN/android-app/blob/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e/app/src/main/java/com/protonvpn/android/utils/ServerManager.kt
- API directory refresh: https://github.com/ProtonVPN/android-app/blob/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e/app/src/main/java/com/protonvpn/android/servers/UpdateServerListFromApi.kt
- Load updates: https://github.com/ProtonVPN/android-app/blob/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e/app/src/main/java/com/protonvpn/android/servers/UpdateLoadsFromApi.kt
- Eligibility and connection: https://github.com/ProtonVPN/android-app/blob/deb11fef4092a1ecfcf51a7d40bdece9eb4c3e5e/app/src/main/java/com/protonvpn/android/vpn/VpnConnectionManager.kt

## Official volatile country/price/operational sources

- Mullvad server directory (live counts): https://mullvad.net/en/servers
- Mullvad pricing: https://mullvad.net/en/pricing
- Amnezia Premium/Free FAQ, 61 location entries, free restrictions: https://docs.amnezia.org/faq/
- Amnezia location-selection help and physical-server claims: https://docs.amnezia.org/documentation/instructions/choose-location/
- Amnezia site: https://amnezia.org
- Proton Free server-country list and cooldown: https://protonvpn.com/support/change-server-free-plan
- Proton free plan: https://protonvpn.com/support/proton-vpn-plans
- Proton speed/load rules: https://protonvpn.com/support/increase-vpn-speeds
- Outline manager/server: https://github.com/OutlineFoundation/outline-apps/tree/master/server_manager

All provider counts are historical snapshots; they do not authorize our use of provider endpoints.
