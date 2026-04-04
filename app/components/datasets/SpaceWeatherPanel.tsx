"use client";

import { useState } from "react";
import {
  useSolarFlares,
  useCoronalMassEjections,
  useGeomagneticStorms,
  useSolarEnergeticParticles,
  useInterplanetaryShocks,
} from "../../hooks/useSpaceWeather";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import dynamic from "next/dynamic";
import { Calendar, Search, X } from "lucide-react";

const FlareIntensityChart = dynamic(() => import("../charts/WeatherCharts").then(mod => mod.FlareIntensityChart), {
  ssr: false,
  loading: () => <CardSkeleton />
});

const FlareTimelineChart = dynamic(() => import("../charts/WeatherCharts").then(mod => mod.FlareTimelineChart), {
  ssr: false,
  loading: () => <CardSkeleton />
});

type WeatherCategory = "flares" | "cme" | "storms" | "sep" | "ips";

export function SpaceWeatherPanel() {
  const [category, setCategory] = useState<WeatherCategory>("flares");
  const [daysBack, setDaysBack] = useState(30);
  const [searchText, setSearchText] = useState("");

  const flares = useSolarFlares(daysBack);
  const cmes = useCoronalMassEjections(daysBack);
  const storms = useGeomagneticStorms(daysBack);
  const seps = useSolarEnergeticParticles(daysBack);
  const shocks = useInterplanetaryShocks(daysBack);

  const currentQuery =
    category === "flares"
      ? flares
      : category === "cme"
        ? cmes
        : category === "sep"
          ? seps
          : category === "ips"
            ? shocks
            : storms;

  // Filter helper
  const q = searchText.toLowerCase().trim();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-end gap-3">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "flares", label: "Solar Flares" },
                { id: "cme", label: "CMEs" },
                { id: "storms", label: "Geomagnetic Storms" },
                { id: "sep", label: "Energetic Particles" },
                { id: "ips", label: "Interplanetary Shocks" },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setCategory(cat.id); setSearchText(""); }}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat.id
                    ? "border-accent bg-accent text-accent-text"
                    : "border-border text-text-muted hover:text-text-secondary"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Time range */}
          <div>
            <label className="mb-1 block text-xs text-text-muted">
              Past days
            </label>
            <select
              value={daysBack}
              onChange={(e) => setDaysBack(Number(e.target.value))}
              className="rounded-xl border border-border/60 bg-bg-card/80 px-3 py-2 text-sm text-text-primary outline-none transition-all focus:ring-2 focus:ring-accent/10"
            >
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
              <option value={60}>60 days</option>
              <option value={90}>90 days</option>
            </select>
          </div>
        </div>

        {/* Search within results */}
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder={
                category === "flares" ? "Filter by class (X, M, C)..." :
                category === "cme" ? "Filter by source, speed..." :
                category === "storms" ? "Filter by Kp index..." :
                "Filter events..."
              }
              className="w-full rounded-xl border border-border bg-bg-card py-2 pl-9 pr-3 text-sm text-text-primary outline-none transition-all focus:border-accent/40 focus:ring-2 focus:ring-accent/10"
            />
          </div>
          {searchText && (
            <button
              onClick={() => setSearchText("")}
              className="flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-xs text-text-muted hover:text-text-primary transition-colors"
            >
              <X size={12} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {currentQuery.isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : currentQuery.error ? (
        <ErrorState
          message={getApiErrorMessage(currentQuery.error)}
          onRetry={() => currentQuery.refetch()}
        />
      ) : (
        <>
          {/* Solar Flares */}
          {category === "flares" && flares.data && (() => {
            const filtered = q
              ? flares.data.filter((f) =>
                  f.classType.toLowerCase().includes(q) ||
                  (f.sourceLocation && f.sourceLocation.toLowerCase().includes(q)) ||
                  new Date(f.peakTime).toLocaleDateString().includes(q)
                )
              : flares.data;
            return (
            <div className="space-y-6 animate-fade-in">
              {/* Charts */}
              {filtered.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <FlareIntensityChart data={filtered} />
                  <FlareTimelineChart data={filtered} />
                </div>
              )}

              <p className="text-sm text-text-muted">
                {filtered.length} solar flares in the past {daysBack} days{q && ` matching "${searchText}"`}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((flare) => (
                  <DataCard key={flare.flrID}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-semibold text-text-primary">
                          Class {flare.classType}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            flare.classType.startsWith("X")
                              ? "bg-accent text-accent-text font-semibold"
                              : flare.classType.startsWith("M")
                                ? "bg-accent-soft text-text-primary font-medium"
                                : "bg-accent-soft text-text-secondary"
                          }`}
                        >
                          {flare.classType.startsWith("X")
                            ? "Extreme"
                            : flare.classType.startsWith("M")
                              ? "Strong"
                              : "Moderate"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-text-muted">Begin</p>
                          <p className="text-text-secondary">
                            {new Date(flare.beginTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-text-muted">Peak</p>
                          <p className="text-text-secondary">
                            {new Date(flare.peakTime).toLocaleDateString()}
                          </p>
                        </div>
                        {flare.sourceLocation && (
                          <div>
                            <p className="text-text-muted">Source</p>
                            <p className="text-text-secondary">
                              {flare.sourceLocation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DataCard>
                ))}
              </div>
            </div>
            );
          })()}

          {/* CMEs */}
          {category === "cme" && cmes.data && (() => {
            const filtered = q
              ? cmes.data.filter((c) =>
                  (c.sourceLocation && c.sourceLocation.toLowerCase().includes(q)) ||
                  (c.note && c.note.toLowerCase().includes(q)) ||
                  new Date(c.startTime).toLocaleDateString().includes(q) ||
                  (c.cmeAnalyses?.[0]?.speed && String(c.cmeAnalyses[0].speed).includes(q))
                )
              : cmes.data;
            return (
            <>
              <p className="text-sm text-text-muted">
                {filtered.length} coronal mass ejections in the past{" "}
                {daysBack} days{q && ` matching "${searchText}"`}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((cme) => (
                  <DataCard key={cme.activityID}>
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-text-primary">
                        CME Event
                      </h3>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-text-muted">Start</p>
                          <p className="text-text-secondary">
                            {new Date(cme.startTime).toLocaleDateString()}
                          </p>
                        </div>
                        {cme.sourceLocation && (
                          <div>
                            <p className="text-text-muted">Source</p>
                            <p className="text-text-secondary">
                              {cme.sourceLocation}
                            </p>
                          </div>
                        )}
                        {cme.cmeAnalyses?.[0] && (
                          <>
                            <div>
                              <p className="text-text-muted">Speed</p>
                              <p className="text-text-secondary">
                                {cme.cmeAnalyses[0].speed} km/s
                              </p>
                            </div>
                            <div>
                              <p className="text-text-muted">Type</p>
                              <p className="text-text-secondary">
                                {cme.cmeAnalyses[0].type}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      {cme.note && (
                        <p className="text-xs text-text-muted line-clamp-2">
                          {cme.note}
                        </p>
                      )}
                    </div>
                  </DataCard>
                ))}
              </div>
            </>
            );
          })()}

          {/* Geomagnetic Storms */}
          {category === "storms" && storms.data && (() => {
            const filtered = q
              ? storms.data.filter((s) =>
                  new Date(s.startTime).toLocaleDateString().includes(q) ||
                  (s.allKpIndex?.[0] && String(s.allKpIndex[0].kpIndex).includes(q))
                )
              : storms.data;
            return (
            <>
              <p className="text-sm text-text-muted">
                {filtered.length} geomagnetic storms in the past {daysBack}{" "}
                days{q && ` matching "${searchText}"`}
              </p>
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  No geomagnetic storms detected{q ? ` matching "${searchText}"` : " in this period"}.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((storm) => (
                    <DataCard key={storm.gstID}>
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-text-primary">
                          Geomagnetic Storm
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-text-muted">Start</p>
                            <p className="text-text-secondary">
                              {new Date(storm.startTime).toLocaleDateString()}
                            </p>
                          </div>
                          {storm.allKpIndex?.[0] && (
                            <div>
                              <p className="text-text-muted">Kp Index</p>
                              <p className="text-text-secondary">
                                {storm.allKpIndex[0].kpIndex}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DataCard>
                  ))}
                </div>
              )}
            </>
            );
          })()}

          {/* Solar Energetic Particles */}
          {category === "sep" && seps.data && (() => {
            const filtered = q
              ? seps.data.filter((s) =>
                  new Date(s.eventTime).toLocaleDateString().includes(q) ||
                  (s.instruments?.[0] && s.instruments[0].displayName.toLowerCase().includes(q))
                )
              : seps.data;
            return (
            <>
              <p className="text-sm text-text-muted">
                {filtered.length} solar energetic particle events in the past{" "}
                {daysBack} days{q && ` matching "${searchText}"`}
              </p>
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  No solar energetic particle events detected{q ? ` matching "${searchText}"` : " in this period"}.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((sep) => (
                    <DataCard key={sep.sepID}>
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-text-primary">
                          SEP Event
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-text-muted">Time</p>
                            <p className="text-text-secondary">
                              {new Date(sep.eventTime).toLocaleDateString()}
                            </p>
                          </div>
                          {sep.instruments?.[0] && (
                            <div>
                              <p className="text-text-muted">Instrument</p>
                              <p className="text-text-secondary">
                                {sep.instruments[0].displayName}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DataCard>
                  ))}
                </div>
              )}
            </>
            );
          })()}

          {/* Interplanetary Shocks */}
          {category === "ips" && shocks.data && (() => {
            const filtered = q
              ? shocks.data.filter((s) =>
                  new Date(s.eventTime).toLocaleDateString().includes(q) ||
                  (s.location && s.location.toLowerCase().includes(q)) ||
                  (s.instruments?.[0] && s.instruments[0].displayName.toLowerCase().includes(q))
                )
              : shocks.data;
            return (
            <>
              <p className="text-sm text-text-muted">
                {filtered.length} interplanetary shocks in the past{" "}
                {daysBack} days{q && ` matching "${searchText}"`}
              </p>
              {filtered.length === 0 ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  No interplanetary shocks detected{q ? ` matching "${searchText}"` : " in this period"}.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((shock) => (
                    <DataCard key={shock.activityID}>
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-text-primary">
                          Interplanetary Shock
                        </h3>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-text-muted">Time</p>
                            <p className="text-text-secondary">
                              {new Date(shock.eventTime).toLocaleDateString()}
                            </p>
                          </div>
                          {shock.location && (
                            <div>
                              <p className="text-text-muted">Location</p>
                              <p className="text-text-secondary">
                                {shock.location}
                              </p>
                            </div>
                          )}
                          {shock.instruments?.[0] && (
                            <div>
                              <p className="text-text-muted">Instrument</p>
                              <p className="text-text-secondary">
                                {shock.instruments[0].displayName}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DataCard>
                  ))}
                </div>
              )}
            </>
            );
          })()}
        </>
      )}
    </div>
  );
}
