# Latest implementation status and GPT-6 Astra/Codex continuation prompt

**Snapshot: 2026-11-16. This is the primary no-chat handoff.**

## Repository and commit truth

| Item | Exact location/status |
|---|---|
| Repo | https://github.com/rejoansardar23/vpn |
| Default main | `0768ea7d991166231df782942d6227c08728be0e` — documentation/planning, not current implementation |
| Working branch | `feat/tested-private-browser-proxy` at `8eeb33eab5209272cd9b5a919b2a04de52b88c7f` |
| Working PR | [#1](https://github.com/rejoansardar23/vpn/pull/1), open -> main |
| Revoked-grant change | `test/chromium-revoked-grant-no-direct-fallback` at `a846be8afdaca6711d2d6743409e38fa49cc8aaf` |
| Regression PR | [#4](https://github.com/rejoansardar23/vpn/pull/4), open -> working branch |
| Regression CI | [run 43653964275](https://github.com/rejoansardar23/vpn/actions/runs/43653964275): **59 passed, 0 failed, 0 skipped** |
| Node | **24.22.1** (`.node-version` in working branch) |
| Expected npm components | `proxy-chain@3.0.3`, `ipaddr.js@2.3.0`, Playwright `1.65.0` |
| Build/release | Private extension ZIP and checksum tested; no app-store publication |
| Deployments | No verified authorized US host, no paid resources |

## Files that matter before coding

- [Working README](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/README.md), [working AGENTS](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/AGENTS.md), [working TASKS](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/TASKS.md).
- [Core route controller](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/apps/extension/core.ts): login, route rules, grant, verify, fail/error, privacy restore.
- [Service worker](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/apps/extension/worker.ts): lifecycle/auth challenges.
- [Control API](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/services/control-api/server.ts): founder status, gateways and grant endpoints.
- [SQLite store](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/services/control-api/store.ts): accounts, sessions, grants, quota and revocation.
- [TLS proxy gateway](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/services/gateway/index.js); [destination policy](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/services/gateway/policy.js).
- [Real Chromium test](https://github.com/rejoansardar23/vpn/blob/test/chromium-revoked-grant-no-direct-fallback/tests/chromium-route.test.js), [extension tests](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/tests/extension.test.js), [gateway tests](https://github.com/rejoansardar23/vpn/blob/test/chromium-revoked-grant-no-direct-fallback/tests/gateway.test.js).
- [CI workflow](https://github.com/rejoansardar23/vpn/blob/test/chromium-revoked-grant-no-direct-fallback/.github/workflows/verify.yml).
- [Architecture](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/ARCHITECTURE.md), [build vs reuse](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/BUILD_VS_REUSE.md), [implementation roadmap](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/IMPLEMENTATION_ROADMAP.md), [validation](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/VALIDATION.md), [handoff](https://github.com/rejoansardar23/vpn/blob/feat/tested-private-browser-proxy/docs/HANDOFF.md).

## Last independently verified achievement

Actual unpacked MV3 Chromium connected to a **controlled local HTTPS proxy fixture**, tunneled HTTP and HTTPS CONNECT with metered gateway traffic; an authenticated different founder session revoked the grant; an uncached unique URL failed through gateway authentication while destination saw **zero requests**, and Chrome's extension-owned proxy/WebRTC settings remained until explicit Disconnect. This is not universal browser leak or kill-switch certification.

CI [43653964275](https://github.com/rejoansardar23/vpn/actions/runs/43653964275): Node 24.22.1; frozen npm install, strict TypeScript, 59/59 actual tests including real Chromium, build, ZIP/checksum, Gitleaks, npm audit (0 reported vulnerabilities), whitespace all passed. Standalone commands from previous user checklist were not each run separately; full `npm test` covered files. Do not exaggerate.

## Work remaining / owner-gated

- **Task 15:** real Chromium proxy outage after active connection; real MV3 suspension/browser restart and lost credentials; owner-device DNS/WebRTC/IPv6/network/sleep-wake checks. Existing unit simulated restart/outage do not prove real Chrome lifecycle.
- **Country abstraction:** independently design location-directory and selection policy; do not advertise synthetic countries as online. See [country design](COUNTRY_AND_SERVER_ARCHITECTURE.md).
- **Task 03/14/19/20:** authorized genuine US host, permitted $0 spend, real TLS + firewall, observed independent US exit verification, owner installation and observation; BLOCKED.
- Project license, production privacy/security review, provider quotas and off-host recovery incomplete.
- Native app work, country expansion, billing, app stores, public service and company launch DEFERRED.

## Choose one next milestone, not everything at once

**Immediate safety priority (suggested):** real Chromium failure/outage regression after PR #4 review. **Following research-driven milestone:** pure TypeScript country/eligibility/gateway selection policy with synthetic local fixtures. Neither justifies new cloud costs.

## Copy-ready next-session Codex prompt

~~~text
Act as GPT-6 Astra, principal TypeScript/network-security engineer.

Repository: https://github.com/rejoansardar23/vpn
Read first: docs/PROJECT_MEMORY.md and all files in docs/knowledge-archive/,
AGENTS.md, TASKS.md, docs/ARCHITECTURE.md, docs/SECURITY_AND_PRIVACY.md,
docs/COST_POLICY.md, docs/IMPLEMENTATION_ROADMAP.md and docs/HANDOFF.md.
The README on main is older than the actual implementation branch.

Inspect fresh branches, open PRs, source, CI and the exact latest SHAs.
PR #1 contains the working prototype on feat/tested-private-browser-proxy.
PR #4 contains the tested Chromium revoked-grant regression, and targets
the implementation branch. Do not auto-merge.

ONE TASK ONLY: Implement a real Chromium gateway-outage regression:
1. Reuse the isolated TLS control API + gateway fixture and unpacked MV3 test.
2. Authenticate founder, connect, prove real HTTP/HTTPS proxy traffic and
   gateway metering, and record proxy settings.
3. Stop the gateway without pressing Disconnect while Chrome is connected.
4. Request a fresh unique uncached destination URL.
5. Assert the destination received zero requests (fail if direct fallback).
6. Assert the extension did not intentionally switch to direct mode, still
   owns the proxy settings, and never falsely reports a verified live route.
7. If verifiable, trigger route check and inspect accurate error status.
8. Explicitly Disconnect and check prior proxy/WebRTC settings restoration.
9. Avoid weak/fake tests, silent retries, ignoring certificate validation,
   managed-browser policy overrides or production firewall changes.
10. Run focused tests, full npm tests, typecheck, build/package and CI,
    record exact pass/fail/skip evidence. Never call skipped tests passed.
11. Update TASKS, PROJECT_STATUS, VALIDATION, HANDOFF and this memory index
    with new SHA and CI link. One reviewable PR targeting current
    implementation branch; do not merge automatically.
Strict: $0 spending, local fixture only, no live US claim, no full-device
VPN claim, no new GPL code, no framework migration. Stop if a security
assertion fails and report it honestly.
~~~


## Subsequent pure country-policy milestone (after outage evidence)

Implement typed `Country`/`City`/`Gateway`/`Entitlement`/`Health` contracts and a pure `selectEligibleGateway()` on top of the **current** control API, without changing live route behavior. Tests should cover empty location, unavailable country/city, free-vs-premium authorization, stale/maintenance/offline health, protocol mismatch, deterministic ranking, and NO direct fallback. Keep Germany/Japan/US/Singapore as disabled synthetic test records until provider authorization and live verification.

## End-of-session reporting contract

For every code session report:
1. Latest branch/PR status and base/head SHA.
2. Exact task and files changed, code details and threat model.
3. Tests with commands and pass/fail/skip; actual browser vs simulation.
4. Actions run URL and build/package/security outcomes.
5. Commit and review PR, never automatic merge.
6. Licensing/cost impact, limitations, blockers, next smallest task.
