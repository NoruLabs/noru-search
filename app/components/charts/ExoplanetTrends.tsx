"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  ScatterChart, Scatter, CartesianGrid, ZAxis,
  Legend,
} from "recharts";
import { TrendingUp, BarChart3, PieChartIcon, ScatterChartIcon as ScatterIcon } from "lucide-react";
import { useExoplanets } from "../../hooks/useExoplanets";
import type { Exoplanet } from "../../lib/types";

type ChartView = "year" | "method" | "distance" | "scatter";

const CHART_TABS: { id: ChartView; label: string; icon: React.ReactNode }[] = [
  { id: "year", label: "By Year", icon: <BarChart3 size={12} /> },
  { id: "method", label: "Methods", icon: <PieChartIcon size={12} /> },
  { id: "distance", label: "Distance", icon: <BarChart3 size={12} /> },
  { id: "scatter", label: "Size vs Mass", icon: <TrendingUp size={12} /> },
];

const COLORS = [
  "var(--accent)",
  "var(--text-primary)",
  "var(--text-secondary)",
  "var(--text-muted)",
  "var(--border-hover)",
  "var(--border)",
  "var(--bg-card-hover)",
  "var(--bg-card)",
];

function TooltipContent({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2 shadow-lg">
      {label && <p className="text-[11px] font-medium text-text-primary">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] text-text-secondary">
          {p.name}: <span className="font-medium text-text-primary">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

function DiscoveriesByYear({ planets }: { planets: Exoplanet[] }) {
  const data = useMemo(() => {
    const counts = new Map<number, number>();
    for (const p of planets) {
      if (p.disc_year) {
        counts.set(p.disc_year, (counts.get(p.disc_year) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year - b.year);
  }, [planets]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="year" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
        <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
        <Tooltip content={<TooltipContent />} />
        <Bar dataKey="count" fill="var(--accent)" radius={[3, 3, 0, 0]} name="Discoveries" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function MethodDistribution({ planets }: { planets: Exoplanet[] }) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of planets) {
      if (p.discoverymethod) {
        counts.set(p.discoverymethod, (counts.get(p.discoverymethod) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([method, count]) => ({ method, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [planets]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={100}
          dataKey="count"
          nameKey="method"
          label={({ method, percent }: { method?: string; percent?: number }) =>
            (percent ?? 0) > 0.05 ? `${method} (${((percent ?? 0) * 100).toFixed(0)}%)` : ""
          }
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<TooltipContent />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function DistanceBuckets({ planets }: { planets: Exoplanet[] }) {
  const data = useMemo(() => {
    const buckets = [
      { label: "<10 pc", min: 0, max: 10 },
      { label: "10-50 pc", min: 10, max: 50 },
      { label: "50-200 pc", min: 50, max: 200 },
      { label: "200-500 pc", min: 200, max: 500 },
      { label: "500-1K pc", min: 500, max: 1000 },
      { label: ">1K pc", min: 1000, max: Infinity },
    ];
    return buckets.map((b) => ({
      range: b.label,
      count: planets.filter((p) => p.sy_dist && p.sy_dist >= b.min && p.sy_dist < b.max).length,
    }));
  }, [planets]);

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="range" tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
        <YAxis tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
        <Tooltip content={<TooltipContent />} />
        <Bar dataKey="count" fill="var(--accent)" radius={[3, 3, 0, 0]} name="Planets" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function SizeMassScatter({ planets }: { planets: Exoplanet[] }) {
  const data = useMemo(
    () =>
      planets
        .filter((p) => p.pl_rade && p.pl_bmasse)
        .map((p) => ({
          radius: p.pl_rade!,
          mass: p.pl_bmasse!,
          name: p.pl_name,
        }))
        .slice(0, 200),
    [planets],
  );

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="radius"
          name="Radius (R⊕)"
          tick={{ fontSize: 10, fill: "var(--text-muted)" }}
          label={{ value: "Radius (R⊕)", position: "bottom", fontSize: 10, fill: "var(--text-muted)" }}
        />
        <YAxis
          dataKey="mass"
          name="Mass (M⊕)"
          tick={{ fontSize: 10, fill: "var(--text-muted)" }}
          label={{ value: "Mass (M⊕)", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--text-muted)" }}
          scale="log"
          domain={["auto", "auto"]}
        />
        <ZAxis range={[20, 60]} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="rounded-lg border border-border bg-bg-elevated px-3 py-2 shadow-lg">
                <p className="text-[11px] font-medium text-text-primary">{d.name}</p>
                <p className="text-[11px] text-text-secondary">Radius: {d.radius.toFixed(2)} R⊕</p>
                <p className="text-[11px] text-text-secondary">Mass: {d.mass.toFixed(2)} M⊕</p>
              </div>
            );
          }}
        />
        <Scatter data={data} fill="var(--accent)" fillOpacity={0.6} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function ExoplanetTrends() {
  const [chartView, setChartView] = useState<ChartView>("year");
  const { data: planets, isLoading } = useExoplanets(500, 0);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Exoplanet Trends</h3>
        </div>
        <div className="h-72 rounded-xl skeleton" />
      </div>
    );
  }

  if (!planets?.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Exoplanet Trends</h3>
          <span className="rounded-full bg-bg-card px-1.5 py-0.5 text-[10px] text-text-muted">
            {planets.length} planets
          </span>
        </div>
      </div>

      {/* Chart tabs */}
      <div className="flex gap-1">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setChartView(tab.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              chartView === tab.id
                ? "bg-accent text-accent-text"
                : "text-text-muted hover:text-text-primary hover:bg-bg-card"
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-border bg-bg-card p-4">
        {chartView === "year" && <DiscoveriesByYear planets={planets} />}
        {chartView === "method" && <MethodDistribution planets={planets} />}
        {chartView === "distance" && <DistanceBuckets planets={planets} />}
        {chartView === "scatter" && <SizeMassScatter planets={planets} />}
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-3 text-[11px]">
        <div className="rounded-lg bg-bg-card px-3 py-1.5">
          <span className="text-text-muted">Avg radius: </span>
          <span className="font-medium text-text-primary">
            {(planets.filter((p) => p.pl_rade).reduce((s, p) => s + p.pl_rade!, 0) / planets.filter((p) => p.pl_rade).length || 0).toFixed(2)} R⊕
          </span>
        </div>
        <div className="rounded-lg bg-bg-card px-3 py-1.5">
          <span className="text-text-muted">Methods: </span>
          <span className="font-medium text-text-primary">
            {new Set(planets.map((p) => p.discoverymethod)).size}
          </span>
        </div>
        <div className="rounded-lg bg-bg-card px-3 py-1.5">
          <span className="text-text-muted">Year range: </span>
          <span className="font-medium text-text-primary">
            {Math.min(...planets.filter((p) => p.disc_year).map((p) => p.disc_year))}–{Math.max(...planets.filter((p) => p.disc_year).map((p) => p.disc_year))}
          </span>
        </div>
      </div>
    </div>
  );
}
