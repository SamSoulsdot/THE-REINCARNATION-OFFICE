// Sistema di conoscenza: registra ciò che il giocatore scopre e gestisce
// i collegamenti investigativi. Non rivela mai soluzioni: le deduzioni restano al giocatore.
import type { GameState, KnowledgeDef, LinkDef, MysteryDef } from './types';
import { KNOWLEDGE, LINKS, MYSTERIES } from '../content';
import { apply, check } from './cond';

export function grantKnowledge(g: GameState, id: string): boolean {
  if (g.knowledge[id]) return false;
  g.knowledge[id] = { day: g.day, isNew: true };
  return true;
}

export function knowledgeList(g: GameState): (KnowledgeDef & { day: number; isNew: boolean })[] {
  const out: (KnowledgeDef & { day: number; isNew: boolean })[] = [];
  for (const [id, st] of Object.entries(g.knowledge)) {
    const def = KNOWLEDGE[id];
    if (def) out.push({ ...def, day: st.day, isNew: st.isNew });
  }
  return out.sort((a, b) => a.day - b.day);
}

export function markSeen(g: GameState, id: string): void {
  if (g.knowledge[id]) g.knowledge[id].isNew = false;
}

export function findLink(a: string, b: string): LinkDef | undefined {
  return LINKS.find((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a));
}

export interface LinkResult { ok: boolean; link?: LinkDef; already?: boolean }

/** Tenta un collegamento tra due voci del diario. Solo coppie con un nesso canonico vengono confermate. */
export function tryLink(g: GameState, a: string, b: string): LinkResult {
  g.linkAttempts++;
  if (a === b || !g.knowledge[a] || !g.knowledge[b]) return { ok: false };
  const link = findLink(a, b);
  if (!link) return { ok: false };
  if (g.links.includes(link.id)) return { ok: true, link, already: true };
  g.links.push(link.id);
  apply(g, link.fx);
  return { ok: true, link };
}

export interface MysteryView {
  def: MysteryDef;
  open: boolean;
  solved: boolean;
  notes: string[];
}

export function mysteryViews(g: GameState): MysteryView[] {
  return MYSTERIES.map((def) => ({
    def,
    open: check(g, def.intro),
    solved: check(g, def.solved),
    notes: def.stages.filter((s) => check(g, s.cond)).map((s) => s.text),
  }));
}

export function solvedMysteries(g: GameState): number {
  return MYSTERIES.filter((m) => check(g, m.solved)).length;
}
