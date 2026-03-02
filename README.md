# Noru Search

A space data browser built with Next.js. Explore NASA datasets — APOD, asteroids, Mars photos, exoplanets, space weather, and more — from a single interface.

**Live:** [norusearch.live](https://www.norusearch.live)

---

## What It Does

- Browse 10 NASA datasets plus daily space news from one search bar
- See today's highlights at a glance: APOD hero, risk meter, daily briefing
- Get narrative summaries of the week's space activity (Story Mode)
- Set custom alert rules for hazardous asteroids and solar flares
- Compare asteroids side-by-side, explore exoplanet trends, view asteroid timelines
- Works on desktop, tablet, and mobile with dark/light theme support

---

## Quick Start

```bash
git clone https://github.com/NoruLabs/noru-search.git
cd noru-search
npm install
```

Create `.env.local`:

```
NASA_API_KEY=your_key_here
```

Get a free key at [api.nasa.gov](https://api.nasa.gov/). Without one, the app uses `DEMO_KEY` (30 req/hour).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Datasets

| Panel | Source | What You See |
|-------|--------|--------------|
| **Feed** | NASA + [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/) | APOD hero, daily briefing, risk meter, space news, NEOs, Mars photos, flares |
| **APOD** | NASA Planetary API | Astronomy Picture of the Day with gallery |
| **Asteroids** | NASA NeoWs | Near-Earth objects with hazard indicators, timeline, compare mode |
| **Mars Rovers** | NASA Mars Photos API | Curiosity, Opportunity, Spirit — filter by camera and sol |
| **Exoplanets** | NASA Exoplanet Archive | Confirmed exoplanets with discovery trends |
| **Space Weather** | NASA DONKI | Solar flares, CMEs, geomagnetic storms, risk scoring |
| **InSight** | NASA InSight API | Mars surface weather from the InSight lander |
| **NASA Media** | NASA Image & Video Library | Searchable image/video archive |
| **Sounds** | NASA open data | Audio recordings from space missions |
| **TechPort** | NASA TechPort | Active and completed tech projects |

---

## Project Structure

```
app/
  page.tsx              # Entry point — tabs, search, dataset routing
  layout.tsx            # Root layout, fonts, providers
  globals.css           # Tailwind + CSS custom properties (two-tone design system)
  api/
    nasa/               # Server-side proxy routes (keeps API key off client)
    space-news/         # Spaceflight News API (no key needed)
  components/
    Header.tsx          # Top nav with tabs + mobile hamburger
    SearchBar.tsx       # Debounced search with history
    datasets/           # One panel per dataset + Feed, DailyBriefing, RiskMeter,
                        #   AlertConditions, StoryMode, CompareMode, AsteroidTimeline
    charts/             # NEO charts, weather charts, exoplanet trends
    details/            # Lightboxes and detail views
    ui/                 # Shared primitives (DataCard, Modal, Loader, etc.)
  hooks/                # One React Query hook per dataset
  lib/
    api.ts              # Axios client
    constants.ts        # Tab config, rover/camera constants
    types.ts            # TypeScript interfaces
    scoring.ts          # Space weather risk scoring engine
```

---

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **Data** | TanStack React Query 5, Axios |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |

---

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Serve production build
npm run lint      # Run ESLint
```

---

## Design System

The app uses a two-tone palette (`#23262A` / `#F8F8FF`) with CSS custom properties:

- `--bg-primary`, `--bg-card`, `--bg-card-hover` — backgrounds
- `--text-primary`, `--text-secondary`, `--text-muted` — text hierarchy
- `--accent`, `--accent-soft` — highlights
- `--border`, `--border-hover` — borders

Severity is conveyed through font weight and opacity, not color hue. Both dark and light themes follow this system.

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup steps, branch naming, and PR process.

---

## License

[MIT](LICENSE)
