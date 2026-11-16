"""Filesystem regression tests for offline, non-destructive upstream extraction."""

import hashlib
from pathlib import Path
import stat
import tempfile
import unittest
import warnings
import zipfile

from tools.extract_upstreams import (
    ArchiveSpec,
    ExtractError,
    extract_archive,
    prepare_archive,
    verify_tree,
)


class ExtractUpstreamsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory(prefix="upstream-extraction-test-")
        self.addCleanup(self.temporary.cleanup)
        self.repository = Path(self.temporary.name)
        self.destination = self.repository / "output" / "component"

    def archive(self, entries, *, allowed_external_links=()):
        """Build real ZIP members, including Unix symlinks and executable bits."""
        filename = "upstream.zip"
        with warnings.catch_warnings():
            warnings.simplefilter("ignore", UserWarning)
            with zipfile.ZipFile(self.repository / filename, "w") as archive:
                for name, value, mode in entries:
                    member = zipfile.ZipInfo(name)
                    member.create_system = 3
                    member.external_attr = mode << 16
                    archive.writestr(member, value)
        digest = hashlib.sha256((self.repository / filename).read_bytes()).hexdigest()
        return ArchiveSpec(
            filename=filename,
            root="upstream-root",
            destination="component",
            sha256=digest,
            allowed_external_links=allowed_external_links,
        )

    def fixture(self):
        return self.archive([
            ("upstream-root/src/", b"", stat.S_IFDIR | 0o755),
            ("upstream-root/src/run.sh", b"#!/bin/sh\nexit 0\n", stat.S_IFREG | 0o755),
            ("upstream-root/LICENSE", b"original notice\x00\xff\n", stat.S_IFREG | 0o644),
            ("upstream-root/src/notice", b"../LICENSE", stat.S_IFLNK | 0o777),
        ])

    def extracted(self):
        plan = prepare_archive(self.repository, self.fixture())
        extract_archive(plan, self.destination)
        return plan

    def test_roundtrip_preserves_file_bytes_mode_and_internal_symlink(self):
        plan = self.extracted()
        self.assertEqual((self.destination / "LICENSE").read_bytes(), b"original notice\x00\xff\n")
        executable = self.destination / "src" / "run.sh"
        self.assertEqual(executable.read_bytes(), b"#!/bin/sh\nexit 0\n")
        self.assertTrue(executable.stat().st_mode & stat.S_IXUSR)
        notice = self.destination / "src" / "notice"
        self.assertTrue(notice.is_symlink())
        self.assertEqual(str(notice.readlink()), "../LICENSE")
        counts = verify_tree(plan, self.destination)
        self.assertEqual(counts["files"], 2)
        self.assertEqual(counts["symlinks"], 1)
        self.assertGreaterEqual(counts["directories"], 1)
        self.assertEqual(verify_tree(plan, self.destination), counts)

    def test_modified_and_missing_files_are_detected(self):
        plan = self.extracted()
        target = self.destination / "LICENSE"
        original = target.read_bytes()
        target.write_bytes(b"changed notice")
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        target.write_bytes(original)
        target.unlink()
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)

    def test_extra_file_and_extra_empty_directory_are_detected(self):
        plan = self.extracted()
        extra = self.destination / "local-work.txt"
        extra.write_text("do not lose this work")
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        self.assertEqual(extra.read_text(), "do not lose this work")
        extra.unlink()
        extra.mkdir()
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        self.assertTrue(extra.is_dir())

    def test_extra_and_changed_symlinks_are_detected_without_touching_target(self):
        plan = self.extracted()
        outside = self.repository / "private-file"
        outside.write_text("unchanged")
        extra = self.destination / "outside"
        extra.symlink_to(outside)
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        extra.unlink()
        notice = self.destination / "src" / "notice"
        notice.unlink()
        notice.symlink_to(outside)
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        self.assertEqual(outside.read_text(), "unchanged")

    def test_directory_replaced_with_external_symlink_is_rejected(self):
        plan = self.extracted()
        outside = self.repository / "outside"
        outside.mkdir()
        marker = outside / "marker"
        marker.write_text("unchanged")
        source = self.destination / "src"
        (source / "run.sh").unlink()
        (source / "notice").unlink()
        source.rmdir()
        source.symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        self.assertEqual(marker.read_text(), "unchanged")
        self.assertEqual(list(outside.iterdir()), [marker])

    def test_wrong_archive_digest_is_rejected_before_extraction(self):
        spec = self.fixture()
        wrong = ArchiveSpec(spec.filename, spec.root, spec.destination, "0" * 64)
        with self.assertRaises(ExtractError):
            prepare_archive(self.repository, wrong)
        self.assertFalse(self.destination.exists())

    def test_archive_changed_after_preparation_is_rejected_before_extraction(self):
        plan = prepare_archive(self.repository, self.fixture())
        with zipfile.ZipFile(self.repository / "upstream.zip", "a") as archive:
            archive.writestr("upstream-root/new-file", b"unplanned payload")
        with self.assertRaises(ExtractError):
            extract_archive(plan, self.destination)
        self.assertFalse(self.destination.exists())

    def test_changed_executable_bit_is_detected(self):
        plan = self.extracted()
        executable = self.destination / "src" / "run.sh"
        executable.chmod(0o644)
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)
        self.assertEqual(executable.stat().st_mode & 0o777, 0o644)

    def test_directory_permissions_are_preserved_and_changes_detected(self):
        spec = self.archive([
            ("upstream-root/private/", b"", stat.S_IFDIR | 0o750),
            ("upstream-root/private/data", b"payload", stat.S_IFREG | 0o640),
        ])
        plan = prepare_archive(self.repository, spec)
        extract_archive(plan, self.destination)
        directory = self.destination / "private"
        self.assertEqual(directory.stat().st_mode & 0o777, 0o750)
        self.assertEqual((directory / "data").stat().st_mode & 0o777, 0o640)
        verify_tree(plan, self.destination)
        directory.chmod(0o755)
        with self.assertRaises(ExtractError):
            verify_tree(plan, self.destination)

    def test_unsafe_archive_member_paths_are_rejected(self):
        names = [
            "upstream-root/../escape",
            "/upstream-root/absolute",
            "upstream-root/../../escape",
            "upstream-root/back\\slash",
            "other-root/file",
            "upstream-root/./alias",
        ]
        for name in names:
            with self.subTest(name=name):
                spec = self.archive([(name, b"payload", stat.S_IFREG | 0o644)])
                with self.assertRaises(ExtractError):
                    prepare_archive(self.repository, spec)

    def test_duplicate_member_paths_are_rejected(self):
        spec = self.archive([
            ("upstream-root/file", b"first", stat.S_IFREG | 0o644),
            ("upstream-root/file", b"second", stat.S_IFREG | 0o644),
        ])
        with self.assertRaises(ExtractError):
            prepare_archive(self.repository, spec)

    def test_archive_symlink_ancestors_are_rejected_in_any_order(self):
        entries = [
            ("upstream-root/link", b"target", stat.S_IFLNK | 0o777),
            ("upstream-root/link/file", b"payload", stat.S_IFREG | 0o644),
        ]
        for ordered in (entries, list(reversed(entries))):
            with self.subTest(order=ordered[0][0]):
                spec = self.archive(ordered)
                with self.assertRaises(ExtractError):
                    prepare_archive(self.repository, spec)

    def test_external_links_need_an_exact_path_and_target_exception(self):
        link = ("upstream-root/link", b"/opt/vendor/tool", stat.S_IFLNK | 0o777)
        for allowed in ((), (("other", "/opt/vendor/tool"),), (("link", "/opt/vendor/other"),)):
            with self.subTest(allowed=allowed):
                spec = self.archive([link], allowed_external_links=allowed)
                with self.assertRaises(ExtractError):
                    prepare_archive(self.repository, spec)
        spec = self.archive([link], allowed_external_links=(("link", "/opt/vendor/tool"),))
        plan = prepare_archive(self.repository, spec)
        extract_archive(plan, self.destination)
        self.assertEqual(str((self.destination / "link").readlink()), "/opt/vendor/tool")
        self.assertEqual(verify_tree(plan, self.destination)["symlinks"], 1)

    def test_relative_link_escaping_tree_is_rejected(self):
        spec = self.archive([
            ("upstream-root/sub/link", b"../../private", stat.S_IFLNK | 0o777),
        ])
        with self.assertRaises(ExtractError):
            prepare_archive(self.repository, spec)

    def test_existing_destination_is_never_overwritten(self):
        plan = prepare_archive(self.repository, self.fixture())
        self.destination.mkdir(parents=True)
        marker = self.destination / "local-work"
        marker.write_text("keep me")
        with self.assertRaises(ExtractError):
            extract_archive(plan, self.destination)
        self.assertEqual(marker.read_text(), "keep me")
        self.assertEqual(list(self.destination.iterdir()), [marker])

    def test_symlink_destination_and_parent_are_never_followed(self):
        plan = prepare_archive(self.repository, self.fixture())
        outside = self.repository / "outside"
        outside.mkdir()
        self.destination.parent.mkdir()
        self.destination.symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ExtractError):
            extract_archive(plan, self.destination)
        self.destination.unlink()
        self.destination.parent.rmdir()
        self.destination.parent.symlink_to(outside, target_is_directory=True)
        with self.assertRaises(ExtractError):
            extract_archive(plan, self.destination)
        self.assertEqual(list(outside.iterdir()), [])


if __name__ == "__main__":
    unittest.main()
