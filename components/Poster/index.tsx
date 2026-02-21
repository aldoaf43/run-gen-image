"use client";

import React, { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { NormalizedPoint, Route } from "@/types";
import { CanvasEngine } from "@/lib/canvas-engine";
import { Footprints, Bike, Mountain, Activity } from "lucide-react";

interface PosterProps {
  points: NormalizedPoint[];
  title?: string;
  subtext?: string;
  className?: string;
  theme?: string;
  isDark?: boolean;
  strokeWidth?: number;
  padding?: number;
  backgroundColor?: string;
  strokeColor?: string;
  // Stats
  distance?: number;
  elevationGain?: number;
  movingTime?: number;
  averageSpeed?: number;
  activityType?: Route["activityType"];
}

export interface PosterHandle {
  getContainer: () => HTMLDivElement | null;
}

/**
 * High-performance Canvas component for rendering activity posters.
 * Uses Canvas for the route and HTML for high-fidelity typography.
 */
export const Poster = React.memo(forwardRef<PosterHandle, PosterProps>(({
  points,
  title = "My Activity",
  subtext = "42.2 KM",
  className = "",
  theme = "light",
  isDark = false,
  strokeWidth = 2,
  padding = 0.15,
  backgroundColor,
  strokeColor,
  distance,
  elevationGain,
  movingTime,
  averageSpeed,
  activityType = "run",
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expose the container to the parent for exporting (captures HTML + Canvas)
  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
  }));

  // Derived styling based on theme
  const colors = useMemo(() => {
    if (theme === "dark") return { bg: "#000000", line: "#ffffff", text: "#ffffff" };
    if (theme === "light") return { bg: "#ffffff", line: "#000000", text: "#000000" };
    
    // Custom & Predefined Palettes
    const bg = backgroundColor || "#ffffff";
    const line = strokeColor || "#000000";
    return { bg, line, text: line };
  }, [theme, backgroundColor, strokeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      CanvasEngine.clear(ctx, rect.width, rect.height);
      
      // Draw Background
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Draw Route
      CanvasEngine.drawRoute(ctx, points, {
        color: colors.line,
        lineWidth: strokeWidth,
        padding: padding,
        isDark: isDark,
        width: rect.width,
        height: rect.height,
      });
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [points, colors, strokeWidth, padding, isDark]);

  // Stat Formatting Helpers
  const formatTime = (seconds?: number) => {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0 
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatPace = (mPerS?: number) => {
    if (!mPerS || mPerS <= 0) return "0:00";
    const secondsPerKm = 1000 / mPerS;
    const m = Math.floor(secondsPerKm / 60);
    const s = Math.floor(secondsPerKm % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Icon Resolver
  const ActivityIcon = useMemo(() => {
    switch (activityType) {
      case "run": return Footprints;
      case "ride": return Bike;
      case "hike": return Mountain;
      default: return Activity;
    }
  }, [activityType]);

  return (
    <div 
      ref={containerRef}
      className={`relative aspect-[2/3] w-full overflow-hidden rounded shadow-xl @container ${className}`}
      style={{ backgroundColor: colors.bg }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />
      
      {/* HTML Overlay for Typography */}
      <div 
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-[8cqw] pt-[2cqw]"
        style={{ color: colors.text }}
      >
        {/* Stats Grid */}
        {distance !== undefined && (
          <div className="mb-[6cqw] grid w-full grid-cols-4 px-[8cqw] text-center">
            <div className="flex flex-col">
              <span className="text-[2cqw] font-bold opacity-50 uppercase tracking-widest">DISTANCE</span>
              <span className="text-[2.8cqw] font-bold">{(distance / 1000).toFixed(1)} KM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2cqw] font-bold opacity-50 uppercase tracking-widest">ELEVATION</span>
              <span className="text-[2.8cqw] font-bold">{Math.round(elevationGain || 0)} M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2cqw] font-bold opacity-50 uppercase tracking-widest">TIME</span>
              <span className="text-[2.8cqw] font-bold">{formatTime(movingTime)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[2cqw] font-bold opacity-50 uppercase tracking-widest">AVG PACE</span>
              <span className="text-[2.8cqw] font-bold">{formatPace(averageSpeed)} /KM</span>
            </div>
          </div>
        )}

        {/* Labels */}
        <div className="flex items-center gap-[2cqw]">
          <ActivityIcon size={32} strokeWidth={2.5} className="h-[5cqw] w-[5cqw] opacity-80" />
          <h1 className="text-[5cqw] font-black tracking-tighter uppercase leading-none">
            {title}
          </h1>
        </div>
        <p className="mt-[1cqw] text-[2.2cqw] font-bold opacity-60 uppercase tracking-[0.2em]">
          {subtext}
        </p>
      </div>
    </div>
  );
}));

Poster.displayName = "Poster";
