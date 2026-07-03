// Re-export shim — data comes from the active trip manifest.
// Edit trips, not this file. See src/data/activeTrip.ts.
export type { EventPhoto, EventPhotoManifestEntry, EventPhotoManifest } from "./types";
export { defaultEventPhotos } from "./activeTrip";
