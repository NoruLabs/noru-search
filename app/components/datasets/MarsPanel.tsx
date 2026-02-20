"use client";

import { useState } from "react";
import { useMarsRovers, useMarsPhotos } from "../../hooks/useMarsRovers";
import { DataCard } from "../ui/DataCard";
import { Loader } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import { MARS_CAMERAS } from "../../lib/constants";
import { MarsLightbox } from "../details/MarsLightbox";

export function MarsPanel() {
  const [selectedRover, setSelectedRover] = useState("curiosity");
  const [sol, setSol] = useState<number>(1000);
  const [camera, setCamera] = useState<string>("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: rovers } = useMarsRovers();
  const {
    data: photos,
    isLoading,
    error,
    refetch,
  } = useMarsPhotos(selectedRover, {
    sol,
    camera: camera || undefined,
  });

  const currentRover = rovers?.find(
    (r) => r.name.toLowerCase() === selectedRover
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Rover selector */}
        <div>
          <label className="mb-1 block text-xs text-text-muted">Rover</label>
          <select
            value={selectedRover}
            onChange={(e) => setSelectedRover(e.target.value)}
            className="rounded-xl border border-border/60 bg-bg-card/80 px-3 py-2 text-sm text-text-primary outline-none transition-all focus:ring-2 focus:ring-accent/10"
          >
            {(rovers || []).map((rover) => (
              <option key={rover.name} value={rover.name.toLowerCase()}>
                {rover.name} ({rover.status})
              </option>
            ))}
          </select>
        </div>

        {/* Sol input */}
        <div>
          <label className="mb-1 block text-xs text-text-muted">
            Sol (Mars day)
          </label>
          <input
            type="number"
            value={sol}
            onChange={(e) => setSol(Number(e.target.value))}
            min={0}
            max={currentRover?.max_sol || 5000}
            className="w-24 rounded-xl border border-border/60 bg-bg-card/80 px-3 py-2 text-sm text-text-primary outline-none transition-all focus:ring-2 focus:ring-accent/10"
          />
        </div>

        {/* Camera filter */}
        <div>
          <label className="mb-1 block text-xs text-text-muted">Camera</label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            className="rounded-xl border border-border/60 bg-bg-card/80 px-3 py-2 text-sm text-text-primary outline-none transition-all focus:ring-2 focus:ring-accent/10"
          >
            <option value="">All Cameras</option>
            {Object.entries(MARS_CAMERAS).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Rover Info */}
      {currentRover && (
        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
          <span>
            Landing:{" "}
            <span className="text-text-secondary">
              {currentRover.landing_date}
            </span>
          </span>
          <span>
            Total photos:{" "}
            <span className="text-text-secondary">
              {currentRover.total_photos.toLocaleString()}
            </span>
          </span>
          <span>
            Latest sol:{" "}
            <span className="text-text-secondary">{currentRover.max_sol}</span>
          </span>
        </div>
      )}

      {/* Photos */}
      {isLoading ? (
        <Loader text={`Loading ${selectedRover} photos...`} />
      ) : error ? (
        <ErrorState
          message={
            getApiErrorMessage(error).includes("No such app") ||
            getApiErrorMessage(error).includes("Network Error")
              ? "NASA's Mars Photos API is currently unavailable. This appears to be a temporary outage on NASA's side — please try again later."
              : getApiErrorMessage(error)
          }
          onRetry={() => refetch()}
        />
      ) : photos && photos.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {photos.slice(0, 24).map((photo, idx) => (
            <DataCard
              key={photo.id}
              className="cursor-pointer p-0 overflow-hidden"
              onClick={() => setLightboxIndex(idx)}
            >
              <img
                src={photo.img_src}
                alt={`Mars - ${photo.camera.full_name}`}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <div className="p-3">
                <p className="text-xs font-medium text-text-primary">
                  {photo.camera.full_name}
                </p>
                <p className="text-xs text-text-muted">{photo.earth_date}</p>
              </div>
            </DataCard>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-sm text-text-muted">
          No photos found for this sol/camera combination. Try a different sol
          value.
        </p>
      )}

      {/* Lightbox */}
      {photos && photos.length > 0 && (
        <MarsLightbox
          photos={photos.slice(0, 24)}
          initialIndex={lightboxIndex ?? 0}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
