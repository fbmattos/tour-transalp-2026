import type { ExternalLink } from './event';

export interface TeamMetadata {
  name: string;
  riderCount: number;
  description: string;
  links: ExternalLink[];
}

export const team: TeamMetadata = {
  name: 'Fernando Mattos',
  riderCount: 1,
  description:
    'A personal route, climbing, GPX profile, and pacing dashboard for preparing for and following the seven-day race across the Alps.',
  links: [
    { label: 'GitHub repo', href: 'https://github.com/fbmattos/tour-transalp-2026' },
  ],
};
