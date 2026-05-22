import React from 'react';
import { raceTotals } from '../data/stages';

export const SummaryHeader: React.FC = () => {
  const { totalMi, totalKm, totalElevationFt, totalElevationM, queenStage, hardestStage, biggestFatigueRisk } =
    raceTotals;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Race title */}
      <div className="flex-shrink-0">
        <h1 className="text-xl font-black text-white tracking-tight leading-none">
          Tour Transalp{' '}
          <span className="text-emerald-400">2026</span>
        </h1>
        <p className="text-xs text-white/40 mt-0.5">Alps vs Florida Simulator · 7 stages</p>
      </div>

      <div className="flex-1 min-w-0" />

      {/* Stat pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        <StatPill icon="↔" label="Total" value={`${totalMi} mi`} sub={`${totalKm} km`} />
        <StatPill icon="↑" label="Climbing" value={`${totalElevationFt.toLocaleString()} ft`} sub={`${totalElevationM.toLocaleString()} m`} />
        <StatPill
          icon="👑"
          label="Queen"
          value={`Stage ${queenStage.stageNumber}`}
          sub={`${queenStage.distanceMi} mi / ${queenStage.elevationFt.toLocaleString()} ft`}
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
