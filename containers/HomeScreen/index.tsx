import React from "react";
import { Button } from "@/components/Button";
import { Upload, ArrowRight, MapPin, Layers, Download } from "lucide-react";

export const HomeScreen = () => {
  return (
    <div className="flex flex-col">
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
              <div className="flex flex-col gap-4 w-full sm:flex-row sm:w-auto">
                <Button size="lg" className="gap-2">
                  <Upload size={20} strokeWidth={2.5} />
                  Upload GPX
                </Button>
                <Button variant="outline" size="lg" className="gap-2">
                  View Examples
                  <ArrowRight size={20} />
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                {/* Placeholder for the main hero image (a poster example) */}
                <div className="flex h-full w-full flex-col items-center justify-center p-12 text-center">
                  <div className="mb-8 h-4/5 w-full border border-zinc-300 dark:border-zinc-700 rounded-sm bg-white dark:bg-black p-8 shadow-sm">
                    {/* SVG placeholder for a GPS route */}
                    <svg viewBox="0 0 100 100" className="h-full w-full text-zinc-950 dark:text-white opacity-20">
                      <path 
                        d="M10,90 Q30,10 50,50 T90,10" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="mt-auto space-y-1">
                    <p className="text-sm font-bold tracking-widest uppercase">Paris Marathon 2024</p>
                    <p className="text-xs text-zinc-500">42.2 KM • 2:54:12</p>
                  </div>
                </div>
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
