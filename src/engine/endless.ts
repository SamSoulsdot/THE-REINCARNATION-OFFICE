// Modalità Endless: turni senza fine con generazione procedurale, eventi periodici,
// anime ricorrenti, anime collegate, obiettivi autonomi e statistiche di lungo periodo.
import type { GameState } from './types';
import { ENDLESS_EVENTS, ENDLESS_GOALS } from '../content';
import { Rng, mixSeed } from './rng';
import { addStat } from './cond';
import { buildLife } from './generator';
import { currentIncarnation } from './cases';

export function endlessCaseCount(g: GameState): number {
  return Math.min(6, 3 + Math.floor((g.day - 1) / 4));
}

/** Evento periodico: ogni tre turni, deterministico rispetto al seed. */
export function endlessDayStart(g: GameState): string | null {
  const e = g.endless;
  if (!e) return null;
  e.cycle = g.day;
  e.eventToday = undefined;
  if (g.day % 3 !== 0) return null;
  const rng = new Rng(mixSeed(g.seed, 'event', g.day));
  const ev = rng.pick(ENDLESS_EVENTS);
  e.eventToday = ev.id;
  e.eventLog.push({ day: g.day, id: ev.id });
  if (e.eventLog.length > 40) e.eventLog.shift();
  if (ev.id === 'quiete') addStat(g, 'morale', 6);
  return ev.id;
}

export function goalTarget(goalId: string, base: number, tier: number): number {
  const def = ENDLESS_GOALS.find((x) => x.id === goalId);
  return base + (def?.step ?? 1) * (tier + 1);
}

export function goalViews(g: GameState): { id: string; text: string; progress: number; target: number; reward: number }[] {
  const e = g.endless;
  if (!e) return [];
  return e.goals.map((gl) => {
    const def = ENDLESS_GOALS.find((x) => x.id === gl.id)!;
    const need = def.step * (gl.tier + 1);
    const have = Math.min(need, (e.totals[def.metric] ?? 0) - gl.base);
    return { id: gl.id, text: def.text.replace('{n}', String(need)), progress: have, target: need, reward: def.reward + gl.tier * 20 };
  });
}

function rollGoal(g: GameState, exclude: string[], n: number): void {
  const e = g.endless!;
  const rng = new Rng(mixSeed(g.seed, 'goal', e.goalsDone, n));
  const pool = ENDLESS_GOALS.filter((x) => !exclude.includes(x.id));
  const def = rng.pick(pool);
  const tier = Math.floor(e.goalsDone / 3);
  e.goals.push({ id: def.id, base: e.totals[def.metric] ?? 0, tier });
}

export function initGoals(g: GameState): void {
  if (!g.endless) return;
  g.endless.goals = [];
  for (let i = 0; i < 3; i++) rollGoal(g, g.endless.goals.map((x) => x.id), i);
}

/** Dopo una sentenza in Endless: l'altra persona del fascicolo può presentarsi a sua volta, giorni dopo. */
export function maybeLinkSoul(g: GameState, soulId: string): void {
  if (g.mode !== 'endless') return;
  const soul = g.souls[soulId];
  if (!soul || soul.curated) return;
  const inc = soul.incarnations.find((i) => i.decisionId === g.decisions[g.decisions.length - 1]?.id);
  if (!inc || inc.form || inc.linked || !inc.relations[0]) return;
  const rng = new Rng(mixSeed(soul.seed, 'link', inc.index));
  if (!rng.chance(0.35)) return;
  g.counter++;
  const id = 'P' + String(g.counter).padStart(4, '0');
  const life = buildLife(mixSeed(g.seed, 'linked', g.counter), { linked: inc.name });
  life.name = inc.relations[0].name;
  life.origin = inc.origin;
  life.era = inc.era;
  g.souls[id] = { id, seed: mixSeed(g.seed, 'linked', g.counter), curated: false, incarnations: [{ ...life, index: 1 }], status: 'in_arrivo', returnDay: g.day + rng.int(1, 3), notes: ['Legata al fascicolo di ' + inc.name] };
}

export function endlessDayEnd(g: GameState): string[] {
  const e = g.endless;
  const lines: string[] = [];
  if (!e) return lines;
  e.totals.turni = (e.totals.turni ?? 0) + 1;
  const todays = g.decisions.filter((d) => d.day === g.day);
  e.totals.collegati = (e.totals.collegati ?? 0) + todays.filter((d) => {
    const s = g.souls[d.soulId];
    return !!s && s.incarnations.some((i) => i.decisionId === d.id && !!i.linked);
  }).length;
  if (e.eventToday === 'ispezione') {
    const irr = todays.filter((d) => d.irregularities.length > 0);
    const hidden = irr.filter((d) => d.concealed).length;
    if (irr.length === 0) {
      g.credits += 30;
      addStat(g, 'reputazione', 4);
      lines.push('Ispezione del Collegio: nessuna irregolarità. Encomio. (+30 CE, +4 reputazione)');
    } else {
      addStat(g, 'sospetto', hidden * 5);
      addStat(g, 'reputazione', -irr.length * 2);
      lines.push(`Ispezione del Collegio: ${irr.length} irregolarità rilevate${hidden ? ', di cui ' + hidden + ' omesse dal registro' : ''}.`);
    }
  }
  // Obiettivi autonomi
  const keep: typeof e.goals = [];
  let rolled = 0;
  for (const gl of e.goals) {
    const def = ENDLESS_GOALS.find((x) => x.id === gl.id)!;
    const need = def.step * (gl.tier + 1);
    if ((e.totals[def.metric] ?? 0) - gl.base >= need) {
      const reward = def.reward + gl.tier * 20;
      g.credits += reward;
      e.goalsDone++;
      lines.push(`Obiettivo raggiunto: ${def.text.replace('{n}', String(need))}. (+${reward} CE)`);
    } else keep.push(gl);
  }
  e.goals = keep;
  while (e.goals.length < 3) rollGoal(g, e.goals.map((x) => x.id), rolled++);
  return lines;
}

export function endlessSummary(g: GameState): { label: string; value: string }[] {
  const t = g.endless?.totals ?? {};
  const v = (k: string) => String(t[k] ?? 0);
  const souls = Object.values(g.souls);
  return [
    { label: 'Turni chiusi', value: v('turni') },
    { label: 'Pratiche evase', value: v('casi') },
    { label: 'Verità accertate', value: v('verita') },
    { label: 'Anime di ritorno giudicate', value: v('ritorni') },
    { label: 'Anime collegate giudicate', value: v('collegati') },
    { label: 'Giudizi irregolari', value: v('irregolari') },
    { label: 'Ascensioni', value: v('dest_ascension') },
    { label: 'Rinnovi', value: v('dest_renewal') },
    { label: 'Prove', value: v('dest_trial') },
    { label: 'Altre Forme', value: v('dest_otherForm') },
    { label: 'Sospensioni', value: v('dest_waitingRoom') },
    { label: 'Evase d\'ufficio dal personale', value: v('autoEvase') },
    { label: 'Anime sbiadite in Sala d\'Attesa', value: v('sbiadite') },
    { label: 'Anime a registro', value: String(souls.length) },
    { label: 'Anime con più di una vita', value: String(souls.filter((s) => s.incarnations.length > 1).length) },
    { label: 'Massimo di vite per un\'anima', value: String(souls.reduce((m, s) => Math.max(m, s.incarnations.length), 0)) },
    { label: 'Obiettivi completati', value: String(g.endless?.goalsDone ?? 0) },
  ];
}

export function longestSoul(g: GameState): string | null {
  const s = Object.values(g.souls).sort((a, b) => b.incarnations.length - a.incarnations.length)[0];
  if (!s || s.incarnations.length < 2) return null;
  return s.incarnations.map((i) => i.name).join(' → ') + (s.status === 'reincarnata' ? ' → …' : '') + ' (' + currentIncarnation(s).origin + ')';
}
