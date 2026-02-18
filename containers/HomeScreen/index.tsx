"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/Button";
import { Upload, ArrowRight, MapPin, Layers, Download, AlertCircle } from "lucide-react";
import { parseGPXFromFile, normalizePoints } from "@/lib/gpx-utils";
import { Poster } from "@/components/Poster";
import { NormalizedPoint, Route } from "@/types";

interface HomeScreenProps {
  onUpload: (route: Route, points: NormalizedPoint[]) => void;
}

export const HomeScreen = ({ onUpload }: HomeScreenProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const parsedRoute = await parseGPXFromFile(file);
      const normalized = normalizePoints(parsedRoute.points, parsedRoute.boundingBox);

      // Notify parent to switch to editor
      onUpload(parsedRoute, normalized);
    } catch (err) {
      console.error("Error parsing GPX:", err);
      setError("Failed to parse GPX file. Please ensure it's a valid track.");
    } finally {
      setIsProcessing(false);
      if (event.target) event.target.value = "";
    }
  };

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
      <section className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-24 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400">
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                Now in Beta
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-6xl dark:text-zinc-50">
                Turn Your Activities <br />
                <span className="text-zinc-500 dark:text-zinc-400">into Minimalist Art.</span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                Beautifully render your GPX files from Strava, Garmin, or Wahoo into stunning, minimalist posters. 
                Perfect for your home or as a gift for fellow athletes.
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
                  <Button variant="outline" size="lg" className="gap-2">
                    View Examples
                    <ArrowRight size={20} />
                  </Button>
                </div>
                
                {error && (
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="mx-auto w-full max-w-[400px]">
                <Poster 
                  points={[
                    { x: 0.1, y: 0.9 },
                    { x: 0.3, y: 0.1 },
                    { x: 0.5, y: 0.5 },
                    { x: 0.9, y: 0.1 }
                  ]}
                  title="Paris Marathon 2024"
                  subtext="42.2 KM • April 14, 2024"
                  theme="light"
                  strokeWidth={2}
                />
              </div>
              
              {/* Floating badges for flavor */}
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 sm:block">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-zinc-100 p-2 dark:bg-zinc-900">
                    <Download className="h-5 w-5 text-zinc-950 dark:text-zinc-50" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">4K Export</p>
                    <p className="text-xs text-zinc-500">Ready for print</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-zinc-50 py-24 dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Designed for Athletes & Aesthetics.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <MapPin className="h-6 w-6" />,
                title: "Automatic Scaling",
                description: "Upload any GPX file and we'll automatically scale and center your route perfectly on the canvas."
              },
              {
                icon: <Layers className="h-6 w-6" />,
                title: "Fully Customizable",
                description: "Choose your theme, adjust line weights, add elevation profiles, and customize the typography."
              },
              {
                icon: <Download className="h-6 w-6" />,
                title: "Print Quality",
                description: "Export your designs in high-resolution PDF or PNG formats, ready for professional printing."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-8 transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-950">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
