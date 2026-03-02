"use client";

/**
 * localStorage wrapper — safe in SSR, private-mode, and quota-exceeded scenarios.
 * All keys are prefixed with `noru:` and stored data is versioned.
 */

const PREFIX = "noru:";
const SCHEMA_VERSION = 1;

// ── Types ──

export interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: {
    types?: string[];
    hazardousOnly?: boolean;
    startDate?: string;
    endDate?: string;
  };
  createdAt: number;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: AlertCondition;
  enabled: boolean;
  createdAt: number;
  lastTriggered?: number;
}

export type AlertCondition =
  | { type: "hazardous_neo_gte"; value: number }
  | { type: "xclass_flare_exists" }
  | { type: "flare_count_gte"; value: number }
  | { type: "geo_storm_exists" }
  | { type: "neo_count_gte"; value: number };

export interface UIPrefs {
  dismissedStories: string[];
  featureFlags: Record<string, boolean>;
  compareItems: { type: string; ids: string[] }[];
}

interface StoredData<T> {
  v: number;
  data: T;
}

// ── Core helpers ──

function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const key = "__noru_test__";
    localStorage.setItem(key, "1");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

function getItem<T>(key: string, fallback: T): T {
  if (!isStorageAvailable()) return fallback;
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    const parsed: StoredData<T> = JSON.parse(raw);
    if (parsed.v !== SCHEMA_VERSION) return fallback;
    return parsed.data;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, data: T): void {
  if (!isStorageAvailable()) return;
  try {
    const wrapped: StoredData<T> = { v: SCHEMA_VERSION, data };
    localStorage.setItem(PREFIX + key, JSON.stringify(wrapped));
  } catch {
    // quota exceeded — silently fail
  }
}

function removeItem(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

// ── Saved Searches ──

export function getSavedSearches(): SavedSearch[] {
  return getItem<SavedSearch[]>("saved-searches", []);
}

export function addSavedSearch(search: Omit<SavedSearch, "id" | "createdAt">): SavedSearch {
  const item: SavedSearch = {
    ...search,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
  };
  const list = getSavedSearches();
  list.unshift(item);
  setItem("saved-searches", list.slice(0, 50));
  return item;
}

export function removeSavedSearch(id: string): void {
  const list = getSavedSearches().filter((s) => s.id !== id);
  setItem("saved-searches", list);
}

// ── Alert Rules ──

export function getAlertRules(): AlertRule[] {
  return getItem<AlertRule[]>("alert-rules", []);
}

export function addAlertRule(rule: Omit<AlertRule, "id" | "createdAt">): AlertRule {
  const item: AlertRule = {
    ...rule,
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: Date.now(),
  };
  const list = getAlertRules();
  list.unshift(item);
  setItem("alert-rules", list.slice(0, 20));
  return item;
}

export function updateAlertRule(id: string, updates: Partial<AlertRule>): void {
  const list = getAlertRules().map((r) => (r.id === id ? { ...r, ...updates } : r));
  setItem("alert-rules", list);
}

export function removeAlertRule(id: string): void {
  const list = getAlertRules().filter((r) => r.id !== id);
  setItem("alert-rules", list);
}

// ── UI Preferences ──

export function getUIPrefs(): UIPrefs {
  return getItem<UIPrefs>("ui-prefs", {
    dismissedStories: [],
    featureFlags: {},
    compareItems: [],
  });
}

export function updateUIPrefs(updates: Partial<UIPrefs>): void {
  const current = getUIPrefs();
  setItem("ui-prefs", { ...current, ...updates });
}

export function dismissStory(storyId: string): void {
  const prefs = getUIPrefs();
  if (!prefs.dismissedStories.includes(storyId)) {
    prefs.dismissedStories.push(storyId);
    setItem("ui-prefs", prefs);
  }
}

// ── Compare Mode ──

export function getCompareItems(type: string): string[] {
  const prefs = getUIPrefs();
  return prefs.compareItems.find((c) => c.type === type)?.ids ?? [];
}

export function toggleCompareItem(type: string, id: string): string[] {
  const prefs = getUIPrefs();
  const existing = prefs.compareItems.find((c) => c.type === type);
  if (existing) {
    if (existing.ids.includes(id)) {
      existing.ids = existing.ids.filter((i) => i !== id);
    } else if (existing.ids.length < 4) {
      existing.ids.push(id);
    }
  } else {
    prefs.compareItems.push({ type, ids: [id] });
  }
  setItem("ui-prefs", prefs);
  return prefs.compareItems.find((c) => c.type === type)?.ids ?? [];
}

export function clearCompareItems(type: string): void {
  const prefs = getUIPrefs();
  prefs.compareItems = prefs.compareItems.filter((c) => c.type !== type);
  setItem("ui-prefs", prefs);
}

// ── Feature Flags ──

const DEFAULT_FLAGS: Record<string, boolean> = {
  dailyBriefing: true,
  riskMeter: true,
  savedSearches: true,
  alertConditions: true,
  exoplanetTrends: true,
  asteroidTimeline: true,
  compareMode: true,
  crossDatasetLinking: true,
  storyMode: true,
  pwaLite: true,
};

export function getFeatureFlag(flag: string): boolean {
  const prefs = getUIPrefs();
  return prefs.featureFlags[flag] ?? DEFAULT_FLAGS[flag] ?? false;
}

export function setFeatureFlag(flag: string, enabled: boolean): void {
  const prefs = getUIPrefs();
  prefs.featureFlags[flag] = enabled;
  setItem("ui-prefs", prefs);
}
