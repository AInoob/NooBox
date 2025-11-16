const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { writeHtml } = require('./utils/htmlStore');
const { writeJson } = require('./utils/jsonStore');
const { v4: uuid } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3030;
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'debug.log');
const HISTORY_DIR = path.join(LOG_DIR, 'history');

let commands = [];
let results = [];
const heartbeats = {};

const archivePreviousLogs = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
    return;
  }
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
  const entries = fs
    .readdirSync(LOG_DIR)
    .filter((name) => name && name !== 'history');
  if (!entries.length) {
    return;
  }
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const targetDir = path.join(HISTORY_DIR, stamp);
  fs.mkdirSync(targetDir, { recursive: true });
  entries.forEach((name) => {
    const source = path.join(LOG_DIR, name);
    const target = path.join(targetDir, name);
    try {
      fs.renameSync(source, target);
    } catch (error) {
      console.error('[debug-server] Failed to archive', name, error.message);
    }
  });
};

archivePreviousLogs();

app.use(cors());
app.use(bodyParser.json({ limit: '20mb' }));

app.post('/log', (req, res) => {
  const entry = {
    ts: new Date().toISOString(),
    ...req.body
  };
  const line = JSON.stringify(entry);
  fs.appendFile(LOG_FILE, line + '\n', () => {});
  console.log(`[debug] ${entry.ts} ${entry.engine || entry.tag || ''} ${entry.event || ''}`);
  res.json({ ok: true });
});

app.get('/logs', (_req, res) => {
  if (!fs.existsSync(LOG_FILE)) {
    return res.json([]);
  }
  const lines = fs.readFileSync(LOG_FILE, 'utf8').trim().split('\n');
  const parsed = lines
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .slice(-200);
  res.json(parsed);
});

app.post('/heartbeat', (req, res) => {
  const id = req.body?.id || 'unknown';
  const ts = Date.now();
  heartbeats[id] = ts;
  console.log(`[hb] ${id} ${new Date(ts).toISOString()}`);
  res.json({ ok: true, ts });
});

app.get('/status', (_req, res) => {
  const now = Date.now();
  const items = Object.entries(heartbeats).map(([id, ts]) => ({
    id,
    ts,
    ageMs: now - ts
  }));
  res.json({
    heartbeats: items,
    queuedCommands: commands.length,
    results: results.length
  });
});

app.post('/command', (req, res) => {
  const id = uuid();
  const command = {
    id,
    type: req.body.type || 'unknown',
    payload: req.body.payload || {},
    ts: Date.now()
  };
  commands.push(command);
  console.log(`[cmd] queued ${command.type} ${command.id}`);
  res.json({ ok: true, id });
});

app.get('/command', (_req, res) => {
  const cmd = commands.shift();
  if (!cmd) {
    return res.json({});
  }
  console.log(`[cmd] dispatched ${cmd.type} ${cmd.id}`);
  res.json(cmd);
});

app.post('/result', (req, res) => {
  const result = {
    ts: Date.now(),
    ...req.body
  };

  // Persist HTML bodies to disk for external inspection
  if (result.body) {
    const file = writeHtml(result.id || 'noid', result.body);
    if (file) {
      result.htmlPath = file;
    }
  }
  delete result.body;

  if (result.parsed) {
    const file = writeJson(`${result.id || 'noid'}-parsed`, result.parsed);
    if (file) {
      result.parsedPath = file;
      const keywords = Array.isArray(result.parsed?.keywords)
        ? result.parsed.keywords.length
        : 0;
      const items = Array.isArray(result.parsed?.results)
        ? result.parsed.results.length
        : 0;
      result.parsedSummary = {
        keywords,
        results: items
      };
    }
  }
  delete result.parsed;

  const applyResultUpdate = (entry) => {
    if (entry.override) {
      const idx = results.findIndex((existing) => {
        const sameEngine = entry.engine && existing.engine === entry.engine;
        const sameCursor =
          typeof entry.cursor !== 'undefined' &&
          typeof existing.cursor !== 'undefined' &&
          entry.cursor === existing.cursor;
        const sameId = entry.id && existing.id && entry.id === existing.id;
        return (sameEngine && sameCursor) || sameId;
      });
      if (idx >= 0) {
        results[idx] = {
          ...results[idx],
          ...entry,
          overrideApplied: true,
          updatedAt: entry.ts
        };
        return;
      }
      entry.overrideApplied = true;
    }
    results.push(entry);
  };

  applyResultUpdate(result);
  results = results.slice(-200);
  console.log(
    `[result] ${result.type || ''} ${result.id || ''} ${result.status || ''}`
  );
  res.json({ ok: true });
});

app.get('/results', (_req, res) => {
  res.json(results);
});

app.listen(PORT, () => {
  console.log(`NooBox debug server listening on http://localhost:${PORT}`);
  console.log(
    'Endpoints: POST /command, GET /command, POST /log, GET /logs, POST /result, GET /results, POST /heartbeat, GET /status'
  );
});
