// Persistence Layer — IndexedDB tramite Dexie. Slot manuali, autosave con copia di riserva,
// import/export JSON, impostazioni, finali sbloccati.
import Dexie, { type Table } from 'dexie';
import type { GameState } from '../engine/types';
import { parseSave, serialize, type SaveMeta } from './save';

export interface SaveRecord { slot: string; json: string; savedAt: string; meta: SaveMeta }
export interface MetaRecord { key: string; value: unknown }

export const MANUAL_SLOTS = ['slot1', 'slot2', 'slot3', 'slot4'];
export const AUTO_SLOT = 'auto';
export const AUTO_BACKUP = 'auto.bak';
export const ENDLESS_AUTO = 'endless';
export const ENDLESS_BACKUP = 'endless.bak';

class OfficeDB extends Dexie {
  saves!: Table<SaveRecord, string>;
  meta!: Table<MetaRecord, string>;
  constructor(name = 'the-reincarnation-office') {
    super(name);
    this.version(1).stores({ saves: 'slot, savedAt', meta: 'key' });
  }
}

let db: OfficeDB | null = null;
export function getDB(): OfficeDB {
  if (!db) db = new OfficeDB();
  return db;
}
/** Solo per i test: riapre un database pulito. */
export async function resetDB(): Promise<void> {
  if (db) {
    await db.delete();
    db = null;
  }
}

export function autoSlotFor(g: GameState): { main: string; backup: string } {
  return g.mode === 'endless' ? { main: ENDLESS_AUTO, backup: ENDLESS_BACKUP } : { main: AUTO_SLOT, backup: AUTO_BACKUP };
}

export async function writeSave(slot: string, g: GameState): Promise<SaveRecord> {
  const file = serialize(g, slot);
  const rec: SaveRecord = { slot, json: JSON.stringify(file), savedAt: file.savedAt, meta: file.meta };
  await getDB().saves.put(rec);
  return rec;
}

/** Autosave con rotazione: la versione precedente resta come copia di riserva. */
export async function autosave(g: GameState): Promise<void> {
  const { main, backup } = autoSlotFor(g);
  const d = getDB();
  await d.transaction('rw', d.saves, async () => {
    const prev = await d.saves.get(main);
    if (prev && parseSave(prev.json).ok) await d.saves.put({ ...prev, slot: backup });
    const file = serialize(g, main);
    await d.saves.put({ slot: main, json: JSON.stringify(file), savedAt: file.savedAt, meta: file.meta });
  });
}

export type LoadResult =
  | { status: 'ok'; state: GameState; meta: SaveMeta; savedAt: string; recovered?: boolean }
  | { status: 'empty' }
  | { status: 'corrupt'; error: string };

export async function readSave(slot: string): Promise<LoadResult> {
  const rec = await getDB().saves.get(slot);
  if (!rec) return { status: 'empty' };
  const v = parseSave(rec.json);
  if (v.ok) return { status: 'ok', state: v.save.state, meta: v.save.meta, savedAt: v.save.savedAt };
  // Dati corrotti: per gli autosave si tenta la copia di riserva.
  const backup = slot === AUTO_SLOT ? AUTO_BACKUP : slot === ENDLESS_AUTO ? ENDLESS_BACKUP : null;
  if (backup) {
    const b = await getDB().saves.get(backup);
    if (b) {
      const vb = parseSave(b.json);
      if (vb.ok) return { status: 'ok', state: vb.save.state, meta: vb.save.meta, savedAt: vb.save.savedAt, recovered: true };
    }
  }
  return { status: 'corrupt', error: v.error };
}

export interface SlotInfo { slot: string; status: 'ok' | 'empty' | 'corrupt'; meta?: SaveMeta; savedAt?: string; error?: string }

export async function listSaves(): Promise<SlotInfo[]> {
  const all = await getDB().saves.toArray();
  const by = new Map(all.map((r) => [r.slot, r]));
  const slots = [AUTO_SLOT, ENDLESS_AUTO, ...MANUAL_SLOTS];
  return slots.map((slot) => {
    const rec = by.get(slot);
    if (!rec) return { slot, status: 'empty' as const };
    const v = parseSave(rec.json);
    if (!v.ok) return { slot, status: 'corrupt' as const, error: v.error, savedAt: rec.savedAt };
    return { slot, status: 'ok' as const, meta: v.save.meta, savedAt: v.save.savedAt };
  });
}

export async function deleteSave(slot: string): Promise<void> {
  await getDB().saves.delete(slot);
  if (slot === AUTO_SLOT) await getDB().saves.delete(AUTO_BACKUP);
  if (slot === ENDLESS_AUTO) await getDB().saves.delete(ENDLESS_BACKUP);
}

/** Esporta il contenuto grezzo di uno slot (anche se corrotto, per tentare un recupero manuale). */
export async function exportSave(slot: string): Promise<string | null> {
  const rec = await getDB().saves.get(slot);
  return rec ? rec.json : null;
}

export async function importSave(json: string, slot: string): Promise<{ ok: true; meta: SaveMeta } | { ok: false; error: string }> {
  const v = parseSave(json);
  if (!v.ok) return v;
  const file = serialize(v.save.state, slot);
  await getDB().saves.put({ slot, json: JSON.stringify(file), savedAt: file.savedAt, meta: file.meta });
  return { ok: true, meta: file.meta };
}

export async function getMeta<T>(key: string, fallback: T): Promise<T> {
  try {
    const r = await getDB().meta.get(key);
    return r ? (r.value as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function setMeta(key: string, value: unknown): Promise<void> {
  await getDB().meta.put({ key, value });
}

export async function unlockEnding(id: string): Promise<string[]> {
  const cur = await getMeta<string[]>('endings', []);
  if (!cur.includes(id)) cur.push(id);
  await setMeta('endings', cur);
  return cur;
}
