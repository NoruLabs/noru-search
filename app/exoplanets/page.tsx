'use client';

import { useState } from 'react';
import { Telescope, Flame, Snowflake, Clock, Globe } from 'lucide-react';
import { useExoplanets } from '../hooks/useExoplanets';
import { DataCard } from '../components/ui/DataCard';

export default function ExoplanetsPage({ limit, hideHeader }: { limit?: number, hideHeader?: boolean } = {}) {
  const [filter, setFilter] = useState('all');
  const { data, isLoading, error } = useExoplanets(filter);

  const filters = [
    { id: 'all', label: 'All Discovered', icon: <Telescope size={16} /> },
    { id: 'recent', label: 'Recently Discovered', icon: <Clock size={16} /> },
    { id: 'hot', label: 'Hot Jupiters', icon: <Flame size={16} /> },
    { id: 'cold', label: 'Ice Giants', icon: <Snowflake size={16} /> },
    { id: 'big', label: 'Bigger than Earth', icon: <Globe size={16} /> },
    { id: 'far', label: 'Far Away', icon: <Telescope size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 animate-fade-in">
      {!hideHeader && (<div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Exoplanets Explorer</h1>
        <p className="text-text-secondary text-sm mt-1 max-w-2xl">
          Discover planets completely outside our solar system. Use simple filters to find bizarre, extreme, and Earth-like worlds discovered by NASA missions.
        </p>
      </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
        {filters.map(f => {
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
                isActive
                  ? 'bg-bg-card border-text-primary/40 text-text-primary shadow-sm'
                  : 'bg-bg-card/50 border-border text-text-secondary hover:bg-bg-card hover:border-border-hover hover:text-text-primary'
              }`}
            >
              {f.icon} {f.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <DataCard key={i} className="flex flex-col justify-between h-48 p-4">
              <div className="space-y-4">
                <div className="h-5 w-3/4 bg-bg-card animate-pulse rounded-md" />
                <div className="h-3 w-1/2 bg-bg-card animate-pulse rounded-md" />
              </div>
              <div className="h-10 w-full bg-bg-card animate-pulse rounded-md mt-4" />
            </DataCard>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500 bg-red-500/10 rounded-xl text-sm border border-red-500/20">
          Error loading exoplanet data.
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-3">
          {data?.slice(0, limit || data.length).map((planet: any, i: number) => (
            <DataCard key={i} className="flex flex-col h-full hover:border-border-hover transition-colors border border-border/50 p-5 shadow-none hover:shadow-sm">
               <div className="flex items-start justify-between mb-4">
                 <div>
                   <h3 className="font-bold text-base text-text-primary line-clamp-1">{planet.pl_name}</h3>
                   <p className="text-xs text-text-muted mt-1">Host: {planet.hostname}</p>
                 </div>
                 <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-accent/10 text-accent rounded-full shrink-0">
                   {planet.disc_year}
                 </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mt-auto text-sm pt-4 border-t border-border/50">
                 <div>
                   <span className="text-text-muted block text-[10px] uppercase tracking-wider mb-1">Radius</span>
                   <span className="font-semibold text-text-primary text-xs">{planet.pl_rade ? planet.pl_rade.toFixed(2) : '?'} x Earth</span>
                 </div>
                 <div>
                   <span className="text-text-muted block text-[10px] uppercase tracking-wider mb-1">Temp</span>
                   <span className="font-semibold text-text-primary text-xs">{planet.pl_eqt ? Math.round(planet.pl_eqt) + ' K' : '?'}</span>
                 </div>
                 <div>
                   <span className="text-text-muted block text-[10px] uppercase tracking-wider mb-1">Mass</span>
                   <span className="font-semibold text-text-primary text-xs">{planet.pl_bmasse ? planet.pl_bmasse.toFixed(1) : '?'} x Earth</span>
                 </div>
                 <div>
                   <span className="text-text-muted block text-[10px] uppercase tracking-wider mb-1">Orbital Period</span>
                   <span className="font-semibold text-text-primary text-xs">{planet.pl_orbper ? Math.round(planet.pl_orbper) + ' days' : '?'}</span>
                 </div>
                 <div className="col-span-2 pt-1 mt-1 border-t border-border/20">
                   <span className="text-text-muted block text-[10px] uppercase tracking-wider mb-1">Discovery Method</span>
                   <span className="font-semibold text-text-primary text-xs">{planet.discoverymethod || 'Unknown'}</span>
                 </div>
               </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}
