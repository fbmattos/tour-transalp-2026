import type { ExternalLink } from './event';

export interface RiderStat {
  label: string;
  value: string;
}

export interface Rider {
  name: string;
  headshot: string;
  location: string;
  bike: string;
  role: string;
  goals: string[];
  funFact: string;
  stats?: RiderStat[];
  socialLinks?: ExternalLink[];
}

export const riders: Rider[] = [
  {
    name: 'Fernando Mattos',
    headshot: '/favicon.svg',
    location: 'United States',
    bike: 'Road bike',
    role: 'Rider',
    goals: [
      'Prepare for Tour Transalp 2026',
      'Study each stage, climb, route profile, and pacing risk',
      'Finish the seven-day race across the Alps',
    ],
    funFact: 'This dashboard was created with Claude Code and Codex to make the route easier to study and follow.',
    socialLinks: [
      { label: 'Instagram', href: 'https://www.instagram.com/fbmattos77/' },
      { label: 'Strava', href: 'https://strava.app.link/lLgTvuuVS3b' },
    ],
  },
];
