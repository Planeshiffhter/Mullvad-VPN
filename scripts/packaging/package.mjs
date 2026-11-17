import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { copyFile, lstat, mkdir, mkdtemp, readFile, rename, rm, utimes, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const execFile = promisify(execFileCallback);
const rootDirectory = fileURLToPath(new URL('../../', import.meta.url));
const extensionFiles = ['core.js', 'manifest.json', 'popup.css', 'popup.html', 'popup.js', 'worker.js'];
const fixedTime = new Date('2020-01-01T00:00:00Z');

async function notices(root) {
  const lock = JSON.parse(await readFile(join(root, 'package-lock.json'), 'utf8'));
  let result = 'Private Route — third-party notices\n\nThe extension contains original application code and uses official Chrome APIs.\nThe server dependencies below are not bundled as extension executable code. Their license texts are retained for the development/deployment package.\nNo whole-project license has been selected; these third-party licenses do not license the original project code.\n';
  for (const [path, metadata] of Object.entries(lock.packages).sort(([a], [b]) => a.localeCompare(b))) {
    if (!path || metadata.dev || !path.startsWith('node_modules/')) continue;
    const pkg = JSON.parse(await readFile(join(root, path, 'package.json'), 'utf8'));
    let licenseText;
    for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE-MIT', 'license', 'license.md', 'COPYING']) {
      try { licenseText = await readFile(join(root, path, name), 'utf8'); break; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    if (!licenseText) throw new Error(`Missing installed license notice for ${pkg.name}`);
    result += `\n--- ${pkg.name}@${pkg.version} (${pkg.license || 'see license text'}) ---\n${licenseText}\n`;
    for (const name of ['NOTICE', 'NOTICE.txt', 'NOTICE.md']) {
      try { result += `\n${pkg.name} upstream ${name}:\n${await readFile(join(root, path, name), 'utf8')}\n`; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
  }
  return result;
}

export async function packageExtension({ root = rootDirectory, outputDir = join(root, 'dist') } = {}) {
  root = resolve(root); outputDir = resolve(outputDir);
  await mkdir(outputDir, { recursive: true });
  const staging = await mkdtemp(join(outputDir, '.package-'));
  try {
    const manifest = JSON.parse(await readFile(join(root, 'dist/extension/manifest.json'), 'utf8'));
    if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) throw new Error('Invalid extension version');
    for (const name of extensionFiles) {
      const path = join(root, 'dist/extension', name);
      if (!(await lstat(path)).isFile()) throw new Error('Packaged extension assets must be regular files');
      await copyFile(path, join(staging, name));
      await utimes(join(staging, name), fixedTime, fixedTime);
    }
    await writeFile(join(staging, 'THIRD_PARTY_NOTICES.txt'), await notices(root));
    await utimes(join(staging, 'THIRD_PARTY_NOTICES.txt'), fixedTime, fixedTime);
    const archiveName = `private-route-extension-${manifest.version}.zip`;
    const temporaryArchive = join(outputDir, `.private-route-${process.pid}.zip`);
    try {
      await rm(temporaryArchive, { force: true });
      await execFile('zip', ['-X', '-q', temporaryArchive, ...[...extensionFiles, 'THIRD_PARTY_NOTICES.txt'].sort()], { cwd: staging });
      const archive = join(outputDir, archiveName);
      await rename(temporaryArchive, archive);
      const sha256 = createHash('sha256').update(await readFile(archive)).digest('hex');
      await writeFile(archive + '.sha256', `${sha256}  ${archiveName}\n`);
      return { archive, sha256 };
    } finally { await rm(temporaryArchive, { force: true }); }
  } finally { await rm(staging, { recursive: true, force: true }); }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  (async () => {
    await execFile(process.execPath, ['apps/extension/build.js'], { cwd: rootDirectory });
    const result = await packageExtension();
    console.log(`Packaged private extension: ${result.archive}\nSHA-256: ${result.sha256}`);
    console.log('No live US gateway or production release is implied.');
  })().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
