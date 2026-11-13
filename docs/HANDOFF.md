# Project handoff and session continuity

Developers and coding agents should be able to resume from GitHub without chat history.

## Canonical handoff artifacts

- [../README.md](../README.md): mission/entry.
- [../TASKS.md](../TASKS.md): single numbered task tracker, statuses, evidence, blockers.
- [PROJECT_STATUS.md](PROJECT_STATUS.md): implemented vs planned.
- [DECISIONS.md](DECISIONS.md): ADRs, open choices.
- [BUILD_VS_REUSE.md](BUILD_VS_REUSE.md): library research/audit.
- [TEST_STRATEGY.md](TEST_STRATEGY.md): proof of function.
- [COST_POLICY.md](COST_POLICY.md): budget guardrail.
- [source-plans/](source-plans/): preserved original dated plan.

## At the end of each session

Update TASKS and PROJECT_STATUS with the actual implemented feature and evidence. Commit small changes. Record:
1. What changed (paths and commit/PR).
2. Commands/tests run and precise results, not just "looks good".
3. Current task ID and status; any blocker with responsible owner.
4. Any cost or new third-party dependency and how verified.
5. Known security/privacy issues and unfinished checks.
6. Exact next task and one or two runnable next commands when code exists.

## Secrets and account safety

Never include account login emails, billing information, provider authentication tokens, recovery codes, or private server addresses/keys in public docs. Use authorized secret storage, minimal repository access, and owner-controlled account verification. Do not ask the owner to paste secrets into chat.

## New coder / Codex kickoff

"Read README.md, AGENTS.md, TASKS.md, docs/START_HERE.md, docs/PROJECT_STATUS.md, docs/ARCHITECTURE.md, docs/SECURITY_AND_PRIVACY.md, docs/BUILD_VS_REUSE.md, docs/DECISIONS.md, and docs/COST_POLICY.md. Identify the earliest unblocked task. Audit dependencies before coding. Build the smallest tested deliverable, report actual evidence, update docs, and commit. Never spend money or misrepresent mock results."
