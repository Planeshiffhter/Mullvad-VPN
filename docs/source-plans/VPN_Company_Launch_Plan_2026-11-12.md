# VPN Company Launch Plan — Strict $0 Build Order

Updated 12 November 2026.

**Your instruction:** Use the six months of Pro/Codex access you say are already paid for. Use GPT-6 Astra to build the software in code. Spend $0 additional money. Start with you as the only user and a US connection location.

**Status:** This is an implementation plan, not completed software. No cloud server has been reserved, no live US connection has been verified, and no company or extension has been published through this plan.

**Budget rule:** There is no paid fallback in this version. If a free dependency is unavailable, complete the independent development work and record the blocker. Do not buy credits, upgrade accounts, start billable resources or silently substitute a paid service.

## What is possible within this budget

| Result | $0 additional spending? | Condition |
| --- | --- | --- |
| Source code, extension interface, backend, dashboard and website files | Yes, using existing equipment and included development allowance | Stay within the allowance and use suitable open-source dependencies |
| Local networking tests | Yes | Existing development environment supports the required networking and browser tests |
| A real private US exit connection | Possible, not guaranteed | An authorized US host is available at no additional charge and permits the use |
| Local installation of your own Chrome extension | Yes | Use Chrome Developer Mode |
| New Chrome Web Store registration | Not guaranteed at $0 | Google requires a one-time registration fee |
| Reliable public service in many countries | Not promised at $0 | Each location needs authorized compute, connectivity, support and applicable business preparation |
| A legally registered company | Not created by writing software alone | Formation and operating requirements depend on jurisdiction |

Treat the Pro period as already paid, rather than assuming all future use is unlimited. Official OpenAI documentation distinguishes included allowances from additional credits and API billing. Check your account's own usage dashboard. Do not add an AI API dependency to the running product. [OpenAI pricing](https://learn.chatgpt.com/docs/pricing)

Codex can prepare code and deployment automation. Account verification, accepting provider agreements, access authorization and any required identity checks remain account-owner responsibilities. Never paste passwords, payment-card details or cloud private keys into prompts or source files.

## Product and technology choices

The first release is a private Chrome desktop extension controlling an authenticated HTTPS forward proxy. It handles supported browser traffic. A full-device VPN is a later engineering project; the extension alone does not route every application.

Use TypeScript for the extension and control API, Node.js for the API, SQLite initially, and established proxy software on Linux for the traffic gateway. Prefer existing cryptographic and networking components over inventing a tunnel or encryption protocol. No GPU is needed.

Chrome exposes proxy settings and authentication APIs. The extension's configuration must respect existing browser policy and other extensions. [Proxy API](https://developer.chrome.com/docs/extensions/reference/api/proxy) · [Authentication API](https://developer.chrome.com/docs/extensions/reference/api/webRequest)

A plain HTTP proxy carrying HTTPS websites is different from an HTTPS proxy: the latter also encrypts the browser-to-gateway connection. Preserve website HTTPS and do not intercept its contents. [Chromium proxy documentation](https://chromium.googlesource.com/chromium/src/+/HEAD/net/docs/proxy.md)

Keep the build portable. One low-resource US VM can host the private gateway and control services if measurements support it. Avoid a separate managed database, paid email service, paid analytics service, paid domain, commercial UI kit and paid build runners.

## The free US hosting decision

Oracle Cloud Always Free is a candidate to check, not an allocated resource. Eligible compute is tied to the tenancy's home region. Current documentation lists 10 TB of monthly outbound transfer, but capacity shortages and reclamation of idle instances are possible. [Always Free resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)

Confirm a US home region is actually available for your account before selecting it; the home region cannot later be changed. [Region management](https://docs.oracle.com/en-us/iaas/Content/Identity/regions/managingregions.htm)

Oracle describes card verification and temporary authorization holds, a distinction from charged usage. Its free tier has no SLA. If you will not provide a supported card or accept a temporary hold, this route may not work for you. A temporary trial credit is not permanent free hosting. [Free Tier FAQ](https://www.oracle.com/cloud/free/faq/)

Alternatively, an existing US machine whose owner authorizes the use could provide the endpoint, subject to its network and provider terms. A machine in India does not become a US exit simply because the code says “USA.”

Before exposing a gateway, verify provider terms, actual free allocations, public-IP costs, disk limits, transfer limits and what happens after any trial expires. Do not upgrade to a paid account to obtain capacity under this plan.

Use a free pilot hostname and certificate where available: [Duck DNS](https://www.duckdns.org/) and [Let's Encrypt](https://letsencrypt.org/). Keep DNS tokens private and automate certificate renewal.

## How Codex should work through the tasks

Start with Task 1. Complete each task's acceptance check before marking it done. Keep a task tracker with: task number, status, evidence, unresolved issue and next step. Use these statuses: Not started, In progress, Blocked, Done.

Tasks are in the intended implementation order. When an external account or hosting dependency blocks one, Codex should continue tasks that genuinely do not depend on it. A simulation must be labelled as such. Do not report a functioning US service from a mock screen, a configuration file or an untested deployment command.

Use small, reviewable commits. Keep generated build files reproducible and pin dependencies. Run meaningful authentication, networking and recovery tests; avoid spending allowance repeatedly running unchanged checks after they pass.

### Task 1 — Fix the scope and budget

**Build:** A requirements file and cost policy.

Record the first release: Chrome desktop, one US gateway, one private founder account, Connect/Disconnect, verified status and no public signup. Define the traffic the product intends to cover, known exclusions and the error behaviour.

Record the $0 additional-spend rule, the already-paid Pro period and a ban on paid upgrades or extra credits without a new user instruction. Set reminders in project documentation to reassess access before the paid period ends; do not assume its expiry date.

**Done when:** There is a concrete acceptance checklist and no requirement depends on an undisclosed paid service.

### Task 2 — Create the repository and task tracker

**Build:** Source folders for extension, API, gateway configuration, website, operations and documentation. Add README, TASKS, COST_POLICY, contributor instructions, example configuration, ignore rules and dependency lockfiles.

Use a source repository you control. Protect the account with MFA and recovery codes. Keep local and deployment secrets out of Git. Do not enable billable hosted CI jobs.

**Done when:** A clean checkout has documented setup commands, no secrets, and the numbered task tracker. Commit the initial project.

### Task 3 — Verify the free US host

**Build:** A provider-specific preflight report and deployment configuration template.

Confirm account ownership and eligibility, available US region, applicable use terms, qualifying resources and actual network limits. Obtain required account setup from the owner through secure provider flows. Record which checks passed and which remain unknown.

**Done when:** An authorized free US machine is available with the required access and limits documented, or the task explicitly says Blocked with the missing requirement.

**If blocked:** Continue local work through Tasks 4–13 and other independent tasks. Task 14 and the live release remain blocked. Do not start a paid server.

### Task 4 — Make development reproducible

**Build:** A repeatable Linux development setup, an isolated test network and simple commands to build, run and stop the components. Containers are an option if supported; retain a documented shell-based alternative if needed.

Use test fixtures and test credentials. Keep local services private. Verify the actual browser-testing capabilities available in the development environment.

**Done when:** The environment starts from a clean checkout and can be stopped cleanly. A second run does not depend on undocumented manual changes.

### Task 5 — Prove the proxy connection before polishing the UI

**Build:** A minimal authenticated forward proxy using established software.

Begin with controlled local tests. Validate successful HTTP/HTTPS behaviour, TLS to the proxy, and credential rejection. Document which traffic categories the chosen software supports.

**Done when:** Valid test credentials forward a real test request, invalid or missing credentials fail, and encrypted transport is verified. Website TLS is not intercepted.

### Task 6 — Protect the gateway

**Build:** Firewall configuration, destination access rules and basic connection/resource limits.

Deny unauthorized access. Restrict private, loopback, link-local, cloud metadata and other inappropriate internal destinations, including resolved IPv4 and IPv6 addresses. Protect against hostname aliases and DNS changes reaching internal targets. Limit allowed destination ports and protect management interfaces.

**Done when:** Targeted tests show allowed browsing works and prohibited destinations and unauthenticated requests fail. The gateway is not an unrestricted public proxy.

### Task 7 — Create the private account and database

**Build:** A SQLite schema, migrations and a command to create the founder account.

Use secure password hashing and an account-recovery procedure controlled by the owner. Keep signup closed. Do not add paid email/SMS verification for the personal prototype. Store only fields justified by functionality and the agreed retention design.

**Done when:** Account creation, login, failed login, logout and recovery work with clear limits on repeated attempts. No plaintext account password appears in logs or the database.

### Task 8 — Build the control API

**Build:** Authentication/session endpoints, the available-gateway list, account status, health information and revocation controls.

Keep administrative operations private. Validate inputs and restrict cross-origin access as appropriate. Distinguish the account session from proxy credentials. Return structured, understandable errors.

**Done when:** Authenticated requests succeed, unauthorized administrative requests fail, and session expiry and logout are tested.

### Task 9 — Issue and revoke proxy credentials

**Build:** A narrow connection-grant mechanism using unique, revocable credentials with a bounded lifetime.

Integrate the grant with the established proxy's supported authentication mechanism. Keep administrator credentials entirely server-side. Ensure the gateway, not just the popup, enforces authorization and limits.

Define whether revocation stops only new connections or also existing tunnels. If immediate disconnection is claimed, implement and test active-connection termination; otherwise disclose the actual bound.

**Done when:** Expiry, renewal, revocation and duplicate-use limits behave as documented. No shared service password is shipped in the extension.

### Task 10 — Build the Chrome extension foundation

**Build:** A Manifest V3 extension, service worker, simple popup and minimal necessary permissions.

Package its executable logic with the extension. Configuration fetched from the API must be data with a validated schema. Keep a single real US location visible; future locations remain disabled or in explicitly labelled development fixtures.

**Done when:** The extension loads locally without errors and communicates with the development API. Restarting its service worker does not corrupt state.

### Task 11 — Implement Connect and Disconnect

**Build:** The browser proxy lifecycle and its authentication-challenge handler.

Connect selects the gateway and applies settings; Disconnect clears or restores only settings the extension owns. Handle conflicts with browser policy and other extensions. Return proxy credentials only for a proxy authentication challenge from the exact approved gateway and port, never to a website challenge.

**Done when:** A test request uses the gateway after Connect and the expected prior routing after Disconnect. Wrong-origin challenges do not receive credentials. Conflicting settings produce an honest error.

### Task 12 — Verify the connection and show truthful status

**Build:** A connection state machine: Disconnected, Connecting, Connected, Reconnecting and Error.

Use a real route check to confirm the expected exit IP. A successful settings call alone is not proof that traffic uses the gateway. Choose an appropriate free test endpoint or owned fixture and account for its privacy and rate limits.

**Done when:** The popup displays Connected only after verified routing. Server failure, expired access and failed verification produce the correct state. Local simulation never displays an unqualified live US success.

### Task 13 — Enforce usage limits and protect the budget

**Build:** Server-side traffic counters, connection limits, expiry, quota enforcement and local usage reporting.

Track traffic in a way that can be compared with provider billing. Reserve headroom for protocol overhead, updates, management traffic and other resources. Provider alerts do not substitute for resource restrictions and application limits.

On quota exhaustion, stop the affected protected connection and explain why; do not silently send that browsing directly. Do not install paid monitoring or paid alert channels.

**Done when:** Controlled tests demonstrate the limits actually block further authorized use as intended. The cost inventory contains every external dependency and its limits.

### Task 14 — Deploy the real free US service

**Prerequisite:** Task 3 has passed.

**Build:** Repeatable deployment scripts, a free hostname, valid TLS, renewal automation, service supervision and minimal exposed ports.

Deploy only into the authorized account and confirmed free resource configuration. Use secrets through secure environment or secret-management facilities. Validate DNS and certificates without disabling certificate checks.

**Done when:** Your browser can make an authenticated live request through the expected US gateway. Record the provider region and observed exit IP, and check the actual resource/billing view. A script that has not been run is not a deployed service.

### Task 15 — Test leaks, failures and browser lifecycle events

**Build:** A meaningful automated and manual integration test suite plus a coverage report.

Test DNS, WebRTC, IPv4/IPv6, relevant browser protocols, browser restart, service-worker restart, sleep/wake, network changes, gateway outage, API outage, expired credentials, revoked access and exhausted quota. Test any allowed bypass rules explicitly.

For traffic claimed to be protected, verify that failures do not silently fall back to a direct route. If the extension cannot enforce a claimed protection, narrow the claim or leave release blocked. Do not present a browser extension as an operating-system kill switch.

**Done when:** Tested behaviour and remaining limitations are recorded. Security-critical failures affecting the stated protection are fixed before private release.

### Task 16 — Add a private operations dashboard

**Build:** An authenticated admin interface for gateway health, resource use, traffic totals, credential revocation and recent operational errors.

Show aggregate operational information sufficient to maintain the private service. Redact credentials and personal data from logs. Use bounded log rotation and documented retention. Do not collect full browsing histories merely to fill charts.

**Done when:** You can identify an outage or exhausted quota and revoke access. Unauthorized users cannot reach the admin controls. Logs remain within storage limits.

### Task 17 — Implement backups, restore and rollback

**Build:** Encrypted backups of necessary database/configuration data, a restore command and deployment rollback instructions.

Use storage already available within the budget; do not add paid backup services. Keep at least one usable recovery copy outside the gateway's failure domain when existing authorized storage permits. Document any gap honestly.

**Done when:** A restore has actually been exercised in an isolated environment, the restored service works, and an unsuccessful update can be rolled back. Never count an untested backup file as proven recovery.

### Task 18 — Build the website and help content

**Build:** Company/product website files, installation instructions, support information, data-practice documentation and a private account page.

Serve the prototype privately or within already-verified free resources. Use original code or appropriately licensed assets. Describe browser-only coverage accurately. Keep customer checkout and public signup disabled.

Prepare country configuration fields for later expansion, but display only functioning locations. Keep legal/privacy drafts marked for review; writing a page does not itself make the service compliant.

**Done when:** The pages work, accurately describe the implementation and do not advertise nonexistent countries or unsupported privacy guarantees.

### Task 19 — Package and install the private release

**Build:** A reproducible extension archive, deployment bundle, version notes and installation guide.

Install the extension in your own Chrome through Developer Mode, then repeat essential live tests from your actual device/network. Codex Cloud testing alone is not proof of behaviour on your computer.

Chrome documents local unpacked installation. New Web Store publication involves registration requirements and a fee, so it is deferred under this $0 plan. [Local installation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world) · [Store registration](https://developer.chrome.com/docs/webstore/register)

**Done when:** You can install, connect, disconnect, update and recover using the supplied instructions, with the expected traffic coverage verified.

### Task 20 — Run the personal pilot and complete the handover

**Build:** A final release report and maintenance checklist.

Use the service personally for a short observation period, such as seven days. Record reliability, actual resource use, errors and any provider charges. Review dependency licences, secrets, access controls and remaining security limitations. Reconcile usage with the provider's records.

State separately: implemented, automatically tested, manually verified, blocked and deferred. Keep all source and rebuilding instructions in the repository so the software remains yours after the paid development period ends. Continuing it still depends on hosting availability and maintenance.

**Done when:** The service works for you, its real recurring additional cost is verified as $0 for the observed period, and there is a documented recovery and maintenance process. This observation is not a promise that hosting will remain free forever.

## Later tasks, without silently spending or launching

The software can be prepared for these features, but they are not prerequisites for the personal US prototype.

| Next order | Code work | Dependency before making it live |
| --- | --- | --- |
| 21 | Invitations, separate users, isolated sessions and per-user quotas | External-user obligations, provider permission, security readiness and sufficient free capacity |
| 22 | Second-country gateway configuration and deployment automation | An authorized, suitable free host in that country; otherwise leave it inactive |
| 23 | Third-country configuration and regional routing checks | The same location-specific checks; one free US host cannot supply physical gateways worldwide |
| 24 | Payment-provider abstraction and sandbox checkout tests | Provider approval, seller identity, applicable registration/tax work and transaction costs |
| 25 | Store listing files and public-release package | Store account/fee, review, accurate privacy disclosures and public-service readiness |
| 26 | Native full-device clients | A separate protocol/client design, operating-system permissions, signing/distribution requirements and extensive testing |

A public VPN business and a private personal prototype have different obligations. Before outside users, establish which jurisdiction's rules apply and what privacy claims the implementation can support. If operating from India, consult the existing CERT-In directions and FAQ on covered providers; do not assume an overseas gateway or the label “proxy” removes applicability. [Directions](https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf) · [FAQ](https://www.cert-in.org.in/PDF/FAQs_on_CyberSecurityDirections_May2022.pdf)

## What you do and what Codex does

| Work | Codex can handle | What the owner still supplies |
| --- | --- | --- |
| Architecture, source code, build scripts and docs | Implement and revise | Product preferences and acceptance |
| Testing | Run supported automated tests and explain manual tests | Checks on your actual browser/device when direct access is unavailable |
| Hosting setup | Prepare and execute scripts through authorized access | Account creation/verification, region choice and acceptance of terms |
| Secrets and account recovery | Integrate secure storage and access rules | Credentials entered through the appropriate secure account/settings interface |
| Website and policy drafts | Generate and keep aligned with implementation | Legal/business decisions and any necessary professional validation |
| Company registration and store publication | Prepare relevant materials | Required identity, signatures, approvals and unavoidable fees |

Keep the accounts under your control. Grant the minimum access needed. Do not share account passwords with someone offering to do setup.

## Copy-ready master instruction for GPT-6 Astra in Codex

Paste this instruction and attach this plan:

> Act as the implementation engineer for my private US-first Chrome browser proxy project. I have six months of Pro/Codex access already paid for. My additional spending limit is exactly $0. Follow the attached VPN Company Launch Plan in numbered order.
>
> Begin with Tasks 1 and 2, then perform the free-host preflight in Task 3. Continue independent local work when an external prerequisite is blocked. Build the authenticated networking core before the website and dashboards. Do not treat a mock UI or an unexecuted script as a working VPN.
>
> Keep TASKS.md updated with each task's status and evidence. Implement, run meaningful checks, fix failures and commit coherent changes before moving on. Do not stop for approval of routine reversible work already within this scope. Ask only when required account-owner action or genuinely missing information blocks progress.
>
> Use TypeScript, Manifest V3, a small Node.js control API, SQLite initially and established TLS proxy software on Linux. All running components must avoid paid AI APIs and paid managed services. Use current primary documentation for browser APIs and chosen dependencies.
>
> Do not purchase credits, upgrade plans, start billable resources, buy a domain, publish to a store or enable public signup. Do not rely on expiring trial credits as permanent infrastructure. If a required free resource is unavailable, record the precise blocker and continue independent work. Never bypass verification, create extra accounts to evade limits or manufacture usage to defeat reclamation rules.
>
> Use individual, expiring and revocable proxy credentials; protect secret storage and management endpoints. Match proxy authentication challenges to the approved gateway. Enforce destination restrictions and usage limits server-side. Preserve website HTTPS without interception.
>
> Test the actual route, authentication, DNS/WebRTC/IPv6 behaviour, outages, restarts, credential expiry, revocation and quota exhaustion. Never claim device-wide protection or untested fail-closed behaviour. Label simulated and live results clearly.
>
> Automate deployment, certificate renewal, backup, restore and rollback as far as the authorized environment supports. Test restore and verify the actual resource bill. Account setup and identity verification must be performed through legitimate owner-controlled flows; do not request secrets in chat.
>
> Deliver the repository, installable private extension bundle, setup and deployment instructions, test results, cost inventory, known limitations and maintenance guide. Prepare later features only after the first 20 tasks pass. Keep external launches and new countries inactive until their dependencies are satisfied.
>
> Start working on Task 1 now.

## Working rhythm during your six months

Use milestones rather than promising a launch date. First prove the private connection, then harden it, then add operational tools. Use later time for repeated real-device testing, small fixes, documentation and only justified expansion. If included model usage is exhausted, save progress and wait for the available reset instead of buying extra usage.

At the end of each session, leave the next task and exact commands needed to resume. Before the paid period ends, ensure you have the source, deployment configuration, account recovery access and a maintenance plan. Do not assume any subscription will automatically continue at no charge.
