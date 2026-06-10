export interface GpxElevationPoint {
  distance: number;
  elevation: number;
}

export interface GpxStats {
  totalDistanceKm: number;
  totalElevationGainM: number;
  minElevationM: number;
  maxElevationM: number;
  pointCount: number;
  steepestGrade?: GpxGradientSegment;
}

export interface ParsedGpxTrack {
  routeCoordinates: [number, number][];
  elevationProfile: GpxElevationPoint[];
  stats: GpxStats;
}

export interface GpxGradientSegment {
  gradientPct: number;
  distanceKm: number;
  distanceMi: number;
  elevationGainM: number;
  startDistanceKm: number;
  endDistanceKm: number;
}

const EARTH_RADIUS_KM = 6371;
const KM_PER_MILE = 1.609344;
const GRADIENT_WINDOWS_KM = [0.5 * KM_PER_MILE, 1 * KM_PER_MILE, 2 * KM_PER_MILE];

const toRadians = (degrees: number) => degrees * (Math.PI / 180);

const distanceKm = (from: [number, number], to: [number, number]) => {
  const [fromLat, fromLng] = from;
  const [toLat, toLng] = to;
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(deltaLng / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const textContentAsNumber = (element: Element, tagName: string) => {
  const value = element.getElementsByTagName(tagName)[0]?.textContent;
  return value ? Number(value) : null;
};

interface GpxTrackSample {
  distanceKm: number;
  elevation: number;
}

const findSteepestGrade = (samples: GpxTrackSample[]): GpxGradientSegment | undefined => {
  if (samples.length < 2) return undefined;

  let best: GpxGradientSegment | undefined;

  for (const targetDistanceKm of GRADIENT_WINDOWS_KM) {
    let endIndex = 1;

    for (let startIndex = 0; startIndex < samples.length - 1; startIndex++) {
      const start = samples[startIndex];

      while (
        endIndex < samples.length &&
        samples[endIndex].distanceKm - start.distanceKm < targetDistanceKm
      ) {
        endIndex += 1;
      }

      if (endIndex >= samples.length) break;

      const end = samples[endIndex];
      const segmentDistanceKm = end.distanceKm - start.distanceKm;
      const elevationGainM = end.elevation - start.elevation;

      if (segmentDistanceKm <= 0 || elevationGainM <= 0) continue;

      const gradientPct = (elevationGainM / (segmentDistanceKm * 1000)) * 100;
      const candidate: GpxGradientSegment = {
        gradientPct: Math.round(gradientPct * 10) / 10,
        distanceKm: Math.round(segmentDistanceKm * 10) / 10,
        distanceMi: Math.round((segmentDistanceKm / KM_PER_MILE) * 10) / 10,
        elevationGainM: Math.round(elevationGainM),
        startDistanceKm: Math.round(start.distanceKm * 10) / 10,
        endDistanceKm: Math.round(end.distanceKm * 10) / 10,
      };

      if (!best || candidate.gradientPct > best.gradientPct) {
        best = candidate;
      }
    }
  }

  return best;
};

export const parseGpxTrack = (gpxText: string): ParsedGpxTrack => {
  const document = new DOMParser().parseFromString(gpxText, 'application/xml');
  const parserError = document.querySelector('parsererror');

  if (parserError) {
    throw new Error('The GPX file could not be parsed as XML.');
  }

  const trackPoints = Array.from(document.getElementsByTagName('trkpt'));

  if (trackPoints.length === 0) {
    throw new Error('The GPX file does not contain any track points.');
  }

  const routeCoordinates: [number, number][] = [];
  const elevationProfile: GpxElevationPoint[] = [];
  const samples: GpxTrackSample[] = [];
  let totalDistanceKm = 0;
  let totalElevationGainM = 0;
  let minElevationM = Number.POSITIVE_INFINITY;
  let maxElevationM = Number.NEGATIVE_INFINITY;
  let previousCoordinate: [number, number] | null = null;
  let previousElevation: number | null = null;

  for (const point of trackPoints) {
    const lat = Number(point.getAttribute('lat'));
    const lng = Number(point.getAttribute('lon'));
    const elevation = textContentAsNumber(point, 'ele');

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || elevation === null || !Number.isFinite(elevation)) {
      continue;
    }

    const coordinate: [number, number] = [lat, lng];

    if (previousCoordinate) {
      totalDistanceKm += distanceKm(previousCoordinate, coordinate);
    }

    if (previousElevation !== null && elevation > previousElevation) {
      totalElevationGainM += elevation - previousElevation;
    }

    minElevationM = Math.min(minElevationM, elevation);
    maxElevationM = Math.max(maxElevationM, elevation);
    routeCoordinates.push(coordinate);
    samples.push({
      distanceKm: totalDistanceKm,
      elevation,
    });
    elevationProfile.push({
      distance: Math.round(totalDistanceKm * 10) / 10,
      elevation: Math.round(elevation),
    });

    previousCoordinate = coordinate;
    previousElevation = elevation;
  }

  if (routeCoordinates.length === 0) {
    throw new Error('The GPX file did not contain valid track points with elevation.');
  }

  return {
    routeCoordinates,
    elevationProfile,
    stats: {
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      totalElevationGainM: Math.round(totalElevationGainM),
      minElevationM: Math.round(minElevationM),
      maxElevationM: Math.round(maxElevationM),
      pointCount: routeCoordinates.length,
      steepestGrade: findSteepestGrade(samples),
    },
  };
};

export const loadGpxTrack = async (url: string): Promise<ParsedGpxTrack> => {
  const response = await fetch(encodeURI(url));

  if (!response.ok) {
    throw new Error(`Failed to load GPX file: ${response.status} ${response.statusText}`);
  }

  return parseGpxTrack(await response.text());
};
