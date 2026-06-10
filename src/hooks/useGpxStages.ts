import { useEffect, useMemo, useState } from 'react';
import type { Stage } from '../data/stages';
import { loadGpxTrack, type GpxStats } from '../utils/gpx';

export type GpxStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface StageWithGpx extends Stage {
  gpxStatus: GpxStatus;
  gpxError?: string;
  gpxStats?: GpxStats;
}

export const useGpxStages = (stages: Stage[]): StageWithGpx[] => {
  const [loadedStages, setLoadedStages] = useState<Record<string, Partial<StageWithGpx>>>({});

  useEffect(() => {
    let isCancelled = false;

    stages.forEach((stage) => {
      if (!stage.gpxFile) return;

      loadGpxTrack(stage.gpxFile)
        .then((track) => {
          if (isCancelled) return;

          setLoadedStages((current) => ({
            ...current,
            [stage.id]: {
              gpxStatus: 'loaded',
              routeCoordinates: track.routeCoordinates,
              startCoord: track.routeCoordinates[0],
              finishCoord: track.routeCoordinates[track.routeCoordinates.length - 1],
              elevationProfile: track.elevationProfile,
              gpxStats: track.stats,
            },
          }));
        })
        .catch((error: unknown) => {
          if (isCancelled) return;

          setLoadedStages((current) => ({
            ...current,
            [stage.id]: {
              gpxStatus: 'error',
              gpxError: error instanceof Error ? error.message : 'Unknown GPX loading error',
            },
          }));
        });
    });

    return () => {
      isCancelled = true;
    };
  }, [stages]);

  return useMemo(
    () =>
      stages.map((stage) => ({
        ...stage,
        gpxStatus: stage.gpxFile ? 'loading' : 'idle',
        ...loadedStages[stage.id],
      })),
    [loadedStages, stages]
  );
};
