export interface EventPhoto {
  src: string;
  alt: string;
  caption?: string;
}

export interface EventPhotoManifestEntry {
  alt: string;
  caption?: string;
}

export type EventPhotoManifest = Record<string, EventPhotoManifestEntry>;

export const defaultEventPhotos: EventPhoto[] = [
  {
    src: '/images/event/moment-01.jpg',
    alt: 'Alpine landscape along the Tour Transalp route',
    caption: 'Across the Alps',
  },
  {
    src: '/images/event/moment-02.jpg',
    alt: 'Mountain scenery from the Tour Transalp',
    caption: 'On the road',
  },
  {
    src: '/images/event/moment-03.jpg',
    alt: 'Scenic view from the Tour Transalp',
    caption: 'The Dolomites',
  },
  {
    src: '/images/event/moment-04.jpg',
    alt: 'Alpine pass on the Tour Transalp route',
  },
  {
    src: '/images/event/moment-05.jpg',
    alt: 'Mountain vista from the Tour Transalp',
  },
];
