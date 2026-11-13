// Valutazione di condizioni ed applicazione di effetti: unico punto in cui
// dialoghi, oggetti, casi e campagna leggono/modificano lo stato narrativo.
import type { Cond, Effects, GameState, StatKey } from './types';
import { grantKnowledge } from './knowledge';

export function hasFlag(g: GameState, f: string): boolean {
  return g.flags[f] === true;
}

export function check(g: GameState, c?: Cond): boolean {
  if (!c) return true;
  if (c.all && !c.all.every((x) => check(g, x))) return false;
  if (c.any && !c.any.some((x) => check(g, x))) return false;
  if (c.not && check(g, c.not)) return false;
  if (c.flag && !hasFlag(g, c.flag)) return false;
  if (c.know && !g.knowledge[c.know]) return false;
  if (c.link && !g.links.includes(c.link)) return false;
  if (c.dayMin !== undefined && g.day < c.dayMin) return false;
  if (c.dayMax !== undefined && g.day > c.dayMax) return false;
  if (c.chapterMin !== undefined && g.chapter < c.chapterMin) return false;
  if (c.chapterMax !== undefined && g.chapter > c.chapterMax) return false;
  if (c.phaseMin !== undefined && g.phase < c.phaseMin) return false;
  if (c.phaseMax !== undefined && g.phase > c.phaseMax) return false;
  if (c.relMin && (g.rel[c.relMin[0]] ?? 0) < c.relMin[1]) return false;
  if (c.relMax && (g.rel[c.relMax[0]] ?? 0) > c.relMax[1]) return false;
  if (c.statMin && g.stats[c.statMin[0]] < c.statMin[1]) return false;
  if (c.statMax && g.stats[c.statMax[0]] > c.statMax[1]) return false;
  if (c.verdict) {
    const d = g.decisions.find((x) => x.caseId === c.verdict![0]);
    if (!d) return false;
    const dest = d.revised?.to ?? d.destination;
    if (c.verdict[1] !== 'any' && dest !== c.verdict[1]) return false;
  }
  if (c.clue) {
    const [caseId, clueId] = c.clue;
    const inActive = g.activeCase?.caseId === caseId && g.activeCase.clues.includes(clueId);
    const inClosed = g.closed[caseId]?.clues.includes(clueId) ?? false;
    if (!inActive && !inClosed) return false;
  }
  if (c.npc && (g.npc[c.npc[0]] ?? 'attivo') !== c.npc[1]) return false;
  if (c.tool && !g.tools.includes(c.tool)) return false;
  if (c.area && !g.areas.includes(c.area)) return false;
  if (c.mode && g.mode !== c.mode) return false;
  if (c.staffRole && !g.staff.some((s) => s.role === c.staffRole)) return false;
  if (c.creditsMin !== undefined && g.credits < c.creditsMin) return false;
  if (c.seen && !g.convSeen[c.seen]) return false;
  return true;
}

const STAT_BOUNDS: Record<StatKey, [number, number]> = {
  efficienza: [0, 100],
  morale: [0, 100],
  pendenti: [0, 999],
  reputazione: [0, 100],
  irregolari: [0, 9999],
  ricorsi: [0, 9999],
  anomalie: [0, 9999],
  sospetto: [0, 100],
};

export function addStat(g: GameState, k: StatKey, d: number): void {
  const [lo, hi] = STAT_BOUNDS[k];
  g.stats[k] = Math.max(lo, Math.min(hi, Math.round(g.stats[k] + d)));
}

export function apply(g: GameState, fx?: Effects): void {
  if (!fx) return;
  fx.flags?.forEach((f) => (g.flags[f] = true));
  fx.unflag?.forEach((f) => delete g.flags[f]);
  fx.know?.forEach((k) => grantKnowledge(g, k));
  if (fx.rel) for (const [k, v] of Object.entries(fx.rel)) g.rel[k] = Math.max(-10, Math.min(10, (g.rel[k] ?? 0) + v));
  if (fx.credits) g.credits = Math.max(0, g.credits + fx.credits);
  if (fx.stats) for (const [k, v] of Object.entries(fx.stats)) addStat(g, k as StatKey, v as number);
  fx.areas?.forEach((a) => {
    if (!g.areas.includes(a)) g.areas.push(a);
  });
  if (fx.vars) for (const [k, v] of Object.entries(fx.vars)) g.vars[k] = (g.vars[k] ?? 0) + v;
  if (fx.npcStatus) for (const [k, v] of Object.entries(fx.npcStatus)) g.npc[k] = v;
  if (fx.soulStatus) for (const [k, v] of Object.entries(fx.soulStatus)) if (g.souls[k]) g.souls[k].status = v;
  fx.tools?.forEach((t) => {
    if (!g.tools.includes(t)) g.tools.push(t);
  });
  if (fx.queue) for (const id of fx.queue) g.vars['queue:' + id] = 1;
  if (fx.ending) g.ending = fx.ending;
  if (fx.openCase) g.vars['@open'] = 1, (g.flags['@open:' + fx.openCase] = true);
  if (fx.puzzle) g.flags['@puzzle:' + fx.puzzle] = true;
}
