import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { mkdir, mkdtemp, readFile, readdir, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createBackup, restoreBackup } from '../scripts/ops.mjs';

const password = 'fixture-only-strong-backup-password';
async function fixture(t) {
  const directory = await mkdtemp(join(tmpdir(), 'vpn-ops-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const source = join(directory, 'source.sqlite');
  const db = new DatabaseSync(source);
  db.exec("PRAGMA journal_mode=WAL; CREATE TABLE account(id INTEGER PRIMARY KEY, name TEXT); INSERT INTO account(name) VALUES ('founder')");
  return { directory, source, db, archive: join(directory, 'backup.enc'), restored: join(directory, 'private', 'restored.sqlite') };
}

test('online encrypted backup restores committed WAL data with private permissions', async (t) => {
  const f = await fixture(t);
  try {
    await createBackup(f.source, f.archive, { password });
    const encrypted = await readFile(f.archive);
    assert.equal(encrypted.subarray(0, 8).toString(), 'VPNSQL01');
    assert.equal(encrypted.includes(Buffer.from('founder')), false);
    await restoreBackup(f.archive, f.restored, { password });
    const restored = new DatabaseSync(f.restored, { readOnly: true });
    try { assert.equal(restored.prepare('SELECT name FROM account').get().name, 'founder'); }
    finally { restored.close(); }
    assert.equal((await stat(f.archive)).mode & 0o777, 0o600);
    assert.equal((await stat(f.restored)).mode & 0o777, 0o600);
    assert.equal((await stat(join(f.directory, 'private'))).mode & 0o777, 0o700);
    assert.deepEqual((await readdir(f.directory)).filter((name) => name.startsWith('.vpn-backup-')), []);
  } finally { f.db.close(); }
});

test('existing backup and restore outputs are protected unless force is explicit', async (t) => {
  const f = await fixture(t);
  try {
    await createBackup(f.source, f.archive, { password });
    await assert.rejects(createBackup(f.source, f.archive, { password }), /already exists/);
    await restoreBackup(f.archive, f.restored, { password });
    await assert.rejects(restoreBackup(f.archive, f.restored, { password }), /already exists/);
    f.db.exec("INSERT INTO account(name) VALUES ('second')");
    await createBackup(f.source, f.archive, { password, force: true });
    await restoreBackup(f.archive, f.restored, { password, force: true });
    const restored = new DatabaseSync(f.restored, { readOnly: true });
    try { assert.equal(restored.prepare('SELECT count(*) AS count FROM account').get().count, 2); }
    finally { restored.close(); }
  } finally { f.db.close(); }
});

test('wrong password cannot create or replace a restore destination', async (t) => {
  const f = await fixture(t);
  try {
    await createBackup(f.source, f.archive, { password });
    await assert.rejects(restoreBackup(f.archive, f.restored, { password: 'wrong-password-that-is-long-enough' }), /authentication failed/);
    await assert.rejects(stat(f.restored), { code: 'ENOENT' });
    await writeFile(f.restored, 'preserve previous file', { mode: 0o600 });
    await assert.rejects(restoreBackup(f.archive, f.restored, { password: 'wrong-password-that-is-long-enough', force: true }), /authentication failed/);
    assert.equal(await readFile(f.restored, 'utf8'), 'preserve previous file');
  } finally { f.db.close(); }
});

test('modified ciphertext, header and tag fail authenticated decryption', async (t) => {
  const f = await fixture(t);
  try {
    await createBackup(f.source, f.archive, { password });
    const original = await readFile(f.archive);
    for (const offset of [9, 44, 100, original.length - 1]) {
      const corrupt = Buffer.from(original); corrupt[offset] ^= 1;
      const archive = join(f.directory, `corrupt-${offset}.enc`);
      await writeFile(archive, corrupt);
      await assert.rejects(restoreBackup(archive, f.restored, { password }), /authentication failed/);
    }
    assert.deepEqual((await readdir(join(f.directory, 'private'))), []);
  } finally { f.db.close(); }
});

test('restore rejects truncated files, unsupported formats and active SQLite sidecars', async (t) => {
  const f = await fixture(t);
  try {
    await writeFile(f.archive, 'short');
    await assert.rejects(restoreBackup(f.archive, f.restored, { password }), /truncated/);
    await writeFile(f.archive, Buffer.alloc(200));
    await assert.rejects(restoreBackup(f.archive, f.restored, { password }), /Unsupported/);
    await createBackup(f.source, f.archive, { password, force: true });
    await mkdir(join(f.directory, 'private'), { mode: 0o700 });
    await writeFile(f.restored + '-wal', 'active');
    await assert.rejects(restoreBackup(f.archive, f.restored, { password, force: true }), /sidecar/);
  } finally { f.db.close(); }
});

test('password length, input aliasing and symbolic link outputs are rejected', async (t) => {
  const f = await fixture(t);
  try {
    await assert.rejects(createBackup(f.source, f.archive, { password: 'short' }), /BACKUP_PASSWORD/);
    await assert.rejects(createBackup(f.source, f.source, { password, force: true }), /must differ/);
    await symlink(f.source, f.archive);
    await assert.rejects(createBackup(f.source, f.archive, { password, force: true }), /symbolic link/);
    await assert.rejects(createBackup(f.archive, f.restored, { password }), /symbolic link/);
  } finally { f.db.close(); }
});
