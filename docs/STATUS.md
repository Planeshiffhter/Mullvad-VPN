# Current project status

Updated: 17 November 2026. Current instructions are README.md, PROJECT_HANDOFF.md, PROJECT_IDEA.txt, PROJECT_STRUCTURE.md and AGENTS.md. Earlier snapshots and research are preserved in AnalyseFuture/.

## Latest task: authoritative feature inventory and product audit

Created [FEATURE_INVENTORY.md](FEATURE_INVENTORY.md) from source review at `e0626cfc80454ed51b9264fc36a11a7437bfcbdf`, with the exact requested 10-column matrix: **172 records**, covering browser, separate Linux/Windows/macOS, Android, backend/infrastructure, security/privacy, testing/releases and extras. Status counts: **38 IMPLEMENTED_TESTED, 20 IMPLEMENTED_UNVERIFIED, 9 PARTIAL, 66 SOURCE_ONLY, 7 DOCUMENTED_ONLY, 25 NOT_IMPLEMENTED, 7 BLOCKED**. Scope counts: **69 CORE, 33 SUPPORTING, 9 OPTIONAL, 61 FUTURE**. These are record counts across overlapping responsibility views, not a completion percentage.

Reviewed current root instructions/vision/structure/handoff, actual `apps/`, `services/`, `infrastructure/`, `scripts/`, `tests/`, `tools/`, `upstream/`, `.github/`, current operational documents and historical/catalog context. Verified 157 representative exact internal archive paths without executing native source. Archived Rust pin is 1.100.0; declared `dist-assets/binaries` and `ios/wireguard-apple` submodules contain no regular payload files in the Mullvad ZIP. Their target relevance, exact revisions, licensing and complete build inputs need T03, not an invented build-success/failure claim.

README links the authoritative inventory; PROJECT_HANDOFF links it, preserves T01–T24, updates T24's evidence and adds T25–T30 for Chromium compatibility, Firefox, Android, Windows, macOS and native endpoint/device configuration. Native foundations are P0, the first Linux product P1, named later platforms P2, and advanced extras P3. Exact pre-audit README/handoff/status copies are preserved in `AnalyseFuture/before-feature-inventory-e0626cf/` with hashes and source commit. Application files, tests, manifests, lockfile and third-party ZIP bytes are unchanged.

**Fresh execution in this audit (not copied historical passes):** `npm_config_cache=/workspace/.npm-cache npm ci --ignore-scripts`; `npm run check` (**61 Node tests: 59 passed, 0 failed, 2 managed-policy skips**, typecheck/build/whitespace); `npm run package`; package SHA-256 and `unzip -t`; Python unittest (**16 passed**); extractor `--verify-only` (**8,485 regular files/four symlinks**); `npm audit --json` (**zero known vulnerabilities**, time-bounded). Node v24.22.1, npm11.9.0, Python3.12.14 and Chromium156.0.8078.79. No new Gitleaks run is claimed. Final documentation checks passed: 172 exact-schema feature rows and status/scope totals; 30 unique task IDs with original T01–T24 retained; 1,061 local links/anchors; 157 internal archive references; source/test paths; all 172 project/catalog/handoff paths; 99 baseline identities; three exact pre-audit document snapshots; documentation-only diff scope. Catalogs regenerated with zero traversal errors; whitespace checks passed.

**T24 reproduced, unfixed:** `node /tmp/vpn-dashboard-diagnostic.mjs` exited0. A fresh actual TLS API/Store with exhausted quota returned `state=exhausted`, `active=false` and rejected authorization; real Chromium's unchanged operations page counted1 active and showed Authorized. Browser used a loopback HTTP diagnostic bridge to TLS-verified API requests; this is no production-browser TLS or extension-route claim. No application fix or committed regression was added. `node /tmp/vpn-account-cli-smoke.mjs` also passed actual secure-environment CLI create/recover, new login and rejection of the old password/session with temporary generated test credentials and database cleanup. The next T24 PR should retain reproduction as a durable regression and correct UI state/counts. Existing occupied-port cleanup regressions pass; that older defect remains fixed.

**Unverified/blockers:** managed browser still blocks actual MV3/proxy-auth/routing cases. Native builds/device VPN, Firefox/Chromium-variant acceptance, Android device tests, actual authorized exit/location/host operations, signing/update authority, production recovery and independent security review remain unestablished. Network policy currently denies `api.github.com`: Git fetch/ref inspection works, but `gh pr list` returns Forbidden and API curl fails proxy CONNECT403. No open-PR enumeration or PR creation is claimed from Git refs alone. Only a minimal `api.github.com` addition was saved to the environment draft, preserving presets; it does not apply/publish itself. Review/save in environment settings is required before retrying GitHub API delivery. No raw secret is requested; existing GH_TOKEN presence and native Git access do not establish API readiness.

## Earlier task: implementation handoff and PR continuation

Added root [PROJECT_HANDOFF.md](../PROJECT_HANDOFF.md), linked prominently from the repository homepage. It inventories implemented browser-proxy capabilities and their evidence/limits, explains every active project file and folder plus individual historical files, and links the exhaustive third-party/native catalogs. It defines 24 task packets with dependencies, owner prerequisites, implementation scope and acceptance evidence, including the native, browser, deployment, recovery, release and later customer-platform tracks.

The owner requested that subsequent implementation tools create pull requests for review. AGENTS.md, CONTRIBUTING.md, README.md and PROJECT_IDEA.txt now reflect one bounded task per branch/PR, with no automatic merge. This handoff-documentation delivery retains the prior direct-main instruction. Exact pre-change documents are preserved with hashes in `AnalyseFuture/before-handoff-86792c2/`. Static inventories are refreshed for the final file set. The restored instance lacks the prior generated `build/initial-extraction-4t_gtg6r/` copy and some empty/cache directories, so the workspace snapshot has fewer rows; no tracked application or archive files were removed.

Documentation validation: local Markdown paths/anchors, complete project-file link coverage, unique task IDs, workflow consistency, preserved-byte hashes, catalog coverage and whitespace passed for this task (167 project-file links and 24 unique task IDs). No application behavior is changed or new runtime result claimed; the known local runtime evidence is recorded below. T24 is a source-identified discrepancy requiring a new reproduction/regression: the dashboard ignores exhausted grant state when calculating active/Authorized display. No fix is claimed.

PR monitoring is a review workflow in this conversation when the owner supplies a PR/link or requests review. No background watcher, webhook or scheduled monitor has been configured. Git transport read access works; the GitHub API returned `Forbidden` in this environment, so posting a GitHub review is not established by local Git access.

## Previous task: validation authorized and executed

The owner re-enabled testing on 17 November 2026. The reorganized layout was exercised and a real startup-cleanup bug was corrected. The final local Node suite has **59 passed, 0 failed and 2 managed-browser skips** out of 61 tests; the Python suite has **16 passed**. Build, packaging, trusted-TLS CLI smoke, frozen install, registry advisory report, source restoration and preservation checks passed. Full-history Gitleaks passed with one documented exact historical prose exception.

See [the detailed validation report](VALIDATION_2026-11-17.md) for commands, the failing-before/passing-after port-conflict regressions, artifact identity and remaining limits. CI remains manual; no GitHub-hosted run is claimed. The latest authorization supersedes the temporary no-tests restriction described below.

## Preserved restructuring record

Reorganize the complete repository by functional responsibility, preserve existing work, provide a detailed product idea, document every collection and push directly to main. The baseline is commit `4655d408bab907b48e176d7641c6bed55204d7dc`.

The source tree separates browser client, private operations UI, control API, gateway, development/recovery/packaging tools, component tests, original native archives and current guidance. Historical documents, obsolete automation and exact pre-change source copies are retained under AnalyseFuture/. The preservation ledger accounts for every baseline tracked file.

## Existing capabilities

The repository already contains a Chrome MV3 browser-proxy client, founder HTTPS API/SQLite state, authenticated TLS forward proxy, grant/usage/destination controls, operations UI, encrypted recovery and private packaging tools. Original Mullvad and Amnezia archives and the offline recreation tool are preserved. These are implemented assets, not proof of a deployed VPN company.

## Evidence and deferred checks

- Static review covers functional placement, source import/asset/command references, archive metadata, provenance and preservation of baseline file bytes.
- At restructuring delivery, the catalog contained 147 project files and 25,404 workspace entries. Catalogs are refreshed after subsequent tasks; the native catalog covers all 12,017 archive entries. Private runtime entries are redacted and Git internals are protected.
- All 99 baseline tracked files have byte-identical retained destinations. Static review found no unresolved literal module/asset or active Markdown paths. Both generated native source copies match preserved archive file content; no unique source edit was discovered there.
- At restructuring delivery, execution checks were deferred under the then-current owner instruction. The subsequent authorized validation and its remaining limits are recorded above.
- Earlier in the session, before that instruction and the final deeper moves, the then-current layout had 57 Node tests passing and two managed-browser skips, 16 Python tests passing, a built private package and source verification. Those results are historical and do not validate this final layout.
- The manual verification workflow is preserved with updated paths. It remains manually triggered; the current local validation does not claim a GitHub Actions run.
- No native application build, live US endpoint, owner-device leak acceptance, global service, public account platform or store release is established.
- The reported account compromise is not proved or remediated by source inspection. Account access review, revocation and any necessary secret rotation remain account-owner actions.

## Next task

Use the task IDs and acceptance checks in PROJECT_HANDOFF.md. T24 is a reproduced dashboard-state bug requiring a committed regression/fix; T03 is the first native Linux build audit. T01 needs an authorized browser runner and must preserve managed policy here. A real native tunnel additionally requires an authorized endpoint and suitable privileged test machine. Subsequent implementation tools should push one bounded task branch and open a PR against main for review before beginning another task; do not merge without owner authorization.

No additional spending, new paid service, production deployment or project-license selection is authorized by this reorganization.
