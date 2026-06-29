# AGENTS.md

## Cursor Cloud specific instructions

This is a single static frontend app (React + TypeScript + Vite); there is no backend, database, or external service. All commands run from the repo root.

- Standard scripts are defined in `package.json` and documented in `README.md` (`dev`, `build`, `lint`, `test`/`test:run`, `test:e2e`, `preview`).
- Dev server: `npm run dev` serves on `http://127.0.0.1:5173/`. Hot reload is enabled.
- E2E tests (`npm run test:e2e`) use Playwright, which auto-starts the Vite dev server and reuses an already-running one. The Playwright Chromium browser must be installed first via `npx playwright install --with-deps chromium` (not part of the update script; run on demand if e2e is needed).
- Expected non-issues: recharts logs `width(-1) and height(-1)` console warnings during initial render/in tests, and `vite build` warns about a chunk larger than 500 kB. Both are benign.
