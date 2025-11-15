const fs = require('fs');
const path = require('path');

const RESULT_DIR = path.join(__dirname, '..', 'logs', 'results');

const ensureDir = () => {
  if (!fs.existsSync(RESULT_DIR)) {
    fs.mkdirSync(RESULT_DIR, { recursive: true });
  }
};

const sanitize = (name) => name.replace(/[^a-zA-Z0-9_.-]/g, '_');

const writeJson = (id, payload) => {
  try {
    ensureDir();
    const file = path.join(RESULT_DIR, `${sanitize(id)}.json`);
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
    return file;
  } catch (e) {
    console.error('[jsonStore] failed to write json', e.message);
    return null;
  }
};

module.exports = {
  writeJson
};
