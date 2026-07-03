# Woodenlegs Cycling Dashboard

An interactive cycling dashboard for the Woodenlegs' multi-day road cycling trips — stage maps, elevation profiles, climb notes, and pacing. Each trip is a self-contained **manifest**, and one deployment renders one trip (chosen at build time via `VITE_TRIP`).

Trips currently in the repo:

- **`transalp-2026`** — Tour Transalp 2026, a seven-day stage race across the Alps. *(Default; served by the existing Vercel deployment.)*
- **`mallorca-2026`** — a five-day Mallorca camp: four riding days linking the Serra de Tramuntana, Sa Calobra, and Cap de Formentor, plus a rest day on the bay of Pollença.

See [Multi-trip architecture](#multi-trip-architecture) for how trips are defined and selected.

## Meet the Team

### Woodenlegs

Founded in Seattle and united by a questionable love of climbing, Woodenlegs is a group of friends who make an annual pilgrimage to Europe in search of epic rides.

## About the Camp

The Mallorca Cycling Camp 2026 covers roughly 236 mi / 379 km with about 24,960 ft / 7,610 m of climbing across four riding days and one rest day:

1. Palma → Port de Sóller (west-coast opener)
2. Port de Sóller → Sa Calobra → Port de Pollença (queen stage)
3. Rest day (Port de Pollença)
4. Cap de Formentor loop (from Port d'Alcúdia)
5. Port d'Alcúdia → Palma (return across the Pla)

For cyclists, it is a spectacular test of climbing, descending, pacing, and fueling. For friends and family, this dashboard is the "where are they now and why are they doing this?" map.

## Features

- Real GPX-based route maps and elevation profiles
- Stage-by-stage distance, climbing, risk, and pacing notes
- GPX-aligned famous climb markers
- Conservative climb-time estimates for multi-day pacing
- Full-route and individual-stage map views
- Team and rider information
- Metric and imperial unit support
- Responsive layout for desktop and mobile
- Data/config structure designed for future cycling trips

## Built for Reuse

Although this repository powers the Woodenlegs Tour Transalp dashboard, it is intentionally structured so other cyclists can fork it and customize it for their own adventures.

Good fits include:

- Gran Fondos
- Multi-day cycling trips
- Charity rides
- Stage races
- Mallorca training camps
- Local club adventures

Most event-specific content lives in data/config files, so another team can adapt the dashboard without rewriting the application.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet / React Leaflet
- Recharts
- Playwright
- Vitest / React Testing Library
- Vercel-friendly static build

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

To test from a phone or another device on the same Wi-Fi network, bind Vite to your network interface:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the network URL printed by Vite, for example:

```text
http://192.168.x.x:5173/
```

## Development Commands

```bash
npm run dev       # start Vite with hot reload
npm run build     # type-check and build production assets
npm run lint      # run ESLint
npm run test      # run Vitest in watch mode
npm run test:run  # run Vitest once
npm run test:e2e  # run Playwright smoke tests
npm run preview   # preview the production build locally
```

## Multi-trip architecture

The dashboard renders **one trip per deployment**, chosen at build time — so several trips live in the same repo without touching each other. Nothing trip-specific is hardcoded in shared source.

- `src/data/types.ts` — shared interfaces (`Stage`, `Rider`, `EventMetadata`, `TripManifest`, …).
- `src/data/stageHelpers.ts` — shared authoring helpers (`estimatedRoute`, `estimatedProfile`).
- `src/trips/<trip-id>/manifest.ts` — one self-contained **manifest** per trip: event, team, riders, stages, climbs, profile overlays, and event photos. **This is the only file you edit to change a trip.**
- `public/trips/<trip-id>/` — that trip's assets (`gpx/`, `kml/`, `images/`, `videos/`). Each manifest carries an `assetBase` so the runtime photo/video manifests resolve correctly. (The original `transalp-2026` keeps root-hosted asset paths, `assetBase: ""`, to preserve its existing deployment.)
- `src/data/activeTrip.ts` — selects the active manifest from `VITE_TRIP` (default `transalp-2026`) and computes derived values (`raceTotals`, …).
- `src/data/*.ts` (`event.ts`, `stages.ts`, …) — thin re-export shims pointing at the active trip, so components never import a trip directly.
- `src/components/` — the dashboard UI, map, profile, stage detail, team/about view, and shared controls.

### Selecting a trip per deployment

Set the `VITE_TRIP` build-time env var to a trip id:

```bash
npm run build                        # default → transalp-2026 (unchanged Vercel behaviour)
VITE_TRIP=mallorca-2026 npm run build # → Mallorca
```

- **Vercel** serves Transalp with no configuration (the default).
- **Fly.io** builds Mallorca via the `VITE_TRIP` build arg in `Dockerfile` / `fly.toml`.

An unknown `VITE_TRIP` logs a warning and falls back to the default.

## Adding or customizing a trip

To add a new trip (e.g. `dolomites-2027`):

1. Create `src/trips/dolomites-2027/manifest.ts` exporting a `TripManifest` (copy an existing manifest as a template).
2. Add its assets under `public/trips/dolomites-2027/{gpx,kml,images,videos}` and set the manifest's `assetBase` to `/trips/dolomites-2027`.
3. Register it in `src/data/activeTrip.ts`'s `TRIPS` map.
4. Build it with `VITE_TRIP=dolomites-2027`.

To update an existing trip, edit only its `manifest.ts` and its assets. Keep exactly one stage with `badge: "Queen Stage"`; mark any rest day with `isRestDay: true` (distance/elevation `0`, `gpxFile: ""`).

After any manifest, route, or copy change, run:

```bash
npm run build
npm run test:run
```

If you change navigation, maps, or page-level behavior, also run:

```bash
npm run test:e2e
```

## Deployment

The app is a static Vite build (`npm run build` → `dist/`) and can be hosted on any static provider.

### Fly.io

This repo includes `Dockerfile`, `nginx.conf`, `.dockerignore`, and `fly.toml` for a container that builds the app and serves `dist/` with nginx (SPA fallback included).

One-time setup, then deploy:

```bash
brew install flyctl          # if needed
fly auth login
fly launch --no-deploy       # claim the app name in fly.toml (edit `app`/`primary_region` first)
fly deploy
```

Notes:

- The nginx config listens on port 8080 to match `internal_port` in `fly.toml`.
- `@vercel/analytics` still loads client-side but only reports when hosted on Vercel; it is harmless elsewhere.

### Other static hosts

Any provider that supports a Vite build works (Vercel, Netlify, Cloudflare Pages, etc.): build command `npm run build`, output directory `dist/`, with an SPA fallback to `index.html`.
