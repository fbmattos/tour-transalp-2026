import { useEffect, useState } from 'react';
import {
  defaultEventPhotos,
  type EventPhoto,
  type EventPhotoManifest,
} from '../data/eventPhotos';
import { assetBase } from '../data/activeTrip';

export type EventPhotosStatus = 'loading' | 'ready' | 'error';

export const parseEventPhotoManifest = (
  manifest: EventPhotoManifest,
  base = '',
): EventPhoto[] =>
  Object.entries(manifest)
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([file, entry]) => ({
      src: `${base}/images/event/${file}`,
      alt: entry.alt,
      ...(entry.caption ? { caption: entry.caption } : {}),
    }));

export const useEventPhotos = () => {
  const [photos, setPhotos] = useState<EventPhoto[]>(defaultEventPhotos);
  const [status, setStatus] = useState<EventPhotosStatus>('loading');

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      if (typeof fetch !== 'function') {
        setStatus('ready');
        return;
      }

      try {
        const response = await fetch(`${assetBase}/images/event/manifest.json`, {
          cache: 'no-cache',
        });
        if (!response.ok) {
          throw new Error(`Event photo manifest request failed: ${response.status}`);
        }

        const manifest = (await response.json()) as EventPhotoManifest;
        if (!isMounted) return;

        setPhotos(parseEventPhotoManifest(manifest, assetBase));
        setStatus('ready');
      } catch {
        if (!isMounted) return;
        setPhotos(defaultEventPhotos);
        setStatus('error');
      }
    };

    loadPhotos();

    return () => {
      isMounted = false;
    };
  }, []);

  return { photos, status };
};
