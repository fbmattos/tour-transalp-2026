// Re-export shim — data comes from the active trip manifest.
// Edit trips, not this file. See src/data/activeTrip.ts.
export type { Climb, Stage } from "./types";
export { stages, raceTotals } from "./activeTrip";
