"use client";

import { Activity, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import {
  useSolarFlares,
  useCoronalMassEjections,
  useGeomagneticStorms,
  useSolarEnergeticParticles,
  useInterplanetaryShocks,
} from "../../hooks/useSpaceWeather";
import { calculateRisk, type RiskLevel } from "../../lib/scoring";

const RISK_COLORS: Record<RiskLevel, string> = {
  Quiet: "var(--text-muted)",
  Elevated: "var(--text-secondary)",
  High: "var(--text-primary)",
  Severe: "var(--accent)",
};

const RISK_TEXT: Record<RiskLevel, string> = {
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

export function SpaceWeatherRiskMeter() {
  const [expanded, setExpanded] = useState(false);
  const { data: flares } = useSolarFlares(30);
  const { data: cmes } = useCoronalMassEjections(30);
  const { data: storms } = useGeomagneticStorms(30);
  const { data: seps } = useSolarEnergeticParticles(30);
  const { data: ips } = useInterplanetaryShocks(30);

  const risk = calculateRisk({
    flares: flares ?? [],
    cmes: cmes ?? [],
    storms: storms ?? [],
    seps: seps ?? [],
    ips: ips ?? [],
  });

  const color = RISK_COLORS[risk.level];
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (risk.score / 100) * circumference;

  // Build event pills once to share between collapsed & expanded
  const eventPills: string[] = [];
  if ((flares?.length ?? 0) > 0) eventPills.push(`${flares!.length} flare${flares!.length > 1 ? "s" : ""}`);
  if ((cmes?.length ?? 0) > 0) eventPills.push(`${cmes!.length} CME${cmes!.length > 1 ? "s" : ""}`);
  if ((storms?.length ?? 0) > 0) eventPills.push(`${storms!.length} storm${storms!.length > 1 ? "s" : ""}`);
  if ((seps?.length ?? 0) > 0) eventPills.push(`${seps!.length} SEP${seps!.length > 1 ? "s" : ""}`);
  if ((ips?.length ?? 0) > 0) eventPills.push(`${ips!.length} IPS`);

  return (
    <div className={`rounded-xl border p-4 transition-all ${RISK_BG[risk.level]}`}>
      {/* Header row — gauge, label, expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Mini gauge */}
          <div className="relative h-10 w-10 shrink-0">
            <svg className="h-10 w-10 -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
              <circle
                cx="48" cy="48" r="40" fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-text-primary tabular-nums">{risk.score}</span>
            </div>
          </div>
          <div className="text-left min-w-0">
            <div className="flex items-center gap-1.5">
              <Activity size={12} className={RISK_TEXT[risk.level]} />
              <span className={`text-xs font-bold ${RISK_TEXT[risk.level]}`}>{risk.level}</span>
            </div>
            <p className="text-[11px] text-text-secondary truncate">{risk.label}</p>
          </div>
        </div>
        {expanded ? <ChevronUp size={14} className="shrink-0 text-text-muted" /> : <ChevronDown size={14} className="shrink-0 text-text-muted" />}
      </button>

      {/* Event count pills — always visible */}
      {eventPills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {eventPills.map((pill) => (
            <span key={pill} className="rounded-full bg-bg-card px-2 py-0.5 text-[10px] text-text-secondary">
              {pill}
            </span>
          ))}
        </div>
      )}

      {/* Factor bars — show top 3 collapsed, all when expanded */}
      {risk.factors.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {risk.factors.slice(0, expanded ? undefined : 3).map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <div className="h-1 flex-1 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((f.contribution / 40) * 100, 100)}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
              <span className="w-20 text-[10px] text-text-secondary truncate">{f.label}</span>
              <span className="w-5 text-right text-[10px] font-medium text-text-muted tabular-nums">{f.contribution}</span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded detail — summary */}
      {expanded && (
        <div className="mt-3 animate-fade-in">
          <p className="text-xs leading-relaxed text-text-secondary">{risk.summary}</p>
        </div>
      )}
    </div>
  );
}
