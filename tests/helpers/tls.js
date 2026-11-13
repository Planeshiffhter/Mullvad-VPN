import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
export async function createTlsFixture() {
  const dir = await mkdtemp(join(tmpdir(), 'vpn-tls-'));
  execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-sha256', '-days', '1',
    '-subj', '/CN=localhost', '-addext', 'subjectAltName=DNS:localhost,IP:127.0.0.1',
    '-keyout', join(dir, 'key.pem'), '-out', join(dir, 'cert.pem')], { stdio: 'ignore' });
  const [key, cert] = await Promise.all([readFile(join(dir, 'key.pem')), readFile(join(dir, 'cert.pem'))]);
  return { key, cert, ca: cert, cleanup: () => rm(dir, { recursive: true, force: true }) };
}
