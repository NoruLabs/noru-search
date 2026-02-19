"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  CartesianGrid,
} from "recharts";
import type { SolarFlare } from "../../lib/types";

interface FlareChartProps {
  data: SolarFlare[];
}

// Parse flare class to numeric intensity (e.g. M1.5 → 15, X2.0 → 200)
function parseFlareIntensity(classType: string): number {
  const letter = classType.charAt(0);
  const num = parseFloat(classType.slice(1)) || 1;
  const multiplier =
    letter === "X" ? 100 : letter === "M" ? 10 : letter === "C" ? 1 : 0.1;
  return num * multiplier;
}

function getFlareColor(classType: string): string {
  if (classType.startsWith("X")) return "#EF4444";
  if (classType.startsWith("M")) return "#F97316";
  return "#EAB308";
}

export function FlareIntensityChart({ data }: FlareChartProps) {
  // Group by class type letter
  const classCounts = data.reduce<Record<string, number>>((acc, flare) => {
    const letter = flare.classType.charAt(0);
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(classCounts)
    .map(([cls, count]) => ({
      class: cls,
      count,
      color:
        cls === "X"
          ? "#EF4444"
          : cls === "M"
            ? "#F97316"
            : cls === "C"
              ? "#EAB308"
              : "var(--accent)",
    }))
    .sort((a, b) => {
      const order = ["B", "C", "M", "X"];
      return order.indexOf(a.class) - order.indexOf(b.class);
    });

  return (
    <div className="rounded-lg border border-border bg-bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Flare Classification Distribution
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ left: 0, right: 10 }}>
          <XAxis
            dataKey="class"
            tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [value, "Events"]}
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FlareTimelineChart({ data }: FlareChartProps) {
  const chartData = data
    .map((flare) => ({
      date: new Date(flare.beginTime).getTime(),
      intensity: parseFlareIntensity(flare.classType),
      classType: flare.classType,
      color: getFlareColor(flare.classType),
      dateStr: new Date(flare.beginTime).toLocaleDateString(),
    }))
    .sort((a, b) => a.date - b.date);

  return (
    <div className="rounded-lg border border-border bg-bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Flare Timeline (by intensity)
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ left: 10, right: 10, bottom: 5 }}>
          <CartesianGrid
            stroke="var(--border)"
            strokeDasharray="3 3"
            opacity={0.3}
          />
          <XAxis
            dataKey="date"
            type="number"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="intensity"
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <ZAxis range={[30, 120]} />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="rounded-lg border border-border bg-bg-card p-2 text-xs text-text-primary shadow-lg">
                  <p className="font-medium">Class {d.classType}</p>
                  <p className="text-text-muted">{d.dateStr}</p>
                </div>
              );
            }}
          />
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} opacity={0.8} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
