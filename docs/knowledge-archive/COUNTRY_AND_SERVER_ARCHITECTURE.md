# Country-to-connection architecture: research, proposed types, verification and tests

**Status: design proposal only, 2026-11-16. No live US/multi-region servers are deployed.** This file separates observed upstream code from our intended original implementation.

## 1. Three separate planes

~~~text
                          CONTROL PLANE
Chrome MV3 / future native app
    | GET eligible countries/cities/servers; POST route grant
    v
Our TypeScript HTTPS Control API --> SQLite founder + future entitlements
    | directory + independent health + selection policy
    +--> COUNTRY -> CITY -> DATACENTER -> GATEWAY
    |         + physical vs virtual | provider/authorized owner
    +--> signed/validated directory snapshot (future)
    +--> short-lived server-issued grant
    |
    +------------ DATA PLANE (currently Chrome only) ------------
    |
Chrome browser -- authenticated TLS proxy --> Owner-controlled proxy gateway
                                              | destination restrictions/quota
                                              +--> public HTTP, HTTPS CONNECT
                                                    (destination TLS preserved)

    +------------ FUTURE NATIVE DATA PLANE (NOT built) ----------
Windows/Android/Linux/macOS OS VPN/TUN -> reviewed WireGuard/platform engine
    -> owner-controlled WireGuard gateway -> Internet
   (OS DNS/kill-switch/routing separate, per-platform tests required)
~~~

Chrome's control API does not forward browser traffic. The present proxy must not be described as a full-device VPN.

## 2. Research findings: Mullvad country flow

Inspected Mullvad revision [`e8fd32f`](https://github.com/mullvad/mullvadvpn-app/tree/e8fd32f6bb7969e095b3a8056d3c39424861cd86).

| Lifecycle | Upstream function/source | What it proves (and does not) |
|---|---|---|
| Fetch remote server directory | [`RelayListProxy::relay_list()`](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-api/src/relay_list.rs) | Parses provider relay list, hashes/cache; server list still needs provider operation |
| Represent directory | [`RelayList`, `RelayListCountry`, `RelayListCity`, `WireguardRelay`](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-types/src/relay_list.rs) | Country/city/relay/host/IP/status/weight fields |
| Filter relay constraints | [`partition_relays()`, `usable_as_exit()`](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-relay-selector/src/relay_selector/filter.rs) | Filters location/provider/ownership/activity and entry/exit compatibility |
| Select endpoint | [`RelaySelector::get_relay_by_query()`](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-relay-selector/src/relay_selector/mod.rs) | Selects matching relay + WireGuard endpoint; random weighted != measured lowest latency |
| Build tunnel | [`InnerParametersGenerator::generate()`](https://github.com/mullvad/mullvadvpn-app/blob/e8fd32f6bb7969e095b3a8056d3c39424861cd86/mullvad-daemon/src/tunnel.rs) | Uses authorized device parameters and selected endpoint to configure VPN |
| State and privacy | Daemon/state/OS modules | Need actual platform validation; no universal fail-closed inference from source alone |

## 3. Research findings: Amnezia two-path country flow

Inspected Amnezia revision [`5c732f6`](https://github.com/amnezia-vpn/amnezia-client/tree/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7).

| Path | Source | Important separation |
|---|---|---|
| Provider subscription | [`ApiConfig`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/models/api/apiConfig.h) with `availableCountries` and `serviceType` | API location metadata belongs to provider, not independent operator |
| Provider UI eligibility | [`buildServerDescription(ApiV2ServerConfig)`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/models/serverDescription.cpp#L154-L171) | Free plan hides country picker; premium may show country list |
| Country-specific config retrieval | [`SubscriptionController::updateServiceFromGateway()`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/api/subscriptionController.cpp) | Country+protocol checked then backend returns server configuration |
| Self-hosted server store | [`SecureServersRepository`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/repositories/secureServersRepository.cpp) | Operator-owned host configuration & stable server identities |
| Self-hosted install | [`InstallController`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/selfhosted/installController.cpp) | SSH, host preparation, selected protocol provisioning; requires authorized server |
| Local connect | [`ConnectionController`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/core/controllers/connectionController.cpp) -> [`VpnConnection`](https://github.com/amnezia-vpn/amnezia-client/blob/5c732f6edc70fcdaf68ac4c24a713b9e8e9352b7/client/vpnConnection.cpp) | Connection/OS state; independent public exit-IP verification still needed |

## 4. Project-owned location schema (future)

Use strict, independently authored TypeScript interfaces. Do **not** import GPL source. Add only the minimum fields needed in the smallest approved milestone; these are architectural targets rather than an instruction to create 15 database tables immediately.

| Entity | Essential fields | Trust source |
|---|---|---|
| Country | ISO-3166-1 alpha-2; localized display name; visibility; reason if disabled | Explicit owner/admin configuration |
| City | Country code; stable ID; display name; optional coordinates | Owner deployment record |
| Datacenter | Provider; provider region; physical/virtual classification; legal authorization; status | Provider/owner documentation, not IP GeoIP alone |
| Gateway | Immutable ID; country/city/site; transport scheme/host/port; protocol; version; enabled/live flag | Server-side administrator |
| Server | Gateway relation, instance ID, current health, capacity, supported IP families | Owner inventory + trusted health |
| ExitIdentity | Expected/observed IPv4/IPv6, verification timestamp, method, claimed country confidence | Independent on-path check; may be stale |
| ProtocolCapability | `chrome-https-proxy` or future `wireguard`; ports/version/features | Server/client compatibility checks |
| Entitlement | Account; free/premium restrictions; valid dates; allowed country/city/gateway tiers | Server-side account, not UI flag |
| Health | `online`, `degraded`, `maintenance`, `offline`, `unknown`; lastSeen; load; RTT | Trusted health, bounded freshness |
| ConnectionGrant | Secret/id, gateway, account scope, issue/expiry, revoked, maxBytes | Server-side controlled issuance |
| ConnectionAttempt | Selection request, selected gateway, error reason, verify timestamp/exit proof | Client state plus independent verifier |

Use branded names/locations only after authorization. Do not infer an actual exit country from a fixture's ISO code.

## 5. Deterministic selection policy

Recommended pure function signature (not yet implemented):

~~~ts
type SelectResult =
  | { ok: true; gatewayId: string; reason: 'eligible'; directoryRevision: string }
  | { ok: false; reason:
      'NO_CONFIGURED_GATEWAYS' | 'LOCATION_UNAVAILABLE' |
      'NOT_ENTITLED' | 'UNSUPPORTED_PROTOCOL' |
      'NO_HEALTHY_GATEWAY' | 'CAPACITY_EXHAUSTED' |
      'DIRECTORY_STALE' };
selectEligibleGateway(directory, userRequest, entitlement, now): SelectResult
~~~

The selector must:
1. Validate the directory revision/schema; reject unknown gateway IDs, untrusted URLs or invalid ports and protocols.
2. Include only **operator-authorized, configured** gateways; prevent presentation of a hostless speculative location as Connectable.
3. Respect exact country/city/server user requests; no undocumented country reassignment.
4. Check account entitlement and expiry **server-side** before issuing grant.
5. Filter by browser/native transport and target IP-family capability.
6. Exclude stale/unknown health, maintenance, offline, over-capacity and disabled nodes.
7. Rank remaining nodes by measured, recent RTT and load with documented weights; tie-break stably by gateway ID. Never conflate Mullvad relay weight with ping.
8. Return an explicit unavailability/error reason if no eligible gateway. **Never** return a `direct` proxy mode, OS bypass, or another country's server without specific policy and user approval.
9. Re-evaluate entitlement, selected node health and revocation atomically at issuance/connection boundaries; selection success is *not* equivalent to connection success.
10. Emit no secret credentials or full browsing URL in public directory/diagnostics.

## 6. Connection-state verification and failure

~~~text
DISCONNECTED
  -> CONNECTING (directory selection + grant)
  -> CONFIGURING (Chrome proxy or future native tunnel)
  -> VERIFYING (observed exit IP + proxy ownership + route check)
  -> VERIFIED (live only if evidence + expected location agree)
  -> DEGRADED / ERROR (route mismatch, expiry, outage, policy loss)
  -> explicit DISCONNECT (restore only owned browser/OS settings)
~~~

- Browser: retain extension-owned proxy rules on verification errors until explicit Disconnect; do not intentionally direct-fallback. This still does not constitute a browser-wide kill switch.
- Native: OS-specific fail-closed firewall/DNS/IPv6/routing; requires privileged code and independent platform tests. Network roaming/resume/restart must preserve safe policy.
- Failover: only to another *authorized compatible gateway*, with precise country-selection semantics and new verification; never silent direct Internet.
- Status: a tunnel-driver event alone cannot verify exit-country identity; show unknown/degraded unless independent evidence is current.
- Do not intercept destination TLS or disable certificate verification in tests/production.

## 7. Country UI should not lie

For each country expose a clear availability reason: `available` only when authorized + compatible + entitled + healthy; `premium` when entitlement is missing; `maintenance` if explicitly disabled; `unavailable` when no running endpoint; `unknown` when health/infrastructure evidence is absent. Premium badges must reflect actual server-enforced restrictions; never use a country flag as live proof.

For a private $0 prototype, show only a **LOCAL FIXTURE** marker until a real host passes authorization, physical-region and independent exit checks. A proposed US/Germany/Japan/Singapore label remains disabled and cannot issue a live grant.

## 8. Tests the new code must satisfy

- Empty directory and country with no owned gateway.
- Exact country/city/server constraints; forbidden host/protocol/port values.
- Free/premium/expired-account and gateway-specific entitlement.
- Maintenance/offline/stale health/unknown health/overcapacity.
- Multiple gateways: deterministic order-independent selection and stable tie break.
- Unauthorized but fast gateway must lose to eligible slower gateway.
- Changed/revoked grant during selection or verification cannot be shown Connected.
- Changed country/network must never silently direct-bypass.
- Existing real Chromium HTTP/HTTPS Connect/Disconnect/revocation regression remains passing.
- A browser simulator restart does not prove actual MV3 service-worker suspension; keep separate CI.
- No U.S. hosting or owner-device protection claims from controlled fixtures.
