# Contributing to VPN Platform

This is an early-stage, documentation-first VPN project. **No tested runtime product has been committed yet.** You should be able to contribute without knowing any prior ChatGPT conversation.

## Before submitting changes

1. Read [README.md](README.md), [docs/START_HERE.md](docs/START_HERE.md), [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md), [TASKS.md](TASKS.md), and [docs/COST_POLICY.md](docs/COST_POLICY.md).
2. For code, read [AGENTS.md](AGENTS.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/SECURITY_AND_PRIVACY.md](docs/SECURITY_AND_PRIVACY.md), and [docs/BUILD_VS_REUSE.md](docs/BUILD_VS_REUSE.md).
3. Check for an existing issue; scope a single well-defined, testable change.
4. Avoid introducing frameworks when a working maintained alternative is already selected.
5. No spending, paid cloud resources, public deployment or public account signup without owner approval.

## Workflow

- Create a focused branch; send a pull request with issue/task link and implementation scope.
- Keep functionality and tests together; include commands actually run and outcomes.
- Update TASKS.md / docs/PROJECT_STATUS.md for verified progress, not assumptions.
- Update decision/architecture docs when technology changes; preserve required third-party attribution.
- Do not commit credentials, cloud keys, private addresses, billing information or user data.
- Treat API, extension permissions, routing and privacy changes as security-sensitive.

## Pull request checklist

**Task:** ID and expected behavior. **Changed:** affected components. **Tests:** exact commands/results or Not run with reason. **Security:** attack surfaces, failure/bypass behavior. **Licenses:** upstream commits and obligations. **Budget:** verified $0 or block. **Status:** which documented claims are now proven?

## Ownership / license note

The repository is visible publicly but the overall project license is **undecided**. See [docs/LICENSING.md](docs/LICENSING.md) before adding substantial third-party or externally contributed code. Do not assume public means public-domain.

## Security bugs

Do not post exploit details or live secrets in public issues. See [SECURITY.md](SECURITY.md).
