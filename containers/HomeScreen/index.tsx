"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/Button";
import {
  Upload,
  ArrowRight,
  MapPin,
  Layers,
  Download,
  AlertCircle,
} from "lucide-react";
import { parseGPXFromFile, normalizePoints } from "@/lib/gpx-utils";
import { Poster } from "@/components/Poster";
import { NormalizedPoint, Route, PALETTES, Palette } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface HomeScreenProps {
  onUpload: (route: Route, points: NormalizedPoint[]) => void;
}

const MOCK_ROUTES = [
  {
    id: "marathon",
    title: "Berlin Marathon",
    subtext: "September 29, 2024 • 09:00 AM",
    points: [
      { x: 0.1, y: 0.8 },
      { x: 0.15, y: 0.75 },
      { x: 0.2, y: 0.85 },
      { x: 0.3, y: 0.7 },
      { x: 0.4, y: 0.75 },
      { x: 0.45, y: 0.6 },
      { x: 0.5, y: 0.65 },
      { x: 0.6, y: 0.5 },
      { x: 0.7, y: 0.55 },
      { x: 0.75, y: 0.4 },
      { x: 0.8, y: 0.45 },
      { x: 0.9, y: 0.3 },
    ],
    activityType: "run" as const,
  },
  {
    id: "trail",
    title: "Alpine Ridge",
    subtext: "July 12, 2024 • 10:30 AM",
    points: [
      { x: 0.2, y: 0.9 },
      { x: 0.25, y: 0.8 },
      { x: 0.35, y: 0.85 },
      { x: 0.3, y: 0.7 },
      { x: 0.4, y: 0.6 },
      { x: 0.5, y: 0.75 },
      { x: 0.6, y: 0.65 },
      { x: 0.7, y: 0.8 },
      { x: 0.8, y: 0.7 },
      { x: 0.75, y: 0.5 },
      { x: 0.85, y: 0.4 },
      { x: 0.7, y: 0.3 },
    ],
    activityType: "hike" as const,
  },
  {
    id: "ride",
    title: "Coastal Loop",
    subtext: "May 05, 2024 • 04:15 PM",
    points: [
      { x: 0.5, y: 0.9 },
      { x: 0.3, y: 0.8 },
      { x: 0.2, y: 0.6 },
      { x: 0.3, y: 0.4 },
      { x: 0.5, y: 0.3 },
      { x: 0.7, y: 0.4 },
      { x: 0.8, y: 0.6 },
      { x: 0.7, y: 0.8 },
      { x: 0.5, y: 0.9 },
    ],
    activityType: "ride" as const,
  },
];

export const HomeScreen = ({ onUpload }: HomeScreenProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Morphing State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activePalette, setActivePalette] = useState<Palette>(PALETTES[0]);
  const [morphCount, setMorphCount] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const MAX_MORPHS = 12;

  useEffect(() => {
    // Only run the timer if we haven't reached the limit AND the hero is visible
    if (morphCount >= MAX_MORPHS || !isHeroVisible) return;

    const timer = setInterval(() => {
      setMorphCount((prev) => prev + 1);
      setCurrentIndex((prev) => (prev + 1) % MOCK_ROUTES.length);
      
      // Randomly pick a palette from the centralized list
      const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      setActivePalette(randomPalette);
    }, 4000);

    return () => clearInterval(timer);
  }, [morphCount, isHeroVisible]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const parsedRoute = await parseGPXFromFile(file);
      const normalized = normalizePoints(
        parsedRoute.points,
        parsedRoute.boundingBox,
      );
      onUpload(parsedRoute, normalized);
    } catch (err) {
      console.error("Error parsing GPX:", err);
      setError("Failed to parse GPX file. Please ensure it's a valid track.");
    } finally {
      setIsProcessing(false);
      if (event.target) event.target.value = "";
    }
  };

  const currentMock = MOCK_ROUTES[currentIndex];

  return (
    <div className="flex flex-col">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".gpx"
        className="hidden"
      />

      {/* Hero Section */}
      <motion.section 
        onViewportEnter={() => setIsHeroVisible(true)}
        onViewportLeave={() => setIsHeroVisible(false)}
        viewport={{ amount: 0.2 }} // Trigger when 20% of hero is visible
        className="relative overflow-hidden py-10 lg:py-25"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-start gap-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                Now in Beta
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
                Turn Your Activities <br />
                <span className="text-zinc-500 dark:text-zinc-400">
                  into Minimalist Art.
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Beautifully render your GPX files from Strava, Garmin, or Wahoo
                into stunning, minimalist posters. Perfect for your home or as a
                gift for fellow athletes.
              </p>

              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-4 sm:flex-row sm:w-auto">
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={handleUploadClick}
                    isLoading={isProcessing}
                  >
                    <Upload size={20} strokeWidth={2.5} />
                    Upload GPX
                  </Button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </div>
            </motion.div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[380px] aspect-[2/3]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentMock.id}-${activePalette.id}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05, y: -10 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="h-full w-full"
                  >
                    <Poster
                      points={currentMock.points}
                      title={currentMock.title}
                      subtext={currentMock.subtext}
                      theme={activePalette.id}
                      backgroundColor={activePalette.bg}
                      strokeColor={activePalette.stroke}
                      isDark={activePalette.isDark}
                      activityType={currentMock.activityType}
                      strokeWidth={2}
                      className="shadow-2xl"
                    />
                    <div className="absolute -right-4 top-0 -translate-y-1/2 hidden lg:block">
                      <div className="rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-xs font-bold backdrop-blur-md dark:border-zinc-700 dark:bg-black/80">
                        Theme: {activePalette.name}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="bg-zinc-50 pb-20 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Designed for Athletes & Aesthetics.
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Automatic Scaling",
                description:
                  "Upload any GPX file and we'll automatically scale and center your route perfectly on the canvas.",
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Fully Customizable",
                description:
                  "Choose your theme, adjust line weights, add elevation profiles, and customize the typography.",
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: "Print Quality",
                description:
                  "Export your designs in high-resolution PDF or PNG formats, ready for professional printing.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
