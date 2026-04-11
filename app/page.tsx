"use client";

import dynamic from "next/dynamic";
import { ApodPreview } from "./apod/ApodPreview";

// Usamos carga dinámica (Lazy Loading) para componentes de abajo del scroll inicial
const SpaceNewsPanel = dynamic(() => import("./news/SpaceNewsPanel").then(mod => mod.SpaceNewsPanel), { 
  ssr: true,
  loading: () => <div className="h-64 w-full animate-pulse bg-bg-card/50 rounded-xl" /> // Placeholder mientras carga
});

const NasaMediaPanel = dynamic(() => import("./nasa-media/NasaMediaPanel").then(mod => mod.NasaMediaPanel), { 
  ssr: true,
  loading: () => <div className="h-64 w-full animate-pulse bg-bg-card/50 rounded-xl" />
});

const TechPortPage = dynamic(() => import("./techport/page"), { 
  ssr: true,
  loading: () => <div className="h-64 w-full animate-pulse bg-bg-card/50 rounded-xl" />
});

const ExoplanetsPage = dynamic(() => import("./exoplanets/page"), { 
  ssr: true,
  loading: () => <div className="h-64 w-full animate-pulse bg-bg-card/50 rounded-xl" />
});

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 space-y-12">
      <div className="w-full">
        <ApodPreview />
      </div>
      <div className="w-full relative">
        <SpaceNewsPanel
          limit={6}
          showViewAll={true}
          layout="carousel"
        />
      </div>

      {/* New sections for other features */}
      <div className="w-full border-t border-border/50 pt-8">
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6">   
          <h2 className="text-xl font-bold text-text-primary">Latest NASA Media</h2>
          <a href="/nasa-media" className="text-sm text-text-secondary hover:text-white transition-colors">
            View All →
          </a>
        </div>
        {/* Render a quick preview of NASA Media using the existing hook but constrained items */}
        <div className="px-4 sm:px-6 w-full fade-in">
             <NasaMediaPanel limit={4} hideHeader={true} />
        </div>
      </div>

      <div className="w-full border-t border-border/50 pt-8">
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6">   
          <h2 className="text-xl font-bold text-text-primary">Latest TechPort Projects</h2>
          <a href="/techport" className="text-sm text-text-secondary hover:text-white transition-colors">
            View All →
          </a>
        </div>
        <div className="px-0 sm:px-0 w-full fade-in">
             <TechPortPage limit={3} hideHeader={true} />
        </div>
      </div>

      <div className="w-full border-t border-border/50 pt-8">
        <div className="flex items-center justify-between mb-4 px-4 sm:px-6">   
          <h2 className="text-xl font-bold text-text-primary">Recent Exoplanets</h2>
          <a href="/exoplanets" className="text-sm text-text-secondary hover:text-white transition-colors">
            View All →
          </a>
        </div>
        <div className="px-0 sm:px-0 w-full fade-in">
             <ExoplanetsPage limit={4} hideHeader={true} />
        </div>
      </div>
    </main>
  );
}
