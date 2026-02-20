"use client";

import { useInsightWeather } from "../../hooks/useInsight";
import { DataCard } from "../ui/DataCard";
import { Loader, CardSkeleton } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import type { InsightSolData } from "../../lib/types";

export function InsightPanel() {
  const { data, isLoading, error, refetch } = useInsightWeather();

  if (isLoading) return <Loader text="Loading InSight Mars weather data..." />;
  if (error)
    return (
      <ErrorState
        message={getApiErrorMessage(error)}
        onRetry={() => refetch()}
      />
    );

  const solKeys: string[] = data?.sol_keys ?? [];

  if (solKeys.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center py-16">
          <p className="text-sm font-medium text-text-primary">
            No recent InSight data available
          </p>
          <p className="mt-2 text-xs text-text-muted max-w-md mx-auto">
            NASA&apos;s InSight lander mission ended in December 2022. Historical
            data may not be available through this endpoint. The lander
            collected valuable data on Mars surface temperature, pressure,
            and wind during its mission.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">
          InSight Mars Weather
        </h2>
        <p className="mt-1 text-sm text-text-muted">
          Surface conditions recorded by NASA&apos;s InSight lander on Mars
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {solKeys.map((sol) => {
          const solData = data![sol] as InsightSolData;
          if (!solData || typeof solData !== "object") return null;

          return (
            <DataCard key={sol}>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Sol {sol}
                  </h3>
                  {solData.Season && (
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">
                      {solData.Season}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {solData.AT && (
                    <>
                      <div>
                        <p className="text-text-muted">Temp (avg)</p>
                        <p className="text-text-secondary">
                          {solData.AT.av.toFixed(1)} °C
                        </p>
                      </div>
                      <div>
                        <p className="text-text-muted">Temp (range)</p>
                        <p className="text-text-secondary">
                          {solData.AT.mn.toFixed(1)} / {solData.AT.mx.toFixed(1)} °C
                        </p>
                      </div>
                    </>
                  )}
                  {solData.PRE && (
                    <div>
                      <p className="text-text-muted">Pressure</p>
                      <p className="text-text-secondary">
                        {solData.PRE.av.toFixed(1)} Pa
                      </p>
                    </div>
                  )}
                  {solData.HWS && (
                    <div>
                      <p className="text-text-muted">Wind Speed</p>
                      <p className="text-text-secondary">
                        {solData.HWS.av.toFixed(1)} m/s
                      </p>
                    </div>
                  )}
                </div>

                {solData.First_UTC && (
                  <p className="text-[10px] text-text-muted">
                    {new Date(solData.First_UTC).toLocaleDateString()} –{" "}
                    {new Date(solData.Last_UTC).toLocaleDateString()}
                  </p>
                )}
              </div>
            </DataCard>
          );
        })}
      </div>
    </div>
  );
}
