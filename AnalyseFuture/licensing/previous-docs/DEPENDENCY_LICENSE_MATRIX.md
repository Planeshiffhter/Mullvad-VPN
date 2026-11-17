# Dependency license inventory

Observed 2026-11-13 from the installed npm artifacts and the repository lockfile. This inventory covers all **38 locked npm packages** (19 installed for this platform; others are optional platform-specific TypeScript compiler packages), including development, optional and transitive dependencies, rather than only direct dependencies. No repository-wide license has been chosen; `private: true` prevents accidental npm publication and does not grant a license.

## Scope and evidence

Exact package versions, registry tarball URLs, SHA-512 integrity values and dependency edges are retained in `package-lock.json`. Installed-package entries were checked against their own license files; Playwright and TypeScript NOTICE files were found. Optional packages for other architectures were not installed or executed; their license identifiers come from lock metadata only. Run `npm ci` to reproduce the artifact set without floating version upgrades. Npm integrity verification and TLS validation remain enabled.

A registry `npm audit --json` request returned **0 reported vulnerabilities** (0 critical/high/moderate/low/info) for this lockfile. This is a point-in-time registry advisory result, not an independent audit, a browser binary audit, or proof that there are no vulnerabilities. Upstream shortlist reviews are in [REPO_AUDIT.md](REPO_AUDIT.md).

## Installed artifacts

| Package | Exact version | Scope | SPDX license from artifact | License/notice files checked | Distribution obligations |
| --- | --- | --- | --- | --- | --- |
| [@playwright/test](https://www.npmjs.com/package/@playwright/test/v/1.65.0) | `1.65.0` | Development | `Apache-2.0` | `LICENSE`, `NOTICE` | Retain license and applicable NOTICE/attribution; mark modifications |
| [@types/chrome](https://www.npmjs.com/package/@types/chrome/v/0.3.7) | `0.3.7` | Development | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [@types/har-format](https://www.npmjs.com/package/@types/har-format/v/1.2.16) | `1.2.16` | Development | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [@types/node](https://www.npmjs.com/package/@types/node/v/24.19.2) | `24.19.2` | Development | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [@typescript/typescript-aix-ppc64](https://www.npmjs.com/package/@typescript/typescript-aix-ppc64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-darwin-arm64](https://www.npmjs.com/package/@typescript/typescript-darwin-arm64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-darwin-x64](https://www.npmjs.com/package/@typescript/typescript-darwin-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-freebsd-arm64](https://www.npmjs.com/package/@typescript/typescript-freebsd-arm64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-freebsd-x64](https://www.npmjs.com/package/@typescript/typescript-freebsd-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-arm](https://www.npmjs.com/package/@typescript/typescript-linux-arm/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-arm64](https://www.npmjs.com/package/@typescript/typescript-linux-arm64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-loong64](https://www.npmjs.com/package/@typescript/typescript-linux-loong64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-mips64el](https://www.npmjs.com/package/@typescript/typescript-linux-mips64el/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-ppc64](https://www.npmjs.com/package/@typescript/typescript-linux-ppc64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-riscv64](https://www.npmjs.com/package/@typescript/typescript-linux-riscv64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-s390x](https://www.npmjs.com/package/@typescript/typescript-linux-s390x/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-linux-x64](https://www.npmjs.com/package/@typescript/typescript-linux-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | `LICENSE`, `NOTICE.txt` | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-netbsd-arm64](https://www.npmjs.com/package/@typescript/typescript-netbsd-arm64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-netbsd-x64](https://www.npmjs.com/package/@typescript/typescript-netbsd-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-openbsd-arm64](https://www.npmjs.com/package/@typescript/typescript-openbsd-arm64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-openbsd-x64](https://www.npmjs.com/package/@typescript/typescript-openbsd-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-sunos-x64](https://www.npmjs.com/package/@typescript/typescript-sunos-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-win32-arm64](https://www.npmjs.com/package/@typescript/typescript-win32-arm64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [@typescript/typescript-win32-x64](https://www.npmjs.com/package/@typescript/typescript-win32-x64/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | Optional package not installed; license from lock metadata | Retain license and applicable NOTICE/attribution; mark modifications |
| [agent-base](https://www.npmjs.com/package/agent-base/v/9.0.0) | `9.0.0` | Transitive runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [debug](https://www.npmjs.com/package/debug/v/4.4.3) | `4.4.3` | Transitive runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [ip-address](https://www.npmjs.com/package/ip-address/v/10.7.6) | `10.7.6` | Transitive runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [ipaddr.js](https://www.npmjs.com/package/ipaddr.js/v/2.3.0) | `2.3.0` | Direct runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [ms](https://www.npmjs.com/package/ms/v/2.1.3) | `2.1.3` | Transitive runtime | `MIT` | `license.md` | Retain copyright and permission notice |
| [playwright](https://www.npmjs.com/package/playwright/v/1.65.0) | `1.65.0` | Development | `Apache-2.0` | `LICENSE`, `NOTICE` | Retain license and applicable NOTICE/attribution; mark modifications |
| [playwright-core](https://www.npmjs.com/package/playwright-core/v/1.65.0) | `1.65.0` | Development | `Apache-2.0` | `LICENSE`, `NOTICE` | Retain license and applicable NOTICE/attribution; mark modifications |
| [proxy-chain](https://www.npmjs.com/package/proxy-chain/v/3.0.3) | `3.0.3` | Direct runtime | `Apache-2.0` | `LICENSE` | Retain license and applicable NOTICE/attribution; mark modifications |
| [smart-buffer](https://www.npmjs.com/package/smart-buffer/v/4.2.0) | `4.2.0` | Transitive runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [socks](https://www.npmjs.com/package/socks/v/2.8.10) | `2.8.10` | Transitive runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [socks-proxy-agent](https://www.npmjs.com/package/socks-proxy-agent/v/10.1.0) | `10.1.0` | Transitive runtime | `MIT` | `LICENSE` | Retain copyright and permission notice |
| [tslib](https://www.npmjs.com/package/tslib/v/2.9.1) | `2.9.1` | Transitive runtime | `0BSD` | `LICENSE.txt` | No attribution condition; preserve license as provenance |
| [typescript](https://www.npmjs.com/package/typescript/v/7.0.2) | `7.0.2` | Development | `Apache-2.0` | `LICENSE`, `NOTICE.txt` | Retain license and applicable NOTICE/attribution; mark modifications |
| [undici-types](https://www.npmjs.com/package/undici-types/v/7.24.6) | `7.24.6` | Development | `MIT` | `LICENSE` | Retain copyright and permission notice |

## Runtime, browser and packaging boundary

- Node 24, OpenSSL and built-in SQLite are runtime/platform components, not extra npm dependencies. Preserve their upstream licenses/notices when redistributing runtime binaries; this repository does not vendor them.
- Browser binaries installed by Playwright have their own upstream licenses, bundled third-party notices and platform requirements. Development testing does not authorize relabeling or distributing a browser binary as our own product.
- The original MV3 extension contains no imported UI framework, competitor assets, upstream source tree or runtime npm bundle. Any future bundled dependency must bring its required notices into the extension archive.
- Deploying through `npm ci --omit=dev` retains runtime package license files. If flattening, bundling or separately distributing the service, collect the above licenses and notices alongside that distribution; do not discard them during packaging.
- Proxy-chain has additional upstream transports in its transitive tree (SOCKS support). Their presence does not mean this product exposes SOCKS or supports full-device VPNs.
- No GPL/AGPL project from the evaluated shortlist has been incorporated. Root-level license identification does not substitute for per-file/submodule review if such code is added later.

## Recheck after dependency changes

Run `npm ci`, inspect each locked package's `package.json` and license/NOTICE files, run `npm audit`, and update this table. Review any new license before shipping a changed distribution. Keep exact direct versions and the lockfile; do not claim that uninstalled shortlisted repositories have received a full transitive security/license audit.
