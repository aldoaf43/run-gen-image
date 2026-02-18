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
}

export interface PosterHandle {
  getCanvas: () => HTMLCanvasElement | null;
}

/**
 * High-performance Canvas component for rendering activity posters.
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
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Expose the canvas to the parent for exporting
  useImperativeHandle(ref, () => ({
    getCanvas: () => canvasRef.current,
  }));

  // Derived styling based on theme
  const colors = useMemo(() => {
    if (theme === "dark") return { bg: "#000000", line: "#ffffff" };
    if (theme === "light") return { bg: "#ffffff", line: "#000000" };
    return { bg: backgroundColor || "#ffffff", line: strokeColor || "#000000" };
  }, [theme, backgroundColor, strokeColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle Retina / High-DPI Scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set actual pixel dimensions based on the display size and DPR
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    // Scale all subsequent drawing operations
    ctx.scale(dpr, dpr);

    // Initial clear & render
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

      // Draw Labels
      CanvasEngine.drawText(ctx, title, subtext, colors.line, rect.width, rect.height);
    };

    // Use requestAnimationFrame for smooth, browser-synced rendering
    const animationId = requestAnimationFrame(render);
    
    return () => cancelAnimationFrame(animationId);
  }, [points, title, subtext, colors, strokeWidth, padding]);

  return (
    <div className={`relative aspect-[2/3] w-full overflow-hidden rounded shadow-xl ${className}`}>
      <canvas
        ref={canvasRef}
        className="h-full w-full touch-none"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}));

Poster.displayName = "Poster";
