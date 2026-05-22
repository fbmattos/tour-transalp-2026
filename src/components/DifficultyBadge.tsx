import React from 'react';
import type { Stage } from '../data/stages';

interface Props {
  badge: Stage['badge'];
  color: Stage['badgeColor'];
  small?: boolean;
}

const colorMap: Record<Stage['badgeColor'], string> = {
  green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
  orange: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
  red: 'bg-red-500/20 text-red-300 border-red-500/40',
  purple: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
};

export const DifficultyBadge: React.FC<Props> = ({ badge, color, small = false }) => (
  <span
    className={`inline-flex items-center border rounded-full font-semibold tracking-wide uppercase ${
      small ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3 py-1'
    } ${colorMap[color]}`}
  >
    {badge}
  </span>
);
