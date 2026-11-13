// Pixel art procedurale: pavimenti, fianchi dei dislivelli, pareti, porte, decorazioni murali.
import { PAL as P, Px, h2, mix, mul, ramp } from './px';
import type { DoorKind, FloorKind, WallDecor, WallKind } from '../../world/map';

export const TW = 64;
export const TH = 32;
export const EU = 16; // pixel per unità di quota
export const WALL_H = 52;

type Tone = 'green' | 'plum' | 'red' | 'blue';

function floorTexel(kind: FloorKind, tu: number, tv: number, s: number, opt: string): number {
  const n = h2(tu, tv, s);
  switch (kind) {
    case 'wood': {
      // parquet a listoni larghi: giunti sfalsati, venature rade
      const plank = tv >> 3;
      const along = tu + plank * 11 + s * 5;
      const board = h2(plank, along >> 4, s);
      const base = [P.wood2, mix(P.wood2, P.wood3, 0.5), P.wood3, mix(P.wood3, P.wood4, 0.45)][(board * 4) | 0];
      if ((tv & 7) === 0) return mul(base, 0.72);
      if ((along & 15) === 0) return mul(base, 0.72);
      if ((tv & 7) === 1) return mul(base, 1.08);
      const grain = h2(along >> 2, tv, s + 1);
      return grain > 0.9 ? mul(base, 0.88) : grain < 0.06 ? mul(base, 1.1) : base;
    }
    case 'plank': {
      const plank = tu / 6 | 0;
      if (tu % 6 === 0) return P.wood0;
      if ((tv + plank * 11) % 16 === 0) return P.wood0;
      const base = ramp([P.wood1, P.wood2, P.wood3], 0.2 + h2(plank, (tv + plank * 11) >> 4, s) * 0.7, tu, tv);
      if ((tu % 6 === 3) && ((tv + plank * 11) % 16 === 2 || (tv + plank * 11) % 16 === 14)) return P.iron3;
      return n > 0.88 ? mul(base, 0.8) : base;
    }
    case 'marble': {
      const light = (((tu >> 4) + (tv >> 4)) & 1) === 0;
      if ((tu & 15) === 0 || (tv & 15) === 0) return light ? P.marb1 : P.ink;
      const vein = h2((tu * 3 + tv * 5) >> 3, (tu - tv) >> 2, s) > 0.8;
      if (light) return vein ? P.marb2 : ramp([P.marb2, P.marb3, P.marb4], 0.35 + n * 0.5, tu, tv);
      return vein ? P.marb1 : ramp([P.marb0, P.ink3, P.marb1], n * 0.8, tu, tv);
    }
    case 'carpet': {
      const a = Math.abs((tu & 7) - 4) + Math.abs((tv & 7) - 4);
      if (a === 1) return P.brass2;
      if (a === 3) return P.red4;
      if (tu < 2 || tv < 2) return P.red1;
      return ramp([P.red1, P.red2, P.red3], 0.35 + n * 0.5, tu, tv);
    }
    case 'runner': {
      const edge = opt === 'L' ? tu : 31 - tu;
      if (edge < 2) return P.wood2;
      if (edge === 2 || edge === 5) return P.brass3;
      if (edge === 3 || edge === 4) return P.red1;
      const a = Math.abs((tu & 7) - 4) + Math.abs(((tv + 4) & 7) - 4);
      if (a === 0) return P.brass2;
      if (a === 2) return P.red4;
      return ramp([P.red2, P.red3], 0.3 + n * 0.6, tu, tv);
    }
    case 'stone': {
      const row = tv >> 4;
      const off = row & 1 ? 8 : 0;
      if ((tv & 15) === 0 || ((tu + off) & 15) === 0) return P.stone0;
      const slab = h2((tu + off) >> 4, row, s);
      const crack = h2(tu, tv >> 1, s + 9) > 0.992;
      if (crack) return P.stone0;
      return ramp([P.stone1, P.stone2, P.stone3], 0.2 + slab * 0.5 + n * 0.25, tu, tv);
    }
    case 'iron': {
      const bar = (tu & 3) === 0 || (tv & 3) === 0;
      if (bar) return (tu & 15) === 0 || (tv & 15) === 0 ? P.iron4 : n > 0.85 ? P.red1 : P.iron3;
      return (tu & 3) === 1 && (tv & 3) === 1 ? P.iron1 : P.void;
    }
    case 'obsidian': {
      const glint = h2(tu >> 1, tv >> 1, s) > 0.975;
      const streak = ((tu + tv * 2) & 31) < 2;
      if (glint) return P.blue3;
      if ((tu & 15) === 0 || (tv & 15) === 0) return P.void;
      return streak ? P.plum1 : ramp([P.ink, P.ink2, P.plum0], n, tu, tv);
    }
    case 'stairs': {
      const t = opt === 'u' ? tu : tv;
      const m = t & 7;
      const side = opt === 'u' ? tv : tu;
      const carpet = side > 9 && side < 22;
      if (m === 0) return carpet ? P.red5 : P.wood6;
      if (m === 7) return P.ink;
      if (m === 6) return carpet ? P.red0 : P.wood0;
      if (carpet) return side === 10 || side === 21 ? P.brass3 : ramp([P.red2, P.red3], 0.4 + n * 0.5, tu, tv);
      return ramp([P.wood2, P.wood3, P.wood4], 0.3 + n * 0.5, tu, tv);
    }
  }
}

export function drawFloor(kind: FloorKind, variant: number, opt = ''): Px {
  const px = new Px(TW, TH);
  for (let y = 0; y < TH; y++) for (let x = 0; x < TW; x++) {
    const xp = (x - 31.5) / 32, yp = (y - 15.5) / 16;
    const u = (xp + yp) / 2 + 0.5, v = (yp - xp) / 2 + 0.5;
    if (u < 0 || u >= 1 || v < 0 || v >= 1) continue;
    const tu = Math.floor(u * 32), tv = Math.floor(v * 32);
    let c = floorTexel(kind, tu, tv, variant, opt);
    // filo di luce sul bordo alto, ombra sul bordo basso: la griglia si legge senza righe disegnate
    if (kind !== 'iron') {
      if (tu === 0 || tv === 0) c = mul(c, 1.14);
      else if (tu === 31 || tv === 31) c = mul(c, 0.82);
    }
    px.set(x, y, c);
  }
  return px;
}

export type FaceMat = 'stone' | 'wood' | 'iron';

function faceTexel(mat: FaceMat, i: number, r: number, s: number): number {
  const n = h2(i, r, s);
  if (mat === 'wood') {
    if (r < 2) return P.wood5;
    if (i % 8 === 0) return P.wood0;
    if (r % 16 === 15) return P.wood0;
    const inset = i % 8 > 1 && i % 8 < 7 && r % 16 > 3 && r % 16 < 13;
    return inset ? ramp([P.wood1, P.wood2], n, i, r) : ramp([P.wood2, P.wood3], 0.3 + n * 0.5, i, r);
  }
  if (mat === 'iron') {
    if (r < 1) return P.iron4;
    if (i % 16 === 0 || r % 16 === 0) return P.iron0;
    if ((i % 16 === 2 || i % 16 === 14) && (r % 16 === 2 || r % 16 === 14)) return P.iron4;
    return n > 0.9 ? P.red1 : ramp([P.iron1, P.iron2], n, i, r);
  }
  const row = (r / 6) | 0;
  const off = row & 1 ? 5 : 0;
  if (r < 1) return P.stone4;
  if (r % 6 === 0 || (i + off) % 10 === 0) return P.stone0;
  const block = h2(((i + off) / 10) | 0, row, s);
  return ramp([P.stone1, P.stone2, P.stone3], 0.15 + block * 0.5 + n * 0.2, i, r);
}

/** Fianco di un dislivello. side 'L' = faccia verso SW (sotto il lato sinistro-basso), 'R' = verso SE. */
export function drawFace(side: 'L' | 'R', mat: FaceMat, units: number, fadeOut = false): Px {
  const H = Math.round(units * EU);
  const px = new Px(32, H + 16);
  for (let i = 0; i < 32; i++) {
    const top = side === 'L' ? i >> 1 : 15 - (i >> 1);
    for (let r = 0; r < H; r++) {
      let c = faceTexel(mat, side === 'L' ? i : i + 32, r, 3);
      c = mul(c, side === 'L' ? 0.9 : 0.62);
      if (fadeOut) {
        const t = r / H;
        if (t > 0.35 && h2(i, r, 5) < (t - 0.35) / 0.65) continue;
        c = mix(c, P.void, Math.min(1, t * 1.1));
      }
      px.set(i, top + r, c);
    }
  }
  return px;
}

// ---------------- PARETI ----------------

function wallBase(kind: WallKind, tone: Tone, s: number): Px {
  const H = WALL_H;
  const px = new Px(32, H);
  const paper: Record<Tone, number[]> = {
    green: [P.green0, P.green1, P.green2], plum: [P.plum0, P.plum1, P.plum2], red: [P.red0, P.red1, P.red2], blue: [P.blue0, P.blue1, P.blue2],
  };
  for (let y = 0; y < H; y++) for (let x = 0; x < 32; x++) {
    const n = h2(x, y, s);
    let c: number = P.ink;
    if (kind === 'panel' || kind === 'glass') {
      const pal = kind === 'glass' ? [P.ink2, P.plum0, P.plum1] : paper[tone];
      if (y < 1) c = P.brass3;
      else if (y < 3) c = P.wood4;
      else if (y === 3) c = P.wood1;
      else if (y < 34) {
        // carta da parati damascata
        const mx = (x + ((y >> 3) & 1) * 4) & 7, my = y & 7;
        const motif = (mx === 3 && my > 1 && my < 6) || (my === 3 && mx > 1 && mx < 5) || (mx === 3 && my === 0);
        c = motif ? pal[2] : n > 0.9 ? pal[0] : pal[1];
        if (x % 16 === 0) c = pal[0];
      } else if (y < 36) c = y === 34 ? P.wood5 : P.wood2;
      else if (y < 50) {
        const fx = x & 15;
        const frame = fx < 2 || fx > 13 || y < 38 || y > 47;
        const bevel = fx === 2 || y === 38;
        c = frame ? ramp([P.wood2, P.wood3], n, x, y) : bevel ? P.wood0 : ramp([P.wood1, P.wood2], n, x, y);
        if (fx === 13 || y === 47) c = P.wood4;
      } else c = P.wood0;
    } else if (kind === 'plaster') {
      if (y < 2) c = P.stone4;
      else if (y === 2) c = P.stone1;
      else if (y < 35) {
        const stain = h2(x >> 2, y >> 3, s) > 0.8;
        c = stain ? P.paper0 : ramp([P.stone3, P.paper0, P.paper1], 0.3 + n * 0.45, x, y);
        if (h2(x, y >> 1, s + 4) > 0.985) c = P.stone1; // crepe
        if (y > 28 && h2(x >> 1, 0, s) > 0.6 && y - 28 < h2(x >> 1, 1, s) * 8) c = mul(c, 0.8); // umidità
      } else if (y < 37) c = P.wood3;
      else if (y < 50) c = x % 8 === 0 ? P.green0 : ramp([P.green0, P.green1], n, x, y);
      else c = P.ink;
    } else if (kind === 'brick') {
      const row = (y / 7) | 0, off = row & 1 ? 6 : 0;
      if (y % 7 === 0 || (x + off) % 12 === 0) c = P.stone0;
      else {
        const b = h2(((x + off) / 12) | 0, row, s);
        c = ramp([P.stone1, P.stone2, P.stone3], 0.1 + b * 0.55 + n * 0.2, x, y);
        if (b > 0.85 && n > 0.5) c = mix(c, P.green2, 0.5); // muschio
      }
      if (y < 1) c = P.stone4;
    } else {
      // iron
      if (y % 13 === 0 || x % 16 === 0) c = P.iron0;
      else if ((x % 16 === 2 || x % 16 === 14) && (y % 13 === 2 || y % 13 === 11)) c = P.iron4;
      else c = n > 0.92 ? P.red1 : ramp([P.iron1, P.iron2, P.iron3], 0.2 + n * 0.5, x, y);
      if (h2(x, 0, s) > 0.8 && y > 13 && y < 13 + h2(x, 1, s) * 30) c = mix(c, P.red1, 0.6); // colature di ruggine
    }
    px.set(x, y, c);
  }
  return px;
}

function decorate(px: Px, type: WallDecor, s: number): void {
  switch (type) {
    case 'window': {
      for (let y = 6; y < 32; y++) for (let x = 8; x < 24; x++) {
        const arch = y < 12 ? Math.abs(x - 15.5) <= 3 + (y - 6) * 0.9 : true;
        if (!arch) continue;
        const edge = x === 8 || x === 23 || y === 31 || (y < 12 && Math.abs(x - 15.5) > 2 + (y - 6) * 0.9);
        if (edge) { px.set(x, y, P.stone4); continue; }
        const fog = h2(x >> 1, (y + s) >> 1, 7);
        let c = ramp([P.blue0, P.blue1, P.blue2, P.blue3], 0.15 + (31 - y) / 40 + fog * 0.25, x, y);
        if (x === 15 || x === 16 || y === 18 || y === 19) c = P.ink;
        px.set(x, y, c);
      }
      px.hline(7, 32, 18, P.stone5);
      break;
    }
    case 'painting': {
      px.rect(8, 8, 16, 20, P.brass2);
      px.rect(9, 9, 14, 18, P.brass4);
      px.rect(10, 10, 12, 16, P.ink);
      px.ellipse(15.5, 16, 3, 3.6, P.bone1);
      px.ellipse(15.5, 16.5, 2.2, 2.6, P.bone2);
      px.rect(11, 21, 10, 5, P.ink3);
      px.rect(13, 20, 6, 2, P.ink4);
      px.set(8, 8, P.brass5); px.set(23, 8, P.brass5);
      break;
    }
    case 'sconce': {
      px.rect(14, 20, 4, 2, P.brass2);
      px.rect(15, 16, 2, 5, P.brass3);
      px.rect(13, 22, 6, 1, P.brass1);
      px.rect(15, 12, 2, 4, P.paper4);
      px.set(15, 10, P.fire2); px.set(16, 10, P.fire3); px.set(15, 11, P.fire3); px.set(16, 11, P.fire4);
      px.set(15, 9, P.fire1); px.set(16, 9, P.fire2);
      px.ellipse(15.5, 11, 5, 5, P.fire2, 34);
      break;
    }
    case 'shelf': {
      for (const sy of [10, 20]) {
        px.rect(5, sy + 8, 22, 2, P.wood4);
        px.rect(5, sy + 10, 22, 1, P.wood0);
        for (let x = 6; x < 26; ) {
          const w = 1 + ((h2(x, sy, s) * 3) | 0);
          const hh = 5 + ((h2(x, sy, s + 1) * 3) | 0);
          const col = [P.red2, P.green2, P.blue2, P.wood4, P.plum2, P.paper1][(h2(x, sy, s + 2) * 6) | 0];
          px.rect(x, sy + 8 - hh, w, hh, col);
          px.set(x, sy + 9 - hh, mul(col, 1.4));
          x += w + (h2(x, sy, s + 3) > 0.8 ? 1 : 0);
        }
      }
      break;
    }
    case 'board': {
      px.rect(5, 7, 22, 24, P.wood4);
      px.rect(6, 8, 20, 22, P.wood2);
      for (let i = 0; i < 7; i++) {
        const x = 7 + ((h2(i, 1, s) * 14) | 0), y = 9 + ((h2(i, 2, s) * 15) | 0);
        px.rect(x, y, 5, 6, i % 3 === 0 ? P.paper2 : P.paper4);
        px.hline(x + 1, y + 2, 3, P.paper0); px.hline(x + 1, y + 4, 2, P.paper0);
        px.set(x + 2, y, P.red4);
      }
      break;
    }
    case 'clockface': {
      px.ellipse(15.5, 17, 8, 8, P.brass2);
      px.ellipse(15.5, 17, 6.5, 6.5, P.paper3);
      px.line(15, 17, 15, 12, P.ink); px.line(15, 17, 19, 18, P.ink);
      for (let k = 0; k < 12; k++) px.set(15.5 + Math.cos((k * Math.PI) / 6) * 5.5, 17 + Math.sin((k * Math.PI) / 6) * 5.5, P.ink3);
      break;
    }
    case 'banner': {
      px.rect(9, 4, 14, 1, P.brass3);
      for (let y = 5; y < 31; y++) {
        const w = y > 26 ? 13 - (y - 26) * 2 : 13;
        for (let x = 0; x < w; x++) px.set(10 + ((13 - w) >> 1) + x, y, ramp([P.red1, P.red2, P.red3], 0.3 + h2(x, y, s) * 0.5 + (x < 3 ? 0.2 : 0), x, y));
      }
      // la spirale spezzata
      for (let a = 0; a < 26; a++) {
        const r = 0.8 + a * 0.16, t = a * 0.55;
        if (a === 13 || a === 14) continue;
        px.set(16 + Math.cos(t) * r, 15 + Math.sin(t) * r, a > 18 ? P.brass3 : P.brass4);
      }
      break;
    }
    case 'pipes': {
      for (const x of [9, 14, 22]) {
        px.rect(x, 3, 3, 46, P.brass1);
        px.vline(x, 3, 46, P.brass3);
        px.vline(x + 2, 3, 46, P.brass0);
        for (const y of [12, 30]) { px.rect(x - 1, y, 5, 2, P.brass2); px.hline(x - 1, y, 5, P.brass4); }
      }
      px.rect(8, 21, 17, 2, P.brass1); px.hline(8, 21, 17, P.brass3);
      px.ellipse(18, 22, 2.5, 2.5, P.red3); px.set(18, 22, P.red5);
      break;
    }
    case 'niche': {
      px.rect(7, 8, 18, 24, P.ink);
      px.rect(8, 9, 16, 22, P.blue0);
      for (const [jx, jy] of [[9, 12], [14, 12], [19, 12], [11, 22], [17, 22]] as const) {
        px.rect(jx, jy, 4, 7, P.blue2, 200);
        px.rect(jx + 1, jy + 2, 2, 4, P.blue4, 220);
        px.hline(jx, jy - 1, 4, P.wood4);
        px.set(jx + 1, jy + 3, P.blue5);
      }
      px.hline(8, 20, 16, P.stone3); px.hline(8, 30, 16, P.stone3);
      break;
    }
  }
}

function hole(px: Px, x0: number, x1: number, y0: number, arch: boolean): void {
  for (let y = y0; y < WALL_H; y++) for (let x = x0; x <= x1; x++) {
    if (arch && y < y0 + 5) {
      const mid = (x0 + x1) / 2, half = (x1 - x0) / 2;
      const dy = y0 + 5 - y;
      if (Math.abs(x - mid) > half * Math.sqrt(Math.max(0, 1 - (dy / 5.5) ** 2 * 0.55))) continue;
    }
    px.clear(x, y);
  }
}

function drawDoor(px: Px, kind: DoorKind, open: boolean, half: number, s: number): void {
  const frame = (x0: number, x1: number, y0: number, c1: number, c2: number) => {
    px.vline(x0 - 2, y0, WALL_H - y0, c1); px.vline(x0 - 1, y0, WALL_H - y0, c2);
    px.vline(x1 + 1, y0, WALL_H - y0, c2); px.vline(x1 + 2, y0, WALL_H - y0, c1);
    px.hline(x0 - 2, y0 - 2, x1 - x0 + 5, c1); px.hline(x0 - 1, y0 - 1, x1 - x0 + 3, c2);
  };
  switch (kind) {
    case 'arch': {
      const x0 = 6, x1 = 25, y0 = 12;
      frame(x0, x1, y0, P.wood5, P.wood2);
      if (open) hole(px, x0, x1, y0, true);
      else {
        px.rect(x0, y0, 20, WALL_H - y0, P.wood3);
        for (let y = y0; y < WALL_H; y++) for (let x = x0; x <= x1; x++) if ((x - x0) % 5 === 0) px.set(x, y, P.wood1);
        px.rect(x0, y0 + 10, 20, 2, P.iron2); px.rect(x0, WALL_H - 10, 20, 2, P.iron2);
        px.ellipse(x1 - 3, 33, 1.5, 1.5, P.brass4);
      }
      break;
    }
    case 'double': {
      const x0 = half === 0 ? 5 : 0, x1 = half === 0 ? 31 : 26, y0 = 8;
      if (half === 0) { px.vline(x0 - 2, y0, WALL_H - y0, P.brass3); px.vline(x0 - 1, y0, WALL_H - y0, P.wood2); }
      else { px.vline(x1 + 1, y0, WALL_H - y0, P.wood2); px.vline(x1 + 2, y0, WALL_H - y0, P.brass3); }
      px.hline(Math.max(0, x0 - 2), y0 - 2, x1 - x0 + 4, P.brass3); px.hline(Math.max(0, x0 - 2), y0 - 1, x1 - x0 + 4, P.wood2);
      if (open) hole(px, x0, x1, y0, false);
      else { px.rect(x0, y0, x1 - x0 + 1, WALL_H - y0, P.wood3); px.rect(x0 + 3, y0 + 4, x1 - x0 - 5, 14, P.wood2); px.rect(x0 + 3, y0 + 22, x1 - x0 - 5, 18, P.wood2); }
      break;
    }
    case 'gate': {
      const x0 = 3, x1 = 28, y0 = 6;
      frame(x0, x1, y0, P.iron4, P.iron1);
      hole(px, x0, x1, y0, true);
      if (!open) {
        for (let x = x0; x <= x1; x += 3) px.vline(x, y0 + 2, WALL_H - y0 - 2, P.iron3);
        px.hline(x0, 20, 26, P.iron4); px.hline(x0, 44, 26, P.iron4);
        for (let a = 0; a < 44; a++) {
          const r = 1 + a * 0.2, t = a * 0.42;
          if (a > 20 && a < 24) continue;
          px.set(15.5 + Math.cos(t) * r, 31 + Math.sin(t) * r, a > 30 ? P.brass2 : P.brass4);
          px.set(15.5 + Math.cos(t) * r, 32 + Math.sin(t) * r, P.brass1);
        }
      } else {
        px.vline(x0, y0 + 2, WALL_H - y0 - 2, P.iron3); px.vline(x0 + 2, y0 + 4, WALL_H - y0 - 4, P.iron2);
        px.vline(x1, y0 + 2, WALL_H - y0 - 2, P.iron3); px.vline(x1 - 2, y0 + 4, WALL_H - y0 - 4, P.iron2);
      }
      break;
    }
    case 'glass': {
      const x0 = 5, x1 = 26, y0 = 8;
      frame(x0, x1, y0, P.brass3, P.wood1);
      if (open) hole(px, x0, x1, y0, false);
      else {
        for (let y = y0; y < WALL_H - 2; y++) for (let x = x0; x <= x1; x++) {
          const glow = 1 - Math.hypot(x - 15.5, y - 28) / 24;
          px.set(x, y, ramp([P.blue1, P.blue2, P.blue3, P.blue4], glow * 0.9 + h2(x, y, s) * 0.2, x, y));
        }
        // ombra dietro il vetro: troppo larga, senza contorno preciso
        px.ellipse(15.5, 30, 7, 12, P.blue0, 110);
        px.ellipse(13, 22, 4, 5, P.blue0, 90);
        for (let x = 8; x < 24; x += 2) px.set(x, 14 + (h2(x, 0, 2) > 0.5 ? 1 : 0), P.brass4);
        for (let x = 11; x < 21; x += 2) px.set(x, 18, P.brass3);
        px.rect(x0, WALL_H - 2, 22, 2, P.wood1);
      }
      break;
    }
    case 'portal': {
      const x0 = half === 0 ? 4 : 0, x1 = half === 0 ? 31 : 27;
      for (let y = 4; y < WALL_H; y++) for (let x = x0; x <= x1; x++) {
        let c = ramp([P.wood1, P.wood2, P.wood3], 0.3 + h2(x >> 2, y, s) * 0.5, x, y);
        if ((x - x0) % 7 === 0) c = P.wood0;
        if (y === 14 || y === 15 || y === 38 || y === 39) c = y % 2 ? P.iron1 : P.iron3;
        px.set(x, y, c);
      }
      px.hline(x0, 3, x1 - x0 + 1, P.stone5); px.hline(x0, 2, x1 - x0 + 1, P.stone3);
      const hx = half === 0 ? 28 : 3;
      px.ellipse(hx, 28, 2.5, 2.5, P.iron4); px.ellipse(hx, 28, 1.3, 1.3, P.wood0);
      for (const y of [14, 38]) for (let x = x0 + 2; x < x1; x += 5) px.set(x, y, P.iron4);
      break;
    }
    case 'lift': {
      const x0 = half === 0 ? 4 : 0, x1 = half === 0 ? 31 : 27, y0 = 12;
      px.rect(x0, y0, x1 - x0 + 1, WALL_H - y0, P.red0);
      for (let y = y0; y < WALL_H; y++) for (let x = x0; x <= x1; x++) if (h2(x >> 1, y >> 2, s) > 0.7) px.set(x, y, P.red1);
      // cancelletto a pantografo
      for (let x = x0; x <= x1; x += 4) px.vline(x, y0, WALL_H - y0, P.brass3);
      for (let y = y0 + 2; y < WALL_H; y += 8) for (let x = x0; x <= x1; x++) if (((x + y) & 3) === 0) px.set(x, y + ((x >> 1) & 3), P.brass4);
      px.rect(Math.max(0, x0 - 1), y0 - 3, x1 - x0 + 2, 3, P.brass2); px.hline(Math.max(0, x0 - 1), y0 - 3, x1 - x0 + 2, P.brass5);
      // contatore dei piani
      const cx = half === 0 ? 22 : 2;
      px.rect(cx, 3, 8, 6, P.ink); px.rect(cx + 1, 4, 6, 4, P.paper3);
      px.vline(cx + 3, 5, 2, P.ink); px.vline(cx + 5, 4, 4, P.ink);
      break;
    }
    case 'small': {
      const x0 = 11, x1 = 20, y0 = 38;
      frame(x0, x1, y0, P.brass3, P.wood1);
      px.rect(x0, y0, 10, WALL_H - y0, P.wood4);
      px.vline(15, y0, WALL_H - y0, P.wood1);
      px.set(18, 45, P.brass5);
      break;
    }
    case 'iron': {
      const x0 = 10, x1 = 21, y0 = 10;
      frame(x0, x1, y0, P.iron4, P.iron0);
      for (let y = y0; y < WALL_H; y++) for (let x = x0; x <= x1; x++) px.set(x, y, ramp([P.iron1, P.iron2, P.iron3], 0.2 + h2(x, y, s) * 0.5, x, y));
      for (const y of [14, 30, 46]) { px.hline(x0, y, 12, P.iron0); for (let x = x0 + 1; x <= x1; x += 3) px.set(x, y + 1, P.iron4); }
      px.rect(14, 19, 4, 3, P.void); px.hline(14, 22, 4, P.iron4);
      break;
    }
    case 'renew': {
      const x0 = half === 0 ? 4 : 0, x1 = half === 0 ? 31 : 27, y0 = 8;
      for (let y = y0; y < WALL_H; y++) for (let x = x0; x <= x1; x++) {
        const t = (x - x0) / (x1 - x0 + 1);
        px.set(x, y, ramp([P.blue0, P.blue1, P.blue2, P.blue4], 0.1 + Math.abs(Math.sin((t + half) * 3.1)) * 0.75 + h2(x, y, s) * 0.12, x, y));
      }
      for (let x = x0; x <= x1; x += 9) px.vline(x, y0, WALL_H - y0, P.brass3);
      px.hline(x0, y0 - 1, x1 - x0 + 1, P.brass4); px.hline(x0, y0 - 2, x1 - x0 + 1, P.brass2);
      px.hline(x0, 28, x1 - x0 + 1, P.brass2);
      break;
    }
    case 'waiting': {
      const x0 = half === 0 ? 3 : 0, x1 = half === 0 ? 31 : 28, y0 = 8;
      for (let y = y0; y < WALL_H; y++) for (let x = x0; x <= x1; x++) {
        const qx = (x - x0) % 8, qy = (y - y0) % 8;
        const stud = qx === 4 && qy === 4;
        const fold = qx === 0 || qy === 0;
        px.set(x, y, stud ? P.brass4 : fold ? P.green0 : ramp([P.green1, P.green2, P.green3], 0.25 + (1 - Math.hypot(qx - 4, qy - 4) / 6) * 0.6, x, y));
      }
      px.hline(Math.max(0, x0 - 1), y0 - 1, x1 - x0 + 2, P.brass3); px.hline(Math.max(0, x0 - 1), y0 - 2, x1 - x0 + 2, P.wood1);
      if (half === 0) px.vline(31, y0, WALL_H - y0, P.ink); else px.vline(0, y0, WALL_H - y0, P.ink);
      break;
    }
  }
}

function skew(flat: Px, edge: 'N' | 'W'): Px {
  const out = new Px(32, flat.h + 16);
  for (let x = 0; x < 32; x++) {
    const dy = edge === 'N' ? x >> 1 : (31 - x) >> 1;
    for (let y = 0; y < flat.h; y++) {
      const i = (y * 32 + x) * 4;
      if (flat.data[i + 3] === 0) continue;
      const c = (flat.data[i] << 16) | (flat.data[i + 1] << 8) | flat.data[i + 2];
      out.set(x, y + dy, c, flat.data[i + 3]);
    }
  }
  if (edge === 'W') out.shade(0.74);
  return out;
}

export interface WallSpec { kind: WallKind; tone: Tone; edge: 'N' | 'W'; decor?: WallDecor; door?: DoorKind; open?: boolean; half?: number; variant: number }

export function drawWall(spec: WallSpec): Px {
  const flat = wallBase(spec.kind, spec.tone, spec.variant);
  if (spec.decor) decorate(flat, spec.decor, spec.variant);
  if (spec.door) drawDoor(flat, spec.door, !!spec.open, spec.half ?? 0, spec.variant);
  return skew(flat, spec.edge);
}

/** Parapetto basso sui bordi S/E affacciati sul vuoto o su un dislivello. */
export function drawRail(edge: 'S' | 'E'): Px {
  const px = new Px(32, 16 + 12);
  for (let x = 0; x < 32; x++) {
    const dy = edge === 'S' ? x >> 1 : (31 - x) >> 1; // S: dal vertice sinistro a quello basso
    px.set(x, dy, P.brass4); px.set(x, dy + 1, P.brass2);
    if (x % 6 === 2) { px.vline(x, dy + 2, 9, P.brass2); px.vline(x + 1, dy + 2, 9, P.brass0); }
    px.set(x, dy + 11, P.wood1);
  }
  if (edge === 'E') px.shade(0.8);
  return px;
}

/** Texture di luce a bande (niente sfumature continue). */
export function drawLight(size: number): Px {
  const px = new Px(size, size);
  const c = (size - 1) / 2;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x - c, y - c) / c;
    if (d >= 1) continue;
    const t = 1 - d;
    const steps = 7;
    const q = Math.floor(t * steps + (h2(x, y, 1) - 0.5) * 0.9) / steps;
    const a = Math.max(0, Math.min(1, q * q * 1.15));
    px.set(x, y, 0xffffff, Math.round(a * 255));
  }
  return px;
}
