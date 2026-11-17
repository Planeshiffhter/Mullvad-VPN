# Ownership and third-party licensing

No repository-wide license has been selected. Public source visibility and `private: true` in `package.json` do not grant a license to the original project code. Choosing a project license, changing contribution terms and distributing covered derivatives require an explicit owner decision.

Existing npm dependencies retain their own licenses. Preserve required copyright, license and NOTICE texts in any relevant deployment, bundle or redistribution. Consult [the current dependency inventory](LICENSE_AND_DEPENDENCY_AUDIT.md), actual package notices and the lockfile when changing dependencies.

The original Mullvad and Amnezia archives are preserved in `upstream/archives/`. Both contain GNU GPL version 3 root license texts; individual components and bundled assets can have additional terms. Amnezia also includes `THIRD_PARTY_LICENSES.md`. Possession and offline extraction do not authorize incompatible relicensing or transfer vendor trademarks, backend services, accounts, relay access, release keys or signing authority.

Before integrating native source or distributing builds, record the exact source artifact/ref, covered files, root and third-party licenses, linking/bundling model, modifications, source-offer obligations, required notices and intended product license. Obtain specialized review for unclear GPL/AGPL/LGPL/MPL or mixed-license obligations. Open source can support commercial use while still imposing distribution conditions.

Use original branding and owner-controlled signing/update infrastructure. Do not remove upstream notices, relabel proprietary assets or assume a provider API is available for our service. Keep new development tracked outside ignored extraction outputs.

The [earlier licensing guidance](../AnalyseFuture/licensing/previous-docs/LICENSING.md) and [dependency inventory](../AnalyseFuture/licensing/previous-docs/DEPENDENCY_LICENSE_MATRIX.md) are preserved as historical references; neither selects a project license nor grants new rights.
