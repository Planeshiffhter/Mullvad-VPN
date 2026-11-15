# VPN Project Memory — read this first

**Updated:** 2026-11-16. **Repository:** https://github.com/rejoansardar23/vpn

> This is the permanent, chat-independent project knowledge index. It summarizes accessible project conversations and repository evidence. It is **not** a verbatim export of every ChatGPT conversation. GitHub history and linked primary sources are the audit trail.

## Start here

1. [Fast developer handoff](knowledge-archive/START_HERE.md) — how to pick up the project safely.
2. [Project and conversation chronicle](knowledge-archive/PROJECT_CHRONICLE.md) — original objective, dated user decisions, project history, old and new selection results.
3. [All 23 candidates, new alternatives and scored comparison](knowledge-archive/REPOSITORY_RESEARCH.md) — every candidate, final **two architecture-study winners**, licensing, maintenance and comparisons.
4. [Country and server architecture](knowledge-archive/COUNTRY_AND_SERVER_ARCHITECTURE.md) — source-level flows and proposed owned schema, policy, verification and tests.
5. [Security, licenses, cost and infrastructure](knowledge-archive/SECURITY_LICENSE_AND_INFRASTRUCTURE.md) — non-negotiable limitations and deployment preflight.
6. [Engineering status, CI, PRs and the next Codex prompt](knowledge-archive/CONTINUATION_HANDOFF.md) — actual branch/code/test results, next small milestone.
7. [Clickable research source index](knowledge-archive/SOURCE_INDEX.md) — canonical GitHub/official URLs and pinned source paths.

## Important distinction between two pairs of repositories

- **Current/future networking dependencies (previous engineering choice):** [apify/proxy-chain](https://github.com/apify/proxy-chain) is ALREADY integrated as `proxy-chain@3.0.3` for the Chrome browser proxy; [WireGuard/wireguard-go](https://github.com/WireGuard/wireguard-go) is a FUTURE NATIVE ENGINE CANDIDATE, not integrated.
- **Exactly two independent *architectural study* winners (2026-11-15):** [mullvad/mullvadvpn-app](https://github.com/mullvad/mullvadvpn-app) for country/city/relay-to-tunnel selection; [amnezia-vpn/amnezia-client](https://github.com/amnezia-vpn/amnezia-client) for self-hosted provisioning and provider-vs-owned configuration. **Research references only; do not import GPL client code by default.**
- These are DIFFERENT decisions for DIFFERENT questions. Never tell a new developer to replace the tested Chrome prototype with Mullvad or Amnezia.

## Current truth, not a marketing claim

- `main` contains planning/documentation. Functional code is on `feat/tested-private-browser-proxy`, open [PR #1](https://github.com/rejoansardar23/vpn/pull/1).
- Revoked-grant, no-direct-fallback Chromium regression is on `test/chromium-revoked-grant-no-direct-fallback`, open [PR #4](https://github.com/rejoansardar23/vpn/pull/4) targeting the implementation branch.
- [PR #4 CI run 43653964275](https://github.com/rejoansardar23/vpn/actions/runs/43653964275) passed **59 tests, 0 failed, 0 skipped** on Node 24.22.1, including an actual MV3 route test.
- **NO authenticated live US exit has been deployed or verified**; tests use explicitly isolated loopback fixtures.
- **NO full-device VPN** exists; a Chrome proxy is not a native tunnel or an OS-level kill switch.
- The prototype's additional spending budget is **$0**. No paid hosting, API, billing, public proxy or store publishing is authorized.
- Entire project licensing is still undecided. The GitHub repository is currently public, but its public visibility does not grant third-party reuse rights.
- Do NOT auto-merge PRs or copy GPL/AGPL code. Use the current repo's AGENTS.md, architecture and security rules as authoritative instructions.

## Limitations of the archive

This package reconstructs the VPN conversation's material requirements, decisions, questions, research findings, source paths, milestones and links from available chat/project context and live GitHub evidence. It cannot guarantee verbatim recovery of *every* private message or deleted/unavailable chat. Quotes from unavailable messages are not invented. Each volatile finding carries an as-of date and links so the next developer can re-check it.

**To resume in a new ChatGPT/Codex conversation:** paste this page's URL and the prompt in [CONTINUATION_HANDOFF.md](knowledge-archive/CONTINUATION_HANDOFF.md). No previous chat transcript is needed.
