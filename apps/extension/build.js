import {cp, mkdir, readFile, readdir, rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {stripTypeScriptTypes} from 'node:module';
const source = fileURLToPath(new URL('.', import.meta.url));
const variant = process.argv[2];
if (variant && !/^[a-z0-9-]{1,40}$/.test(variant)) throw new Error('Invalid extension build variant.');
const target = path.resolve(source, '../../dist', variant ? `extension-${variant}` : 'extension');
await rm(target, {recursive: true, force: true});
await mkdir(target, {recursive: true});
for (const file of ['manifest.json', 'popup.html', 'popup.css']) await cp(path.join(source, file), path.join(target, file));
for (const file of ['core', 'worker', 'popup']) {
  const sourceText = await readFile(path.join(source, `${file}.ts`), 'utf8');
  const output = stripTypeScriptTypes(sourceText, {mode: 'strip'});
  const {writeFile} = await import('node:fs/promises');
  await writeFile(path.join(target, `${file}.js`), output);
}
const manifest = JSON.parse(await readFile(path.join(target, 'manifest.json'), 'utf8'));
for (const file of [manifest.background.service_worker, manifest.action.default_popup]) await readFile(path.join(target, file));
console.log(`Built MV3 extension ${manifest.version}: ${target} (${(await readdir(target)).length} files)`);
