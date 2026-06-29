import { useEffect, useState } from 'react';
import {
  defaultEventPhotos,
  type EventPhoto,
  type EventPhotoManifest,
} from '../data/eventPhotos';

export type EventPhotosStatus = 'loading' | 'ready' | 'error';

export const parseEventPhotoManifest = (manifest: EventPhotoManifest): EventPhoto[] =>
  Object.entries(manifest)
    .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }))
    .map(([file, entry]) => ({
      src: `/images/event/${file}`,
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
        const response = await fetch('/images/event/manifest.json', {
          cache: 'no-cache',
        });
        if (!response.ok) {
          throw new Error(`Event photo manifest request failed: ${response.status}`);
        }

        const manifest = (await response.json()) as EventPhotoManifest;
        if (!isMounted) return;

        setPhotos(parseEventPhotoManifest(manifest));
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
