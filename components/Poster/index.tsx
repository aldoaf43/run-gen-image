"use client";

import React, { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { NormalizedPoint } from "@/types";
import { CanvasEngine } from "@/lib/canvas-engine";

interface PosterProps {
  points: NormalizedPoint[];
  title?: string;
  subtext?: string;
  className?: string;
  theme?: "light" | "dark" | "custom";
  strokeWidth?: number;
  padding?: number;
  backgroundColor?: string;
  strokeColor?: string;
  // Stats
  distance?: number;
  elevationGain?: number;
  movingTime?: number;
  averageSpeed?: number;
}

export interface PosterHandle {
  getCanvas: () => HTMLCanvasElement | null;
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
  theme = "dark",
  strokeWidth = 2,
  padding = 0.15,
  backgroundColor,
  strokeColor,
  distance,
  elevationGain,
  movingTime,
  averageSpeed,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Expose the canvas to the parent for exporting
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }));

  // Derived styling based on theme
  const colors = useMemo(() => {
    if (theme === "dark") return { bg: "#000000", line: "#ffffff", text: "#ffffff" };
    if (theme === "light") return { bg: "#ffffff", line: "#000000", text: "#000000" };
    const line = strokeColor || "#000000";
    return { bg: backgroundColor || "#ffffff", line, text: line };
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
        isDark: theme === "dark",
        width: rect.width,
        height: rect.height,
      });
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [points, colors, strokeWidth, padding, theme]);

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

  return (
    <div 
      className={`relative aspect-[2/3] w-full overflow-hidden rounded shadow-xl ${className}`}
      style={{ backgroundColor: colors.bg }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ width: "100%", height: "100%" }}
      />
      
      {/* HTML Overlay for Typography */}
      <div 
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-[8%] pt-4"
        style={{ color: colors.text }}
      >
        {/* Stats Grid */}
        {distance !== undefined && (
          <div className="mb-6 grid w-full grid-cols-4 px-8 text-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold opacity-50">DISTANCE</span>
              <span className="text-xs font-bold">{(distance / 1000).toFixed(1)} KM</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold opacity-50">ELEVATION</span>
              <span className="text-xs font-bold">{Math.round(elevationGain || 0)} M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold opacity-50">TIME</span>
              <span className="text-xs font-bold">{formatTime(movingTime)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold opacity-50">AVG PACE</span>
              <span className="text-xs font-bold">{formatPace(averageSpeed)} /KM</span>
            </div>
          </div>
        )}

        {/* Labels */}
        <h1 className="text-lg font-black tracking-tighter uppercase leading-none">
          {title}
        </h1>
        <p className="mt-1 text-xs font-medium opacity-60 uppercase tracking-widest">
          {subtext}
        </p>
      </div>
    </div>
  );
}));

Poster.displayName = "Poster";
