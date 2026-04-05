"use client";

import {
  AlertTriangle,
  Sun,
  Newspaper,
  Shield,
  Zap,
  Calendar,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useFeed } from "../../hooks/useFeed";
import { useSpaceNews } from "../../hooks/useSpaceNews";
import { useSolarFlares, useCoronalMassEjections, useGeomagneticStorms } from "../../hooks/useSpaceWeather";
import { calculateRisk, type RiskLevel } from "../../lib/scoring";
import { DataCard } from "../../components/ui/DataCard";
import type { DatasetTab, NeoObject, SolarFlare } from "../../lib/types";

interface DailyBriefingProps {
  onNavigate: (tab: DatasetTab) => void;
}

const RISK_COLORS: Record<RiskLevel, string> = {
  Quiet: "text-text-muted",
  Elevated: "text-text-secondary",
  High: "text-text-primary",
  Severe: "text-text-primary font-bold",
};

const RISK_BG: Record<RiskLevel, string> = {
  Quiet: "bg-accent-soft border-border",
  Elevated: "bg-accent-soft border-border-hover",
  High: "bg-bg-card-hover border-border-hover",
  Severe: "bg-accent/10 border-accent/30",
};

export function DailyBriefing({ onNavigate }: DailyBriefingProps) {
  const { data: feedData, isLoading: feedLoading } = useFeed();
  const { data: newsData } = useSpaceNews();
  const { data: flares } = useSolarFlares(7);
  const { data: cmes } = useCoronalMassEjections(7);
  const { data: storms } = useGeomagneticStorms(7);

  if (feedLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <h2 className="text-sm font-semibold text-text-primary">Today in Space</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-xl skeleton" />
          ))}
        </div>
      </div>
    );
  }

  const results = feedData?.results;
  const neos = results?.neo ?? [];
  const hazardousCount = neos.filter((n: NeoObject) => n.is_potentially_hazardous_asteroid).length;
  const weatherEvents = results?.weather ?? [];
  const topFlare = weatherEvents.length > 0
    ? [...weatherEvents].sort((a: SolarFlare, b: SolarFlare) => {
        const order: Record<string, number> = { X: 4, M: 3, C: 2, B: 1, A: 0 };
        return (order[b.classType[0]?.toUpperCase()] ?? 0) - (order[a.classType[0]?.toUpperCase()] ?? 0);
      })[0]
    : null;

  const risk = calculateRisk({
    flares: flares ?? [],
    cmes: cmes ?? [],
    storms: storms ?? [],
  });

  const topNews = newsData?.articles?.[0];

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Today in Space</h2>
            <p className="text-[11px] text-text-muted">{today}</p>
          </div>
        </div>
      </div>

      {/* Status line */}
      <div className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 ${RISK_BG[risk.level]}`}>
        <Activity size={14} className={RISK_COLORS[risk.level]} />
        <span className={`text-xs font-semibold ${RISK_COLORS[risk.level]}`}>{risk.level}</span>
        <span className="text-xs text-text-secondary">{risk.summary}</span>
      </div>

      {/* Brief cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {/* Hazardous NEOs */}
        <DataCard className="cursor-pointer" onClick={() => onNavigate("neo")}>
          <div className="flex items-start gap-2">
            {hazardousCount > 0 ? (
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-text-primary" />
            ) : (
              <Shield size={14} className="mt-0.5 shrink-0 text-text-muted" />
            )}
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Hazardous NEOs</p>
              <p className="mt-0.5 text-lg font-bold text-text-primary tabular-nums">{hazardousCount}</p>
              <p className="text-[10px] text-text-muted">{neos.length} total tracked</p>
            </div>
          </div>
        </DataCard>

        {/* Top Flare */}
        <DataCard className="cursor-pointer" onClick={() => onNavigate("weather")}>
          <div className="flex items-start gap-2">
            <Zap size={14} className="mt-0.5 shrink-0 text-text-muted" />
            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Top Flare</p>
              {topFlare ? (
                <>
                  <p className="mt-0.5 text-sm font-bold text-text-primary">
                    Class {topFlare.classType}
                  </p>
                  <p className="text-[10px] text-text-muted">
                    {new Date(topFlare.peakTime).toLocaleDateString()}
                  </p>
                </>
              ) : (
                <p className="mt-0.5 text-xs text-text-muted">No recent flares</p>
              )}
            </div>
          </div>
        </DataCard>

        {/* Top News */}
        {topNews && (
          <DataCard>
            <a href={topNews.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 group">
              <Newspaper size={14} className="mt-0.5 shrink-0 text-text-muted" />
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">Top News</p>
                <p className="mt-0.5 text-xs font-semibold text-text-primary line-clamp-2 group-hover:underline">
                  {topNews.title}
                </p>
              </div>
            </a>
          </DataCard>
        )}
      </div>
    </div>
  );
}
