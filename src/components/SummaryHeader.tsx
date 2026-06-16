import React from 'react';
import type { Stage } from '../data/stages';
import type { UnitSystem } from '../types/units';

interface Props {
  stages: Stage[];
  isAboutOpen: boolean;
  onAboutClick: () => void;
  unitSystem: UnitSystem;
  onUnitSystemChange: (unitSystem: UnitSystem) => void;
}

export const SummaryHeader: React.FC<Props> = ({
  stages,
  isAboutOpen,
  onAboutClick,
  unitSystem,
  onUnitSystemChange,
}) => {
  const totalKm = stages.reduce((s, st) => s + st.distanceKm, 0);
  const totalMi = stages.reduce((s, st) => s + st.distanceMi, 0);
  const totalElevationM = stages.reduce((s, st) => s + st.elevationM, 0);
  const totalElevationFt = stages.reduce((s, st) => s + st.elevationFt, 0);
  const queenStage = stages.find((s) => s.badge === "Queen Stage")!;
  const hardestStage = stages.reduce((a, b) => (b.difficultyScore > a.difficultyScore ? b : a));
  const biggestFatigueRisk = stages[3];
  const isMetric = unitSystem === 'metric';

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Race title */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-black text-white tracking-tight leading-none">
          Tour Transalp{' '}
          <span className="text-emerald-400">2026</span>
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          Fernando Mattos · Tour Transalp 2026: The epic road bike stage race across the Alps · June 21-27
        </p>
        {!isAboutOpen && (
          <button
            type="button"
            onClick={onAboutClick}
            className="mt-1 block text-xs font-semibold text-emerald-300/80 underline decoration-emerald-300/35 underline-offset-4 transition-colors hover:text-emerald-200"
          >
            About this dashboard and Tour Transalp
          </button>
        )}
      </div>

      <div className="hidden flex-1 min-w-0 sm:block" />

      <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs font-semibold">
        {(['imperial', 'metric'] as const).map((system) => (
          <button
            key={system}
            type="button"
            aria-pressed={unitSystem === system}
            onClick={() => onUnitSystemChange(system)}
            className={`rounded-full px-3 py-1 transition-colors ${
              unitSystem === system
                ? 'bg-emerald-400 text-slate-950'
                : 'text-white/55 hover:bg-white/10 hover:text-white'
            }`}
          >
            {system === 'imperial' ? 'Imperial' : 'Metric'}
          </button>
        ))}
      </div>

      {/* Stat pills */}
      <div className={`hidden flex-wrap gap-2 text-xs sm:flex ${isAboutOpen ? 'opacity-40' : ''}`}>
        <StatPill
          icon="↔"
          label="Total"
          value={isMetric ? `${totalKm} km` : `${totalMi} mi`}
          sub={isMetric ? `${totalMi} mi` : `${totalKm} km`}
        />
        <StatPill
          icon="↑"
          label="Climbing"
          value={isMetric ? `${totalElevationM.toLocaleString()} m` : `${totalElevationFt.toLocaleString()} ft`}
          sub={isMetric ? `${totalElevationFt.toLocaleString()} ft` : `${totalElevationM.toLocaleString()} m`}
        />
        <StatPill
          icon="👑"
          label="Queen"
          value={`Stage ${queenStage.stageNumber}`}
          sub={
            isMetric
              ? `${queenStage.distanceKm} km / ${queenStage.elevationM.toLocaleString()} m`
              : `${queenStage.distanceMi} mi / ${queenStage.elevationFt.toLocaleString()} ft`
          }
          highlight="red"
        />
        <StatPill
          icon="💀"
          label="Hardest"
          value={`Stage ${hardestStage.stageNumber}`}
          sub={`Score ${hardestStage.difficultyScore}/10`}
          highlight="orange"
        />
        <StatPill
          icon="⚡"
          label="Fatigue Risk"
          value={`Stage ${biggestFatigueRisk.stageNumber}`}
          sub={biggestFatigueRisk.start.split(',')[0]}
          highlight="amber"
        />
      </div>
    </div>
  );
};

const highlightMap: Record<string, string> = {
  red: 'border-red-500/30 bg-red-500/10',
  orange: 'border-orange-500/30 bg-orange-500/10',
  amber: 'border-amber-500/30 bg-amber-500/10',
  default: 'border-white/10 bg-white/5',
};

const StatPill: React.FC<{
  icon: string;
  label: string;
  value: string;
  sub?: string;
  highlight?: string;
}> = ({ icon, label, value, sub, highlight = 'default' }) => (
  <div
    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${highlightMap[highlight]}`}
  >
    <span className="text-sm">{icon}</span>
    <div>
      <p className="text-[9px] uppercase tracking-widest text-white/35 leading-none">{label}</p>
      <p className="text-white font-semibold leading-tight">{value}</p>
      {sub && <p className="text-[10px] text-white/40 leading-none">{sub}</p>}
    </div>
  </div>
);
