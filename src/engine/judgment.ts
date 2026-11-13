// Judgment Engine — sentenze, irregolarità, reincarnazione, registrazione delle conseguenze.
// Nessuna destinazione è mai bloccata: il giocatore può sempre scegliere liberamente.
import type { CaseDef, Decision, Destination, GameState, MotivationDef, OutcomeDef, ReincarnationReport, SpecialVerdictDef } from './types';
import { apply, addStat, check } from './cond';
import { clueDef, currentIncarnation, getCaseDef, isCurated, procCaseId, truthFound } from './cases';
import { nextIncarnation } from './generator';
import { DEST_LABEL, fmt } from './text';
import { directiveActive } from './office';
import { maybeLinkSoul } from './endless';

export const GENERIC_MOTIVATIONS: MotivationDef[] = [
  { id: 'g_regola', text: 'Applicazione ordinaria del regolamento.' },
  { id: 'g_attenuanti', text: 'Le attenuanti prevalgono sulle colpe accertate.' },
  { id: 'g_colpe', text: 'Le colpe accertate prevalgono sulle attenuanti.' },
  { id: 'g_insufficiente', text: 'Il fascicolo è insufficiente: giudizio sospeso.', dest: ['waitingRoom'] },
  { id: 'g_coscienza', text: 'Decisione di coscienza, in difformità dal regolamento.' },
];

export interface VerdictInput {
  dest: Destination;
  specialId?: string;
  motivationId: string;
  evidence: string[];
  conceal: boolean;
}

export function availableSpecials(g: GameState, def: CaseDef): SpecialVerdictDef[] {
  const ac = g.activeCase;
  if (!ac) return [];
  return (def.specials ?? []).filter((s) => check(g, s.cond) && (s.needClues ?? []).every((c) => ac.clues.includes(c)));
}

export function availableMotivations(g: GameState, def: CaseDef, dest: Destination): MotivationDef[] {
  const ac = g.activeCase;
  if (!ac) return [];
  const all = [...def.motivations, ...GENERIC_MOTIVATIONS];
  return all.filter((m) => (!m.dest || m.dest.includes(dest)) && (m.needClues ?? []).every((c) => ac.clues.includes(c)));
}

/** Calcola le irregolarità di una sentenza prima di emetterla (mostrate al giocatore). */
export function computeIrregularities(g: GameState, def: CaseDef, input: VerdictInput): string[] {
  const ac = g.activeCase;
  if (!ac) return [];
  const out: string[] = [];
  const special = input.specialId ? def.specials?.find((s) => s.id === input.specialId) : undefined;
  const outcome: OutcomeDef = special ? special.outcome : def.outcomes[input.dest];
  if (outcome.irregular) out.push(outcome.irregular);
  const hasVerified = input.evidence.some((c) => clueDef(def, c)?.status === 'verificato');
  if (!special && !outcome.irregular && input.dest !== def.recommended) {
    if (def.binding) out.push('Destinazione difforme da disposizione vincolante.');
    else if (!hasVerified) out.push('Destinazione difforme dalla raccomandazione, senza evidenza verificata a sostegno.');
  }
  if (!ac.registered) out.push('Sentenza emessa senza registrazione dell\'anima.');
  if (def.type === 'ricorso' && directiveActive(g, 'd_ricorsi') && input.dest !== 'trial' && input.dest !== 'waitingRoom') {
    out.push('Ricorso accolto in vigenza della sospensione dei ricorsi.');
  }
  if (input.motivationId === 'g_coscienza') out.push('Motivazione extra-regolamentare.');
  return out;
}

function creditsFor(g: GameState, def: CaseDef, found: boolean): number {
  let c = def.procedural ? 15 : 25;
  c += (g.departments.judgment ?? 0) * 3;
  if (g.tools.includes('timbro')) c += 5;
  if (found) c += 5;
  return c;
}

export function issueVerdict(g: GameState, input: VerdictInput): ReincarnationReport {
  const ac = g.activeCase;
  if (!ac) throw new Error('Nessun caso attivo.');
  const def = getCaseDef(g, ac.caseId);
  const soul = g.souls[def.soulId];
  const inc = currentIncarnation(soul);
  const special = input.specialId ? def.specials?.find((s) => s.id === input.specialId) : undefined;
  const dest: Destination = special ? special.dest : input.dest;
  const outcome: OutcomeDef = special ? special.outcome : def.outcomes[input.dest];
  const irregularities = computeIrregularities(g, def, input);
  const found = truthFound(g, def);
  const motivation =
    [...def.motivations, ...GENERIC_MOTIVATIONS].find((m) => m.id === input.motivationId)?.text ?? 'Nessuna motivazione a verbale.';
  const evidenceLabels = input.evidence.map((c) => clueDef(def, c)?.label).filter((x): x is string => !!x);

  g.counter++;
  const decisionId = `D${String(g.counter).padStart(4, '0')}`;
  const consequences = outcome.consequences.map((c) => fmt(g, c));
  const reincEffects: string[] = [];
  let residuo = def.residuo ?? '';
  let next: ReincarnationReport['next'];
  let inherited: ReincarnationReport['inherited'];

  // --- Stato dell'anima e reincarnazione ---
  const isStaffOrSelf = def.type === 'indagine_interna' || def.soulId === 'S-PLAYER' || def.soulId === 'S-DIRETTORE';
  if (!isStaffOrSelf) {
    if (dest === 'ascension') {
      soul.status = 'ascesa';
      reincEffects.push('Nessuna reincarnazione: l\'anima è conferita ai Livelli Superiori.');
    } else if (dest === 'waitingRoom') {
      soul.status = 'in_attesa';
      soul.waitingSince = g.day;
      reincEffects.push('Nessuna reincarnazione: giudizio sospeso. L\'anima attende.');
    } else {
      const r = nextIncarnation(soul, dest, outcome.reinc?.form);
      if (!residuo) residuo = r.residuo;
      r.inc.bornDay = g.day;
      soul.incarnations.push(r.inc);
      soul.status = 'reincarnata';
      next = r.inc;
      inherited = r.inc.inherited;
      if (outcome.reinc?.noReturn) soul.returnDay = undefined;
      else soul.returnDay = g.day + (outcome.reinc?.returnIn ?? 5);
      reincEffects.push(dest === 'otherForm' ? 'Nuova forma: ' + r.inc.name + '.' : 'Nuova incarnazione: ' + r.inc.name + ', ' + r.inc.origin + '.');
      if (outcome.reinc?.note) reincEffects.push('Annotazione karmica: ' + outcome.reinc.note + '.');
      if (inherited) {
        const parts = [...inherited.predisposizioni, ...inherited.paure.map((p) => 'paura: ' + p), ...inherited.memorie.map((m) => 'frammento: ' + m)];
        if (parts.length) reincEffects.push('Eredita: ' + parts.join('; ') + '.');
      }
    }
  } else {
    reincEffects.push('Procedimento su personale: nessuna reincarnazione ordinaria.');
  }
  if (!residuo) residuo = 'un ricordo senza nome';
  if (special?.outcome.fx?.soulStatus || outcome.fx?.soulStatus) {
    // lo stato esplicito del contenuto prevale (es. macerazione)
  }

  const decision: Decision = {
    id: decisionId,
    soulId: soul.id,
    soulName: inc.name,
    caseId: def.id,
    caseTitle: fmt(g, def.title),
    day: g.day,
    chapter: g.chapter,
    mode: g.mode,
    destination: dest,
    special: special?.label,
    motivation,
    evidence: evidenceLabels,
    irregularities,
    consequences,
    reincEffects,
    residuo,
    truthFound: found,
    reported: irregularities.length > 0 && !input.conceal,
    concealed: irregularities.length > 0 && input.conceal,
  };
  g.decisions.push(decision);
  inc.decisionId = decisionId;
  inc.caseId = def.id;

  // --- Effetti narrativi ---
  apply(g, outcome.fx);
  apply(g, def.onClose);
  g.flags['closed_' + def.id] = true;
  g.flags['verdict_' + def.id + '_' + dest] = true;
  if (found) g.flags['truth_' + def.id] = true;

  // --- Effetti gestionali ---
  if (irregularities.length > 0) {
    addStat(g, 'irregolari', 1);
    if (input.conceal) addStat(g, 'sospetto', directiveActive(g, 'd_segnalazione') ? 6 : 3);
    else addStat(g, 'reputazione', -2);
  } else {
    addStat(g, 'efficienza', 1);
  }
  if (def.type === 'ricorso' && dest !== 'trial' && dest !== 'waitingRoom') {
    g.vars['ricorsi_accolti'] = (g.vars['ricorsi_accolti'] ?? 0) + 1;
    g.vars['ricorsi_today'] = (g.vars['ricorsi_today'] ?? 0) + 1;
  }
  const creditsDelta = creditsFor(g, def, found);
  g.credits += creditsDelta;
  g.vars['processed_today'] = (g.vars['processed_today'] ?? 0) + 1;
  g.vars['dest_today_' + dest] = (g.vars['dest_today_' + dest] ?? 0) + 1;
  if (irregularities.length && input.conceal) g.vars['concealed_today'] = (g.vars['concealed_today'] ?? 0) + 1;
  if (g.endless) {
    const t = g.endless.totals;
    t.casi = (t.casi ?? 0) + 1;
    t['dest_' + dest] = (t['dest_' + dest] ?? 0) + 1;
    if (found) t.verita = (t.verita ?? 0) + 1;
    if (irregularities.length) t.irregolari = (t.irregolari ?? 0) + 1;
    if (def.type === 'ritorno') t.ritorni = (t.ritorni ?? 0) + 1;
  }

  // --- Chiusura ---
  g.closed[def.id] = { caseId: def.id, title: fmt(g, def.title), soulId: soul.id, clues: [...ac.clues], contradictions: [...ac.contradictions], decisionId, day: g.day };
  const item = g.queue.find((q) => q.caseId === def.id);
  if (item) item.state = 'chiuso';
  g.activeCase = null;
  if (g.phase < 4) g.phase++;

  const report: ReincarnationReport = {
    decisionId,
    destination: dest,
    headline: (special ? special.label + ' — ' : '') + DEST_LABEL[dest],
    text: fmt(g, outcome.text),
    consequences,
    inherited,
    next,
    residuo,
    irregularities,
    creditsDelta,
  };
  g.lastReport = report;
  maybeLinkSoul(g, soul.id);
  return report;
}

/** Revisione di una sentenza di sospensione: richiama un'anima dalla Sala d'Attesa e la avvia a una nuova destinazione. */
export function reviseWaiting(g: GameState, soulId: string, to: Destination): { ok: boolean; text: string } {
  const soul = g.souls[soulId];
  if (!soul || soul.status !== 'in_attesa') return { ok: false, text: 'L\'anima non è in Sala d\'Attesa.' };
  if ((g.departments.archive ?? 0) < 2) return { ok: false, text: 'Serve l\'Archivio al livello 2 (Ufficio Revisioni).' };
  if (to === 'waitingRoom') return { ok: false, text: 'È già sospesa.' };
  const cost = 30;
  if (g.credits < cost) return { ok: false, text: 'Crediti insufficienti (30 CE).' };
  g.credits -= cost;
  const d = [...g.decisions].reverse().find((x) => x.soulId === soulId);
  if (d) d.revised = { day: g.day, to };
  const inc = currentIncarnation(soul);
  if (to === 'ascension') {
    soul.status = 'ascesa';
  } else {
    const r = nextIncarnation(soul, to);
    r.inc.bornDay = g.day;
    soul.incarnations.push(r.inc);
    soul.status = 'reincarnata';
    if (!soul.curated) soul.returnDay = g.day + 5;
  }
  soul.waitingSince = undefined;
  addStat(g, 'ricorsi', 1);
  return { ok: true, text: inc.name + ' è richiamat' + (inc.gender === 'f' ? 'a' : 'o') + ' dalla Sala d\'Attesa: ' + DEST_LABEL[to] + '.' };
}

export { procCaseId, isCurated };
