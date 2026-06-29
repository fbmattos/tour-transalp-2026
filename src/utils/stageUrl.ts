import type { Stage } from '../data/stages';

export const STAGE_URL_PARAM = 'stage';

export function resolveStageIdFromUrl(
  stages: Stage[],
  search = window.location.search,
): string {
  const param = new URLSearchParams(search).get(STAGE_URL_PARAM);
  if (!param) return stages[0].id;

  const stageNumber = Number(param);
  if (!Number.isInteger(stageNumber) || stageNumber < 1) return stages[0].id;

  return stages.find((stage) => stage.stageNumber === stageNumber)?.id ?? stages[0].id;
}

export function syncStageNumberToUrl(stageNumber: number): void {
  const url = new URL(window.location.href);
  if (url.searchParams.get(STAGE_URL_PARAM) === String(stageNumber)) return;

  url.searchParams.set(STAGE_URL_PARAM, String(stageNumber));
  window.history.replaceState(null, '', url);
}
