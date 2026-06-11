import type { ProfileClimbSegment } from '../data/profileClimbSegments';
import type { GpxElevationPoint } from './gpx';

export type ClimbCategory = 'Cat 3' | 'Cat 2' | 'Cat 1' | 'HC';

export interface ProfileClimb {
  id: string;
  name: string;
  startKm: number;
  summitKm: number;
  lengthKm: number;
  lengthMi: number;
  gainM: number;
  avgGradient: number;
  summitElevationM: number;
  estimatedClimbMinutes: number;
  category: ClimbCategory;
  color: string;
}

export const CONSERVATIVE_TRANSALP_VAM_M_PER_HOUR = 850;

export const climbCategoryMeta: Record<ClimbCategory, { label: string; range: string; color: string }> = {
  'Cat 3': { label: 'Cat 3', range: '<500m gain', color: '#5b9bd5' },
  'Cat 2': { label: 'Cat 2', range: '500-800m gain', color: '#70b856' },
  'Cat 1': { label: 'Cat 1', range: '800-1200m gain', color: '#f5a623' },
  HC: { label: 'HC', range: '1200m+ gain', color: '#e04040' },
};

const KM_PER_MILE = 1.609344;

const categoryForGain = (gainM: number): ClimbCategory => {
  if (gainM >= 1200) return 'HC';
  if (gainM >= 800) return 'Cat 1';
  if (gainM >= 500) return 'Cat 2';
  return 'Cat 3';
};

const pointAtDistance = (profile: GpxElevationPoint[], targetKm: number) => {
  return profile.reduce((closest, point) =>
    Math.abs(point.distance - targetKm) < Math.abs(closest.distance - targetKm) ? point : closest
  );
};

const climbId = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const buildProfileClimbs = (
  segments: ProfileClimbSegment[],
  profile: GpxElevationPoint[]
): ProfileClimb[] => {
  if (profile.length === 0) return [];

  return segments
    .map((segment) => {
      const startKm = Math.max(0, segment.startKm);
      const summitKm = segment.summitKm;
      const start = pointAtDistance(profile, startKm);
      const summit = pointAtDistance(profile, summitKm);
      const lengthKm = Math.max(0.1, summit.distance - start.distance);
      const gainM = Math.max(0, summit.elevation - start.elevation);
      const avgGradient = Math.round((gainM / (lengthKm * 1000)) * 1000) / 10;
      const category = categoryForGain(gainM);

      return {
        id: segment.id || climbId(segment.name),
        name: segment.name,
        startKm: Math.round(start.distance * 10) / 10,
        summitKm: Math.round(summit.distance * 10) / 10,
        lengthKm: Math.round(lengthKm * 10) / 10,
        lengthMi: Math.round((lengthKm / KM_PER_MILE) * 10) / 10,
        gainM: Math.round(gainM),
        avgGradient,
        summitElevationM: summit.elevation,
        estimatedClimbMinutes: Math.max(1, Math.round((gainM / CONSERVATIVE_TRANSALP_VAM_M_PER_HOUR) * 60)),
        category,
        color: climbCategoryMeta[category].color,
      };
    })
    .filter((climb) => climb.gainM > 0)
    .sort((a, b) => a.summitKm - b.summitKm);
};
