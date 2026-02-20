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
import {
  FlareIntensityChart,
  FlareTimelineChart,
} from "../charts/WeatherCharts";

type WeatherCategory = "flares" | "cme" | "storms" | "sep" | "ips";

export function SpaceWeatherPanel() {
  const [category, setCategory] = useState<WeatherCategory>("flares");
  const [daysBack, setDaysBack] = useState(30);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Category tabs */}
        <div className="flex gap-2">
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
              onClick={() => setCategory(cat.id)}
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
            className="rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text-primary outline-none"
          >
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
          </select>
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
          {category === "flares" && flares.data && (
            <div className="space-y-6 animate-fade-in">
              {/* Charts */}
              {flares.data.length > 0 && (
                <div className="grid gap-4 lg:grid-cols-2">
                  <FlareIntensityChart data={flares.data} />
                  <FlareTimelineChart data={flares.data} />
                </div>
              )}

              <p className="text-sm text-text-muted">
                {flares.data.length} solar flares in the past {daysBack} days
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {flares.data.map((flare) => (
                  <DataCard key={flare.flrID}>
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-sm font-semibold text-text-primary">
                          Class {flare.classType}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${
                            flare.classType.startsWith("X")
                              ? "bg-red-500/10 text-red-400"
                              : flare.classType.startsWith("M")
                                ? "bg-orange-500/10 text-orange-400"
                                : "bg-yellow-500/10 text-yellow-400"
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
          )}

          {/* CMEs */}
          {category === "cme" && cmes.data && (
            <>
              <p className="text-sm text-text-muted">
                {cmes.data.length} coronal mass ejections in the past{" "}
                {daysBack} days
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cmes.data.map((cme) => (
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
          )}

          {/* Geomagnetic Storms */}
          {category === "storms" && storms.data && (
            <>
              <p className="text-sm text-text-muted">
                {storms.data.length} geomagnetic storms in the past {daysBack}{" "}
                days
              </p>
              {storms.data.length === 0 ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  No geomagnetic storms detected in this period.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {storms.data.map((storm) => (
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
          )}

          {/* Solar Energetic Particles */}
          {category === "sep" && seps.data && (
            <>
              <p className="text-sm text-text-muted">
                {seps.data.length} solar energetic particle events in the past{" "}
                {daysBack} days
              </p>
              {seps.data.length === 0 ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  No solar energetic particle events detected in this period.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {seps.data.map((sep) => (
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
          )}

          {/* Interplanetary Shocks */}
          {category === "ips" && shocks.data && (
            <>
              <p className="text-sm text-text-muted">
                {shocks.data.length} interplanetary shocks in the past{" "}
                {daysBack} days
              </p>
              {shocks.data.length === 0 ? (
                <p className="py-10 text-center text-sm text-text-muted">
                  No interplanetary shocks detected in this period.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {shocks.data.map((shock) => (
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
          )}
        </>
      )}
    </div>
  );
}
