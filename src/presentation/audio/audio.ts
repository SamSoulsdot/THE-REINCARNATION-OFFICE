// Presentation Layer — audio interamente sintetizzato (Web Audio API). Nessun file, nessun brano di terzi.
// Ambiente dinamico per stanza e tensione, effetti contestuali, sorgenti posizionali, silenzi improvvisi.

export interface Volumes { master: number; music: number; sfx: number }
export type Sfx =
  | 'step_wood' | 'step_stone' | 'step_carpet' | 'step_iron' | 'door' | 'paper' | 'stamp' | 'bell' | 'click' | 'note'
  | 'tick' | 'error' | 'chime' | 'whisper' | 'thud' | 'reveal' | 'type' | 'drip' | 'lift';

interface Zone { root: number; cut: number; noise: number; scale: number[]; gap: [number, number] }
const ZONES: Record<string, Zone> = {
  menu: { root: 55, cut: 420, noise: 0.012, scale: [0, 3, 7, 10, 12, 15], gap: [5, 9] },
  reception: { root: 110, cut: 700, noise: 0.02, scale: [0, 2, 3, 7, 10, 12], gap: [7, 13] },
  judgment: { root: 73.4, cut: 520, noise: 0.012, scale: [0, 3, 5, 7, 10, 12], gap: [8, 15] },
  employee: { root: 87.3, cut: 600, noise: 0.03, scale: [0, 2, 3, 7, 9, 12], gap: [9, 16] },
  interview1: { root: 98, cut: 420, noise: 0.008, scale: [0, 3, 7, 8, 12], gap: [10, 18] },
  interview2: { root: 98, cut: 380, noise: 0.01, scale: [0, 1, 7, 8, 12], gap: [10, 18] },
  archive: { root: 65.4, cut: 340, noise: 0.018, scale: [0, 3, 6, 7, 10], gap: [9, 17] },
  management: { root: 82.4, cut: 560, noise: 0.008, scale: [0, 7, 12, 15, 19], gap: [8, 14] },
  restricted: { root: 49, cut: 260, noise: 0.03, scale: [0, 1, 6, 7, 11], gap: [11, 20] },
  director: { root: 46.2, cut: 300, noise: 0.02, scale: [0, 1, 4, 6, 7, 11], gap: [6, 11] },
};

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private music!: GainNode;
  private sfxBus!: GainNode;
  private duck!: GainNode;
  private vol: Volumes = { master: 0.8, music: 0.6, sfx: 0.8 };
  private drone: { oscs: OscillatorNode[]; gain: GainNode; filter: BiquadFilterNode; noise: GainNode } | null = null;
  private zone = '';
  private tension = 0;
  private nextNote = 0;
  private silentUntil = 0;
  private noiseBuf: AudioBuffer | null = null;
  private timers = { tick: 0, thud: 0, whisper: 0, drip: 0 };

  get started(): boolean { return !!this.ctx; }

  /** Va chiamato da un gesto dell'utente (politica di autoplay dei browser). */
  start(): void {
    if (this.ctx) { void this.ctx.resume(); return; }
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.music = ctx.createGain();
    this.sfxBus = ctx.createGain();
    this.duck = ctx.createGain();
    this.music.connect(this.duck).connect(this.master);
    this.sfxBus.connect(this.master);
    this.master.connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noiseBuf.getChannelData(0);
    let b = 0;
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; b = (b + 0.04 * w) / 1.04; d[i] = b * 3.2 + w * 0.12; }
    this.applyVolumes();
    this.buildDrone();
    if (this.zone) this.retune();
  }

  setVolumes(v: Volumes): void { this.vol = v; this.applyVolumes(); }
  private applyVolumes(): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.vol.master, t, 0.05);
    this.music.gain.setTargetAtTime(this.vol.music, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(this.vol.sfx, t, 0.05);
  }

  private buildDrone(): void {
    const ctx = this.ctx!;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.7;
    const oscs = [0, 1, 2].map((i) => {
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sawtooth';
      o.frequency.value = 60;
      const g = ctx.createGain();
      g.gain.value = i === 2 ? 0.5 : 0.22;
      o.connect(g).connect(filter);
      o.start();
      return o;
    });
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lg = ctx.createGain();
    lg.gain.value = 90;
    lfo.connect(lg).connect(filter.frequency);
    lfo.start();
    const ns = ctx.createBufferSource();
    ns.buffer = this.noiseBuf;
    ns.loop = true;
    const nf = ctx.createBiquadFilter();
    nf.type = 'bandpass';
    nf.frequency.value = 500;
    nf.Q.value = 0.4;
    const noise = ctx.createGain();
    noise.gain.value = 0;
    ns.connect(nf).connect(noise).connect(this.music);
    ns.start();
    filter.connect(gain).connect(this.music);
    this.drone = { oscs, gain, filter, noise };
  }

  /** Cambia l'ambiente sonoro: stanza e tensione (0..1) dipendono da luogo, capitolo e anomalie. */
  setZone(zone: string, tension: number): void {
    if (zone === this.zone && Math.abs(tension - this.tension) < 0.02) return;
    this.zone = zone;
    this.tension = tension;
    this.retune();
  }
  private retune(): void {
    if (!this.ctx || !this.drone) return;
    const z = ZONES[this.zone] ?? ZONES.judgment;
    const t = this.ctx.currentTime;
    const detune = 1 + this.tension * 0.012;
    this.drone.oscs[0].frequency.setTargetAtTime(z.root, t, 1.5);
    this.drone.oscs[1].frequency.setTargetAtTime(z.root * 1.498 * detune, t, 1.5);
    this.drone.oscs[2].frequency.setTargetAtTime(z.root * (this.tension > 0.6 ? 1.414 : 2) / 2, t, 1.5);
    this.drone.filter.frequency.setTargetAtTime(z.cut * (1 - this.tension * 0.35), t, 2);
    this.drone.gain.gain.setTargetAtTime(0.05 + this.tension * 0.03, t, 2.5);
    this.drone.noise.gain.setTargetAtTime(z.noise * (1 + this.tension), t, 2);
  }

  /** Silenzio improvviso: tutto l'ambiente tace per qualche secondo. */
  silence(seconds: number): void {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.silentUntil = t + seconds;
    this.duck.gain.cancelScheduledValues(t);
    this.duck.gain.setTargetAtTime(0, t, 0.03);
    this.duck.gain.setTargetAtTime(1, t + seconds, 1.8);
  }

  private env(g: GainNode, t: number, a: number, peak: number, r: number): void {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + r);
  }
  private out(pan: number, bus: GainNode): AudioNode {
    const ctx = this.ctx!;
    if (!ctx.createStereoPanner) return bus;
    const p = ctx.createStereoPanner();
    p.pan.value = Math.max(-1, Math.min(1, pan));
    p.connect(bus);
    return p;
  }
  private noiseHit(t: number, dur: number, freq: number, q: number, peak: number, pan = 0, type: BiquadFilterType = 'bandpass'): void {
    const ctx = this.ctx!;
    const s = ctx.createBufferSource();
    s.buffer = this.noiseBuf;
    s.playbackRate.value = 0.8 + Math.random() * 0.5;
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = ctx.createGain();
    this.env(g, t, 0.004, peak, dur);
    s.connect(f).connect(g).connect(this.out(pan, this.sfxBus));
    s.start(t, Math.random() * 1.5);
    s.stop(t + dur + 0.05);
  }
  private tone(t: number, freq: number, dur: number, peak: number, type: OscillatorType = 'sine', pan = 0, bus: GainNode = this.sfxBus, glide = 0): void {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + glide), t + dur);
    const g = ctx.createGain();
    this.env(g, t, 0.008, peak, dur);
    o.connect(g).connect(this.out(pan, bus));
    o.start(t);
    o.stop(t + dur + 0.1);
  }

  /** Effetto sonoro. pan: -1 sinistra … 1 destra; gain: attenuazione per distanza. */
  play(name: Sfx, pan = 0, gain = 1): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    const k = gain;
    switch (name) {
      case 'step_wood': this.noiseHit(t, 0.07, 240 + Math.random() * 80, 2.5, 0.16 * k, pan); this.tone(t, 92 + Math.random() * 14, 0.06, 0.1 * k, 'sine', pan); break;
      case 'step_stone': this.noiseHit(t, 0.05, 900 + Math.random() * 300, 1.5, 0.1 * k, pan); this.tone(t, 150, 0.04, 0.05 * k, 'triangle', pan); break;
      case 'step_carpet': this.noiseHit(t, 0.09, 170, 0.8, 0.09 * k, pan, 'lowpass'); break;
      case 'step_iron': this.tone(t, 620 + Math.random() * 90, 0.22, 0.05 * k, 'triangle', pan); this.tone(t, 1240, 0.12, 0.02 * k, 'sine', pan); this.noiseHit(t, 0.04, 2400, 3, 0.06 * k, pan); break;
      case 'door': this.tone(t, 180, 0.5, 0.045 * k, 'sawtooth', pan, this.sfxBus, -70); this.noiseHit(t + 0.42, 0.12, 160, 1, 0.22 * k, pan, 'lowpass'); break;
      case 'paper': for (let i = 0; i < 3; i++) this.noiseHit(t + i * 0.045, 0.06, 3200 + Math.random() * 2400, 0.9, 0.07 * k, pan, 'highpass'); break;
      case 'stamp': this.noiseHit(t, 0.12, 110, 0.9, 0.5 * k, pan, 'lowpass'); this.tone(t, 68, 0.2, 0.34 * k, 'sine', pan, this.sfxBus, -24); this.noiseHit(t + 0.02, 0.05, 1900, 2, 0.08 * k, pan); break;
      case 'bell': for (const [f, a, d] of [[1318, 0.12, 1.5], [2637, 0.05, 0.9], [3520, 0.03, 0.5], [659, 0.04, 1.2]] as const) this.tone(t, f, d, a * k, 'sine', pan); break;
      case 'click': this.noiseHit(t, 0.02, 2600, 4, 0.08 * k, pan); break;
      case 'note': this.tone(t, 880, 0.12, 0.05 * k, 'triangle', pan); this.tone(t + 0.07, 1318, 0.2, 0.04 * k, 'triangle', pan); this.noiseHit(t, 0.05, 4000, 1, 0.035 * k, pan, 'highpass'); break;
      case 'tick': this.noiseHit(t, 0.018, 1800, 9, 0.11 * k, pan); this.tone(t, 420, 0.03, 0.02 * k, 'square', pan); break;
      case 'error': this.tone(t, 196, 0.16, 0.06 * k, 'square', pan); this.tone(t + 0.12, 147, 0.24, 0.06 * k, 'square', pan); break;
      case 'chime': for (const [i, f] of [392, 494, 587, 784].entries()) this.tone(t + i * 0.09, f, 0.9, 0.05 * k, 'sine', pan); break;
      case 'whisper': for (let i = 0; i < 5; i++) this.noiseHit(t + i * 0.17 + Math.random() * 0.06, 0.16, 1300 + Math.random() * 1500, 7, 0.035 * k, pan + (Math.random() - 0.5) * 0.3); break;
      case 'thud': this.tone(t, 46, 0.7, 0.3 * k, 'sine', pan, this.sfxBus, -16); this.noiseHit(t, 0.3, 90, 0.7, 0.22 * k, pan, 'lowpass'); this.noiseHit(t + 0.55, 0.5, 600, 0.5, 0.03 * k, pan); break;
      case 'reveal': this.tone(t, 110, 2.4, 0.09 * k, 'sawtooth', pan, this.sfxBus, -30); this.tone(t, 116.5, 2.4, 0.07 * k, 'sawtooth', pan, this.sfxBus, -30); this.noiseHit(t, 1.6, 300, 0.4, 0.05 * k, pan, 'lowpass'); break;
      case 'type': this.noiseHit(t, 0.012, 3400 + Math.random() * 900, 5, 0.03 * k, pan); break;
      case 'drip': this.tone(t, 1500 + Math.random() * 500, 0.09, 0.03 * k, 'sine', pan, this.sfxBus, -700); break;
      case 'lift': this.tone(t, 70, 1.6, 0.1 * k, 'sawtooth', pan, this.sfxBus, 50); for (let i = 0; i < 8; i++) this.noiseHit(t + i * 0.2, 0.03, 2200, 6, 0.04 * k, pan); this.tone(t + 1.6, 1568, 0.8, 0.06 * k, 'sine', pan); break;
    }
  }

  /** Nota sparsa della «musica» d'ambiente: rara, mai invasiva. */
  private ambientNote(): void {
    const ctx = this.ctx!;
    const z = ZONES[this.zone] ?? ZONES.judgment;
    const t = ctx.currentTime;
    const deg = z.scale[Math.floor(Math.random() * z.scale.length)];
    const f = z.root * 4 * Math.pow(2, deg / 12) * (Math.random() < 0.3 ? 0.5 : 1);
    const pan = Math.random() * 1.2 - 0.6;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = f * (this.tension > 0.5 ? 1.006 : 2.001);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.9);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 6.5);
    const g2 = ctx.createGain();
    g2.gain.value = 0.25;
    o.connect(g);
    o2.connect(g2).connect(g);
    g.connect(this.out(pan, this.music));
    o.start(t); o2.start(t);
    o.stop(t + 7); o2.stop(t + 7);
    this.nextNote = t + z.gap[0] + Math.random() * (z.gap[1] - z.gap[0]);
  }

  /**
   * Aggiornamento periodico: note d'ambiente e sorgenti posizionali (pendola, torchi, voci dalla Sala d'Attesa, gocce).
   * dx/dy sono le distanze in tessere dal giocatore: determinano volume e posizione stereo (audio direzionale).
   */
  update(sources: { id: 'clock' | 'press' | 'waiting' | 'drip'; dx: number; dy: number; active: boolean }[]): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    if (t < this.silentUntil) return;
    if (t >= this.nextNote) this.ambientNote();
    for (const s of sources) {
      if (!s.active) continue;
      const dist = Math.hypot(s.dx, s.dy);
      if (dist > 13) continue;
      const gain = Math.max(0, 1 - dist / 13) ** 1.6;
      const pan = Math.max(-1, Math.min(1, (s.dx - s.dy) / 9));
      if (s.id === 'clock' && t >= this.timers.tick) { this.play('tick', pan, gain); this.timers.tick = t + 1; }
      if (s.id === 'press' && t >= this.timers.thud) { this.play('thud', pan, gain); this.timers.thud = t + 3.6; }
      if (s.id === 'waiting' && t >= this.timers.whisper) { this.play('whisper', pan, gain * 0.9); this.timers.whisper = t + 5 + Math.random() * 9; }
      if (s.id === 'drip' && t >= this.timers.drip) { this.play('drip', pan, gain); this.timers.drip = t + 1.2 + Math.random() * 3.5; }
    }
  }
}

export const audio = new AudioEngine();
