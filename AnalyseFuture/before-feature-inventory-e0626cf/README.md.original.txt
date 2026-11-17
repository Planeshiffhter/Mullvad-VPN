# Independent VPN platform

An owner-controlled privacy and secure-connectivity project. The long-term goal is a trustworthy VPN service with native apps, browser extensions and independently operated infrastructure.

**Start here: [Project handoff, implemented features, file guide and detailed task backlog](PROJECT_HANDOFF.md).** This is the continuation guide for other tools and PR reviewers.

Read **[PROJECT_IDEA.txt](PROJECT_IDEA.txt)** for the detailed product vision, delivery stages, feasibility limits and responsibilities. It is a plan, not evidence of a completed service.

## What exists

The repository contains a TypeScript Chrome MV3 browser-proxy prototype, founder-only HTTPS control API, SQLite state, authenticated TLS forwarding gateway, private operations/help UI, encrypted recovery tools and automated tests. Two original upstream native-app archives are preserved separately. They have not been built or integrated into our product.

No live US exit, production VPN service, full-device client, worldwide network or owner-device leak certification has been verified. A browser proxy and a full-device VPN have different protection boundaries.

## Repository layout

| Path | Purpose |
| --- | --- |
| `apps/` | Existing Chrome extension and founder operations UI |
| `services/` | Existing control API and authenticated proxy gateway |
| `infrastructure/` | Runtime, firewall and service examples; no automatic provisioning |
| `scripts/` | Local development, packaging and encrypted recovery |
| `tests/` | Node integration, security and browser tests |
| `tools/` | Offline archive extraction and Python regression tests |
| `upstream/archives/` | Original native-app ZIP assets; separate from our implementation |
| `docs/` | Current operational guidance and factual status |
| `AnalyseFuture/` | Preserved earlier documents and tooling for later owner review |

[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) explains every functional collection, the dependency relationships and the detailed file catalogs.

Generated `build/`, `dist/`, dependencies and private `.local/` state are ignored. New development must be tracked outside generated upstream trees.

## Develop and validate

The owner re-enabled testing on 17 November 2026. The reorganized project has been validated locally; see [the validation report](docs/VALIDATION_2026-11-17.md) for exact results and the two browser-policy skips. CI remains manually triggered.

Use Node **24.22.1**, npm, Python **3.12+**, OpenSSL and `zip`. Chromium is required for browser tests. If the default npm cache is unwritable, set `npm_config_cache=/workspace/.npm-cache` for the install.

```sh
npm ci --ignore-scripts
npm run check
npm run package
python3 -B -m unittest discover -s tools/tests -v
python3 tools/extract_upstreams.py
python3 tools/extract_upstreams.py --verify-only
```

The extractor verifies pinned repository archive hashes, contents, permissions and symlinks. It preserves existing edits and refuses to overwrite mismatched trees. Hashes identify the preserved bytes; they do not establish upstream signing or licensing clearance.

For local services, run `npm run dev:init`, then `npm run dev`. See [local development](docs/LOCAL_DEVELOPMENT.md) for trusted TLS, private credentials and fixture mode. Never print credentials or disable certificate verification.

## Delivery and safety

The owner now requests one bounded task per branch and pull request against `main` for subsequent implementation tools. Follow [the handoff and review process](PROJECT_HANDOFF.md#pull-request-handoff-and-review-process), run relevant checks, and share each PR for review. Do not merge without owner authorization, force-push or discard remote work. This supersedes earlier direct-to-main guidance for future implementation; this handoff-documentation task retains the prior direct delivery instruction. Preserve disputed material in `AnalyseFuture/` with provenance rather than deleting it.

Historical documents in `AnalyseFuture/` are not current operating instructions or implementation claims. [The recovery report](docs/REPOSITORY_RECOVERY.txt) explains the reorganization, preservation ledger and limits of the repository inspection. It does not certify that the owner's GitHub account is secure.

Local work has a **$0 additional spending** constraint. Hosted gateways, public users, billing, store releases and paid services need separate owner authorization. Third-party licenses, trademarks, signing keys and vendor APIs are not transferred by possessing source archives; see [licensing](docs/LICENSING.md).

Continue with [current status](docs/STATUS.md), [architecture](docs/ARCHITECTURE.md), [deployment prerequisites](docs/DEPLOYMENT.md) and [security reporting](SECURITY.md).
