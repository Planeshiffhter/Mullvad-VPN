# Start here — portable VPN project knowledge

**As of 2026-11-16.** Every link is intentionally a normal GitHub/official URL for future AI agents.

## The project in 60 seconds

Build an original, owner-controlled security/privacy product. **Phase 1** is a verified, single-founder **Chrome Manifest V3 authenticated HTTPS proxy** with a genuinely authorized USA exit when operationally possible at **$0 additional cost**. Later: 1–2 more authorized country locations; multi-country operations; billing and external-user authentication if approved; separate native **Windows, Android, Linux, macOS (and possibly iOS)** full-device VPN clients. Never conflate browser proxy with device VPN.

The user builds primarily with **GPT-6 Astra/Codex Cloud and GitHub**, prefers web/cloud workflows without required local installs, and wants durable documentation that survives chat context loss. Code must be real, tested, incrementally merged after review, and researched for mature open-source reuse first. Never waste coding credits duplicating working libraries.

## Word-format archival copy

[Open the complete VPN project Word report](VPN_PROJECT_KNOWLEDGE_ARCHIVE_2026-11-16.docx). The Markdown files remain the canonical editable originals.

## What to read in order

1. [Project memory index](../PROJECT_MEMORY.md)
2. [Project chronicle](PROJECT_CHRONICLE.md)
3. [Repository comparison and exact two study winners](REPOSITORY_RESEARCH.md)
4. [Country/server design and source-code flow](COUNTRY_AND_SERVER_ARCHITECTURE.md)
5. [Security, licensing and infrastructure limits](SECURITY_LICENSE_AND_INFRASTRUCTURE.md)
6. [Latest handoff and ready-to-use Codex prompt](CONTINUATION_HANDOFF.md)
7. [All source links](SOURCE_INDEX.md)
8. Existing [AGENTS.md](../../AGENTS.md), [TASKS.md](../../TASKS.md), [IMPLEMENTATION_ROADMAP.md](../IMPLEMENTATION_ROADMAP.md) on the implementation branch.

## Repository navigation: avoid restarting

| Where | Purpose | Status at archive |
|---|---|---|
| `main` | Project landing docs/23-candidate inventory | `0768ea7d991166231df782942d6227c08728be0e` |
| `feat/tested-private-browser-proxy` | Actual Chrome MV3 extension, HTTPS API, SQLite auth, TLS forward proxy, quota/revocation, tests, packaging | `8eeb33eab5209272cd9b5a919b2a04de52b88c7f` |
| [PR #1](https://github.com/rejoansardar23/vpn/pull/1) | Implementation -> `main` | OPEN; do not merge without review |
| [PR #4](https://github.com/rejoansardar23/vpn/pull/4) | Real Chromium post-revocation direct-bypass regression -> implementation branch | OPEN; latest CI green |
| [CI 43653964275](https://github.com/rejoansardar23/vpn/actions/runs/43653964275) | Actual Chrome MV3, unit/integration, package and supply chain | 59 passed / 0 failed / 0 skipped |

Follow the implementation branch's latest `AGENTS.md`, `README.md`, `TASKS.md` and `docs/HANDOFF.md` for coding, because the older `main` status pages predate implementation. A PR's passing CI does not mean it has been merged.

## Decision that often causes confusion

- Prior "exact two repos for networking": `apify/proxy-chain` (used now), `WireGuard/wireguard-go` (later native consideration).
- Independent "exact two repositories for comprehensive COUNTRY MANAGEMENT AND VPN ARCHITECTURE STUDY": `mullvad/mullvadvpn-app` and `amnezia-vpn/amnezia-client`.
- Both final study winners are GPL-3.0 and their provider networks are **NOT** available for our independent use. Study architecture and implement original contracts; do not wholesale copy.
- No app/plugin framework change just to look newer: no WXT, 3proxy, Better Auth, Keycloak or WireGuard migration in this Chrome milestone.

## Known blockers

Authorized USA host/provider rules and real $0 incremental cost, valid public TLS and firewall, trusted independent observed exit location, owner-device Chrome acceptance, DNS/WebRTC/IPv6 and outage/network-change tests, off-host recovery and security/license review. No claim of complete no-logs, global kill switch, security certification, unrestricted free multi-country hosting or production rollout.

## How to preserve the next session

At every completed PR update the implementation branch's `TASKS.md`, `docs/PROJECT_STATUS.md`, `docs/VALIDATION.md` and `docs/HANDOFF.md`; add exact CI run URL, commit, tests passed/failed/skipped, files changed, limitations and next task. Keep this archive's dated source snapshots; add a new section rather than silently replacing historical evidence.
