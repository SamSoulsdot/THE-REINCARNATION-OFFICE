// Bot di prova: gioca il gioco attraverso i soli motori (nessuna UI), come farebbe un giocatore.
import type { CaseDef, Destination, GameState, ReincarnationReport } from '../../src/engine/types';
import { askTopic, attemptPuzzle, availableTopics, compareClues, docAvailable, getCaseDef, noteClue, openCase, puzzleAvailable, readDoc, registerSoul, visibleDocs } from '../../src/engine/cases';
import { availableMotivations, availableSpecials, issueVerdict } from '../../src/engine/judgment';
import { attemptWorldPuzzle, npcPlans, npcTopics, objectConvo, readLore, roomEvents, sceneNext, startScene } from '../../src/engine/scene';
import { canEndDay, endDay, flushRequests, startDay, takePuzzleRequest } from '../../src/engine/campaign';
import { OBJECTS, DOORS, ROOMS, SPOTS, tileAt } from '../../src/world/map';
import { WORLD_PUZZLES } from '../../src/content';
import { check } from '../../src/engine/cond';

export interface Pick { dest: Destination; specialId?: string; conceal?: boolean }
export interface BotOpts {
  investigate: boolean;
  pick: (g: GameState, def: CaseDef, specials: string[]) => Pick;
  choice?: (convoId: string, options: string[]) => number;
  explore?: boolean;
  maxOptional?: number;
}

/** Raccoglie tutto ciò che è raccoglibile nel caso attivo, fino a punto fisso. */
export function investigate(g: GameState): void {
  const ac = g.activeCase!;
  for (let guard = 0; guard < 12; guard++) {
    const before = ac.clues.length + ac.contradictions.length + ac.asked.length + ac.puzzles.length;
    const def = getCaseDef(g, ac.caseId);
    for (const d of visibleDocs(g, def)) {
      if (!docAvailable(g, d)) continue;
      readDoc(g, d.id);
      for (const p of d.body) if (typeof p !== 'string') noteClue(g, p.clue);
    }
    for (const t of availableTopics(g, def)) if (!ac.asked.includes(t.id)) askTopic(g, t.id);
    for (const x of def.contradictions) compareClues(g, x.a, x.b);
    for (const p of def.puzzles ?? []) if (puzzleAvailable(g, p) && !ac.puzzles.includes(p.id)) attemptPuzzle(g, p.id, p.solution);
    if (ac.clues.length + ac.contradictions.length + ac.asked.length + ac.puzzles.length === before) break;
  }
}

export function solveCase(g: GameState, caseId: string, opts: BotOpts): ReincarnationReport {
  openCase(g, caseId);
  registerSoul(g);
  if (opts.investigate) investigate(g);
  const def = getCaseDef(g, caseId);
  const specials = availableSpecials(g, def).map((s) => s.id);
  const pick = opts.pick(g, def, specials);
  const ac = g.activeCase!;
  const mot = availableMotivations(g, def, pick.dest);
  const evidence = ac.clues.filter((c) => def.clues.find((x) => x.id === c)?.status === 'verificato');
  return issueVerdict(g, { dest: pick.dest, specialId: pick.specialId, motivationId: mot[0]?.id ?? 'g_regola', evidence, conceal: !!pick.conceal });
}

export function runConvo(g: GameState, convoId: string, opts: BotOpts): void {
  const st = startScene(convoId);
  let item = sceneNext(g, st);
  for (let guard = 0; guard < 200 && item.kind !== 'end'; guard++) {
    if (item.kind === 'choice') item = sceneNext(g, st, opts.choice ? opts.choice(convoId, item.options) : 0);
    else {
      if (item.kind === 'doc') readLore(g, item.id);
      item = sceneNext(g, st);
    }
  }
  const pz = takePuzzleRequest(g);
  if (pz) {
    const def = WORLD_PUZZLES.find((p) => p.id === pz)!;
    if (opts.investigate) attemptWorldPuzzle(g, pz, def.solution);
  }
}

function areaOf(x: number, y: number): string | undefined {
  return tileAt(x, y)?.area;
}

/** Esplora tutto ciò che è raggiungibile: stanze, personaggi presenti, oggetti. */
export function explore(g: GameState, opts: BotOpts): void {
  for (let pass = 0; pass < 3; pass++) {
    for (const r of ROOMS) if (g.areas.includes(r.area)) for (const c of roomEvents(g, r.id)) runConvo(g, c.id, opts);
    for (const p of npcPlans(g)) {
      const spot = SPOTS[p.spot];
      if (p.state === 'Unavailable' || !spot || !g.areas.includes(areaOf(spot.x, spot.y) ?? '')) continue;
      for (let i = 0; i < 12; i++) {
        const t = npcTopics(g, p.id).find((c) => !g.convSeen[c.id]);
        if (!t) break;
        runConvo(g, t.id, opts);
      }
    }
    const things = [...OBJECTS.map((o) => ({ id: o.id, x: o.x, y: o.y, cond: o.cond })), ...DOORS.filter((d) => d.interact).map((d) => ({ id: d.id, x: d.x, y: d.y, cond: undefined }))];
    for (const o of things) {
      if (!check(g, o.cond)) continue;
      const a = areaOf(o.x, o.y);
      const reachable = a && (g.areas.includes(a) || (o.id === 'cancello_riservato' && g.areas.includes('archive')) || (o.id === 'porta_direttore' && g.areas.includes('management')));
      if (!reachable) continue;
      const c = objectConvo(g, o.id);
      if (c && (g.convSeen[c.id] ?? 0) < 2) runConvo(g, c.id, opts);
    }
    flushRequests(g);
  }
}

export function playDay(g: GameState, opts: BotOpts): void {
  startDay(g);
  if (opts.explore !== false) explore(g, opts);
  const processQueue = () => {
    let optional = 0;
    for (let guard = 0; guard < 20; guard++) {
      const item = g.queue.find((q) => q.state !== 'chiuso' && (q.mandatory || optional < (opts.maxOptional ?? 99)));
      if (!item) break;
      if (!item.mandatory) optional++;
      solveCase(g, item.caseId, opts);
    }
  };
  processQueue();
  if (opts.explore !== false) explore(g, opts);
  processQueue();
  if (opts.explore !== false) explore(g, opts);
  const end = canEndDay(g);
  if (!end.ok) throw new Error(`Giorno ${g.day}: impossibile chiudere il turno: ${end.missing.join(' | ')}`);
  if (g.ending === null && !(g.mode === 'campaign' && g.flags['closed_c13'])) endDay(g);
}
