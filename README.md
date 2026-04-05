# Noru Search

A space data explorer application that lets you browse NASA datasets, space news, and real-time space weather from a single interface. 

Live: https://www.norusearch.live

## Features

- Search and filter across multiple space data sources.
- View the Astronomy Picture of the Day (APOD) and NASA image library.
- Explore Near Earth Objects (NEO) such as asteroids with a timeline and hazard alerts.
- Check Mars Rover photos and weather data from Insight.
- Discover Exoplanet trends and compare space objects.
- Listen to NASA sound records and read the daily briefing.
- Save your search history and bookmark favorites.

## Tech Stack

- Framework: Next.js (App Router)
- UI Library: React
- Language: TypeScript
- Styling: Tailwind CSS

## Folder Structure

This application uses a Feature-Driven Architecture to keep the code organized and easy to maintain:

- app/api/: Server-side edge functions handling API requests and caching.
- app/features/: Domain-specific components (e.g., neo, apod, mars, exoplanets).
- app/components/: Reusable UI pieces, layouts, and modals.
- app/hooks/: Global state management and data fetching.
- app/lib/: Shared constants, types, and utility functions.

## Getting Started

### Prerequisites

- Node.js 18 or later.

### Installation

1. Copy the repository to your local machine.

2. Install the necessary dependencies:
   npm install

3. (Optional) Create a .env.local file in the main folder to add your NASA API key. If you do not provide one, the app will use a default demo key:
   NASA_API_KEY=your_api_key_here
   You can get a free key at https://api.nasa.gov

4. Start the application:
   npm run dev

The app will start running at http://localhost:3000

## Contributing

Please read the CONTRIBUTING.md file for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
