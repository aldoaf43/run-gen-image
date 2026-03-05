/**
 * Represents a single GPS coordinate point.
 */
export interface Point {
  lat: number;
  lon: number;
  elevation?: number;
  time?: string;
}

/**
 * Represents the geographic boundaries of a route.
 */
export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
}

/**
 * Represents a parsed GPX route with metadata.
 */
export interface Route {
  name: string;
  date?: string;
  points: Point[];
  distance: number; // In meters
  elevationGain: number; // In meters
  elevationLoss: number; // In meters
  maxElevation?: number;
  minElevation?: number;
  movingTime?: number; // In seconds
  averageSpeed?: number; // In m/s
  boundingBox: BoundingBox;
  activityType?: "run" | "ride" | "hike" | "other";
  // Sensor Data
  avgHeartRate?: number;
  avgCadence?: number;
  avgPower?: number;
}

/**
 * Normalized coordinates for rendering (0.0 to 1.0).
 */
export interface NormalizedPoint {
  x: number;
  y: number;
}

export type MetricType = 
  | "distance" 
  | "elevation" 
  | "elevationLoss" 
  | "time" 
  | "pace" 
  | "speed" 
  | "heartRate" 
  | "cadence" 
  | "power";
