import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Stage } from '../data/stages';

interface Props {
  stage: Stage;
}

// TODO: Replace mock elevation data with real GPX-derived profiles

interface ElevationTooltipPayload {
  value: number;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: ElevationTooltipPayload[]; label?: number }> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 border border-white/20 rounded-lg px-3 py-2 text-xs shadow-xl">
        <p className="text-white/60 mb-0.5">{label} km</p>
        <p className="text-emerald-300 font-semibold">{payload[0].value.toLocaleString()} m</p>
        <p className="text-white/40">{Math.round(payload[0].value * 3.281).toLocaleString()} ft</p>
      </div>
    );
  }
  return null;
};

export const ElevationProfile: React.FC<Props> = ({ stage }) => {
  const data = stage.elevationProfile;
  const minEl = Math.min(...data.map((d) => d.elevation));
  const maxEl = Math.max(...data.map((d) => d.elevation));

  // Build gradient stops based on elevation — higher = more red
  const gradientId = `grad-${stage.id}`;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/80 tracking-wide uppercase">
          Elevation Profile
        </h3>
        <div className="flex gap-4 text-xs text-white/50">
          <span>↑ {maxEl.toLocaleString()} m peak</span>
          <span>↓ {minEl.toLocaleString()} m low</span>
          <span className="text-white/30 italic">
            {/* TODO: replace with real GPX note */}
            Mock profile — awaiting GPX
          </span>
        </div>
      </div>

      <div className="h-36">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="distance"
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#34d399"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 4, fill: '#34d399', stroke: '#fff', strokeWidth: 1 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
