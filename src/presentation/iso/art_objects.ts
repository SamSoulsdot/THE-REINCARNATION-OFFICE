// Pixel art procedurale degli arredi. Ogni oggetto è composto da volumi isometrici e dettagli a pixel.
// L'origine locale (0,0,0) è il vertice posteriore della tessera; la tessera occupa a,b ∈ [0,32].
import { PAL as P, Px, h2, isoBox, isoPt, mul, ramp, tones } from './px';

export interface ObjSprite { px: Px; ox: number; oy: number }

function canvas(h: number, w = 64): ObjSprite {
  return { px: new Px(w, h + 36), ox: w / 2, oy: h + 2 };
}

function B(s: ObjSprite, a0: number, b0: number, z0: number, w: number, d: number, h: number, base: number, t = 1.25, l = 0.95, r = 0.66): void {
  isoBox(s.px, s.ox, s.oy, a0, b0, z0, w, d, h, tones(base, t, l, r));
}
function pt(s: ObjSprite, a: number, b: number, z: number): [number, number] {
  const [x, y] = isoPt(s.ox, s.oy, a, b, z);
  return [Math.round(x), Math.round(y)];
}
function dot(s: ObjSprite, a: number, b: number, z: number, c: number, al = 255): void {
  const [x, y] = pt(s, a, b, z);
  s.px.set(x, y, c, al);
}
/** Linea verticale (lungo z) nello spazio dell'oggetto. */
function post(s: ObjSprite, a: number, b: number, z0: number, z1: number, c: number, w = 1): void {
  const [x, y] = pt(s, a, b, z1);
  s.px.rect(x, y, w, Math.max(1, z1 - z0), c);
}
function flame(s: ObjSprite, a: number, b: number, z: number): void {
  const [x, y] = pt(s, a, b, z);
  s.px.set(x, y, P.fire2); s.px.set(x, y - 1, P.fire3); s.px.set(x, y - 2, P.fire4); s.px.set(x, y - 3, P.fire2);
  s.px.set(x - 1, y - 1, P.fire1); s.px.set(x + 1, y - 1, P.fire1);
}
/** Lampada da scrivania con paralume verde. */
function lamp(s: ObjSprite, a: number, b: number, z: number): void {
  B(s, a, b, z, 4, 4, 1, P.brass2);
  post(s, a + 2, b + 2, z + 1, z + 7, P.brass3);
  B(s, a - 1, b - 1, z + 7, 6, 6, 3, P.green3, 1.5, 1.1, 0.8);
  const [x, y] = pt(s, a + 2, b + 2, z + 6);
  s.px.set(x, y, P.fire4); s.px.set(x + 1, y, P.fire3);
}
function papers(s: ObjSprite, a: number, b: number, z: number, n = 3): void {
  for (let i = 0; i < n; i++) B(s, a + (i % 2), b + ((i * 3) % 2), z + i, 8, 6, 1, i % 2 ? P.paper4 : P.paper2, 1.05, 0.9, 0.75);
}
function shadow(s: ObjSprite, a0: number, b0: number, w: number, d: number): void {
  const p = (a: number, b: number) => isoPt(s.ox, s.oy, a, b, 0);
  s.px.poly([p(a0, b0), p(a0 + w + 2, b0), p(a0 + w + 2, b0 + d + 2), p(a0, b0 + d + 2)], P.void, 70);
}
/** Volto di schedario: cassetti con maniglie sulla faccia sinistra. */
function drawers(s: ObjSprite, a0: number, b: number, z0: number, w: number, h: number, rows: number, cols: number, handle: number, line: number): void {
  for (let r = 0; r <= rows; r++) {
    const z = z0 + (h * r) / rows;
    const [x0, y0] = pt(s, a0, b, z), [x1, y1] = pt(s, a0 + w, b, z);
    if (r > 0 && r < rows) s.px.line(x0, y0, x1, y1, line);
  }
  for (let c = 1; c < cols; c++) {
    const a = a0 + (w * c) / cols;
    const [x, y] = pt(s, a, b, z0 + h);
    s.px.vline(x, y, h, line);
  }
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const [x, y] = pt(s, a0 + (w * (c + 0.5)) / cols, b, z0 + (h * (r + 0.55)) / rows);
    s.px.set(x, y, handle); s.px.set(x + 1, y, handle);
  }
}
function books(s: ObjSprite, a0: number, b: number, z: number, w: number, seed: number, palette: number[]): void {
  for (let a = a0 + 1; a < a0 + w - 1; ) {
    const bw = 1 + ((h2(a, z, seed) * 2.4) | 0);
    const bh = 5 + ((h2(a, z, seed + 1) * 4) | 0);
    const col = palette[(h2(a, z, seed + 2) * palette.length) | 0];
    if (h2(a, z, seed + 3) > 0.14) {
      for (let i = 0; i < bw; i++) {
        const [x, y] = pt(s, a + i, b, z + bh);
        s.px.vline(x, y, bh, i === 0 ? mul(col, 1.3) : col);
      }
    }
    a += bw;
  }
}

const BOOK_PAL = [P.red2, P.green2, P.blue2, P.wood4, P.plum2, P.paper1, P.paper2, P.stone4];
const FILE_PAL = [P.paper1, P.paper2, P.paper3, P.paper0, P.stone4, P.paper2];

export function drawObject(kind: string, v = 0): ObjSprite {
  switch (kind) {
    case 'desk': case 'desk_player': {
      const s = canvas(30);
      shadow(s, 3, 8, 26, 16);
      B(s, 3, 8, 0, 26, 16, 12, P.wood2);
      B(s, 2, 7, 12, 28, 18, 2, P.wood4, 1.2, 1, 0.7);
      drawers(s, 4, 24, 1, 10, 10, 3, 1, P.brass4, P.wood0);
      drawers(s, 18, 24, 1, 10, 10, 3, 1, P.brass4, P.wood0);
      B(s, 9, 11, 14, 12, 9, 1, P.green1, 1.4, 1, 0.8); // sottomano
      papers(s, 5, 9, 14, 3 + (v % 3));
      B(s, 16, 17, 14, 3, 3, 3, P.ink3); // calamaio
      lamp(s, 22, 10, 14);
      if (kind === 'desk_player') {
        B(s, 11, 13, 15, 8, 6, 1, P.paper4, 1, 0.9, 0.8); // fascicolo aperto
        B(s, 19, 19, 14, 3, 3, 5, P.red3); B(s, 19, 19, 19, 3, 3, 2, P.brass3); // timbro a cinque facce
        const [x, y] = pt(s, 14, 24, 9);
        s.px.rect(x - 2, y - 2, 6, 5, P.brass4); s.px.rect(x - 1, y - 1, 4, 3, P.brass1);
        s.px.hline(x - 1, y - 1, 4, P.brass5); s.px.set(x + 2, y, P.brass5); s.px.set(x + 1, y + 1, P.brass5); // «7»
      } else if (v % 2) B(s, 6, 16, 14, 4, 3, 2, P.paper3);
      return s;
    }
    case 'desk_covered': {
      const s = canvas(22);
      shadow(s, 2, 7, 28, 18);
      const cloth = { top: (x: number, y: number) => ramp([P.stone4, P.stone5, P.paper1], 0.45 + h2(x >> 1, y, 3) * 0.4, x, y), left: (x: number, y: number) => (x % 5 === 0 ? P.stone2 : ramp([P.stone3, P.stone4], 0.3 + h2(x, y >> 2, 4) * 0.5, x, y)), right: (x: number, y: number) => (x % 6 === 0 ? P.stone1 : ramp([P.stone2, P.stone3], 0.3 + h2(x, y >> 2, 5) * 0.4, x, y)) };
      isoBox(s.px, s.ox, s.oy, 2, 7, 3, 28, 18, 12, cloth);
      // orlo irregolare del telo
      for (let a = 2; a < 30; a++) if (h2(a, 0, 9) > 0.5) { const [x, y] = pt(s, a, 25, 3); s.px.vline(x, y, 2, P.stone3); }
      B(s, 13, 12, 15, 7, 6, 2, P.stone5, 1.1, 0.9, 0.7); // la sagoma di qualcosa, sotto
      return s;
    }
    case 'desk_grand': {
      const s = canvas(34);
      shadow(s, 1, 5, 30, 22);
      B(s, 1, 5, 0, 30, 22, 13, P.wood1);
      B(s, 0, 4, 13, 32, 24, 2, P.wood3, 1.25, 1, 0.7);
      for (const a of [3, 12, 21]) { const [x, y] = pt(s, a, 27, 11); s.px.rect(x, y, 7, 9, P.wood0); s.px.rect(x + 1, y + 1, 5, 7, P.wood2); s.px.set(x + 3, y + 4, P.brass4); }
      const [x0, y0] = pt(s, 1, 27, 13), [x1, y1] = pt(s, 31, 27, 13);
      s.px.line(x0, y0, x1, y1, P.brass3);
      B(s, 8, 9, 15, 14, 10, 1, P.red1, 1.5, 1, 0.8);
      papers(s, 3, 7, 15, 5); papers(s, 3, 16, 15, 3); papers(s, 23, 18, 15, 4);
      lamp(s, 25, 8, 15);
      B(s, 18, 20, 15, 3, 3, 3, P.ink3);
      return s;
    }
    case 'chair': {
      const s = canvas(22);
      for (const [a, b] of [[11, 11], [20, 11], [11, 20], [20, 20]] as const) post(s, a, b, 0, 7, P.wood1);
      B(s, 10, 10, 7, 12, 12, 2, v ? P.green2 : P.red2, 1.3, 1, 0.7);
      B(s, 10, 20, 9, 12, 2, 12, P.wood3);
      const [x, y] = pt(s, 12, 22, 19); s.px.rect(x, y, 8, 6, P.wood1);
      return s;
    }
    case 'armchair': {
      const s = canvas(24);
      shadow(s, 6, 6, 20, 20);
      B(s, 7, 7, 0, 18, 18, 8, P.red1);
      B(s, 9, 9, 8, 14, 13, 2, P.red3, 1.3, 1, 0.7);
      B(s, 7, 22, 8, 18, 3, 13, P.red2);
      B(s, 7, 7, 8, 3, 15, 5, P.red2); B(s, 22, 7, 8, 3, 15, 5, P.red2);
      for (let a = 9; a < 24; a += 4) dot(s, a, 25, 16, P.brass4);
      return s;
    }
    case 'column': {
      const s = canvas(70);
      shadow(s, 8, 8, 16, 16);
      B(s, 8, 8, 0, 16, 16, 5, P.stone3);
      const flute = { top: P.stone5, left: (x: number, y: number) => (x % 3 === 0 ? P.stone2 : ramp([P.stone3, P.stone4, P.stone5], 0.35 + h2(x, y >> 3, 2) * 0.3, x, y)), right: (x: number, y: number) => (x % 3 === 0 ? P.stone0 : ramp([P.stone1, P.stone2], 0.4 + h2(x, y >> 3, 3) * 0.3, x, y)) };
      isoBox(s.px, s.ox, s.oy, 10, 10, 5, 12, 12, 56, flute);
      B(s, 8, 8, 61, 16, 16, 3, P.stone4); B(s, 7, 7, 64, 18, 18, 3, P.stone3);
      for (let a = 10; a < 22; a += 3) dot(s, a, 22, 59, P.brass3);
      return s;
    }
    case 'clock': {
      const s = canvas(64);
      shadow(s, 9, 6, 14, 12);
      B(s, 9, 6, 0, 14, 12, 6, P.wood1);
      B(s, 10, 7, 6, 12, 10, 34, P.wood2);
      B(s, 9, 6, 40, 14, 12, 16, P.wood2);
      B(s, 8, 5, 56, 16, 14, 3, P.wood3); B(s, 11, 8, 59, 10, 8, 3, P.wood2);
      // quadrante senza il dodici: al suo posto una piccola spirale
      const [cx, cy] = pt(s, 16, 18, 48);
      s.px.ellipse(cx, cy, 5.5, 6, P.brass2); s.px.ellipse(cx, cy, 4.3, 4.8, P.paper3);
      s.px.line(cx, cy, cx, cy - 3, P.ink); s.px.line(cx, cy, cx + 2, cy + 1, P.ink);
      s.px.set(cx, cy - 4, P.red3); s.px.set(cx + 1, cy - 4, P.red3); s.px.set(cx + 1, cy - 5, P.red3);
      // finestra del pendolo
      const [wx, wy] = pt(s, 12, 17, 34);
      s.px.rect(wx, wy, 8, 22, P.ink); s.px.rect(wx + 1, wy + 1, 6, 20, P.blue0);
      s.px.vline(wx + 3 + (v % 3), wy + 2, 14, P.brass3); s.px.ellipse(wx + 3.5 + (v % 3), wy + 17, 1.8, 1.8, P.brass4);
      return s;
    }
    case 'tube': {
      const s = canvas(58);
      B(s, 8, 6, 0, 16, 10, 20, P.wood2);
      for (const [a, c] of [[10, P.brass3], [15, P.brass3], [20, P.brass1]] as const) {
        post(s, a, 14, 20, 56, c, 3);
        const [x, y] = pt(s, a, 14, 56); s.px.vline(x, y, 36, P.brass5); s.px.vline(x + 2, y, 36, P.brass0);
        const [mx, my] = pt(s, a, 16, 16); s.px.ellipse(mx + 1, my, 2.4, 2.4, P.ink); s.px.ellipse(mx + 1, my, 2.4, 2.4, c, 90);
        s.px.rect(mx - 1, my + 4, 5, 2, a === 20 ? P.wood0 : P.brass4);
      }
      return s;
    }
    case 'candelabra': {
      const s = canvas(46);
      B(s, 12, 12, 0, 8, 8, 2, P.brass1);
      post(s, 16, 16, 2, 32, P.brass3, 2);
      const [x, y] = pt(s, 16, 16, 32);
      s.px.hline(x - 6, y, 14, P.brass3); s.px.hline(x - 6, y + 1, 14, P.brass1);
      for (const dx of [-6, 0, 6]) { s.px.rect(x + dx, y - 6 + (dx === 0 ? -2 : 0), 2, 6 + (dx === 0 ? 2 : 0), P.paper4); const fy = y - 7 + (dx === 0 ? -2 : 0); s.px.set(x + dx, fy, P.fire3); s.px.set(x + dx + 1, fy, P.fire2); s.px.set(x + dx, fy - 1, P.fire4); s.px.set(x + dx + 1, fy - 1, P.fire3); s.px.set(x + dx, fy - 2, P.fire2); }
      s.px.ellipse(x + 1, y - 6, 9, 7, P.fire2, 26);
      return s;
    }
    case 'papers': {
      const s = canvas(30);
      shadow(s, 4, 4, 24, 24);
      const hs = [16, 9, 22, 12];
      [[5, 5], [17, 6], [6, 17], [18, 18]].forEach(([a, b], i) => {
        for (let z = 0; z < hs[(i + v) % 4]; z += 2) B(s, a + (h2(z, i, 1) > 0.5 ? 1 : 0), b + (h2(z, i, 2) > 0.5 ? 1 : 0), z, 9, 8, 2, FILE_PAL[(z / 2 + i) % FILE_PAL.length], 1.1, 0.92, 0.7);
      });
      return s;
    }
    case 'counter': case 'counter_bell': {
      const s = canvas(34);
      B(s, 7, 0, 0, 18, 32, 15, P.wood2);
      B(s, 6, 0, 15, 20, 32, 2, P.marb3, 1.1, 0.85, 0.6);
      for (let b = 2; b < 32; b += 10) { const [x, y] = pt(s, 25, b + 8, 13); s.px.rect(x - 1, y, 1, 11, P.wood0); }
      const [x0, y0] = pt(s, 25, 32, 15), [x1, y1] = pt(s, 25, 0, 15);
      s.px.line(x0, y0 + 1, x1, y1 + 1, P.brass3);
      if (kind === 'counter_bell') {
        const [bx, by] = pt(s, 15, 12, 17);
        s.px.ellipse(bx, by - 1, 3.5, 2.6, P.brass3); s.px.ellipse(bx - 1, by - 2, 1.5, 1, P.brass5); s.px.set(bx, by - 4, P.brass4); s.px.hline(bx - 4, by + 1, 9, P.brass1);
        papers(s, 9, 20, 17, 4);
        lamp(s, 16, 24, 17);
        B(s, 10, 6, 17, 3, 3, 3, P.ink3);
      } else papers(s, 10, 6 + (v % 3) * 6, 17, 2 + (v % 3));
      return s;
    }
    case 'bench': {
      const s = canvas(20);
      shadow(s, 0, 9, 32, 14);
      for (const a of [2, 28]) for (const b of [11, 21]) post(s, a, b, 0, 7, P.wood0, 2);
      B(s, 0, 10, 7, 32, 13, 2, P.wood3, 1.3, 1, 0.7);
      B(s, 0, 10, 9, 32, 2, 10, P.wood2);
      for (let a = 3; a < 32; a += 7) { const [x, y] = pt(s, a, 12, 18); s.px.vline(x, y, 8, P.wood0); }
      return s;
    }
    case 'lectern': {
      const s = canvas(32);
      shadow(s, 10, 10, 12, 12);
      B(s, 11, 11, 0, 10, 10, 2, P.wood1);
      B(s, 14, 14, 2, 4, 4, 16, P.wood3);
      B(s, 8, 9, 18, 16, 13, 2, P.wood4);
      B(s, 10, 11, 20, 12, 9, 1, P.paper4, 1, 0.85, 0.7);
      const [x, y] = pt(s, 16, 11, 21);
      s.px.line(x, y, x - 8, y + 4, P.paper1);
      for (let i = 0; i < 3; i++) { s.px.hline(x + 2 + i, y + 2 + i, 5, P.paper0); s.px.hline(x - 6 + i, y + 2 + i, 5, P.paper0); }
      return s;
    }
    case 'board': {
      const s = canvas(40);
      post(s, 4, 16, 0, 34, P.wood1, 2); post(s, 27, 16, 0, 34, P.wood1, 2);
      const face = (x: number, y: number) => ramp([P.wood2, P.wood3], h2(x, y, 6), x, y);
      isoBox(s.px, s.ox, s.oy, 3, 15, 10, 26, 2, 24, { top: P.wood5, left: face, right: P.wood1 });
      for (let i = 0; i < 8; i++) {
        const a = 5 + (h2(i, 3, 2) * 18), z = 13 + h2(i, 4, 2) * 14;
        const [x, y] = pt(s, a, 17, z + 6);
        s.px.rect(x, y, 4, 6, i % 3 ? P.paper4 : P.paper2); s.px.hline(x + 1, y + 2, 2, P.paper0); s.px.hline(x + 1, y + 4, 2, P.paper0); s.px.set(x + 1, y, P.red4);
      }
      return s;
    }
    case 'plant': {
      const s = canvas(34);
      shadow(s, 10, 10, 12, 12);
      B(s, 11, 11, 0, 10, 10, 8, P.red3, 1.1, 0.8, 0.55);
      B(s, 10, 10, 8, 12, 12, 2, P.red4, 1.1, 0.8, 0.55);
      const [x, y] = pt(s, 16, 16, 10);
      // rami secchi
      for (const [dx, dy, len] of [[-5, -12, 14], [4, -15, 17], [-1, -18, 19], [7, -8, 11], [-8, -6, 9]] as const) {
        s.px.line(x, y, x + dx, y + dy, P.wood3);
        s.px.line(x + dx, y + dy, x + dx + (dx > 0 ? 3 : -3), y + dy - 3, P.wood2);
        if (len > 12) s.px.set(x + dx - 1, y + dy + 2, P.paper0);
      }
      s.px.set(x + 4, y - 16, P.wood5);
      return s;
    }
    case 'stove': {
      const s = canvas(60);
      shadow(s, 7, 7, 18, 18);
      for (const [a, b] of [[8, 8], [22, 8], [8, 22], [22, 22]] as const) post(s, a, b, 0, 4, P.iron0, 2);
      B(s, 7, 7, 4, 18, 18, 24, P.iron2, 1.3, 1, 0.6);
      B(s, 6, 6, 28, 20, 20, 2, P.iron3, 1.3, 1, 0.6);
      post(s, 15, 12, 30, 58, P.iron2, 4);
      const [px0, py0] = pt(s, 15, 12, 58); s.px.vline(px0, py0, 28, P.iron4); s.px.vline(px0 + 3, py0, 28, P.iron0);
      // sportello acceso
      const [x, y] = pt(s, 11, 25, 22);
      s.px.rect(x, y, 10, 10, P.iron0);
      for (let j = 1; j < 9; j++) for (let i = 1; i < 9; i++) s.px.set(x + i, y + j, (i + j) % 3 === 0 ? P.iron0 : ramp([P.fire0, P.fire1, P.fire2, P.fire3], (j / 9) * 0.8 + h2(i, j, v) * 0.3, i, j));
      s.px.ellipse(x + 5, y + 6, 10, 8, P.fire1, 30);
      return s;
    }
    case 'samovar': {
      const s = canvas(40);
      shadow(s, 5, 8, 22, 16);
      B(s, 5, 8, 0, 22, 16, 11, P.wood2); B(s, 4, 7, 11, 24, 18, 2, P.wood4);
      const [x, y] = pt(s, 14, 15, 13);
      s.px.rect(x - 3, y - 2, 7, 3, P.brass1);
      s.px.ellipse(x, y - 9, 5, 7, (px, py) => ramp([P.brass1, P.brass2, P.brass3, P.brass5], 0.25 + (1 - Math.abs(px - x + 2) / 6) * 0.7, px, py));
      s.px.rect(x - 2, y - 19, 5, 3, P.brass2); s.px.rect(x - 1, y - 22, 3, 3, P.paper3);
      s.px.hline(x + 5, y - 6, 3, P.brass4); s.px.set(x + 7, y - 5, P.brass4);
      s.px.line(x - 5, y - 12, x - 8, y - 10, P.brass3); s.px.line(x + 5, y - 12, x + 8, y - 10, P.brass3);
      s.px.set(x - 1, y - 25, P.paper4, 120); s.px.set(x, y - 27, P.paper4, 90); s.px.set(x + 1, y - 29, P.paper4, 60);
      for (const [a, b] of [[22, 12], [20, 20], [9, 20]] as const) { B(s, a, b, 13, 3, 3, 2, P.paper4); }
      return s;
    }
    case 'lockers': {
      const s = canvas(50);
      shadow(s, 1, 3, 30, 12);
      const face = (x: number, y: number) => ramp([P.iron2, P.iron3], 0.3 + h2(x >> 1, y >> 2, 4) * 0.5, x, y);
      isoBox(s.px, s.ox, s.oy, 1, 3, 0, 30, 12, 46, { top: P.iron4, left: face, right: P.iron1 });
      for (let i = 0; i <= 3; i++) { const [x, y] = pt(s, 1 + i * 10, 15, 46); s.px.vline(x, y, 46, P.iron0); }
      for (let i = 0; i < 3; i++) {
        const [x, y] = pt(s, 6 + i * 10, 15, 40);
        s.px.rect(x - 2, y, 5, 1, P.iron0); s.px.rect(x - 2, y + 2, 5, 1, P.iron0); s.px.rect(x - 2, y + 4, 5, 1, P.iron0);
        s.px.rect(x - 1, y + 9, 4, 4, P.paper2); s.px.set(x, y + 10, P.ink); s.px.set(x + 1, y + 11, P.ink);
        s.px.set(x + 3, y + 24, P.brass4);
      }
      return s;
    }
    case 'timeclock': {
      const s = canvas(50);
      shadow(s, 10, 10, 12, 10);
      B(s, 13, 13, 0, 6, 6, 22, P.wood1);
      B(s, 9, 10, 22, 14, 10, 20, P.wood3);
      B(s, 8, 9, 42, 16, 12, 2, P.wood4);
      const [x, y] = pt(s, 16, 20, 36);
      s.px.ellipse(x, y, 4.5, 4.5, P.brass3); s.px.ellipse(x, y, 3.4, 3.4, P.paper4);
      s.px.line(x, y, x, y - 2, P.ink); s.px.line(x, y, x + 2, y, P.ink);
      s.px.rect(x - 4, y + 7, 9, 2, P.ink); s.px.rect(x - 3, y + 6, 4, 2, P.paper3); // la scheda nella fessura
      s.px.rect(x + 6, y + 2, 2, 5, P.brass4);
      return s;
    }
    case 'table': {
      const s = canvas(30);
      shadow(s, 5, 5, 22, 22);
      B(s, 13, 13, 0, 6, 6, 10, P.wood1);
      B(s, 5, 5, 10, 22, 22, 2, P.wood3);
      const cloth = (x: number, y: number) => ((x + y) % 4 === 0 ? P.paper2 : P.paper3);
      isoBox(s.px, s.ox, s.oy, 8, 8, 12, 16, 16, 1, { top: cloth, left: P.paper1, right: P.paper0 });
      B(s, 14, 12, 13, 3, 3, 5, P.paper4); flame(s, 15, 13, 19);
      B(s, 20, 18, 13, 3, 3, 2, P.paper4); B(s, 10, 19, 13, 4, 3, 1, P.red3);
      return s;
    }
    case 'cot': {
      const s = canvas(18);
      shadow(s, 2, 8, 28, 16);
      for (const a of [3, 27]) for (const b of [9, 22]) post(s, a, b, 0, 5, P.iron1, 2);
      B(s, 2, 8, 5, 28, 16, 2, P.iron2);
      B(s, 3, 9, 7, 26, 14, 3, P.paper2, 1.1, 0.9, 0.7);
      B(s, 3, 9, 10, 7, 14, 2, P.paper4);
      B(s, 13, 9, 10, 16, 14, 1, v ? P.green2 : P.stone3, 1.3, 1, 0.75);
      return s;
    }
    case 'crate': {
      const s = canvas(30);
      shadow(s, 5, 5, 22, 22);
      const wood = (sh: number) => (x: number, y: number) => (y % 5 === 0 ? P.wood0 : mul(ramp([P.wood2, P.wood3, P.wood4], 0.3 + h2(x >> 2, (y / 5) | 0, 2) * 0.5, x, y), sh));
      isoBox(s.px, s.ox, s.oy, 5, 5, 0, 22, 22, 14, { top: wood(1.2), left: wood(0.95), right: wood(0.65) });
      isoBox(s.px, s.ox, s.oy, 9, 7, 14, 13, 13, 10, { top: wood(1.25), left: wood(1), right: wood(0.7) });
      const [x, y] = pt(s, 10, 27, 10); s.px.rect(x, y, 7, 5, P.paper2); s.px.hline(x + 1, y + 2, 5, P.paper0);
      return s;
    }
    case 'cabinet': case 'cabinet_pale': case 'cabinet_seal': {
      const s = canvas(44);
      const base = kind === 'cabinet_pale' ? P.wood6 : kind === 'cabinet_seal' ? P.iron2 : P.wood2;
      shadow(s, 4, 6, 24, 14);
      B(s, 4, 6, 0, 24, 14, 38, base);
      B(s, 3, 5, 38, 26, 16, 2, mul(base, 1.2));
      drawers(s, 5, 20, 2, 22, 34, 4, 1, kind === 'cabinet_seal' ? P.iron4 : P.brass4, mul(base, 0.45));
      if (kind === 'cabinet_seal') {
        // la spirale INTERA, e il taglio aggiunto dopo
        const [x, y] = pt(s, 26, 13, 22);
        for (let a = 0; a < 30; a++) { const r = 0.6 + a * 0.17, t = a * 0.5; s.px.set(x + Math.cos(t) * r * 0.7, y + Math.sin(t) * r, P.brass3); }
        s.px.line(x - 3, y + 5, x + 2, y - 5, P.iron0);
        const [dx, dy] = pt(s, 16, 20, 30);
        for (let i = 0; i < 4; i++) { s.px.rect(dx - 5 + i * 3, dy, 2, 3, P.brass4); s.px.set(dx - 5 + i * 3, dy + 1, P.ink); }
      }
      if (kind === 'cabinet_pale') { const [x, y] = pt(s, 16, 20, 40); s.px.ellipse(x, y + 14, 12, 16, P.fire2, 14); }
      return s;
    }
    case 'recorder': {
      const s = canvas(42);
      shadow(s, 6, 8, 20, 16);
      B(s, 6, 8, 0, 20, 16, 12, P.wood2); B(s, 5, 7, 12, 22, 18, 2, P.wood4);
      B(s, 9, 12, 14, 12, 6, 5, P.brass1); B(s, 11, 13, 16, 8, 4, 4, P.wood6, 1.1, 0.9, 0.7); // cilindro di cera
      const [x, y] = pt(s, 22, 12, 18);
      s.px.line(x, y, x + 2, y - 10, P.brass2);
      s.px.ellipse(x + 4, y - 15, 7, 8, (px, py) => ramp([P.brass0, P.brass2, P.brass3, P.brass5], 0.2 + Math.hypot(px - x - 2, py - y + 16) / 9, px, py));
      s.px.ellipse(x + 4, y - 15, 3.5, 4.5, P.ink);
      const [hx, hy] = pt(s, 8, 24, 10); s.px.rect(hx - 2, hy, 2, 5, P.brass4); s.px.set(hx - 3, hy, P.brass4);
      return s;
    }
    case 'mirror': {
      const s = canvas(52);
      shadow(s, 4, 12, 24, 6);
      post(s, 5, 16, 0, 6, P.wood1, 2); post(s, 26, 16, 0, 6, P.wood1, 2);
      const glass = (x: number, y: number) => ramp([P.blue0, P.blue1, P.blue2, P.blue3], 0.15 + ((x * 0.7 + y) % 23) / 30 + h2(x, y, 4) * 0.1, x, y);
      isoBox(s.px, s.ox, s.oy, 4, 14, 5, 24, 2, 44, { top: P.wood4, left: glass, right: P.wood0 });
      const [x0, y0] = pt(s, 4, 16, 49), [x1, y1] = pt(s, 28, 16, 49);
      s.px.line(x0, y0, x1, y1, P.wood4); s.px.vline(x0, y0, 44, P.wood3); s.px.vline(x1 - 1, y1, 44, P.wood1);
      const [bx, by] = pt(s, 4, 16, 5); s.px.line(bx, by, bx + 24, by + 12, P.wood4);
      // nello specchio: una sedia in più, e qualcuno di spalle
      const [fx, fy] = pt(s, 17, 16, 30);
      s.px.rect(fx - 2, fy, 5, 9, P.blue0, 200); s.px.ellipse(fx, fy - 2, 2, 2.3, P.blue0, 200); s.px.rect(fx - 3, fy + 9, 7, 3, P.ink, 150);
      return s;
    }
    case 'shelf': {
      const s = canvas(64);
      shadow(s, 1, 2, 30, 13);
      const back = (x: number, y: number) => (h2(x, y, 8) > 0.5 ? P.wood0 : P.ink);
      isoBox(s.px, s.ox, s.oy, 1, 2, 0, 30, 12, 60, { top: P.wood4, left: back, right: P.wood1 });
      for (let k = 0; k < 6; k++) {
        const z = 2 + k * 10;
        const [x0, y0] = pt(s, 1, 14, z), [x1, y1] = pt(s, 31, 14, z);
        s.px.line(x0, y0, x1, y1, P.wood4); s.px.line(x0, y0 + 1, x1, y1 + 1, P.wood1);
        books(s, 1, 14, z, 30, k * 13 + v * 7, k % 2 ? FILE_PAL : BOOK_PAL);
      }
      const [tx, ty] = pt(s, 1, 14, 60), [ux, uy] = pt(s, 31, 14, 60);
      s.px.line(tx, ty, ux, uy, P.wood5); s.px.vline(tx, ty, 60, P.wood3); s.px.vline(ux - 1, uy, 60, P.wood3);
      return s;
    }
    case 'shelf_low': {
      const s = canvas(30);
      shadow(s, 1, 4, 30, 13);
      isoBox(s.px, s.ox, s.oy, 1, 4, 0, 30, 12, 24, { top: P.wood4, left: P.ink, right: P.wood1 });
      for (let k = 0; k < 2; k++) {
        const z = 2 + k * 11;
        const [x0, y0] = pt(s, 1, 16, z), [x1, y1] = pt(s, 31, 16, z);
        s.px.line(x0, y0, x1, y1, P.wood4);
        books(s, 1, 16, z, 30, k * 5 + v, [P.green2, P.green3, P.wood4, P.paper1, P.red2]);
      }
      papers(s, 6, 6, 24, 3); B(s, 20, 7, 24, 7, 6, 3, P.green2);
      return s;
    }
    case 'catalog': {
      const s = canvas(44);
      shadow(s, 2, 5, 28, 14);
      B(s, 2, 5, 0, 28, 14, 6, P.wood1);
      B(s, 2, 5, 6, 28, 14, 32, P.wood3);
      B(s, 1, 4, 38, 30, 16, 2, P.wood4);
      drawers(s, 3, 19, 7, 26, 30, 6, 6, P.brass5, P.wood0);
      for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) { const [x, y] = pt(s, 3 + (26 * (c + 0.5)) / 6, 19, 7 + (30 * (r + 0.85)) / 6); s.px.set(x, y, P.paper3); }
      return s;
    }
    case 'safe': {
      const s = canvas(34);
      shadow(s, 5, 5, 22, 18);
      B(s, 5, 5, 0, 22, 18, 28, P.iron2, 1.3, 1, 0.6);
      const [x, y] = pt(s, 16, 23, 16);
      s.px.rect(x - 8, y - 9, 16, 20, P.iron0); s.px.rect(x - 7, y - 8, 14, 18, P.iron3);
      s.px.ellipse(x - 1, y - 1, 3, 3, P.brass3); s.px.set(x - 1, y - 3, P.ink);
      s.px.rect(x + 3, y + 3, 2, 5, P.brass4);
      s.px.set(x - 5, y + 6, P.iron4); s.px.set(x - 5, y - 6, P.iron4);
      return s;
    }
    case 'tiglio': {
      const s = canvas(40);
      shadow(s, 11, 11, 10, 10);
      B(s, 12, 12, 0, 8, 8, 7, P.red4, 1.1, 0.8, 0.55);
      B(s, 11, 11, 7, 10, 10, 2, P.red5, 1.1, 0.8, 0.55);
      const [x, y] = pt(s, 16, 16, 9);
      s.px.line(x, y, x, y - 16, P.wood4); s.px.line(x, y - 9, x - 4, y - 14, P.wood4); s.px.line(x, y - 12, x + 4, y - 18, P.wood4);
      for (const [dx, dy] of [[0, -19], [-5, -16], [5, -20], [-2, -13], [3, -14], [-6, -19], [2, -23]] as const) {
        s.px.ellipse(x + dx, y + dy, 2.6, 2.2, P.green3); s.px.set(x + dx - 1, y + dy - 1, P.green5); s.px.set(x + dx + 1, y + dy + 1, P.green2);
      }
      return s;
    }
    case 'jars': {
      const s = canvas(60);
      shadow(s, 1, 2, 30, 12);
      isoBox(s.px, s.ox, s.oy, 1, 2, 0, 30, 11, 56, { top: P.iron3, left: P.ink, right: P.iron0 });
      for (let k = 0; k < 4; k++) {
        const z = 2 + k * 14;
        const [x0, y0] = pt(s, 1, 13, z), [x1, y1] = pt(s, 31, 13, z);
        s.px.line(x0, y0, x1, y1, P.iron4);
        for (let j = 0; j < 4; j++) {
          const [x, y] = pt(s, 4 + j * 7, 13, z + 10);
          s.px.rect(x, y, 5, 9, P.blue1, 235);
          s.px.rect(x + 1, y + 1, 3, 7, P.blue2);
          // ciò che si muove dentro
          const off = ((h2(j, k, v) * 4) | 0);
          s.px.ellipse(x + 2.2, y + 3 + off, 1.4, 1.9, P.blue5, 230); s.px.set(x + 2, y + 2 + off, P.paper4);
          s.px.vline(x, y + 1, 7, P.blue4, 150);
          s.px.hline(x, y - 1, 5, P.wood4); s.px.hline(x + 1, y - 2, 3, P.red3);
          s.px.rect(x + 1, y + 9, 3, 2, P.paper3);
        }
      }
      const [tx, ty] = pt(s, 1, 13, 56), [ux, uy] = pt(s, 31, 13, 56);
      s.px.line(tx, ty, ux, uy, P.iron4);
      return s;
    }
    case 'press': {
      const s = canvas(72);
      shadow(s, 0, 2, 32, 28);
      B(s, 0, 3, 0, 32, 26, 9, P.iron1, 1.4, 1, 0.6);
      // feltro umido, con un'impronta
      const felt = (x: number, y: number) => ramp([P.stone3, P.stone4, P.stone5], 0.3 + h2(x, y, 3) * 0.4, x, y);
      isoBox(s.px, s.ox, s.oy, 3, 6, 9, 26, 20, 1, { top: felt, left: P.stone2, right: P.stone1 });
      const [ix, iy] = pt(s, 16, 16, 10); s.px.ellipse(ix, iy, 11, 3.2, P.stone2, 190); s.px.ellipse(ix - 8, iy + 1, 2.2, 1.6, P.stone2, 190);
      for (const a of [1, 27]) { B(s, a, 13, 9, 4, 5, 50, P.wood1, 1.3, 1, 0.6); }
      B(s, 0, 12, 59, 32, 7, 7, P.wood2, 1.3, 1, 0.6);
      B(s, 14, 14, 26, 4, 4, 33, P.iron3, 1.4, 1, 0.6);
      for (let z = 28; z < 58; z += 3) { const [x, y] = pt(s, 14, 18, z); s.px.hline(x, y, 8, P.iron0); }
      B(s, 4, 7, 23, 24, 18, 3, P.iron2, 1.4, 1, 0.6);
      const [hx, hy] = pt(s, 16, 16, 66); s.px.hline(hx - 14, hy, 28, P.iron4); s.px.hline(hx - 14, hy + 1, 28, P.iron1); s.px.ellipse(hx - 14, hy, 2, 2, P.brass3); s.px.ellipse(hx + 14, hy, 2, 2, P.brass3);
      // gocce
      for (const a of [8, 15, 22]) { const [x, y] = pt(s, a, 25, 21); s.px.vline(x, y, 2 + (a % 3), P.blue4, 170); }
      return s;
    }
    case 'reams': {
      const s = canvas(28);
      shadow(s, 3, 3, 26, 26);
      [[4, 4, 14], [17, 5, 8], [5, 17, 10], [17, 17, 18]].forEach(([a, b, hh], i) => {
        for (let z = 0; z < hh; z += 3) {
          B(s, a, b, z, 10, 10, 3, P.paper4, 1.02, 0.86, 0.68);
          const [x, y] = pt(s, a + 5, b + 10, z + 3); s.px.vline(x, y, 3, i % 2 ? P.red3 : P.wood4);
        }
      });
      return s;
    }
    case 'vat': {
      const s = canvas(28);
      shadow(s, 4, 4, 24, 24);
      const [x, y] = pt(s, 16, 16, 0);
      for (let z = 0; z < 16; z++) s.px.ellipse(x, y - z, 14, 7, z % 5 === 0 ? P.iron0 : mul(P.wood2, 0.7 + (z / 16) * 0.5));
      s.px.ellipse(x, y - 16, 14, 7, P.iron3); s.px.ellipse(x, y - 16, 12, 6, (px, py) => ramp([P.paper1, P.paper2, P.paper4], 0.3 + h2(px >> 1, py, 2) * 0.6, px, py));
      s.px.ellipse(x - 3, y - 17, 3, 1.4, P.paper4);
      return s;
    }
    default: {
      const s = canvas(20);
      B(s, 8, 8, 0, 16, 16, 12, P.stone3);
      return s;
    }
  }
}

/** Piccolo segnalino che galleggia sopra ciò che si può esaminare. */
export function drawMarker(): Px {
  const px = new Px(9, 9);
  px.poly([[4.5, 0], [9, 4.5], [4.5, 9], [0, 4.5]], P.brass4);
  px.poly([[4.5, 2], [7, 4.5], [4.5, 7], [2, 4.5]], P.brass5);
  px.outline(P.ink);
  return px;
}
