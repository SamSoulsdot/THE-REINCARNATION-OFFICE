// Narrative Engine — registro dei casi e operazioni sul caso attivo
// (registrazione, lettura documenti, annotazione indizi, colloquio, confronto, enigmi).
import type { ActiveCase, CaseDef, ClueDef, ContradictionDef, DocDef, GameState, Incarnation, PuzzleDef, QueueItem, Soul, TopicDef } from './types';
import { CURATED } from '../content';
import { apply, check } from './cond';
import { grantKnowledge } from './knowledge';
import { hashString } from './rng';
import { makeProceduralCase } from './generator';
import { fmt } from './text';

export function isCurated(caseId: string): boolean {
  return caseId in CURATED;
}

export function procCaseId(soulId: string, incIndex: number): string {
  return `p:${soulId}:${incIndex}`;
}

export function getCaseDef(g: GameState, caseId: string): CaseDef {
  const entry = CURATED[caseId];
  if (entry) return typeof entry === 'function' ? entry(g) : entry;
  const [, soulId, idx] = caseId.split(':');
  const soul = g.souls[soulId];
  if (!soul) throw new Error('Caso senza anima a registro: ' + caseId);
  const inc = soul.incarnations[Number(idx) - 1];
  const prevDecision = [...g.decisions].reverse().find((d) => d.soulId === soulId && d.caseId !== caseId);
  const linkedDecision = inc.linked ? g.decisions.find((d) => d.soulName === inc.linked) : undefined;
  return makeProceduralCase(soul, inc, { caseId, day: g.day, mode: g.mode, prevDecision, linkedDecision });
}

/** Iscrive a registro l'anima di un caso curato (o aggiunge la nuova incarnazione a un'anima esistente). */
export function enrollCurated(g: GameState, caseId: string): Soul {
  const def = getCaseDef(g, caseId);
  let soul = g.souls[def.soulId];
  if (!def.incarnation) {
    if (!soul) throw new Error('Caso curato senza incarnazione: ' + caseId);
    return soul;
  }
  const base = { ...def.incarnation, name: fmt(g, def.incarnation.name), caseId } as Omit<Incarnation, 'index'>;
  if (!soul) {
    soul = { id: def.soulId, seed: hashString(def.soulId), curated: true, incarnations: [{ ...base, index: 1 }], status: 'in_arrivo', notes: [] };
    g.souls[def.soulId] = soul;
    return soul;
  }
  const last = soul.incarnations[soul.incarnations.length - 1];
  if (last.caseId === caseId) return soul;
  if (!last.decisionId) soul.incarnations[soul.incarnations.length - 1] = { ...base, index: last.index };
  else soul.incarnations.push({ ...base, index: last.index + 1 });
  soul.status = 'in_arrivo';
  return soul;
}

export function currentIncarnation(soul: Soul): Incarnation {
  return soul.incarnations[soul.incarnations.length - 1];
}

export function queueItem(g: GameState, caseId: string): QueueItem | undefined {
  return g.queue.find((q) => q.caseId === caseId);
}

export function openCase(g: GameState, caseId: string): ActiveCase {
  if (g.activeCase && g.activeCase.caseId !== caseId) throw new Error('C\'è già un caso aperto.');
  if (g.activeCase) return g.activeCase;
  const item = queueItem(g, caseId);
  if (!item || item.state === 'chiuso') throw new Error('Caso non in coda: ' + caseId);
  const def = getCaseDef(g, caseId);
  item.state = 'attivo';
  g.activeCase = { caseId, registered: false, docsRead: [], clues: [], asked: [], contradictions: [], puzzles: [] };
  const soul = g.souls[def.soulId];
  if (soul) soul.status = 'in_esame';
  apply(g, def.onOpen);
  return g.activeCase;
}

export function registerSoul(g: GameState): void {
  if (!g.activeCase) return;
  g.activeCase.registered = true;
}

export function visibleDocs(g: GameState, def: CaseDef): DocDef[] {
  return def.docs.filter((d) => check(g, d.cond));
}

export function docAvailable(g: GameState, d: DocDef): boolean {
  return !d.needFlag || g.flags[d.needFlag] === true;
}

export function readDoc(g: GameState, docId: string): void {
  const ac = g.activeCase;
  if (!ac) return;
  if (!ac.docsRead.includes(docId)) ac.docsRead.push(docId);
}

export function clueDef(def: CaseDef, id: string): ClueDef | undefined {
  return def.clues.find((c) => c.id === id);
}

/** Annota un indizio nel caso attivo. Restituisce true se è nuovo. */
export function noteClue(g: GameState, clueId: string): boolean {
  const ac = g.activeCase;
  if (!ac) return false;
  if (ac.clues.includes(clueId)) return false;
  const def = getCaseDef(g, ac.caseId);
  const c = clueDef(def, clueId);
  if (!c) return false;
  ac.clues.push(clueId);
  c.know?.forEach((k) => grantKnowledge(g, k));
  return true;
}

function has(ac: ActiveCase, ids?: string[]): boolean {
  return !ids || ids.every((i) => ac.clues.includes(i));
}

export function topicAvailable(g: GameState, def: CaseDef, t: TopicDef): boolean {
  const ac = g.activeCase;
  if (!ac) return false;
  if (!check(g, t.cond)) return false;
  if (!has(ac, t.needClues)) return false;
  if (t.needContra && !ac.contradictions.includes(t.needContra)) return false;
  if (t.needTopic && !ac.asked.includes(t.needTopic)) return false;
  return true;
}

export function availableTopics(g: GameState, def: CaseDef): TopicDef[] {
  return def.topics.filter((t) => topicAvailable(g, def, t));
}

export interface AskResult { topic: TopicDef; newClues: ClueDef[] }

export function askTopic(g: GameState, topicId: string): AskResult | null {
  const ac = g.activeCase;
  if (!ac) return null;
  const def = getCaseDef(g, ac.caseId);
  const t = def.topics.find((x) => x.id === topicId);
  if (!t || !topicAvailable(g, def, t)) return null;
  const first = !ac.asked.includes(topicId);
  if (first) ac.asked.push(topicId);
  const newClues: ClueDef[] = [];
  for (const cid of t.gives ?? []) {
    if (noteClue(g, cid)) {
      const c = clueDef(def, cid);
      if (c) newClues.push(c);
    }
  }
  if (first) apply(g, t.fx);
  return { topic: t, newClues };
}

/** Confronta due indizi: se la coppia è una contraddizione canonica del caso, la registra. */
export function compareClues(g: GameState, a: string, b: string): ContradictionDef | null {
  const ac = g.activeCase;
  if (!ac || a === b) return null;
  if (!ac.clues.includes(a) || !ac.clues.includes(b)) return null;
  const def = getCaseDef(g, ac.caseId);
  const x = def.contradictions.find((c) => (c.a === a && c.b === b) || (c.a === b && c.b === a));
  if (!x) return null;
  if (!ac.contradictions.includes(x.id)) ac.contradictions.push(x.id);
  return x;
}

export function puzzleAvailable(g: GameState, p: PuzzleDef): boolean {
  const ac = g.activeCase;
  if (!ac) return false;
  return check(g, p.cond) && has(ac, p.needClues);
}

export function normalizeAnswer(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9,]/g, '');
}

export function caesar(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26;
  return text.replace(/[A-Z]/g, (ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 - s + 26) % 26) + 65));
}

export function attemptPuzzle(g: GameState, puzzleId: string, answer: string): { ok: boolean; text: string } {
  const ac = g.activeCase;
  if (!ac) return { ok: false, text: '' };
  const def = getCaseDef(g, ac.caseId);
  const p = def.puzzles?.find((x) => x.id === puzzleId);
  if (!p || !puzzleAvailable(g, p)) return { ok: false, text: '' };
  const ok = normalizeAnswer(answer) === normalizeAnswer(p.solution);
  if (!ok) return { ok: false, text: p.failure };
  if (!ac.puzzles.includes(p.id)) {
    ac.puzzles.push(p.id);
    p.gives?.forEach((c) => noteClue(g, c));
    apply(g, p.fx);
  }
  return { ok: true, text: p.success };
}

export function truthFound(g: GameState, def: CaseDef): boolean {
  const ac = g.activeCase;
  return !!ac && !!def.truthClue && ac.clues.includes(def.truthClue);
}
