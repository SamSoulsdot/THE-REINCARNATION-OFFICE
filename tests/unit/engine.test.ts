import { describe, expect, it } from 'vitest';
import { Rng, mixSeed } from '../../src/engine/rng';
import { buildLife, generateSoul, inherit, makeProceduralCase, nextIncarnation } from '../../src/engine/generator';
import { TEMPLATES } from '../../src/content';
import { DESTINATIONS, TRAIT_KEYS, type GameState } from '../../src/engine/types';
import { newCampaign, newEndless } from '../../src/engine/sim';
import { queueCurated, queueNewProcedural, startDay } from '../../src/engine/campaign';
import { askTopic, attemptPuzzle, availableTopics, compareClues, getCaseDef, noteClue, openCase, registerSoul, currentIncarnation } from '../../src/engine/cases';
import { availableMotivations, availableSpecials, computeIrregularities, issueVerdict, reviseWaiting } from '../../src/engine/judgment';
import { apply, check } from '../../src/engine/cond';
import { tryLink, mysteryViews, grantKnowledge } from '../../src/engine/knowledge';
import { buyTool, dayEndOffice, directiveMet, hire, issueDirective, refreshCandidates, setStance, upgradeDept } from '../../src/engine/office';
import { npcPlans, npcTopics, readLore, sceneNext, startScene } from '../../src/engine/scene';
import { investigate, solveCase } from '../helpers/bot';

const fresh = (): GameState => {
  const g = newCampaign('Ada Loris', 1234);
  return g;
};

describe('RNG', () => {
  it('è deterministico a parità di seed e diverso tra seed', () => {
    const a = new Rng(42), b = new Rng(42), c = new Rng(43);
    const sa = Array.from({ length: 8 }, () => a.next());
    expect(sa).toEqual(Array.from({ length: 8 }, () => b.next()));
    expect(sa).not.toEqual(Array.from({ length: 8 }, () => c.next()));
    expect(mixSeed(1, 'a')).toBe(mixSeed(1, 'a'));
    expect(mixSeed(1, 'a')).not.toBe(mixSeed(1, 'b'));
  });
});

describe('generazione delle anime', () => {
  it('lo stesso seed produce la stessa anima (riproducibilità)', () => {
    expect(generateSoul(99, 'P1')).toEqual(generateSoul(99, 'P1'));
    expect(generateSoul(99, 'P1').incarnations[0].name).not.toBe(generateSoul(100, 'P1').incarnations[0].name);
  });

  it('gli eventi di vita sono ordinati, coerenti con l\'età e terminano con la morte', () => {
    for (let s = 1; s <= 120; s++) {
      const inc = generateSoul(s, 'P' + s).incarnations[0];
      const ages = inc.events.map((e) => e.age);
      expect([...ages].sort((a, b) => a - b)).toEqual(ages);
      expect(Math.max(...ages)).toBe(inc.ageAtDeath);
      expect(inc.events[inc.events.length - 1].tag).toBe('morte');
      for (const k of TRAIT_KEYS) { expect(inc.traits[k]).toBeGreaterThanOrEqual(0); expect(inc.traits[k]).toBeLessThanOrEqual(10); }
      expect(inc.relations.length).toBe(2);
      expect(inc.memories.length).toBeGreaterThan(0);
    }
  });

  it('ogni template × variante produce un caso coerente con la propria verità canonica', () => {
    for (const tpl of TEMPLATES) for (const variant of [0, 1]) {
      const life = buildLife(mixSeed(7, tpl.id, variant), { tplId: tpl.id, variant });
      const soul = { id: 'PX', seed: 5, curated: false, incarnations: [{ ...life, index: 1 }], status: 'in_arrivo' as const, notes: [] };
      const c = makeProceduralCase(soul, soul.incarnations[0], { caseId: 'p:PX:1', day: 1, mode: 'endless' });
      const v = tpl.variants[variant];
      const official = c.docs.find((d) => d.id === 'ufficiale')!;
      const witness = c.docs.find((d) => d.id === 'teste')!;
      // Esattamente uno dei due documenti è inattendibile, ed è quello indicato dalla variante.
      expect(official.reliability === 'attendibile', `${tpl.id}/${variant}`).toBe(v.flawed !== 'ufficiale');
      expect(witness.reliability === 'attendibile', `${tpl.id}/${variant}`).toBe(v.flawed !== 'teste');
      expect(c.truth[0]).not.toContain('{');
      expect(c.docs.every((d) => d.body.every((p) => !(typeof p === 'string' ? p : p.t).includes('{')))).toBe(true);
      expect(c.contradictions.length).toBe(1);
      expect(c.truthClue).toBe('verita');
    }
  });

  it('due varianti dello stesso template raccontano verità diverse con gli stessi documenti', () => {
    const tpl = TEMPLATES[3];
    const mk = (variant: number) => {
      const life = buildLife(11, { tplId: tpl.id, variant });
      const soul = { id: 'PX', seed: 5, curated: false, incarnations: [{ ...life, index: 1 }], status: 'in_arrivo' as const, notes: [] };
      return makeProceduralCase(soul, soul.incarnations[0], { caseId: 'p:PX:1', day: 1, mode: 'endless' });
    };
    const a = mk(0), b = mk(1);
    expect(a.truth[0]).not.toBe(b.truth[0]);
    expect(a.topics.find((t) => t.id === 'confronto')!.a).not.toBe(b.topics.find((t) => t.id === 'confronto')!.a);
  });
});

describe('caso attivo: documenti, colloquio, contraddizioni', () => {
  it('il confronto è disponibile solo dopo aver rilevato la contraddizione', () => {
    const g = fresh();
    queueCurated(g, 'c01');
    openCase(g, 'c01');
    const def = getCaseDef(g, 'c01');
    expect(availableTopics(g, def).some((t) => t.id === 'confronto')).toBe(false);
    expect(compareClues(g, 'denuncia', 'sapeva')).toBeNull(); // non ancora annotati
    noteClue(g, 'denuncia'); noteClue(g, 'sapeva'); noteClue(g, 'credito');
    expect(compareClues(g, 'denuncia', 'credito')).toBeNull(); // coppia non contraddittoria
    expect(compareClues(g, 'sapeva', 'denuncia')?.id).toBe('x_sapeva');
    expect(availableTopics(g, getCaseDef(g, 'c01')).some((t) => t.id === 'confronto')).toBe(true);
    const r = askTopic(g, 'confronto')!;
    expect(r.newClues.map((c) => c.id)).toContain('verita');
  });

  it('annotare un indizio sblocca la conoscenza globale collegata', () => {
    const g = fresh();
    queueCurated(g, 'c01'); openCase(g, 'c01');
    expect(g.knowledge['sym_spirale']).toBeUndefined();
    expect(noteClue(g, 'timbro')).toBe(true);
    expect(noteClue(g, 'timbro')).toBe(false);
    expect(g.knowledge['sym_spirale']).toBeDefined();
  });

  it('gli enigmi accettano solo la soluzione corretta', () => {
    const g = fresh();
    queueCurated(g, 'c03'); openCase(g, 'c03'); investigate(g);
    const g2 = fresh();
    queueCurated(g2, 'c03'); openCase(g2, 'c03');
    noteClue(g2, 'molnar_no'); noteClue(g2, 'tre_passi');
    expect(attemptPuzzle(g2, 'notte', 'f,e,d,c,b,a').ok).toBe(false);
    expect(g2.activeCase!.clues).not.toContain('sequenza');
    expect(attemptPuzzle(g2, 'notte', 'a,b,c,d,e,f').ok).toBe(true);
    expect(g2.activeCase!.clues).toContain('sequenza');
  });

  it('le condizioni dei dialoghi dipendono dalla conoscenza acquisita in altri casi', () => {
    const g = fresh();
    queueCurated(g, 'c06'); openCase(g, 'c06');
    expect(availableTopics(g, getCaseDef(g, 'c06')).some((t) => t.id === 'saputo')).toBe(false);
    g.flags['kessel_rettificato'] = true;
    expect(availableTopics(g, getCaseDef(g, 'c06')).some((t) => t.id === 'saputo')).toBe(true);
  });
});

describe('sentenze e irregolarità', () => {
  it('nessuna destinazione è bloccata: ogni caso curato accetta tutte e cinque', () => {
    for (const d of DESTINATIONS) {
      const g = fresh();
      queueCurated(g, 'c02');
      const rep = solveCase(g, 'c02', { investigate: false, pick: () => ({ dest: d }) });
      expect(rep.destination).toBe(d);
      expect(g.decisions).toHaveLength(1);
    }
  });

  it('una sentenza difforme è irregolare senza evidenza verificata, regolare con', () => {
    const g = fresh();
    queueCurated(g, 'c03'); openCase(g, 'c03'); registerSoul(g);
    const def = getCaseDef(g, 'c03');
    const base = { dest: 'renewal' as const, motivationId: 'g_regola', conceal: false };
    expect(computeIrregularities(g, def, { ...base, evidence: [] }).length).toBe(1);
    investigate(g);
    expect(computeIrregularities(g, getCaseDef(g, 'c03'), { ...base, evidence: ['verita'] })).toEqual([]);
    expect(computeIrregularities(g, getCaseDef(g, 'c03'), { ...base, dest: 'trial', evidence: [] })).toEqual([]);
  });

  it('la decisione registra anima, caso, data, destinazione, motivazione, evidenze, irregolarità, conseguenze', () => {
    const g = fresh();
    g.day = 3; g.chapter = 1;
    queueCurated(g, 'c03');
    solveCase(g, 'c03', { investigate: true, pick: (_g, _d, sp) => ({ dest: 'renewal', specialId: sp.includes('rettifica') ? 'rettifica' : undefined }) });
    const d = g.decisions[0];
    expect(d.soulId).toBe('S-LORENZ'); expect(d.soulName).toBe('Lorenz Hable'); expect(d.caseId).toBe('c03');
    expect(d.day).toBe(3); expect(d.chapter).toBe(1); expect(d.destination).toBe('renewal');
    expect(d.special).toContain('Rettifica'); expect(d.motivation.length).toBeGreaterThan(5);
    expect(d.evidence.length).toBeGreaterThan(0); expect(d.irregularities.length).toBe(1);
    expect(d.consequences.length).toBeGreaterThan(0); expect(d.reincEffects.length).toBeGreaterThan(0);
    expect(d.truthFound).toBe(true); expect(d.reported).toBe(true);
    expect(g.flags['kessel_rettificato']).toBe(true);
    expect(g.closed['c03'].decisionId).toBe(d.id);
    expect(g.stats.irregolari).toBe(1);
  });

  it('omettere un\'irregolarità aumenta il sospetto invece di toccare la reputazione', () => {
    const run = (conceal: boolean) => {
      const g = fresh();
      queueCurated(g, 'c01');
      solveCase(g, 'c01', { investigate: false, pick: () => ({ dest: 'trial', conceal }) });
      return g;
    };
    const a = run(false), b = run(true);
    expect(a.stats.reputazione).toBeLessThan(50); expect(a.stats.sospetto).toBe(0);
    expect(b.stats.reputazione).toBe(50); expect(b.stats.sospetto).toBeGreaterThan(0);
    expect(b.decisions[0].concealed).toBe(true);
  });

  it('le sentenze speciali richiedono gli indizi previsti', () => {
    const g = fresh();
    queueCurated(g, 'c05'); openCase(g, 'c05');
    expect(availableSpecials(g, getCaseDef(g, 'c05'))).toHaveLength(0);
    g.flags['doc_nn_registro'] = true;
    investigate(g);
    expect(availableSpecials(g, getCaseDef(g, 'c05')).map((s) => s.id)).toContain('custodia');
    expect(availableMotivations(g, getCaseDef(g, 'c05'), 'renewal').some((m) => m.id === 'm_tea')).toBe(true);
  });
});

describe('reincarnazione ed ereditarietà', () => {
  it('la nuova incarnazione è una persona autonoma che eredita selettivamente', () => {
    for (let s = 1; s <= 60; s++) {
      const soul = generateSoul(s, 'P' + s);
      const prev = soul.incarnations[0];
      const { inc, residuo } = nextIncarnation(soul, s % 2 ? 'renewal' : 'trial');
      expect(inc.index).toBe(2);
      expect(inc.name).not.toBe(prev.name);
      expect(inc.inherited).toBeDefined();
      const h = inc.inherited!;
      expect(h.paure.length).toBeGreaterThan(0);
      expect(h.predisposizioni.length).toBeGreaterThan(0);
      // Mai una copia: i ricordi ereditati sono un sottoinsieme proprio di quelli della vita precedente.
      expect(h.memorie.length).toBeLessThan(prev.memories.length + 1);
      for (const m of h.memorie) expect(prev.memories).toContain(m);
      expect(residuo.length).toBeGreaterThan(0);
      expect(TRAIT_KEYS.some((k) => inc.traits[k] !== prev.traits[k])).toBe(true);
    }
  });

  it('La Prova eredita più memoria e conserva il conflitto; l\'Altra Forma quasi nulla', () => {
    const soul = generateSoul(77, 'P77');
    const prev = soul.incarnations[0];
    const t = inherit(prev, 'trial', new Rng(1)).inherited;
    const f = inherit(prev, 'otherForm', new Rng(1)).inherited;
    expect(t.conflitti.length).toBe(1);
    expect(t.memorie.length).toBeGreaterThanOrEqual(Math.min(2, prev.memories.length));
    expect(f.memorie).toHaveLength(0);
    expect(f.talenti).toHaveLength(0);
    const form = nextIncarnation(generateSoul(77, 'P77'), 'otherForm').inc;
    expect(form.form).toBeDefined();
  });

  it('la storia delle incarnazioni è persistente e l\'identità dell\'anima non cambia', () => {
    const g = newEndless('Ada', 5);
    startDay(g);
    const item = g.queue[0];
    const soulId = item.soulId;
    solveCase(g, item.caseId, { investigate: true, pick: () => ({ dest: 'renewal' }) });
    const soul = g.souls[soulId];
    expect(soul.id).toBe(soulId);
    expect(soul.incarnations).toHaveLength(2);
    expect(soul.incarnations[0].decisionId).toBe(g.decisions[0].id);
    expect(soul.status).toBe('reincarnata');
    expect(soul.returnDay).toBeGreaterThan(g.day);
    expect(currentIncarnation(soul).inherited).toBeDefined();
  });

  it('Ascensione e Sala d\'Attesa non producono una nuova vita; la revisione sì', () => {
    const g = newEndless('Ada', 6);
    startDay(g);
    const a = g.queue[0], b = g.queue[1];
    solveCase(g, a.caseId, { investigate: false, pick: () => ({ dest: 'ascension' }) });
    solveCase(g, b.caseId, { investigate: false, pick: () => ({ dest: 'waitingRoom' }) });
    expect(g.souls[a.soulId].status).toBe('ascesa');
    expect(g.souls[a.soulId].incarnations).toHaveLength(1);
    expect(g.souls[b.soulId].status).toBe('in_attesa');
    expect(reviseWaiting(g, b.soulId, 'renewal').ok).toBe(false); // serve l'Ufficio Revisioni
    g.departments.archive = 2; g.credits = 100;
    expect(reviseWaiting(g, b.soulId, 'renewal').ok).toBe(true);
    expect(g.souls[b.soulId].status).toBe('reincarnata');
    expect(g.souls[b.soulId].incarnations).toHaveLength(2);
    expect(g.decisions[1].revised?.to).toBe('renewal');
  });
});

describe('condizioni, conoscenza, collegamenti', () => {
  it('valuta condizioni composte e applica effetti con limiti', () => {
    const g = fresh();
    apply(g, { flags: ['a'], rel: { hoot: 99 }, stats: { morale: 500, reputazione: -500 }, credits: -1000, areas: ['archive'] });
    expect(g.rel.hoot).toBe(10); expect(g.stats.morale).toBe(100); expect(g.stats.reputazione).toBe(0); expect(g.credits).toBe(0);
    expect(check(g, { all: [{ flag: 'a' }, { area: 'archive' }, { not: { flag: 'b' } }] })).toBe(true);
    expect(check(g, { any: [{ flag: 'b' }, { relMin: ['hoot', 11] }] })).toBe(false);
    expect(check(g, { verdict: ['c01', 'any'] })).toBe(false);
  });

  it('i collegamenti si confermano solo tra voci note e con un nesso canonico', () => {
    const g = fresh();
    expect(tryLink(g, 'sym_spirale', 'k_ettore_madre').ok).toBe(false); // non ancora note
    grantKnowledge(g, 'sym_spirale'); grantKnowledge(g, 'k_ettore_madre'); grantKnowledge(g, 'k_due_tazze');
    expect(tryLink(g, 'sym_spirale', 'k_due_tazze').ok).toBe(false); // nessun nesso
    const r = tryLink(g, 'k_ettore_madre', 'sym_spirale');
    expect(r.ok).toBe(true);
    expect(g.knowledge['k_prelievo_straordinario']).toBeDefined();
    expect(tryLink(g, 'sym_spirale', 'k_ettore_madre').already).toBe(true);
    expect(g.linkAttempts).toBe(4);
  });

  it('i misteri si aprono con gli indizi ma non si risolvono da soli', () => {
    const g = fresh();
    expect(mysteryViews(g).every((m) => !m.open)).toBe(true);
    grantKnowledge(g, 'sym_spirale'); grantKnowledge(g, 'k_ettore_madre');
    const m2 = mysteryViews(g).find((m) => m.def.id === 'm2')!;
    expect(m2.open).toBe(true); expect(m2.solved).toBe(false); expect(m2.notes).toHaveLength(1);
  });

  it('un documento d\'ambiente può cambiare alla seconda consultazione', () => {
    const g = fresh();
    const a = readLore(g, 'regolamento')!;
    expect(a.changed).toBe(false);
    g.chapter = 2;
    const b = readLore(g, 'regolamento')!;
    expect(b.changed).toBe(true);
    expect(b.body.join(' ')).not.toBe(a.body.join(' '));
    expect(g.knowledge['k_regolamento_cambia']).toBeDefined();
  });
});

describe('dialoghi e routine', () => {
  it('una scena applica gli effetti e registra la conversazione', () => {
    const g = fresh();
    const st = startScene('pim_intro');
    let n = 0;
    while (sceneNext(g, st).kind !== 'end') n++;
    expect(n).toBeGreaterThan(3);
    expect(g.flags['met_pim']).toBe(true);
    expect(g.convSeen['pim_intro']).toBe(1);
    expect(npcTopics(g, 'pim').some((c) => c.id === 'pim_intro')).toBe(false);
  });

  it('le scelte ramificano e producono conseguenze diverse', () => {
    const play = (choice: number) => {
      const g = fresh();
      grantKnowledge(g, 'k_pim_senza_fascicolo');
      const st = startScene('pim_registro');
      let it = sceneNext(g, st);
      while (it.kind !== 'end') it = it.kind === 'choice' ? sceneNext(g, st, choice) : sceneNext(g, st);
      return g;
    };
    expect(play(0).rel.pim).toBe(2); expect(play(0).flags['pim_promessa']).toBe(true);
    expect(play(1).rel.pim).toBe(-2);
  });

  it('le routine cambiano con la fase del turno e con gli eventi', () => {
    const g = fresh();
    g.day = 5; g.phase = 0;
    const at = (id: string) => npcPlans(g).find((p) => p.id === id);
    expect(at('bones')!.spot).toBe('bones_desk');
    g.phase = 2;
    expect(at('bones')!.spot).toBe('bones_samovar'); expect(at('bones')!.state).toBe('Resting');
    expect(at('quill')).toBeUndefined();
    g.day = 10;
    expect(at('quill')).toBeDefined();
    g.npc['hoot'] = 'scomparso';
    expect(at('hoot')).toBeUndefined();
  });
});

describe('gestione dell\'ufficio', () => {
  it('assunzione, ruoli, potenziamenti e strumenti consumano crediti e hanno effetto', () => {
    const g = fresh();
    g.credits = 500;
    refreshCandidates(g);
    expect(g.candidates.length).toBe(3);
    const c = g.candidates[0];
    expect(hire(g, c.id, 'scrivano').ok).toBe(true);
    expect(g.staff).toHaveLength(1);
    expect(g.credits).toBe(500 - c.cost);
    expect(upgradeDept(g, 'reception').ok).toBe(true);
    expect(g.departments.reception).toBe(1);
    expect(upgradeDept(g, 'restricted').ok).toBe(false); // reparto non accessibile
    expect(buyTool(g, 'lente').ok).toBe(true);
    expect(buyTool(g, 'lente').ok).toBe(false);
    g.stats.pendenti = 5;
    const before = g.stats.pendenti;
    const r = dayEndOffice(g);
    expect(r.autoProcessed).toBeGreaterThan(0);
    expect(g.stats.pendenti).toBeLessThanOrEqual(before + 3);
  });

  it('le anime in Sala d\'Attesa possono essere assunte', () => {
    const g = newEndless('Ada', 9);
    startDay(g);
    const item = g.queue[0];
    solveCase(g, item.caseId, { investigate: false, pick: () => ({ dest: 'waitingRoom' }) });
    refreshCandidates(g);
    const cand = g.candidates.find((c) => c.soulId === item.soulId)!;
    expect(cand).toBeDefined();
    g.credits = 200;
    hire(g, cand.id, cand.best);
    expect(g.souls[item.soulId].status).toBe('assunta');
  });

  it('rispettare, ignorare o falsificare una direttiva ha esiti diversi', () => {
    const run = (stance: 'rispetta' | 'ignora' | 'manipola', processed: number) => {
      const g = fresh();
      g.day = 2; g.credits = 100;
      issueDirective(g, 'd_quota', 2);
      setStance(g, 'd_quota', stance);
      g.vars['processed_today'] = processed;
      const met = directiveMet(g, 'd_quota');
      dayEndOffice(g);
      return { g, met };
    };
    const ok = run('rispetta', 3), viol = run('rispetta', 0), ign = run('ignora', 0), man = run('manipola', 0);
    expect(ok.met).toBe(true); expect(viol.met).toBe(false);
    expect(ok.g.stats.reputazione).toBeGreaterThan(viol.g.stats.reputazione);
    expect(ign.g.vars['defiance']).toBe(1);
    expect(ign.g.stats.reputazione).toBeGreaterThan(viol.g.stats.reputazione);
    expect(man.g.vars['manip']).toBe(1);
    expect(['falsificata', 'falso scoperto']).toContain(man.g.directives[0].outcome);
  });

  it('le anime sospese troppo a lungo sbiadiscono', () => {
    const g = newEndless('Ada', 3);
    startDay(g);
    const item = g.queue[0];
    solveCase(g, item.caseId, { investigate: false, pick: () => ({ dest: 'waitingRoom' }) });
    g.day += 7;
    dayEndOffice(g);
    expect(g.souls[item.soulId].status).toBe('sbiadita');
  });

  it('i casi procedurali accodati sono deterministici rispetto al seed', () => {
    const a = fresh(), b = fresh();
    queueNewProcedural(a, 3); queueNewProcedural(b, 3);
    expect(a.queue.map((q) => q.label)).toEqual(b.queue.map((q) => q.label));
  });
});
