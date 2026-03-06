import { MetricType } from "./gpx";

/**
 * Customizable settings for the poster rendering.
 */
export interface PosterSettings {
  title: string;
  subtext: string;
  theme: string;
  isDark: boolean;
  strokeWidth: number;
  padding: number;
  backgroundColor: string;
  strokeColor: string;
  metrics: MetricType[];
  smoothing: number;
}

/**
 * Color palette definition for themes.
 */
export interface Palette {
  id: string;
  name: string;
  bg: string;
  stroke: string;
  isDark: boolean;
}

/**
 * Predefined color palettes for the application.
 * Consolidated from EditorScreen and Home.
 */
export const PALETTES: Palette[] = [
  // Light Palettes
  { id: "zinc", name: "Zinc", bg: "#fafafa", stroke: "#18181b", isDark: false },
  { id: "slate", name: "Slate", bg: "#f8fafc", stroke: "#0f172a", isDark: false },
  { id: "stone", name: "Stone", bg: "#fafaf9", stroke: "#1c1917", isDark: false },
  { id: "emerald", name: "Emerald", bg: "#f0fdf4", stroke: "#059669", isDark: false },
  { id: "rose", name: "Rose", bg: "#fff1f2", stroke: "#be123c", isDark: false },
  
  // Dark Palettes
  { id: "midnight", name: "Midnight", bg: "#020617", stroke: "#38bdf8", isDark: true },
  { id: "obsidian", name: "Obsidian", bg: "#09090b", stroke: "#ffffff", isDark: true },
  { id: "nordic", name: "Nordic", bg: "#2e3440", stroke: "#d8dee9", isDark: true },
  { id: "forest", name: "Forest", bg: "#022c22", stroke: "#6ee7b7", isDark: true },
  { id: "deepblue", name: "Deep Blue", bg: "#082f49", stroke: "#7dd3fc", isDark: true },
];

export const LIGHT_PALETTES = PALETTES.filter(p => !p.isDark);
export const DARK_PALETTES = PALETTES.filter(p => p.isDark);
