// ============================================================
// Resolves the active trip at build time from VITE_TRIP.
// Default is "transalp-2026" so the existing (Vercel) build
// keeps rendering Transalp with no configuration change.
//
// A deployment selects a trip by setting VITE_TRIP, e.g.
//   Fly:    VITE_TRIP=mallorca-2026 (build arg)
//   Vercel: (unset) -> transalp-2026
// ============================================================
import type { TripManifest } from "./types";
import { manifest as transalp2026 } from "../trips/transalp-2026/manifest";
import { manifest as mallorca2026 } from "../trips/mallorca-2026/manifest";

const TRIPS: Record<string, TripManifest> = {
  "transalp-2026": transalp2026,
  "mallorca-2026": mallorca2026,
};

const DEFAULT_TRIP = "transalp-2026";

const requested = import.meta.env.VITE_TRIP as string | undefined;
const active: TripManifest = (requested && TRIPS[requested]) || TRIPS[DEFAULT_TRIP];

if (requested && !TRIPS[requested]) {
  console.warn(
    `[activeTrip] Unknown VITE_TRIP "${requested}". Falling back to "${DEFAULT_TRIP}". ` +
      `Known trips: ${Object.keys(TRIPS).join(", ")}.`
  );
}

export const activeTripId = active.id;
export const assetBase = active.assetBase;
export const showAbout = active.showAbout ?? true;

export const event = active.event;
export const team = active.team;
export const riders = active.riders;
export const stages = active.stages;
export const profileClimbSegments = active.profileClimbSegments;
export const defaultEventPhotos = active.eventPhotos;

// ── Derived (functions of the active manifest, trip-agnostic) ──
export const raceTotals = {
  totalKm: stages.reduce((s, st) => s + st.distanceKm, 0),
  totalMi: stages.reduce((s, st) => s + st.distanceMi, 0),
  totalElevationM: stages.reduce((s, st) => s + st.elevationM, 0),
  totalElevationFt: stages.reduce((s, st) => s + st.elevationFt, 0),
  queenStage: stages.find((s) => s.badge === "Queen Stage") ?? stages[0],
  hardestStage: stages.reduce((a, b) => (b.difficultyScore > a.difficultyScore ? b : a)),
  biggestFatigueRisk: stages[3] ?? stages[stages.length - 1],
};

export const profileClimbSegmentsByStage = (stageId: string) =>
  profileClimbSegments.filter((segment) => segment.stageId === stageId);
