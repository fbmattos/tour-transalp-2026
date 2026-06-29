import React, { useCallback, useEffect, useState } from 'react';
import type { EventPhoto } from '../data/eventPhotos';
import { event } from '../data/event';
import { team } from '../data/team';
import { EventPhotoLightbox } from './EventPhotoLightbox';

const COLLAPSE_STORAGE_KEY = 'event-moments-collapsed';

interface Props {
  photos: EventPhoto[];
}

export const EventMomentsStrip: React.FC<Props> = ({ photos }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return window.localStorage.getItem(COLLAPSE_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const activePhoto = photos[activeIndex] ?? photos[0];

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(collapsed));
    } catch {
      // ignore storage errors
    }
  }, [collapsed]);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(Math.max(0, Math.min(index, photos.length - 1)));
    },
    [photos.length],
  );

  if (photos.length === 0 || !activePhoto) return null;

  return (
    <>
      <section
        aria-label="Event photos"
        className="flex-shrink-0 border-b border-white/10 bg-slate-950"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">
            Moments from the Alps
          </p>
          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-expanded={!collapsed}
            aria-controls="event-moments-banner"
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold text-white/55 transition-colors hover:bg-white/10 hover:text-white/80"
          >
            {collapsed ? 'Show photos' : 'Hide photos'}
          </button>
        </div>

        {!collapsed && (
          <div id="event-moments-banner" className="px-4 pb-3">
            <div className="relative overflow-hidden rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`View full size: ${activePhoto.alt}`}
                className="group relative block h-[210px] w-full cursor-zoom-in sm:h-[270px] lg:h-[300px]"
              >
                <img
                  key={activePhoto.src}
                  src={activePhoto.src}
                  alt={activePhoto.alt}
                  className="h-full w-full object-cover transition-opacity group-hover:opacity-95"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/15 bg-slate-950/50 px-2 py-1 text-[10px] font-semibold text-white/60 opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
                  View full size
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 sm:p-4">
                  <div className="min-w-0 text-left">
                    <p className="truncate text-xs font-semibold text-white/90 sm:text-sm">
                      {team.name} · {event.name}
                    </p>
                    {activePhoto.caption && (
                      <p className="truncate text-[11px] text-white/50 sm:text-xs">
                        {activePhoto.caption}
                      </p>
                    )}
                  </div>
                  {photos.length > 1 && (
                    <p className="flex-shrink-0 text-[10px] font-semibold tabular-nums text-white/45">
                      {activeIndex + 1} / {photos.length}
                    </p>
                  )}
                </div>
              </button>

              {photos.length > 1 && (
                <>
                  <div
                    className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-3 pt-2 sm:hidden"
                    aria-label="Swipe through event photos"
                  >
                    {photos.map((photo, index) => (
                      <button
                        key={photo.src}
                        type="button"
                        onClick={() => goTo(index)}
                        aria-label={`Show photo ${index + 1}`}
                        aria-current={index === activeIndex ? 'true' : undefined}
                        className={`h-14 w-24 flex-shrink-0 snap-start overflow-hidden rounded-lg border transition-colors ${
                          index === activeIndex
                            ? 'border-emerald-400/60 ring-1 ring-emerald-400/40'
                            : 'border-white/10 opacity-70'
                        }`}
                      >
                        <img
                          src={photo.src}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <div
                    className="hidden items-center justify-center gap-2 px-3 pb-3 pt-2 sm:flex"
                    role="tablist"
                    aria-label="Event photo navigation"
                  >
                    {photos.map((photo, index) => (
                      <button
                        key={photo.src}
                        type="button"
                        role="tab"
                        aria-selected={index === activeIndex}
                        aria-label={`Show photo ${index + 1}`}
                        onClick={() => goTo(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                          index === activeIndex
                            ? 'bg-emerald-400'
                            : 'bg-white/25 hover:bg-white/45'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </section>

      {lightboxOpen && (
        <EventPhotoLightbox
          photos={photos}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};
