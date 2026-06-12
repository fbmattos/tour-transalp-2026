import React from 'react';
import { useUnits, type UnitSystem } from '../context/UnitsContext';

// Three alternative looks for the same control. Pick one via the `variant`
// prop (set in App.tsx) — they all drive the same global units state.
//
//   segmented  →  [ mi | km ]  pill with a highlighted active side
//   switch     →  mi ◯───  km  labels flanking a sliding switch
//   text       →  "465 mi · switch to km"  single tappable line
export type UnitToggleVariant = 'segmented' | 'switch' | 'text';

interface Props {
  variant?: UnitToggleVariant;
}

export const UnitToggle: React.FC<Props> = ({ variant = 'segmented' }) => {
  if (variant === 'switch') return <SwitchToggle />;
  if (variant === 'text') return <TextToggle />;
  return <SegmentedToggle />;
};

/* ── Variant A: segmented pill ───────────────────────────── */
const SegmentedToggle: React.FC = () => {
  const { units, setUnits } = useUnits();

  const segment = (target: UnitSystem, label: string) => (
    <button
      type="button"
      onClick={() => setUnits(target)}
      aria-pressed={units === target}
      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
        units === target
          ? 'bg-emerald-400 text-slate-950'
          : 'text-white/45 hover:text-white/80'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-0.5"
      title="Units"
    >
      {segment('imperial', 'mi')}
      {segment('metric', 'km')}
    </div>
  );
};

/* ── Variant B: sliding switch with flanking labels ──────── */
const SwitchToggle: React.FC = () => {
  const { isImperial, toggleUnits } = useUnits();

  return (
    <button
      type="button"
      onClick={toggleUnits}
      role="switch"
      aria-checked={!isImperial}
      aria-label="Toggle between miles and kilometers"
      className="group flex items-center gap-2 text-[11px] font-bold"
    >
      <span className={isImperial ? 'text-emerald-300' : 'text-white/35'}>mi</span>
      <span className="relative h-[18px] w-8 rounded-full border border-white/15 bg-white/10 transition-colors group-hover:bg-white/15">
        <span
          className={`absolute top-[2px] h-3 w-3 rounded-full bg-emerald-400 transition-all duration-200 ${
            isImperial ? 'left-[3px]' : 'left-[17px]'
          }`}
        />
      </span>
      <span className={!isImperial ? 'text-emerald-300' : 'text-white/35'}>km</span>
    </button>
  );
};

/* ── Variant C: minimal text flip ────────────────────────── */
const TextToggle: React.FC = () => {
  const { isImperial, toggleUnits, distanceUnit } = useUnits();

  return (
    <button
      type="button"
      onClick={toggleUnits}
      className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/55 transition-colors hover:bg-white/10 hover:text-white/80"
      title={`Switch to ${isImperial ? 'kilometers' : 'miles'}`}
    >
      <span className="font-bold text-white/80">{distanceUnit}</span>
      <span aria-hidden="true">⇄</span>
      <span>{isImperial ? 'km' : 'mi'}</span>
    </button>
  );
};
