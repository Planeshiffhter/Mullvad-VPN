# Project chronicle — reconstructed conversation and decision archive

**Purpose:** preserve *material* VPN project instructions and decisions, including prior chats, so future developers do not depend on the ChatGPT message history. **Not a complete verbatim transcript**; only recoverable conversation context and verifiable repository outcomes are represented.

## 2026-11-12 — initial VPN startup plan

- Owner wants an original VPN software company and a product that can become competitive with major VPN platforms, rather than a copied proprietary service.
- Start with a **Chrome extension and one US location**, optionally add 1–2 countries, then expand globally.
- Long-term Windows, Android, Linux, macOS, browser and other clients; country/city/server selection, fastest usable server, connect/disconnect, credentials, security, DNS/IPv4/IPv6/WebRTC privacy, split tunneling, app restrictions/entitlements, and operating capacity.
- Working model: founder and GPT-6 Astra/Codex Cloud writing/testing code on GitHub. User prefers web tools; no requirement for local development tools.
- The private prototype must incur **$0 additional spending**, including no paid hosts or APIs, domains, paid monitoring, commercial publication or automatic subscription activations. Provider credits/trials are NOT equivalent to guaranteed $0 ongoing cost.
- Browser proxy is distinctly not full-device VPN. Native tunneling is a separate future milestone.
- Document a numbered, dependency-aware plan and costs/security gates.

## 2026-11-13 — continuity and research-before-build

- The user repeatedly asked to save **all important project plans, choices, repo candidates, requirements and handoffs in GitHub** so contributors and future AI agents can continue without the conversation.
- The default `main` branch was used for planning materials, including `README.md`, `AGENTS.md`, `TASKS.md`, docs for goals/architecture/security/cost/deployment/decisions, contributor guidance and original source plans.
- Chosen pattern: one owner-controlled monorepo, research mature open-source components before implementing; do not combine several frameworks solving the same task or copy a whole competitor repo without license clearance.
- Early candidates: WXT, SuperTunnel, Windscribe/Proton extension examples, proxy-chain, 3proxy, Outline, WireGuard, Better Auth, Keycloak, Blocky/dnsproxy, Caddy, Prometheus, Playwright, Gitleaks, Trivy, IPAddr.js.

## 2026-11-14/15 — existing working implementation and CI

- Implementation branch is `feat/tested-private-browser-proxy`, under [PR #1](https://github.com/rejoansardar23/vpn/pull/1) targeting `main`.
- Architecture remained owner-written **TypeScript Chrome MV3 extension + Node HTTPS control API + SQLite (scrypt founder) + proxy-chain@3.0.3 authenticated TLS forward gateway + ipaddr.js@2.3.0** for special-use address restrictions, with expiring/revocable grants and quotas.
- Features reported and tested on local fixtures: founder login, TLS API, grant issue/revocation/replacement, HTTP forwarding, HTTPS CONNECT forwarding while preserving destination TLS, destination/IP/DNS restrictions, quotas, traffic metering, Connect/Disconnect, proxy and WebRTC restoration, browser automated tests, archive packaging, secrets scan, recovery tools.
- Baseline implementation `8eeb33ea`, GitHub Actions [run 43651339909](https://github.com/rejoansardar23/vpn/actions/runs/43651339909): 59 pass / 0 fail / 0 skip. No live US service.
- [PR #2](https://github.com/rejoansardar23/vpn/pull/2), architecture/reuse audit, and [PR #3](https://github.com/rejoansardar23/vpn/pull/3), pinned Gitleaks CI, were merged into the implementation branch (not default `main`).
- Earlier repo selection stored as [SELECTED_VPN_REPOSITORIES.txt](../../SELECTED_VPN_REPOSITORIES.txt): **proxy-chain** for present browser gateway and **wireguard-go** for future native tunneling. These are upstream *components*, not best all-around country-management exemplars.
- Must inspect latest commits/tests before asserting a task complete; skip is not pass.

## 2026-11-15 — focused real-Chromium failure regression

- A later implementation request required **genuine Chromium after server-side revocation**, not popup-only assertions: sign in on real MV3, connect to local test TLS proxy, prove HTTP/HTTPS CONNECT passed gateway, revoke grant from founder API, retry **unique uncached URL**, prove destination counter stays zero, gateway rejection is counted, Chrome proxy is not silently disabled; then explicitly disconnect and restore settings.
- Code branch `test/chromium-revoked-grant-no-direct-fallback` / [PR #4](https://github.com/rejoansardar23/vpn/pull/4), commit `a846be8afdaca6711d2d6743409e38fa49cc8aaf`, targets the implementation branch.
- Modified eight files including `tests/chromium-route.test.js`, `tests/gateway.test.js`, gateway aggregate rejection stats, GitHub Actions trigger and implementation docs.
- [GitHub Actions 43653964275](https://github.com/rejoansardar23/vpn/actions/runs/43653964275) on Node 24.22.1 / Ubuntu 24.04 passed **59/59, zero failed/skipped**. Actual MV3 test executed, including negative-route assertions. Pinned Gitleaks, frozen npm install, types, build, ZIP checks, npm audit, whitespace also passed.
- Exact scoped result: **no direct fallback in the tested local Chromium revoked-grant scenario**. NOT an independently certified browser-wide kill switch, real Chrome owner device, physical US exit, or native VPN.
- Outage, service-worker suspension/restart, browser restart, network changes, DNS/WebRTC/IPv6 leaks remain separately test-gated. Existing simulated controller tests do not count as real Chrome lifecycle evidence.
- PR #4 remains open; no auto-merge.

## 2026-11-15/16 — 23-candidate independent architectural study

- Requested a fresh review of all **23 previously suggested** repositories plus newly discovered ones; do not accept prior AI recommendations by default. Scores: country 25, VPN 20, current fit 15, security 15, license 10, maintenance 10, costs 5.
- User demanded examination of **real provider free/paid countries**, server directory vs live API vs owned infrastructure; full country->eligible server->grant->tunnel->verified exit flow; host cost/authorization; GPL/AGPL commercial implications; no unauthorized access or private endpoint scraping.
- Independent *study* winners: [mullvad/mullvadvpn-app](https://github.com/mullvad/mullvadvpn-app) (country, city, relay selection, client/daemon) and [amnezia-vpn/amnezia-client](https://github.com/amnezia-vpn/amnezia-client) (complementary self-hosted deployment and provider-owned configurations). Both GPL-3.0, **architectural reference only**.
- Third-place Proton Android had excellent free/premium/score/maintenance logic but is platform/provider dependent. Other discoveries included PIA Desktop, IVPN, Outline client/manager, NetBird, wg-easy, Firezone.
- Prior assistant research snapshot gave Mullvad **50 countries/91 cities**, and Amnezia FAQ **61 location entries** (not necessarily 61 unique countries); provider offerings are not our owned infrastructure. Free country counts require official verification date and may change.
- Complete matrix, score details, deep source paths and official links are in [REPOSITORY_RESEARCH.md](REPOSITORY_RESEARCH.md) and [SOURCE_INDEX.md](SOURCE_INDEX.md).

## 2026-11-16 — durable GitHub handoff request

- User reports long ChatGPT conversations are difficult to reload and requests that **research, prior decisions, chats, charts, links, reports and continuation instructions** be pushed to GitHub in navigable documents.
- This archive responds to that request without leaking user credentials, tokens or private account details.
- **Evidence limitations:** no guarantees of a full verbatim export of other archived chats. When a past answer differs from the live repository or official sources, the dated repository state and externally verifiable evidence prevail.

## Non-negotiable owner instructions (consolidated)

1. No additional spending ($0); never create a charged server/account/domain.
2. No automatically merged PR, GPL copied source, public uncontrolled proxy, permanent credential, TLS verification bypass, hidden paywall behavior or false VPN coverage claim.
3. Preserve tested code; avoid architecture-only or checklist-only implementation sessions. Use real tests, failure diagnosis, narrow code changes, separate PRs and reported CI.
4. Authenticate and restrict destinations at the server; test real browser routing and direct-bypass safety.
5. Clearly label statuses as **Implemented / Automatically tested / Manually verified / Simulated / Blocked / Deferred**.
6. Use the repo as the canonical handoff; new agents must read it before coding.
