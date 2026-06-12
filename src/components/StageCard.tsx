import React from 'react';
import type { Stage } from '../data/stages';
import { DifficultyBadge } from './DifficultyBadge';
import { DifficultyBar } from './DifficultyBar';
import { useUnits } from '../context/UnitsContext';

interface Props {
  stage: Stage;
  isSelected: boolean;
  onClick: () => void;
}

const stageColors: Record<number, string> = {
  1: 'border-blue-500/40',
  2: 'border-red-500/60',
  3: 'border-orange-500/50',
  4: 'border-red-500/50',
  5: 'border-orange-500/40',
  6: 'border-orange-500/40',
  7: 'border-purple-500/40',
};

const buildElevationPath = (stage: Stage) => {
  const width = 220;
  const height = 34;
  const points = stage.elevationProfile;
  const minElevation = Math.min(...points.map((point) => point.elevation));
  const maxElevation = Math.max(...points.map((point) => point.elevation));
  const elevationRange = Math.max(1, maxElevation - minElevation);
  const maxDistance = Math.max(...points.map((point) => point.distance));

  return points
    .map((point, index) => {
      const x = maxDistance > 0 ? (point.distance / maxDistance) * width : 0;
      const y = height - ((point.elevation - minElevation) / elevationRange) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
};

export const StageCard: React.FC<Props> = ({ stage, isSelected, onClick }) => {
  const { formatDistance, formatElevation } = useUnits();
  const elevationPath = buildElevationPath(stage);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border transition-all duration-200 group
        ${isSelected
          ? `bg-white/10 ${stageColors[stage.stageNumber]} shadow-lg shadow-black/40 scale-[1.01]`
          : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
        }`}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${isSelected ? 'bg-white text-slate-900' : 'bg-white/15 text-white/70'}`}>
              {stage.stageNumber}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white leading-tight truncate">
                {stage.start.split(',')[0]}
              </p>
              <p className="text-xs text-white/50 leading-tight">
                → {stage.finish.split(',')[0]}
              </p>
            </div>
          </div>
          <DifficultyBadge badge={stage.badge} color={stage.badgeColor} small />
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-3 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {formatDistance(stage.distanceKm, stage.distanceMi)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            {formatElevation(stage.elevationM, stage.elevationFt)}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {stage.estimatedTime.split('–')[0].trim()}+
          </span>
        </div>

        {/* Difficulty bar */}
        <DifficultyBar score={stage.difficultyScore} />

        {/* Elevation trace */}
        <div
          className={`mt-3 h-9 overflow-hidden rounded-lg border transition-colors ${
            isSelected
              ? 'border-emerald-400/20 bg-emerald-400/5'
              : 'border-white/5 bg-white/[0.03] group-hover:border-white/10'
          }`}
        >
          <svg
            viewBox="0 0 220 38"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <path
              d={`${elevationPath} L 220 38 L 0 38 Z`}
              className="fill-emerald-400/10"
            />
            <path
              d={elevationPath}
              pathLength={1}
              className={`stage-card-elevation-line ${
                isSelected ? 'stage-card-elevation-line-selected' : ''
              }`}
            />
            <circle
              r="2.2"
              className={`stage-card-elevation-dot ${
                isSelected ? 'stage-card-elevation-dot-selected' : ''
              }`}
            >
              <animateMotion
                dur={isSelected ? '5s' : '7s'}
                repeatCount="indefinite"
                path={elevationPath}
              />
            </circle>
          </svg>
        </div>
      </div>
    </button>
  );
};
