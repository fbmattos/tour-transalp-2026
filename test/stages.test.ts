import { stages } from '../src/data/stages';

const expectPositiveNumber = (value: number, field: string) => {
  expect(Number.isFinite(value), field).toBe(true);
  expect(value, field).toBeGreaterThan(0);
};

describe('stage data integrity', () => {
  it('has at least one stage', () => {
    expect(stages.length).toBeGreaterThan(0);
  });

  it('has unique stage ids', () => {
    const ids = stages.map((stage) => stage.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has required route, naming, and numeric data for each stage', () => {
    for (const stage of stages) {
      expect(stage.id).toEqual(expect.any(String));
      expect(stage.id.trim()).not.toBe('');
      expect(stage.start.trim()).not.toBe('');
      expect(stage.finish.trim()).not.toBe('');

      expectPositiveNumber(stage.stageNumber, `${stage.id}.stageNumber`);

      // Rest days carry no route and zero distance; riding stages must be fully populated.
      if (stage.isRestDay) {
        expect(stage.gpxFile).toBe('');
        expect(stage.distanceKm).toBe(0);
        expect(stage.distanceMi).toBe(0);
      } else {
        expect(stage.gpxFile.trim()).toMatch(/^\/gpx\/.+\.gpx$/);
        expectPositiveNumber(stage.distanceKm, `${stage.id}.distanceKm`);
        expectPositiveNumber(stage.distanceMi, `${stage.id}.distanceMi`);
        expectPositiveNumber(stage.elevationM, `${stage.id}.elevationM`);
        expectPositiveNumber(stage.elevationFt, `${stage.id}.elevationFt`);
        expectPositiveNumber(stage.difficultyScore, `${stage.id}.difficultyScore`);
        expect(stage.routeCoordinates.length, `${stage.id}.routeCoordinates`).toBeGreaterThanOrEqual(2);
      }

      expect(stage.elevationProfile.length, `${stage.id}.elevationProfile`).toBeGreaterThanOrEqual(2);
      expect(stage.startCoord).toHaveLength(2);
      expect(stage.finishCoord).toHaveLength(2);

      for (const [lat, lng] of [stage.startCoord, stage.finishCoord, ...stage.routeCoordinates]) {
        expect(Number.isFinite(lat), `${stage.id}.latitude`).toBe(true);
        expect(Number.isFinite(lng), `${stage.id}.longitude`).toBe(true);
      }
    }
  });
});
