import { describe, expect, it } from 'vitest';
import { CONVOS, CURATED, CURATED_IDS, DAYS, DIRECTIVES, ENDINGS, EVENTS, KNOWLEDGE, LINKS, LORE, MYSTERIES, NPCS, OBJ_LABEL, ROOM_EVENTS, SPEAKERS, TEMPLATES, WORLD_PUZZLES } from '../../src/content';
import { DESTINATIONS, type CaseDef, type Cond, type Effects, type GameState, type Line } from '../../src/engine/types';
import { newCampaign } from '../../src/engine/sim';
import { DOORS, OBJECTS, SPOTS } from '../../src/world/map';
import { caesar } from '../../src/engine/cases';

function variants(id: string): CaseDef[] {
  const e = CURATED[id];
  if (typeof e !== 'function') return [e];
  const mk = (flags: string[], know: string[] = []) => {
    const g = newCampaign('Ada Loris', 7);
    g.day = 9;
    flags.forEach((f) => (g.flags[f] = true));
    know.forEach((k) => (g.knowledge[k] = { day: 1, isNew: false }));
    return e(g as GameState);
  };
  return [mk([]), mk(['lorenz_prova', 'vos_segue_lorenz', 'kessel_rettificato']), mk(['lorenz_forma']), mk(['lorenz_asceso']), mk(['lorenz_attesa']), mk(['ettore_asceso', 'nn_custodia'], ['k_tea'])];
}

const allCases = CURATED_IDS.flatMap((id) => variants(id));

function knowIds(fx?: Effects): string[] {
  return fx?.know ?? [];
}

describe('casi curati: coerenza interna', () => {
  it('sono almeno 12 e hanno tutte e cinque le destinazioni', () => {
    expect(CURATED_IDS.length).toBeGreaterThanOrEqual(12);
    for (const c of allCases) for (const d of DESTINATIONS) expect(c.outcomes[d], `${c.id} ${d}`).toBeDefined();
  });

  it('ogni indizio citato esiste, e ogni indizio definito è ottenibile', () => {
    for (const c of allCases) {
      const ids = new Set(c.clues.map((x) => x.id));
      const sources = new Set<string>();
      for (const d of c.docs) for (const p of d.body) if (typeof p !== 'string') { expect(ids.has(p.clue), `${c.id}: doc ${d.id} → ${p.clue}`).toBe(true); sources.add(p.clue); }
      for (const t of c.topics) {
        for (const k of [...(t.needClues ?? []), ...(t.gives ?? [])]) expect(ids.has(k), `${c.id}: topic ${t.id} → ${k}`).toBe(true);
        (t.gives ?? []).forEach((k) => sources.add(k));
        if (t.needContra) expect(c.contradictions.some((x) => x.id === t.needContra), `${c.id}: ${t.needContra}`).toBe(true);
      }
      for (const x of c.contradictions) { expect(ids.has(x.a) && ids.has(x.b), `${c.id}: contraddizione ${x.id}`).toBe(true); }
      for (const m of c.motivations) for (const k of m.needClues ?? []) expect(ids.has(k), `${c.id}: motivazione ${m.id}`).toBe(true);
      for (const s of c.specials ?? []) for (const k of s.needClues ?? []) expect(ids.has(k), `${c.id}: speciale ${s.id}`).toBe(true);
      for (const p of c.puzzles ?? []) for (const k of [...(p.needClues ?? []), ...(p.gives ?? [])]) { expect(ids.has(k), `${c.id}: enigma ${p.id}`).toBe(true); }
      (c.puzzles ?? []).forEach((p) => (p.gives ?? []).forEach((k) => sources.add(k)));
      for (const k of ids) expect(sources.has(k), `${c.id}: indizio irraggiungibile «${k}»`).toBe(true);
      if (c.truthClue) expect(ids.has(c.truthClue), `${c.id}: truthClue`).toBe(true);
    }
  });

  it('ogni documento inattendibile dichiara la propria spiegazione interna', () => {
    for (const c of allCases) for (const d of c.docs) {
      expect(d.why.length, `${c.id}/${d.id}`).toBeGreaterThan(20);
      expect(d.body.length).toBeGreaterThan(0);
    }
  });

  it('ogni caso ha una verità canonica e casi distinti hanno titoli distinti', () => {
    for (const c of allCases) expect(c.truth.length, c.id).toBeGreaterThanOrEqual(3);
    const titles = new Set(CURATED_IDS.map((id) => variants(id)[0].title));
    expect(titles.size).toBe(CURATED_IDS.length);
  });

  it('le conoscenze concesse dai casi esistono nel diario', () => {
    for (const c of allCases) {
      const ks = [...c.clues.flatMap((x) => x.know ?? []), ...c.topics.flatMap((t) => knowIds(t.fx)), ...DESTINATIONS.flatMap((d) => knowIds(c.outcomes[d].fx)), ...(c.specials ?? []).flatMap((s) => knowIds(s.outcome.fx))];
      for (const k of ks) expect(KNOWLEDGE[k], `${c.id}: conoscenza «${k}»`).toBeDefined();
    }
  });

  it('il biglietto cifrato del fascicolo 7 si decifra con chiave 7', () => {
    expect(caesar('UVU ZJLNSPLYL KP KPTLUAPJHYL', 7)).toBe('NON SCEGLIERE DI DIMENTICARE');
  });
});

function walkLines(lines: Line[], visit: (l: Line) => void): void {
  for (const l of lines) {
    visit(l);
    if ('if' in l) { walkLines(l.then, visit); if (l.else) walkLines(l.else, visit); }
    if ('choice' in l) for (const o of l.choice) if (o.lines) walkLines(o.lines, visit);
  }
}
function condKnows(c: Cond | undefined, out: string[]): void {
  if (!c) return;
  if (c.know) out.push(c.know);
  c.all?.forEach((x) => condKnows(x, out));
  c.any?.forEach((x) => condKnows(x, out));
  if (c.not) condKnows(c.not, out);
}

describe('conoscenza, collegamenti, misteri', () => {
  it('ogni collegamento unisce due voci esistenti e collegabili', () => {
    for (const l of LINKS) {
      expect(KNOWLEDGE[l.a], l.id).toBeDefined();
      expect(KNOWLEDGE[l.b], l.id).toBeDefined();
      for (const k of l.fx?.know ?? []) expect(KNOWLEDGE[k], l.id + ' → ' + k).toBeDefined();
    }
  });
  it('ci sono almeno 5 misteri e le loro condizioni citano voci esistenti', () => {
    expect(MYSTERIES.length).toBeGreaterThanOrEqual(5);
    for (const m of MYSTERIES) {
      const ks: string[] = [];
      condKnows(m.intro, ks); condKnows(m.solved, ks); m.stages.forEach((s) => condKnows(s.cond, ks));
      for (const k of ks) expect(KNOWLEDGE[k], m.id + ' → ' + k).toBeDefined();
      expect(m.solution.length).toBeGreaterThan(30);
    }
  });
  it('ogni voce del diario ha titolo e testo', () => {
    for (const k of Object.values(KNOWLEDGE)) { expect(k.title.length, k.id).toBeGreaterThan(1); expect(k.text.length, k.id).toBeGreaterThan(10); }
  });
});

describe('mondo: personaggi, oggetti, dialoghi', () => {
  it('ci sono almeno 8 personaggi ricorrenti con routine valide', () => {
    expect(NPCS.filter((n) => !n.id.startsWith('scrivano')).length).toBeGreaterThanOrEqual(8);
    for (const n of NPCS) for (const r of n.routine) expect(SPOTS[r.spot], `${n.id} → ${r.spot}`).toBeDefined();
  });
  it('ogni conversazione cita parlanti, documenti e conoscenze esistenti', () => {
    const lore = new Set(LORE.map((d) => d.id));
    const ids = new Set(CONVOS.map((c) => c.id));
    expect(ids.size).toBe(CONVOS.length);
    for (const c of CONVOS) {
      if (c.npc) expect(NPCS.some((n) => n.id === c.npc), c.id).toBe(true);
      if (c.obj) expect(OBJECTS.some((o) => o.id === c.obj) || DOORS.some((d) => d.id === c.obj), `${c.id} → ${c.obj}`).toBe(true);
      walkLines(c.lines, (l) => {
        if ('s' in l) expect(l.s in SPEAKERS, `${c.id}: parlante ${l.s}`).toBe(true);
        if ('doc' in l) expect(lore.has(l.doc), `${c.id}: doc ${l.doc}`).toBe(true);
        if ('fx' in l) for (const k of l.fx.know ?? []) expect(KNOWLEDGE[k], `${c.id}: ${k}`).toBeDefined();
      });
    }
    for (const e of ROOM_EVENTS) expect(ids.has(e.convo), e.convo).toBe(true);
  });
  it('ogni oggetto interattivo ha un\'etichetta e almeno una conversazione senza condizioni di ripiego', () => {
    const things = [...OBJECTS.filter((o) => o.interact).map((o) => o.id), ...DOORS.filter((d) => d.interact).map((d) => d.id)];
    for (const id of things) {
      expect(OBJ_LABEL[id], `etichetta ${id}`).toBeDefined();
      const cs = CONVOS.filter((c) => c.obj === id);
      expect(cs.length, `conversazione ${id}`).toBeGreaterThan(0);
      expect(cs.some((c) => !c.cond && !c.once), `ripiego ${id}`).toBe(true);
    }
  });
  it('documenti d\'ambiente ed enigmi sono ben formati', () => {
    for (const d of LORE) { expect(d.body.length).toBeGreaterThan(0); for (const k of [...(d.fx?.know ?? []), ...(d.altFx?.know ?? [])]) expect(KNOWLEDGE[k], d.id).toBeDefined(); }
    for (const p of WORLD_PUZZLES) expect(p.solution.length).toBeGreaterThan(0);
  });
});

describe('obiettivi quantitativi dei contenuti', () => {
  it('template procedurali ≥ 35, ciascuno con due verità canoniche distinte', () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(35);
    expect(new Set(TEMPLATES.map((t) => t.id)).size).toBe(TEMPLATES.length);
    for (const t of TEMPLATES) {
      expect(t.variants.length).toBe(2);
      expect(t.variants[0].truth).not.toBe(t.variants[1].truth);
      expect(t.variants[0].flawed, t.id + ': le due varianti devono smentire documenti diversi').not.toBe(t.variants[1].flawed);
    }
  });
  it('pattern di eventi ≥ 40', () => {
    expect(EVENTS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
  });
  it('documenti e testimonianze ≥ 50 (casi curati + ambiente)', () => {
    const docs = CURATED_IDS.flatMap((id) => variants(id)[0].docs).length + LORE.length;
    expect(docs).toBeGreaterThanOrEqual(50);
  });
  it('campagna: 14 turni in 5 capitoli, 5 finali, direttive valide', () => {
    expect(DAYS.length).toBe(14);
    expect(new Set(DAYS.map((d) => d.chapter)).size).toBe(5);
    expect(Object.keys(ENDINGS).sort()).toEqual(['cycle', 'newbeginning', 'perfect', 'rebel', 'reformer']);
    for (const d of DAYS) { for (const c of d.cases) expect(CURATED[c], c).toBeDefined(); if (d.directive) expect(DIRECTIVES.some((x) => x.id === d.directive)).toBe(true); }
  });
});
