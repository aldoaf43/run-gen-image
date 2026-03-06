"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import { Poster, PosterHandle } from "@/components/Poster";
import { Button } from "@/components/Button";
import { Route, NormalizedPoint, PosterSettings, MetricType, LIGHT_PALETTES, DARK_PALETTES, Palette as PaletteType } from "@/types";
import { Download, Trash2, ArrowLeft, Palette, Type, Sliders, Check, Sun, Moon, Footprints, Bike, Mountain, Activity, BarChart3, Wand2 } from "lucide-react";
import { toPng } from "html-to-image";
import { smoothPoints, normalizePoints } from "@/lib/gpx-utils";

interface EditorScreenProps {
  route: Route;
  points: NormalizedPoint[];
  onReset: () => void;
}

const AVAILABLE_METRICS: { id: MetricType; label: string }[] = [
  { id: "distance", label: "Distance" },
  { id: "elevation", label: "Elev Gain" },
  { id: "elevationLoss", label: "Elev Loss" },
  { id: "time", label: "Time" },
  { id: "pace", label: "Pace" },
  { id: "speed", label: "Speed" },
  { id: "heartRate", label: "Heart Rate" },
  { id: "cadence", label: "Cadence" },
  { id: "power", label: "Power" },
];

export const EditorScreen = ({ route, points, onReset }: EditorScreenProps) => {
  const posterRef = useRef<PosterHandle>(null);
  const [activityType, setActivityType] = useState<Route["activityType"]>(route.activityType || "run");
  const [isExporting, setIsExporting] = useState(false);

  const isMetricAvailable = useCallback((metricId: MetricType) => {
    switch (metricId) {
      case "distance": return route.distance > 0;
      case "elevation": return route.elevationGain > 0;
      case "elevationLoss": return route.elevationLoss > 0;
      case "time": return (route.movingTime || 0) > 0;
      case "pace":
      case "speed": return (route.averageSpeed || 0) > 0;
      case "heartRate": return route.avgHeartRate !== undefined;
      case "cadence": return route.avgCadence !== undefined;
      case "power": return route.avgPower !== undefined;
      default: return false;
    }
  }, [route]);

  const initialMetrics = useMemo(() => {
    const defaults: MetricType[] = ["distance", "elevation", "time", "pace"];
    return defaults.filter(isMetricAvailable).slice(0, 4);
  }, [isMetricAvailable]);

  const [settings, setSettings] = useState<PosterSettings>({
    title: route.name,
    subtext: route.date || "Unknown Date",
    theme: "zinc",
    isDark: false,
    strokeWidth: 2,
    padding: 0.15,
    backgroundColor: "#fafafa",
    strokeColor: "#18181b",
    metrics: initialMetrics,
    smoothing: 1,
  });

  const displayedPoints = useMemo(() => {
    if (settings.smoothing <= 1) return points;
    const smoothed = smoothPoints(route.points, settings.smoothing * 2);
    return normalizePoints(smoothed, route.boundingBox);
  }, [route.points, route.boundingBox, settings.smoothing, points]);

  const handleDownload = async () => {
    const node = posterRef.current?.getContainer();
    if (!node) return;

    setIsExporting(true);

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        cacheBust: true,
      });
      
      const link = document.createElement("a");
      const fileName = `${settings.title.toLowerCase().replace(/\s+/g, "-")}-poster.png`;
      
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
      alert("Failed to export the image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const selectPalette = (palette: PaletteType, isPaletteDark: boolean) => {
    setSettings({
      ...settings,
      theme: palette.id,
      isDark: isPaletteDark,
      backgroundColor: palette.bg,
      strokeColor: palette.stroke,
    });
  };

  const toggleMetric = (metricId: MetricType) => {
    setSettings((prev) => {
      const isSelected = prev.metrics.includes(metricId);
      if (isSelected) {
        return { ...prev, metrics: prev.metrics.filter((m) => m !== metricId) };
      }
      if (prev.metrics.length >= 4) return prev;
      return { ...prev, metrics: [...prev.metrics, metricId] };
    });
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-zinc-50 dark:bg-zinc-950 lg:flex-row">
      <aside className="w-full border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black lg:max-w-md lg:overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2 px-0 hover:bg-transparent" onClick={onReset}>
            <ArrowLeft size={16} />
            Back to Home
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={isExporting} className="gap-2">
              <Download size={16} />
              {isExporting ? "Exporting..." : "Export"}
            </Button>
          </div>
        </div>

        <div className="space-y-8 pb-10">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Type size={14} />
              Typography
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Activity Title</label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Subtext (Date)</label>
                <input
                  type="text"
                  value={settings.subtext}
                  onChange={(e) => setSettings({ ...settings, subtext: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Activity size={14} />
              Activity Type
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "run", icon: Footprints, label: "Run" },
                { id: "ride", icon: Bike, label: "Ride" },
                { id: "hike", icon: Mountain, label: "Hike" },
                { id: "other", icon: Activity, label: "Other" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivityType(item.id as Route["activityType"])}
                  className={`flex flex-col items-center justify-center gap-2 rounded-lg py-3 transition-all border ${
                    activityType === item.id 
                      ? "bg-zinc-950 text-white border-zinc-950 dark:bg-zinc-50 dark:text-black dark:border-zinc-50" 
                      : "bg-zinc-50 text-zinc-500 border-zinc-100 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
                <BarChart3 size={14} />
                Metrics
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {settings.metrics.length}/4 Selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_METRICS.filter(m => isMetricAvailable(m.id)).map((metric) => {
                const isSelected = settings.metrics.includes(metric.id);
                const isMaxed = settings.metrics.length >= 4 && !isSelected;
                return (
                  <button
                    key={metric.id}
                    onClick={() => toggleMetric(metric.id)}
                    disabled={isMaxed}
                    className={`rounded-full border px-4 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-zinc-950 border-zinc-950 text-white dark:bg-zinc-50 dark:border-zinc-50 dark:text-black"
                        : isMaxed
                          ? "opacity-30 cursor-not-allowed border-zinc-100 dark:border-zinc-900"
                          : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    {metric.label}
                  </button>
                );
              })}
            </div>
          </div>

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

          <div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
              <Sliders size={14} />
              Style
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Inner Canvas Style</label>
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
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wand2 size={14} className="text-zinc-400" />
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Path Smoothing</label>
                  </div>
                  <span className="text-xs font-bold text-zinc-500">{settings.smoothing === 1 ? "None" : `${settings.smoothing}`}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={settings.smoothing}
                  onChange={(e) => setSettings({ ...settings, smoothing: parseInt(e.target.value) })}
                  className="w-full accent-zinc-950 dark:accent-zinc-50"
                />
                <p className="text-[10px] text-zinc-400 leading-tight">
                  Reduces GPS jitter and noise. Higher values result in more rounded curves but may deviate from the exact path.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Line Weight</label>
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
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Padding</label>
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

      <main className="flex flex-1 items-center justify-center p-8 lg:p-12 overflow-hidden">
        <div className="w-full max-w-[500px] transition-transform duration-300">
          <Poster
            ref={posterRef}
            points={displayedPoints}
            title={settings.title}
            subtext={settings.subtext}
            theme={settings.theme}
            isDark={settings.isDark}
            strokeWidth={settings.strokeWidth}
            padding={settings.padding}
            metrics={settings.metrics}
            distance={route.distance}
            elevationGain={route.elevationGain}
            elevationLoss={route.elevationLoss}
            movingTime={route.movingTime}
            averageSpeed={route.averageSpeed}
            avgHeartRate={route.avgHeartRate}
            avgCadence={route.avgCadence}
            avgPower={route.avgPower}
            activityType={activityType}
            backgroundColor={settings.backgroundColor}
            strokeColor={settings.strokeColor}
          />
        </div>
      </main>
    </div>
  );
};
