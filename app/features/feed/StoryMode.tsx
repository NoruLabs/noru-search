"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BookOpen,
  X,
  Share2,
  ChevronLeft,
  ChevronRight,
  Zap,
  AlertTriangle,
  Orbit,
  Telescope,
  Activity,
} from "lucide-react";
import { useFeed } from "../../hooks/useFeed";
import { useSolarFlares, useGeomagneticStorms } from "../../hooks/useSpaceWeather";
import { calculateRisk } from "../../lib/scoring";
import { dismissStory, getUIPrefs } from "../../lib/storage";
import { formatDate } from "../../lib/scoring";
import type { NeoObject, SolarFlare } from "../../lib/types";

interface StoryCard {
  id: string;
  title: string;
  icon: React.ReactNode;
  body: string;
  color: string;
  date: string;
}

export function StoryMode() {
  const { data: feedData } = useFeed();
  const { data: flares } = useSolarFlares(7);
  const { data: storms } = useGeomagneticStorms(7);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    try {
      setDismissed(getUIPrefs().dismissedStories);
    } catch {}
  }, []);

  const stories = useMemo<StoryCard[]>(() => {
    const cards: StoryCard[] = [];
    const now = new Date();
    const weekStr = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;

    // Solar activity digest
    if (flares && flares.length > 0) {
      const risk = calculateRisk({ flares, storms: storms ?? [] });
      const xFlares = flares.filter((f) => f.classType.toUpperCase().startsWith("X"));
      const mFlares = flares.filter((f) => f.classType.toUpperCase().startsWith("M"));

      let body = `This week's space weather risk level: ${risk.level} (score: ${risk.score}/100). `;
      if (xFlares.length > 0) body += `${xFlares.length} X-class flare${xFlares.length > 1 ? "s" : ""} recorded. `;
      if (mFlares.length > 0) body += `${mFlares.length} M-class flare${mFlares.length > 1 ? "s" : ""} detected. `;
      if ((storms ?? []).length > 0) body += `${storms!.length} geomagnetic storm${storms!.length > 1 ? "s" : ""} observed. `;
      body += risk.summary;

      cards.push({
        id: `solar-${weekStr}`,
        title: "This Week's Solar Activity",
        icon: <Zap size={16} />,
        body,
        color: "var(--accent)",
        date: formatDate(now),
      });
    }

    // NEO digest
    const neos = feedData?.results?.neo ?? [];
    if (neos.length > 0) {
      const hazardous = neos.filter((n: NeoObject) => n.is_potentially_hazardous_asteroid);
      const closest = [...neos].sort((a: NeoObject, b: NeoObject) => {
        const dA = parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers || "999999999");
        const dB = parseFloat(b.close_approach_data[0]?.miss_distance?.kilometers || "999999999");
        return dA - dB;
      })[0];

      let body = `${neos.length} near-Earth object${neos.length > 1 ? "s" : ""} tracked this week. `;
      if (hazardous.length > 0) {
        body += `${hazardous.length} classified as potentially hazardous. `;
      } else {
        body += "None classified as hazardous. ";
      }
      if (closest) {
        const dist = parseFloat(closest.close_approach_data[0]?.miss_distance?.lunar || "0");
        body += `Closest approach: ${closest.name.replace(/[()]/g, "")} at ${dist.toFixed(1)} lunar distances.`;
      }

      cards.push({
        id: `neo-${weekStr}`,
        title: "Asteroid Watch",
        icon: <Orbit size={16} />,
        body,
        color: "var(--accent)",
        date: formatDate(now),
      });
    }

    // APOD card
    const apod = feedData?.results?.apod;
    if (apod) {
      cards.push({
        id: `apod-${apod.date}`,
        title: "Today's Cosmic Picture",
        icon: <Telescope size={16} />,
        body: `"${apod.title}" — ${apod.explanation.slice(0, 200)}${apod.explanation.length > 200 ? "..." : ""}`,
        color: "var(--accent)",
        date: apod.date,
      });
    }

    return cards.filter((c) => !dismissed.includes(c.id));
  }, [feedData, flares, storms, dismissed]);

  const handleDismiss = (id: string) => {
    dismissStory(id);
    setDismissed((prev) => [...prev, id]);
    if (activeIndex >= stories.length - 1) {
      setActiveIndex(Math.max(0, stories.length - 2));
    }
  };

  const handleShare = async (story: StoryCard) => {
    const text = `${story.title}\n\n${story.body}\n\n— via Noru Search`;
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {}
    }
  };

  if (stories.length === 0) return null;

  const current = stories[activeIndex] ?? stories[0];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-text-muted" />
          <h3 className="text-sm font-semibold text-text-primary">Story Mode</h3>
          <span className="rounded-full bg-bg-card px-1.5 py-0.5 text-[10px] text-text-muted">
            {stories.length} {stories.length === 1 ? "story" : "stories"}
          </span>
        </div>
        {stories.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:bg-bg-card disabled:opacity-30"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-[10px] text-text-muted tabular-nums">
              {activeIndex + 1}/{stories.length}
            </span>
            <button
              onClick={() => setActiveIndex((i) => Math.min(stories.length - 1, i + 1))}
              disabled={activeIndex === stories.length - 1}
              className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:bg-bg-card disabled:opacity-30"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Story card */}
      {current && (
        <div
          className="relative rounded-xl border border-border bg-bg-card p-5 animate-fade-in"
          style={{ borderLeftWidth: 3, borderLeftColor: current.color }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${current.color}15`, color: current.color }}
              >
                {current.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">{current.title}</h4>
                <p className="text-[10px] text-text-muted">{current.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleShare(current)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:bg-bg-card-hover hover:text-text-primary"
                title="Share"
              >
                <Share2 size={12} />
              </button>
              <button
                onClick={() => handleDismiss(current.id)}
                className="flex h-6 w-6 items-center justify-center rounded-md text-text-muted hover:bg-bg-card-hover hover:text-text-primary"
                title="Dismiss"
              >
                <X size={12} />
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-text-secondary">{current.body}</p>

          {/* Progress dots */}
          {stories.length > 1 && (
            <div className="mt-3 flex justify-center gap-1">
              {stories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-1 rounded-full transition-all ${
                    i === activeIndex ? "w-4 bg-accent" : "w-1 bg-border"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
