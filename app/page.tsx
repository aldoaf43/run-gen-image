"use client";

import React, { useState } from "react";
import { HomeScreen } from "@/containers/HomeScreen";
import { EditorScreen } from "@/containers/EditorScreen";
import { Route, NormalizedPoint } from "@/types";

export default function Home() {
  const [route, setRoute] = useState<Route | null>(null);
  const [points, setPoints] = useState<NormalizedPoint[]>([]);

  const handleFileUpload = (route: Route, points: NormalizedPoint[]) => {
    setRoute(route);
    setPoints(points);
  };

  const handleReset = () => {
    setRoute(null);
    setPoints([]);
  };

  if (route && points.length > 0) {
    return <EditorScreen route={route} points={points} onReset={handleReset} />;
  }

  return <HomeScreen onUpload={handleFileUpload} />;
}
