/**
 * Space Weather Risk scoring — deterministic risk level from DONKI events.
 * Evaluates FLR, CME, GST, SEP, IPS within a time window.
 */

import type {
  SolarFlare,
  CoronalMassEjection,
  GeomagneticStorm,
  SolarEnergeticParticle,
  InterplanetaryShock,
} from "./types";

export type RiskLevel = "Quiet" | "Elevated" | "High" | "Severe";

export interface RiskAssessment {
  score: number; // 0–100
  level: RiskLevel;
  label: string;
  summary: string;
  factors: { label: string; contribution: number }[];
}

function flareScore(flares: SolarFlare[]): number {
  if (!flares.length) return 0;
  let score = 0;
  for (const f of flares) {
    const cls = f.classType.toUpperCase();
    if (cls.startsWith("X")) {
      const num = parseFloat(cls.slice(1)) || 1;
      score += 20 + num * 5;
    } else if (cls.startsWith("M")) {
      const num = parseFloat(cls.slice(1)) || 1;
      score += 8 + num * 1.5;
    } else if (cls.startsWith("C")) {
      score += 2;
    }
  }
  return Math.min(score, 40);
}

function cmeScore(cmes: CoronalMassEjection[]): number {
  if (!cmes.length) return 0;
  let score = 0;
  for (const cme of cmes) {
    const analyses = cme.cmeAnalyses ?? [];
    const maxSpeed = Math.max(...analyses.map((a) => a.speed || 0), 0);
    if (maxSpeed > 2000) score += 15;
    else if (maxSpeed > 1000) score += 10;
    else if (maxSpeed > 500) score += 5;
    else score += 2;
  }
  return Math.min(score, 25);
}

function gstScore(storms: GeomagneticStorm[]): number {
  if (!storms.length) return 0;
  let score = 0;
  for (const s of storms) {
    const maxKp = Math.max(...s.allKpIndex.map((k) => k.kpIndex || 0), 0);
    if (maxKp >= 8) score += 20;
    else if (maxKp >= 6) score += 12;
    else if (maxKp >= 4) score += 5;
    else score += 2;
  }
  return Math.min(score, 30);
}

function sepScore(particles: SolarEnergeticParticle[]): number {
  return Math.min(particles.length * 8, 15);
}

function ipsScore(shocks: InterplanetaryShock[]): number {
  return Math.min(shocks.length * 5, 10);
}

export function calculateRisk(data: {
  flares?: SolarFlare[];
  cmes?: CoronalMassEjection[];
  storms?: GeomagneticStorm[];
  seps?: SolarEnergeticParticle[];
  ips?: InterplanetaryShock[];
}): RiskAssessment {
  const factors: { label: string; contribution: number }[] = [];

  const fScore = flareScore(data.flares ?? []);
  if (fScore > 0) factors.push({ label: "Solar Flares", contribution: fScore });

  const cScore = cmeScore(data.cmes ?? []);
  if (cScore > 0) factors.push({ label: "Coronal Mass Ejections", contribution: cScore });

  const gScore = gstScore(data.storms ?? []);
  if (gScore > 0) factors.push({ label: "Geomagnetic Storms", contribution: gScore });

  const sScore = sepScore(data.seps ?? []);
  if (sScore > 0) factors.push({ label: "Solar Energetic Particles", contribution: sScore });

  const iScore = ipsScore(data.ips ?? []);
  if (iScore > 0) factors.push({ label: "Interplanetary Shocks", contribution: iScore });

  const totalScore = Math.min(fScore + cScore + gScore + sScore + iScore, 100);

  let level: RiskLevel;
  let label: string;
  if (totalScore >= 70) {
    level = "Severe";
    label = "Severe space weather activity detected";
  } else if (totalScore >= 40) {
    level = "High";
    label = "High solar activity in progress";
  } else if (totalScore >= 15) {
    level = "Elevated";
    label = "Elevated solar activity observed";
  } else {
    level = "Quiet";
    label = "Space weather conditions are calm";
  }

  const summary = buildSummary(data, level);

  return { score: totalScore, level, label, summary, factors };
}

function buildSummary(
  data: Parameters<typeof calculateRisk>[0],
  level: RiskLevel,
): string {
  const parts: string[] = [];
  const flares = data.flares ?? [];
  const xFlares = flares.filter((f) => f.classType.toUpperCase().startsWith("X"));
  const mFlares = flares.filter((f) => f.classType.toUpperCase().startsWith("M"));

  if (xFlares.length > 0) parts.push(`${xFlares.length} X-class flare${xFlares.length > 1 ? "s" : ""}`);
  if (mFlares.length > 0) parts.push(`${mFlares.length} M-class flare${mFlares.length > 1 ? "s" : ""}`);
  if ((data.cmes ?? []).length > 0) parts.push(`${data.cmes!.length} CME${data.cmes!.length > 1 ? "s" : ""}`);
  if ((data.storms ?? []).length > 0) parts.push(`${data.storms!.length} geomagnetic storm${data.storms!.length > 1 ? "s" : ""}`);

  if (parts.length === 0) return "No significant space weather events in the current period.";
  return `${parts.join(", ")} detected in the last 30 days. Risk level: ${level}.`;
}

// ── Alert evaluation ──

import type { AlertCondition, AlertRule } from "./storage";

export interface AlertEvaluation {
  rule: AlertRule;
  triggered: boolean;
  message: string;
}

export function evaluateAlerts(
  rules: AlertRule[],
  data: {
    hazardousNeoCount: number;
    totalNeoCount: number;
    flares: SolarFlare[];
    storms: GeomagneticStorm[];
  },
): AlertEvaluation[] {
  return rules
    .filter((r) => r.enabled)
    .map((rule) => {
      const c = rule.condition;
      let triggered = false;
      let message = "";

      switch (c.type) {
        case "hazardous_neo_gte":
          triggered = data.hazardousNeoCount >= c.value;
          message = triggered
            ? `${data.hazardousNeoCount} hazardous NEOs detected (threshold: ${c.value})`
            : `${data.hazardousNeoCount} hazardous NEOs (below threshold of ${c.value})`;
          break;
        case "xclass_flare_exists": {
          const xFlares = data.flares.filter((f) => f.classType.toUpperCase().startsWith("X"));
          triggered = xFlares.length > 0;
          message = triggered
            ? `${xFlares.length} X-class flare${xFlares.length > 1 ? "s" : ""} detected!`
            : "No X-class flares detected";
          break;
        }
        case "flare_count_gte":
          triggered = data.flares.length >= c.value;
          message = triggered
            ? `${data.flares.length} solar flares detected (threshold: ${c.value})`
            : `${data.flares.length} flares (below threshold of ${c.value})`;
          break;
        case "geo_storm_exists":
          triggered = data.storms.length > 0;
          message = triggered
            ? `${data.storms.length} geomagnetic storm${data.storms.length > 1 ? "s" : ""} detected!`
            : "No geomagnetic storms detected";
          break;
        case "neo_count_gte":
          triggered = data.totalNeoCount >= c.value;
          message = triggered
            ? `${data.totalNeoCount} near-Earth objects detected (threshold: ${c.value})`
            : `${data.totalNeoCount} NEOs (below threshold of ${c.value})`;
          break;
      }

      return { rule, triggered, message };
    });
}

// ── Formatting helpers ──

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(num % 1 === 0 ? 0 : 1);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(d);
}

export function classifyFlare(classType: string): "extreme" | "strong" | "moderate" | "minor" {
  const upper = classType.toUpperCase();
  if (upper.startsWith("X")) return "extreme";
  if (upper.startsWith("M")) return "strong";
  if (upper.startsWith("C")) return "moderate";
  return "minor";
}
