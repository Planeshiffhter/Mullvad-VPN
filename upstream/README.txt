PRESERVED UPSTREAM NATIVE APPLICATION SOURCES

archives/mullvadvpn-app-main.zip
  SHA-256: 95d77642fd18ded01423c9bf125f22159479dfd058dbb801cf286f425d98ba6f
  Extracts to ignored build/upstream/mullvad/
archives/amnezia-client-dev.zip
  SHA-256: f32e784d47c196158728eee8df7aeef01093df6368ebc72a142d0829a9cebcd0
  Extracts to ignored build/upstream/amnezia/

Recreate: python3 tools/extract_upstreams.py
Verify:   python3 tools/extract_upstreams.py --verify-only

Both ZIPs are the original committed bytes, reorganized without modification.
The helper verifies 8,485 regular files and four original symbolic links, keeps
original license notices and executable permissions, and never follows source
symlinks during extraction. One original Linux packaging link is absolute; it
is preserved as link text, not dereferenced or treated as a local installation.

Archive hashes identify these repository assets, not independently verified
upstream signatures or exact Git revisions. Audit provenance, submodules,
toolchain and dependency inputs before building. The helper runs no native code.
The native applications have not been built or runtime-tested in this task.

Original upstream projects are https://github.com/mullvad/mullvadvpn-app and
https://github.com/amnezia-vpn/amnezia-client. Their source is separately licensed;
review the licenses inside the archives and all bundled components. Possession
does not grant trademarks, vendor accounts, production APIs, signing keys or
operated gateway infrastructure. No product distribution license is selected.

Do not make new implementation only inside ignored extracted source trees.
Create a tracked component or a deliberate, license-reviewed fork before edits
that must survive workspace loss. Never delete generated sources before checking
modified, missing AND additional files; the helper refuses mismatched trees.
