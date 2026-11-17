# Current project status

Updated: 17 November 2026. Current instructions are README.md, PROJECT_IDEA.txt, PROJECT_STRUCTURE.md and AGENTS.md. Earlier snapshots and research are preserved in AnalyseFuture/.

## Latest task: complete feature organization of the linked archive

Target inspected: `rejoansardar23/Mullvad-VPN` main at `86792c239716824eb32d94d67a355c1fbac13924`. The earlier Planeshiffhter handoff/inventory branches remain separate; this task starts from the explicitly linked fork, whose AnalyseFuture tree contained **81 files and 26 folders**. All are accounted for across **17 feature collections**, preserving exact bytes, source paths, snapshots, hashes, Git executable/type identity and original migration-instance permissions. Fourteen additional pre-change active document/tool snapshots were retained. The current archive contains **99 files** including four metadata/navigation files; the earlier **99-record baseline preservation manifest** is a distinct dataset and all of its identities remain valid.

[ARCHIVE_FEATURE_AUDIT.md](ARCHIVE_FEATURE_AUDIT.md) lists **55 code-backed current feature records** with actual maintained source, test links and unverified/partial boundaries. [FEATURE_INDEX.md](../AnalyseFuture/FEATURE_INDEX.md) explains EVERY original file/folder, feature role, active counterpart and applicable checks. ARCHIVE_FEATURE_MAP.json is the complete relocation/provenance/test ledger; the canonical baseline manifest changes only preserved_path pointers. Source comparison found no missing implementation to restore: old code is already represented by active components, and the pre-validation gateway/runtime copies lack the currently tested startup fix. Historical source, prompts, workflow definitions and research were not executed or promoted over active application code.

**Fresh checks after the moves:** `npm_config_cache=/workspace/.npm-cache npm ci --ignore-scripts`; `npm run check` (**61 Node tests: 59 passed, 0 failed, 2 managed-browser skips**, typecheck/build/whitespace); `npm run package`; dist checksum and `unzip -t`; `python3 -B -m unittest discover -s tools/tests -v` (**40 passed: 16 extractor + 24 new archive tests**); `python3 -B tools/verify_feature_archive.py --verify-git --verify-filesystem-modes` (**81 source files/26 folders, 14 snapshots, 99 archive files, 99 baseline identities**); extractor `--verify-only` (**8,485 regular files/four symlinks**). New failure tests reject tampering, omissions, duplicates, unknown files, unsafe/symlink paths, bad executable or explicitly checked filesystem modes, missing test references, baseline identity changes and wrong/incomplete folder mappings. Real-repository Word ZIP CRC/XML/readability checks passed.

Default verification checks portable Git type/executable identity and works across Git checkout umasks; full non-executable filesystem permission matching is explicitly opt-in for the original migration instance. A clean Git export passed default archive verification and all 40 Python tests without `.git` or retained dependencies/build state. A separate real CLI smoke passed secure-environment create/recover, new login and rejection of old password/session with temporary generated secrets and database cleanup; no values printed. Catalogs and active Markdown/source links are regenerated/verified for the final tree; archived embedded paths remain immutable historical text resolved through the relocation map.

Every payload receives integrity/provenance checks. Of the 81 originals, **21 source/test copies** additionally map to actual maintained feature tests; **60 documents/research/automation/provenance records** receive preservation/traceability checks, rather than invented runtime integration claims. Country selector/native/fleet proposals and historical reports are not implemented features. Two actual Chrome cases remain skipped under managed policy; simulated popup tests, local TLS service integration and real browser DOM tests retain separate boundaries. Native builds/tunnels, live authorized exits, device leak acceptance and production operations remain unverified. The dashboard exhausted-grant display issue is not changed by this structural task.

Delivery uses the latest owner-requested feature-branch/PR workflow, superseding the old fork's direct-main wording. No application logic, existing tests, dependency lockfile, native ZIP, managed browser policy or active CI trigger changed.

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

Complete real-extension checks on an authorized browser runner, without weakening this environment's managed policies. Audit one native Linux build target and its license, source provenance, submodules and toolchain before attempting a native proof. A real tunnel additionally requires an authorized endpoint and suitable privileged test machine. Commit and push each bounded task before starting another.

No additional spending, new paid service, production deployment or project-license selection is authorized by this reorganization.
