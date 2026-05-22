import React from 'react';
import type { Stage } from '../data/stages';
import { DifficultyBadge } from './DifficultyBadge';
import { DifficultyBar } from './DifficultyBar';
import { ElevationProfile } from './ElevationProfile';

interface Props {
  stage: Stage;
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">{children}</p>
);

const InfoCard: React.FC<{ label: string; value: string; sub?: string; icon?: string }> = ({
  label,
  value,
  sub,
  icon,
}) => (
  <div className="bg-white/5 rounded-lg px-3 py-2.5 border border-white/10">
    <p className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">{label}</p>
    <p className="text-base font-bold text-white leading-tight">
      {icon && <span className="mr-1">{icon}</span>}
      {value}
    </p>
    {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
  </div>
);

export const StageDetail: React.FC<Props> = ({ stage }) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
            {stage.stageNumber}
          </span>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">
              {stage.start.split(',')[0]} → {stage.finish.split(',')[0]}
            </h2>
            <p className="text-xs text-white/40">
              {stage.start} → {stage.finish}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DifficultyBadge badge={stage.badge} color={stage.badgeColor} />
          <DifficultyBar score={stage.difficultyScore} />
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-3 gap-2">
        <InfoCard label="Distance" value={`${stage.distanceMi} mi`} sub={`${stage.distanceKm} km`} icon="↔" />
        <InfoCard label="Climbing" value={`${stage.elevationFt.toLocaleString()} ft`} sub={`${stage.elevationM.toLocaleString()} m`} icon="↑" />
        <InfoCard label="Est. Time" value={stage.estimatedTime.split('–')[0].trim()} sub={`to ${stage.estimatedTime.split('–')[1]?.trim()}`} icon="⏱" />
      </div>

      {/* Elevation profile */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-4">
        <ElevationProfile stage={stage} />
      </div>

      {/* Summary */}
      <div>
        <SectionLabel>Stage Summary</SectionLabel>
        <p className="text-sm text-white/70 leading-relaxed">{stage.summary}</p>
      </div>

      {/* Famous Climbs */}
      {stage.climbs.length > 0 && (
        <div>
          <SectionLabel>Famous Climbs</SectionLabel>
          <div className="flex flex-col gap-2">
            {stage.climbs.map((climb) => (
              <div
                key={climb.name}
                className="bg-white/5 rounded-lg border border-white/10 p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-emerald-300">{climb.name}</p>
                  <div className="flex gap-3 text-[10px] text-white/40 flex-shrink-0">
                    {/* TODO: replace with real climb data */}
                    <span>{climb.lengthKm ? `${climb.lengthKm} km` : '— km'}</span>
                    <span>{climb.maxGradient ? `${climb.maxGradient}% max` : '—% max'}</span>
                  </div>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{climb.whyFamous}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Florida comparison */}
      <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl border border-amber-500/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🌴</span>
          <SectionLabel>Florida Equivalent</SectionLabel>
        </div>
        <p className="text-sm text-amber-200/80 leading-relaxed">{stage.floridaComparison}</p>
      </div>

      {/* Risk + Pacing */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-1">⚠ Main Risk</p>
          <p className="text-sm text-white/70 leading-relaxed">{stage.mainRisk}</p>
        </div>
        <div className="bg-blue-500/10 rounded-xl border border-blue-500/20 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400/70 mb-1">🎯 Pacing Advice</p>
          <p className="text-sm text-white/70 leading-relaxed">{stage.pacingAdvice}</p>
        </div>
      </div>
    </div>
  );
};
