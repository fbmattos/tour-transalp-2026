import React, { useCallback, useMemo, useState } from 'react';
import { UnitsContext, type UnitsContextValue, type UnitSystem } from './UnitsContext';

const STORAGE_KEY = 'tt2026-units';
const MI_PER_KM = 0.621371;
const FT_PER_M = 3.28084;

const readStoredUnits = (): UnitSystem => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'imperial' || stored === 'metric') return stored;
  } catch {
    // localStorage unavailable (private mode, etc.) — fall through to default
  }
  return 'imperial';
};

export const UnitsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [units, setUnitsState] = useState<UnitSystem>(readStoredUnits);

  const setUnits = useCallback((next: UnitSystem) => {
    setUnitsState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference simply won't persist
    }
  }, []);

  const value = useMemo<UnitsContextValue>(() => {
    const isImperial = units === 'imperial';

    const distanceValue = (km: number, decimals = 0) => {
      const raw = isImperial ? km * MI_PER_KM : km;
      const factor = 10 ** decimals;
      return Math.round(raw * factor) / factor;
    };

    return {
      units,
      setUnits,
      toggleUnits: () => setUnits(isImperial ? 'metric' : 'imperial'),
      isImperial,
      distanceUnit: isImperial ? 'mi' : 'km',
      elevationUnit: isImperial ? 'ft' : 'm',
      distanceValue,
      formatDistance: (km, officialMi, decimals = 0) => {
        const v = isImperial ? officialMi ?? distanceValue(km, decimals) : km;
        return `${v.toLocaleString()} ${isImperial ? 'mi' : 'km'}`;
      },
      formatElevation: (m, officialFt) => {
        const v = isImperial ? officialFt ?? Math.round(m * FT_PER_M) : m;
        return `${v.toLocaleString()} ${isImperial ? 'ft' : 'm'}`;
      },
      formatDistanceMark: (km) =>
        isImperial ? `mi ${distanceValue(km, 1).toLocaleString()}` : `km ${km.toLocaleString()}`,
    };
  }, [units, setUnits]);

  return <UnitsContext.Provider value={value}>{children}</UnitsContext.Provider>;
};
