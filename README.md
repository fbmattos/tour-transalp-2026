# Tour Transalp 2026 Dashboard

Personal route, climbing, GPX profile, and pacing dashboard for Fernando Mattos at Tour Transalp 2026.

Fernando is riding Tour Transalp from June 21-27, 2026: a fascinating and spectacular seven-day road cycling stage race across the Alps. The 2026 edition is the 22nd edition, covering 465 mi / 746 km with 56,365 ft / 17,180 m of climbing and riders from more than 35 countries.

## About

This app helps study and follow each stage of the race:

- GPX-based route maps and elevation profiles
- Stage-by-stage distance, climbing, risk, and pacing notes
- GPX-aligned famous climb markers
- Conservative climb-time estimates for multi-day pacing
- Full-route and individual-stage map views

The project was created with a combination of Claude Code and Codex to help prepare for the event, study each stage, and make the route easier to follow.

## Links

- Fernando Instagram: <https://www.instagram.com/fbmattos77/>
- Fernando Strava: <https://strava.app.link/lLgTvuuVS3b>
- Official Tour Transalp website: <https://event.delius-klasing.de/en/tour-transalp/event/>
- Official Tour Transalp Instagram: <https://www.instagram.com/tourtransalp/>
- Gran Fondo Guide: <https://www.granfondoguide.com/Events/Index/5927/tour-transalp>
- StageRaces: <https://stageraces.com/event/tour-transalp/>

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet / React Leaflet
- Recharts

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
npm run dev      # start Vite with hot reload
npm run build    # type-check and build production assets
npm run lint     # run ESLint
npm run preview  # preview the production build locally
```

## Project Structure

- `src/data/event.ts` contains event-level metadata such as event name, dates, location, hero image, description, totals, and event links.
- `src/data/team.ts` contains team-level metadata such as team name, rider count, team description, and project/team links.
- `src/data/riders.ts` contains rider profiles, headshots, goals, optional stats, and optional social links.
- `src/data/stages.ts` contains stage metadata, summary copy, pacing notes, and climb cards.
- `src/data/profileClimbSegments.ts` defines the GPX profile climb overlays.
- `public/gpx/` contains the route GPX files used for maps and elevation profiles.
- `src/utils/gpx.ts` parses GPX files and derives route/profile stats.
- `src/components/` contains the dashboard UI, map, profile, stage detail, and About view.

## Modifying Route or Stage Content

For event, team, or rider changes, start with `src/data/event.ts`, `src/data/team.ts`, and `src/data/riders.ts`.

For narrative or stage detail changes, update `src/data/stages.ts`.

For climb overlays on the elevation profile, update `src/data/profileClimbSegments.ts`. These segment windows are used with the GPX elevation profile to derive climb gain, gradient, category, and conservative climb-time estimates.

For replacing route files, add the GPX file to `public/gpx/` and update the matching `gpxFile` path in `src/data/stages.ts`.

After any route or copy change, run:

```bash
npm run build
```
