import type { ExternalLink } from './event';

export interface RiderStat {
  label: string;
  value: string;
}

export interface Rider {
  name: string;
  headshot?: string;
  location: string;
  bike?: string;
  role: string;
  goals: string[];
  funFact: string;
  shortLine?: string;
  stats?: RiderStat[];
  socialLinks?: ExternalLink[];
}

export const riders: Rider[] = [
  {
    name: 'Fernando Mattos',
    location: 'Boca Raton, Florida, USA',
    role: 'Rider',
    goals: [
      'Prepare for Tour Transalp 2026',
      'Study each stage, climb, route profile, and pacing risk',
      'Finish the seven-day race across the Alps',
    ],
    funFact: 'Team photographer, Instagram documentarian, and likely source of all incriminating evidence.',
    shortLine: 'Team photographer, Instagram documentarian, and likely source of all incriminating evidence.',
    socialLinks: [
      { label: 'Instagram', href: 'https://www.instagram.com/fbmattos77/' },
      { label: 'Strava', href: 'https://www.strava.com/athletes/575265' },
    ],
  },
  {
    name: 'Sergio Clemente',
    location: 'Kirkland, WA, USA',
    role: 'Rider',
    goals: [],
    funFact: 'The instigator-in-chief: picked Transalp, built the plan, and convinced everyone this was a good idea.',
    shortLine: 'The instigator-in-chief: picked Transalp, built the plan, and convinced everyone this was a good idea.',
    socialLinks: [
      { label: 'Instagram', href: 'https://www.instagram.com/sergio.clemente.f/' },
      { label: 'Strava', href: 'https://www.strava.com/athletes/1785396' },
    ],
  },
  {
    name: 'Marcelo “Albuca” Albuquerque',
    location: 'Issaquah, WA, USA',
    role: 'Rider',
    goals: [],
    funFact: 'The detail machine: structured, prepared, and probably already knows the gradient of tomorrow’s climb.',
    shortLine: 'The detail machine: structured, prepared, and probably already knows the gradient of tomorrow’s climb.',
    socialLinks: [
      { label: 'Instagram', href: 'https://www.instagram.com/albuqm/' },
      { label: 'Strava', href: 'https://www.strava.com/athletes/2309909' },
    ],
  },
  {
    name: 'Eduardo Laureano',
    location: 'Bellevue, WA, USA',
    role: 'Rider',
    goals: [],
    funFact: 'Fearless descender with a suspicious comfort level around trucks, switchbacks, and bad ideas.',
    shortLine: 'Fearless descender with a suspicious comfort level around trucks, switchbacks, and bad ideas.',
    socialLinks: [
      { label: 'Instagram', href: 'https://www.instagram.com/eduardolaureano/' },
      { label: 'Strava', href: 'https://www.strava.com/athletes/102908' },
    ],
  },
];
