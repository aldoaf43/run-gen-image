import React, { useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { NormalizedPoint, Route, MetricType } from "@/types";
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
  metrics?: MetricType[];
  // Stats
  distance?: number;
  elevationGain?: number;
  elevationLoss?: number;
  movingTime?: number;
  averageSpeed?: number;
  activityType?: Route["activityType"];
  avgHeartRate?: number;
  avgCadence?: number;
  avgPower?: number;
}

export interface PosterHandle {
  getContainer: () => HTMLDivElement | null;
}

export const Poster = React.memo(forwardRef<PosterHandle, PosterProps>(({
  points,
  title = "My Activity",
  subtext = "42.2 KM",
  className = "",
  theme = "zinc",
  isDark = false,
  strokeWidth = 2,
  padding = 0.15,
  backgroundColor,
  strokeColor,
  metrics = ["distance", "elevation", "time", "pace"],
  distance,
  elevationGain,
  elevationLoss,
  movingTime,
  averageSpeed,
  activityType = "run",
  avgHeartRate,
  avgCadence,
  avgPower,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
  }));

  const colors = useMemo(() => {
    if (theme === "dark") return { bg: "#000000", line: "#ffffff", text: "#ffffff" };
    if (theme === "light") return { bg: "#ffffff", line: "#000000", text: "#000000" };
    
    return { 
      bg: backgroundColor || "#ffffff", 
      line: strokeColor || "#000000", 
      text: strokeColor || "#000000" 
    };
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
      
      ctx.fillStyle = colors.bg;
      ctx.fillRect(0, 0, rect.width, rect.height);

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

  const ActivityIcon = useMemo(() => {
    switch (activityType) {
      case "run": return Footprints;
      case "ride": return Bike;
      case "hike": return Mountain;
      default: return Activity;
    }
  }, [activityType]);

  const renderedMetrics = useMemo(() => {
    return metrics.map(type => {
      switch (type) {
        case "distance":
          return { label: "DISTANCE", value: `${((distance || 0) / 1000).toFixed(1)} KM` };
        case "elevation":
          return { label: "ELEV GAIN", value: `${Math.round(elevationGain || 0)} M` };
        case "elevationLoss":
          return { label: "ELEV LOSS", value: `${Math.round(elevationLoss || 0)} M` };
        case "time":
          return { label: "TIME", value: formatTime(movingTime) };
        case "pace":
          return { label: "AVG PACE", value: `${formatPace(averageSpeed)} /KM` };
        case "speed":
          return { label: "AVG SPEED", value: `${((averageSpeed || 0) * 3.6).toFixed(1)} KM/H` };
        case "heartRate":
          return avgHeartRate ? { label: "AVG HR", value: `${avgHeartRate} BPM` } : null;
        case "cadence":
          return avgCadence ? { label: "AVG CAD", value: `${avgCadence} ${activityType === 'ride' ? 'RPM' : 'SPM'}` } : null;
        case "power":
          return avgPower ? { label: "AVG PWR", value: `${avgPower} W` } : null;
        default:
          return null;
      }
    }).filter(Boolean);
  }, [metrics, distance, elevationGain, elevationLoss, movingTime, averageSpeed, avgHeartRate, avgCadence, avgPower, activityType]);

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
      
      <div 
        className="absolute inset-x-0 bottom-0 flex flex-col items-center pb-[8cqw] pt-[2cqw]"
        style={{ color: colors.text }}
      >
        {renderedMetrics.length > 0 && (
          <div 
            className={`mb-[6cqw] grid w-full gap-[2cqw] px-[8cqw] text-center`}
            style={{ 
              gridTemplateColumns: `repeat(${renderedMetrics.length}, minmax(0, 1fr))` 
            }}
          >
            {renderedMetrics.map((m, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[2cqw] font-bold opacity-50 uppercase tracking-widest">{m?.label}</span>
                <span className="text-[2.8cqw] font-bold">{m?.value}</span>
              </div>
            ))}
          </div>
        )}

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
