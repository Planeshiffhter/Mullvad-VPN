# Reorganized project validation — 17 November 2026

The owner re-enabled testing after the restructuring commit `c7b2977283d5bf839bb10c3f4a61de6cd1e3ecb4`. Checks below cover that layout and the gateway cleanup fix committed with this report. This is local development evidence, not a deployed VPN, account-security recovery or independent security certification.

## Executed checks

| Check | Result |
| --- | --- |
| `npm ci --ignore-scripts` using writable workspace cache | Passed; 19 installed packages, frozen lockfile and lifecycle scripts disabled |
| `npm run check` after startup fix | Passed: strict TypeScript, 61 Node tests (59 passed, 0 failed, 2 skipped), extension build and whitespace check |
| Focused `tests/runtime/dev.test.js` | All 6 tests passed, including both new port-conflict regressions |
| `npm run package` | Passed from the reorganized packaging path |
| Packaged SHA-256 and `unzip -t` | Passed; all seven archive entries intact |
| `python3 -B -m unittest discover -s tools/tests -v` | All 16 tests passed |
| Extractor default and `--verify-only` | Both passed: 8,485 regular files and four symlinks verified |
| Fresh export of committed helper/tests/native ZIPs | All 16 tests, fresh extraction and verification passed without relying on existing build outputs |
| Preservation ledger and upstream catalog | All 99 baseline files and all 12,017 archive entries matched their source content and recorded metadata |
| Functional catalog generation and output checks | Passed: current Git file coverage, observed references and redacted private-state metadata |
| `npm audit --json` | Registry report contained zero known vulnerabilities |
| Checksum-pinned Gitleaks 8.30.1, full reachable Git history | Passed with one exact, reviewed historical prose finding excluded; details below |
| Actual development CLI with trusted local TLS | Health, relocated operations assets, authorization denial, login, empty gateway directory and logout passed |

The private extension package SHA-256 is `251faca23f4183a57911effa1d628b26f673a2b9899ba7483b5d91f793c255f5`. Its contents and hash remain identical to the pre-restructuring package. No dependency declarations or lockfile versions changed.

## Startup failure found and corrected

Default loopback ports 9443 and 9444 were already occupied in this environment. A failed gateway bind triggered shutdown of a listener that had never started. The resulting `ERR_SERVER_NOT_RUNNING` replaced the original `EADDRINUSE` and interrupted the caller's remaining cleanup.

Gateway cleanup now tolerates only that expected not-running condition; other shutdown failures still propagate. New real-listener regressions cover occupied gateway and API ports, assert the original bind error, preserve the unrelated listener, and successfully restart after releasing the test blocker. Before the fix the gateway case failed; after it both cases and the complete suite passed.

The CLI smoke used temporary ephemeral-port settings. Its trusted HTTPS responses matched all three files in `apps/operations/`; it authenticated and logged out a test-created session without printing credentials. Only the smoke process was stopped, and the private configuration was restored byte-for-byte. Existing port owners were left running.

## Reviewed scanner finding

The initial full-history scan found one generic-API-key match in `docs/ARCHITECTURE.md:17` from restructuring commit `c7b2977`. Review established ordinary documentation about lifecycle state, not an embedded credential. The matched wording was `expiry/revocation`.

`.gitleaksignore` records only this exact historical fingerprint:

```text
c7b2977283d5bf839bb10c3f4a61de6cd1e3ecb4:docs/ARCHITECTURE.md:generic-api-key:17
```

No rule, file, directory or future commit is globally exempted. The report was redacted during inspection; no credential was printed. A passing pattern scan or registry audit is a bounded signal and does not prove the repository or account uncompromised.

## Skipped and unrun work

Two Node cases were skipped because installed managed Chromium blocks unpacked extensions: actual MV3 worker loading and actual browser authenticated-proxy routing. The policy was preserved. The real Chromium popup test with an injected extension runtime passed, but that boundary is simulated; controller and real TLS proxy/API integration tests also passed independently.

No GitHub Actions run, owner-controlled Chrome acceptance, live authorized US exit, native Mullvad/Amnezia build/test suite, full-device tunnel, leak certification or production recovery is claimed. Archived vendor applications remain separately licensed, unbuilt source assets. These limitations are prerequisites for later work rather than silently passing tests.
