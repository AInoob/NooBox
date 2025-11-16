# Debugging A Broken Image Search Engine

Use this checklist whenever an image search engine integration regresses. The flow assumes you have Chrome MCP available for ad‑hoc testing, and the NooBox debug server + debug build wiring that streams HTML/results back to disk.

1. **Smoke-test via Chrome MCP**
   - Launch a new page with the failing engine URL (e.g., Yandex `https://yandex.com/images/search?url=...`).
   - Use the MCP tools (`navigate`, `take_snapshot`, DOM inspectors) to capture the selectors, embedded state (`data-state`/`data-bem`), redirects (`retpath`), and any JSON blobs the page exposes.
   - Note keywords/tiles/site-lists you expect to scrape. Save example URLs and DOM snippets.

2. **Run the Extension in Debug Mode**
   - `npm run build:v3:debug` (or `build:v2:debug` if working on MV2). Debug builds are unminified and auto-enable `debugMode`.
   - Reload the extension in Chrome; alternatively, queue `{"type":"reload"}` through the debug server once it is running (next step).

3. **Start/Verify the Debug Server**
   - `npm --prefix debug-server start` (port 3030 by default). Confirm `/status` returns an active heartbeat.
   - On each startup the server archives the previous `debug-server/logs` contents into `debug-server/logs/history/<timestamp>/`, so you always start with a clean slate.
   - The server writes inbound HTML to `debug-server/logs/html/*.html` and parsed payloads to `debug-server/logs/results/*-parsed.json`.

4. **Trigger Remote Commands**
   - POST to `/command` with `{"type":"imageSearch","payload":{"url":"<test image>"}}` (or include `base64OrUrl` if you have a raw blob). The extension now runs the full tab-per-engine flow for you.
   - Wait for the extension heartbeat loop to pick it up; monitor `/results` until the command lands.
   - Each result entry provides:
     * `htmlPath` → raw HTML we fetched.
     * `parsedPath` → the adapter’s structured output.
     * `parsedSummary` → counts of keywords/results for quick sanity.
   - When an engine re-posts with `override: true`, the debug server replaces its previous row so `/results` always reflects the freshest payload.

5. **Inspect Captured HTML/JSON**
   - Open the `htmlPath` file to analyze class names, embedded React state, redirect flows, etc. Beautify if necessary (`npx js-beautify file.html`).
   - Open the `parsedPath` JSON to see what the adapter produced. Compare against expected keywords/results from MCP observations.

6. **Update the Adapter**
   - Modify `src/background/imageSearch/<engine>ImageSearch.ts` to:
     * Follow intermediate shells (e.g., `retpath`) before scraping.
     * Prefer structured state (React/JSON) when available, falling back to DOM selectors.
     * Normalize URLs via `absolutize` and unwrap redirectors.
     * Populate metadata (`imageInfo`, keywords, descriptions) expected by the UI.
   - Rebuild the debug bundle and reload the extension (repeat steps 2–4).

7. **Iterate Until Parsed Output Looks Good**
   - Use `/results` + stored JSON to verify keyword/result counts.
   - If parsing still fails, loop back to MCP to reconfirm selectors/state and adjust the adapter again.

8. **Finalize**
   - Once satisfied, run a production build (`npm run build:v3` / `build:v2`) to ensure debug-only code is not bundled.
   - Document any new selectors/state fields the engine now depends on.
