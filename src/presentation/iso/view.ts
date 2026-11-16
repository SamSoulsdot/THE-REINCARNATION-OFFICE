// Presentation Layer — vista isometrica dell'ufficio (PixiJS).
// Costruisce la scena dalla mappa, ordina in profondità, illumina, gestisce camera e input.
// Non contiene regole di gioco: legge lo stato e notifica gli eventi tramite callback.
import { Application, Container, Graphics, RenderTexture, Sprite, Texture } from 'pixi.js';
import type { GameState } from '../../engine/types';
import { check } from '../../engine/cond';
import { npcPlans, type NpcPlan } from '../../engine/scene';
import { NPCS, OBJ_LABEL, OVERHEARD } from '../../content';
import {
  DOORS, GRID, MAP_H, MAP_W, OBJECTS, SPOTS, WALL_DECOR, canStep, doorAt, findPath, key, tileAt,
  type DoorDef, type FloorKind, type ObjDef, type StepCtx, type Tile,
} from '../../world/map';
import { Atlas, AtlasBuilder, charFrame } from './atlas';
import { EU, TH, TW, WALL_H, drawFace, drawFloor, drawLight, drawRail, drawWall, type FaceMat, type WallSpec } from './art_tiles';
import { drawMarker, drawObject } from './art_objects';
import { PAL } from './px';

export interface ViewTarget { type: 'npc' | 'obj' | 'door'; id: string; label: string; x: number; y: number }
export interface ViewCallbacks {
  canAct(): boolean;
  onInteract(t: ViewTarget): void;
  onArrive(x: number, y: number): void;
  onRoom(room: string, area: string): void;
  onLocked(area: string): void;
  onStep(floor: FloorKind): void;
  onNear(t: ViewTarget | null): void;
  onDoor(): void;
  onOverheard(id: string): void;
}
export interface SyncExtra { soulSprite: string | null; waiting: number; ambient: number; flicker: number }

type Face = 'N' | 'S' | 'E' | 'W';
interface Actor {
  id: string; set: string; sprite: Sprite; x: number; y: number; elev: number;
  path: { x: number; y: number }[]; face: Face; frame: number; animT: number; moving: boolean;
  spot?: string; state?: NpcPlan['state']; label?: HTMLDivElement;
}
interface LightDef { x: number; y: number; r: number; color: number; flicker: boolean; area: string; sprite?: Sprite; seed: number }
interface Hidable { sprite: Sprite; area: string }

const HIDDEN_AREAS = ['restricted', 'director'];
const ZOOMS = [1, 1.5, 2, 2.5, 3];
const SPEED = 4.4; // tessere al secondo

function iso(x: number, y: number, elev: number): { sx: number; sy: number } {
  return { sx: (x - y) * (TW / 2), sy: (x + y) * (TH / 2) - elev * EU };
}
function depth(x: number, y: number, layer: number): number {
  return (x + y) * 100 + layer;
}
function faceMat(t: Tile): FaceMat {
  return t.floor === 'carpet' || t.floor === 'obsidian' ? 'wood' : t.floor === 'iron' ? 'iron' : 'stone';
}
function toneOf(room: string): WallSpec['tone'] {
  return room === 'reception' ? 'plum' : room === 'management' ? 'red' : room === 'director' ? 'blue' : 'green';
}
const isStair = (t: Tile | null) => !!t && (t.floor === 'stairs' || t.room === 'stairsM');

export class IsoView {
  private app = new Application();
  private world = new Container();
  private lightScene = new Container();
  private lightLayer = new Container();
  private ambientRect = new Graphics();
  private lightRT: RenderTexture | null = null;
  private lightSprite = new Sprite();
  private atlas!: Atlas;
  private overlay: HTMLDivElement;
  private g: GameState | null = null;
  private extra: SyncExtra = { soulSprite: null, waiting: 0, ambient: 0x6a6478, flicker: 0.08 };
  private player!: Actor;
  private npcs = new Map<string, Actor>();
  private objSprites = new Map<string, { def: ObjDef; sprite: Sprite; marker?: Sprite }>();
  private doorSprites: { def: DoorDef; sprite: Sprite; open: string; closed: string; marker?: Sprite }[] = [];
  private wallSprites: { sprite: Sprite; x: number; y: number }[] = [];
  private hidables: Hidable[] = [];
  private lights: LightDef[] = [];
  private animated: { sprite: Sprite; keys: string[]; period: number }[] = [];
  private soulSprite: Sprite | null = null;
  private waitingSprites: Sprite[] = [];
  private solids = new Set<string>();
  private cam = { x: 0, y: 0 };
  private zoomIdx = 2;
  private follow = true;
  private pending: ViewTarget | null = null;
  private near: ViewTarget | null = null;
  private room = '';
  private time = 0;
  private keys = new Set<string>();
  private pointers = new Map<number, { x: number; y: number; sx: number; sy: number; moved: boolean }>();
  private pinch = 0;
  private bubbles: { el: HTMLDivElement; actor: string; until: number }[] = [];
  private ohState: { id: string; line: number; next: number } | null = null;
  private dead = false;
  ready = false;

  constructor(private host: HTMLElement, private cb: ViewCallbacks) {
    this.overlay = document.createElement('div');
    this.overlay.className = 'iso-overlay';
  }

  async init(): Promise<void> {
    await this.app.init({ resizeTo: this.host, background: PAL.void, antialias: false, resolution: 1, autoDensity: false, preference: 'webgl', powerPreference: 'low-power' });
    if (this.dead) { this.app.destroy(true); return; }
    this.app.canvas.className = 'iso-canvas';
    this.host.appendChild(this.app.canvas);
    this.host.appendChild(this.overlay);
    this.zoomIdx = this.host.clientWidth < 700 || this.host.clientHeight < 500 ? 1 : 2;
    this.buildAtlasAndWorld();
    this.world.sortableChildren = true;
    this.app.stage.eventMode = 'none';
    this.app.stage.addChild(this.world);
    this.lightScene.addChild(this.ambientRect, this.lightLayer);
    this.lightSprite.blendMode = 'multiply';
    this.app.stage.addChild(this.lightSprite);
    this.bindInput();
    this.app.ticker.add((t) => this.tick(Math.min(60, t.deltaMS) / 1000));
    this.ready = true;
    if (this.g) this.sync(this.g, this.extra);
  }

  destroy(): void {
    this.dead = true;
    this.unbindInput();
    this.overlay.remove();
    if (this.ready) {
      this.atlas.destroy();
      this.lightRT?.destroy(true);
      this.app.destroy(true, { children: true });
    }
  }

  // ------------------------------------------------------------------ costruzione
  private buildAtlasAndWorld(): void {
    const ab = new AtlasBuilder();
    type Draw = { key: string; x: number; y: number; z: number; area: string; kind: 'floor' | 'wall' | 'other'; tx?: number; ty?: number };
    const draws: Draw[] = [];
    const doorDraws: { def: DoorDef; open: string; closed: string; x: number; y: number; z: number; area: string }[] = [];

    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
      const t = GRID[y][x];
      if (!t) continue;
      const { sx, sy } = iso(x, y, t.elev);
      const v = (x * 7 + y * 13) % 3;
      const opt = t.floor === 'runner' ? (x % 2 === 0 ? 'L' : 'R') : t.floor === 'stairs' ? (t.room === 'restricted' ? 'u' : 'v') : '';
      const fk = ab.add(`floor:${t.floor}:${v}:${opt}`, () => drawFloor(t.floor, v, opt));
      draws.push({ key: fk, x: sx - 32, y: sy - 16, z: depth(x, y, 0), area: t.area, kind: 'floor' });

      // fianchi dei dislivelli e fondazione sul vuoto
      const south = tileAt(x, y + 1), east = tileAt(x + 1, y);
      for (const [nb, side] of [[south, 'L'], [east, 'R']] as const) {
        if (!nb) {
          const k = ab.add(`found:${side}:${faceMat(t)}`, () => drawFace(side, faceMat(t), 3.2, true));
          draws.push({ key: k, x: side === 'L' ? sx - 32 : sx, y: sy, z: depth(x, y, 1), area: t.area, kind: 'other' });
        } else if (nb.elev < t.elev - 0.01) {
          const units = t.elev - nb.elev;
          const k = ab.add(`face:${side}:${faceMat(t)}:${units}`, () => drawFace(side, faceMat(t), units));
          draws.push({ key: k, x: side === 'L' ? sx - 32 : sx, y: sy, z: depth(x, y, 1), area: t.area, kind: 'other' });
        }
        // parapetti: sul vuoto e sopra i salti di quota
        const drop = !nb || (nb.elev <= t.elev - 1 && !isStair(nb));
        if (drop && !isStair(t)) {
          const edge = side === 'L' ? 'S' : 'E';
          const k = ab.add(`rail:${edge}`, () => drawRail(edge));
          draws.push({ key: k, x: side === 'L' ? sx - 32 : sx, y: sy - 11, z: depth(x, y, 60), area: t.area, kind: 'other' });
        }
      }

      // pareti sui bordi N e W
      for (const edge of ['N', 'W'] as const) {
        const nx = edge === 'N' ? x : x - 1, ny = edge === 'N' ? y - 1 : y;
        const nb = tileAt(nx, ny);
        const door = doorAt(x, y, edge);
        let need = false;
        if (isStair(t)) need = false;
        else if (!nb) need = true;
        else if (nb.room !== t.room && !isStair(nb) && nb.elev <= t.elev + 0.8) need = true;
        if (door) need = true;
        if (!need) continue;
        const decor = WALL_DECOR.find((d) => d.x === x && d.y === y && d.edge === edge)?.type;
        const base: WallSpec = { kind: t.wall, tone: toneOf(t.room), edge, variant: (x * 3 + y * 5) % 4 };
        const px = edge === 'N' ? sx : sx - 32, py = sy - 16 - WALL_H;
        if (door) {
          const half = DOORS.filter((d) => d.kind === door.kind && d.edge === door.edge && (edge === 'N' ? d.y === y && d.x < x : d.x === x && d.y < y) && Math.abs(d.x - x) + Math.abs(d.y - y) === 1).length ? 1 : 0;
          const mk = (open: boolean) => ab.add(`door:${door.kind}:${edge}:${open}:${half}:${t.wall}:${base.tone}`, () => drawWall({ ...base, door: door.kind, open, half, variant: 1 }));
          doorDraws.push({ def: door, open: mk(true), closed: mk(false), x: px, y: py, z: depth(x, y, -50), area: t.area });
        } else {
          const k = ab.add(`wall:${t.wall}:${base.tone}:${edge}:${decor ?? ''}:${base.variant}`, () => drawWall({ ...base, decor }));
          draws.push({ key: k, x: px, y: py, z: depth(x, y, -50), area: t.area, kind: 'wall', tx: x, ty: y });
          if (decor === 'sconce' || decor === 'window' || decor === 'niche') {
            this.lights.push({ x: px + 16, y: py + 22, r: decor === 'window' ? 120 : decor === 'niche' ? 70 : 96, color: decor === 'sconce' ? 0xffc27a : 0x9ec8ff, flicker: decor === 'sconce', area: t.area, seed: x * 31 + y });
          }
        }
      }
    }

    // oggetti (tutte le varianti animate)
    const objKeys = new Map<string, string[]>();
    for (const o of OBJECTS) {
      const variants = o.kind === 'clock' || o.kind === 'jars' || o.kind === 'stove' ? [0, 1, 2] : [(o.x + o.y) % 4];
      objKeys.set(o.id, variants.map((v) => ab.add(`obj:${o.kind}:${v}`, () => drawObject(o.kind, v))));
    }
    ab.add('marker', () => drawMarker());
    ab.add('light', () => drawLight(128));
    const sets = new Set<string>(['player', 'soul', 'soul_f', 'soul_child', 'soul_dog', 'soul_fused', ...NPCS.map((n) => n.sprite)]);
    for (const s of sets) for (const view of ['front', 'back'] as const) for (let f = 0; f < 4; f++) ab.add(`char:${s}:${view}:${f}`, () => charFrame(s, view, f));

    this.atlas = ab.build();

    for (const d of draws) {
      const sp = new Sprite(this.atlas.get(d.key));
      sp.position.set(d.x, d.y);
      sp.zIndex = d.z;
      this.world.addChild(sp);
      if (HIDDEN_AREAS.includes(d.area)) this.hidables.push({ sprite: sp, area: d.area });
      if (d.kind === 'wall') this.wallSprites.push({ sprite: sp, x: d.tx!, y: d.ty! });
    }
    for (const d of doorDraws) {
      const sp = new Sprite(this.atlas.get(d.closed));
      sp.position.set(d.x, d.y);
      sp.zIndex = d.z;
      this.world.addChild(sp);
      const entry: (typeof this.doorSprites)[number] = { def: d.def, sprite: sp, open: d.open, closed: d.closed };
      if (d.def.interact) entry.marker = this.makeMarker(d.x + 16, d.y + 4);
      this.doorSprites.push(entry);
      this.wallSprites.push({ sprite: sp, x: d.def.x, y: d.def.y });
      if (HIDDEN_AREAS.includes(d.area) && d.def.id !== 'cancello_riservato' && d.def.id !== 'porta_direttore') this.hidables.push({ sprite: sp, area: d.area });
    }
    for (const o of OBJECTS) {
      const t = tileAt(o.x, o.y);
      if (!t) continue;
      const keys = objKeys.get(o.id)!;
      const m = this.atlas.meta(keys[0]);
      const { sx, sy } = iso(o.x, o.y, t.elev);
      const sp = new Sprite(this.atlas.get(keys[0]));
      sp.position.set(sx - m.ox, sy - 16 - m.oy);
      sp.zIndex = depth(o.x, o.y, o.solid === false ? 12 : 20);
      this.world.addChild(sp);
      const entry: { def: ObjDef; sprite: Sprite; marker?: Sprite } = { def: o, sprite: sp };
      if (o.interact) entry.marker = this.makeMarker(sx, sy - 16 - m.oy + 2);
      this.objSprites.set(o.id, entry);
      if (keys.length > 1) this.animated.push({ sprite: sp, keys, period: o.kind === 'clock' ? 0.7 : o.kind === 'stove' ? 0.18 : 1.6 });
      if (o.light) this.lights.push({ x: sx, y: sy - 16 - Math.min(40, m.oy - 6), r: o.light.r, color: o.light.color, flicker: !!o.light.flicker, area: t.area, seed: o.x * 17 + o.y * 5 });
    }

    // luci
    const lt = this.atlas.get('light');
    for (const l of this.lights) {
      const sp = new Sprite(lt);
      sp.anchor.set(0.5);
      sp.blendMode = 'add';
      sp.tint = l.color;
      sp.scale.set((l.r * 2) / 128);
      sp.position.set(l.x, l.y);
      this.lightLayer.addChild(sp);
      l.sprite = sp;
    }
    const pl = new Sprite(lt);
    pl.anchor.set(0.5);
    pl.blendMode = 'add';
    pl.tint = 0xffe2b8;
    pl.scale.set(1.5);
    pl.alpha = 0.55;
    this.lightLayer.addChild(pl);
    this.playerLight = pl;

    // giocatore
    const s = SPOTS.player_start;
    this.player = this.makeActor('player', 'player', s.x, s.y, s.face ?? 'S');
    this.centerOn(this.player);
  }
  private playerLight!: Sprite;

  private makeMarker(x: number, y: number): Sprite {
    const m = new Sprite(this.atlas.get('marker'));
    m.anchor.set(0.5, 1);
    m.position.set(x, y);
    m.zIndex = 1e7;
    m.visible = false;
    this.world.addChild(m);
    return m;
  }

  private makeActor(id: string, set: string, x: number, y: number, face: Face): Actor {
    const sp = new Sprite(this.atlas.get(`char:${set}:front:0`));
    sp.anchor.set(0.5, 1);
    this.world.addChild(sp);
    const a: Actor = { id, set, sprite: sp, x, y, elev: tileAt(x, y)?.elev ?? 0, path: [], face, frame: 0, animT: 0, moving: false };
    this.placeActor(a);
    return a;
  }

  private placeActor(a: Actor): void {
    const { sx, sy } = iso(a.x, a.y, a.elev);
    a.sprite.position.set(Math.round(sx), Math.round(sy + 5));
    a.sprite.zIndex = depth(a.x, a.y, 25);
    const front = a.face === 'S' || a.face === 'E';
    const flip = a.face === 'S' || a.face === 'W';
    a.sprite.texture = this.atlas.get(`char:${a.set}:${front ? 'front' : 'back'}:${a.moving ? a.frame : 0}`);
    a.sprite.scale.x = flip ? -1 : 1;
  }

  // ------------------------------------------------------------------ sincronizzazione con lo stato
  sync(g: GameState, extra: SyncExtra): void {
    const first = this.g === null || this.g.seed !== g.seed || this.g.mode !== g.mode;
    this.g = g;
    this.extra = extra;
    if (!this.ready) return;
    if (first || (Math.abs(this.player.x - g.player.x) + Math.abs(this.player.y - g.player.y) > 0.01 && !this.player.moving && this.player.path.length === 0)) {
      this.player.x = g.player.x;
      this.player.y = g.player.y;
      this.player.elev = tileAt(g.player.x, g.player.y)?.elev ?? 0;
      this.player.path = [];
      this.placeActor(this.player);
      this.centerOn(this.player);
      this.room = '';
    }
    // aree nascoste
    for (const h of this.hidables) h.sprite.visible = g.areas.includes(h.area);
    for (const l of this.lights) if (l.sprite) l.sprite.visible = !HIDDEN_AREAS.includes(l.area) || g.areas.includes(l.area);
    // oggetti condizionali
    this.solids = new Set<string>();
    for (const [, e] of this.objSprites) {
      const t = tileAt(e.def.x, e.def.y)!;
      const vis = check(g, e.def.cond) && (!HIDDEN_AREAS.includes(t.area) || g.areas.includes(t.area));
      e.sprite.visible = vis;
      if (vis && e.def.solid !== false) this.solids.add(key(e.def.x, e.def.y));
    }
    // porte
    for (const d of this.doorSprites) {
      const a = tileAt(d.def.x, d.def.y), b = d.def.edge === 'N' ? tileAt(d.def.x, d.def.y - 1) : tileAt(d.def.x - 1, d.def.y);
      const open = !d.def.decor && !!a && !!b && g.areas.includes(a.area) && g.areas.includes(b.area);
      d.sprite.texture = this.atlas.get(open ? d.open : d.closed);
    }
    this.syncNpcs(g);
    this.syncSouls();
    this.ambientRect.clear().rect(0, 0, 4096, 4096).fill(extra.ambient);
    this.checkRoom();
  }

  private syncNpcs(g: GameState): void {
    const plans = npcPlans(g);
    const seen = new Set<string>();
    for (const p of plans) {
      const spot = SPOTS[p.spot];
      if (!spot) continue;
      const t = tileAt(spot.x, spot.y);
      if (!t || (HIDDEN_AREAS.includes(t.area) && !g.areas.includes(t.area))) continue;
      seen.add(p.id);
      let a = this.npcs.get(p.id);
      const def = NPCS.find((n) => n.id === p.id)!;
      if (!a) {
        a = this.makeActor(p.id, def.sprite, spot.x, spot.y, spot.face ?? 'S');
        a.spot = p.spot;
        this.npcs.set(p.id, a);
      } else if (a.spot !== p.spot) {
        a.spot = p.spot;
        const ctx: StepCtx = { areas: ['reception', 'judgment', 'employee', 'interview', 'archive', 'management', 'restricted', 'director'], solids: this.solids };
        const path = findPath(Math.round(a.x), Math.round(a.y), spot.x, spot.y, ctx);
        if (path && path.length < 60) a.path = path;
        else { a.x = spot.x; a.y = spot.y; a.elev = t.elev; a.face = spot.face ?? 'S'; this.placeActor(a); }
      }
      a.state = p.state;
    }
    for (const [id, a] of this.npcs) if (!seen.has(id)) { a.sprite.destroy(); a.label?.remove(); this.npcs.delete(id); }
  }

  private syncSouls(): void {
    const want = this.extra.soulSprite;
    if (this.soulSprite && (!want || this.soulSprite.label !== want)) { this.soulSprite.destroy(); this.soulSprite = null; }
    if (want && !this.soulSprite) {
      const sp = new Sprite(this.atlas.get(`char:${want}:back:0`));
      sp.label = want;
      sp.anchor.set(0.5, 1);
      const { sx, sy } = iso(11, 14, 0);
      sp.position.set(sx, sy + 2);
      sp.zIndex = depth(11, 14, 26);
      this.world.addChild(sp);
      this.soulSprite = sp;
    }
    const spots: [number, number][] = [[9, 28], [10, 28], [14, 28], [15, 28], [9, 27], [15, 27]];
    const n = Math.min(spots.length, this.extra.waiting);
    while (this.waitingSprites.length > n) this.waitingSprites.pop()!.destroy();
    while (this.waitingSprites.length < n) {
      const i = this.waitingSprites.length;
      const sp = new Sprite(this.atlas.get(`char:${i % 2 ? 'soul_f' : 'soul'}:front:${i % 4}`));
      sp.anchor.set(0.5, 1);
      const { sx, sy } = iso(spots[i][0], spots[i][1], 0);
      sp.position.set(sx, sy - 2);
      sp.scale.x = i % 2 ? -1 : 1;
      sp.zIndex = depth(spots[i][0], spots[i][1], 27);
      this.world.addChild(sp);
      this.waitingSprites.push(sp);
    }
  }

  // ------------------------------------------------------------------ camera
  get zoom(): number { return ZOOMS[this.zoomIdx]; }
  zoomBy(d: number): void { this.zoomIdx = Math.max(0, Math.min(ZOOMS.length - 1, this.zoomIdx + d)); }
  recenter(): void { this.follow = true; }
  private centerOn(a: Actor): void {
    const { sx, sy } = iso(a.x, a.y, a.elev);
    this.cam.x = sx; this.cam.y = sy - 20;
  }
  private applyCamera(): void {
    const w = this.app.renderer.width, h = this.app.renderer.height, z = this.zoom;
    this.cam.x = Math.max(-1050, Math.min(1380, this.cam.x));
    this.cam.y = Math.max(-140, Math.min(1260, this.cam.y));
    this.world.scale.set(z);
    this.world.position.set(Math.round(w / 2 - this.cam.x * z), Math.round(h / 2 - this.cam.y * z));
  }
  private screenToWorld(px: number, py: number): { wx: number; wy: number } {
    return { wx: (px - this.world.position.x) / this.zoom, wy: (py - this.world.position.y) / this.zoom };
  }
  private worldToScreen(wx: number, wy: number): { x: number; y: number } {
    return { x: wx * this.zoom + this.world.position.x, y: wy * this.zoom + this.world.position.y };
  }

  // ------------------------------------------------------------------ input
  private onDown = (e: PointerEvent) => {
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false });
    if (this.pointers.size === 2) { const [a, b] = [...this.pointers.values()]; this.pinch = Math.hypot(a.x - b.x, a.y - b.y); }
  };
  private onMove = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (this.pinch > 0 && Math.abs(d - this.pinch) > 60) { this.zoomBy(d > this.pinch ? 1 : -1); this.pinch = d; }
      a.moved = b.moved = true;
      return;
    }
    if (!p.moved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 9) p.moved = true;
    if (p.moved) { this.follow = false; this.cam.x -= dx / this.zoom; this.cam.y -= dy / this.zoom; }
  };
  private onUp = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId);
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinch = 0;
    if (!p || p.moved || !this.cb.canAct()) return;
    const r = this.app.canvas.getBoundingClientRect();
    this.tap(e.clientX - r.left, e.clientY - r.top);
  };
  private onWheel = (e: WheelEvent) => { e.preventDefault(); this.zoomBy(e.deltaY < 0 ? 1 : -1); };
  private onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    const k = e.key.toLowerCase();
    if (e.type === 'keydown') {
      this.keys.add(k);
      if (!this.cb.canAct()) return;
      if (k === 'e' || k === ' ' || k === 'enter') { e.preventDefault(); this.interactNear(); }
      if (k === '+' || k === '=') this.zoomBy(1);
      if (k === '-') this.zoomBy(-1);
    } else this.keys.delete(k);
  };
  private onBlur = () => { this.keys.clear(); this.pointers.clear(); };

  private bindInput(): void {
    const c = this.app.canvas;
    c.addEventListener('pointerdown', this.onDown);
    window.addEventListener('pointermove', this.onMove);
    window.addEventListener('pointerup', this.onUp);
    window.addEventListener('pointercancel', this.onUp);
    c.addEventListener('wheel', this.onWheel, { passive: false });
    window.addEventListener('keydown', this.onKey);
    window.addEventListener('keyup', this.onKey);
    window.addEventListener('blur', this.onBlur);
  }
  private unbindInput(): void {
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointercancel', this.onUp);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('keyup', this.onKey);
    window.removeEventListener('blur', this.onBlur);
  }

  private targets(): (ViewTarget & { rect: [number, number, number, number]; z: number })[] {
    const g = this.g!;
    const out: (ViewTarget & { rect: [number, number, number, number]; z: number })[] = [];
    for (const [id, a] of this.npcs) {
      const def = NPCS.find((n) => n.id === id)!;
      const p = a.sprite.position;
      out.push({ type: 'npc', id, label: def.name, x: Math.round(a.x), y: Math.round(a.y), rect: [p.x - 13, p.y - 50, 26, 52], z: a.sprite.zIndex });
    }
    for (const [id, e] of this.objSprites) {
      if (!e.def.interact || !e.sprite.visible) continue;
      const m = e.sprite;
      out.push({ type: 'obj', id, label: OBJ_LABEL[id] ?? id, x: e.def.x, y: e.def.y, rect: [m.position.x + 6, m.position.y, m.width - 12, m.height - 6], z: m.zIndex });
    }
    for (const d of this.doorSprites) {
      if (!d.def.interact || !d.sprite.visible) continue;
      const t = tileAt(d.def.x, d.def.y)!;
      if (HIDDEN_AREAS.includes(t.area) && !g.areas.includes(t.area) && d.def.id !== 'cancello_riservato' && d.def.id !== 'porta_direttore') continue;
      out.push({ type: 'door', id: d.def.id, label: OBJ_LABEL[d.def.id] ?? d.def.id, x: d.def.x, y: d.def.y, rect: [d.sprite.position.x, d.sprite.position.y + 6, 32, WALL_H + 8], z: d.sprite.zIndex });
    }
    return out;
  }

  private tap(px: number, py: number): void {
    const { wx, wy } = this.screenToWorld(px, py);
    const hit = this.targets().filter((t) => wx >= t.rect[0] && wx <= t.rect[0] + t.rect[2] && wy >= t.rect[1] && wy <= t.rect[1] + t.rect[3]).sort((a, b) => b.z - a.z)[0];
    if (hit) { this.goInteract(hit); return; }
    // tessera sotto il dito (preferendo quelle più avanti)
    let best: { x: number; y: number } | null = null, bestD = -Infinity;
    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
      const t = GRID[y][x];
      if (!t) continue;
      if (HIDDEN_AREAS.includes(t.area) && !this.g!.areas.includes(t.area)) continue;
      const { sx, sy } = iso(x, y, t.elev);
      if (Math.abs(wx - sx) / 32 + Math.abs(wy - sy) / 16 <= 1 && x + y > bestD) { best = { x, y }; bestD = x + y; }
    }
    if (best) this.walkTo(best.x, best.y, null);
  }

  private ctx(): StepCtx {
    const solids = new Set(this.solids);
    for (const a of this.npcs.values()) solids.add(key(Math.round(a.x), Math.round(a.y)));
    return { areas: this.g!.areas, solids };
  }

  private goInteract(t: ViewTarget): void {
    const px = Math.round(this.player.x), py = Math.round(this.player.y);
    if (this.adjacentTo(px, py, t)) { this.face(t); this.cb.onInteract(t); return; }
    this.walkTo(t.x, t.y, t);
  }

  private adjacentTo(px: number, py: number, t: ViewTarget): boolean {
    if (t.type === 'door') {
      const d = DOORS.find((x) => x.id === t.id)!;
      const ox = d.edge === 'W' ? d.x - 1 : d.x, oy = d.edge === 'N' ? d.y - 1 : d.y;
      return (px === d.x && py === d.y) || (px === ox && py === oy) || (Math.abs(px - d.x) + Math.abs(py - d.y) === 1 && tileAt(px, py)?.room === tileAt(d.x, d.y)?.room);
    }
    const a = tileAt(px, py), b = tileAt(t.x, t.y);
    return Math.abs(px - t.x) + Math.abs(py - t.y) === 1 && !!a && !!b && Math.abs(a.elev - b.elev) <= 0.8 && (a.room === b.room || isStair(a) || isStair(b));
  }

  private face(t: { x: number; y: number }): void {
    const dx = t.x - Math.round(this.player.x), dy = t.y - Math.round(this.player.y);
    this.player.face = Math.abs(dx) >= Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : dy > 0 ? 'S' : 'N';
    this.placeActor(this.player);
  }

  private walkTo(x: number, y: number, then: ViewTarget | null): void {
    const g = this.g!;
    const t = tileAt(x, y);
    if (!t) return;
    const px = Math.round(this.player.x), py = Math.round(this.player.y);
    const ctx = this.ctx();
    let path: { x: number; y: number }[] | null = null;
    if (then?.type === 'door') {
      const d = DOORS.find((q) => q.id === then.id)!;
      const cands = [{ x: d.x, y: d.y }, d.edge === 'N' ? { x: d.x, y: d.y - 1 } : { x: d.x - 1, y: d.y }];
      for (const c of cands) { const p = px === c.x && py === c.y ? [] : findPath(px, py, c.x, c.y, ctx); if (p && (!path || p.length < path.length)) path = p; }
    } else path = findPath(px, py, x, y, ctx);
    if (!path) {
      if (!g.areas.includes(t.area)) this.cb.onLocked(t.area);
      else if (then && !g.areas.includes(t.area)) this.cb.onLocked(t.area);
      return;
    }
    this.follow = true;
    this.pending = then;
    this.player.path = path;
    if (path.length === 0 && then) { this.pending = null; this.face(then); this.cb.onInteract(then); }
  }

  /** Interagisce con ciò che è più vicino (tasto E / pulsante «Esamina»). */
  interactNear(): void {
    if (this.near && this.cb.canAct()) this.goInteract(this.near);
  }

  private keyboardMove(): void {
    if (this.player.path.length || !this.cb.canAct()) return;
    const k = this.keys;
    const dir: [number, number] | null = k.has('w') || k.has('arrowup') ? [0, -1] : k.has('s') || k.has('arrowdown') ? [0, 1] : k.has('a') || k.has('arrowleft') ? [-1, 0] : k.has('d') || k.has('arrowright') ? [1, 0] : null;
    if (!dir) return;
    const px = Math.round(this.player.x), py = Math.round(this.player.y);
    const nx = px + dir[0], ny = py + dir[1];
    this.pending = null;
    this.follow = true;
    if (canStep(px, py, nx, ny, this.ctx())) this.player.path = [{ x: nx, y: ny }];
    else {
      this.player.face = dir[0] > 0 ? 'E' : dir[0] < 0 ? 'W' : dir[1] > 0 ? 'S' : 'N';
      this.placeActor(this.player);
      const t = tileAt(nx, ny);
      if (t && !this.g!.areas.includes(t.area) && Math.abs(t.elev - (tileAt(px, py)?.elev ?? 0)) <= 0.8) { this.keys.clear(); this.cb.onLocked(t.area); }
    }
  }

  // ------------------------------------------------------------------ ciclo
  private stepActor(a: Actor, dt: number, isPlayer: boolean): void {
    // Durante scene e pannelli il giocatore si ferma: il cammino (e l'interazione in sospeso) riprende dopo.
    if (isPlayer && a.path.length && !this.cb.canAct()) {
      if (a.moving) { a.moving = false; a.frame = 0; this.placeActor(a); }
      return;
    }
    if (!a.path.length) {
      if (a.moving) { a.moving = false; a.frame = 0; if (!isPlayer && a.spot) a.face = SPOTS[a.spot]?.face ?? a.face; this.placeActor(a); }
      return;
    }
    const next = a.path[0];
    const dx = next.x - a.x, dy = next.y - a.y;
    const dist = Math.hypot(dx, dy);
    a.face = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'E' : 'W') : dy > 0 ? 'S' : 'N';
    a.moving = true;
    const stepLen = SPEED * (isPlayer ? 1 : 0.6) * dt;
    const from = tileAt(Math.round(a.x - Math.sign(dx) * 0.49), Math.round(a.y - Math.sign(dy) * 0.49)) ?? tileAt(next.x, next.y)!;
    const to = tileAt(next.x, next.y)!;
    if (stepLen >= dist) {
      a.x = next.x; a.y = next.y; a.elev = to.elev;
      a.path.shift();
      if (isPlayer) {
        this.cb.onArrive(a.x, a.y);
        this.cb.onStep(to.floor);
        if (from.room !== to.room && !isStair(from) && !isStair(to)) this.cb.onDoor();
        this.checkRoom();
        if (!a.path.length && this.pending) {
          const t = this.pending;
          this.pending = null;
          if (this.adjacentTo(a.x, a.y, t)) { this.face(t); a.moving = false; this.placeActor(a); this.cb.onInteract(t); }
        }
      }
    } else {
      a.x += (dx / dist) * stepLen; a.y += (dy / dist) * stepLen;
      const k = 1 - (dist - stepLen);
      a.elev = from.elev + (to.elev - from.elev) * Math.max(0, Math.min(1, k));
    }
    a.animT += dt;
    if (a.animT > 0.11) { a.animT = 0; a.frame = (a.frame + 1) % 4; }
    this.placeActor(a);
  }

  private checkRoom(): void {
    const t = tileAt(Math.round(this.player.x), Math.round(this.player.y));
    if (t && t.room !== this.room && !isStair(t)) { this.room = t.room; this.cb.onRoom(t.room, t.area); }
  }

  private updateNear(): void {
    const px = this.player.x, py = this.player.y;
    let best: ViewTarget | null = null, bd = 2.3;
    const can = this.cb.canAct();
    const range = 5.5;
    for (const t of this.targets()) {
      const d = Math.hypot(t.x - px, t.y - py);
      const sameLevel = Math.abs((tileAt(t.x, t.y)?.elev ?? 0) - this.player.elev) <= 1;
      if (d < bd && sameLevel) { bd = d; best = t; }
      const marker = t.type === 'obj' ? this.objSprites.get(t.id)?.marker : t.type === 'door' ? this.doorSprites.find((x) => x.def.id === t.id)?.marker : undefined;
      if (marker) {
        marker.visible = can && d < range && sameLevel;
        marker.pivot.y = Math.round(Math.sin(this.time * 3 + t.x) * 1.5);
        marker.alpha = best === t ? 1 : 0.6;
      }
    }
    if ((best?.id ?? '') !== (this.near?.id ?? '')) { this.near = best; this.cb.onNear(best); }
  }

  private fadeWalls(): void {
    const px = this.player.x, py = this.player.y;
    for (const w of this.wallSprites) {
      const dx = w.x - px, dy = w.y - py;
      // una parete è «davanti» al giocatore se la sua tessera sta più avanti e vicina
      const front = dx + dy > 0.4 && dx > -1.6 && dy > -1.6 && dx < 3.2 && dy < 3.2 && dx + dy < 4.6;
      const target = front ? 0.28 : 1;
      w.sprite.alpha += (target - w.sprite.alpha) * 0.25;
    }
  }

  private updateLabelsAndBubbles(): void {
    const g = this.g!;
    const px = this.player.x, py = this.player.y;
    for (const [id, a] of this.npcs) {
      const d = Math.hypot(a.x - px, a.y - py);
      const show = d < 3.2 && this.cb.canAct();
      if (show && !a.label) {
        a.label = document.createElement('div');
        a.label.className = 'npc-label';
        a.label.textContent = NPCS.find((n) => n.id === id)!.name;
        this.overlay.appendChild(a.label);
      } else if (!show && a.label) { a.label.remove(); a.label = undefined; }
      if (a.label) {
        const s = this.worldToScreen(a.sprite.position.x, a.sprite.position.y - 54);
        a.label.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(s.y)}px) translate(-50%, -100%)`;
      }
    }
    // conversazioni colte a distanza: si interrompono quando ti avvicini
    if (g.mode === 'campaign' && !this.ohState) {
      const oh = OVERHEARD.find((o) => o.phase === g.phase && !g.convSeen[o.id] && check(g, o.cond) && this.npcs.has(o.a) && this.npcs.has(o.b));
      if (oh) {
        const a = this.npcs.get(oh.a)!, b = this.npcs.get(oh.b)!;
        const d = Math.hypot(a.x - px, a.y - py);
        if (!a.moving && !b.moving && Math.hypot(a.x - b.x, a.y - b.y) < 3 && d < 9 && d > 2.6) this.ohState = { id: oh.id, line: 0, next: this.time };
      }
    }
    if (this.ohState) {
      const oh = OVERHEARD.find((o) => o.id === this.ohState!.id)!;
      const a = this.npcs.get(oh.a), b = this.npcs.get(oh.b);
      const d = a ? Math.hypot(a.x - px, a.y - py) : 99;
      const last = this.ohState.line >= oh.lines.length - 1;
      if (!a || !b || d > 11) { this.clearBubbles(); this.ohState = null; }
      else if (d < 2.6 && !last) { this.ohState.line = oh.lines.length - 1; this.ohState.next = this.time; }
      else if (this.time >= this.ohState.next) {
        if (this.ohState.line >= oh.lines.length) { this.clearBubbles(); this.cb.onOverheard(oh.id); this.ohState = null; }
        else {
          this.clearBubbles();
          const who = this.ohState.line % 2 === 0 ? oh.a : oh.b;
          const el = document.createElement('div');
          el.className = 'speech-bubble';
          el.textContent = oh.lines[this.ohState.line];
          this.overlay.appendChild(el);
          this.bubbles.push({ el, actor: who, until: this.time + 2.6 });
          this.ohState.line++;
          this.ohState.next = this.time + 2.7;
        }
      }
    }
    for (const b of this.bubbles) {
      const a = this.npcs.get(b.actor);
      if (!a) continue;
      const s = this.worldToScreen(a.sprite.position.x, a.sprite.position.y - 62);
      b.el.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(s.y)}px) translate(-50%, -100%)`;
    }
  }
  private clearBubbles(): void {
    for (const b of this.bubbles) b.el.remove();
    this.bubbles = [];
  }

  private tick(dt: number): void {
    if (!this.g) return;
    this.time += dt;
    this.keyboardMove();
    this.stepActor(this.player, dt, true);
    for (const a of this.npcs.values()) this.stepActor(a, dt, false);
    if (this.follow) {
      const { sx, sy } = iso(this.player.x, this.player.y, this.player.elev);
      this.cam.x += (sx - this.cam.x) * Math.min(1, dt * 6);
      this.cam.y += (sy - 20 - this.cam.y) * Math.min(1, dt * 6);
    }
    this.applyCamera();
    this.updateNear();
    this.fadeWalls();
    this.updateLabelsAndBubbles();
    // animazioni ambientali
    for (const an of this.animated) an.sprite.texture = this.atlas.get(an.keys[Math.floor(this.time / an.period) % an.keys.length]);
    if (this.soulSprite) { const f = Math.floor(this.time * 3) % 4; this.soulSprite.texture = this.atlas.get(`char:${this.soulSprite.label}:${this.soulSprite.label === 'soul_dog' || this.soulSprite.label === 'soul_fused' ? 'front' : 'back'}:${f}`); this.soulSprite.pivot.y = Math.round(Math.sin(this.time * 1.6) * 1.2); }
    this.waitingSprites.forEach((s, i) => (s.pivot.y = Math.round(Math.sin(this.time * 1.3 + i * 2) * 1.2)));
    // luci
    const fl = this.extra.flicker;
    for (const l of this.lights) {
      if (!l.sprite || !l.flicker) continue;
      const n = Math.sin(this.time * 9 + l.seed) * 0.5 + Math.sin(this.time * 23 + l.seed * 3) * 0.5;
      l.sprite.alpha = 0.92 + n * fl - (fl > 0.2 && Math.sin(this.time * 2.3 + l.seed) > 0.985 ? 0.6 : 0);
    }
    this.playerLight.position.set(this.player.sprite.position.x, this.player.sprite.position.y - 24);
    this.renderLight();
  }

  private renderLight(): void {
    const w = this.app.renderer.width, h = this.app.renderer.height;
    const lw = Math.max(2, Math.ceil(w / 2)), lh = Math.max(2, Math.ceil(h / 2));
    if (!this.lightRT || this.lightRT.width !== lw || this.lightRT.height !== lh) {
      this.lightRT?.destroy(true);
      this.lightRT = RenderTexture.create({ width: lw, height: lh, resolution: 1, antialias: false });
      this.lightRT.source.scaleMode = 'nearest';
      this.lightSprite.texture = this.lightRT as unknown as Texture;
      this.lightSprite.scale.set(2);
    }
    this.lightLayer.scale.set(this.zoom / 2);
    this.lightLayer.position.set(this.world.position.x / 2, this.world.position.y / 2);
    this.app.renderer.render({ container: this.lightScene, target: this.lightRT, clear: true });
  }

  // ------------------------------------------------------------------ per i test end-to-end
  debug(): { x: number; y: number; room: string; moving: boolean; zoom: number; npcs: string[] } {
    return { x: Math.round(this.player.x), y: Math.round(this.player.y), room: this.room, moving: this.player.path.length > 0, zoom: this.zoom, npcs: [...this.npcs.keys()] };
  }
  /** Coordinate schermo del centro di una tessera (per simulare tocchi nei test). */
  tileToScreen(x: number, y: number): { x: number; y: number } {
    const t = tileAt(x, y);
    const { sx, sy } = iso(x, y, t?.elev ?? 0);
    const s = this.worldToScreen(sx, sy);
    const r = this.app.canvas.getBoundingClientRect();
    return { x: s.x + r.left, y: s.y + r.top };
  }
  targetToScreen(id: string): { x: number; y: number } | null {
    const t = this.targets().find((q) => q.id === id);
    if (!t) return null;
    const s = this.worldToScreen(t.rect[0] + t.rect[2] / 2, t.rect[1] + t.rect[3] * 0.6);
    const r = this.app.canvas.getBoundingClientRect();
    return { x: s.x + r.left, y: s.y + r.top };
  }
  walkToTile(x: number, y: number): void {
    this.walkTo(x, y, null);
  }
  interactWith(id: string): boolean {
    const t = this.targets().find((q) => q.id === id);
    if (!t) return false;
    this.goInteract(t);
    return true;
  }
}
