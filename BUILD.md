# NooBox Build Guide

NooBox ships the same codebase to both Manifest V2 (Firefox + legacy Chrome) and Manifest V3 (modern Chrome).  
All build variants are produced through webpack and selected with the `--env.mv` flag.

## Commands

| Command | Description |
| --- | --- |
| `npm run start:v2` | Watch mode for MV2 (outputs to `dist-v2`) |
| `npm run start:v3` | Watch mode for MV3 (outputs to `dist-v3`) |
| `npm run build:v2` | Production build for MV2 |
| `npm run build:v3` | Production build for MV3 |
| `npm run build:all` | Builds both versions in sequence |
| `npm run clean` | Removes `dist`, `dist-v2`, `dist-v3`, and zip artifacts |
| `npm run release` | Clean build of both manifests + create `noobox-*.zip` + `source_code.zip` |

Each build folder contains the final `manifest.json` for that manifest version together with all static assets (`thirdParty`, `contentScript`, `_locales`, etc.).

## Release Outputs

Running `npm run release` produces:

- `dist-v2/` – unpacked MV2 extension bundle
- `dist-v3/` – unpacked MV3 extension bundle
- `noobox-v2.zip` – zipped MV2 bundle for store upload
- `noobox-v3.zip` – zipped MV3 bundle for Chrome Web Store
- `source_code.zip` – zipped source archive for store review

## Manifest Differences

- MV2 keeps a persistent background page and includes `browser_action`.
- MV3 runs the background script as a service worker (`js/background.js`) and switches to `action`.
- MV3 requires `scripting` permission for screenshot capture and cannot use `JSZip/FileSaver`, so ZIP downloads gracefully tell the user to install the MV2 build.

Apart from these manifest-specific pieces, all runtime logic is shared. Compatibility helpers in `src/utils/runtime.ts` bridge the few API differences (e.g., global scope, service worker detection) so the same TypeScript sources work in both targets.
