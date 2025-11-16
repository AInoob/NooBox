import fs from 'node:fs';
import path from 'node:path';
import JSON5 from 'json5';

const mode = process.env.EXT_MODE === 'debug' ? 'debug' : 'prod';
const manifestVersion = process.env.MANIFEST_VERSION === 'v2' ? 'v2' : 'v3';
const root = process.cwd();
const outputDir = process.env.OUT_DIR || `dist-${manifestVersion}`;

const basePath = path.join(root, 'manifest', manifestVersion, 'base.json');
const overridePath = path.join(
  root,
  'manifest',
  manifestVersion,
  'overrides',
  `${mode}.json5`
);

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const override = fs.existsSync(overridePath)
  ? JSON5.parse(fs.readFileSync(overridePath, 'utf8'))
  : {};

const manifest = deepMerge(base, override);

if (!manifest.name || !manifest.version) {
  throw new Error('Manifest must include name and version.');
}

if (!manifest.version_name) {
  manifest.version_name =
    mode === 'debug' ? `${manifest.version}+debug` : manifest.version;
}

if (mode === 'prod') {
  const permissions = new Set(manifest.permissions || []);
  if (permissions.has('debugger')) {
    throw new Error('Production manifest cannot request "debugger" permission.');
  }
  if (manifest.devtools_page) {
    throw new Error('Production manifest cannot declare a devtools page.');
  }
}

const outPath = path.join(root, outputDir);
fs.mkdirSync(outPath, { recursive: true });
fs.writeFileSync(
  path.join(outPath, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);
console.log(
  `✔ Wrote ${path.join(outputDir, 'manifest.json')} for ${manifestVersion} (${mode})`
);

function deepMerge(target, source, pathStack = []) {
  if (target === undefined) {
    return clone(source);
  }
  if (source === undefined) {
    return clone(target);
  }

  if (Array.isArray(target) && Array.isArray(source)) {
    const key = pathStack[pathStack.length - 1];
    if (shouldUnion(key)) {
      return Array.from(new Set([...target, ...source]));
    }
    return clone(source);
  }

  if (isObject(target) && isObject(source)) {
    const out = { ...target };
    for (const key of Object.keys(source)) {
      out[key] = deepMerge(target[key], source[key], pathStack.concat(key));
    }
    return out;
  }

  return clone(source);
}

function shouldUnion(key) {
  return (
    key === 'permissions' ||
    key === 'optional_permissions' ||
    key === 'host_permissions' ||
    key === 'optional_host_permissions'
  );
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function clone(value) {
  if (Array.isArray(value)) {
    return value.map((item) => clone(item));
  }
  if (isObject(value)) {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = clone(value[key]);
    }
    return out;
  }
  return value;
}
