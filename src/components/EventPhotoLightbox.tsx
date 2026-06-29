import React, { useCallback, useEffect } from 'react';
import type { EventPhoto } from '../data/eventPhotos';

interface Props {
  photos: EventPhoto[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export const EventPhotoLightbox: React.FC<Props> = ({
  photos,
  activeIndex,
  onIndexChange,
  onClose,
}) => {
  const photo = photos[activeIndex];
  const hasMultiple = photos.length > 1;

  const goPrev = useCallback(() => {
    onIndexChange((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, onIndexChange, photos.length]);

  const goNext = useCallback(() => {
    onIndexChange((activeIndex + 1) % photos.length);
  }, [activeIndex, onIndexChange, photos.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft' && hasMultiple) goPrev();
      if (event.key === 'ArrowRight' && hasMultiple) goNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, hasMultiple, onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/95 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Event photo viewer"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/20 hover:text-white"
      >
        Close
      </button>

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-lg text-white/80 transition-colors hover:bg-white/20 hover:text-white sm:right-6"
          >
            ›
          </button>
        </>
      )}

      <figure
        className="flex max-h-full max-w-full flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={photo.src}
          alt={photo.alt}
          className="max-h-[calc(100dvh-8rem)] max-w-full object-contain"
        />
        <figcaption className="max-w-2xl text-center">
          <p className="text-sm text-white/80">{photo.alt}</p>
          {photo.caption && (
            <p className="mt-1 text-xs text-white/45">{photo.caption}</p>
          )}
          {hasMultiple && (
            <p className="mt-2 text-[10px] font-semibold tabular-nums text-white/35">
              {activeIndex + 1} / {photos.length}
            </p>
          )}
        </figcaption>
      </figure>
    </div>
  );
};
