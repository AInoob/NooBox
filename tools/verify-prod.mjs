import fs from 'node:fs';
import path from 'node:path';

const manifestVersion = process.env.MANIFEST_VERSION === 'v2' ? 'v2' : 'v3';
const root = process.cwd();
const outputDir = process.env.OUT_DIR || `dist-${manifestVersion}`;
const manifestPath = path.join(root, outputDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error(`Missing manifest at ${manifestPath}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const badPermissions = new Set(['debugger']);

if ((manifest.permissions || []).some((permission) => badPermissions.has(permission))) {
  throw new Error('Production build must not include the "debugger" permission.');
}

if (manifest.devtools_page) {
  throw new Error('Production build must not include a devtools page.');
}

const debugWorker = path.join(root, outputDir, 'js', 'background.debug.js');
if (fs.existsSync(debugWorker)) {
  throw new Error('Production build should not emit background.debug.js.');
}

const devtoolsDir = path.join(root, outputDir, 'devtools');
if (fs.existsSync(devtoolsDir)) {
  throw new Error('Production build should not emit devtools assets.');
}

console.log(`✔ Production build verified for ${manifestVersion}.`);
