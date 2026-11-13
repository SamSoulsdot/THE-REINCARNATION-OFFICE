// Strumenti di disegno pixel art. Tutti gli asset del gioco sono originali e generati
// da codice: nessuna immagine esterna. Colori indicizzati su una palette controllata.

export const PAL = {
  void: 0x08070b, ink: 0x0e0c12, ink2: 0x17141d, ink3: 0x231e2b, ink4: 0x322b3b,
  wood0: 0x21140f, wood1: 0x331f17, wood2: 0x482c20, wood3: 0x60402e, wood4: 0x7d573d, wood5: 0xa07a55, wood6: 0xc7a273,
  stone0: 0x1c1c23, stone1: 0x282932, stone2: 0x373944, stone3: 0x4a4d5a, stone4: 0x626676, stone5: 0x828799,
  marb0: 0x25232c, marb1: 0x353241, marb2: 0x9a94a2, marb3: 0xbdb6c0, marb4: 0xdcd6d9,
  brass0: 0x3d2c14, brass1: 0x5f4620, brass2: 0x8c6b2b, brass3: 0xb9933a, brass4: 0xe3c35c, brass5: 0xf8eaa6,
  red0: 0x2a0b10, red1: 0x45111a, red2: 0x651a22, red3: 0x8a2529, red4: 0xb23f35, red5: 0xd96b4e,
  green0: 0x0d1a15, green1: 0x162b21, green2: 0x21432f, green3: 0x326446, green4: 0x4f9163, green5: 0x93d6a0,
  paper0: 0x6d6248, paper1: 0x94876a, paper2: 0xbcae89, paper3: 0xdcd0ac, paper4: 0xf2ead0,
  blue0: 0x121a2b, blue1: 0x1d2a45, blue2: 0x2f4468, blue3: 0x4d6e98, blue4: 0x86abd0, blue5: 0xc6def0,
  skin0: 0x6a4739, skin1: 0x946652, skin2: 0xbd8d73, skin3: 0xdcb49a, skin4: 0xf0d5bf,
  bone0: 0x6f6853, bone1: 0x9d957c, bone2: 0xcac2a6, bone3: 0xebe5cd,
  iron0: 0x15171b, iron1: 0x22252b, iron2: 0x33373f, iron3: 0x484d57, iron4: 0x676d79,
  plum0: 0x1c1322, plum1: 0x2c1d35, plum2: 0x42294d, plum3: 0x5e3a69,
  fire0: 0x8a2a12, fire1: 0xd0561c, fire2: 0xf59b2e, fire3: 0xffd96a, fire4: 0xfff3c2,
} as const;

/** Tela a pixel con canale alfa. */
export class Px {
  readonly w: number;
  readonly h: number;
  readonly data: Uint8ClampedArray;
  constructor(w: number, h: number) {
    this.w = w;
    this.h = h;
    this.data = new Uint8ClampedArray(w * h * 4);
  }
  inb(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }
  set(x: number, y: number, c: number, a = 255): void {
    x |= 0; y |= 0;
    if (!this.inb(x, y)) return;
    const i = (y * this.w + x) * 4;
    if (a >= 255) {
      this.data[i] = (c >> 16) & 255; this.data[i + 1] = (c >> 8) & 255; this.data[i + 2] = c & 255; this.data[i + 3] = 255;
      return;
    }
    const sa = a / 255, da = this.data[i + 3] / 255;
    const oa = sa + da * (1 - sa);
    if (oa <= 0) return;
    this.data[i] = (((c >> 16) & 255) * sa + this.data[i] * da * (1 - sa)) / oa;
    this.data[i + 1] = (((c >> 8) & 255) * sa + this.data[i + 1] * da * (1 - sa)) / oa;
    this.data[i + 2] = ((c & 255) * sa + this.data[i + 2] * da * (1 - sa)) / oa;
    this.data[i + 3] = oa * 255;
  }
  get(x: number, y: number): number {
    if (!this.inb(x, y)) return -1;
    const i = (y * this.w + x) * 4;
    if (this.data[i + 3] === 0) return -1;
    return (this.data[i] << 16) | (this.data[i + 1] << 8) | this.data[i + 2];
  }
  alpha(x: number, y: number): number {
    return this.inb(x, y) ? this.data[(y * this.w + x) * 4 + 3] : 0;
  }
  clear(x: number, y: number): void {
    if (this.inb(x, y)) this.data[(y * this.w + x) * 4 + 3] = 0;
  }
  rect(x: number, y: number, w: number, h: number, c: number, a = 255): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c, a);
  }
  hline(x: number, y: number, w: number, c: number, a = 255): void {
    for (let i = 0; i < w; i++) this.set(x + i, y, c, a);
  }
  vline(x: number, y: number, h: number, c: number, a = 255): void {
    for (let j = 0; j < h; j++) this.set(x, y + j, c, a);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: number, a = 255): void {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0;
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c, a);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  /** Ellisse piena. */
  ellipse(cx: number, cy: number, rx: number, ry: number, c: number | ((x: number, y: number) => number), a = 255): void {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / rx, dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, typeof c === 'number' ? c : c(x, y), a);
      }
    }
  }
  /** Poligono convesso pieno (scanline), con colore per pixel opzionale. */
  poly(pts: [number, number][], c: number | ((x: number, y: number) => number), a = 255): void {
    let minY = Infinity, maxY = -Infinity;
    for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const xs: number[] = [];
      const yc = y + 0.5;
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        if ((y1 <= yc && y2 > yc) || (y2 <= yc && y1 > yc)) xs.push(x1 + ((yc - y1) / (y2 - y1)) * (x2 - x1));
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, typeof c === 'number' ? c : c(x, y), a);
      }
    }
  }
  /** Copia un'altra tela (con alfa). */
  blit(src: Px, dx: number, dy: number, flip = false): void {
    for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
      const i = (y * src.w + x) * 4;
      const a = src.data[i + 3];
      if (a === 0) continue;
      const c = (src.data[i] << 16) | (src.data[i + 1] << 8) | src.data[i + 2];
      this.set(dx + (flip ? src.w - 1 - x : x), dy + y, c, a);
    }
  }
  /** Contorno scuro di 1 px attorno alla sagoma (tipico degli sprite). */
  outline(c: number, a = 255): void {
    const add: [number, number][] = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.alpha(x, y) > 0) continue;
      if (this.alpha(x - 1, y) > 40 || this.alpha(x + 1, y) > 40 || this.alpha(x, y - 1) > 40 || this.alpha(x, y + 1) > 40) add.push([x, y]);
    }
    for (const [x, y] of add) this.set(x, y, c, a);
  }
  /** Moltiplica la luminosità dei pixel opachi (ombreggiature di facce). */
  shade(f: number, x0 = 0, y0 = 0, w = this.w, h = this.h): void {
    for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
      if (!this.inb(x, y)) continue;
      const i = (y * this.w + x) * 4;
      if (this.data[i + 3] === 0) continue;
      this.data[i] *= f; this.data[i + 1] *= f; this.data[i + 2] *= f;
    }
  }
  fade(a: number): void {
    for (let i = 3; i < this.data.length; i += 4) this.data[i] *= a;
  }
  toImageData(): ImageData {
    return new ImageData(new Uint8ClampedArray(this.data), this.w, this.h);
  }
}

/** Hash intero deterministico per rumore e variazioni. */
export function h2(x: number, y: number, s = 0): number {
  let n = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  n = (n ^ (n >>> 13)) * 1274126177;
  n = n ^ (n >>> 16);
  return (n >>> 0) / 4294967296;
}

export function mix(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 255, ag = (a >> 8) & 255, ab = a & 255;
  const br = (b >> 16) & 255, bg = (b >> 8) & 255, bb = b & 255;
  return (Math.round(ar + (br - ar) * t) << 16) | (Math.round(ag + (bg - ag) * t) << 8) | Math.round(ab + (bb - ab) * t);
}

export function mul(c: number, f: number): number {
  const r = Math.min(255, ((c >> 16) & 255) * f), g = Math.min(255, ((c >> 8) & 255) * f), b = Math.min(255, (c & 255) * f);
  return (r << 16) | (g << 8) | b;
}

/** Sceglie da una rampa di colori con dithering ordinato (Bayer 4×4): niente sfumature lisce. */
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export function ramp(colors: readonly number[], t: number, x: number, y: number): number {
  const f = Math.max(0, Math.min(0.9999, t)) * (colors.length - 1);
  const i = Math.floor(f);
  const frac = f - i;
  const thr = (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
  return colors[Math.min(colors.length - 1, i + (frac > thr ? 1 : 0))];
}

// --- Geometria isometrica locale degli oggetti ---
// Unità: 32 = lato intero di una tessera. a lungo l'asse x (giù-destra), b lungo l'asse y (giù-sinistra), z in alto.
export function isoPt(ox: number, oy: number, a: number, b: number, z: number): [number, number] {
  return [ox + (a - b), oy + (a + b) / 2 - z];
}

export interface BoxColors { top: number | ((x: number, y: number) => number); left: number | ((x: number, y: number) => number); right: number | ((x: number, y: number) => number) }

/**
 * Parallelepipedo isometrico. (ox,oy) = proiezione dell'origine locale (0,0,0), che è lo spigolo
 * posteriore della tessera (vertice alto del rombo). Il volume occupa a∈[a0,a0+w], b∈[b0,b0+d], z∈[z0,z0+h].
 */
export function isoBox(px: Px, ox: number, oy: number, a0: number, b0: number, z0: number, w: number, d: number, h: number, col: BoxColors): void {
  const P = (a: number, b: number, z: number) => isoPt(ox, oy, a, b, z);
  const z1 = z0 + h;
  // faccia sinistra (verso SW): piano b = b0+d
  px.poly([P(a0, b0 + d, z1), P(a0 + w, b0 + d, z1), P(a0 + w, b0 + d, z0), P(a0, b0 + d, z0)], col.left);
  // faccia destra (verso SE): piano a = a0+w
  px.poly([P(a0 + w, b0 + d, z1), P(a0 + w, b0, z1), P(a0 + w, b0, z0), P(a0 + w, b0 + d, z0)], col.right);
  // faccia superiore
  px.poly([P(a0, b0, z1), P(a0 + w, b0, z1), P(a0 + w, b0 + d, z1), P(a0, b0 + d, z1)], col.top);
}

/** Tre toni da un colore base: sopra chiaro, sinistra medio, destra scuro. */
export function tones(base: number, top = 1.25, left = 0.95, right = 0.68): BoxColors {
  return { top: mul(base, top), left: mul(base, left), right: mul(base, right) };
}
