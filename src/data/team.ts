// Re-export shim — data comes from the active trip manifest.
// Edit trips, not this file. See src/data/activeTrip.ts.
export type { TeamMetadata } from "./types";
export { team } from "./activeTrip";
