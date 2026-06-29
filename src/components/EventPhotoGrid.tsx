import React from 'react';
import type { EventPhoto } from '../data/eventPhotos';

interface Props {
  photos: EventPhoto[];
  title?: string;
}

export const EventPhotoGrid: React.FC<Props> = ({
  photos,
  title = 'From the road',
}) => {
  if (photos.length === 0) return null;

  return (
    <section>
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-white/35">
        {title}
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {photos.map((photo) => (
          <figure
            key={photo.src}
            className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="aspect-[16/10] w-full object-cover"
              loading="lazy"
            />
            {photo.caption && (
              <figcaption className="px-3 py-2 text-xs text-white/50">
                {photo.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
};
