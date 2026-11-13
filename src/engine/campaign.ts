// Simulation Engine — ciclo dei turni, progressione dei capitoli, coda dei casi, finali.
import type { DayReport, GameState, QueueItem } from './types';
import { DAYS, LAST_DAY, CYCLE_REASONS, ENDLESS_DIRECTIVES, DIRECTIVES, TOWNS } from '../content';
import type { DayDef } from '../content/it/campaign';
import { apply, check, addStat } from './cond';
import { currentIncarnation, enrollCurated, getCaseDef, isCurated, procCaseId } from './cases';
import { buildLife, generateSoul } from './generator';
import { Rng, mixSeed } from './rng';
import { activeDirectives, dayEndOffice, issueDirective, refreshCandidates } from './office';
import { solvedMysteries } from './knowledge';
import { fmt } from './text';
import { endlessDayEnd, endlessDayStart, endlessCaseCount } from './endless';

export function dayDef(g: GameState): DayDef | undefined {
  return g.mode === 'campaign' ? DAYS.find((d) => d.day === g.day) : undefined;
}

function pushQueue(g: GameState, item: QueueItem): void {
  if (!g.queue.some((q) => q.caseId === item.caseId)) g.queue.push(item);
}

export function queueCurated(g: GameState, caseId: string, mandatory = true): void {
  if (g.closed[caseId] || g.queue.some((q) => q.caseId === caseId)) return;
  const soul = enrollCurated(g, caseId);
  const def = getCaseDef(g, caseId);
  pushQueue(g, { caseId, kind: 'curato', soulId: soul.id, state: 'attesa', label: fmt(g, def.title), mandatory });
}

export function queueNewProcedural(g: GameState, n: number, opts: { town?: string; cause?: string } = {}): void {
  for (let i = 0; i < n; i++) {
    g.counter++;
    const id = 'P' + String(g.counter).padStart(4, '0');
    const soul = generateSoul(mixSeed(g.seed, 'soul', g.counter), id);
    const inc = soul.incarnations[0];
    if (opts.town) inc.origin = opts.town;
    if (opts.cause) inc.cause = opts.cause;
    g.souls[id] = soul;
    const caseId = procCaseId(id, 1);
    inc.caseId = caseId;
    pushQueue(g, { caseId, kind: 'procedurale', soulId: id, state: 'attesa', label: getCaseDef(g, caseId).title, mandatory: false });
  }
}

/** Mette in coda le anime la cui incarnazione successiva è giunta al termine. */
export function queueReturns(g: GameState, all = false): number {
  let n = 0;
  for (const soul of Object.values(g.souls)) {
    if (soul.returnDay === undefined) continue;
    if (!all && soul.returnDay > g.day) continue;
    if (soul.status !== 'reincarnata' && soul.status !== 'in_arrivo') continue;
    const inc = currentIncarnation(soul);
    if (inc.decisionId) continue;
    const caseId = procCaseId(soul.id, inc.index);
    if (g.queue.some((q) => q.caseId === caseId) || g.closed[caseId]) continue;
    inc.caseId = caseId;
    soul.returnDay = undefined;
    soul.status = 'in_arrivo';
    pushQueue(g, { caseId, kind: 'ritorno', soulId: soul.id, state: 'attesa', label: getCaseDef(g, caseId).title, mandatory: false });
    n++;
  }
  return n;
}

function syncDirectiveFlags(g: GameState): void {
  for (const d of DIRECTIVES) delete g.flags['dir_' + d.id];
  for (const d of activeDirectives(g)) g.flags['dir_' + d.id] = true;
}

export function startDay(g: GameState): void {
  for (const k of Object.keys(g.vars)) if (k.endsWith('_today') || k.includes('_today_')) delete g.vars[k];
  g.phase = 0;
  g.dayStarted = true;
  g.lastReport = null;
  g.queue = g.queue.filter((q) => q.state !== 'chiuso' && q.mandatory);
  if (g.mode === 'campaign') {
    const def = dayDef(g);
    if (def) {
      g.chapter = def.chapter;
      apply(g, def.fx);
      if (def.directive) {
        const dd = DIRECTIVES.find((x) => x.id === def.directive);
        issueDirective(g, def.directive, dd?.duration ?? 2);
      }
      for (const c of def.cases) queueCurated(g, c);
      queueNewProcedural(g, def.procedural);
      queueReturns(g);
    }
  } else {
    const ev = endlessDayStart(g);
    const n = endlessCaseCount(g);
    const returned = queueReturns(g, ev === 'ritorni');
    if (ev === 'ondata') {
      const rng = new Rng(mixSeed(g.seed, 'ondata', g.day));
      queueNewProcedural(g, 3, { town: rng.pick(TOWNS), cause: rng.pick(['il crollo del ponte', 'il naufragio del traghetto', 'l\'incendio del teatro', 'la frana sulla ferrovia']) });
    }
    queueNewProcedural(g, Math.max(1, n - returned));
    if ((g.day - 1) % 4 === 0) {
      const id = ENDLESS_DIRECTIVES[Math.floor((g.day - 1) / 4) % ENDLESS_DIRECTIVES.length];
      issueDirective(g, id, 3);
    }
  }
  syncDirectiveFlags(g);
  refreshCandidates(g);
  flushRequests(g);
}

/** Elabora le richieste di accodamento prodotte dagli effetti narrativi. Restituisce un caso da aprire subito, se richiesto. */
export function flushRequests(g: GameState): string | null {
  for (const k of Object.keys(g.vars)) {
    if (k.startsWith('queue:')) {
      const id = k.slice(6);
      delete g.vars[k];
      if (isCurated(id)) queueCurated(g, id);
    }
  }
  let open: string | null = null;
  for (const k of Object.keys(g.flags)) {
    if (k.startsWith('@open:')) {
      const id = k.slice(6);
      delete g.flags[k];
      if (isCurated(id) && !g.closed[id]) {
        queueCurated(g, id);
        open = id;
      }
    }
  }
  delete g.vars['@open'];
  return open;
}

export function takePuzzleRequest(g: GameState): string | null {
  for (const k of Object.keys(g.flags)) {
    if (k.startsWith('@puzzle:')) {
      delete g.flags[k];
      return k.slice(8);
    }
  }
  return null;
}

export interface BeatView { id: string; text: string; done: boolean; optional: boolean }

export function beats(g: GameState): BeatView[] {
  if (g.mode === 'endless') {
    const open = g.queue.filter((q) => q.state !== 'chiuso').length;
    return [
      { id: 'e_cases', text: `Evadi le pratiche del turno (${g.queue.length - open}/${g.queue.length}).`, done: open === 0, optional: true },
      { id: 'e_one', text: 'Evadi almeno una pratica prima di timbrare l\'uscita.', done: (g.vars['processed_today'] ?? 0) >= 1, optional: false },
    ];
  }
  const def = dayDef(g);
  if (!def) return [];
  return def.beats.map((b) => ({ id: b.id, text: b.text, done: check(g, b.done), optional: !!b.optional }));
}

export function canEndDay(g: GameState): { ok: boolean; missing: string[] } {
  if (g.activeCase) return { ok: false, missing: ['C\'è un fascicolo aperto sulla tua scrivania.'] };
  const missing = beats(g).filter((b) => !b.optional && !b.done).map((b) => b.text);
  for (const q of g.queue) if (q.mandatory && q.state !== 'chiuso') missing.push('Pratica obbligatoria non evasa: ' + q.label);
  return { ok: missing.length === 0, missing: [...new Set(missing)] };
}

/** Pausa (samovar, branda): fa avanzare la fase del turno e rinfranca. */
export function rest(g: GameState): string {
  if (g.phase >= 4) return 'È tardi. Non resta che timbrare l\'uscita.';
  g.phase++;
  if ((g.vars['rest_today'] ?? 0) < 1) addStat(g, 'morale', 1);
  g.vars['rest_today'] = (g.vars['rest_today'] ?? 0) + 1;
  return 'Il tempo passa. Nell\'ufficio qualcuno ha cambiato posto.';
}

export function endDay(g: GameState): DayReport {
  const processed = g.vars['processed_today'] ?? 0;
  const irregular = g.decisions.filter((d) => d.day === g.day && d.irregularities.length > 0).length;
  const extra: string[] = [];
  if (g.mode === 'endless') extra.push(...endlessDayEnd(g));
  const { lines, autoProcessed, credits } = dayEndOffice(g);
  const report: DayReport = { day: g.day, chapter: g.chapter, processed, autoProcessed, irregular, credits, lines: [...extra, ...lines] };
  g.reports.push(report);
  if (g.reports.length > 60) g.reports.shift();
  const prevChapter = g.chapter;
  g.day++;
  g.dayStarted = false;
  if (g.mode === 'campaign') {
    const next = DAYS.find((d) => d.day === g.day);
    if (next && next.chapter !== prevChapter) g.flags['chapter_intro_' + next.chapter] = true;
    if (g.day > LAST_DAY) g.day = LAST_DAY;
  }
  return report;
}

export interface EndingResult { id: string; reason?: string; allies: string[]; secrets: number }

export function allies(g: GameState): string[] {
  return ['hoot', 'bones', 'vesper', 'ilse', 'pim', 'grell'].filter((a) => g.flags['ally_' + a]);
}

/** Il finale dipende da: sentenza sul Direttore, sentenza su se stessi, alleati, segreti scoperti, stato dell'ufficio. */
export function resolveEnding(g: GameState): EndingResult {
  const al = allies(g);
  const secrets = solvedMysteries(g);
  const f = (k: string) => g.flags[k] === true;
  const base = { allies: al, secrets };
  const cycle = (reason: string): EndingResult => ({ id: 'cycle', reason: CYCLE_REASONS[reason], ...base });

  if (f('final_waiting')) return cycle('waiting');

  if (f('final_ascension')) {
    const trusted = g.stats.reputazione >= 55 && g.stats.sospetto <= 45 && !f('collegio_bloccato');
    return trusted ? { id: 'perfect', ...base } : cycle('perfect_no');
  }
  // Chi ha scelto di dimenticare non può sostenere né una riforma né una rivolta.
  if (f('self_renewal')) return cycle('self_renewal');

  if (f('final_trial')) {
    const ok = secrets >= 4 && al.length >= 2 && (al.includes('vesper') || al.includes('hoot')) && g.stats.morale >= 35;
    return ok ? { id: 'reformer', ...base } : cycle('reform_no');
  }
  if (f('final_otherForm')) {
    const defiant = g.stats.irregolari >= 5 || (g.vars['defiance'] ?? 0) >= 2 || f('collegio_bloccato');
    const hands = al.includes('bones') || al.includes('grell') || al.includes('pim');
    return secrets >= 3 && defiant && hands ? { id: 'rebel', ...base } : cycle('rebel_no');
  }
  if (f('final_renewal')) {
    const remembers = f('self_memoria') && !!g.knowledge['k_messaggio'];
    const knowsHow = g.closed['c13']?.clues.includes('restituire') ?? false;
    if (remembers && knowsHow && secrets >= 5) return { id: 'newbeginning', ...base };
    if (al.length >= 2 && secrets >= 4) return { id: 'reformer', ...base };
    return cycle('renew_no');
  }
  return cycle('waiting');
}
