"use client";

import React, { useState, useRef, useMemo } from "react";
import { Poster, PosterHandle } from "@/components/Poster";
import { Button } from "@/components/Button";
import { Route, NormalizedPoint, PosterSettings } from "@/types";
import { Settings, Download, Trash2, ArrowLeft, Palette, Type, Sliders, Check, Sun, Moon } from "lucide-react";

interface EditorScreenProps {
  route: Route;
  points: NormalizedPoint[];
  onReset: () => void;
}

const LIGHT_PALETTES = [
  { id: "zinc", name: "Zinc", bg: "#fafafa", stroke: "#18181b" },
  { id: "slate", name: "Slate", bg: "#f8fafc", stroke: "#0f172a" },
  { id: "stone", name: "Stone", bg: "#fafaf9", stroke: "#1c1917" },
  { id: "emerald", name: "Emerald", bg: "#f0fdf4", stroke: "#059669" },
  { id: "rose", name: "Rose", bg: "#fff1f2", stroke: "#be123c" },
];

const DARK_PALETTES = [
  { id: "midnight", name: "Midnight", bg: "#020617", stroke: "#38bdf8" },
  { id: "obsidian", name: "Obsidian", bg: "#09090b", stroke: "#ffffff" },
  { id: "nordic", name: "Nordic", bg: "#2e3440", stroke: "#d8dee9" },
  { id: "forest", name: "Forest", bg: "#022c22", stroke: "#6ee7b7" },
  { id: "deepblue", name: "Deep Blue", bg: "#082f49", stroke: "#7dd3fc" },
];

export const EditorScreen = ({ route, points, onReset }: EditorScreenProps) => {
  const posterRef = useRef<PosterHandle>(null);
  const [settings, setSettings] = useState<PosterSettings>({
    title: route.name,
    subtext: route.date || "Unknown Date",
    theme: "zinc",
    isDark: false,
    strokeWidth: 2,
    padding: 0.15,
    backgroundColor: "#fafafa",
    strokeColor: "#18181b",
  });

  const elevations = useMemo(() => 
    route.points.map(p => p.elevation).filter((e): e is number => e !== undefined),
  [route.points]);

  const handleDownload = () => {
    const canvas = posterRef.current?.getCanvas();
    if (!canvas) return;

    try {
      // Create a temporary link element
      const link = document.createElement("a");
      const fileName = `${settings.title.toLowerCase().replace(/\s+/g, "-")}-poster.png`;
      
      // Convert canvas to data URL
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      
      link.download = fileName;
      link.href = dataUrl;
      
      // Append to body, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to export image:", err);
      alert("Failed to export the image. Please try again.");
    }
  };

  const selectPalette = (palette: typeof LIGHT_PALETTES[0], isPaletteDark: boolean) => {
    setSettings({
      ...settings,
      theme: palette.id,
      isDark: isPaletteDark,
      backgroundColor: palette.bg,
      strokeColor: palette.stroke,
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-zinc-50 dark:bg-zinc-950 lg:flex-row">
      {/* Sidebar Controls */}
      <aside className="w-full border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black lg:max-w-md lg:overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent" onClick={onReset}>
            <ArrowLeft size={16} />
            Back to Home
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Section: Typography */}
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Type size={14} />
              Typography
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Title</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subtext (Date)</label>
                <input
                  type="text"
                  value={settings.subtext}
                  onChange={(e) => setSettings({ ...settings, subtext: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </div>

          {/* Section: Theme */}
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Palette size={14} />
              Themes
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Light Mode</label>
                <div className="grid grid-cols-5 gap-3">
                  {LIGHT_PALETTES.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() => selectPalette(palette, false)}
                      className={`group relative flex h-10 w-full flex-col overflow-hidden rounded-md border transition-all ${
                        settings.theme === palette.id ? "ring-2 ring-zinc-950 ring-offset-2 dark:ring-zinc-50 dark:ring-offset-black" : "border-zinc-200 dark:border-zinc-800"
                      }`}
                      title={palette.name}
                    >
                      <div className="h-full w-full" style={{ backgroundColor: palette.bg }} />
                      <div className="absolute inset-y-0 right-0 w-1/3" style={{ backgroundColor: palette.stroke }} />
                      {settings.theme === palette.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <Check size={14} className="text-white mix-blend-difference" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Dark Mode</label>
                <div className="grid grid-cols-5 gap-3">
                  {DARK_PALETTES.map((palette) => (
                    <button
                      key={palette.id}
                      onClick={() => selectPalette(palette, true)}
                      className={`group relative flex h-10 w-full flex-col overflow-hidden rounded-md border transition-all ${
                        settings.theme === palette.id ? "ring-2 ring-zinc-950 ring-offset-2 dark:ring-zinc-50 dark:ring-offset-black" : "border-zinc-200 dark:border-zinc-800"
                      }`}
                      title={palette.name}
                    >
                      <div className="h-full w-full" style={{ backgroundColor: palette.bg }} />
                      <div className="absolute inset-y-0 right-0 w-1/3" style={{ backgroundColor: palette.stroke }} />
                      {settings.theme === palette.id && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <Check size={14} className="text-white mix-blend-difference" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                variant={settings.theme === "custom" ? "primary" : "outline"}
                className="w-full py-4 text-xs font-bold uppercase tracking-widest"
                onClick={() => setSettings({ ...settings, theme: "custom" })}
              >
                Custom Palette
              </Button>

              {settings.theme === "custom" && (
                <div className="mt-6 space-y-4 border-t border-zinc-100 pt-6 dark:border-zinc-900">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Background</label>
                    <input
                      type="color"
                      value={settings.backgroundColor}
                      onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                      className="h-8 w-12 cursor-pointer rounded border-none bg-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Stroke Color</label>
                    <input
                      type="color"
                      value={settings.strokeColor}
                      onChange={(e) => setSettings({ ...settings, strokeColor: e.target.value })}
                      className="h-8 w-12 cursor-pointer rounded border-none bg-transparent"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Style */}
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Sliders size={14} />
              Style
            </div>
            <div className="space-y-6">
              {/* Canvas Background Style Toggle */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Inner Canvas Style</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSettings({ ...settings, isDark: false })}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
                      !settings.isDark ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-black" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                    }`}
                  >
                    <Sun size={14} />
                    Light Frame
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, isDark: true })}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium transition-all ${
                      settings.isDark ? "bg-zinc-950 text-white dark:bg-zinc-50 dark:text-black" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                    }`}
                  >
                    <Moon size={14} />
                    Dark Frame
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Line Weight</label>
                  <span className="text-xs text-zinc-500">{settings.strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={settings.strokeWidth}
                  onChange={(e) => setSettings({ ...settings, strokeWidth: parseFloat(e.target.value) })}
                  className="w-full accent-zinc-950 dark:accent-zinc-50"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Padding</label>
                  <span className="text-xs text-zinc-500">{(settings.padding * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.01"
                  value={settings.padding}
                  onChange={(e) => setSettings({ ...settings, padding: parseFloat(e.target.value) })}
                  className="w-full accent-zinc-950 dark:accent-zinc-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-900">
          <Button variant="ghost" className="w-full gap-2 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" onClick={onReset}>
            <Trash2 size={16} />
            Discard Project
          </Button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex flex-1 items-center justify-center p-8 lg:p-12 overflow-hidden">
        <div className="w-full max-w-[500px] transition-transform duration-300">
          <Poster
            ref={posterRef}
            points={points}
            title={settings.title}
            subtext={settings.subtext}
            theme={settings.theme}
            isDark={settings.isDark}
            strokeWidth={settings.strokeWidth}
            padding={settings.padding}
            distance={route.distance}
            elevationGain={route.elevationGain}
            movingTime={route.movingTime}
            averageSpeed={route.averageSpeed}
            backgroundColor={settings.backgroundColor}
            strokeColor={settings.strokeColor}
          />
        </div>
      </main>
    </div>
  );
};
