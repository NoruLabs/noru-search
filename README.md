# Noru Search

A space data explorer application that lets you browse NASA datasets, space news, and real-time space weather from a single interface. 

Live: https://www.norusearch.live

## Features

- **Space News**: Stay up to date with the latest spaceflight news.
- **Astronomy Picture of the Day (APOD)**: Daily astronomical images powered by NASA.
- **NASA Media Library**: Search and explore images and videos from NASA's official archives.
- **Near Earth Objects (NEO)**: Track asteroids with hazard alerts and orbital data.
- **TechPort**: Discover and explore NASA's latest research and technology projects.
- **Exoplanets**: Check out discovered exoplanets from the NASA Exoplanet Archive.
- **GIBS Map**: Explore global satellite imagery layers directly on a map.

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router with Turbopack)
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion

## Folder Structure

This application uses a Feature-Driven Architecture to keep the code organized and easy to maintain:

- `app/api/`: Server-side edge functions handling API requests.
- `app/components/`: Reusable UI pieces, layouts, and global providers.
- `app/hooks/`: Global state management and data fetching logic (e.g., `useApod`, `useSpaceNews`).
- `app/lib/`: Shared constants, types, and utility functions.
- Domain-specific feature modules:
  - `app/apod/`: Astronomy Picture of the Day viewer.
  - `app/asteroids/`: Near Earth Object visualization.
  - `app/exoplanets/`: Exoplanet data archive.
  - `app/gibs/`: Global Imagery Browse Services map.
  - `app/nasa-media/`: NASA media search and gallery.
  - `app/news/`: Spaceflight news carousel and feeds.
  - `app/techport/`: Technology project tracker.

## Getting Started

### Prerequisites

- Node.js 18 or later.

### Installation

1. Copy the repository to your local machine.

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the main folder to add your NASA API key. If you do not provide one, the app will use a default demo key:
   ```env
   NASA_API_KEY=your_api_key_here
   ```
   *You can get a free key at https://api.nasa.gov*

4. Start the application with Turbopack:
   ```bash
   npm run dev
   ```

The app will start running at http://localhost:3000

## Contributing

Please read the `CONTRIBUTING.md` file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
