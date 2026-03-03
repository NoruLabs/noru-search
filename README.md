# Noru Search

> A space data explorer — browse NASA datasets, space news, and real-time space weather from a single interface.

**Live:** [norusearch.live](https://www.norusearch.live)  
**License:** [MIT](LICENSE)

---

## Features

- **Universal search** across all datasets with history and saved searches
- **Feed dashboard** — APOD hero, daily briefing, risk meter, alert conditions, NEOs, and space news carousel
- **Story Mode** — narrative weekly summary of space activity
- **Compare Mode** — side-by-side asteroid comparison
- **Alert rules** — custom threshold alerts for hazardous asteroids and solar flares
- **Charts** — exoplanet discovery trends, NEO size/velocity charts, space weather charts
- **Asteroid timeline** — visual timeline of close approaches
- **PWA-ready** — service worker and web app manifest included
- **Dark / light theme** with responsive layout (mobile, tablet, desktop)

---

## Quick Start

```bash
git clone https://github.com/NoruLabs/noru-search.git
cd noru-search
npm install
```

Create `.env.local` in the project root:

```env
NASA_API_KEY=your_nasa_api_key
```

Get a free key at [api.nasa.gov](https://api.nasa.gov). Without one the app falls back to `DEMO_KEY` (30 req/hour, 50 req/day).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Production build:**
> ```bash
> npm run build && npm start
> ```

---

## Datasets

| Tab | Source | What You Get |
|-----|--------|--------------|| **Feed** | NASA + [Spaceflight News API](https://api.spaceflightnewsapi.net/v4/) | APOD hero, daily briefing, risk meter, alert conditions, space news carousel, NEOs |
| **APOD** | NASA Planetary API | Astronomy Picture of the Day — images, YouTube embeds, and direct videos; date picker; gallery |
| **Asteroids** | NASA NeoWs | Near-Earth objects, hazard indicators, timeline, compare mode, charts |
| **Mars Rovers** | NASA Mars Photos API | Curiosity, Opportunity, Spirit — filter by sol and camera |
| **Exoplanets** | NASA Exoplanet Archive | Confirmed exoplanets with discovery-year trends |
| **Space Weather** | NASA DONKI | Solar flares, CMEs, geomagnetic storms, risk score |
| **InSight** | NASA InSight API | Mars surface weather from the InSight lander |
| **NASA Media** | NASA Image & Video Library | Searchable image and video archive |
| **Sounds** | NASA open data | Audio recordings from space missions |
| **TechPort** | NASA TechPort | Active and completed NASA technology projects |

---

## Project Structure

```
noru-search/
├── app/
│   ├── page.tsx              # Root page — tab routing, search, feed
│   ├── layout.tsx            # Root layout, fonts, providers
│   ├── globals.css           # Tailwind + CSS custom properties (design tokens)
│   ├── api/
│   │   ├── nasa/             # Server-side proxy routes (API key never reaches client)
│   │   │   ├── apod/         # Astronomy Picture of the Day
│   │   │   ├── neo/          # Near-Earth objects
│   │   │   ├── mars/         # Mars rover photos
│   │   │   ├── exoplanets/   # NASA Exoplanet Archive
│   │   │   ├── feed/         # Combined daily feed
│   │   │   ├── insight/      # InSight Mars weather
│   │   │   ├── media/        # NASA Image & Video Library
│   │   │   ├── sounds/       # NASA Sounds
│   │   │   ├── techport/     # TechPort projects
│   │   │   └── weather/      # DONKI space weather
│   │   └── space-news/       # Spaceflight News API (no key required)
│   ├── components/
│   │   ├── Header.tsx        # Navigation tabs + mobile menu
│   │   ├── SearchBar.tsx     # Debounced search with history
│   │   ├── datasets/         # One panel per dataset + Feed, DailyBriefing,
│   │   │                     #   RiskMeter, AlertConditions, StoryMode, CompareMode
│   │   ├── charts/           # Recharts wrappers (NEO, weather, exoplanets)
│   │   ├── details/          # Lightboxes and drill-down views
│   │   └── ui/               # Shared primitives (DataCard, Modal, Loader …)
│   ├── hooks/                # One TanStack React Query hook per dataset
│   └── lib/
│       ├── api.ts            # Axios client + error helpers
│       ├── constants.ts      # TAB_CONFIG, rover/camera lists
│       ├── types.ts          # All TypeScript interfaces
│       ├── scoring.ts        # Space weather risk score engine
│       └── storage.ts        # localStorage helpers (saved searches, alerts)
└── public/
    ├── manifest.json         # PWA manifest
    └── sw.js                 # Service worker
```

---

## Tech Stack

| | |
|---|---|
| **Framework** | Next.js 16.1 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4 |
| **Data fetching** | TanStack React Query 5, Axios |
| **Charts** | Recharts 3 |
| **Icons** | Lucide React |
| **Linting** | ESLint 9 (eslint-config-next) |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NASA_API_KEY` | No | NASA Open APIs key. Falls back to `DEMO_KEY` if unset. Get one free at [api.nasa.gov](https://api.nasa.gov). |

---

## Scripts

```bash
npm run dev     # Development server (Turbopack)
npm run build   # Production build
npm start       # Serve production build
npm run lint    # ESLint
```

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup steps, branch naming, coding standards, and the PR process.

---

## License

[MIT](LICENSE)
