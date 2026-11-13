// Atlante delle texture: tutti gli sprite generati vengono impacchettati in un'unica tela
// e caricati sulla GPU una volta sola (un solo batch di disegno per la scena).
import { Rectangle, Texture } from 'pixi.js';
import { Px } from './px';
import { CHARS, drawChar, drawDog, drawFused, drawPortrait, drawSeal, type CharSpec } from './art_chars';

export interface SpriteMeta { w: number; h: number; ox: number; oy: number }

export class AtlasBuilder {
  private items: { key: string; px: Px; ox: number; oy: number }[] = [];
  private keys = new Set<string>();
  has(key: string): boolean {
    return this.keys.has(key);
  }
  add(key: string, make: () => Px | { px: Px; ox: number; oy: number }): string {
    if (this.keys.has(key)) return key;
    const r = make();
    if (r instanceof Px) this.items.push({ key, px: r, ox: 0, oy: 0 });
    else this.items.push({ key, px: r.px, ox: r.ox, oy: r.oy });
    this.keys.add(key);
    return key;
  }
  build(): Atlas {
    const W = 2048;
    const sorted = [...this.items].sort((a, b) => b.px.h - a.px.h);
    let x = 1, y = 1, rowH = 0;
    const place = new Map<string, { x: number; y: number }>();
    for (const it of sorted) {
      if (x + it.px.w + 1 > W) { x = 1; y += rowH + 1; rowH = 0; }
      place.set(it.key, { x, y });
      x += it.px.w + 1;
      rowH = Math.max(rowH, it.px.h);
    }
    const H = y + rowH + 1;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;
    for (const it of sorted) {
      const p = place.get(it.key)!;
      ctx.putImageData(it.px.toImageData(), p.x, p.y);
    }
    const base = Texture.from(canvas);
    base.source.scaleMode = 'nearest';
    const tex = new Map<string, Texture>();
    const meta = new Map<string, SpriteMeta>();
    for (const it of sorted) {
      const p = place.get(it.key)!;
      tex.set(it.key, new Texture({ source: base.source, frame: new Rectangle(p.x, p.y, it.px.w, it.px.h) }));
      meta.set(it.key, { w: it.px.w, h: it.px.h, ox: it.ox, oy: it.oy });
    }
    return new Atlas(base, tex, meta);
  }
}

export class Atlas {
  constructor(readonly base: Texture, private tex: Map<string, Texture>, private metas: Map<string, SpriteMeta>) {}
  get(key: string): Texture {
    const t = this.tex.get(key);
    if (!t) throw new Error('Texture mancante: ' + key);
    return t;
  }
  meta(key: string): SpriteMeta {
    return this.metas.get(key)!;
  }
  destroy(): void {
    this.base.destroy(true);
  }
}

export function charFrame(name: string, view: 'front' | 'back', f: number): Px {
  if (name === 'soul_dog') return drawDog(f);
  if (name === 'soul_fused') return drawFused(f);
  return drawChar(CHARS[name] ?? CHARS.clerk, view, f);
}

// --- Ritratti e sigillo per l'interfaccia (data URL, generati una volta) ---
const urlCache = new Map<string, string>();

function toURL(px: Px): string {
  const c = document.createElement('canvas');
  c.width = px.w;
  c.height = px.h;
  c.getContext('2d')!.putImageData(px.toImageData(), 0, 0);
  return c.toDataURL('image/png');
}

export function portraitURL(id: string, seed = 0): string {
  const key = id + ':' + seed;
  let u = urlCache.get(key);
  if (!u) {
    const spec: CharSpec = CHARS[id] ?? CHARS.soul;
    u = toURL(drawPortrait(spec, seed));
    urlCache.set(key, u);
  }
  return u;
}

export function sealURL(size = 64, color?: number, cut = true): string {
  const key = `seal:${size}:${color}:${cut}`;
  let u = urlCache.get(key);
  if (!u) {
    u = toURL(drawSeal(size, color, cut));
    urlCache.set(key, u);
  }
  return u;
}
