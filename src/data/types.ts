// ============================================================
// Shared data types for all trips.
// A "trip" (Transalp, Mallorca, …) is one TripManifest.
// Trip-specific content lives in src/trips/<id>/manifest.ts,
// never hardcoded in shared source.
// ============================================================

export interface ExternalLink {
  label: string;
  href: string;
}

export interface EventMetadata {
  name: string;
  shortName?: string;
  dates: string;
  location: string;
  heroImage: {
    src: string;
    alt: string;
  };
  description: string;
  totalStages: number;
  edition?: string;
  countriesRepresented?: string;
  distanceKm: number;
  distanceMi: number;
  elevationM: number;
  elevationFt: number;
  links: ExternalLink[];
}

export interface TeamMetadata {
  name: string;
  riderCount: number;
  description: string;
  photo: {
    src: string;
    alt: string;
  };
  links: ExternalLink[];
}

export interface RiderStat {
  label: string;
  value: string;
}

export interface Rider {
  name: string;
  headshot?: string;
  location?: string;
  bike?: string;
  role: string;
  goals: string[];
  funFact: string;
  shortLine?: string;
  stats?: RiderStat[];
  socialLinks?: ExternalLink[];
}

export interface Climb {
  name: string;
  approximateLatLng: [number, number];
  approximateKm: number;
  summitElevationM: number;
  lengthKm: number | null;
  maxGradient: number | null;
  whyFamous: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  start: string;
  finish: string;
  distanceKm: number;
  distanceMi: number;
  elevationM: number;
  elevationFt: number;
  difficultyScore: number; // 1–10
  badge: string;
  badgeColor: "green" | "blue" | "orange" | "red" | "purple";
  summary: string;
  estimatedTime: string;
  mainRisk: string;
  pacingAdvice: string;
  gpxFile: string;
  // Rest days carry no route; the UI skips route/climb rendering for them.
  isRestDay?: boolean;
  // Fallback preview coordinates used before GPX files finish loading
  routeCoordinates: [number, number][];
  startCoord: [number, number];
  finishCoord: [number, number];
  climbs: Climb[];
  // Fallback preview profile used before GPX files finish loading
  elevationProfile: { distance: number; elevation: number }[];
}

export interface ProfileClimbSegment {
  id: string;
  stageId: string;
  name: string;
  startKm: number;
  summitKm: number;
}

export interface EventPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface EventPhotoManifestEntry {
  alt: string;
  caption?: string;
}

export type EventPhotoManifest = Record<string, EventPhotoManifestEntry>;

// ============================================================
// A single trip bundle. One deployment renders one manifest,
// selected at build time by VITE_TRIP (see activeTrip.ts).
// ============================================================
export interface TripManifest {
  /** Stable trip id, e.g. "transalp-2026". */
  id: string;
  /**
   * Base path (under /public) for this trip's runtime-fetched assets
   * (event photo manifest, video manifest). "" means root-hosted
   * (legacy layout); new trips use "/trips/<id>".
   */
  assetBase: string;
  /** Show the About page (team + riders). Defaults to true when omitted. */
  showAbout?: boolean;
  event: EventMetadata;
  team: TeamMetadata;
  riders: Rider[];
  stages: Stage[];
  profileClimbSegments: ProfileClimbSegment[];
  eventPhotos: EventPhoto[];
}
