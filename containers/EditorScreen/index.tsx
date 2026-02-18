"use client";

import React, { useState, useRef } from "react";
import { Poster, PosterHandle } from "@/components/Poster";
import { Button } from "@/components/Button";
import { Route, NormalizedPoint, PosterSettings } from "@/types";
import { Settings, Download, Trash2, ArrowLeft, Palette, Type, Sliders } from "lucide-react";

interface EditorScreenProps {
  route: Route;
  points: NormalizedPoint[];
  onReset: () => void;
}

export const EditorScreen = ({ route, points, onReset }: EditorScreenProps) => {
  const posterRef = useRef<PosterHandle>(null);
  const [settings, setSettings] = useState<PosterSettings>({
    title: route.name,
    subtext: `${(route.distance / 1000).toFixed(1)} KM • ${route.date || "Unknown Date"}`,
    theme: "light",
    strokeWidth: 2,
    padding: 0.15,
    backgroundColor: "#ffffff",
    strokeColor: "#000000",
  });

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
                <label className="text-sm font-medium">Subtext (Stats)</label>
                <input
                  type="text"
                  value={settings.subtext}
                  onChange={(e) => setSettings({ ...settings, subtext: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </div>

          {/* Section: Style */}
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Sliders size={14} />
              Style
            </div>
            <div className="space-y-6">
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

          {/* Section: Theme */}
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Palette size={14} />
              Theme
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={settings.theme === "light" ? "primary" : "outline"}
                className="w-full rounded-xl py-8"
                onClick={() => setSettings({ ...settings, theme: "light" })}
              >
                Light
              </Button>
              <Button
                variant={settings.theme === "dark" ? "primary" : "outline"}
                className="w-full rounded-xl py-8"
                onClick={() => setSettings({ ...settings, theme: "dark" })}
              >
                Dark
              </Button>
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
            strokeWidth={settings.strokeWidth}
            padding={settings.padding}
          />
        </div>
      </main>
    </div>
  );
};
