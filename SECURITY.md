# Security reporting and recovery boundaries

This repository contains a locally tested browser-proxy prototype and preserved native source archives. It is not a certified production VPN service. No independent security audit or live deployment is claimed.

Do not post credentials, private keys, account details, packet captures or sensitive infrastructure addresses in public issues. If GitHub private vulnerability reporting is enabled for this repository, use that private channel. Otherwise contact the repository owner through an already established private route; no public security email address is asserted here.

For a suspected account or repository compromise, the account owner must review GitHub sessions, authentication factors, tokens, connected apps, collaborators, deploy keys, webhooks and Actions access; revoke unauthorized access and rotate any exposed secrets. Preserve relevant audit evidence. Source reorganization alone does not restore account control or prove the absence of compromise. This task does not change account security settings.

For local development, never disable TLS verification, execute unreviewed archived scripts, publish `.local/` or load private credentials into AI tools. Current protection boundaries and release gates are in [security and privacy](docs/SECURITY_AND_PRIVACY.md).
