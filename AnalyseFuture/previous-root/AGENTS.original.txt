# Agent operating contract (Codex Cloud and coding agents)

**Read all of:** [docs/PROJECT_MEMORY.md](docs/PROJECT_MEMORY.md), its linked knowledge archive, README.md, TASKS.md, docs/PROJECT_STATUS.md, docs/COST_POLICY.md, docs/SECURITY_AND_PRIVACY.md, docs/BUILD_VS_REUSE.md, docs/DECISIONS.md, and original source plan before major code changes. **Always inspect implementation branch `feat/tested-private-browser-proxy` and open PRs before coding; `main` may lag working code.**

## Mission and hard constraints

- Work on an original owner-controlled, open-source-first VPN product that can compete with leading commercial VPNs over time.
- Prototype is **single-user US Chrome browser proxy**, then additional countries, **then separate real full-device VPN clients**. Never conflate them.
- **$0 additional owner spending** for the prototype. Don't buy credits, spin up billable resources, subscribe to APIs, publish/pay for stores or silently use trials that may charge.
- Primary development in Codex Cloud + GitHub; do not require owner-side local developer installs. Owner's Chrome installation/manual testing remains a distinct acceptance step.
- No secrets or personal account details in public repo, logs, PRs, or prompts; no hard-coded shared proxy password.
- Do not invent encryption protocols, assert no-logs policy without implementation, disable TLS checks, or assume fail-closed behavior without tests.

## Workflow

1. **Inspect actual repository state** before building; no hallucinated source files or completed features.
2. Identify first unblocked TASKS.md item and dependencies; write a brief acceptance plan.
3. **Search and evaluate maintained open-source implementations first**; don't wholesale merge unrelated repos.
4. Validate third-party licenses (including transitive dependencies), source health, security, integration and cost.
5. Make a small functional change and run focused tests; record the real command/output and blocked checks.
6. Keep task tracker, project status, architecture/decision notes and cost inventory current.
7. Commit/push reviewable changes and give exact next step. If blocked by hosting, continue independent local tasks.
8. Report separately **Implemented**, **Tested**, **Manually Verified**, **Simulated**, **Blocked**, **Deferred**. Never claim a fake US location from a UI toggle.

## Security minimums

Exact-proxy-origin authentication challenge matching; server-enforced short-lived revocable credentials; restricted destinations and ports; transport TLS checks; no site HTTPS interception; no unrestricted public proxy; meaningful DNS/WebRTC/IPv6, outages, restart, failure and bandwidth-quota tests.

## No credit-wasting theater

Avoid speculative architecture rewrites, duplicate frameworks, hundreds of untested files, rerunning unchanged broad checks, or demos that don't move acceptance criteria. One reliable verified feature at a time.

## Required end-of-work report

Task ID, files/commit, what works, tests executed/results, security/licensing/cost impacts, what remains unverified, blockers, next action. See docs/HANDOFF.md.
