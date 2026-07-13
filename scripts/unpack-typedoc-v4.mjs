import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const zip = path.join(root, 'docusaurus/static/legacy/v4.zip');
const dest = path.join(root, 'docusaurus/static/v4');

if (!fs.existsSync(zip)) {
  throw new Error(`Missing ${path.relative(root, zip)}`);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
execFileSync('tar', ['-xf', zip, '-C', dest], { stdio: 'inherit' });

if (!fs.existsSync(path.join(dest, 'index.html'))) {
  throw new Error(
    `Expected ${path.relative(root, dest)}/index.html after unpack`,
  );
}

// eslint-disable-next-line no-console
console.log(`Unpacked TypeDoc v4 → ${path.relative(root, dest)}`);
