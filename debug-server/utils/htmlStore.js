const fs = require('fs');
const path = require('path');

const HTML_DIR = path.join(__dirname, '..', 'logs', 'html');

const ensureDir = () => {
  if (!fs.existsSync(HTML_DIR)) {
    fs.mkdirSync(HTML_DIR, { recursive: true });
  }
};

const sanitize = (name) => name.replace(/[^a-zA-Z0-9_.-]/g, '_');

const writeHtml = (id, body) => {
  try {
    ensureDir();
    const file = path.join(HTML_DIR, `${sanitize(id)}.html`);
    fs.writeFileSync(file, body, 'utf8');
    return file;
  } catch (e) {
    console.error('[htmlStore] failed to write html', e.message);
    return null;
  }
};

module.exports = {
  writeHtml
};
