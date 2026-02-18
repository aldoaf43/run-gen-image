import GpxParser from "gpxparser";
import type { Route, Point, BoundingBox, NormalizedPoint } from "@/types";

/**
 * Calculates the geographic bounding box of a set of GPS points.
 */
export const calculateBoundingBox = (points: Point[]): BoundingBox => {
  if (points.length === 0) {
    return { minLat: 0, maxLat: 0, minLon: 0, maxLon: 0 };
  }

  let minLat = points[0].lat;
  let maxLat = points[0].lat;
  let minLon = points[0].lon;
  let maxLon = points[0].lon;

  for (const point of points) {
    if (point.lat < minLat) minLat = point.lat;
    if (point.lat > maxLat) maxLat = point.lat;
    if (point.lon < minLon) minLon = point.lon;
    if (point.lon > maxLon) maxLon = point.lon;
  }

  return { minLat, maxLat, minLon, maxLon };
};

/**
 * Normalizes a set of GPS points into a 0.0 to 1.0 coordinate system.
 * Maintains aspect ratio and flips the Y-axis so North is "Up".
 */
export const normalizePoints = (points: Point[], boundingBox: BoundingBox): NormalizedPoint[] => {
  const { minLat, maxLat, minLon, maxLon } = boundingBox;
  
  const deltaLat = maxLat - minLat;
  const deltaLon = maxLon - minLon;
  
  // Use the larger dimension to scale both axes, maintaining aspect ratio.
  const maxDelta = Math.max(deltaLat, deltaLon);
  
  // Calculate offsets to center the route if it's not a perfect square.
  const offsetX = (maxDelta - deltaLon) / 2;
  const offsetY = (maxDelta - deltaLat) / 2;

  return points.map((p) => ({
    // X axis: (Lon - MinLon + Offset) / Scale
    x: maxDelta === 0 ? 0.5 : (p.lon - minLon + offsetX) / maxDelta,
    // Y axis: 1 - ((Lat - MinLat + Offset) / Scale) -> Flips axis for Canvas
    y: maxDelta === 0 ? 0.5 : 1 - (p.lat - minLat + offsetY) / maxDelta,
  }));
};

/**
 * Parses a raw GPX XML string into a structured Route object.
 */
export const parseGPX = (xml: string): Route => {
  const gpx = new GpxParser();
  gpx.parse(xml);

  // Extract points from the first track (most GPX files have one primary track)
  const track = gpx.tracks[0];
  
  if (!track || track.points.length === 0) {
    throw new Error("No track data found in GPX file.");
  }

  const points: Point[] = track.points.map((p) => ({
    lat: p.lat,
    lon: p.lon,
    elevation: p.ele,
    time: p.time ? p.time.toISOString() : undefined,
  }));

  const boundingBox = calculateBoundingBox(points);

  // Extract date from metadata or first point
  const date = gpx.metadata.time 
    ? new Date(gpx.metadata.time).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : points[0]?.time 
      ? new Date(points[0].time).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
      : undefined;

  // Calculate moving time (total duration for now, assuming activity is continuous)
  let movingTime = 0;
  if (points.length > 1 && points[0].time && points[points.length - 1].time) {
    const start = new Date(points[0].time).getTime();
    const end = new Date(points[points.length - 1].time).getTime();
    movingTime = (end - start) / 1000; // in seconds
  }

  const distance = track.distance.total || 0;
  const averageSpeed = movingTime > 0 ? distance / movingTime : 0;

  // Calculate Min/Max Elevation
  const elevations = points.map(p => p.elevation).filter((e): e is number => e !== undefined);
  const minElevation = elevations.length > 0 ? Math.min(...elevations) : undefined;
  const maxElevation = elevations.length > 0 ? Math.max(...elevations) : undefined;

  return {
    name: track.name || "Untitled Activity",
    date,
    points,
    distance,
    elevationGain: track.elevation.pos || 0,
    minElevation,
    maxElevation,
    movingTime,
    averageSpeed,
    boundingBox,
  };
};

/**
 * Reads a File object and parses it as a GPX route.
 */
export const parseGPXFromFile = async (file: File): Promise<Route> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const xml = event.target?.result as string;
      try {
        const route = parseGPX(xml);
        resolve(route);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read the file."));
    };

    reader.readAsText(file);
  });
};
