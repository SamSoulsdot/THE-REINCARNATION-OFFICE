import type { CaseDef, GameState } from '../../../engine/types';
import { C01, C02, C03 } from './chapter1';
import { C04, C05, C06 } from './chapter2';
import { C07, C08, C09 } from './chapter3';
import { C10, C11, C12, C13 } from './chapter45';

export type CuratedEntry = CaseDef | ((g: GameState) => CaseDef);

export const CURATED: Record<string, CuratedEntry> = {
  c01: C01, c02: C02, c03: C03, c04: C04, c05: C05, c06: C06, c07: C07,
  c08: C08, c09: C09, c10: C10, c11: C11, c12: C12, c13: C13,
};
export const CURATED_IDS = Object.keys(CURATED);
