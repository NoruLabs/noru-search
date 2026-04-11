"use client";

import dynamic from "next/dynamic";
import { ApodPreview } from "./apod/ApodPreview";

// Esqueletos de carga precisos para cada sección
const SpaceNewsSkeleton = () => (
  <div className="flex gap-4 overflow-hidden mt-3 h-[280px]">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex flex-col h-full bg-bg-card/40 rounded-xl p-4 w-full md:w-1/2 lg:w-1/3 shrink-0 animate-pulse ${i > 1 ? 'hidden md:flex' : 'flex'} ${i > 2 ? 'lg:flex hidden' : ''}`}>
        <div className="w-full h-40 bg-border/20 rounded-xl mb-3 shrink-0" />
        <div className="h-4 w-16 bg-border/20 rounded-full mb-3" />
        <div className="h-4 w-3/4 bg-border/20 rounded mb-2" />
        <div className="h-4 w-full bg-border/20 rounded" />
      </div>
    ))}
  </div>
);

const NasaMediaSkeleton = () => (
  <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={`flex flex-col h-48 bg-bg-card/40 rounded-xl p-3 animate-pulse ${i === 3 ? 'hidden md:flex' : ''} ${i === 4 ? 'hidden xl:flex' : ''}`}>
        <div className="w-full flex-grow bg-border/20 rounded-lg mb-3" />
        <div className="h-3 bg-border/20 rounded w-2/3" />
      </div>
    ))}
  </div>
);

const TechPortSkeleton = () => (
  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className={`flex flex-col h-64 bg-bg-card/40 rounded-xl overflow-hidden animate-pulse ${i > 1 ? 'hidden md:flex' : ''} ${i > 2 ? 'hidden lg:flex' : ''}`}>
        <div className="h-32 w-full bg-border/20 shrink-0" />
        <div className="p-4 flex flex-col flex-1 mt-2">
          <div className="h-4 w-3/4 bg-border/20 rounded mb-3" />
          <div className="h-3 w-full bg-border/20 rounded mb-2" />
          <div className="h-3 w-5/6 bg-border/20 rounded mt-auto" />
        </div>
      </div>
    ))}
  </div>
);

const ExoplanetsSkeleton = () => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className={`flex flex-col justify-between h-[220px] bg-bg-card/20 border border-border/30 rounded-xl p-4 animate-pulse ${i > 1 ? 'hidden sm:flex' : ''} ${i > 2 ? 'hidden lg:flex' : ''} ${i > 3 ? 'hidden xl:flex' : ''}`}>
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="h-5 w-3/4 bg-border/20 rounded-md" />
            <div className="h-4 w-10 bg-border/20 rounded-full" />
          </div>
          <div className="h-3 w-1/2 bg-border/20 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-auto border-t border-border/20 pt-4">
          <div className="h-2 w-16 bg-border/20 rounded" />
          <div className="h-2 w-20 bg-border/20 rounded" />
          <div className="h-2 w-14 bg-border/20 rounded" />
          <div className="h-2 w-16 bg-border/20 rounded" />
        </div>
      </div>
    ))}
  </div>
);

// Usamos carga dinámica (Lazy Loading) para componentes de abajo del scroll inicial
const SpaceNewsPanel = dynamic(() => import("./news/SpaceNewsPanel").then(mod => mod.SpaceNewsPanel), { 
  ssr: true,
  loading: () => <SpaceNewsSkeleton />
});

const NasaMediaPanel = dynamic(() => import("./nasa-media/NasaMediaPanel").then(mod => mod.NasaMediaPanel), { 
  ssr: true,
  loading: () => <NasaMediaSkeleton />
});

const TechPortPage = dynamic(() => import("./techport/page"), { 
  ssr: true,
  loading: () => <TechPortSkeleton />
});

const ExoplanetsPage = dynamic(() => import("./exoplanets/page"), { 
  ssr: true,
  loading: () => <ExoplanetsSkeleton />
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
