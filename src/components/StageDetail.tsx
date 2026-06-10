import React from 'react';
import { DifficultyBadge } from './DifficultyBadge';
import { DifficultyBar } from './DifficultyBar';
import { ElevationProfile } from './ElevationProfile';
import type { GpxStatus, StageWithGpx } from '../hooks/useGpxStages';

interface Props {
  stage: StageWithGpx;
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

const DataConfidence: React.FC<{ status?: GpxStatus }> = ({ status }) => (
  <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2">
    <div className="rounded-lg bg-emerald-500/10 px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300/80">Official</p>
      <p className="mt-1 text-[11px] leading-snug text-white/55">Distance, gain, towns</p>
    </div>
    <div className="rounded-lg bg-emerald-500/10 px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-300/80">GPX</p>
      <p className="mt-1 text-[11px] leading-snug text-white/55">
        {status === 'loaded' ? 'Route and profile loaded' : status === 'error' ? 'Load failed' : 'Loading route/profile'}
      </p>
    </div>
    <div className="rounded-lg bg-white/5 px-2 py-2">
      <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Curated</p>
      <p className="mt-1 text-[11px] leading-snug text-white/55">Climb notes</p>
    </div>
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

      <DataConfidence status={stage.gpxStatus} />

      {stage.gpxStats && (
        <div className="grid grid-cols-3 gap-2">
          <InfoCard
            label="GPX Distance"
            value={`${stage.gpxStats.totalDistanceKm.toLocaleString()} km`}
            sub={`${Math.round(stage.gpxStats.totalDistanceKm * 0.621371).toLocaleString()} mi measured`}
          />
          <InfoCard
            label="GPX Gain"
            value={`${stage.gpxStats.totalElevationGainM.toLocaleString()} m`}
            sub={`${Math.round(stage.gpxStats.totalElevationGainM * 3.28084).toLocaleString()} ft measured`}
          />
          <InfoCard
            label="GPX Points"
            value={stage.gpxStats.pointCount.toLocaleString()}
            sub={`${stage.gpxStats.minElevationM.toLocaleString()}-${stage.gpxStats.maxElevationM.toLocaleString()} m`}
          />
        </div>
      )}

      {stage.gpxStats?.steepestGrade && (
        <div className="rounded-xl border border-orange-500/25 bg-orange-500/10 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-300/80">
                Steepest Sustained Grade
              </p>
              <p className="mt-1 text-2xl font-black leading-none text-white">
                {stage.gpxStats.steepestGrade.gradientPct}% for{' '}
                {stage.gpxStats.steepestGrade.distanceMi.toLocaleString()} mi
              </p>
            </div>
            <div className="rounded-lg bg-white/5 px-3 py-2 text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/35">Gain</p>
              <p className="text-sm font-bold text-orange-200">
                {stage.gpxStats.steepestGrade.elevationGainM.toLocaleString()} m
              </p>
            </div>
          </div>
          <p className="mt-2 text-xs text-white/45">
            GPX average from km {stage.gpxStats.steepestGrade.startDistanceKm.toLocaleString()} to{' '}
            {stage.gpxStats.steepestGrade.endDistanceKm.toLocaleString()} using 0.5, 1, and 2 mi windows.
          </p>
        </div>
      )}

      {stage.gpxStatus === 'error' && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400/70 mb-1">GPX Load Error</p>
          <p className="text-sm text-white/70 leading-relaxed">{stage.gpxError}</p>
        </div>
      )}

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
                    <span>km {climb.approximateKm}</span>
                    <span>{climb.summitElevationM.toLocaleString()} m</span>
                  </div>
                </div>
                <div className="mb-2 flex gap-3 text-[10px] text-white/35">
                  <span>{climb.lengthKm ? `~${climb.lengthKm} km climb` : 'length TBD'}</span>
                  <span>{climb.maxGradient ? `~${climb.maxGradient}% max` : 'gradient TBD'}</span>
                  <span>{stage.gpxStatus === 'loaded' ? 'manual marker' : 'estimated marker'}</span>
                </div>
                <p className="text-xs text-white/55 leading-relaxed">{climb.whyFamous}</p>
              </div>
            ))}
          </div>
        </div>
      )}

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
