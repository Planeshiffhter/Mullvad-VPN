# Project status — factual inventory

> **Branch and evidence correction, 2026-11-16:** The table below is a *historical 2026-11-13 main-branch planning snapshot*, **not** the latest project-wide state. Functional implementation is on `feat/tested-private-browser-proxy` (open [PR #1](https://github.com/rejoansardar23/vpn/pull/1)); the open [PR #4](https://github.com/rejoansardar23/vpn/pull/4) adds a real-Chromium revoked-grant regression. The [PR #4 CI run](https://github.com/rejoansardar23/vpn/actions/runs/43653964275) passed 59 tests (0 fail, 0 skip). No live US exit or full-device VPN exists. **Use [PROJECT_MEMORY.md](PROJECT_MEMORY.md) and the implementation branch's PROJECT_STATUS for current engineering decisions.**

**As of 2026-11-13.** Keep this file up to date at every meaningful milestone.

| Item | Status | Evidence |
| --- | --- | --- |
| Product goals and first US prototype scope | Planned / documented | README, VISION_AND_SCOPE, original plan |
| 20-task cost/security-first sequence | Documented | TASKS.md and source-plans file |
| Architecture and open-source options | Candidate designs | ARCHITECTURE.md, BUILD_VS_REUSE.md |
| Working Chrome extension | **Not implemented / not verified** | No source code or test artifacts |
| Gateway/proxy server | **Not implemented / not verified** | No deploy/test evidence |
| Authorized free US exit host | **Unverified / blocked on preflight** | No provisioned host evidence |
| Account/control API and database | **Not implemented** | No code |
| Active authenticated connection | **Not verified** | No observed route/IP evidence |
| Automated security & leak tests | **Not implemented** | No CI/test results |
| Admin dashboard, website, billing | **Not implemented** | No code |
| Native full-device VPN | **Deferred** | Later milestone |
| Public commercial service | **Not launched** | No production verification |

Use five task states: **Not started / In progress / Blocked / Done / Deferred**. A task is Done only with recorded acceptance evidence. Never infer Done from a plan, UI prototype, generated script, or mock response.

**Historical source:** [VPN_Company_Launch_Plan_2026-11-12.md](source-plans/VPN_Company_Launch_Plan_2026-11-12.md). Plans and market comparison are not operational proof.
