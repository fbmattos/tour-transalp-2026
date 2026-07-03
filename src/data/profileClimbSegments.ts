// Re-export shim — data comes from the active trip manifest.
// Edit trips, not this file. See src/data/activeTrip.ts.
export type { ProfileClimbSegment } from "./types";
export { profileClimbSegments, profileClimbSegmentsByStage } from "./activeTrip";
