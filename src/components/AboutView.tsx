import React from 'react';
import { useUnits } from '../context/UnitsContext';
import { event } from '../data/event';
import { team } from '../data/team';
import { riders } from '../data/riders';

const LinkChip: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200"
  >
    {label}
  </a>
);

const LinkGroup: React.FC<{ title: string; links: { href: string; label: string }[] }> = ({
  title,
  links,
}) => (
  <div>
    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">{title}</p>
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <LinkChip key={link.href} {...link} />
      ))}
    </div>
  </div>
);

const Fact: React.FC<{ label: string; value: string; sub?: string }> = ({ label, value, sub }) => (
  <div className="rounded-lg border border-white/10 bg-slate-950/35 px-4 py-3">
    <p className="text-[10px] uppercase tracking-widest text-white/35">{label}</p>
    <p className="mt-1 text-lg font-black leading-tight text-white">{value}</p>
    {sub && <p className="mt-1 text-xs text-white/40">{sub}</p>}
  </div>
);

export const AboutView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { formatDistance, formatElevation } = useUnits();
  const primaryRider = riders[0];

  return (
  <main className="flex-1 overflow-y-auto px-4 py-5 lg:px-8 lg:py-8">
    <div className="mx-auto flex max-w-6xl flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className="w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/65 transition-colors hover:bg-white/10 hover:text-white"
      >
        Back to dashboard
      </button>

      <section className="rounded-xl border border-white/10 bg-white/5 p-5 lg:p-6">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300/75">
          About This Dashboard
        </p>
        <h2 className="max-w-4xl text-2xl font-black leading-tight text-white lg:text-4xl">
          {team.name} at {event.name}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65 lg:text-base">
          {primaryRider.name} is riding {event.name} from {event.dates}. {team.description}
        </p>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <section className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">
            About {event.name}
          </p>
          <p className="text-sm leading-relaxed text-white/65">
            {event.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
            <Fact label="Race" value={`${event.totalStages} stages`} />
            {event.edition && <Fact label="Edition" value={event.edition} />}
            <Fact label="Distance" value={formatDistance(event.distanceKm, event.distanceMi)} />
            <Fact label="Climbing" value={formatElevation(event.elevationM, event.elevationFt)} />
          </div>
          <div className="mt-5">
            <LinkGroup title="Event Resources" links={event.links} />
          </div>
        </section>

        <section className="rounded-xl border border-white/10 bg-white/5 p-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-white/35">
            About This Dashboard
          </p>
          <p className="text-sm leading-relaxed text-white/65">
            {primaryRider.funFact}
          </p>
          <div className="mt-5 flex flex-col gap-4">
            {primaryRider.socialLinks && <LinkGroup title={`Follow ${primaryRider.name.split(' ')[0]}`} links={primaryRider.socialLinks} />}
            <LinkGroup title="Source Code" links={team.links} />
          </div>
        </section>
      </div>
    </div>
  </main>
  );
};
