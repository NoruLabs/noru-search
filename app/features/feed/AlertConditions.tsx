"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  BellRing,
  Plus,
  Trash2,
  X,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Zap,
  Orbit,
  Activity,
} from "lucide-react";
import {
  getAlertRules,
  addAlertRule,
  removeAlertRule,
  updateAlertRule,
  type AlertRule,
  type AlertCondition,
} from "../../lib/storage";
import { evaluateAlerts, type AlertEvaluation } from "../../lib/scoring";
import type { NeoObject, SolarFlare, GeomagneticStorm } from "../../lib/types";

interface AlertConditionsPanelProps {
  hazardousNeoCount: number;
  totalNeoCount: number;
  flares: SolarFlare[];
  storms: GeomagneticStorm[];
}

const CONDITION_TEMPLATES: { label: string; icon: React.ReactNode; condition: AlertCondition }[] = [
  {
    label: "Hazardous NEOs >= 3",
    icon: <AlertTriangle size={12} />,
    condition: { type: "hazardous_neo_gte", value: 3 },
  },
  {
    label: "X-class flare detected",
    icon: <Zap size={12} />,
    condition: { type: "xclass_flare_exists" },
  },
  {
    label: "Solar flares >= 10",
    icon: <Zap size={12} />,
    condition: { type: "flare_count_gte", value: 10 },
  },
  {
    label: "Geomagnetic storm detected",
    icon: <Activity size={12} />,
    condition: { type: "geo_storm_exists" },
  },
  {
    label: "NEO count >= 20",
    icon: <Orbit size={12} />,
    condition: { type: "neo_count_gte", value: 20 },
  },
];

export function AlertConditionsPanel({
  hazardousNeoCount,
  totalNeoCount,
  flares,
  storms,
}: AlertConditionsPanelProps) {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [evaluations, setEvaluations] = useState<AlertEvaluation[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRules(getAlertRules());
  }, []);

  useEffect(() => {
    if (rules.length > 0) {
      const evals = evaluateAlerts(rules, {
        hazardousNeoCount,
        totalNeoCount,
        flares,
        storms,
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvaluations(evals);
    }
  }, [rules, hazardousNeoCount, totalNeoCount, flares, storms]);

  const handleAdd = useCallback((template: (typeof CONDITION_TEMPLATES)[0]) => {
    const rule = addAlertRule({
      name: template.label,
      condition: template.condition,
      enabled: true,
    });
    setRules((prev) => [rule, ...prev]);
    setShowAddMenu(false);
  }, []);

  const handleToggle = useCallback((id: string) => {
    setRules((prev) => {
      const updated = prev.map((r) => {
        if (r.id === id) {
          const next = { ...r, enabled: !r.enabled };
          updateAlertRule(id, { enabled: next.enabled });
          return next;
        }
        return r;
      });
      return updated;
    });
  }, []);

  const handleDelete = useCallback((id: string) => {
    removeAlertRule(id);
    setRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const triggeredCount = evaluations.filter((e) => e.triggered).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {triggeredCount > 0 ? (
            <BellRing size={14} className="text-text-primary" />
          ) : (
            <Bell size={14} className="text-text-muted" />
          )}
          <h3 className="text-xs font-semibold text-text-primary">Alert Conditions</h3>
          {triggeredCount > 0 && (
            <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-accent-text">
              {triggeredCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
        >
          <Plus size={12} />
          Add rule
        </button>
      </div>

      {/* Add menu */}
      {showAddMenu && (
        <div className="rounded-xl border border-border bg-bg-card p-3 animate-fade-in">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-medium text-text-muted">Choose alert type</p>
            <button onClick={() => setShowAddMenu(false)}>
              <X size={12} className="text-text-muted" />
            </button>
          </div>
          <div className="space-y-1">
            {CONDITION_TEMPLATES.map((template, idx) => (
              <button
                key={idx}
                onClick={() => handleAdd(template)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11px] text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-text-primary"
              >
                <span className="text-text-muted">{template.icon}</span>
                {template.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active alerts */}
      {evaluations.filter((e) => e.triggered).length > 0 && (
        <div className="space-y-1.5">
          {evaluations
            .filter((e) => e.triggered)
            .map((ev) => (
              <div
                key={ev.rule.id}
                className="flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-3 py-2"
              >
                <BellRing size={12} className="shrink-0 text-text-primary" />
                <span className="flex-1 text-[11px] text-text-primary">{ev.message}</span>
              </div>
            ))}
        </div>
      )}

      {/* Rules list */}
      {rules.length > 0 && (
        <div className="space-y-1">
          {rules.map((rule) => {
            const ev = evaluations.find((e) => e.rule.id === rule.id);
            return (
              <div
                key={rule.id}
                className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors ${
                  ev?.triggered ? "bg-accent-soft" : "hover:bg-bg-card"
                }`}
              >
                <button onClick={() => handleToggle(rule.id)} className="shrink-0">
                  {rule.enabled ? (
                    <ToggleRight size={16} className="text-accent" />
                  ) : (
                    <ToggleLeft size={16} className="text-text-muted" />
                  )}
                </button>
                <span
                  className={`flex-1 text-[11px] ${
                    rule.enabled ? "text-text-primary" : "text-text-muted line-through"
                  }`}
                >
                  {rule.name}
                </span>
                {ev?.triggered && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                )}
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <Trash2 size={10} className="text-text-muted hover:text-text-primary" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {rules.length === 0 && !showAddMenu && (
        <p className="text-[11px] text-text-muted">
          No alert rules configured. Add rules to get notified when conditions are met.
        </p>
      )}
    </div>
  );
}
