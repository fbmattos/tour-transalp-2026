import { describe, it, expect } from 'vitest';
import { parseGpxTrack } from '../src/utils/gpx';

// DOMParser mock for Vitest/JSDOM if needed (JSDOM usually provides it)

describe('GPX Elevation Smoothing', () => {
  const createGpx = (elevations: number[]) => {
    const points = elevations.map((ele, i) => `
      <trkpt lat="${47.0 + i * 0.001}" lon="${11.0 + i * 0.001}">
        <ele>${ele}</ele>
      </trkpt>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Test">
  <trk>
    <trkseg>
      ${points}
    </trkseg>
  </trk>
</gpx>`.trim();
  };

  it('calculates elevation gain without smoothing for large changes', () => {
    const gpx = createGpx([100, 110, 120]);
    const result = parseGpxTrack(gpx);
    // 100 -> 110 (+10), 110 -> 120 (+10). Total = 20
    expect(result.stats.totalElevationGainM).toBe(20);
  });

  it('ignores jitter below the 2-meter threshold', () => {
    const gpx = createGpx([100, 101, 100, 101, 102]);
    const result = parseGpxTrack(gpx);
    // Threshold is 2m.
    // 100 (anchor)
    // 101: diff 1 < 2. Ignore.
    // 100: diff -1 > -2. Ignore.
    // 101: diff 1 < 2. Ignore.
    // 102: diff 2 >= 2. Gain += 2. Anchor = 102.
    // Total should be 2.
    // Without smoothing it would be 1 + 1 + 1 = 3.
    expect(result.stats.totalElevationGainM).toBe(2);
  });

  it('accumulates gain when threshold is met', () => {
    const gpx = createGpx([100, 103, 106]);
    const result = parseGpxTrack(gpx);
    // 100 -> 103 (+3, > 2). Gain = 3, Anchor = 103.
    // 103 -> 106 (+3, > 2). Gain = 6, Anchor = 106.
    expect(result.stats.totalElevationGainM).toBe(6);
  });

  it('resets anchor on significant descent', () => {
    const gpx = createGpx([100, 101, 95, 97]);
    const result = parseGpxTrack(gpx);
    // 100 (anchor)
    // 101: diff 1 < 2.
    // 95: diff -5 <= -2. Anchor = 95.
    // 97: diff 2 >= 2. Gain += 2. Anchor = 97.
    expect(result.stats.totalElevationGainM).toBe(2);
  });
});
