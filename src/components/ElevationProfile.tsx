import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine,
} from 'recharts';
import type { Stage } from '../data/stages';
import type { GpxStatus } from '../hooks/useGpxStages';
import { climbCategoryMeta, type ProfileClimb } from '../utils/profileClimbs';

interface Props {
  stage: Stage & {
    gpxStatus?: GpxStatus;
    profileClimbs?: ProfileClimb[];
  };
}

interface ElevationTooltipPayload {
  value: number;
}

const shortClimbName = (name: string) => name.replace(/\s*\(.+\)/, '');

const climbDataKey = (climb: ProfileClimb) => `climb_${climb.id.replace(/[^a-zA-Z0-9_]/g, '_')}`;

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: ElevationTooltipPayload[];
  label?: number;
  stage: Stage & {
    profileClimbs?: ProfileClimb[];
  };
}> = ({
  active,
  payload,
  label,
  stage,
}) => {
  if (active && payload && payload.length) {
    const nearbyClimb = stage.profileClimbs?.find(
      (climb) =>
        Number(label) >= climb.startKm - 1 &&
        Number(label) <= climb.summitKm + 1
    );

    return (
      <div className="bg-slate-800/90 border border-white/20 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-white/60 mb-0.5">{label} km</p>
        <p className="text-emerald-300 font-semibold">{payload[0].value.toLocaleString()} m</p>
        <p className="text-white/40">{Math.round(payload[0].value * 3.281).toLocaleString()} ft</p>
        {nearbyClimb && (
          <div className="mt-2 border-t border-white/10 pt-2">
            <p className="font-semibold" style={{ color: nearbyClimb.color }}>{shortClimbName(nearbyClimb.name)}</p>
            <p className="text-white/45">
              {nearbyClimb.durationMinutesAt1000Vam} min · {nearbyClimb.category} · {nearbyClimb.summitElevationM.toLocaleString()} m
            </p>
            <p className="text-white/35">
              {nearbyClimb.gainM.toLocaleString()} m up · {nearbyClimb.avgGradient}% · {nearbyClimb.lengthMi} mi
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export const ElevationProfile: React.FC<Props> = ({ stage }) => {
  const data = stage.elevationProfile;
  const profileClimbs = stage.profileClimbs ?? [];
  const chartData = data.map((point) => {
    const climbValues = Object.fromEntries(
      profileClimbs.map((climb) => [
        climbDataKey(climb),
        point.distance >= climb.startKm && point.distance <= climb.summitKm ? point.elevation : null,
      ])
    );

    return {
      ...point,
      ...climbValues,
    };
  });
  const minEl = Math.min(...data.map((d) => d.elevation));
  const maxEl = Math.max(...data.map((d) => d.elevation));
  const maxDistance = Math.max(stage.distanceKm, data[data.length - 1]?.distance ?? stage.distanceKm);

  // Build gradient stops based on elevation — higher = more red
  const gradientId = `grad-${stage.id}`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-white/80 tracking-wide uppercase">
          Elevation Profile
        </h3>
        <div className="flex flex-wrap justify-end gap-x-4 gap-y-1 text-xs text-white/50">
          <span>↑ {maxEl.toLocaleString()} m peak</span>
          <span>↓ {minEl.toLocaleString()} m low</span>
          <span className="text-white/30 italic">
            {stage.gpxStatus === 'loaded'
              ? 'GPX-derived profile'
              : stage.gpxStatus === 'error'
              ? 'Fallback preview profile'
              : 'Loading GPX profile'}
          </span>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2 text-[10px] text-white/50">
        {Object.values(climbCategoryMeta).map((category) => (
          <div key={category.label} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: category.color }}
            />
            <span className="font-semibold text-white/65">{category.label}</span>
            <span>{category.range}</span>
          </div>
        ))}
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 28, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number"
              dataKey="distance"
              domain={[0, maxDistance]}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[Math.max(0, minEl - 100), maxEl + 100]}
              tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
              width={50}
            />
            <Tooltip content={<CustomTooltip stage={stage} />} />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#34d399"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: '#34d399', stroke: '#fff', strokeWidth: 1 }}
            />
            {profileClimbs.map((climb) => (
              <Area
                key={`${climb.id}-overlay`}
                type="monotone"
                dataKey={climbDataKey(climb)}
                stroke={climb.color}
                strokeWidth={2.4}
                fill={climb.color}
                fillOpacity={0.22}
                dot={false}
                activeDot={false}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
            {profileClimbs.map((climb) => (
              <React.Fragment key={climb.id}>
                <ReferenceLine
                  x={climb.summitKm}
                  stroke={climb.color}
                  strokeDasharray="2 4"
                  strokeOpacity={0.55}
                />
                <ReferenceDot
                  x={climb.summitKm}
                  y={climb.summitElevationM}
                  r={4.8}
                  fill={climb.color}
                  stroke="#fff"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {profileClimbs.length > 0 && (
        <div className="mt-3 grid grid-cols-1 gap-2">
          {profileClimbs.map((climb) => (
            <div
              key={climb.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-white">{shortClimbName(climb.name)}</p>
                <p className="text-[10px] text-white/40">
                  km {climb.startKm}-{climb.summitKm} · {climb.durationMinutesAt1000Vam} min at 1000 m/h VAM
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2 text-[10px]">
                <span
                  className="rounded-full px-2 py-0.5 font-bold text-slate-950"
                  style={{ backgroundColor: climb.color }}
                >
                  {climb.category}
                </span>
                <span className="text-white/55">
                  {climb.gainM.toLocaleString()} m up · {climb.avgGradient}% · {climb.lengthMi} mi
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
