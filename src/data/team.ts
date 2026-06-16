import type { ExternalLink } from './event';

export interface TeamMetadata {
  name: string;
  riderCount: number;
  description: string;
  photo: {
    src: string;
    alt: string;
  };
  links: ExternalLink[];
}

export const team: TeamMetadata = {
  name: 'Woodenlegs',
  riderCount: 4,
  description:
    "Founded in Seattle and united by a questionable love of climbing, Woodenlegs is a group of friends who make an annual pilgrimage to Europe in search of epic rides. After a memorable week in the Dolomites, one thing became clear: apparently we hadn't suffered enough. Tour Transalp seemed like the logical next step.",
  photo: {
    src: '/images/team/team-photo.jpg',
    alt: 'Woodenlegs team riders',
  },
  links: [
    { label: 'GitHub repo', href: 'https://github.com/fbmattos/tour-transalp-2026' },
  ],
};
