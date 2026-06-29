import { stages } from '../src/data/stages';
import {
  resolveStageIdFromUrl,
  STAGE_URL_PARAM,
  syncStageNumberToUrl,
} from '../src/utils/stageUrl';

describe('stageUrl', () => {
  describe('resolveStageIdFromUrl', () => {
    it('defaults to the first stage when the param is missing', () => {
      expect(resolveStageIdFromUrl(stages, '')).toBe(stages[0].id);
    });

    it('selects a stage by number from the query string', () => {
      const stageTwo = stages.find((stage) => stage.stageNumber === 2)!;

      expect(resolveStageIdFromUrl(stages, '?stage=2')).toBe(stageTwo.id);
    });

    it('falls back to the first stage for invalid values', () => {
      expect(resolveStageIdFromUrl(stages, '?stage=0')).toBe(stages[0].id);
      expect(resolveStageIdFromUrl(stages, '?stage=99')).toBe(stages[0].id);
      expect(resolveStageIdFromUrl(stages, '?stage=abc')).toBe(stages[0].id);
    });
  });

  describe('syncStageNumberToUrl', () => {
    beforeEach(() => {
      window.history.replaceState(null, '', '/');
    });

    it('writes the stage number into the URL', () => {
      syncStageNumberToUrl(3);

      expect(window.location.search).toBe(`?${STAGE_URL_PARAM}=3`);
    });

    it('does not change the URL when the stage param is already set', () => {
      syncStageNumberToUrl(3);
      const hrefAfterFirst = window.location.href;

      syncStageNumberToUrl(3);

      expect(window.location.href).toBe(hrefAfterFirst);
    });
  });
});
