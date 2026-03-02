"use client";

import { useState, useCallback, useEffect } from "react";
import {
  X,
  Plus,
  ArrowLeftRight,
  Globe,
  Orbit,
  AlertTriangle,
  Shield,
  Search,
} from "lucide-react";
import { useExoplanets } from "../../hooks/useExoplanets";
import { useNeoFeed } from "../../hooks/useNeo";
import {
  getCompareItems,
  toggleCompareItem,
  clearCompareItems,
} from "../../lib/storage";
import type { Exoplanet, NeoObject } from "../../lib/types";

type CompareType = "exoplanets" | "neo";

interface CompareModeProps {
  initialType?: CompareType;
}

function ExoplanetCompare() {
  const { data: planets } = useExoplanets(200, 0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setSelectedIds(getCompareItems("exoplanets"));
  }, []);

  const selected = (planets ?? []).filter((p) => selectedIds.includes(p.pl_name));
  const filtered = (planets ?? []).filter(
    (p) =>
      !selectedIds.includes(p.pl_name) &&
      (p.pl_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.hostname.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const handleToggle = useCallback((name: string) => {
    const next = toggleCompareItem("exoplanets", name);
    setSelectedIds(next);
  }, []);

  const handleClear = useCallback(() => {
    clearCompareItems("exoplanets");
    setSelectedIds([]);
  }, []);

  const fields: { label: string; key: keyof Exoplanet; unit?: string; format?: (v: number | string | null) => string }[] = [
    { label: "Host Star", key: "hostname" },
    { label: "Discovery Year", key: "disc_year" },
    { label: "Method", key: "discoverymethod" },
    { label: "Radius", key: "pl_rade", unit: "R⊕", format: (v) => v != null ? Number(v).toFixed(2) : "—" },
    { label: "Mass", key: "pl_bmasse", unit: "M⊕", format: (v) => v != null ? Number(v).toFixed(2) : "—" },
    { label: "Temperature", key: "pl_eqt", unit: "K", format: (v) => v != null ? Number(v).toFixed(0) : "—" },
    { label: "Orbital Period", key: "pl_orbper", unit: "days", format: (v) => v != null ? Number(v).toFixed(1) : "—" },
    { label: "Distance", key: "sy_dist", unit: "pc", format: (v) => v != null ? Number(v).toFixed(1) : "—" },
    { label: "Star Temp", key: "st_teff", unit: "K", format: (v) => v != null ? Number(v).toFixed(0) : "—" },
  ];

  return (
    <div className="space-y-4">
      {/* Selected pills */}
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((p) => (
          <span
            key={p.pl_name}
            className="flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent-soft px-3 py-1 text-xs font-medium text-text-primary"
          >
            <Globe size={10} />
            {p.pl_name}
            <button onClick={() => handleToggle(p.pl_name)}>
              <X size={10} className="text-text-muted hover:text-text-primary" />
            </button>
          </span>
        ))}
        {selected.length < 4 && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-text-muted hover:border-border-hover hover:text-text-primary transition-colors"
          >
            <Plus size={10} />
            Add planet
          </button>
        )}
        {selected.length > 0 && (
          <button onClick={handleClear} className="text-[10px] text-text-muted hover:text-text-primary">
            Clear all
          </button>
        )}
      </div>

      {/* Picker */}
      {showPicker && (
        <div className="rounded-xl border border-border bg-bg-card p-3 animate-fade-in">
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search planets..."
              className="w-full rounded-lg bg-bg-primary pl-7 pr-3 py-1.5 text-xs text-text-primary outline-none border border-border placeholder:text-text-muted/60"
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {filtered.slice(0, 20).map((p) => (
              <button
                key={p.pl_name}
                onClick={() => {
                  handleToggle(p.pl_name);
                  if (selectedIds.length >= 3) setShowPicker(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[11px] text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
              >
                <Globe size={10} className="text-text-muted" />
                <span className="font-medium">{p.pl_name}</span>
                <span className="text-text-muted">({p.hostname})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-bg-card">
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-muted">Property</th>
                {selected.map((p) => (
                  <th key={p.pl_name} className="px-3 py-2 text-left text-[10px] font-semibold text-text-primary">
                    {p.pl_name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fields.map((f) => (
                <tr key={f.label} className="border-b border-border/50">
                  <td className="px-3 py-2 text-text-muted">{f.label}</td>
                  {selected.map((p) => {
                    const val = p[f.key];
                    return (
                      <td key={p.pl_name} className="px-3 py-2 text-text-primary">
                        {f.format ? f.format(val as number | string | null) : (val ?? "—")}{" "}
                        {f.unit && val != null ? <span className="text-text-muted">{f.unit}</span> : ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected.length < 2 && (
        <p className="text-center text-xs text-text-muted py-6">
          Select at least 2 planets to compare
        </p>
      )}
    </div>
  );
}

function NeoCompare() {
  const { data: neos } = useNeoFeed();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setSelectedIds(getCompareItems("neo"));
  }, []);

  const selected = (neos ?? []).filter((n) => selectedIds.includes(n.id));
  const filtered = (neos ?? []).filter(
    (n) =>
      !selectedIds.includes(n.id) &&
      n.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggle = useCallback((id: string) => {
    const next = toggleCompareItem("neo", id);
    setSelectedIds(next);
  }, []);

  const handleClear = useCallback(() => {
    clearCompareItems("neo");
    setSelectedIds([]);
  }, []);

  return (
    <div className="space-y-4">
      {/* Selected pills */}
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((n) => (
          <span
            key={n.id}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
              n.is_potentially_hazardous_asteroid
                ? "border-accent/20 bg-accent/10 text-text-primary font-semibold"
                : "border-accent/20 bg-accent-soft text-text-primary"
            }`}
          >
            {n.is_potentially_hazardous_asteroid ? <AlertTriangle size={10} /> : <Orbit size={10} />}
            {n.name.replace(/[()]/g, "")}
            <button onClick={() => handleToggle(n.id)}>
              <X size={10} />
            </button>
          </span>
        ))}
        {selected.length < 4 && (
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1 text-xs text-text-muted hover:border-border-hover hover:text-text-primary transition-colors"
          >
            <Plus size={10} />
            Add asteroid
          </button>
        )}
        {selected.length > 0 && (
          <button onClick={handleClear} className="text-[10px] text-text-muted hover:text-text-primary">
            Clear all
          </button>
        )}
      </div>

      {/* Picker */}
      {showPicker && (
        <div className="rounded-xl border border-border bg-bg-card p-3 animate-fade-in">
          <div className="relative mb-2">
            <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search asteroids..."
              className="w-full rounded-lg bg-bg-primary pl-7 pr-3 py-1.5 text-xs text-text-primary outline-none border border-border placeholder:text-text-muted/60"
              autoFocus
            />
          </div>
          <div className="max-h-40 overflow-y-auto space-y-0.5">
            {filtered.slice(0, 20).map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  handleToggle(n.id);
                  if (selectedIds.length >= 3) setShowPicker(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-[11px] text-text-secondary hover:bg-bg-card-hover hover:text-text-primary"
              >
                {n.is_potentially_hazardous_asteroid ? (
                  <AlertTriangle size={10} className="text-text-primary" />
                ) : (
                  <Orbit size={10} className="text-text-muted" />
                )}
                <span className="font-medium">{n.name.replace(/[()]/g, "")}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-bg-card">
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-muted">Property</th>
                {selected.map((n) => (
                  <th key={n.id} className="px-3 py-2 text-left text-[10px] font-semibold text-text-primary">
                    {n.name.replace(/[()]/g, "")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 text-text-muted">Hazardous</td>
                {selected.map((n) => (
                  <td key={n.id} className="px-3 py-2">
                    {n.is_potentially_hazardous_asteroid ? (
                      <span className="flex items-center gap-1 text-text-primary font-semibold">
                        <AlertTriangle size={10} /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-text-muted">
                        <Shield size={10} /> No
                      </span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 text-text-muted">Magnitude</td>
                {selected.map((n) => (
                  <td key={n.id} className="px-3 py-2 text-text-primary tabular-nums">
                    {n.absolute_magnitude_h.toFixed(2)} H
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 text-text-muted">Diameter (est.)</td>
                {selected.map((n) => (
                  <td key={n.id} className="px-3 py-2 text-text-primary tabular-nums">
                    {n.estimated_diameter.meters.estimated_diameter_min.toFixed(0)}–
                    {n.estimated_diameter.meters.estimated_diameter_max.toFixed(0)}{" "}
                    <span className="text-text-muted">m</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 text-text-muted">Velocity</td>
                {selected.map((n) => {
                  const a = n.close_approach_data[0];
                  return (
                    <td key={n.id} className="px-3 py-2 text-text-primary tabular-nums">
                      {a ? `${parseFloat(a.relative_velocity.kilometers_per_hour).toFixed(0)} km/h` : "—"}
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 text-text-muted">Miss Distance</td>
                {selected.map((n) => {
                  const a = n.close_approach_data[0];
                  return (
                    <td key={n.id} className="px-3 py-2 text-text-primary tabular-nums">
                      {a ? `${parseFloat(a.miss_distance.lunar).toFixed(2)} LD` : "—"}
                    </td>
                  );
                })}
              </tr>
              <tr className="border-b border-border/50">
                <td className="px-3 py-2 text-text-muted">Approach Date</td>
                {selected.map((n) => {
                  const a = n.close_approach_data[0];
                  return (
                    <td key={n.id} className="px-3 py-2 text-text-primary">
                      {a?.close_approach_date ?? "—"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selected.length < 2 && (
        <p className="text-center text-xs text-text-muted py-6">
          Select at least 2 asteroids to compare
        </p>
      )}
    </div>
  );
}

export function CompareMode({ initialType = "exoplanets" }: CompareModeProps) {
  const [type, setType] = useState<CompareType>(initialType);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Compare Mode</h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setType("exoplanets")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              type === "exoplanets"
                ? "bg-accent text-accent-text"
                : "text-text-muted hover:text-text-primary hover:bg-bg-card"
            }`}
          >
            <Globe size={10} />
            Exoplanets
          </button>
          <button
            onClick={() => setType("neo")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
              type === "neo"
                ? "bg-accent text-accent-text"
                : "text-text-muted hover:text-text-primary hover:bg-bg-card"
            }`}
          >
            <Orbit size={10} />
            Asteroids
          </button>
        </div>
      </div>

      {type === "exoplanets" ? <ExoplanetCompare /> : <NeoCompare />}
    </div>
  );
}
