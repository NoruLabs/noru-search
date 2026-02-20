# Noru Search

A universal space data browser built with Next.js. Search, explore, and visualize NASA datasets from a single interface -- including the Astronomy Picture of the Day, near-Earth asteroids, Mars rover photos, exoplanets, space weather, and more.

**Live:** [noru-search.vercel.app](https://noru-search.vercel.app)

---

## Table of Contents

- [Features](#features)
- [Datasets](#datasets)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Universal search** across all NASA datasets with debounced input, URL-synced queries, and persistent search history.
- **Nine dataset panels**, each with dedicated UI, filtering, and detail views.
- **Interactive charts** for asteroid tracking and space weather powered by Recharts.
- **Mars rover photo browser** with camera and sol filtering, plus a fullscreen lightbox.
- **Exoplanet explorer** with discovery method and year filters.
- **Dark/light theme** toggle with system preference detection.
- **Responsive design** that works across desktop, tablet, and mobile.
- **Server-side API routes** that proxy all NASA requests, keeping your API key off the client.

---

## Datasets

| Panel | Source | Description |
|-------|--------|-------------|
| APOD | NASA Planetary API | Astronomy Picture of the Day with gallery view |
| Asteroids (NEO) | NASA NeoWs | Near-Earth object tracking with hazard indicators and charts |
| Mars Rovers | NASA Mars Rover Photos API | Photos from Curiosity, Opportunity, and Spirit |
| Exoplanets | NASA Exoplanet Archive | Confirmed exoplanet catalog with filtering |
| Space Weather | NASA DONKI | Solar flares, coronal mass ejections, geomagnetic storms |
| InSight | NASA InSight API | Mars surface weather from the InSight lander |
| NASA Media | NASA Image and Video Library | Searchable archive of NASA images and videos |
| Sounds | NASA Soundcloud / open data | Audio recordings from space missions |
| TechPort | NASA TechPort | Active and completed technology projects |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm, yarn, or pnpm
- A NASA API key (free at [api.nasa.gov](https://api.nasa.gov/))

### Installation

```bash
git clone https://github.com/NoruLabs/noru-search.git
cd noru-search
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```
NASA_API_KEY=your_api_key_here
```

The app falls back to `DEMO_KEY` if no key is set, but the demo key has strict rate limits (30 requests/hour, 50 requests/day). A personal key raises those limits to 1,000 requests/hour.

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NASA_API_KEY` | Your NASA Open API key | `DEMO_KEY` |

All external API calls are routed through Next.js API route handlers under `app/api/nasa/`. The client never sees your key.

---

## Project Structure

```
app/
  page.tsx                  # Main entry point (feed, search, dataset panels)
  layout.tsx                # Root layout with metadata, fonts, providers
  globals.css               # Global styles (Tailwind + CSS variables)
  api/nasa/                 # Server-side route handlers for each NASA endpoint
    apod/route.ts
    neo/route.ts
    mars/route.ts
    exoplanets/route.ts
    weather/route.ts
    insight/route.ts
    media/route.ts
    sounds/route.ts
    techport/route.ts
    feed/route.ts
    search/route.ts
    mars/rovers/route.ts
  components/
    Header.tsx              # Top navigation with tabs
    Footer.tsx              # Site footer
    SearchBar.tsx           # Search input with debouncing
    Tabs.tsx                # Dataset tab bar
    ThemeProvider.tsx        # Dark/light mode context
    QueryProvider.tsx        # TanStack React Query provider
    datasets/               # One panel component per dataset
    details/                # Detail and lightbox views
    search/                 # Universal search results and filters
    charts/                 # NEO and weather chart components
    ui/                     # Shared UI primitives (cards, loaders, modals, etc.)
  hooks/                    # Custom React Query hooks for each dataset
  lib/
    api.ts                  # Axios client pointing at internal API routes
    constants.ts            # Tab configuration, rover/camera constants
    types.ts                # TypeScript interfaces for all API responses
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS 4 |
| Data fetching | TanStack React Query 5, Axios |
| Charts | Recharts 3 |
| Icons | Lucide React |
| Linting | ESLint 9 with next/core-web-vitals and next/typescript |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint across the project |

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).
