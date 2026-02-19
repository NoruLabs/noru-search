"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { NeoObject } from "../../lib/types";

interface NeoChartProps {
  data: NeoObject[];
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toFixed(0);
}

export function NeoDistanceChart({ data }: NeoChartProps) {
  const chartData = data.slice(0, 10).map((neo) => {
    const approach = neo.close_approach_data[0];
    const distance = approach
      ? parseFloat(approach.miss_distance.kilometers)
      : 0;
    return {
      name: neo.name.replace(/[()]/g, "").slice(0, 12),
      distance: Math.round(distance),
      hazardous: neo.is_potentially_hazardous_asteroid,
    };
  });

  return (
    <div className="rounded-lg border border-border bg-bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Closest Approaches (km)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis
            type="number"
            tickFormatter={formatNumber}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString()} km`,
              "Distance",
            ]}
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
          />
          <Bar dataKey="distance" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.hazardous ? "#EF4444" : "var(--accent)"}
                opacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function NeoVelocityChart({ data }: NeoChartProps) {
  const chartData = data.slice(0, 10).map((neo) => {
    const approach = neo.close_approach_data[0];
    const velocity = approach
      ? parseFloat(approach.relative_velocity.kilometers_per_hour)
      : 0;
    return {
      name: neo.name.replace(/[()]/g, "").slice(0, 12),
      velocity: Math.round(velocity),
      hazardous: neo.is_potentially_hazardous_asteroid,
    };
  });

  return (
    <div className="rounded-lg border border-border bg-bg-card p-4">
      <h3 className="mb-4 text-sm font-semibold text-text-primary">
        Velocity (km/h)
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20 }}>
          <XAxis
            type="number"
            tickFormatter={formatNumber}
            tick={{ fontSize: 10, fill: "var(--text-muted)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={90}
            tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString()} km/h`,
              "Velocity",
            ]}
            contentStyle={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--text-primary)",
            }}
          />
          <Bar dataKey="velocity" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.hazardous ? "#EF4444" : "var(--accent)"}
                opacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
