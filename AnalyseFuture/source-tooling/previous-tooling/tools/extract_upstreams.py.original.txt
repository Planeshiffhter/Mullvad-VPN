#!/usr/bin/env python3
"""Recreate and verify the two preserved upstream source archives, offline.

Run from any directory:
    python3 tools/extract_upstreams.py
    python3 tools/extract_upstreams.py --verify-only

Sources go to ignored build/upstream/{mullvad,amnezia}. Existing trees are
verified, never replaced. Verification detects added, missing and changed files,
permissions, directories and symlinks. Keep new development in tracked components: ignored
trees and their edits are not backed up by a Git commit. No upstream code runs.

The digests identify the archives already committed to this repository; they
do not establish an upstream signature, version or permission to redistribute.
"""

from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path, PurePosixPath
import posixpath
import shutil
import stat
import sys
import tempfile
from dataclasses import dataclass
from zipfile import BadZipFile, ZipFile


class ExtractError(Exception):
    """An archive or extracted tree failed validation."""


@dataclass(frozen=True)
class ArchiveSpec:
    filename: str
    root: str
    destination: str
    sha256: str
    allowed_external_links: tuple[tuple[str, str], ...] = ()


ARCHIVES = (
    ArchiveSpec(
        "mullvadvpn-app-main.zip", "mullvadvpn-app-main", "mullvad",
        "95d77642fd18ded01423c9bf125f22159479dfd058dbb801cf286f425d98ba6f",
        # Original packaging link, preserved as text, never traversed.
        (("dist-assets/linux/problem-report-link",
          "/opt/Mullvad VPN/resources/mullvad-problem-report"),),
    ),
    ArchiveSpec(
        "amnezia-client-dev.zip", "amnezia-client-dev", "amnezia",
        "f32e784d47c196158728eee8df7aeef01093df6368ebc72a142d0829a9cebcd0",
    ),
)


@dataclass(frozen=True)
class Entry:
    source: str
    kind: str
    mode: int
    digest: str = ""
    target: str = ""


@dataclass(frozen=True)
class ArchivePlan:
    archive: Path
    spec: ArchiveSpec
    entries: dict[str, Entry]


def _digest(path: Path) -> str:
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def _safe_parents(path: Path) -> None:
    """Reject symlinks in every existing component, including the leaf."""
    for parent in reversed((path, *path.parents)):
        if parent.is_symlink():
            raise ExtractError(f"Refusing symlink path: {parent}")


def prepare_archive(repository: Path, spec: ArchiveSpec) -> ArchivePlan:
    archive = repository / spec.filename
    _safe_parents(archive)
    if _digest(archive) != spec.sha256:
        raise ExtractError(f"Archive SHA-256 mismatch: {spec.filename}")
    entries: dict[str, Entry] = {}
    seen: set[str] = set()
    with ZipFile(archive) as source:
        for info in source.infolist():
            name = info.filename
            parts = name.rstrip("/").split("/")
            if (info.orig_filename != name or "\\" in name
                    or any(part in ("", ".", "..") for part in parts)
                    or parts[0] != spec.root):
                raise ExtractError(f"Unsafe archive path: {name!r}")
            relative = "/".join(parts[1:])
            if relative in seen:
                raise ExtractError(f"Duplicate archive path: {name!r}")
            seen.add(relative)
            file_type = stat.S_IFMT(info.external_attr >> 16)
            if info.is_dir():
                if file_type not in (0, stat.S_IFDIR):
                    raise ExtractError(f"Invalid archive directory: {name!r}")
                kind = "directory"
            elif file_type == stat.S_IFLNK:
                kind = "symlink"
            elif file_type in (0, stat.S_IFREG):
                kind = "file"
            else:
                raise ExtractError(f"Unsupported archive entry: {name!r}")
            if not relative:
                if kind != "directory":
                    raise ExtractError("Archive root must be a directory")
                continue
            mode = (info.external_attr >> 16) & 0o777
            mode = mode or (0o755 if kind == "directory" else 0o644)
            if kind == "symlink":
                target = os.fsdecode(source.read(info))
                if not target or "\x00" in target or "\\" in target:
                    raise ExtractError(f"Invalid symlink: {name!r}")
                resolved = posixpath.normpath(posixpath.join(
                    posixpath.dirname(relative), target))
                external = target.startswith("/") or resolved == ".." or resolved.startswith("../")
                if external and (relative, target) not in spec.allowed_external_links:
                    raise ExtractError(f"Unapproved external symlink: {name!r}")
                entries[relative] = Entry(name, kind, mode, target=target)
            elif kind == "file":
                with source.open(info) as stream:
                    digest = hashlib.file_digest(stream, "sha256").hexdigest()
                entries[relative] = Entry(name, kind, mode, digest=digest)
            else:
                entries[relative] = Entry(name, kind, mode)
    if not entries:
        raise ExtractError("Archive contains no source entries")
    # ZIPs may omit explicit directory entries. Reject file/symlink parents
    # before extraction so no later entry can write through an earlier link.
    for relative in list(entries):
        for parent in PurePosixPath(relative).parents:
            if str(parent) == ".":
                continue
            key = str(parent)
            if key in entries and entries[key].kind != "directory":
                raise ExtractError(f"Non-directory archive parent: {key!r}")
            entries.setdefault(key, Entry("", "directory", 0o755))
    return ArchivePlan(archive, spec, entries)


def verify_tree(plan: ArchivePlan, destination: Path) -> dict[str, int]:
    _safe_parents(destination)
    if not destination.is_dir():
        raise ExtractError(f"Missing source directory: {destination}")
    seen: set[str] = set()
    pending = [destination]
    counts = {"files": 0, "symlinks": 0, "directories": 0}
    while pending:
        directory = pending.pop()
        with os.scandir(directory) as children:
            for child in children:
                path = Path(child.path)
                relative = path.relative_to(destination).as_posix()
                expected = plan.entries.get(relative)
                if expected is None:
                    raise ExtractError(f"Extra source entry (preserved): {path}")
                seen.add(relative)
                mode = child.stat(follow_symlinks=False).st_mode
                if stat.S_ISLNK(mode):
                    if expected.kind != "symlink" or os.readlink(path) != expected.target:
                        raise ExtractError(f"Changed source symlink (preserved): {path}")
                    counts["symlinks"] += 1
                elif stat.S_ISDIR(mode):
                    if expected.kind != "directory":
                        raise ExtractError(f"Changed source type (preserved): {path}")
                    if stat.S_IMODE(mode) != expected.mode:
                        raise ExtractError(f"Changed directory permissions (preserved): {path}")
                    counts["directories"] += 1
                    pending.append(path)
                elif stat.S_ISREG(mode):
                    if expected.kind != "file" or _digest(path) != expected.digest:
                        raise ExtractError(f"Changed source file (preserved): {path}")
                    if stat.S_IMODE(mode) != expected.mode:
                        raise ExtractError(f"Changed file permissions (preserved): {path}")
                    counts["files"] += 1
                else:
                    raise ExtractError(f"Unsupported source entry (preserved): {path}")
    missing = set(plan.entries) - seen
    if missing:
        raise ExtractError(f"Missing source entry: {destination / sorted(missing)[0]}")
    return counts


def extract_archive(plan: ArchivePlan, destination: Path) -> None:
    _safe_parents(plan.archive)
    if _digest(plan.archive) != plan.spec.sha256:
        raise ExtractError(f"Archive changed since validation: {plan.spec.filename}")
    _safe_parents(destination)
    if destination.exists():
        raise ExtractError(f"Refusing to overwrite existing source tree: {destination}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=".extract-", dir=destination.parent))
    try:
        with ZipFile(plan.archive) as source:
            for relative, entry in plan.entries.items():
                if entry.kind == "directory":
                    (staging / relative).mkdir(parents=True, exist_ok=True)
            for relative, entry in plan.entries.items():
                if entry.kind != "file":
                    continue
                path = staging / relative
                with source.open(entry.source) as original, path.open("xb") as output:
                    shutil.copyfileobj(original, output)
                path.chmod(entry.mode)
            # Create links last and never open their targets, including the
            # explicitly approved upstream Linux packaging link outside the tree.
            for relative, entry in plan.entries.items():
                if entry.kind == "symlink":
                    os.symlink(entry.target, staging / relative)
            # Apply directory permissions after writing contents, deepest first.
            for relative in sorted(plan.entries, key=lambda name: name.count("/"), reverse=True):
                entry = plan.entries[relative]
                if entry.kind == "directory":
                    (staging / relative).chmod(entry.mode)
        verify_tree(plan, staging)
        # Recheck before publication. Never replace an existing tree, even empty.
        _safe_parents(destination)
        if destination.exists():
            raise ExtractError(f"Destination appeared during extraction: {destination}")
        staging.rename(destination)
    finally:
        if staging.exists():
            shutil.rmtree(staging)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--verify-only", action="store_true", help="verify existing trees without extracting")
    args = parser.parse_args()
    repository = Path(__file__).resolve().parent.parent
    try:
        # Validate every archive and existing tree before creating any new tree.
        plans = [prepare_archive(repository, spec) for spec in ARCHIVES]
        output = repository / "build" / "upstream"
        for plan in plans:
            destination = output / plan.spec.destination
            _safe_parents(destination)
            if destination.exists() or args.verify_only:
                verify_tree(plan, destination)
        for plan in plans:
            destination = output / plan.spec.destination
            if not destination.exists():
                extract_archive(plan, destination)
            counts = verify_tree(plan, destination)
            print(f"Verified {plan.spec.destination}: {counts['files']} files, "
                  f"{counts['symlinks']} symlinks, {counts['directories']} directories")
        print("Sources only; upstream builds and VPN connectivity remain unverified.")
        return 0
    except (ExtractError, OSError, BadZipFile, RuntimeError) as error:
        print(f"Extraction failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
