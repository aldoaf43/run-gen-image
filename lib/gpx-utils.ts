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

  // Extract date and time from metadata or first point
  const startTime = gpx.metadata.time || points[0]?.time;
  const date = startTime 
    ? new Date(startTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) + 
      " • " + 
      new Date(startTime).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : undefined;

  // Calculate moving time (total duration for now, assuming activity is continuous)
  let movingTime = 0;
  if (points.length > 1 && points[0].time && points[points.length - 1].time) {
    const start = new Date(points[0].time).getTime();
    const end = new Date(points[points.length - 1].time).getTime();
    movingTime = (end - start) / 1000; // in seconds
  }

  const distance = track.distance.total || 0;
  const averageSpeed = movingTime > 0 ? distance / movingTime : 0; // m/s

  // Detect Activity Type
  // Try to find it in the XML first (some GPX have <type>)
  const typeTag = xml.match(/<type>(.*?)<\/type>/i)?.[1]?.toLowerCase() || "";
  let activityType: Route["activityType"] = "other";

  if (typeTag.includes("run")) activityType = "run";
  else if (typeTag.includes("bike") || typeTag.includes("cycl") || typeTag.includes("ride")) activityType = "ride";
  else if (typeTag.includes("hike") || typeTag.includes("walk")) activityType = "hike";
  else {
    // Fallback: Guess based on average speed (m/s)
    // > 6 m/s (~21 km/h) is likely a ride
    // 2-6 m/s is likely a run
    // < 2 m/s is likely a hike/walk
    if (averageSpeed > 6) activityType = "ride";
    else if (averageSpeed > 2) activityType = "run";
    else if (averageSpeed > 0) activityType = "hike";
  }

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
    activityType,
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
