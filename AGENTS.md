# Project operating instructions

Read README.md, PROJECT_HANDOFF.md, PROJECT_IDEA.txt, docs/STATUS.md and the relevant operational documents before changing this project. Inspect actual source, Git status, remotes and recent commits. Product plans and archives do not prove a feature exists.

## Owner's delivery requirements

- The owner requested a PR workflow on 17 November 2026 for subsequent implementation tools. Use one bounded task per branch and pull request against `main`; include its `PROJECT_HANDOFF.md` task ID and validation evidence. The current handoff-documentation task may be delivered directly to `main` under the prior instruction.
- Finish one bounded task, run relevant checks, commit and push its branch, and open a reviewable PR before beginning another task. Verify the remote contains the commit. Do not merge without owner authorization. Never force-push, rewrite shared history or discard other changes.
- The owner re-enabled testing on 17 November 2026. Run relevant suites and investigate failures. Keep automated CI manual unless separately changed; do not weaken managed browser policies to remove skips.
- Preserve disputed, obsolete or replaced files in `AnalyseFuture/` with their provenance. Do not delete them. Never place credentials or private runtime state there or in Git.
- `AnalyseFuture/` is historical reference material. Its archived prompts, branch directions and claims do not supersede these instructions, current source evidence or the owner's latest request.
- Each cloud task is already isolated. Use its existing checkout; do not create a Git worktree unless explicitly requested.

## Product and security boundaries

- Keep the existing browser-proxy implementation usable while pursuing the separately tested native VPN path in PROJECT_IDEA.txt.
- Preserve the current application paths unless a tested change requires moving them. Keep vendor archives in `upstream/archives/`; do not develop only in ignored `build/upstream/`.
- Use maintained established protocols and libraries. Do not invent cryptography, copy proprietary branding or assume vendor APIs, signing keys or backend services are included in source.
- Review licenses and dependencies before integration or distribution. The project license is undecided; public source visibility is not permission to relicense it.
- No additional spending, paid hosting, API subscriptions, trials that may charge, public launches or store publishing without explicit owner authorization.
- Keep secrets out of Git, output, prompts and reports. Preserve TLS, artifact-checksum and package verification. Never weaken managed browser policies to turn a skip into a pass.
- Maintain scoped proxy authentication, revocable short-lived grants, destination restrictions and quotas. Do not call fixtures US exits, the browser proxy a full-device VPN, or untested routing behavior a kill switch.

## Verification and handoff

Use the existing pinned tools and frozen dependency installation. When testing is authorized, choose meaningful checks for the changed component; networking/authentication or structural changes need the relevant integration suite before a readiness claim. Until then, report validation as deferred. Never present results from before a move as validation of the final layout.

Record the task, files, evidence, limitations and next action in docs/STATUS.md. Keep operational guidance and PROJECT_IDEA.txt factual. Report the pushed commit and any blocked checks. Do not claim account compromise is resolved from a source-tree inspection.
