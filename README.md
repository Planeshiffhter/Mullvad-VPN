# VPN Platform — open-source-first, company-owned VPN project

> **Branch-specific status (updated 2026-11-16):** This default `main` branch holds planning and documentation. **The working Chrome proxy implementation is on `feat/tested-private-browser-proxy`, open PR #1**, and its revoked-grant Chromium regression is on PR #4 targeting that implementation branch. [Run 43653964275](https://github.com/rejoansardar23/vpn/actions/runs/43653964275) passed 59 tests (0 failed/skipped). **There is still no authorized/verified live US exit or full-device VPN.** Do not mistake older main-only task documents for the latest implementation state.

**Start any new developer/AI session with [the durable project memory archive](docs/PROJECT_MEMORY.md)** (also available as a [complete Word document](docs/knowledge-archive/VPN_PROJECT_KNOWLEDGE_ARCHIVE_2026-11-16.docx)) — the conversation chronology, 23-project comparison, exactly two *architecture-study* winners, annotated source links, security/cost boundaries, the current PR status, and an executable next-session handoff.

## Our mission

Build an **original, trustworthy consumer VPN platform** that can eventually compete with market-leading products such as NordVPN, Proton VPN, and ExpressVPN in usability, privacy, reliability, performance, and breadth of features. The product and brand are independent. We will **not** copy proprietary code, infrastructure, assets, trademarks, or unverified privacy claims.

**Founder-first delivery:** a private Chrome Manifest V3 browser-proxy extension for one person with **one verified US exit location**, followed by 1–2 additional countries, then broader geographic coverage and genuine **full-device VPN clients** (desktop/mobile). A browser proxy is not a device-wide VPN.

**Development constraints:** GitHub + Codex Cloud; no local development-tool installation required for the primary build workflow; **$0 additional spending for the private prototype**. Do not provision paid infrastructure, register paid accounts, publish to stores, buy a domain, purchase credits, or add commercial APIs without a new explicit owner decision. Free hosting is a candidate, **not a promise**.

## New here? Start in this order

| Read | What you will learn |
| --- | --- |
| [START_HERE.md](docs/START_HERE.md) | 10-minute contributor onboarding and next action |
| [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) | What actually exists; what has not been built |
| [VISION_AND_SCOPE.md](docs/VISION_AND_SCOPE.md) | Product strategy, users, non-goals, success criteria |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Components, security boundaries, browser proxy vs VPN |
| [BUILD_VS_REUSE.md](docs/BUILD_VS_REUSE.md) | Open-source candidates, fit, license questions |
| [TASKS.md](TASKS.md) | Ordered tasks with current status and blockers |
| [SECURITY_AND_PRIVACY.md](docs/SECURITY_AND_PRIVACY.md) | Baseline controls, privacy and testing requirements |
| [COST_POLICY.md](docs/COST_POLICY.md) | Strict zero-additional-cost rules for prototype |
| [ROADMAP.md](docs/ROADMAP.md) | Private US MVP → commercial multi-platform service |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute and prove work |
| [AGENTS.md](AGENTS.md) | Operating instructions for Codex and other coding agents |

**Canonical earlier plan:** [VPN Company Launch Plan (2026-11-12)](docs/source-plans/VPN_Company_Launch_Plan_2026-11-12.md). It contains the original numbered 20-task sequence and later expansion tasks. Newer documentation adds open-source research and onboarding, but **does not override** its strict pilot cost and security requirements.

## What we're building first

1. Reproducible repo + tested development environment.
2. Authenticated **HTTPS-to-proxy transport** / forward proxy proof of concept with TLS verified end-to-end where supported; no interception of website HTTPS.
3. Founder account and minimal control API; expiring/revocable connection grants.
4. Manifest V3 Chrome popup with Connect / Disconnect and **real exit-route verification**.
5. Fail-safe handling, destination filtering, quotas, and DNS/WebRTC/IPv6/leak testing.
6. An **authorized US host** only if its real incremental cost is $0 and the provider permits the use.
7. Operational controls, backup/restore, accurate documentation, installable private release and real-device verification.

**Important:** Working buttons, mocked IP addresses, or server config files are **not** evidence of a live US connection.

## Design and ownership

- **One owner-controlled repository, modular monorepo architecture**; use packages/services from established open-source projects rather than pasting entire repositories together.
- **Research before implementation.** Evaluate license obligations, maintenance, security, testability, and total integration cost.
- Candidate components include [WXT](https://github.com/wxt-dev/wxt), official Chrome proxy APIs, [Better Auth](https://github.com/better-auth/better-auth), [shadcn/ui](https://github.com/shadcn-ui/ui), [Playwright](https://github.com/microsoft/playwright), [Gitleaks](https://github.com/gitleaks/gitleaks), established proxy software, and later WireGuard. These are **candidates, not installed dependencies**.
- Track ADRs and exact versions before implementation. Do not invent a VPN protocol or home-grown encryption.
- **Public repository:** do not commit personal details, production credentials, private endpoint credentials, recovery tokens, private keys, or billing data.
- **Code reuse is subject to upstream licenses.** Publicly visible code is not automatically freely licensed; project licensing remains an explicit decision in [docs/LICENSING.md](docs/LICENSING.md).

## Repository map

```text
README.md               Main entry point
AGENTS.md                Rules for Codex and other agents
TASKS.md                 One authoritative task tracker
CONTRIBUTING.md          Contributor workflow
SECURITY.md              Vulnerability-reporting guidance
docs/
  START_HERE.md          Beginner onboarding
  PROJECT_STATUS.md      Evidence-based status
  VISION_AND_SCOPE.md    Product, audience, MVP boundaries
  REQUIREMENTS.md        Functional / nonfunctional requirements
  ARCHITECTURE.md        Components and trust boundaries
  BUILD_VS_REUSE.md      Repo and dependency candidate matrix
  COMPETITOR_MATRIX.md   Product benchmark (research, not verified parity)
  ROADMAP.md             Phased delivery and milestones
  COST_POLICY.md         Zero-extra-spend prototype constraint
  SECURITY_AND_PRIVACY.md Threat model, safeguards, testing checklist
  TEST_STRATEGY.md       Verification and release gates
  DEPLOYMENT.md          US hosting preflight / release requirements
  DECISIONS.md           Architecture decisions + unresolved decisions
  LICENSING.md           Ownership and third-party license rules
  HANDOFF.md             Continuity checklist / Codex worklog protocol
  source-plans/          Historical verbatim source planning document
.github/                 Contributor issue and PR templates
```

**Current contents are documentation; source application folders will be created by the first implementation milestone, not faked in advance.**

## First contribution

Read [START_HERE.md](docs/START_HERE.md), choose the **first unblocked task** in [TASKS.md](TASKS.md), implement a small verifiable change, document actual test evidence, and submit a PR using the template. If a task requires a US server or owner-only verification and the prerequisite is unavailable, mark it **Blocked** and continue independent work.

Questions about the roadmap or a design choice? Open a GitHub issue; **do not depend on access to ChatGPT history**.
