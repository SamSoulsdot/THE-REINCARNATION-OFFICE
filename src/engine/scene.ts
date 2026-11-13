// Esecutore di scene (dialoghi, esami di oggetti, eventi di stanza) e selezione delle conversazioni.
import type { ChoiceOpt, Convo, GameState, Line, LoreDoc } from './types';
import { CONVOS, ENDLESS_BARKS, LORE, NPCS, ROOM_EVENTS, SPEAKERS, WORLD_PUZZLES } from '../content';
import { apply, check } from './cond';
import { fmt } from './text';
import { Rng, mixSeed } from './rng';

const BY_ID = new Map(CONVOS.map((c) => [c.id, c]));
/** Conversazioni legate alla trama della campagna: escluse in Endless. */
const CAMPAIGN_ONLY = new Set(['o_fascicolo7', 'o_direttore', 'o_scrivania_ilse', 'o_apparecchio', 'o_reg_sosp', 'ev_rientrato', 'ev_quill_arrivo', 'o_cassetto', 'o_bones_desk', 'o_schedario']);

export interface SceneState {
  convoId: string;
  stack: { lines: Line[]; i: number }[];
  pending: ChoiceOpt[] | null;
  done: boolean;
}

export type SceneItem =
  | { kind: 'line'; speakerId: string; speaker: string; text: string }
  | { kind: 'choice'; options: string[] }
  | { kind: 'doc'; id: string }
  | { kind: 'ui'; action: string }
  | { kind: 'end' };

export function getConvo(id: string): Convo | undefined {
  return BY_ID.get(id);
}

export function startScene(convoId: string, lines?: Line[]): SceneState {
  const c = BY_ID.get(convoId);
  return { convoId, stack: [{ lines: lines ?? c?.lines ?? [], i: 0 }], pending: null, done: false };
}

/** Avanza la scena. Se era in attesa di una scelta, `choice` è l'indice dell'opzione selezionata. */
export function sceneNext(g: GameState, st: SceneState, choice?: number): SceneItem {
  if (st.pending) {
    const opt = st.pending[choice ?? 0];
    st.pending = null;
    if (opt) {
      apply(g, opt.fx);
      if (opt.lines?.length) st.stack.push({ lines: opt.lines, i: 0 });
    }
  }
  for (;;) {
    const top = st.stack[st.stack.length - 1];
    if (!top) {
      if (!st.done) {
        st.done = true;
        g.convSeen[st.convoId] = (g.convSeen[st.convoId] ?? 0) + 1;
      }
      return { kind: 'end' };
    }
    if (top.i >= top.lines.length) {
      st.stack.pop();
      continue;
    }
    const line = top.lines[top.i++];
    if ('s' in line) return { kind: 'line', speakerId: line.s, speaker: SPEAKERS[line.s] ?? '', text: fmt(g, line.t) };
    if ('fx' in line) {
      apply(g, line.fx);
      continue;
    }
    if ('if' in line) {
      const branch = check(g, line.if) ? line.then : line.else;
      if (branch?.length) st.stack.push({ lines: branch, i: 0 });
      continue;
    }
    if ('doc' in line) return { kind: 'doc', id: line.doc };
    if ('ui' in line) return { kind: 'ui', action: line.ui };
    if ('choice' in line) {
      const opts = line.choice.filter((o) => check(g, o.cond));
      if (opts.length === 0) continue;
      st.pending = opts;
      return { kind: 'choice', options: opts.map((o) => fmt(g, o.t)) };
    }
  }
}

function usable(g: GameState, c: Convo): boolean {
  if (g.mode === 'endless' && CAMPAIGN_ONLY.has(c.id)) return false;
  if (c.once && g.convSeen[c.id]) return false;
  return check(g, c.cond);
}

/** Argomenti disponibili con un personaggio, ordinati per priorità. */
export function npcTopics(g: GameState, npcId: string): Convo[] {
  if (g.mode === 'endless') return [];
  return CONVOS.filter((c) => c.npc === npcId && usable(g, c)).sort((a, b) => (b.prio ?? 0) - (a.prio ?? 0));
}

/** Conversazione che parte da sola quando si rivolge la parola al personaggio (presentazioni, urgenze). */
export function npcAutoConvo(g: GameState, npcId: string): Convo | undefined {
  return npcTopics(g, npcId).find((c) => (c.prio ?? 0) >= 90 && !g.convSeen[c.id]);
}

export function endlessBark(g: GameState, npcId: string): string {
  const pool = ENDLESS_BARKS[npcId] ?? ['Non alza la testa dal lavoro.'];
  const n = (g.convSeen['bark:' + npcId] = (g.convSeen['bark:' + npcId] ?? 0) + 1);
  return new Rng(mixSeed(g.seed, npcId, g.day, n)).pick(pool);
}

export function objectConvo(g: GameState, objId: string): Convo | undefined {
  return CONVOS.filter((c) => c.obj === objId && usable(g, c)).sort((a, b) => (b.prio ?? 0) - (a.prio ?? 0))[0];
}

export function roomEvents(g: GameState, roomId: string): Convo[] {
  return ROOM_EVENTS.filter((e) => e.room === roomId)
    .map((e) => BY_ID.get(e.convo))
    .filter((c): c is Convo => !!c && usable(g, c));
}

export interface LoreView { title: string; source: string; kind: LoreDoc['kind']; body: string[]; changed: boolean }

/** Legge un documento d'ambiente. Dalla seconda consultazione alcuni documenti cambiano. */
export function readLore(g: GameState, id: string): LoreView | null {
  const d = LORE.find((x) => x.id === id);
  if (!d) return null;
  const seen = g.docsSeen[id] ?? 0;
  const useAlt = !!d.altBody && seen >= 1 && check(g, d.altCond);
  g.docsSeen[id] = seen + 1;
  if (useAlt) {
    if (!g.flags['lorealt_' + id]) {
      g.flags['lorealt_' + id] = true;
      apply(g, d.altFx);
    }
  } else if (seen === 0) apply(g, d.fx);
  return { title: d.title, source: d.source, kind: d.kind, body: (useAlt ? d.altBody! : d.body).map((t) => fmt(g, t)), changed: useAlt };
}

// --- Routine dei personaggi ---
export interface NpcPlan { id: string; spot: string; state: 'Working' | 'Moving' | 'Talking' | 'Resting' | 'Unavailable' }

export function npcPlans(g: GameState): NpcPlan[] {
  const out: NpcPlan[] = [];
  for (const n of NPCS) {
    if (!check(g, n.cond)) continue;
    if (g.mode === 'endless' && (n.id === 'quill' || n.id === 'tea' || n.id === 'sabina')) continue;
    if ((g.npc[n.id] ?? 'attivo') !== 'attivo' && !(n.id === 'ilse' && g.flags['ilse_torchi'])) continue;
    const r = n.routine.find((x) => (!x.phase || x.phase.includes(g.phase)) && check(g, x.cond));
    if (!r) continue;
    out.push({ id: n.id, spot: r.spot, state: r.state });
  }
  return out;
}

export const STATE_LABEL: Record<NpcPlan['state'], string> = {
  Working: 'al lavoro', Moving: 'in giro per il reparto', Talking: 'sta parlando', Resting: 'in pausa', Unavailable: 'non disponibile',
};

// --- Enigmi ambientali ---
export function worldPuzzle(id: string) {
  return WORLD_PUZZLES.find((p) => p.id === id);
}

export function attemptWorldPuzzle(g: GameState, id: string, answer: string): { ok: boolean; text: string } {
  const p = worldPuzzle(id);
  if (!p) return { ok: false, text: '' };
  const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (norm(answer) !== norm(p.solution)) return { ok: false, text: p.failure };
  if (!g.flags['puzzle_' + id]) {
    g.flags['puzzle_' + id] = true;
    apply(g, p.fx);
  }
  return { ok: true, text: p.success };
}
