# Verification strategy — evidence before labels

The tiers below remain release requirements. Current automated results, simulation boundaries and unrun live checks are recorded in [VALIDATION.md](VALIDATION.md). Run `npm run check` for strict TypeScript checks, runtime/security tests and the extension build. Local fixtures are not live US-route evidence.

## Test tiers

1. **Static** — lint, typechecks, dependency licensing inventory and secret scan.
2. **Unit** — config schema, state transitions, grant expiry/revocation, account policy.
3. **Integration** — actual proxy server in isolated test network; TLS/certificate validation, HTTP/CONNECT, invalid credentials, destination restrictions, server limits.
4. **Browser E2E** — Playwright plus Chrome extension where supported: Connect/Disconnect, auth challenge scoping, service-worker restart, route checker.
5. **Manual live** — Chrome on founder's device and real authorized US endpoint, geo/IP evidence, DNS/WebRTC/IPv6 coverage, network disruptions, actual cost.
6. **Operations** — backup/restore, rollback, health monitoring, failure and quota handling.

## Evidence template

| Field | Required content |
| --- | --- |
| Task | Link to task number |
| Tested artifact | Commit, build hash, host/environment (redact secrets) |
| Method | Exact command and/or reproducible manual steps |
| Result | Passed / Failed / Blocked / Not run |
| Proof | Output or sanitized logs/screenshots |
| Known gaps | Browser/OS/network cases not exercised |
| Claims | Match what the tests actually prove |

## Nonnegotiable release blockers

Unrestricted public proxy; leaked credentials; wrong-origin proxy auth disclosure; false Connected status; unsupported encrypted transport claims; unreviewed direct fallback for claimed protected traffic; unbounded costs; lack of real egress validation; no usable recovery; undisclosed paid dependency.

**Do not call a simulated connection live.** If Codex Cloud cannot use real Chrome or provider credentials, report the limitation and provide precise owner-executable steps.
