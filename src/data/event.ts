export interface ExternalLink {
  label: string;
  href: string;
}

export interface EventMetadata {
  name: string;
  shortName?: string;
  dates: string;
  location: string;
  heroImage: {
    src: string;
    alt: string;
  };
  description: string;
  totalStages: number;
  edition?: string;
  countriesRepresented?: string;
  distanceKm: number;
  distanceMi: number;
  elevationM: number;
  elevationFt: number;
  links: ExternalLink[];
}

export const event: EventMetadata = {
  name: 'Tour Transalp 2026',
  shortName: 'Tour Transalp',
  dates: 'June 21-27, 2026',
  location: 'Across the Alps',
  heroImage: {
    src: '/images/event/moment-01.jpg',
    alt: 'Alpine landscape along the Tour Transalp route',
  },
  description:
    'Tour Transalp is a fascinating and spectacular seven-day road cycling stage race across the Alps. The 2026 event is the 22nd edition and brings riders from more than 35 countries to a professional stage-race format.',
  totalStages: 7,
  edition: '22nd',
  countriesRepresented: '35+',
  distanceKm: 746,
  distanceMi: 465,
  elevationM: 17180,
  elevationFt: 56365,
  links: [
    { label: 'Official website', href: 'https://event.delius-klasing.de/en/tour-transalp/event/' },
    { label: 'Official Instagram', href: 'https://www.instagram.com/tourtransalp/' },
    { label: 'Gran Fondo Guide', href: 'https://www.granfondoguide.com/Events/Index/5927/tour-transalp' },
    { label: 'StageRaces', href: 'https://stageraces.com/event/tour-transalp/' },
  ],
};
