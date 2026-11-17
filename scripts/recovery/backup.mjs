import { createCipheriv, createDecipheriv, randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { createReadStream, createWriteStream } from 'node:fs';
import { appendFile, chmod, link, lstat, mkdir, mkdtemp, open, rename, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { backup, DatabaseSync } from 'node:sqlite';

const scrypt = promisify(scryptCallback);
const MAGIC = Buffer.from('VPNSQL01');
const HEADER_BYTES = 8 + 32 + 12;
const TAG_BYTES = 16;
const MAX_BYTES = 512 * 1024 * 1024;

function validatePassword(password) {
  if (typeof password !== 'string' || password.length < 16 || password.length > 1024) {
    throw new Error('BACKUP_PASSWORD must contain between 16 and 1024 characters');
  }
}

async function keyFor(password, salt) {
  return scrypt(password, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
}

async function regularFile(path) {
  const info = await lstat(path);
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('Input must be a regular file, not a symbolic link');
  if (info.size > MAX_BYTES) throw new Error('Backup tool supports files up to 512 MiB');
  return info;
}

async function checkDestination(path, force) {
  try {
    const info = await lstat(path);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('Output must be a regular file, not a symbolic link');
    if (!force) throw new Error('Output already exists; use --force only after stopping the service');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

async function syncFile(path) {
  const handle = await open(path, 'r');
  try { await handle.sync(); } finally { await handle.close(); }
}

async function publish(temp, output, force) {
  // Publish atomically, protecting a concurrently-created destination unless force is explicit.
  if (force) await rename(temp, output);
  else await link(temp, output);
  await syncFile(dirname(output));
}

async function withPrivateTemp(output, task) {
  await mkdir(dirname(output), { recursive: true, mode: 0o700 });
  const directory = await mkdtemp(join(dirname(output), '.vpn-backup-'));
  await chmod(directory, 0o700);
  try { return await task(directory); }
  finally { await rm(directory, { recursive: true, force: true }); }
}

/** Make a consistent online SQLite snapshot and encrypt it with AES-256-GCM.
 * No plaintext password, recovery code or database content is logged.
 */
export async function createBackup(databasePath, outputPath, { password = process.env.BACKUP_PASSWORD, force = false } = {}) {
  validatePassword(password);
  const source = resolve(databasePath);
  const output = resolve(outputPath);
  if (source === output) throw new Error('Input and output must differ');
  await regularFile(source);
  await checkDestination(output, force);
  await withPrivateTemp(output, async (directory) => {
    const snapshot = join(directory, 'snapshot.sqlite');
    const encrypted = join(directory, 'backup.enc');
    const db = new DatabaseSync(source, { readOnly: true });
    try { await backup(db, snapshot); } finally { db.close(); }
    await chmod(snapshot, 0o600);
    await regularFile(snapshot);
    const salt = randomBytes(32);
    const nonce = randomBytes(12);
    const header = Buffer.concat([MAGIC, salt, nonce]);
    const key = await keyFor(password, salt);
    const cipher = createCipheriv('aes-256-gcm', key, nonce);
    cipher.setAAD(header);
    try {
      const handle = await open(encrypted, 'wx', 0o600);
      try { await handle.writeFile(header); } finally { await handle.close(); }
      await pipeline(createReadStream(snapshot), cipher, createWriteStream(encrypted, { flags: 'a', mode: 0o600 }));
      await appendFile(encrypted, cipher.getAuthTag());
      await syncFile(encrypted);
      await publish(encrypted, output, force);
    } finally { key.fill(0); }
  });
  return output;
}

/** Restore only after authenticated decryption and a successful SQLite integrity check.
 * Stop all users of the destination database before calling with force=true.
 */
export async function restoreBackup(inputPath, databasePath, { password = process.env.BACKUP_PASSWORD, force = false } = {}) {
  validatePassword(password);
  const input = resolve(inputPath);
  const output = resolve(databasePath);
  if (input === output) throw new Error('Input and output must differ');
  const info = await regularFile(input);
  await checkDestination(output, force);
  for (const suffix of ['-wal', '-shm', '-journal']) {
    try { await lstat(output + suffix); throw new Error('SQLite sidecar exists: stop the service and checkpoint before restore'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (info.size <= HEADER_BYTES + TAG_BYTES) throw new Error('Invalid or truncated backup');
  const handle = await open(input, 'r');
  const header = Buffer.alloc(HEADER_BYTES);
  const tag = Buffer.alloc(TAG_BYTES);
  try {
    await handle.read(header, 0, header.length, 0);
    await handle.read(tag, 0, tag.length, info.size - TAG_BYTES);
  } finally { await handle.close(); }
  if (!header.subarray(0, 8).equals(MAGIC)) throw new Error('Unsupported backup format');
  await withPrivateTemp(output, async (directory) => {
    const restored = join(directory, 'restore.sqlite');
    const key = await keyFor(password, header.subarray(8, 40));
    const decipher = createDecipheriv('aes-256-gcm', key, header.subarray(40, 52));
    decipher.setAAD(header);
    decipher.setAuthTag(tag);
    try {
      try {
        await pipeline(createReadStream(input, { start: HEADER_BYTES, end: info.size - TAG_BYTES - 1 }), decipher,
          createWriteStream(restored, { flags: 'wx', mode: 0o600 }));
      } catch { throw new Error('Backup authentication failed: wrong password, corruption or incomplete file'); }
      const db = new DatabaseSync(restored, { readOnly: true });
      try {
        const checks = db.prepare('PRAGMA integrity_check').all();
        if (checks.length !== 1 || checks[0].integrity_check !== 'ok') throw new Error('Restored SQLite integrity check failed');
      } finally { db.close(); }
      await syncFile(restored);
      await publish(restored, output, force);
    } finally { key.fill(0); }
  });
  return output;
}

async function main() {
  const [command, input, output, ...options] = process.argv.slice(2);
  if (!['backup', 'restore'].includes(command) || !input || !output || options.some((arg) => arg !== '--force') || options.length > 1) {
    throw new Error('Usage: BACKUP_PASSWORD=<secure value> node scripts/recovery/backup.mjs <backup|restore> <input> <output> [--force]');
  }
  const run = command === 'backup' ? createBackup : restoreBackup;
  await run(input, output, { force: options.includes('--force') });
  console.log(command === 'backup' ? 'Encrypted SQLite backup completed.' : 'SQLite restore completed; integrity check passed.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
