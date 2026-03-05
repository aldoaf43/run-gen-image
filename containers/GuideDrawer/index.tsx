"use client";

import React, { useState } from "react";
import { Drawer } from "@/components/Drawer";
import { ChevronRight, Globe, Smartphone, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const APPS = [
  {
    id: "strava",
    name: "Strava",
    icon: "🧡",
    description: "The most popular platform for athletes.",
    methods: [
      {
        type: "web",
        label: "Desktop Web",
        steps: [
          "Log in to Strava.com on your computer.",
          "Open the activity you want to export.",
          "Click the '...' (More) button on the left sidebar.",
          "Select 'Export GPX'.",
        ],
        link: "https://www.strava.com/athlete/training",
      },
      {
        type: "mobile",
        label: "Mobile App",
        steps: [
          "Open the activity in the Strava app.",
          "Tap the 'Share' icon.",
          "Note: Strava mobile app doesn't support direct GPX export. Use the Web method instead.",
        ],
      },
    ],
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    icon: "💙",
    description: "Export from your Garmin watch or cycle computer.",
    methods: [
      {
        type: "web",
        label: "Garmin Connect Web",
        steps: [
          "Go to connect.garmin.com.",
          "Navigate to 'Activities' > 'All Activities'.",
          "Click on the specific activity.",
          "Click the gear icon (top right) and select 'Export to GPX'.",
        ],
        link: "https://connect.garmin.com/modern/activities",
      },
    ],
  },
  {
    id: "wahoo",
    name: "Wahoo",
    icon: "🖤",
    description: "Export from ELEMNT or Rival devices.",
    methods: [
      {
        type: "mobile",
        label: "ELEMNT App",
        steps: [
          "Open the ELEMNT companion app.",
          "Go to 'History' and select your workout.",
          "Tap the 'Share' icon in the top right.",
          "Select 'GPX' and save to your files.",
        ],
      },
    ],
  },
];

export const GuideDrawer = ({ isOpen, onClose }: GuideDrawerProps) => {
  const [selectedApp, setSelectedApp] = useState<string | null>(null);

  // Reset selection when drawer closes
  React.useEffect(() => {
    if (!isOpen) {
      // Small delay to allow exit animation to finish before resetting state
      const timer = setTimeout(() => setSelectedApp(null), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const activeApp = APPS.find((app) => app.id === selectedApp);

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="How to get GPX">
      <div className="flex flex-col gap-4">
        <AnimatePresence mode="wait">
          {!selectedApp ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid gap-3"
            >
              <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                Choose your tracking platform to see specific instructions.
              </p>
              {APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedApp(app.id)}
                  className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-white p-4 text-left transition-all hover:border-zinc-900 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-50"
                >
                  <span className="text-2xl">{app.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-zinc-950 dark:text-zinc-50">
                      {app.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {app.description}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-zinc-400" />
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col gap-6"
            >
              <button
                onClick={() => setSelectedApp(null)}
                className="text-left text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50"
              >
                ← Back to apps
              </button>

              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeApp?.icon}</span>
                <h3 className="text-2xl font-bold">{activeApp?.name}</h3>
              </div>

              {activeApp?.methods.map((method, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-zinc-50 p-5 dark:bg-zinc-900/50"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-zinc-400 text-[10px]">
                      {method.type === "web" ? (
                        <Globe size={12} />
                      ) : (
                        <Smartphone size={12} />
                      )}
                      {method.label}
                    </div>
                    {method.link && (
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Open Website <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {method.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-zinc-400 shadow-sm dark:bg-zinc-800">
                          {i + 1}
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Drawer>
  );
};
