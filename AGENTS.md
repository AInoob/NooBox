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
   - When debugging Google/Bing, you can trigger the Chrome debugger auto-focus flows (enabled in debug builds). Watch for the pending-focus pill in `searchResult.html` before the tab is focused.
   - If parsing still fails, loop back to MCP to reconfirm selectors/state and adjust the adapter again.
   - For engines that block inline script injection (e.g., Bing), use the debug-server `engineEval` command (`{"type":"engineEval","payload":{"engine":"bing","cursor":<cursor>,"code":"...expression..."}}`) to run CDP-powered evaluations. These logs show up under `debug-server/logs/results/*-parsed.json` so you can confirm selectors like `.pigc .pritext` emit the expected dimensions.
   - Useful snippet to capture Bing counts during testing:
     ```js
     (() => ({
       images: document.querySelectorAll('a.richImgLnk').length,
       pages: document.querySelectorAll('.insights.rr .pginlv ul li .pigc .richImgLnk').length
     }))()
     ```

8. **Finalize**
   - Once satisfied, run a production build (`npm run build:v3` / `build:v2`) to ensure debug-only code is not bundled.
   - Document any new selectors/state fields the engine now depends on.

# Testing Knowledge

- Always run exploratory work in debug builds so the `chrome.debugger` focus helpers are available. Watch the pending-focus pill in `searchResult.html`; it must appear *before* the backend focuses Google/Bing and disappear once control returns.
- Bing (and other CSP-heavy engines) cannot accept inline injections, so rely on the debug server’s `engineEval` command:
  ```
  curl -X POST -H 'Content-Type: application/json' \
    -d '{"type":"engineEval","payload":{"engine":"bing","cursor":<cursor>,"code":"(() => ({images: document.querySelectorAll(\"a.richImgLnk\").length, pages: document.querySelectorAll(\".insights.rr .pginlv ul li .pigc .richImgLnk\").length}))()"}}' \
    http://localhost:3030/command
  ```
  The response shows up under `debug-server/logs/results/*-parsed.json`, letting you confirm selectors like `.pigc`, `.pritext`, and `.richImgLnk` before you touch the adapter.
- When Bing/Google runs stall, focus the engine tab via the debugger (triggered automatically by `pendingFocus`) and scroll to the bottom to hydrate thumbnails, then use `/results` to confirm `pages > 0` and that metadata (dimensions, site text) matches DOM snippets such as `.pirc .pritext`.
- For thorough repros, kick off searches with known assets (e.g., `https://ainoob.com/api/getImage/4b2fc4bd-7782-4938-bec8-63b68a348a70`) and monitor `debug-server/logs/html/*.html` for the captured DOM.
