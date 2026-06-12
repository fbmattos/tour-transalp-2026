import { createContext, useContext } from 'react';

export type UnitSystem = 'imperial' | 'metric';

export interface UnitsContextValue {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
  toggleUnits: () => void;
  isImperial: boolean;
  distanceUnit: 'mi' | 'km';
  elevationUnit: 'ft' | 'm';
  /** Numeric distance in the active unit, from a canonical km value */
  distanceValue: (km: number, decimals?: number) => number;
  /** "71 mi" / "114 km". Pass the official mi value when one exists to avoid re-rounding. */
  formatDistance: (km: number, officialMi?: number, decimals?: number) => string;
  /** "6,342 ft" / "1,933 m". Pass the official ft value when one exists to avoid re-rounding. */
  formatElevation: (m: number, officialFt?: number) => string;
  /** Position marker along the route: "km 55" / "mi 34" */
  formatDistanceMark: (km: number) => string;
}

export const UnitsContext = createContext<UnitsContextValue | null>(null);

export const useUnits = (): UnitsContextValue => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error('useUnits must be used inside <UnitsProvider>');
  return ctx;
};
