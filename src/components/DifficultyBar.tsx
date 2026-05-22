import React from 'react';

interface Props {
  score: number; // 1–10
}

export const DifficultyBar: React.FC<Props> = ({ score }) => {
  const pct = (score / 10) * 100;
  const color =
    score <= 4
      ? 'from-emerald-500 to-emerald-400'
      : score <= 6
      ? 'from-blue-500 to-blue-400'
      : score <= 8
      ? 'from-orange-500 to-orange-400'
      : 'from-red-600 to-red-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-white/50 w-5 text-right">{score}/10</span>
    </div>
  );
};
