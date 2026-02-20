"use client";

import { useState, useMemo } from "react";
import { RefreshCw, ExternalLink, Grid, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useApod } from "../../hooks/useApod";
import { DataCard } from "../ui/DataCard";
import { Loader } from "../ui/Loader";
import { ErrorState } from "../ui/ErrorState";
import { getApiErrorMessage } from "../../lib/api";
import { ApodGallery } from "../details/ApodGallery";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ApodDatePicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const today = new Date();
  const minDate = new Date(1995, 5, 16); // June 16, 1995

  // Parse current selection or default to today
  const selected = value ? new Date(value + "T00:00:00") : today;
  const [viewYear, setViewYear] = useState(selected.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected.getMonth());
  const [isOpen, setIsOpen] = useState(false);

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const firstDayOfWeek = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewYear, viewMonth]);

  const handleDayClick = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setIsOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const canPrev = new Date(viewYear, viewMonth, 1) > minDate;
  const canNext = new Date(viewYear, viewMonth + 1, 1) <= new Date(today.getFullYear(), today.getMonth() + 1, 1);

  const isDayDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    return d > today || d < minDate;
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const s = new Date(value + "T00:00:00");
    return s.getFullYear() === viewYear && s.getMonth() === viewMonth && s.getDate() === day;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-3 py-2 text-sm text-text-primary transition-all hover:border-border-hover"
      >
        <Calendar size={14} className="text-text-muted" />
        {value || "Pick a date"}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          {/* Calendar dropdown */}
          <div className="absolute left-0 top-full z-40 mt-1 w-72 rounded-xl border border-border bg-bg-primary p-3 shadow-lg">
            {/* Month/Year nav */}
            <div className="mb-2 flex items-center justify-between">
              <button
                onClick={prevMonth}
                disabled={!canPrev}
                className="rounded-md p-1 text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium text-text-primary">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                onClick={nextMonth}
                disabled={!canNext}
                className="rounded-md p-1 text-text-muted hover:text-text-primary disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-text-muted mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-0.5">
              {/* Empty cells for offset */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const disabled = isDayDisabled(day);
                const sel = isSelected(day);
                const tod = isToday(day);
                return (
                  <button
                    key={day}
                    onClick={() => !disabled && handleDayClick(day)}
                    disabled={disabled}
                    className={`rounded-md py-1.5 text-xs transition-colors ${
                      sel
                        ? "bg-accent text-accent-text font-semibold"
                        : tod
                          ? "bg-accent-soft text-text-primary font-medium"
                          : disabled
                            ? "text-text-muted/30 cursor-not-allowed"
                            : "text-text-secondary hover:bg-accent-soft hover:text-text-primary"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            {/* Quick actions */}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <button
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="text-[11px] text-text-muted hover:text-text-primary transition-colors"
              >
                Clear
              </button>
              <button
                onClick={() => {
                  const t = today;
                  setViewYear(t.getFullYear());
                  setViewMonth(t.getMonth());
                  onChange("");
                  setIsOpen(false);
                }}
                className="text-[11px] text-text-muted hover:text-text-primary transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ApodPanel() {
  const [date, setDate] = useState<string>("");
  const [showGallery, setShowGallery] = useState(false);
  const { data, isLoading, error, refetch, isFetching } = useApod(
    date || undefined
  );

  if (isLoading) return <Loader text="Loading today's astronomy picture..." />;
  if (error)
    return (
      <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
    );
  if (!data) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <ApodDatePicker value={date} onChange={setDate} />
        <button
          onClick={() => {
            setDate("");
            refetch();
          }}
          disabled={isFetching}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Today
        </button>
        <button
          onClick={() => setShowGallery(true)}
          className="flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-text-secondary transition-all hover:border-border-hover hover:text-text-primary active:scale-95"
        >
          <Grid size={14} />
          Gallery
        </button>
      </div>

      {/* Content */}
      <DataCard>
        <div className="space-y-5">
          {/* Title & Date */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {data.title}
            </h2>
            <p className="mt-1 text-sm text-text-muted">
              {data.date}
              {data.copyright && ` · © ${data.copyright}`}
            </p>
          </div>

          {/* Media */}
          {data.media_type === "image" ? (
            <div className="overflow-hidden rounded-xl">
              <img
                src={data.url}
                alt={data.title}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="aspect-video overflow-hidden rounded-xl">
              <iframe
                src={data.url}
                title={data.title}
                className="h-full w-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Explanation */}
          <p className="text-sm leading-relaxed text-text-secondary">
            {data.explanation}
          </p>

          {/* HD Link */}
          {data.hdurl && (
            <a
              href={data.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent transition-all hover:opacity-80"
            >
              View HD
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </DataCard>

      {/* Gallery */}
      <ApodGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onSelectDate={(d) => setDate(d)}
      />
    </div>
  );
}
