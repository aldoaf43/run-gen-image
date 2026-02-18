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
  maxElevation?: number;
  minElevation?: number;
  movingTime?: number; // In seconds
  averageSpeed?: number; // In m/s
  boundingBox: BoundingBox;
}

/**
 * Normalized coordinates for rendering (0.0 to 1.0).
 */
export interface NormalizedPoint {
  x: number;
  y: number;
}

/**
 * Customizable settings for the poster rendering.
 */
export interface PosterSettings {
  title: string;
  subtext: string;
  theme: string;
  isDark: boolean;
  strokeWidth: number;
  padding: number;
  backgroundColor: string;
  strokeColor: string;
}
