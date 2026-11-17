"""Filesystem and real-repository integration checks for archive preservation."""

from __future__ import annotations

import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET
from zipfile import ZipFile


MODULE_PATH = Path(__file__).resolve().parents[1] / "verify_feature_archive.py"
SPEC = importlib.util.spec_from_file_location("verify_feature_archive", MODULE_PATH)
archive = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(archive)


class FeatureArchiveTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix="feature-archive-test-")
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.write("active/source.js", b"export const fixture = true;\n")
        self.write("tests/feature/integration.test.js", b"// fixture reference only; never executed\n")
        legacy_files = []
        for number in range(99):
            name = f"retained/baseline-{number}.txt"
            payload = f"baseline identity {number}\n".encode()
            self.write(name, payload)
            legacy_files.append({"original_path": f"original/{number}.txt", "preserved_path": name,
                                 "sha256": hashlib.sha256(payload).hexdigest(), "bytes": len(payload),
                                 "reason": "Independent baseline fixture"})
        original_manifest = {"baseline_commit": "fixture-baseline", "purpose": "Preserve source identities", "files": legacy_files}
        entries = []
        for number in range(81):
            original = archive.MANIFEST if number == 0 else f"AnalyseFuture/old/{number}.txt"
            payload = (json.dumps(original_manifest, indent=2) + "\n").encode() if number == 0 else f"historical payload {number}\n".encode()
            destination = f"AnalyseFuture/history/{number}.txt"
            self.write(destination, payload)
            entries.append({"original_path": original, "path": destination, "feature": "history",
                            "role": "Historical filesystem fixture", "sha256": hashlib.sha256(payload).hexdigest(),
                            "bytes": len(payload), "git_mode": "100644", "active_sources": ["active/source.js"],
                            "tests": ["tests/feature/integration.test.js"], "test_applicability": "active-feature-integration"})
        self.ledger = {"version": 1, "source_repository": "https://github.com/fixture/archive",
                       "source_commit": archive.SOURCE_COMMIT, "entries": entries, "additional_snapshots": [],
                       "source_directories": [{"original_path": "AnalyseFuture/old", "destinations": ["AnalyseFuture/history"]}],
                       "control_files": sorted(archive.CONTROL_FILES)}
        self.write(archive.MANIFEST, (json.dumps(original_manifest, indent=2) + "\n").encode())
        self.write("AnalyseFuture/README.txt", b"Current archive navigation\n")
        self.write("AnalyseFuture/FEATURE_INDEX.md", b"# Current feature index\n")
        self.save()

    def write(self, relative, payload):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
        path.chmod(0o644)

    def save(self):
        self.write(archive.MAP, (json.dumps(self.ledger, indent=2) + "\n").encode())

    def reject(self, expected):
        with self.assertRaisesRegex(archive.ArchiveVerificationError, expected):
            archive.verify(self.root)

    def test_complete_filesystem_fixture_passes(self):
        result = archive.verify(self.root)
        self.assertEqual(result["original_files"], 81)
        self.assertEqual(result["baseline_files"], 99)
        self.assertEqual(result["archive_files"], 85)
        self.assertEqual(result["original_directories"], 1)
        self.assertFalse(result["git_verified"])

    def test_same_size_payload_tampering_is_detected(self):
        path = self.root / self.ledger["entries"][1]["path"]
        payload = path.read_bytes()
        path.write_bytes(b"X" + payload[1:])
        self.reject("SHA-256 mismatch")

    def test_missing_destination_is_detected(self):
        (self.root / self.ledger["entries"][1]["path"]).unlink()
        self.reject("Missing or unreadable path")

    def test_unmapped_hidden_file_is_detected(self):
        self.write("AnalyseFuture/history/.unmapped", b"must not disappear\n")
        self.reject("Archive inventory mismatch.*unmapped")

    def test_omitted_original_folder_is_detected(self):
        self.ledger["source_directories"] = []
        self.save()
        self.reject("Original directory coverage mismatch")

    def test_wrong_original_folder_destination_is_detected(self):
        self.ledger["source_directories"][0]["destinations"] = ["AnalyseFuture"]
        self.save()
        self.reject("Original directory destination mismatch")

    def test_empty_folder_placeholder_is_not_preservation(self):
        self.ledger["source_directories"][0]["destinations"] = []
        self.save()
        self.reject("Original directory has no mapped destinations")

    def test_duplicate_destination_cannot_merge_identical_sources(self):
        self.ledger["entries"][2]["path"] = self.ledger["entries"][1]["path"]
        self.save()
        self.reject("Duplicate preserved destination")

    def test_duplicate_original_cannot_hide_missing_provenance(self):
        self.ledger["entries"][2]["original_path"] = self.ledger["entries"][1]["original_path"]
        self.save()
        self.reject("Duplicate original path")

    def test_path_traversal_is_rejected(self):
        self.ledger["entries"][1]["path"] = "AnalyseFuture/history/../../outside.txt"
        self.save()
        self.reject("Unsafe relative path")

    def test_symlink_ancestor_is_never_followed(self):
        directory = self.root / "AnalyseFuture/history"
        retained = self.root / "outside-history"
        directory.rename(retained)
        directory.symlink_to(retained, target_is_directory=True)
        self.reject("Symlink is forbidden")

    def test_executable_mode_change_is_detected(self):
        (self.root / self.ledger["entries"][1]["path"]).chmod(0o755)
        self.reject("File mode mismatch")

    def test_git_mode_does_not_require_world_readable_files(self):
        (self.root / self.ledger["entries"][1]["path"]).chmod(0o600)
        self.assertEqual(archive.verify(self.root)["original_files"], 81)

    def test_recorded_filesystem_mode_is_preserved_when_supplied(self):
        self.ledger["entries"][1]["file_mode"] = 0o644
        self.save()
        (self.root / self.ledger["entries"][1]["path"]).chmod(0o600)
        with self.assertRaisesRegex(archive.ArchiveVerificationError, "Filesystem mode mismatch"):
            archive.verify(self.root, verify_filesystem_modes=True)

    def test_portable_checkout_accepts_changed_read_write_mode(self):
        self.ledger["entries"][1]["file_mode"] = 0o600
        self.save()
        self.assertEqual((self.root / self.ledger["entries"][1]["path"]).stat().st_mode & 0o777, 0o644)
        result = archive.verify(self.root)
        self.assertFalse(result["filesystem_modes_verified"])

    def test_executable_payload_requires_executable_identity(self):
        self.ledger["entries"][1]["git_mode"] = "100755"
        self.save()
        self.reject("File mode mismatch")

    def test_missing_active_test_reference_is_detected(self):
        (self.root / "tests/feature/integration.test.js").unlink()
        self.reject("Missing or unreadable path")

    def test_changed_baseline_manifest_identity_is_detected(self):
        path = self.root / archive.MANIFEST
        manifest = json.loads(path.read_text())
        manifest["files"][0]["sha256"] = "0" * 64
        path.write_text(json.dumps(manifest))
        self.reject("Baseline identity or relocation changed")

    def test_baseline_payload_change_is_detected(self):
        (self.root / "retained/baseline-0.txt").write_bytes(b"changed\n")
        self.reject("Byte size mismatch")

    def preserve_active_baseline_before_edit(self):
        original = "retained/baseline-0.txt"
        destination = "AnalyseFuture/history/pre-change/baseline-0.txt"
        payload = (self.root / original).read_bytes()
        self.write(destination, payload)
        self.ledger["additional_snapshots"].append({
            "original_path": original, "path": destination, "feature": "history",
            "role": "Original active baseline bytes retained before a later edit",
            "sha256": hashlib.sha256(payload).hexdigest(), "bytes": len(payload),
            "git_mode": "100644", "active_sources": [], "tests": [],
            "test_applicability": "preservation-only",
        })
        manifest_path = self.root / archive.MANIFEST
        manifest = json.loads(manifest_path.read_text())
        manifest["files"][0]["preserved_path"] = destination
        manifest_path.write_text(json.dumps(manifest))
        self.write(original, b"A legitimate later implementation change\n")
        self.save()
        return destination

    def test_active_baseline_edit_can_preserve_old_bytes_in_snapshot(self):
        self.preserve_active_baseline_before_edit()
        result = archive.verify(self.root)
        self.assertEqual(result["baseline_files"], 99)
        self.assertEqual(result["additional_snapshots"], 1)

    def test_retargeted_baseline_snapshot_still_rejects_tampering(self):
        destination = self.preserve_active_baseline_before_edit()
        path = self.root / destination
        payload = path.read_bytes()
        path.write_bytes(b"X" + payload[1:])
        self.reject("SHA-256 mismatch")

    def test_preservation_only_records_need_no_runtime_test(self):
        self.ledger["entries"][1].update(active_sources=[], tests=[], test_applicability="preservation-only")
        self.save()
        self.assertEqual(archive.verify(self.root)["original_files"], 81)

    def test_real_repository_archive_and_all_baseline_records(self):
        repository = MODULE_PATH.parent.parent
        result = archive.verify(repository)
        self.assertEqual(result["original_files"], 81)
        self.assertEqual(result["baseline_files"], 99)
        self.assertEqual(result["original_directories"], 26)
        self.assertGreaterEqual(result["archive_files"], 85)

    def test_real_repository_word_archive_remains_readable_ooxml(self):
        repository = MODULE_PATH.parent.parent
        ledger = json.loads((repository / archive.MAP).read_text())
        documents = [entry for entry in ledger["entries"] if entry["original_path"].endswith(".docx")]
        self.assertEqual(len(documents), 1, "The original research Word document must be preserved")
        # Read the original package as data; never execute its historical
        # workflow, macros, links, prompts or embedded application content.
        with ZipFile(repository / documents[0]["path"]) as package:
            self.assertIsNone(package.testzip(), "Word package CRC/integrity failure")
            required = {"[Content_Types].xml", "_rels/.rels", "word/document.xml"}
            self.assertTrue(required.issubset(package.namelist()))
            for name in package.namelist():
                if name.endswith((".xml", ".rels")):
                    ET.fromstring(package.read(name))
            document = ET.fromstring(package.read("word/document.xml"))
        word = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
        paragraphs = document.findall(f".//{word}p")
        self.assertGreater(len(paragraphs), 0)
        self.assertTrue(any("".join(node.itertext()).strip() for paragraph in paragraphs for node in paragraph.iter(word + "t")),
                        "The preserved document must retain readable paragraph text")


if __name__ == "__main__":
    unittest.main()
