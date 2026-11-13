// Pixel art procedurale dei personaggi: sprite animati (fronte/retro, 4 fotogrammi) e ritratti.
import { PAL as P, Px, h2, mix, mul, ramp } from './px';

export type HeadKind = 'human' | 'owl' | 'skull' | 'veil' | 'blank';
export interface CharSpec {
  head: HeadKind;
  skin: number;
  hair: number;
  hairStyle: 'short' | 'bun' | 'long' | 'bald' | 'tied';
  coat: number;
  sleeves?: number;
  long?: boolean;
  legs: number;
  shoes: number;
  accent: number;
  tall?: number;
  extra?: ('visor' | 'lantern' | 'glasses' | 'bow' | 'scarf' | 'fingers' | 'collar' | 'apron' | 'paperhand')[];
  ghost?: boolean;
}

export const CHARS: Record<string, CharSpec> = {
  player: { head: 'human', skin: P.skin2, hair: P.wood2, hairStyle: 'short', coat: P.blue1, legs: P.ink4, shoes: P.ink, accent: P.brass4, extra: ['visor', 'collar'] },
  pim: { head: 'human', skin: P.skin3, hair: P.red4, hairStyle: 'bun', coat: P.paper3, long: true, legs: P.paper2, shoes: P.wood1, accent: P.brass3, extra: ['bow', 'collar'] },
  bones: { head: 'skull', skin: P.bone2, hair: P.bone2, hairStyle: 'bald', coat: P.plum2, sleeves: P.paper3, legs: P.ink3, shoes: P.ink, accent: P.brass4, tall: 1 },
  vesper: { head: 'veil', skin: P.skin4, hair: P.ink, hairStyle: 'bun', coat: P.stone2, long: true, legs: P.stone2, shoes: P.ink, accent: P.stone5, tall: 3, extra: ['collar'] },
  hoot: { head: 'owl', skin: P.wood4, hair: P.wood3, hairStyle: 'short', coat: P.wood3, legs: P.wood1, shoes: P.ink, accent: P.green4, extra: ['scarf', 'glasses'] },
  grell: { head: 'human', skin: P.skin1, hair: P.stone4, hairStyle: 'long', coat: P.ink3, long: true, legs: P.ink3, shoes: P.ink, accent: P.stone3, tall: -2, extra: ['lantern'] },
  ilse: { head: 'human', skin: P.skin3, hair: P.ink3, hairStyle: 'tied', coat: P.paper4, long: true, legs: P.paper2, shoes: P.ink, accent: P.blue3, extra: ['glasses', 'collar'] },
  quill: { head: 'blank', skin: P.paper4, hair: P.stone3, hairStyle: 'bald', coat: P.stone4, long: true, legs: P.stone3, shoes: P.stone1, accent: P.paper2, tall: 5, extra: ['fingers'] },
  clerk: { head: 'human', skin: P.skin1, hair: P.stone3, hairStyle: 'short', coat: P.stone2, legs: P.ink3, shoes: P.ink, accent: P.stone5, extra: ['visor'] },
  clerk2: { head: 'human', skin: P.skin2, hair: P.wood1, hairStyle: 'bun', coat: P.green1, long: true, legs: P.green1, shoes: P.ink, accent: P.paper2, extra: ['collar'] },
  tea: { head: 'human', skin: P.skin3, hair: P.wood3, hairStyle: 'long', coat: P.stone3, long: true, legs: P.stone3, shoes: P.wood2, accent: P.paper4, tall: -8, extra: ['apron', 'paperhand'] },
  soul: { head: 'human', skin: P.blue5, hair: P.blue4, hairStyle: 'short', coat: P.blue3, long: true, legs: P.blue3, shoes: P.blue2, accent: P.blue5, ghost: true },
  soul_f: { head: 'human', skin: P.blue5, hair: P.blue4, hairStyle: 'long', coat: P.blue3, long: true, legs: P.blue3, shoes: P.blue2, accent: P.blue5, ghost: true },
  soul_child: { head: 'human', skin: P.blue5, hair: P.blue4, hairStyle: 'long', coat: P.blue3, long: true, legs: P.blue3, shoes: P.blue2, accent: P.paper4, tall: -8, ghost: true, extra: ['paperhand'] },
};

export const FW = 26;
export const FH = 50;
const CX = 13;
const FOOT = 48;

function shadeX(c: number, x: number, lim = CX + 2): number {
  return x >= lim ? mul(c, 0.74) : c;
}

function drawHead(px: Px, s: CharSpec, front: boolean, top: number): void {
  const cy = top + 5;
  const skinAt = (x: number, y: number) => shadeX(y < top + 2 ? mul(s.skin, 1.08) : s.skin, x, CX + 3);
  if (s.head === 'owl') {
    px.ellipse(CX, cy, 6.2, 5.6, (x, y) => shadeX(h2(x, y, 3) > 0.6 ? P.wood5 : P.wood4, x, CX + 3));
    px.set(CX - 6, top - 1, P.wood3); px.set(CX - 5, top - 2, P.wood3); px.set(CX - 5, top - 1, P.wood4);
    px.set(CX + 6, top - 1, P.wood2); px.set(CX + 5, top - 2, P.wood2); px.set(CX + 5, top - 1, P.wood3);
    if (front) {
      px.ellipse(CX - 2.5, cy, 2.6, 2.6, P.paper2); px.ellipse(CX + 3, cy, 2.6, 2.6, P.paper1);
      px.ellipse(CX - 2.5, cy, 1.4, 1.4, P.ink); px.ellipse(CX + 3, cy, 1.4, 1.4, P.ink);
      px.set(CX - 3, cy - 1, P.brass5); px.set(CX + 2, cy - 1, P.brass5);
      px.set(CX, cy + 2, P.brass4); px.set(CX + 1, cy + 2, P.brass3); px.set(CX, cy + 3, P.brass2);
      px.hline(CX - 1, cy - 1, 3, P.brass3);
    } else {
      for (let y = top + 1; y < top + 10; y += 2) for (let x = CX - 4; x < CX + 5; x += 2) px.set(x + ((y >> 1) & 1), y, P.wood2);
    }
    return;
  }
  if (s.head === 'skull') {
    px.ellipse(CX, cy - 0.5, 5, 5, (x, y) => shadeX(y < top + 2 ? P.bone3 : P.bone2, x, CX + 3));
    px.rect(CX - 3, cy + 3, 7, 3, P.bone1);
    if (front) {
      px.rect(CX - 3, cy - 1, 2, 2, P.ink); px.rect(CX + 1, cy - 1, 3, 2, P.ink);
      px.set(CX, cy + 1, P.ink3);
      for (let x = CX - 2; x <= CX + 3; x++) px.set(x, cy + 4, x % 2 ? P.ink : P.bone3);
      px.set(CX + 2, cy - 1, P.fire2, 150);
    } else px.vline(CX, cy - 3, 5, P.bone0);
    return;
  }
  if (s.head === 'blank') {
    px.ellipse(CX, cy, 5.4, 5.6, (x) => shadeX(P.stone3, x, CX + 3));
    if (front) {
      px.rect(CX - 3, cy - 4, 8, 10, P.paper4);
      px.vline(CX + 4, cy - 4, 10, P.paper2);
      px.hline(CX - 2, cy - 2, 5, P.paper2); px.hline(CX - 2, cy, 6, P.paper2); px.hline(CX - 2, cy + 2, 4, P.paper2);
      px.set(CX - 3, cy - 4, P.paper1);
    }
    return;
  }
  // umano / velo
  px.ellipse(CX, cy, 5, 5.3, skinAt);
  const hair = (x: number, y: number) => px.set(x, y, shadeX(s.hair, x, CX + 3));
  if (!front) {
    if (s.hairStyle !== 'bald') px.ellipse(CX, cy - 0.5, 5.2, 5.2, (x) => shadeX(s.hair, x, CX + 3));
    px.rect(CX - 2, cy + 4, 4, 2, mul(s.skin, 0.85));
  } else {
    px.set(CX - 1, cy, P.ink); px.set(CX + 2, cy, P.ink);
    px.set(CX - 1, cy - 1, mul(s.skin, 0.8)); px.set(CX + 2, cy - 1, mul(s.skin, 0.8));
    px.set(CX + 1, cy + 2, mul(s.skin, 0.75)); px.hline(CX, cy + 3, 2, mul(s.skin, 0.6));
    if (s.hairStyle !== 'bald') {
      for (let y = top - 1; y < top + 4; y++) for (let x = CX - 5; x <= CX + 5; x++) {
        const dx = (x - CX) / 5.4, dy = (y - cy) / 5.6;
        if (dx * dx + dy * dy <= 1.08 && (y < top + 2 || x < CX - 3 || x > CX + 3)) hair(x, y);
      }
      px.set(CX - 5, cy, shadeX(s.hair, CX - 5)); px.set(CX - 5, cy - 1, s.hair);
    }
  }
  if (s.hairStyle === 'bun') { px.ellipse(front ? CX - 3 : CX, top - 2, 2.4, 2.2, s.hair); px.set(front ? CX - 4 : CX - 1, top - 3, mul(s.hair, 1.3)); }
  if (s.hairStyle === 'long') for (let y = cy; y < cy + 8; y++) { hair(CX - 5, y); hair(CX + 5, y); if (!front) for (let x = CX - 4; x < CX + 5; x++) hair(x, y); else if (y < cy + 6) hair(CX - 4, y); }
  if (s.hairStyle === 'tied') { for (let y = cy + 2; y < cy + 8; y++) hair(front ? CX - 5 : CX, y); if (!front) hair(CX + 1, cy + 3); }
  if (s.head === 'veil') {
    px.rect(CX - 7, top, 15, 2, P.ink); px.rect(CX - 4, top - 3, 9, 3, P.ink2); px.hline(CX - 4, top - 1, 9, P.plum3);
    if (front) for (let y = top + 2; y < top + 9; y++) for (let x = CX - 5; x <= CX + 5; x++) if (((x + y) & 1) === 0 && px.alpha(x, y) > 0) px.set(x, y, P.ink, 215);
  }
}

/** Disegna un fotogramma. view: fronte (verso chi guarda, girato a destra) o retro. f: 0..3 ciclo del passo. */
export function drawChar(s: CharSpec, view: 'front' | 'back', f: number): Px {
  const px = new Px(FW, FH);
  const front = view === 'front';
  const t = s.tall ?? 0;
  const stride = f === 1 || f === 3;
  const bob = stride ? 1 : 0;
  const top = 10 - t + bob;
  const sh = top + 11;
  const hip = 35;
  const sleeve = s.sleeves ?? s.coat;
  const ex = new Set(s.extra ?? []);
  const armSwing = f === 1 ? 1 : f === 3 ? -1 : 0;

  // gambe o veste
  if (!s.long) {
    const legs: [number, number][] = f === 1 ? [[CX - 5, 1], [CX + 2, 0]] : f === 3 ? [[CX - 4, 0], [CX + 3, 1]] : [[CX - 4, 0], [CX + 1, 0]];
    legs.forEach(([lx, lift], i) => {
      for (let y = hip; y < FOOT - lift; y++) for (let x = lx; x < lx + 3; x++) px.set(x, y, shadeX(s.legs, x + (i ? 1 : 0), CX + 1));
      px.rect(lx, FOOT - 2 - lift, 3, 2, s.shoes);
      px.set(lx + (front ? 3 : -1), FOOT - 1 - lift, s.shoes);
    });
  } else {
    const sway = f === 1 ? 1 : f === 3 ? -1 : 0;
    for (let y = sh + 6; y < FOOT - 1; y++) {
      const k = (y - sh - 6) / (FOOT - sh - 7);
      const half = 5.5 + k * (t <= -6 ? 1.5 : 3);
      const off = Math.round(sway * k);
      for (let x = Math.round(CX - half) + off; x <= Math.round(CX + half) + off; x++) {
        let c = shadeX(s.coat, x, CX + 2);
        if ((x - CX + 30) % 4 === 0 && y > sh + 9) c = mul(c, 0.85);
        px.set(x, y, c);
      }
    }
    px.rect(CX - 3 + sway, FOOT - 1, 2, 1, s.shoes); px.rect(CX + 1 + sway, FOOT - 1, 2, 1, s.shoes);
    if (ex.has('apron') && front) for (let y = sh + 3; y < FOOT - 4; y++) for (let x = CX - 3; x <= CX + 3; x++) px.set(x, y, shadeX(P.paper3, x, CX + 2));
  }
  // busto
  for (let y = sh; y < (s.long ? sh + 7 : hip + 1); y++) {
    const half = y === sh ? 5 : 6;
    for (let x = CX - half; x < CX + half; x++) px.set(x, y, shadeX(s.coat, x, CX + 2));
  }
  if (front) {
    if (ex.has('collar')) { px.set(CX - 1, sh, P.paper4); px.set(CX, sh, P.paper4); px.set(CX, sh + 1, P.paper3); }
    for (let y = sh + 2; y < (s.long ? sh + 7 : hip - 1); y += 3) px.set(CX, y, s.accent);
    if (s.head === 'skull') { for (let y = sh; y < sh + 6; y++) { px.set(CX - 1, y, P.paper3); px.set(CX, y, P.paper4); } px.set(CX, sh + 1, P.red3); }
    if (ex.has('scarf')) { px.rect(CX - 4, sh - 1, 9, 2, s.accent); px.rect(CX + 2, sh + 1, 2, 5, mul(s.accent, 0.8)); }
    if (ex.has('bow')) { px.set(CX - 1, sh + 1, P.red4); px.set(CX + 1, sh + 1, P.red4); px.set(CX, sh + 1, P.red2); }
  } else {
    px.vline(CX, sh + 1, s.long ? 6 : hip - sh - 1, mul(s.coat, 0.8));
    if (ex.has('scarf')) px.rect(CX - 4, sh - 1, 9, 2, s.accent);
  }
  // braccia
  const armLen = 11;
  const arms: [number, number][] = [[CX - 8, armSwing], [CX + 6, -armSwing]];
  arms.forEach(([ax, sw], i) => {
    for (let y = sh + 1; y < sh + armLen + sw; y++) for (let x = ax; x < ax + 2; x++) px.set(x, y, shadeX(sleeve, x + (i ? 2 : 0), CX + 2));
    const hy = sh + armLen + sw;
    const hand = ex.has('paperhand') && i === 0 ? P.paper4 : s.head === 'skull' ? P.bone2 : s.head === 'owl' ? P.skin2 : s.head === 'blank' ? P.paper3 : s.skin;
    px.rect(ax, hy, 2, 2, i ? mul(hand, 0.8) : hand);
    if (ex.has('fingers')) { px.vline(ax, hy + 2, 3, P.paper2); px.vline(ax + 1, hy + 2, 4, P.paper3); px.set(ax - 1, hy + 2, P.paper2); px.set(ax + 2, hy + 3, P.paper1); }
    if (ex.has('paperhand') && i === 0) { px.set(ax - 1, hy + 1, P.paper3); px.set(ax, hy + 2, P.paper2); }
  });
  if (ex.has('lantern')) {
    const lx = front ? CX + 9 : CX - 11, ly = sh + 12;
    px.vline(lx + 1, ly - 2, 2, P.brass2);
    px.rect(lx, ly, 3, 5, P.brass1); px.rect(lx, ly + 1, 3, 3, P.fire2); px.set(lx + 1, ly + 2, P.fire4);
    px.hline(lx, ly + 5, 3, P.brass3);
  }
  if (t >= 5) { px.vline(CX - 7, sh + 3, 6, mul(s.coat, 0.7)); px.vline(CX + 7, sh + 3, 6, mul(s.coat, 0.6)); } // troppe braccia, forse
  // collo e testa
  px.rect(CX - 1, top + 10, 3, 1, s.head === 'skull' ? P.bone0 : mul(s.skin, 0.8));
  drawHead(px, s, front, top);
  if (front) {
    if (ex.has('visor')) { px.hline(CX - 5, top + 2, 11, P.green3); px.hline(CX - 3, top + 3, 8, P.green2); }
    if (ex.has('glasses') && s.head === 'human') { px.set(CX - 2, top + 5, P.blue5); px.set(CX + 3, top + 5, P.blue5); px.set(CX, top + 5, P.brass3); px.set(CX + 1, top + 5, P.brass3); }
  }
  if (s.ghost) {
    for (let y = 0; y < FH; y++) {
      const k = y > FOOT - 14 ? Math.max(0, (FOOT - y) / 14) : 1;
      for (let x = 0; x < FW; x++) {
        const i = (y * FW + x) * 4;
        if (px.data[i + 3] === 0) continue;
        if (k < 1 && h2(x, y, f) > k * 1.2) { px.data[i + 3] = 0; continue; }
        px.data[i + 3] = 205 * Math.min(1, k + 0.25);
      }
    }
    px.outline(P.blue5, 110);
  } else px.outline(P.ink);
  return px;
}

/** Il cane di caserma (rientro da Altra Forma). */
export function drawDog(f: number): Px {
  const px = new Px(FW, FH);
  const y0 = FOOT - 12;
  px.ellipse(12, y0 + 4, 8, 4, (x) => shadeX(P.stone4, x, 14));
  px.ellipse(19, y0 + 1, 3.6, 3.4, P.stone4);
  px.set(21, y0, P.ink); px.set(23, y0 + 2, P.ink); px.rect(21, y0 + 2, 2, 2, P.stone5);
  px.set(17, y0 - 3, P.stone3); px.set(18, y0 - 3, P.stone3); px.set(17, y0 - 2, P.stone3);
  const lift = f % 2;
  for (const [lx, l] of [[6, lift], [9, 0], [15, 0], [18, lift]] as const) px.rect(lx, y0 + 7, 2, 5 - l, P.stone3);
  px.line(4, y0 + 2, 2, y0 - 2 - lift, P.stone4);
  px.set(11, y0 + 1, P.ink); px.set(12, y0 + 1, P.red1); // il foro tra le scapole
  for (let i = 3; i < px.data.length; i += 4) if (px.data[i] > 0) px.data[i] = 215;
  px.outline(P.blue5, 120);
  return px;
}

/** Il Rientrato: un corpo, tre volti a stadi diversi. */
export function drawFused(f: number): Px {
  const px = new Px(FW, FH);
  const body = (x: number, y: number) => ramp([P.blue2, P.blue3, P.blue4], 0.3 + h2(x >> 1, y >> 1, 3) * 0.5 + (x < 12 ? 0.2 : 0), x, y);
  for (let y = 20; y < FOOT; y++) { const half = 7 + Math.sin(y * 0.5 + f) * 1.2 + (y > 36 ? (y - 36) * 0.3 : 0); for (let x = Math.round(13 - half); x <= Math.round(13 + half); x++) px.set(x, y, body(x, y)); }
  px.vline(13, 22, 18, P.blue1); for (let y = 23; y < 39; y += 3) { px.set(12, y, P.blue1); px.set(14, y + 1, P.blue1); } // la sutura
  // tre teste, una sola emersa del tutto
  const heads: [number, number, number][] = [[13, 13, 1], [7, 16, 0.6], [19, 17, 0.45]];
  const order = [(f) % 3, (f + 1) % 3, (f + 2) % 3];
  order.forEach((hi, k) => {
    const [hx, hy, sc] = heads[k];
    px.ellipse(hx, hy, 5 * (0.6 + sc * 0.4), 5.4 * (0.6 + sc * 0.4), (x, y) => ramp([P.blue3, P.blue4, P.blue5], 0.3 + sc * 0.6 + h2(x, y, hi) * 0.1, x, y));
    if (sc > 0.9) { px.set(hx - 2, hy, P.ink); px.set(hx + 2, hy, P.ink); px.rect(hx - 1, hy + 3, 3, hi === 1 ? 2 : 1, P.blue0); }
    else { px.set(hx - 1, hy, P.blue1); px.set(hx + 1, hy, P.blue1); px.set(hx, hy + 2, P.blue1); }
  });
  px.rect(4, 24, 2, 10, P.blue3); px.rect(20, 23, 2, 12, P.blue4); px.rect(22, 27, 2, 7, P.blue3); px.rect(3, 34, 2, 3, P.blue5); px.rect(20, 35, 2, 3, P.blue5);
  for (let y = FOOT - 8; y < FOOT; y++) for (let x = 0; x < FW; x++) if (h2(x, y, f) > (FOOT - y) / 8) px.clear(x, y);
  for (let i = 3; i < px.data.length; i += 4) if (px.data[i] > 0) px.data[i] = 220;
  px.outline(P.blue5, 130);
  return px;
}

// ---------------- RITRATTI ----------------
export const PORTRAIT = 48;

export function drawPortrait(s: CharSpec, seed = 0, bg: number = P.ink2): Px {
  const px = new Px(PORTRAIT, PORTRAIT);
  const g = s.ghost;
  for (let y = 0; y < PORTRAIT; y++) for (let x = 0; x < PORTRAIT; x++) {
    const d = Math.hypot(x - 24, y - 22) / 34;
    px.set(x, y, ramp(g ? [P.blue1, P.blue0, P.ink] : [mul(bg, 1.7), mul(bg, 1.25), bg, P.ink], d, x, y));
  }
  const cx = 24, cy = 21;
  const lit = (base: number) => (x: number, y: number) => {
    const t = 0.55 + (cx - x) / 22 + (cy - y) / 60;
    return ramp([mul(base, 0.55), mul(base, 0.78), base, mul(base, 1.15)], t, x, y);
  };
  // spalle
  for (let y = 36; y < PORTRAIT; y++) {
    const half = 10 + (y - 36) * 1.25;
    for (let x = Math.round(cx - half); x <= Math.round(cx + half); x++) px.set(x, y, lit(s.coat)(x, y + 14));
  }
  const ex = new Set(s.extra ?? []);
  if (ex.has('collar') || s.head === 'skull') { px.poly([[cx - 5, 36], [cx, 43], [cx + 5, 36]], P.paper4); px.poly([[cx - 1, 38], [cx + 1, 38], [cx + 2, 47], [cx - 2, 47]], s.head === 'skull' ? P.red3 : mul(s.coat, 0.7)); }
  if (ex.has('scarf')) { px.rect(cx - 9, 34, 19, 4, s.accent); for (let x = cx - 9; x < cx + 10; x += 3) px.vline(x, 34, 4, mul(s.accent, 0.75)); px.rect(cx + 3, 38, 5, 10, mul(s.accent, 0.85)); }
  if (ex.has('bow')) { px.poly([[cx - 6, 37], [cx, 40], [cx - 6, 43]], P.red4); px.poly([[cx + 6, 37], [cx, 40], [cx + 6, 43]], P.red3); px.rect(cx - 1, 39, 3, 3, P.red2); }
  px.rect(cx - 3, 32, 7, 5, mul(s.head === 'skull' ? P.bone1 : s.head === 'owl' ? P.wood3 : s.head === 'blank' ? P.stone3 : s.skin, 0.7));

  if (s.head === 'owl') {
    px.ellipse(cx, cy, 14, 13, (x, y) => (h2(x >> 1, y >> 1, 5) > 0.55 ? lit(P.wood5)(x, y) : lit(P.wood4)(x, y)));
    px.poly([[cx - 13, 12], [cx - 9, 4], [cx - 6, 12]], P.wood3); px.poly([[cx + 13, 12], [cx + 9, 4], [cx + 6, 12]], P.wood2);
    px.ellipse(cx - 6, cy - 1, 6.2, 6.2, P.paper2); px.ellipse(cx + 6, cy - 1, 6.2, 6.2, P.paper1);
    for (const ex2 of [cx - 6, cx + 6]) {
      px.ellipse(ex2, cy - 1, 4.4, 4.4, P.brass3); px.ellipse(ex2, cy - 1, 3.5, 3.5, P.brass5); px.ellipse(ex2, cy - 1, 2.3, 2.3, P.ink);
      px.set(ex2 - 1, cy - 2, P.paper4);
      for (let a = 0; a < 16; a++) px.set(ex2 + Math.cos(a * 0.39) * 5.6, cy - 1 + Math.sin(a * 0.39) * 5.6, P.brass2);
    }
    px.hline(cx - 1, cy - 2, 3, P.brass2);
    px.poly([[cx - 2, cy + 3], [cx + 2, cy + 3], [cx, cy + 9]], P.brass4); px.line(cx, cy + 4, cx, cy + 8, P.brass2);
    for (let i = 0; i < 9; i++) px.set(cx - 8 + i * 2, cy + 10 + (i % 2), P.wood2);
    return frame(px);
  }
  if (s.head === 'skull') {
    px.ellipse(cx, cy - 2, 12, 12, lit(P.bone2));
    px.rect(cx - 7, cy + 6, 15, 8, P.bone1); px.rect(cx - 6, cy + 13, 13, 2, P.bone0);
    px.ellipse(cx - 5, cy - 1, 3.4, 3.8, P.ink); px.ellipse(cx + 5, cy - 1, 3.4, 3.8, P.ink);
    px.set(cx + 5, cy - 1, P.fire2); px.set(cx + 5, cy, P.fire0); px.set(cx - 5, cy - 1, P.fire1);
    px.poly([[cx, cy + 2], [cx - 2, cy + 6], [cx + 2, cy + 6]], P.ink3);
    for (let x = cx - 6; x <= cx + 6; x++) { px.set(x, cy + 9, P.ink); if ((x - cx) % 2) px.vline(x, cy + 8, 4, P.ink3); else px.vline(x, cy + 8, 4, P.bone3); }
    px.line(cx - 9, cy - 9, cx - 5, cy - 11, P.bone0); px.line(cx + 2, cy - 12, cx + 4, cy - 8, P.bone0);
    return frame(px);
  }
  if (s.head === 'blank') {
    px.ellipse(cx, cy, 13, 15, lit(P.stone3));
    px.rect(cx - 9, cy - 12, 19, 25, P.paper4);
    px.vline(cx + 9, cy - 12, 25, P.paper2); px.hline(cx - 9, cy + 12, 19, P.paper1);
    for (let i = 0; i < 6; i++) px.hline(cx - 6, cy - 8 + i * 4, 8 + ((h2(i, 2, 1) * 6) | 0), P.paper2);
    px.rect(cx - 6, cy - 11, 12, 2, P.paper3);
    px.set(cx - 9, cy - 12, P.paper0); px.set(cx + 9, cy - 12, P.paper0);
    // dita, troppe, che tengono il modulo
    for (let i = 0; i < 6; i++) px.vline(cx - 12 + i, cy + 6 + (i % 3), 6, i % 2 ? P.paper2 : P.paper3);
    for (let i = 0; i < 5; i++) px.vline(cx + 8 + i, cy - 2 + (i % 2) * 2, 7, i % 2 ? P.paper1 : P.paper3);
    return frame(px);
  }
  // umano / velo
  const skin = g ? P.blue4 : s.skin;
  const hairC = g ? P.blue2 : s.hair;
  const faceW = 10.5 + (h2(seed, 1, 7) - 0.5) * 2;
  px.ellipse(cx, cy, faceW, 13, lit(skin));
  px.ellipse(cx, cy + 6, faceW - 2.5, 8, lit(skin));
  const eyeY = cy - 1 + ((h2(seed, 2, 7) * 2) | 0);
  const eyeC = g ? P.blue0 : P.ink;
  for (const e of [cx - 5, cx + 5]) {
    px.rect(e - 2, eyeY, 4, 2, g ? P.blue5 : P.paper4); px.rect(e - 1, eyeY, 2, 2, eyeC);
    px.hline(e - 2, eyeY - 1, 4, mul(skin, 0.6)); px.hline(e - 2, eyeY - 3, 5, mul(hairC, g ? 1 : 0.9));
    px.hline(e - 2, eyeY + 2, 4, mul(skin, 0.82));
  }
  px.vline(cx + 1, eyeY + 1, 6, mul(skin, 0.75)); px.hline(cx - 1, eyeY + 7, 3, mul(skin, 0.65));
  const mouthW = 5 + ((h2(seed, 3, 7) * 3) | 0);
  px.hline(cx - (mouthW >> 1), cy + 9, mouthW, mul(skin, 0.5));
  if (s === CHARS.pim) { px.hline(cx - 4, cy + 9, 9, P.paper4); px.hline(cx - 4, cy + 10, 9, mul(skin, 0.55)); px.set(cx - 5, cy + 8, mul(skin, 0.55)); px.set(cx + 5, cy + 8, mul(skin, 0.55)); }
  if (s === CHARS.grell) { px.rect(cx - 6, eyeY, 3, 2, P.blue5); px.rect(cx + 4, eyeY, 3, 2, P.blue5); px.set(cx - 5, eyeY, P.blue3); px.set(cx + 5, eyeY, P.blue3); for (let i = 0; i < 20; i++) px.set(cx - 7 + ((h2(i, 4, 1) * 14) | 0), cy + 7 + ((h2(i, 5, 1) * 7) | 0), P.stone4); }
  // capelli
  const style = g ? (['short', 'long', 'tied', 'bun', 'bald'] as const)[(h2(seed, 4, 7) * 5) | 0] : s.hairStyle;
  if (style !== 'bald') {
    for (let y = cy - 15; y < cy - 4; y++) for (let x = cx - 13; x <= cx + 13; x++) {
      const dx = (x - cx) / (faceW + 1.6), dy = (y - cy) / 14.5;
      if (dx * dx + dy * dy <= 1 && (y < cy - 8 + Math.abs(x - cx - 3) * 0.25 || Math.abs(x - cx) > faceW - 1.5)) px.set(x, y, lit(hairC)(x, y));
    }
    if (style === 'long' || style === 'tied') for (let y = cy - 6; y < cy + (style === 'long' ? 16 : 6); y++) { px.rect(cx - Math.round(faceW) - 1, y, 3, 1, lit(hairC)(cx - 10, y)); if (style === 'long') px.rect(cx + Math.round(faceW) - 1, y, 3, 1, mul(hairC, 0.7)); }
    if (style === 'bun') { px.ellipse(cx - 2, cy - 16, 5.5, 4.5, lit(hairC)); }
  }
  if (s.head === 'veil') {
    px.rect(cx - 17, cy - 12, 35, 3, P.ink); px.rect(cx - 10, cy - 19, 21, 8, P.ink2); px.hline(cx - 10, cy - 13, 21, P.plum3);
    for (let y = cy - 9; y < cy + 6; y++) for (let x = cx - 12; x <= cx + 12; x++) if (((x + y) & 1) === 0) px.set(x, y, P.ink, 210);
    for (let x = cx - 12; x <= cx + 12; x += 2) px.set(x, cy + 6 + (x & 2 ? 1 : 0), P.ink);
  }
  if (ex.has('visor')) { px.rect(cx - 12, cy - 8, 25, 2, P.green3); px.poly([[cx - 10, cy - 6], [cx + 12, cy - 6], [cx + 9, cy - 3], [cx - 7, cy - 3]], P.green2, 210); }
  if (ex.has('glasses')) for (const e of [cx - 5, cx + 5]) { for (let a = 0; a < 14; a++) px.set(e + Math.cos(a * 0.45) * 3.6, eyeY + 0.5 + Math.sin(a * 0.45) * 3.2, P.brass4); px.hline(cx - 1, eyeY, 3, P.brass3); }
  if (g) for (let y = 0; y < PORTRAIT; y++) for (let x = 0; x < PORTRAIT; x++) { if (h2(x, y, seed) > 0.93) px.set(x, y, P.blue5, 90); if (y > 38 && h2(x, y, 3) > (PORTRAIT - y) / 12) px.set(x, y, P.blue0, 200); }
  return frame(px);
}

function frame(px: Px): Px {
  for (let i = 0; i < PORTRAIT; i++) {
    px.set(i, 0, P.brass2); px.set(i, PORTRAIT - 1, P.brass0); px.set(0, i, P.brass2); px.set(PORTRAIT - 1, i, P.brass0);
    px.set(i, 1, P.ink); px.set(i, PORTRAIT - 2, P.ink); px.set(1, i, P.ink); px.set(PORTRAIT - 2, i, P.ink);
  }
  px.set(0, 0, P.brass5); px.set(PORTRAIT - 1, 0, P.brass4); px.set(0, PORTRAIT - 1, P.brass4);
  return px;
}

/** Il sigillo a spirale spezzata (logo, timbri, icona). */
export function drawSeal(size: number, color: number = P.red3, cut = true): Px {
  const px = new Px(size, size);
  const c = (size - 1) / 2;
  px.ellipse(c, c, c, c, (x, y) => ramp([mul(color, 0.6), color, mul(color, 1.25)], 0.5 + (c - x) / size + (c - y) / size, x, y));
  for (let a = 0; a < 20; a++) { const t = a * 0.314; px.set(c + Math.cos(t) * (c - 0.5), c + Math.sin(t) * (c - 0.5), mul(color, 0.5)); }
  const turns = size / 5.2;
  for (let a = 0; a < turns * 40; a++) {
    const t = a / 6.4, r = 0.8 + (a / (turns * 40)) * (c - 3);
    if (cut && Math.abs(((t % (Math.PI * 2)) - 0.9)) < 0.22 && r > c * 0.28) continue;
    px.set(c + Math.cos(t) * r, c + Math.sin(t) * r, mix(color, P.ink, 0.72));
  }
  return px;
}
