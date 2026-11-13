// Persistence Layer — schema versionato, validazione, migrazioni, checksum.
// Nessuna dipendenza dal browser: testabile in Node.
import type { GameState } from '../engine/types';
import { SCHEMA_VERSION } from '../engine/types';

export const SAVE_FORMAT = 'reincarnation-office-save';

export interface SaveMeta {
  playerName: string;
  mode: 'campaign' | 'endless';
  day: number;
  chapter: number;
  playSeconds: number;
  credits: number;
  cases: number;
  ending: string | null;
}

export interface SaveFile {
  format: typeof SAVE_FORMAT;
  schema: number;
  savedAt: string;
  slot: string;
  meta: SaveMeta;
  state: GameState;
  checksum: string;
}

/** Checksum FNV-1a sul JSON canonico dello stato: rileva troncamenti e manomissioni accidentali. */
export function checksum(s: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0') + ':' + s.length;
}

export function metaOf(g: GameState): SaveMeta {
  return {
    playerName: g.playerName, mode: g.mode, day: g.day, chapter: g.chapter, playSeconds: Math.round(g.playSeconds),
    credits: g.credits, cases: g.decisions.length, ending: g.ending,
  };
}

export function serialize(g: GameState, slot: string, now = new Date()): SaveFile {
  const state = JSON.parse(JSON.stringify(g)) as GameState;
  return { format: SAVE_FORMAT, schema: SCHEMA_VERSION, savedAt: now.toISOString(), slot, meta: metaOf(g), state, checksum: checksum(JSON.stringify(state)) };
}

export type Validation = { ok: true; save: SaveFile } | { ok: false; error: string };

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

function validateState(s: unknown): string | null {
  if (!isObj(s)) return 'stato mancante';
  const num = ['schema', 'seed', 'day', 'chapter', 'phase', 'credits', 'playSeconds', 'counter', 'linkAttempts'];
  for (const k of num) if (typeof s[k] !== 'number' || !Number.isFinite(s[k] as number)) return `campo numerico non valido: ${k}`;
  if (s.mode !== 'campaign' && s.mode !== 'endless') return 'modalità sconosciuta';
  if (typeof s.playerName !== 'string') return 'nome non valido';
  const objs = ['flags', 'vars', 'stats', 'rel', 'npc', 'souls', 'closed', 'knowledge', 'convSeen', 'docsSeen', 'departments', 'player'];
  for (const k of objs) if (!isObj(s[k])) return `sezione non valida: ${k}`;
  const arrs = ['decisions', 'queue', 'links', 'staff', 'candidates', 'tools', 'directives', 'areas', 'reports'];
  for (const k of arrs) if (!Array.isArray(s[k])) return `elenco non valido: ${k}`;
  const stats = s.stats as Record<string, unknown>;
  for (const k of ['efficienza', 'morale', 'pendenti', 'reputazione', 'irregolari', 'ricorsi', 'anomalie', 'sospetto']) {
    if (typeof stats[k] !== 'number') return `indicatore mancante: ${k}`;
  }
  for (const [id, soul] of Object.entries(s.souls as Record<string, unknown>)) {
    if (!isObj(soul) || soul.id !== id || !Array.isArray(soul.incarnations) || soul.incarnations.length === 0) return `anima non valida: ${id}`;
  }
  for (const d of s.decisions as unknown[]) {
    if (!isObj(d) || typeof d.id !== 'string' || typeof d.soulId !== 'string' || typeof d.destination !== 'string') return 'decisione non valida';
    if (!(d.soulId in (s.souls as object))) return `decisione riferita ad anima assente: ${d.soulId}`;
  }
  const p = s.player as Record<string, unknown>;
  if (typeof p.x !== 'number' || typeof p.y !== 'number') return 'posizione non valida';
  if (s.activeCase !== null && !isObj(s.activeCase)) return 'caso attivo non valido';
  if (s.mode === 'endless' && !isObj(s.endless)) return 'stato Endless mancante';
  return null;
}

type Migration = (state: Record<string, unknown>) => void;
/** Migrazioni per versione di schema: MIGRATIONS[n] porta lo stato da n a n+1. */
export const MIGRATIONS: Record<number, Migration> = {
  // Esempio documentato: i salvataggi di schema 0 (pre-rilascio) non avevano `docsSeen` né `linkAttempts`.
  0: (s) => {
    if (!isObj(s.docsSeen)) s.docsSeen = {};
    if (typeof s.linkAttempts !== 'number') s.linkAttempts = 0;
    if (!Array.isArray(s.reports)) s.reports = [];
    if (isObj(s.activeCase) && !Array.isArray(s.activeCase.puzzles)) s.activeCase.puzzles = [];
  },
};

export function migrate(save: SaveFile): SaveFile {
  let v = save.schema;
  const state = save.state as unknown as Record<string, unknown>;
  while (v < SCHEMA_VERSION) {
    const m = MIGRATIONS[v];
    if (!m) throw new Error(`Nessuna migrazione dallo schema ${v}`);
    m(state);
    v++;
    state.schema = v;
  }
  return { ...save, schema: v, state: state as unknown as GameState, checksum: checksum(JSON.stringify(state)) };
}

/** Valida un oggetto letto da disco o importato. Non lancia mai: restituisce l'errore. */
export function validateSave(raw: unknown): Validation {
  try {
    if (!isObj(raw)) return { ok: false, error: 'Il file non contiene un salvataggio.' };
    if (raw.format !== SAVE_FORMAT) return { ok: false, error: 'Formato non riconosciuto: non è un salvataggio di The Reincarnation Office.' };
    if (typeof raw.schema !== 'number') return { ok: false, error: 'Versione dello schema mancante.' };
    if (raw.schema > SCHEMA_VERSION) return { ok: false, error: `Salvataggio creato con una versione più recente del gioco (schema ${raw.schema}).` };
    if (!isObj(raw.state)) return { ok: false, error: 'Stato di gioco mancante.' };
    if (typeof raw.checksum !== 'string') return { ok: false, error: 'Checksum mancante.' };
    if (checksum(JSON.stringify(raw.state)) !== raw.checksum) return { ok: false, error: 'Il salvataggio è danneggiato (checksum non corrispondente).' };
    let save = raw as unknown as SaveFile;
    if (save.schema < SCHEMA_VERSION) save = migrate(save);
    const err = validateState(save.state);
    if (err) return { ok: false, error: 'Salvataggio non valido: ' + err + '.' };
    if (!isObj(raw.meta)) save = { ...save, meta: metaOf(save.state) };
    return { ok: true, save };
  } catch (e) {
    return { ok: false, error: 'Salvataggio illeggibile: ' + (e instanceof Error ? e.message : String(e)) };
  }
}

export function parseSave(json: string): Validation {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: 'Il file non è un JSON valido.' };
  }
  return validateSave(raw);
}
