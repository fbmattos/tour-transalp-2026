export interface ProfileClimbSegment {
  id: string;
  stageId: string;
  name: string;
  startKm: number;
  summitKm: number;
}

// Profile annotations extracted from the reference elevation profile SVG.
// These define where the colored climb overlays belong on each GPX profile.
export const profileClimbSegments: ProfileClimbSegment[] = [
  { id: 'staller-sattel', stageId: 'stage-1', name: 'Staller Sattel', startKm: 38.0, summitKm: 55.0 },

  { id: 'passo-giau', stageId: 'stage-2', name: 'Passo Giau', startKm: 46.7, summitKm: 62.5 },
  { id: 'passo-staulanza', stageId: 'stage-2', name: 'Passo Staulanza', startKm: 72.5, summitKm: 82.4 },
  { id: 'passo-duran', stageId: 'stage-2', name: 'Passo Duran', startKm: 94.3, summitKm: 103.2 },
  { id: 'val-biois-falcade', stageId: 'stage-2', name: 'Val Biois / Falcade', startKm: 116.1, summitKm: 133.0 },

  { id: 'passo-valles', stageId: 'stage-3', name: 'Passo Valles', startKm: 10.8, summitKm: 24.5 },
  { id: 'passo-rolle', stageId: 'stage-3', name: 'Passo Rolle', startKm: 30.4, summitKm: 38.2 },

  { id: 'passo-gobbera', stageId: 'stage-4', name: 'Passo Gobbera', startKm: 16.9, summitKm: 23.8 },
  { id: 'passo-brocon', stageId: 'stage-4', name: 'Passo Brocon', startKm: 27.8, summitKm: 48.7 },
  { id: 'monte-grappa-feltre', stageId: 'stage-4', name: 'Monte Grappa', startKm: 83.4, summitKm: 110.2 },

  { id: 'monte-grappa-possagno', stageId: 'stage-5', name: 'Monte Grappa', startKm: 47.0, summitKm: 72.0 },

  { id: 'altopiano-di-asiago', stageId: 'stage-6', name: 'Altopiano di Asiago', startKm: 19.8, summitKm: 33.7 },
  { id: 'passo-vezzena', stageId: 'stage-6', name: 'Passo Vezzena', startKm: 77.4, summitKm: 99.2 },

  { id: 'passo-bordala', stageId: 'stage-7', name: 'Passo Bordala', startKm: 40.5, summitKm: 58.3 },
];

export const profileClimbSegmentsByStage = (stageId: string) =>
  profileClimbSegments.filter((segment) => segment.stageId === stageId);
