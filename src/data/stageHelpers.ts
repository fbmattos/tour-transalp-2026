// ============================================================
// Authoring helpers shared by every trip manifest.
// These build the fallback route/profile shown before the
// runtime GPX finishes loading.
// ============================================================
import type { Climb } from "./types";

interface ProfileAnchor {
  distance: number;
  elevation: number;
}

export function estimatedRoute(
  start: [number, number],
  waypoints: [number, number][],
  finish: [number, number]
): [number, number][] {
  return [start, ...waypoints, finish];
}

export function estimatedProfile(
  _totalKm: number,
  anchors: ProfileAnchor[],
  climbs: Climb[]
): { distance: number; elevation: number }[] {
  const points = [
    ...anchors,
    ...climbs.map((climb) => ({
      distance: climb.approximateKm,
      elevation: climb.summitElevationM,
    })),
  ]
    .sort((a, b) => a.distance - b.distance)
    .filter((point, index, all) => index === 0 || point.distance !== all[index - 1].distance);

  const result: { distance: number; elevation: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const steps = Math.max(1, Math.round((to.distance - from.distance) * 3));
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      result.push({
        distance: Math.round((from.distance + (to.distance - from.distance) * t) * 10) / 10,
        elevation: Math.round(from.elevation + (to.elevation - from.elevation) * t),
      });
    }
  }
  return result;
}
