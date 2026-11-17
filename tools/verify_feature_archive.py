#!/usr/bin/env python3
"""Verify feature-grouped historical material without executing any of it.

The default works from a shallow/offline checkout with any normal Git umask.
--verify-git checks independent source-commit tree/blob evidence when available.
--verify-filesystem-modes checks the migration instance's recorded permission
bits; Git snapshots do not retain those read/write bits across fresh checkouts.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess


SOURCE_COMMIT = "86792c239716824eb32d94d67a355c1fbac13924"
SOURCE_ARCHIVE_COUNT = 81
BASELINE_FILE_COUNT = 99
ARCHIVE = "AnalyseFuture"
MAP = f"{ARCHIVE}/ARCHIVE_FEATURE_MAP.json"
MANIFEST = f"{ARCHIVE}/PRESERVATION_MANIFEST.json"
CONTROL_FILES = {
    f"{ARCHIVE}/README.txt", MANIFEST, MAP, f"{ARCHIVE}/FEATURE_INDEX.md",
}


class ArchiveVerificationError(Exception):
    """An archive identity, inventory, reference or provenance check failed."""


def _fail(message: str) -> None:
    raise ArchiveVerificationError(message)


def _relative(value: object) -> str:
    if not isinstance(value, str) or not value or "\\" in value or "\x00" in value:
        _fail(f"Invalid relative path: {value!r}")
    path = PurePosixPath(value)
    if path.is_absolute() or any(part in ("", ".", "..") for part in value.split("/")):
        _fail(f"Unsafe relative path: {value!r}")
    return value


def _file(root: Path, relative: object) -> Path:
    relative = _relative(relative)
    path = root
    for part in PurePosixPath(relative).parts:
        path /= part
        try:
            info = path.lstat()
        except OSError as error:
            _fail(f"Missing or unreadable path {relative}: {error.strerror}")
        if stat.S_ISLNK(info.st_mode):
            _fail(f"Symlink is forbidden in path: {relative}")
    if not stat.S_ISREG(path.lstat().st_mode):
        _fail(f"Expected a regular file: {relative}")
    return path


def _json(root: Path, relative: str) -> dict:
    try:
        value = json.loads(_file(root, relative).read_text(encoding="utf-8"))
    except (ValueError, UnicodeError, OSError) as error:
        _fail(f"Invalid JSON in {relative}: {error}")
    if not isinstance(value, dict):
        _fail(f"Expected a JSON object: {relative}")
    return value


def _identity(root: Path, record: dict, *, mode: bool = True, filesystem_modes: bool = False) -> None:
    path = _file(root, record.get("path"))
    size, digest = record.get("bytes"), record.get("sha256")
    if isinstance(size, bool) or not isinstance(size, int) or size < 0:
        _fail(f"Invalid byte size: {record.get('path')}")
    if not isinstance(digest, str) or not re.fullmatch(r"[0-9a-f]{64}", digest):
        _fail(f"Invalid SHA-256: {record.get('path')}")
    if path.stat().st_size != size:
        _fail(f"Byte size mismatch: {record['path']}")
    try:
        with path.open("rb") as stream:
            actual = hashlib.file_digest(stream, "sha256").hexdigest()
    except OSError as error:
        _fail(f"Cannot read preserved payload {record['path']}: {error.strerror}")
    if actual != digest:
        _fail(f"SHA-256 mismatch: {record['path']}")
    if mode:
        git_mode = record.get("git_mode")
        if git_mode not in ("100644", "100755"):
            _fail(f"Unsupported Git file mode: {record['path']}")
        actual_mode = stat.S_IMODE(path.stat().st_mode)
        # Git tracks file type and the owner executable flag, not read/write
        # bits. A checkout created under umask 077 may legitimately be 0600.
        if bool(actual_mode & stat.S_IXUSR) != (git_mode == "100755"):
            _fail(f"File mode mismatch: {record['path']}")
        if "file_mode" in record:
            file_mode = record["file_mode"]
            if isinstance(file_mode, bool) or not isinstance(file_mode, int) or not 0 <= file_mode <= 0o7777:
                _fail(f"Invalid filesystem mode: {record['path']}")
            if filesystem_modes and actual_mode != file_mode:
                _fail(f"Filesystem mode mismatch: {record['path']}")


def _records(value: object, field: str) -> list[dict]:
    if not isinstance(value, list) or any(not isinstance(record, dict) for record in value):
        _fail(f"Expected an array of objects: {field}")
    return value


def _git(root: Path, *args: str) -> bytes:
    try:
        result = subprocess.run(["git", "-C", str(root), *args], capture_output=True, check=False)
    except OSError:
        _fail("Git is unavailable for optional independent source verification")
    if result.returncode:
        _fail("Source Git evidence unavailable; fetch the recorded commit or omit --verify-git")
    return result.stdout


def _verify_source_git(root: Path, ledger: dict, entries: list[dict], snapshots: list[dict]) -> None:
    commit = ledger["source_commit"]
    tree = {}
    for item in _git(root, "ls-tree", "-r", "-z", commit).split(b"\0"):
        if not item:
            continue
        metadata, raw_path = item.split(b"\t", 1)
        mode, kind, blob = metadata.decode("ascii").split()
        path = raw_path.decode("utf-8")
        tree[path] = (mode, kind, blob)
    archive_paths = {path for path in tree if path.startswith(ARCHIVE + "/")}
    if archive_paths != {entry["original_path"] for entry in entries}:
        _fail("Source Git archive membership differs from relocation entries")
    for record in entries + snapshots:
        original = record["original_path"]
        if original not in tree:
            _fail(f"Original path absent from source Git tree: {original}")
        mode, kind, blob = tree[original]
        if kind != "blob" or mode != record["git_mode"]:
            _fail(f"Source Git mode/type mismatch: {original}")
        payload = _git(root, "cat-file", "blob", blob)
        if len(payload) != record["bytes"] or hashlib.sha256(payload).hexdigest() != record["sha256"]:
            _fail(f"Source Git blob identity mismatch: {original}")


def _verify_directories(ledger: dict, entries: list[dict]) -> int:
    # A source folder can split across several feature collections. Its map
    # must enumerate exactly the real parents of every descendant payload,
    # rather than leave an empty directory or a guessed compatibility link.
    expected: dict[str, set[str]] = {}
    for entry in entries:
        parent = PurePosixPath(entry["original_path"]).parent
        while parent.as_posix() not in (ARCHIVE, "."):
            expected.setdefault(parent.as_posix(), set()).add(PurePosixPath(entry["path"]).parent.as_posix())
            parent = parent.parent
    observed = {}
    for record in _records(ledger.get("source_directories"), "source_directories"):
        original = _relative(record.get("original_path"))
        if original in observed:
            _fail(f"Duplicate original directory: {original}")
        destinations = record.get("destinations")
        if not isinstance(destinations, list) or not destinations:
            _fail(f"Original directory has no mapped destinations: {original}")
        safe_destinations = [_relative(path) for path in destinations]
        if len(set(safe_destinations)) != len(safe_destinations):
            _fail(f"Duplicate directory destination: {original}")
        observed[original] = set(safe_destinations)
    if set(observed) != set(expected):
        _fail(f"Original directory coverage mismatch: missing={sorted(set(expected) - set(observed))}, unexpected={sorted(set(observed) - set(expected))}")
    for original, destinations in observed.items():
        if destinations != expected[original]:
            _fail(f"Original directory destination mismatch: {original}")
    return len(observed)


def verify(root: str | Path, verify_git: bool = False,
           verify_filesystem_modes: bool = False) -> dict[str, int | bool]:
    """Verify the complete archive or raise ArchiveVerificationError.

    Returns source/snapshot/baseline counts after every check succeeds. Source
    counts and the source commit are pinned to this version-1 migration; future
    migrations must retain this evidence rather than silently replace it.
    Exact file_mode permission checks are opt-in for the migration instance;
    the portable default always checks Git's file type/executable identity.
    """
    root = Path(root).absolute()
    if root.resolve() != root or not root.is_dir():
        _fail("Repository root must be a real directory")
    ledger = _json(root, MAP)
    if ledger.get("version") != 1 or ledger.get("source_commit") != SOURCE_COMMIT:
        _fail("Unsupported migration version or source commit")
    repository = ledger.get("source_repository")
    if not isinstance(repository, str) or not repository.startswith("https://github.com/"):
        _fail("Source repository must be a GitHub HTTPS identity")
    controls = ledger.get("control_files")
    if not isinstance(controls, list) or any(not isinstance(item, str) for item in controls) or len(controls) != len(CONTROL_FILES) or set(controls) != CONTROL_FILES:
        _fail("Archive control-file membership differs from the version-1 schema")
    entries = _records(ledger.get("entries"), "entries")
    snapshots = _records(ledger.get("additional_snapshots"), "additional_snapshots")
    if len(entries) != SOURCE_ARCHIVE_COUNT:
        _fail(f"Expected {SOURCE_ARCHIVE_COUNT} original archive records, got {len(entries)}")
    originals, destinations = set(), set()
    for label, records in (("entries", entries), ("additional_snapshots", snapshots)):
        local_originals = set()
        for record in records:
            original, destination = _relative(record.get("original_path")), _relative(record.get("path"))
            if original in local_originals or (label == "entries" and original in originals):
                _fail(f"Duplicate original path: {original}")
            local_originals.add(original)
            originals.add(original)
            if label == "entries" and not original.startswith(ARCHIVE + "/"):
                _fail(f"Original archive path is outside {ARCHIVE}: {original}")
            if label == "additional_snapshots" and original.startswith(ARCHIVE + "/"):
                _fail(f"Additional snapshot duplicates archive provenance: {original}")
            if not destination.startswith(ARCHIVE + "/") or destination in CONTROL_FILES:
                _fail(f"Invalid preserved destination: {destination}")
            if destination in destinations:
                _fail(f"Duplicate preserved destination: {destination}")
            destinations.add(destination)
            feature = record.get("feature")
            if not isinstance(feature, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", feature):
                _fail(f"Invalid feature slug: {destination}")
            if not destination.startswith(f"{ARCHIVE}/{feature}/"):
                _fail(f"Destination does not match feature collection: {destination}")
            if not isinstance(record.get("role"), str) or not record["role"].strip():
                _fail(f"Missing historical role: {destination}")
            for field in ("active_sources", "tests"):
                refs = record.get(field)
                if not isinstance(refs, list) or any(not isinstance(ref, str) for ref in refs):
                    _fail(f"Invalid {field} references: {destination}")
                for ref in refs:
                    if ref.startswith(ARCHIVE + "/"):
                        _fail(f"Active reference points to historical content: {ref}")
                    _file(root, ref)
            applicability = record.get("test_applicability")
            if applicability not in ("active-feature-integration", "preservation-only"):
                _fail(f"Invalid test applicability: {destination}")
            if applicability == "active-feature-integration" and (not record["active_sources"] or not record["tests"]):
                _fail(f"Active feature requires source and test references: {destination}")
            _identity(root, record, filesystem_modes=verify_filesystem_modes)
    directory_count = _verify_directories(ledger, entries)
    expected = destinations | CONTROL_FILES
    observed = set()
    def walk_error(error: OSError) -> None:
        _fail(f"Archive traversal failed: {error.strerror}")

    for directory, folders, names in os.walk(root / ARCHIVE, followlinks=False, onerror=walk_error):
        for name in folders + names:
            path = Path(directory) / name
            relative = path.relative_to(root).as_posix()
            if path.is_symlink():
                _fail(f"Symlink is forbidden in archive inventory: {relative}")
            if path.is_file():
                observed.add(relative)
            elif not path.is_dir():
                _fail(f"Unsupported archive entry: {relative}")
    if observed != expected:
        _fail(f"Archive inventory mismatch: unmapped={sorted(observed - expected)}, missing={sorted(expected - observed)}")
    for control in CONTROL_FILES:
        _file(root, control)
    preserved_manifests = [entry for entry in entries if entry["original_path"] == MANIFEST]
    if len(preserved_manifests) != 1:
        _fail("Exactly one original preservation manifest must be retained")
    old = _json(root, preserved_manifests[0]["path"])
    current = _json(root, MANIFEST)
    old_records = _records(old.get("files"), "original manifest files")
    current_records = _records(current.get("files"), "current manifest files")
    if len(old_records) != BASELINE_FILE_COUNT or len(current_records) != BASELINE_FILE_COUNT:
        _fail(f"Both preservation manifests must retain all {BASELINE_FILE_COUNT} baseline records")
    if {key: value for key, value in old.items() if key != "files"} != {key: value for key, value in current.items() if key != "files"}:
        _fail("Preservation manifest metadata changed")
    # A later legitimate edit to a baseline-retained active file may preserve
    # its old bytes in an additional snapshot. Identity checks still require
    # that snapshot to match the unchanged baseline hash/size exactly.
    relocation = {entry["original_path"]: entry["path"] for entry in entries + snapshots}
    baseline_originals = set()
    for previous, updated in zip(old_records, current_records, strict=True):
        original = _relative(previous.get("original_path"))
        if original in baseline_originals:
            _fail(f"Duplicate baseline original path: {original}")
        baseline_originals.add(original)
        expected_record = dict(previous)
        previous_path = _relative(previous.get("preserved_path"))
        expected_record["preserved_path"] = relocation.get(previous_path, previous_path)
        if updated != expected_record:
            _fail(f"Baseline identity or relocation changed: {original}")
        _identity(root, {"path": updated["preserved_path"], "sha256": updated.get("sha256"), "bytes": updated.get("bytes")}, mode=False)
    if verify_git:
        _verify_source_git(root, ledger, entries, snapshots)
    return {"original_files": len(entries), "additional_snapshots": len(snapshots),
            "original_directories": directory_count, "baseline_files": len(current_records),
            "archive_files": len(observed), "git_verified": verify_git,
            "filesystem_modes_verified": verify_filesystem_modes}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--verify-git", action="store_true", help="also verify source tree/blobs from the pinned Git commit")
    parser.add_argument("--verify-filesystem-modes", action="store_true",
                        help="check recorded read/write/execute permissions in the original migration instance")
    args = parser.parse_args()
    try:
        result = verify(args.root, verify_git=args.verify_git,
                        verify_filesystem_modes=args.verify_filesystem_modes)
    except (ArchiveVerificationError, OSError) as error:
        print(f"Archive verification failed: {error}")
        return 1
    print("Feature archive verified: " + json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
