# Tour Transalp 2026 - Woodenlegs Dashboard

An interactive cycling event dashboard built to help the Woodenlegs prepare for Tour Transalp 2026: a seven-day road cycling stage race across the Alps.

What started as an annual European cycling trip somehow escalated into signing up for one of the most iconic amateur stage races in the world. After an unforgettable week riding through the Dolomites, the Woodenlegs decided that apparently we had not suffered enough.

This dashboard helps us prepare, share the adventure with friends and family, follow each stage, and eventually preserve the memories from the trip.

## Meet the Team

### Woodenlegs

Founded in Seattle and united by a questionable love of climbing, Woodenlegs is a group of friends who make an annual pilgrimage to Europe in search of epic rides. Tour Transalp 2026 is our biggest challenge yet.

- **Fernando Mattos** - Boca Raton, Florida, USA
  - Team photographer, Instagram documentarian, and likely source of all incriminating evidence.
- **Sergio Clemente** - Kirkland, WA, USA
  - The instigator-in-chief: picked Transalp, built the plan, and convinced everyone this was a good idea.
- **Marcelo "Albuca" Albuquerque** - Issaquah, WA, USA
  - The detail machine: structured, prepared, and probably already knows the gradient of tomorrow's climb.
- **Eduardo Laureano** - Bellevue, WA, USA
  - Fearless descender with a suspicious comfort level around trucks, switchbacks, and bad ideas.

## About Tour Transalp

Tour Transalp 2026 runs from June 21-27, 2026 across the Alps. The 2026 edition is the 22nd edition, covering 465 mi / 746 km with 56,365 ft / 17,180 m of climbing and riders from more than 35 countries.

For cyclists, it is a spectacular multi-day test of climbing, descending, pacing, fueling, and group decision-making under fatigue. For friends and family, this dashboard is the "where are they now and why are they doing this?" map.

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

## Links

- Fernando Instagram: <https://www.instagram.com/fbmattos77/>
- Fernando Strava: <https://www.strava.com/athletes/575265>
- Sergio Instagram: <https://www.instagram.com/sergio.clemente.f/>
- Sergio Strava: <https://www.strava.com/athletes/1785396>
- Marcelo Instagram: <https://www.instagram.com/albuqm/>
- Marcelo Strava: <https://www.strava.com/athletes/2309909>
- Eduardo Instagram: <https://www.instagram.com/eduardolaureano/>
- Eduardo Strava: <https://www.strava.com/athletes/102908>
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

## Project Structure

- `src/data/event.ts` contains event-level metadata such as event name, dates, location, hero image, description, totals, and event links.
- `src/data/team.ts` contains team-level metadata such as team name, rider count, team description, team photo, and project/team links.
- `src/data/riders.ts` contains rider profiles, locations, optional headshots, goals, optional stats, and optional social links.
- `src/data/stages.ts` contains stage metadata, summary copy, pacing notes, and climb cards.
- `src/data/profileClimbSegments.ts` defines the GPX profile climb overlays.
- `public/gpx/` contains the route GPX files used for maps and elevation profiles.
- `public/images/` contains team and event images.
- `src/utils/gpx.ts` parses GPX files and derives route/profile stats.
- `src/components/` contains the dashboard UI, map, profile, stage detail, team/about view, and shared controls.

## Customizing for Your Own Event

To adapt this dashboard for another cycling trip:

- Update event information in `src/data/event.ts`.
- Update team information in `src/data/team.ts`.
- Update rider profiles in `src/data/riders.ts`.
- Update stage information, route metadata, stage narrative, climb cards, and pacing notes in `src/data/stages.ts`.
- Update climb overlays in `src/data/profileClimbSegments.ts`.
- Add GPX files to `public/gpx/` and update the matching `gpxFile` paths in `src/data/stages.ts`.
- Add images to the appropriate folders under `public/images/`.

For a Mallorca camp, for example, you would mostly replace the event/team/rider data, add the route GPX files, and rewrite the stage entries for each ride.

After any route, config, or copy change, run:

```bash
npm run build
npm run test:run
```

If you change navigation, maps, or page-level behavior, also run:

```bash
npm run test:e2e
```

Deployments can be handled with any static hosting provider that supports Vite builds, including Vercel.
