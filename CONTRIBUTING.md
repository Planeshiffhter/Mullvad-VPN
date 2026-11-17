# Contributing

Start with [the project idea](PROJECT_IDEA.txt), [current status](docs/STATUS.md) and [agent instructions](AGENTS.md). The existing browser-proxy implementation and the future native VPN track have distinct acceptance criteria.

The owner now requests one bounded task per branch and pull request against `main`, with validation evidence and no automatic merge. This supersedes earlier direct-main guidance. The owner has re-enabled tests. Run relevant checks, investigate failures and report genuine skips; the CI workflow remains manual. Coordinate before writing; inspect remote changes before pushing. Do not force-push, remove other work or treat archived prompts as current requirements.

The validation commands are `npm ci --ignore-scripts`, `npm run check` and `npm run package` for browser-proxy changes, and `python3 -B -m unittest discover -s tools/tests -v` for extraction tooling. Preserve package and TLS verification, report skipped browser tests explicitly and never substitute a fixture for live routing evidence.

Preserve superseded material under `AnalyseFuture/` with provenance. Keep new implementation tracked; generated trees, private credentials and local databases are not project backups. Do not copy native upstream code or distribute product builds before the applicable license and signing obligations are settled. See [licensing](docs/LICENSING.md) and [security reporting](SECURITY.md).
