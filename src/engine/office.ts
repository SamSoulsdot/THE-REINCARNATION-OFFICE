// Office Management — personale, reparti, strumenti, direttive, chiusura contabile del turno.
import type { Candidate, DeptId, GameState, Stance, StaffMember, StaffRole } from './types';
import { CANDIDATE_ORIGINS, DEPARTMENTS, DIRECTIVES, NAMES_F, NAMES_M, SURNAMES, TEMPERS, TOOLS } from '../content';
import { Rng, mixSeed } from './rng';
import { addStat, check } from './cond';
import { currentIncarnation } from './cases';

export const PROTECTED_WAITING = ['S-ODILE', 'S-NN', 'S-LORENZ', 'S-SABINA', 'S-HANNE', 'S-ILSE', 'S-RIENTRATO'];
const STAFF_ROLES: StaffRole[] = ['registratore', 'scrivano', 'archivista', 'consulente', 'custode'];

export function directiveActive(g: GameState, id: string): boolean {
  return g.directives.some((d) => d.id === id && g.day >= d.issuedDay && g.day <= d.expiresDay);
}

export function activeDirectives(g: GameState) {
  return g.directives.filter((d) => g.day >= d.issuedDay && g.day <= d.expiresDay);
}

export function issueDirective(g: GameState, id: string, duration: number): void {
  const existing = g.directives.find((d) => d.id === id && d.expiresDay >= g.day);
  if (existing) return;
  g.directives.push({ id, issuedDay: g.day, stance: null, expiresDay: g.day + duration - 1 });
}

export function setStance(g: GameState, id: string, stance: Stance): void {
  const d = g.directives.find((x) => x.id === id && g.day >= x.issuedDay && g.day <= x.expiresDay);
  if (d) d.stance = stance;
}

/** Verifica oggettiva del rispetto di una direttiva nel turno corrente. */
export function directiveMet(g: GameState, id: string): boolean {
  const v = (k: string) => g.vars[k] ?? 0;
  switch (id) {
    case 'd_quota': return v('processed_today') >= 3;
    case 'd_ricorsi': return v('ricorsi_today') === 0;
    case 'd_archivio': return v('arch_today') === 0;
    case 'd_prove': return v('dest_today_trial') >= 1;
    case 'd_segnalazione': return v('concealed_today') === 0;
    case 'd_ascensioni': return v('dest_today_ascension') >= 1;
    default: return true;
  }
}

export function refreshCandidates(g: GameState): void {
  const rng = new Rng(mixSeed(g.seed, 'cand', g.day));
  const out: Candidate[] = [];
  for (let i = 0; i < 3; i++) {
    const f = rng.chance(0.5);
    const skill = rng.int(1, 3) + (g.day > 8 ? 1 : 0);
    out.push({
      id: `cand-${g.day}-${i}`,
      name: rng.pick(f ? NAMES_F : NAMES_M) + ' ' + rng.pick(SURNAMES),
      skill,
      temper: rng.pick(TEMPERS),
      origin: rng.pick(CANDIDATE_ORIGINS),
      best: rng.pick(STAFF_ROLES),
      cost: 30 + skill * 20,
    });
  }
  // Le anime in Sala d'Attesa possono essere assunte: il personale è fatto di giudizi sospesi.
  for (const s of Object.values(g.souls)) {
    if (s.status !== 'in_attesa') continue;
    if (['S-ODILE', 'S-NN', 'S-RIENTRATO', 'S-SABINA'].includes(s.id)) continue;
    const inc = currentIncarnation(s);
    if (inc.form) continue;
    const r = new Rng(mixSeed(s.seed, 'cand'));
    const best: StaffRole = s.id === 'S-ILSE' ? 'consulente' : inc.traits.responsabilita >= 7 ? 'registratore' : inc.traits.empatia >= 7 ? 'consulente' : inc.traits.onesta >= 7 ? 'archivista' : inc.traits.coraggio >= 7 ? 'custode' : 'scrivano';
    out.push({
      id: 'soul-' + s.id,
      name: inc.name,
      skill: s.id === 'S-ILSE' ? 5 : Math.max(1, Math.min(5, Math.round((inc.traits.responsabilita + inc.traits.onesta) / 4))),
      temper: r.pick(TEMPERS),
      origin: 'dalla Sala d\'Attesa — giudizio sospeso da te',
      best,
      cost: 20,
      soulId: s.id,
    });
  }
  g.candidates = out;
}

export function hire(g: GameState, candidateId: string, role: StaffRole): { ok: boolean; text: string } {
  const c = g.candidates.find((x) => x.id === candidateId);
  if (!c) return { ok: false, text: 'Candidato non più disponibile.' };
  if (g.staff.length >= 8) return { ok: false, text: 'Organico completo (8 unità).' };
  if (g.credits < c.cost) return { ok: false, text: 'Crediti Eterni insufficienti.' };
  g.credits -= c.cost;
  const member: StaffMember = {
    id: 'staff-' + (++g.counter), name: c.name, role, skill: c.skill + (c.best === role ? 1 : 0), temper: c.temper,
    origin: c.origin, soulId: c.soulId, hiredDay: g.day, level: 1, xp: 0,
  };
  member.skill = Math.min(5, member.skill);
  g.staff.push(member);
  g.candidates = g.candidates.filter((x) => x.id !== candidateId);
  if (c.soulId && g.souls[c.soulId]) {
    g.souls[c.soulId].status = 'assunta';
    g.souls[c.soulId].waitingSince = undefined;
    if (c.soulId === 'S-ILSE') { g.npc['ilse'] = 'attivo'; g.flags['ilse_richiamata'] = true; delete g.flags['ilse_sospesa']; }
  }
  addStat(g, 'morale', 2);
  if (g.endless) g.endless.totals.assunzioni = (g.endless.totals.assunzioni ?? 0) + 1;
  return { ok: true, text: c.name + ' prende servizio come ' + role + '.' };
}

export function assignRole(g: GameState, staffId: string, role: StaffRole): void {
  const s = g.staff.find((x) => x.id === staffId);
  if (s) s.role = role;
}

export function dismiss(g: GameState, staffId: string): void {
  const s = g.staff.find((x) => x.id === staffId);
  if (!s) return;
  g.staff = g.staff.filter((x) => x.id !== staffId);
  if (s.soulId && g.souls[s.soulId]) {
    g.souls[s.soulId].status = 'in_attesa';
    g.souls[s.soulId].waitingSince = g.day;
  }
  addStat(g, 'morale', -4);
}

export function deptCost(g: GameState, dept: DeptId): number | null {
  const lvl = g.departments[dept] ?? 0;
  const def = DEPARTMENTS[dept];
  return lvl < def.levels.length ? def.levels[lvl].cost : null;
}

export function upgradeDept(g: GameState, dept: DeptId): { ok: boolean; text: string } {
  const def = DEPARTMENTS[dept];
  if (!check(g, def.cond)) return { ok: false, text: 'Reparto non ancora accessibile.' };
  const cost = deptCost(g, dept);
  if (cost === null) return { ok: false, text: 'Livello massimo raggiunto.' };
  if (g.credits < cost) return { ok: false, text: 'Crediti Eterni insufficienti.' };
  g.credits -= cost;
  g.departments[dept] = (g.departments[dept] ?? 0) + 1;
  if (dept === 'interview' && g.departments[dept] >= 1 && !g.tools.includes('cilindro')) g.tools.push('cilindro');
  if (g.endless) g.endless.totals.potenziamenti = (g.endless.totals.potenziamenti ?? 0) + 1;
  return { ok: true, text: def.label + ': ' + def.levels[g.departments[dept] - 1].effect };
}

export function buyTool(g: GameState, toolId: string): { ok: boolean; text: string } {
  const t = TOOLS.find((x) => x.id === toolId);
  if (!t || !check(g, t.cond)) return { ok: false, text: 'Strumento non disponibile.' };
  if (g.tools.includes(toolId)) return { ok: false, text: 'Già in dotazione.' };
  if (g.credits < t.cost) return { ok: false, text: 'Crediti Eterni insufficienti.' };
  g.credits -= t.cost;
  g.tools.push(toolId);
  return { ok: true, text: t.label + ' in dotazione.' };
}

function staffSkill(g: GameState, role: StaffRole): number {
  return g.staff.filter((s) => s.role === role).reduce((a, s) => a + s.skill, 0);
}

export function hasRole(g: GameState, role: StaffRole): boolean {
  return g.staff.some((s) => s.role === role);
}

export function wages(g: GameState): number {
  return g.staff.reduce((a, s) => a + 4 + 2 * s.skill, 0);
}

/** Chiusura contabile e disciplinare del turno. Restituisce le righe del rapporto. */
export function dayEndOffice(g: GameState): { lines: string[]; autoProcessed: number; credits: number } {
  const lines: string[] = [];
  const rng = new Rng(mixSeed(g.seed, 'dayend', g.day));
  let credits = 0;

  // --- Direttive ---
  for (const d of activeDirectives(g)) {
    const def = DIRECTIVES.find((x) => x.id === d.id);
    const title = def?.title ?? d.id;
    const met = directiveMet(g, d.id);
    const stance = d.stance ?? 'rispetta';
    if (met) {
      addStat(g, 'reputazione', 3);
      credits += 10;
      lines.push(`${title}: rispettata. (+3 reputazione, +10 CE)`);
      d.outcome = 'rispettata';
    } else if (stance === 'manipola') {
      const cost = (g.departments.management ?? 0) >= 2 ? 8 : 15;
      let risk = 20 + g.stats.sospetto / 2;
      if ((g.departments.archive ?? 0) >= 3) risk /= 2;
      if (g.tools.includes('carta_bianca')) risk /= 2;
      g.credits = Math.max(0, g.credits - cost);
      g.vars['manip'] = (g.vars['manip'] ?? 0) + 1;
      if (rng.next() * 100 < risk) {
        addStat(g, 'reputazione', -8);
        addStat(g, 'sospetto', 8);
        g.credits = Math.max(0, g.credits - 20);
        lines.push(`${title}: violata. Il rapporto falsificato è stato scoperto. (−8 reputazione, +8 sospetto, −${cost + 20} CE)`);
        d.outcome = 'falso scoperto';
      } else {
        addStat(g, 'reputazione', 2);
        addStat(g, 'sospetto', 2);
        lines.push(`${title}: violata, ma il rapporto la dà per rispettata. Nessuno ha controllato. (−${cost} CE, +2 sospetto)`);
        d.outcome = 'falsificata';
      }
    } else if (stance === 'ignora') {
      addStat(g, 'reputazione', -3);
      addStat(g, 'morale', 2);
      g.rel['vesper'] = Math.max(-10, (g.rel['vesper'] ?? 0) - 1);
      g.vars['defiance'] = (g.vars['defiance'] ?? 0) + 1;
      lines.push(`${title}: ignorata apertamente. Il personale l'ha notato. (−3 reputazione, +2 morale)`);
      d.outcome = 'ignorata';
    } else {
      addStat(g, 'reputazione', -5);
      addStat(g, 'sospetto', 3);
      g.rel['vesper'] = Math.max(-10, (g.rel['vesper'] ?? 0) - 1);
      lines.push(`${title}: non rispettata. (−5 reputazione, +3 sospetto)`);
      d.outcome = 'violata';
    }
  }

  // --- Pratiche pendenti ---
  const left = g.queue.filter((q) => q.state !== 'chiuso' && !q.mandatory).length;
  if (left > 0) {
    addStat(g, 'pendenti', left);
    lines.push(`${left} pratic${left === 1 ? 'a' : 'he'} non evas${left === 1 ? 'a' : 'e'} pass${left === 1 ? 'a' : 'ano'} tra le pendenti.`);
  }
  const inflow = Math.max(0, rng.int(1, 3) - (g.departments.reception ?? 0) - Math.floor(staffSkill(g, 'registratore') / 2));
  if (inflow > 0) addStat(g, 'pendenti', inflow);

  // --- Scrivani: giudizi d'ufficio ---
  let auto = 0;
  const capacity = g.staff.filter((s) => s.role === 'scrivano').reduce((a, s) => a + Math.ceil(s.skill / 2), 0);
  auto = Math.min(capacity, g.stats.pendenti);
  if (auto > 0) {
    addStat(g, 'pendenti', -auto);
    credits += auto * 8;
    let appeals = 0;
    for (let i = 0; i < auto; i++) if (rng.chance(0.12)) appeals++;
    lines.push(`Gli scrivani hanno evaso d'ufficio ${auto} pratic${auto === 1 ? 'a' : 'he'}. (+${auto * 8} CE)`);
    if (appeals > 0) {
      addStat(g, 'ricorsi', appeals);
      addStat(g, 'reputazione', -appeals);
      lines.push(`${appeals} giudizi${appeals === 1 ? 'o' : ''} d'ufficio ${appeals === 1 ? 'ha' : 'hanno'} generato ricorso.`);
    }
    if (g.endless) g.endless.totals.autoEvase = (g.endless.totals.autoEvase ?? 0) + auto;
  }

  // --- Sala d'Attesa: chi smette di parlare ---
  const limit = 6 + (hasRole(g, 'custode') ? 3 : 0);
  for (const s of Object.values(g.souls)) {
    if (s.status !== 'in_attesa' || s.waitingSince === undefined) continue;
    if (PROTECTED_WAITING.includes(s.id)) continue;
    if (g.day - s.waitingSince >= limit) {
      s.status = 'sbiadita';
      addStat(g, 'morale', -1);
      g.vars['sbiadite'] = (g.vars['sbiadite'] ?? 0) + 1;
      lines.push(`${currentIncarnation(s).name} ha smesso di parlare. Il Custode ha provveduto.`);
      if (g.endless) g.endless.totals.sbiadite = (g.endless.totals.sbiadite ?? 0) + 1;
    }
  }

  // --- Personale: paghe, esperienza ---
  const w = wages(g);
  if (w > 0) {
    credits -= w;
    lines.push(`Paghe del personale: −${w} CE.`);
  }
  for (const s of g.staff) {
    s.xp += 1 + ((g.departments.employee ?? 0) >= 3 ? 1 : 0);
    if (s.xp >= 4 * s.level && s.skill < 5) {
      s.xp = 0;
      s.level++;
      s.skill++;
      lines.push(`${s.name} ha preso pratica: abilità ${s.skill}.`);
    }
  }

  // --- Indicatori ---
  const target = 40 + Math.min(20, staffSkill(g, 'registratore') * 4) + (g.departments.judgment ?? 0) * 5 + (g.stats.morale - 50) / 2;
  addStat(g, 'efficienza', (target - g.stats.efficienza) * 0.25);
  let dm = (g.departments.employee ?? 0) * 2 + Math.min(4, staffSkill(g, 'consulente')) + ((g.departments.interview ?? 0) >= 2 ? 2 : 0);
  if (g.stats.pendenti > 10) dm -= Math.floor((g.stats.pendenti - 10) / 5) + 1;
  dm += g.stats.morale > 60 ? -1 : g.stats.morale < 40 ? 1 : 0;
  addStat(g, 'morale', dm);
  addStat(g, 'reputazione', (g.departments.management ?? 0) + (g.stats.pendenti > 15 ? -1 : 0));
  if (g.stats.anomalie > 0 && (hasRole(g, 'custode') || (g.departments.restricted ?? 0) >= 1) && rng.chance(0.5)) addStat(g, 'anomalie', -1);

  // --- Ispezione a sorpresa ---
  if (g.stats.sospetto >= 30 && rng.next() < g.stats.sospetto / 250) {
    addStat(g, 'reputazione', -6);
    addStat(g, 'sospetto', -10);
    credits -= 25;
    g.flags['ispezionato'] = true;
    lines.push('Ispezione a sorpresa: qualcuno ha riaperto i tuoi fascicoli. (−6 reputazione, −25 CE)');
  }

  // --- Stipendio ---
  const salary = 20 + Math.round(g.stats.efficienza / 5);
  credits += salary;
  lines.push(`Stipendio di turno: +${salary} CE.`);
  g.credits = Math.max(0, g.credits + credits);
  return { lines, autoProcessed: auto, credits };
}
