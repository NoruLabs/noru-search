'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Flame, Cloud, Snowflake, Wind, Map as MapIcon, Calendar } from 'lucide-react';
import { DataCard } from '../components/ui/DataCard';

const GibsMap = dynamic(() => import('./components/GibsMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bg-card/50 flex items-center justify-center animate-pulse rounded-xl">
      <MapIcon className="w-8 h-8 text-text-muted animate-spin-slow" />
    </div>
  ),
});

const LAYERS = [
  { id: 'MODIS_Terra_Land_Surface_Temp_Day', name: 'Land Surface Temp', icon: Flame, color: 'text-orange-500' },
  { id: 'MODIS_Terra_CorrectedReflectance_TrueColor', name: 'True Color (Clouds)', icon: Cloud, color: 'text-blue-200' },
  { id: 'MODIS_Terra_Sea_Ice', name: 'Sea Ice', icon: Snowflake, color: 'text-cyan-300' },
  { id: 'MODIS_Terra_Aerosol', name: 'Air Quality (Aerosol)', icon: Wind, color: 'text-zinc-400' },
];

export default function GibsClient() {
  const [activeLayer, setActiveLayer] = useState(LAYERS[0].id);
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 h-[calc(100vh-80px)] flex flex-col animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            <MapIcon className="text-accent" /> Earth Viewer (GIBS)
          </h1>
          <p className="text-text-secondary text-sm mt-1 max-w-xl">
            NASA Global Imagery Browse Services. Observe environmental layers like active fires, storms, sea ice, and atmospheric conditions.
          </p>
        </div>

        <div className="flex flex-col gap-1 sm:items-end shrink-0">
          <label className="text-xs text-text-muted font-medium uppercase tracking-wide flex items-center gap-1">
            <Calendar size={12} /> Target Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="bg-bg-card/50 border border-border text-sm rounded-md px-3 py-2 text-text-primary focus:ring-1 focus:ring-accent outline-none hover:border-border-hover transition-colors"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-none mb-2">
        {LAYERS.map((l) => {
          const Icon = l.icon;
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
                isActive
                  ? 'bg-bg-card border-text-primary/40 text-text-primary shadow-sm'
                  : 'bg-bg-card/50 border-border text-text-secondary hover:bg-bg-card hover:border-border-hover hover:text-text-primary'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-bg-primary' : l.color} />
              {l.name}
            </button>
          );
        })}
        <button
          onClick={() => setActiveLayer('none')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shrink-0 border ${
            activeLayer === 'none'
               ? 'bg-bg-card border-text-primary/40 text-text-primary shadow-sm'
               : 'bg-bg-card/50 border-border text-text-secondary hover:bg-bg-card hover:border-border-hover hover:text-text-primary'
          }`}
        >
          Clear Overlay
        </button>
      </div>

      <DataCard className="flex-1 w-full relative min-h-[400px] overflow-hidden p-0 border-border/80">
        <GibsMap layer={activeLayer} date={date} />
      </DataCard>
    </div>
  );
}
