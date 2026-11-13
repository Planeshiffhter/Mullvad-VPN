# Start here — developer onboarding

**The full context is in this repository. You do not need access to prior ChatGPT conversations.**

## In 10 minutes

1. Read [../README.md](../README.md) for the mission and initial scope.
2. Read [PROJECT_STATUS.md](PROJECT_STATUS.md) before assuming any software exists.
3. Read [VISION_AND_SCOPE.md](VISION_AND_SCOPE.md) and [COST_POLICY.md](COST_POLICY.md) for product and spending boundaries.
4. Read [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY_AND_PRIVACY.md](SECURITY_AND_PRIVACY.md), and [BUILD_VS_REUSE.md](BUILD_VS_REUSE.md).
5. Read [../TASKS.md](../TASKS.md); select the earliest unblocked, suitably scoped task.
6. Follow [../CONTRIBUTING.md](../CONTRIBUTING.md). Coding agents also follow [../AGENTS.md](../AGENTS.md).

## Project in one paragraph

An owner-controlled, open-source-first **commercially oriented VPN product** built with GitHub and Codex Cloud. First deliverable is a **private, one-user, US-exit Chrome browser proxy** with an authenticated gateway, verified exit IP, no silent bypass during protected sessions, accurate status and strong server-side controls. Later: 1–2 extra countries, security/privacy improvements, native WireGuard-based full-device clients, accounts/billing, desktop/mobile, and eventual global operation. The founder's **prototype spending cap is exactly $0 extra**. Commercial production expansion will need separate budgeting and explicit approval.

## What is true today

- The original 20-task plan exists and is committed as a source document.
- Architectural choices are proposals until validated in code and tests.
- No live US server, installed extension, or real connection has been verified by this repository.
- The local prototype and dependency/license inventory exist; they are not an independent security audit. Run the commands in [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md).
- GitHub project visibility is **public**. Keep all secrets and identifying account details out.

## Day-one contribution

**Original first milestone (now locally implemented; see VALIDATION.md):** Turn the research candidates into an evidence-backed, version-pinned dependency decision: evaluate WXT + official browser proxy APIs versus adapting SuperTunnel; record the upstream license, maintenance indicators, required features, risks, and prototype implementation plan. Then build a minimal reproducible extension shell as a separate verifiable milestone.

Do **not** start by building a 30-feature UI, assuming hosting availability, copying a competitor application verbatim, or deploying a publicly accessible proxy.

## Expected PR evidence

- Links to the exact task and decision document.
- File changes and test commands **actually run** (or why they cannot run).
- Screenshots only for visible UI changes, with no sensitive data.
- Security/privacy and third-party-license impact.
- Accurate statement of implemented, simulated, tested, blocked, and deferred work.
- Cost impact: `$0 verified`, `unknown`, or `blocked`.

## Decisions requiring owner approval

Paid service or credits; cloud-resource provisioning that could incur a charge; public launch / Web Store release; legal/company formation; introducing a new license; customer data/telemetry policies; open registration, payment acceptance, or public external users.
