// Geometria dell'ufficio: stanze, quote, porte, oggetti, punti di sosta dei personaggi.
// Indipendente dal rendering: usata anche dai test (percorsi, raggiungibilità).
import type { Cond } from '../engine/types';

export const MAP_W = 42;
export const MAP_H = 32;

export type FloorKind = 'wood' | 'marble' | 'plank' | 'carpet' | 'stone' | 'iron' | 'obsidian' | 'stairs' | 'runner';
export type WallKind = 'panel' | 'plaster' | 'brick' | 'iron' | 'glass';

export interface RoomDef {
  id: string;
  area: string;
  label: string;
  x0: number; y0: number; x1: number; y1: number;
  elev: number;
  floor: FloorKind;
  wall: WallKind;
  ambient: number; // 0..1 luminosità ambiente
}

export const ROOMS: RoomDef[] = [
  { id: 'management', area: 'management', label: 'Direzione di Reparto', x0: 12, y0: 0, x1: 22, y1: 5, elev: 3, floor: 'carpet', wall: 'panel', ambient: 0.5 },
  { id: 'director', area: 'director', label: 'Ufficio del Direttore', x0: 23, y0: 0, x1: 29, y1: 5, elev: 3, floor: 'obsidian', wall: 'glass', ambient: 0.3 },
  { id: 'judgment', area: 'judgment', label: 'Sala dei Giudizi', x0: 8, y0: 9, x1: 25, y1: 21, elev: 0, floor: 'wood', wall: 'panel', ambient: 0.55 },
  { id: 'employee', area: 'employee', label: 'Area Dipendenti', x0: 0, y0: 9, x1: 7, y1: 17, elev: 0, floor: 'plank', wall: 'plaster', ambient: 0.5 },
  { id: 'reception', area: 'reception', label: 'Reception', x0: 8, y0: 22, x1: 19, y1: 29, elev: 0, floor: 'marble', wall: 'panel', ambient: 0.6 },
  { id: 'interview1', area: 'interview', label: 'Sala Colloqui 1', x0: 26, y0: 9, x1: 31, y1: 14, elev: 0, floor: 'carpet', wall: 'plaster', ambient: 0.45 },
  { id: 'interview2', area: 'interview', label: 'Sala Colloqui 2', x0: 26, y0: 15, x1: 31, y1: 21, elev: 0, floor: 'plank', wall: 'plaster', ambient: 0.4 },
  { id: 'archive', area: 'archive', label: 'Archivio', x0: 20, y0: 22, x1: 33, y1: 31, elev: -2, floor: 'stone', wall: 'brick', ambient: 0.38 },
  { id: 'restricted', area: 'restricted', label: 'Reparto Riservato', x0: 34, y0: 24, x1: 41, y1: 31, elev: -3, floor: 'iron', wall: 'iron', ambient: 0.25 },
];

/** Tessere con quota propria (scale) o pavimento diverso dalla stanza. */
export interface TileOverride { x: number; y: number; elev?: number; floor?: FloorKind; room?: string; area?: string }
const overrides: TileOverride[] = [];
// Scala verso la Direzione (ponte sospeso tra Sala dei Giudizi e pedana).
for (const x of [16, 17]) {
  overrides.push({ x, y: 6, elev: 2.25, floor: 'stairs', room: 'stairsM', area: 'management' });
  overrides.push({ x, y: 7, elev: 1.5, floor: 'stairs', room: 'stairsM', area: 'management' });
  overrides.push({ x, y: 8, elev: 0.75, floor: 'stairs', room: 'stairsM', area: 'management' });
}
// Scala che scende in Archivio.
for (const x of [22, 23]) {
  overrides.push({ x, y: 22, elev: -0.5, floor: 'stairs' });
  overrides.push({ x, y: 23, elev: -1, floor: 'stairs' });
  overrides.push({ x, y: 24, elev: -1.5, floor: 'stairs' });
}
// Pianerottolo e scala del Reparto Riservato.
for (let y = 24; y <= 31; y++) {
  overrides.push({ x: 34, y, elev: -2 });
  overrides.push({ x: 35, y, elev: -2.5, floor: y >= 26 && y <= 28 ? 'stairs' : undefined });
}
// Guida centrale della Sala dei Giudizi.
for (let y = 9; y <= 21; y++) for (const x of [16, 17]) overrides.push({ x, y, floor: 'runner' });

export interface Tile { room: string; area: string; elev: number; floor: FloorKind; wall: WallKind; ambient: number }

function build(): (Tile | null)[][] {
  const grid: (Tile | null)[][] = [];
  for (let y = 0; y < MAP_H; y++) {
    const row: (Tile | null)[] = [];
    for (let x = 0; x < MAP_W; x++) row.push(null);
    grid.push(row);
  }
  for (const r of ROOMS) {
    for (let y = r.y0; y <= r.y1; y++) for (let x = r.x0; x <= r.x1; x++) {
      grid[y][x] = { room: r.id, area: r.area, elev: r.elev, floor: r.floor, wall: r.wall, ambient: r.ambient };
    }
  }
  for (const o of overrides) {
    const base = grid[o.y][o.x];
    const t: Tile = base ? { ...base } : { room: o.room ?? 'stairs', area: o.area ?? 'judgment', elev: 0, floor: 'stairs', wall: 'panel', ambient: 0.5 };
    if (o.elev !== undefined) t.elev = o.elev;
    if (o.floor) t.floor = o.floor;
    if (o.room) t.room = o.room;
    if (o.area) t.area = o.area;
    grid[o.y][o.x] = t;
  }
  return grid;
}

export const GRID = build();

export function tileAt(x: number, y: number): Tile | null {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return null;
  return GRID[y][x];
}

export function roomDef(id: string): RoomDef | undefined {
  return ROOMS.find((r) => r.id === id);
}

export type DoorKind = 'arch' | 'double' | 'iron' | 'glass' | 'gate' | 'portal' | 'lift' | 'small' | 'renew' | 'waiting';

/** Porta sul bordo N (tra (x,y-1) e (x,y)) o W (tra (x-1,y) e (x,y)) della tessera. */
export interface DoorDef {
  id: string;
  x: number; y: number;
  edge: 'N' | 'W';
  kind: DoorKind;
  /** Porta decorativa: non attraversabile, ma esaminabile. */
  decor?: boolean;
  interact?: boolean;
}

export const DOORS: DoorDef[] = [
  { id: 'porta_dipendenti', x: 8, y: 13, edge: 'W', kind: 'arch' },
  { id: 'porta_reception_a', x: 16, y: 22, edge: 'N', kind: 'double' },
  { id: 'porta_reception_b', x: 17, y: 22, edge: 'N', kind: 'double' },
  { id: 'porta_colloqui1', x: 26, y: 11, edge: 'W', kind: 'arch' },
  { id: 'porta_colloqui2', x: 26, y: 18, edge: 'W', kind: 'arch' },
  { id: 'cancello_riservato', x: 34, y: 27, edge: 'W', kind: 'gate', interact: true },
  { id: 'porta_direttore', x: 23, y: 3, edge: 'W', kind: 'glass', interact: true },
  // Porte delle destinazioni e ingressi: decorative ma esaminabili.
  { id: 'portone', x: 8, y: 25, edge: 'W', kind: 'portal', decor: true, interact: true },
  { id: 'portone_b', x: 8, y: 26, edge: 'W', kind: 'portal', decor: true },
  { id: 'porta_attesa', x: 10, y: 9, edge: 'N', kind: 'waiting', decor: true, interact: true },
  { id: 'porta_attesa_b', x: 11, y: 9, edge: 'N', kind: 'waiting', decor: true },
  { id: 'porta_prova', x: 13, y: 9, edge: 'N', kind: 'iron', decor: true, interact: true },
  { id: 'porta_forma', x: 20, y: 9, edge: 'N', kind: 'small', decor: true, interact: true },
  { id: 'montacarichi', x: 22, y: 9, edge: 'N', kind: 'lift', decor: true, interact: true },
  { id: 'montacarichi_b', x: 23, y: 9, edge: 'N', kind: 'lift', decor: true },
  { id: 'porta_rinnovo', x: 8, y: 19, edge: 'W', kind: 'renew', decor: true, interact: true },
  { id: 'porta_rinnovo_b', x: 8, y: 20, edge: 'W', kind: 'renew', decor: true },
];

export function doorAt(x: number, y: number, edge: 'N' | 'W'): DoorDef | undefined {
  return DOORS.find((d) => d.x === x && d.y === y && d.edge === edge);
}

export type WallDecor = 'window' | 'painting' | 'sconce' | 'shelf' | 'board' | 'clockface' | 'banner' | 'pipes' | 'niche';
export const WALL_DECOR: { x: number; y: number; edge: 'N' | 'W'; type: WallDecor }[] = [
  { x: 9, y: 9, edge: 'N', type: 'sconce' }, { x: 12, y: 9, edge: 'N', type: 'sconce' }, { x: 15, y: 9, edge: 'N', type: 'banner' },
  { x: 18, y: 9, edge: 'N', type: 'banner' }, { x: 21, y: 9, edge: 'N', type: 'sconce' }, { x: 24, y: 9, edge: 'N', type: 'sconce' },
  { x: 25, y: 9, edge: 'N', type: 'painting' }, { x: 8, y: 10, edge: 'W', type: 'window' }, { x: 8, y: 11, edge: 'W', type: 'sconce' },
  { x: 8, y: 15, edge: 'W', type: 'painting' }, { x: 8, y: 16, edge: 'W', type: 'sconce' }, { x: 8, y: 18, edge: 'W', type: 'sconce' }, { x: 8, y: 21, edge: 'W', type: 'sconce' },
  { x: 1, y: 9, edge: 'N', type: 'pipes' }, { x: 2, y: 9, edge: 'N', type: 'pipes' }, { x: 4, y: 9, edge: 'N', type: 'sconce' }, { x: 7, y: 9, edge: 'N', type: 'board' },
  { x: 0, y: 11, edge: 'W', type: 'window' }, { x: 0, y: 13, edge: 'W', type: 'sconce' }, { x: 0, y: 16, edge: 'W', type: 'window' },
  { x: 8, y: 23, edge: 'W', type: 'sconce' }, { x: 8, y: 28, edge: 'W', type: 'sconce' }, { x: 8, y: 22, edge: 'W', type: 'banner' }, { x: 8, y: 29, edge: 'W', type: 'banner' },
  { x: 10, y: 22, edge: 'N', type: 'painting' }, { x: 12, y: 22, edge: 'N', type: 'sconce' }, { x: 14, y: 22, edge: 'N', type: 'clockface' }, { x: 19, y: 22, edge: 'N', type: 'sconce' },
  { x: 27, y: 9, edge: 'N', type: 'window' }, { x: 29, y: 9, edge: 'N', type: 'sconce' }, { x: 31, y: 9, edge: 'N', type: 'shelf' }, { x: 26, y: 13, edge: 'W', type: 'painting' },
  { x: 28, y: 15, edge: 'N', type: 'sconce' }, { x: 30, y: 15, edge: 'N', type: 'pipes' }, { x: 26, y: 20, edge: 'W', type: 'sconce' },
  { x: 20, y: 30, edge: 'W', type: 'sconce' }, { x: 20, y: 31, edge: 'W', type: 'niche' },
  { x: 36, y: 24, edge: 'N', type: 'pipes' }, { x: 37, y: 24, edge: 'N', type: 'sconce' }, { x: 34, y: 25, edge: 'W', type: 'sconce' }, { x: 34, y: 29, edge: 'W', type: 'sconce' },
  { x: 13, y: 0, edge: 'N', type: 'window' }, { x: 15, y: 0, edge: 'N', type: 'painting' }, { x: 17, y: 0, edge: 'N', type: 'banner' }, { x: 19, y: 0, edge: 'N', type: 'painting' },
  { x: 21, y: 0, edge: 'N', type: 'window' }, { x: 12, y: 1, edge: 'W', type: 'sconce' }, { x: 12, y: 4, edge: 'W', type: 'sconce' },
  { x: 24, y: 0, edge: 'N', type: 'niche' }, { x: 26, y: 0, edge: 'N', type: 'niche' }, { x: 28, y: 0, edge: 'N', type: 'niche' }, { x: 23, y: 1, edge: 'W', type: 'niche' }, { x: 23, y: 5, edge: 'W', type: 'niche' },
];

export interface ObjDef {
  id: string;
  kind: string;
  x: number; y: number;
  solid?: boolean;
  interact?: boolean;
  cond?: Cond;
  light?: { r: number; color: number; flicker?: boolean };
  flip?: boolean;
}

const L_LAMP = { r: 110, color: 0xffd9a0, flicker: true };
const L_CANDLE = { r: 140, color: 0xffc27a, flicker: true };
const L_COLD = { r: 120, color: 0x9ec8ff };
const L_GREEN = { r: 110, color: 0x9dffb0, flicker: true };
const L_RED = { r: 120, color: 0xff7a5a, flicker: true };

export const OBJECTS: ObjDef[] = [
  // --- Sala dei Giudizi ---
  { id: 'scrivania7', kind: 'desk_player', x: 11, y: 13, interact: true, light: L_LAMP },
  { id: 'sedia_anime', kind: 'chair', x: 11, y: 14, solid: false },
  { id: 'scrivania_bones', kind: 'desk', x: 15, y: 13, interact: true, light: L_LAMP },
  { id: 'sedia_b1', kind: 'chair', x: 15, y: 14, solid: false },
  { id: 'scrivania3', kind: 'desk', x: 19, y: 13, interact: true, light: L_LAMP },
  { id: 'scrivania4', kind: 'desk_covered', x: 23, y: 13, interact: true },
  { id: 'scrivania5', kind: 'desk_covered', x: 11, y: 18, interact: true },
  { id: 'scrivania6', kind: 'desk', x: 15, y: 18, interact: true, light: L_LAMP },
  { id: 'scrivania8', kind: 'desk_covered', x: 19, y: 18 },
  { id: 'scrivania9', kind: 'desk_covered', x: 23, y: 18 },
  { id: 'colonna_a', kind: 'column', x: 13, y: 15, interact: true },
  { id: 'colonna_b', kind: 'column', x: 21, y: 15 },
  { id: 'pendola', kind: 'clock', x: 14, y: 9, interact: true },
  { id: 'tubo', kind: 'tube', x: 25, y: 10, interact: true },
  { id: 'candelabro_a', kind: 'candelabra', x: 9, y: 12, light: L_CANDLE },
  { id: 'candelabro_b', kind: 'candelabra', x: 24, y: 20, light: L_CANDLE },
  { id: 'candelabro_c', kind: 'candelabra', x: 24, y: 11, light: L_CANDLE },
  { id: 'candelabro_d', kind: 'candelabra', x: 9, y: 17, light: L_CANDLE },
  { id: 'pile_a', kind: 'papers', x: 25, y: 15, interact: true },
  { id: 'pile_b', kind: 'papers', x: 25, y: 16 },
  // --- Reception ---
  { id: 'bancone_a', kind: 'counter', x: 11, y: 24 },
  { id: 'bancone', kind: 'counter_bell', x: 11, y: 25, interact: true, light: L_LAMP },
  { id: 'bancone_c', kind: 'counter', x: 11, y: 26 },
  { id: 'panca_a', kind: 'bench', x: 9, y: 28, interact: true },
  { id: 'panca_b', kind: 'bench', x: 10, y: 28 },
  { id: 'panca_c', kind: 'bench', x: 14, y: 28 },
  { id: 'panca_d', kind: 'bench', x: 15, y: 28 },
  { id: 'registro_arrivi', kind: 'lectern', x: 13, y: 23, interact: true },
  { id: 'bacheca', kind: 'board', x: 18, y: 24, interact: true },
  { id: 'pianta_a', kind: 'plant', x: 19, y: 29, interact: true },
  { id: 'pianta_b', kind: 'plant', x: 9, y: 22 },
  { id: 'candelabro_r', kind: 'candelabra', x: 18, y: 28, light: L_CANDLE },
  // --- Area Dipendenti ---
  { id: 'stufa', kind: 'stove', x: 1, y: 10, interact: true, light: L_RED },
  { id: 'samovar', kind: 'samovar', x: 3, y: 10, interact: true },
  { id: 'armadietti', kind: 'lockers', x: 5, y: 10, interact: true },
  { id: 'armadietti_b', kind: 'lockers', x: 6, y: 10 },
  { id: 'marcatempo', kind: 'timeclock', x: 6, y: 13, interact: true, light: L_LAMP },
  { id: 'tavolo_dip', kind: 'table', x: 3, y: 14, interact: true, light: L_CANDLE },
  { id: 'sedia_d1', kind: 'chair', x: 3, y: 15, solid: false },
  { id: 'sedia_d2', kind: 'chair', x: 2, y: 14, solid: false },
  { id: 'branda_a', kind: 'cot', x: 1, y: 16, interact: true },
  { id: 'branda_b', kind: 'cot', x: 1, y: 17 },
  { id: 'cassa_dip', kind: 'crate', x: 6, y: 17 },
  // --- Sale Colloqui ---
  { id: 'scrivania_ilse', kind: 'desk', x: 28, y: 12, interact: true, light: L_LAMP },
  { id: 'poltrona_1', kind: 'armchair', x: 28, y: 13, solid: false },
  { id: 'armadio_ilse', kind: 'cabinet', x: 30, y: 9, interact: true },
  { id: 'schedario_tiepido', kind: 'cabinet_pale', x: 31, y: 11, interact: true, cond: { flag: 'ilse_arredo' } },
  { id: 'pianta_c', kind: 'plant', x: 31, y: 14 },
  { id: 'tavolo_col2', kind: 'table', x: 29, y: 18, interact: true, light: L_COLD },
  { id: 'sedia_c1', kind: 'chair', x: 29, y: 19, solid: false },
  { id: 'sedia_c2', kind: 'chair', x: 28, y: 18, solid: false },
  { id: 'apparecchio', kind: 'recorder', x: 30, y: 16, interact: true },
  { id: 'specchio', kind: 'mirror', x: 31, y: 20, interact: true },
  // --- Archivio ---
  { id: 'scaffale_n1', kind: 'shelf', x: 25, y: 22 }, { id: 'scaffale_n2', kind: 'shelf', x: 26, y: 22 }, { id: 'scaffale_n3', kind: 'shelf', x: 27, y: 22, interact: true },
  { id: 'scaffale_n4', kind: 'shelf', x: 28, y: 22 }, { id: 'scaffale_n5', kind: 'shelf', x: 29, y: 22 }, { id: 'scaffale_n6', kind: 'shelf', x: 30, y: 22 },
  { id: 'scaffale_n7', kind: 'shelf', x: 31, y: 22 }, { id: 'scaffale_n8', kind: 'shelf', x: 32, y: 22 },
  { id: 'schedario_dimenticati', kind: 'cabinet_seal', x: 33, y: 23, interact: true },
  { id: 'scrivania_hoot', kind: 'desk', x: 27, y: 26, interact: true, light: L_GREEN },
  { id: 'leggio', kind: 'lectern', x: 25, y: 25, interact: true, light: L_CANDLE },
  { id: 'indice', kind: 'catalog', x: 30, y: 25, interact: true },
  { id: 'registro_sospensioni', kind: 'shelf_low', x: 32, y: 26, interact: true },
  { id: 'scaffale_s1', kind: 'shelf', x: 27, y: 29 }, { id: 'scaffale_s2', kind: 'shelf', x: 28, y: 29 }, { id: 'scaffale_s3', kind: 'shelf', x: 29, y: 29 },
  { id: 'scaffale_s4', kind: 'shelf', x: 31, y: 29 }, { id: 'scaffale_s5', kind: 'shelf', x: 32, y: 29 },
  { id: 'scaffale_personale', kind: 'shelf_low', x: 21, y: 27, interact: true },
  { id: 'casse_a', kind: 'crate', x: 20, y: 30 }, { id: 'casse_b', kind: 'crate', x: 21, y: 30 }, { id: 'casse_c', kind: 'crate', x: 20, y: 25 },
  { id: 'candelabro_arch', kind: 'candelabra', x: 24, y: 30, light: L_GREEN },
  { id: 'candelabro_arch2', kind: 'candelabra', x: 33, y: 30, light: L_GREEN },
  { id: 'branda_tea', kind: 'cot', x: 21, y: 29, cond: { any: [{ flag: 'nn_custodia' }, { flag: 'sabina_ricongiunzione' }] } },
  // --- Direzione ---
  { id: 'scrivania_vesper', kind: 'desk_grand', x: 17, y: 2, interact: true, light: L_LAMP },
  { id: 'armadio_dir_a', kind: 'cabinet', x: 13, y: 0 }, { id: 'armadio_dir_b', kind: 'cabinet', x: 14, y: 0, interact: true },
  { id: 'cassaforte', kind: 'safe', x: 21, y: 0, interact: true },
  { id: 'poltrona_dir_a', kind: 'armchair', x: 15, y: 3, solid: false }, { id: 'poltrona_dir_b', kind: 'armchair', x: 19, y: 3, solid: false },
  { id: 'tiglio', kind: 'tiglio', x: 19, y: 1, interact: true, cond: { flag: 'odile_forma' } },
  { id: 'candelabro_dir', kind: 'candelabra', x: 13, y: 4, light: L_CANDLE },
  { id: 'candelabro_dir2', kind: 'candelabra', x: 21, y: 4, light: L_CANDLE },
  // --- Reparto Riservato ---
  { id: 'barattoli_a', kind: 'jars', x: 38, y: 24 }, { id: 'barattoli', kind: 'jars', x: 39, y: 24, interact: true, light: L_COLD },
  { id: 'barattoli_c', kind: 'jars', x: 40, y: 24 }, { id: 'barattoli_d', kind: 'jars', x: 41, y: 24, light: L_COLD },
  { id: 'torchio', kind: 'press', x: 38, y: 27, interact: true, light: L_RED },
  { id: 'torchio_b', kind: 'press', x: 40, y: 28 },
  { id: 'panca_torchi', kind: 'bench', x: 37, y: 29, interact: true },
  { id: 'risme', kind: 'reams', x: 41, y: 30, interact: true }, { id: 'risme_b', kind: 'reams', x: 40, y: 31 },
  { id: 'fascicolo7', kind: 'lectern', x: 41, y: 26, interact: true, light: L_CANDLE },
  { id: 'vasca', kind: 'vat', x: 37, y: 31 },
  // --- Ufficio del Direttore ---
  { id: 'scrivania_direttore', kind: 'desk_grand', x: 26, y: 3, interact: true, light: L_COLD },
  { id: 'barattoli_dir_a', kind: 'jars', x: 24, y: 0, light: L_COLD }, { id: 'barattoli_dir_b', kind: 'jars', x: 25, y: 0 }, { id: 'barattoli_dir_c', kind: 'jars', x: 26, y: 0, light: L_COLD },
  { id: 'barattoli_dir_d', kind: 'jars', x: 27, y: 0 }, { id: 'barattoli_dir_e', kind: 'jars', x: 28, y: 0, light: L_COLD }, { id: 'barattoli_dir_f', kind: 'jars', x: 29, y: 0 },
  { id: 'barattoli_dir_g', kind: 'jars', x: 29, y: 2 }, { id: 'barattoli_dir_h', kind: 'jars', x: 29, y: 4, light: L_COLD }, { id: 'barattoli_dir_i', kind: 'jars', x: 24, y: 5 }, { id: 'barattoli_dir_l', kind: 'jars', x: 28, y: 5 },
];

/** Punti di sosta dei personaggi (per le routine). */
export const SPOTS: Record<string, { x: number; y: number; face?: 'N' | 'S' | 'E' | 'W' }> = {
  player_start: { x: 9, y: 25, face: 'E' },
  player_desk: { x: 11, y: 12, face: 'S' },
  pim_counter: { x: 12, y: 25, face: 'W' },
  pim_register: { x: 13, y: 24, face: 'N' },
  pim_bench: { x: 14, y: 27, face: 'S' },
  pim_hall: { x: 17, y: 20, face: 'N' },
  bones_desk: { x: 15, y: 12, face: 'S' },
  bones_samovar: { x: 4, y: 11, face: 'W' },
  scrivano3_desk: { x: 19, y: 12, face: 'S' },
  scrivano6_desk: { x: 15, y: 17, face: 'S' },
  vesper_desk: { x: 17, y: 1, face: 'S' },
  vesper_floor: { x: 17, y: 11, face: 'S' },
  vesper_rail: { x: 16, y: 5, face: 'S' },
  hoot_desk: { x: 27, y: 25, face: 'S' },
  hoot_shelves: { x: 28, y: 23, face: 'N' },
  hoot_leggio: { x: 25, y: 26, face: 'N' },
  grell_stove: { x: 2, y: 11, face: 'W' },
  grell_attesa: { x: 10, y: 10, face: 'N' },
  grell_samovar: { x: 3, y: 11, face: 'N' },
  grell_stairs: { x: 21, y: 20, face: 'E' },
  grell_gate: { x: 33, y: 28, face: 'E' },
  ilse_desk: { x: 28, y: 11, face: 'S' },
  ilse_samovar: { x: 4, y: 12, face: 'N' },
  ilse_int2: { x: 30, y: 18, face: 'W' },
  ilse_torchi: { x: 39, y: 29, face: 'N' },
  quill_stairs: { x: 18, y: 10, face: 'S' },
  quill_desk: { x: 12, y: 12, face: 'W' },
  quill_archive: { x: 24, y: 26, face: 'E' },
  tea_spot: { x: 22, y: 28, face: 'E' },
  sabina_spot: { x: 22, y: 30, face: 'N' },
};

// --- Percorribilità ---
export interface StepCtx { areas: string[]; solids: Set<string> }

export function key(x: number, y: number): string {
  return x + ',' + y;
}

export function solidSet(isVisible: (o: ObjDef) => boolean): Set<string> {
  const s = new Set<string>();
  for (const o of OBJECTS) if (o.solid !== false && isVisible(o)) s.add(key(o.x, o.y));
  return s;
}

/** Vero se tra due tessere adiacenti c'è un muro (stanze diverse senza porta aperta). */
export function wallBetween(ax: number, ay: number, bx: number, by: number): boolean {
  const a = tileAt(ax, ay);
  const b = tileAt(bx, by);
  if (!a || !b) return true;
  if (a.room === b.room) return false;
  // Le scale non hanno muri verso le stanze che collegano.
  const stair = (t: Tile) => t.floor === 'stairs' || t.room === 'stairsM';
  // Bordo della porta: sempre riferito alla tessera con coordinata maggiore.
  let d: DoorDef | undefined;
  if (ax === bx) d = doorAt(ax, Math.max(ay, by), 'N');
  else d = doorAt(Math.max(ax, bx), ay, 'W');
  if (d) return !!d.decor;
  if (stair(a) || stair(b)) return false;
  return true;
}

export function canStep(ax: number, ay: number, bx: number, by: number, ctx: StepCtx): boolean {
  const a = tileAt(ax, ay);
  const b = tileAt(bx, by);
  if (!a || !b) return false;
  if (Math.abs(a.elev - b.elev) > 0.8) return false;
  if (!ctx.areas.includes(b.area)) return false;
  if (ctx.solids.has(key(bx, by))) return false;
  if (wallBetween(ax, ay, bx, by)) return false;
  return true;
}

const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]];

/** BFS su griglia a 4 direzioni. Se la meta è solida, arriva a una tessera adiacente. */
export function findPath(sx: number, sy: number, gx: number, gy: number, ctx: StepCtx): { x: number; y: number }[] | null {
  if (sx === gx && sy === gy) return [];
  const goalSolid = ctx.solids.has(key(gx, gy)) || !tileAt(gx, gy);
  const prev = new Map<string, string | null>();
  const q: [number, number][] = [[sx, sy]];
  prev.set(key(sx, sy), null);
  let found: string | null = null;
  let head = 0;
  while (head < q.length) {
    const [x, y] = q[head++];
    if (goalSolid ? Math.abs(x - gx) + Math.abs(y - gy) === 1 && !wallBetween(x, y, gx, gy) && tileAt(gx, gy) !== null && Math.abs((tileAt(x, y)?.elev ?? 0) - (tileAt(gx, gy)?.elev ?? 0)) <= 0.8 : x === gx && y === gy) {
      found = key(x, y);
      break;
    }
    for (const [dx, dy] of DIRS) {
      const nx = x + dx, ny = y + dy;
      const k = key(nx, ny);
      if (prev.has(k)) continue;
      if (!canStep(x, y, nx, ny, ctx)) continue;
      prev.set(k, key(x, y));
      q.push([nx, ny]);
    }
  }
  if (!found) return null;
  const path: { x: number; y: number }[] = [];
  let cur: string | null = found;
  while (cur && cur !== key(sx, sy)) {
    const [x, y] = cur.split(',').map(Number);
    path.push({ x, y });
    cur = prev.get(cur) ?? null;
  }
  return path.reverse();
}

/** Una tessera libera adiacente a (x,y), per avvicinarsi a porte e oggetti a parete. */
export function adjacentFree(x: number, y: number, ctx: StepCtx): { x: number; y: number } | null {
  for (const [dx, dy] of DIRS) {
    const t = tileAt(x + dx, y + dy);
    if (t && !ctx.solids.has(key(x + dx, y + dy)) && ctx.areas.includes(t.area)) return { x: x + dx, y: y + dy };
  }
  return null;
}
