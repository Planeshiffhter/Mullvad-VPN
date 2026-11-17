# Project validation commands

The owner re-enabled testing on 17 November 2026. These commands exercise the reorganized project; actual outcomes and limitations are recorded in [the validation report](VALIDATION_2026-11-17.md).

From the repository root, use Node 24.22.1, npm, OpenSSL, zip and Chromium. Python 3.12+ is used for source tooling. Preserve TLS, package integrity and artifact checksums.

```sh
npm ci --ignore-scripts
npm run check
npm run package
python3 -B -m unittest discover -s tools/tests -v
python3 tools/extract_upstreams.py
python3 tools/extract_upstreams.py --verify-only
```

`npm run check` performs strict TypeScript checking, the preserved Node suites and the extension build. The Node command selects the component suites under `tests/*/*.test.js`. Focused browser tests now live under `tests/extension/`; recovery, packaging and dashboard checks live under `tests/operations/`. Shared temporary TLS fixtures remain in `tests/helpers/`.

Managed Chromium can block real unpacked-extension tests. Report those as skipped. The popup test with an injected extension runtime is simulated at that boundary; it does not establish actual browser proxy behavior. A fixture exit is not a live location or native VPN tunnel.

Record the tested code and actual results in [STATUS.md](STATUS.md). A manual workflow is available in `.github/workflows/verify.yml`; local results do not establish that GitHub Actions has run. No release, deployment or security certification follows from a passing suite alone.

## Complete archive organization checks

Run `python3 -B tools/verify_feature_archive.py --verify-git` from the repository root to independently validate the linked source Git tree/blobs, all moved files and the earlier 99-record preservation baseline. The default without `--verify-git` works in shallow/offline checkouts. `--verify-filesystem-modes` is an optional check of original migration-instance permissions; Git checkouts may legitimately differ in non-executable permission bits. `python3 -B -m unittest discover -s tools/tests -v` includes real archive integration plus tamper/missing/path/symlink/mode/provenance regressions and the preserved Word package. Run `npm run check` and packaging after structural changes to validate active feature integration. Historical documents/research are checked for integrity and traceability; they are not executed as application code. See [the per-file map](../AnalyseFuture/FEATURE_INDEX.md).

When intentionally updating an active file retained by the older baseline ledger, first register a byte-identical original under additional_snapshots and retarget only its preserved_path. The verifier accepts that registered preservation route while retaining every original hash/size/identity; it does not require active application code to stay frozen forever.
