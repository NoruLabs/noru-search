"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Calendar,
  Satellite,
  Download,
  Maximize2,
} from "lucide-react";
import type { MarsPhoto } from "../../lib/types";

interface MarsLightboxProps {
  photos: MarsPhoto[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function MarsLightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
}: MarsLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  const photo = photos[index];

  const prev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  }, [photos.length]);

  const next = useCallback(() => {
    setIndex((i) => (i < photos.length - 1 ? i + 1 : 0));
  }, [photos.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "i") setShowInfo((v) => !v);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [isOpen, onClose, prev, next]);

  if (!isOpen || !photo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#23262A]/95 backdrop-blur-sm">
      {/* Top bar */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between p-4">
        <span className="rounded-full bg-[#23262A]/80 px-3 py-1 text-xs text-[#F8F8FF]/70">
          {index + 1} / {photos.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#23262A]/80 text-[#F8F8FF]/70 transition-colors hover:text-[#F8F8FF]"
            title="Toggle info (i)"
          >
            <Maximize2 size={14} />
          </button>
          <a
            href={photo.img_src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#23262A]/80 text-[#F8F8FF]/70 transition-colors hover:text-[#F8F8FF]"
            title="Open original"
          >
            <Download size={14} />
          </a>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#23262A]/80 text-[#F8F8FF]/70 transition-colors hover:text-[#F8F8FF]"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Nav arrows */}
      {photos.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#23262A]/80 text-[#F8F8FF]/70 transition-colors hover:text-[#F8F8FF]"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#23262A]/80 text-[#F8F8FF]/70 transition-colors hover:text-[#F8F8FF]"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Image */}
      <img
        src={photo.img_src}
        alt={`Mars - Sol ${photo.sol} - ${photo.camera.full_name}`}
        className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
      />

      {/* Bottom info panel */}
      {showInfo && (
        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-[#23262A] to-transparent p-6 pt-16">
          <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-4 text-sm text-[#F8F8FF]">
            <div className="flex items-center gap-1.5">
              <Satellite size={14} className="text-[#F8F8FF]/50" />
              <span>{photo.rover.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Camera size={14} className="text-[#F8F8FF]/50" />
              <span>{photo.camera.full_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#F8F8FF]/50" />
              <span>Sol {photo.sol}</span>
              <span className="text-[#F8F8FF]/40">·</span>
              <span className="text-[#F8F8FF]/70">{photo.earth_date}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
