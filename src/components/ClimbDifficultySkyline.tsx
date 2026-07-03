import type { Stage } from '../data/stages';
import { useUnits } from '../context/UnitsContext';

interface Props {
  stages: Stage[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const getDifficultyTone = (score: number) => {
  if (score >= 9) return 'from-red-500 to-orange-300 shadow-red-500/20';
  if (score >= 8) return 'from-orange-500 to-amber-300 shadow-orange-500/20';
  if (score >= 6) return 'from-blue-500 to-cyan-300 shadow-blue-500/20';
  return 'from-emerald-500 to-teal-300 shadow-emerald-500/20';
};

const stageDensity = (stage: Stage) =>
  stage.distanceMi > 0 ? stage.elevationFt / stage.distanceMi : 0;

export const ClimbDifficultySkyline = ({ stages, selectedId, onSelect }: Props) => {
  const { formatElevation, isImperial } = useUnits();
  const ridingStages = stages.filter((stage) => stage.distanceMi > 0);
  const maxElevation = Math.max(1, ...ridingStages.map((stage) => stage.elevationFt));
  const maxDensity = Math.max(1, ...ridingStages.map(stageDensity));

  return (
    <div className="border-b border-white/10 bg-white/[0.03] px-3 py-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/35">Climb Skyline</p>
        <p className="text-[10px] text-white/30">gain + steepness</p>
      </div>
      <div className="flex h-24 items-end gap-1.5">
        {stages.map((stage) => {
          const isSelected = stage.id === selectedId;
          const elevationPct = stage.elevationFt / maxElevation;
          const densityPct = stageDensity(stage) / maxDensity;
          const height = 28 + elevationPct * 48;
          const tone = getDifficultyTone(stage.difficultyScore);

          return (
            <button
              key={stage.id}
              onClick={() => onSelect(stage.id)}
              className="group flex min-w-0 flex-1 flex-col items-center gap-1 rounded-md px-1 py-1 transition-colors hover:bg-white/5"
              title={
                stage.distanceMi > 0
                  ? `Stage ${stage.stageNumber}: ${formatElevation(stage.elevationM, stage.elevationFt)}, ${
                      isImperial
                        ? `${Math.round(stage.elevationFt / stage.distanceMi)} ft/mi`
                        : `${Math.round(stage.elevationM / stage.distanceKm)} m/km`
                    }`
                  : `Stage ${stage.stageNumber}: Rest day`
              }
            >
              <div className="relative flex h-16 w-full items-end justify-center">
                <div
                  className={`w-full max-w-6 rounded-t-full bg-gradient-to-t ${tone} shadow-lg transition-all duration-300 ${
                    isSelected ? 'opacity-100 ring-1 ring-white/50' : 'opacity-55 group-hover:opacity-85'
                  }`}
                  style={{ height }}
                />
                <div
                  className={`absolute bottom-1 h-1.5 rounded-full bg-white transition-opacity ${
                    isSelected ? 'opacity-90' : 'opacity-35'
                  }`}
                  style={{ width: `${34 + densityPct * 42}%` }}
                />
              </div>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-white/10 text-white/45'
                }`}
              >
                {stage.stageNumber}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
