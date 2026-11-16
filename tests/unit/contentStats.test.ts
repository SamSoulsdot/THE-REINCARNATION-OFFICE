// Conta i contenuti effettivamente presenti (usato da `npm run content:stats` e dal resoconto).
import { it } from 'vitest';
import { CONVOS, CURATED, CURATED_IDS, DAYS, EVENTS, KNOWLEDGE, LINKS, LORE, MYSTERIES, NPCS, TEMPLATES, OBJ_LABEL, ENDINGS } from '../../src/content';
import { newCampaign } from '../../src/engine/sim';
import { OBJECTS } from '../../src/world/map';

it('statistiche dei contenuti', () => {
  const g = newCampaign('Ada Loris', 1);
  g.day = 9;
  const defs = CURATED_IDS.map((id) => { const e = CURATED[id]; return typeof e === 'function' ? e(g) : e; });
  const words = (t: string) => t.split(/\s+/).filter(Boolean).length;
  let w = 0;
  for (const d of defs) {
    w += words(d.arrival + d.registration + d.summary);
    for (const doc of d.docs) for (const p of doc.body) w += words(typeof p === 'string' ? p : p.t);
    for (const t of d.topics) w += words(t.q + ' ' + t.a);
    for (const o of Object.values(d.outcomes)) w += words(o.text + o.consequences.join(' '));
    for (const s of d.specials ?? []) w += words(s.outcome.text);
  }
  let cw = 0;
  const walk = (ls: any[]) => { for (const l of ls) { if (l.t) cw += words(l.t); if (l.then) walk(l.then); if (l.else) walk(l.else); if (l.choice) for (const o of l.choice) { cw += words(o.t); if (o.lines) walk(o.lines); } } };
  for (const c of CONVOS) walk(c.lines);
  let tw = 0;
  for (const t of TEMPLATES) tw += words(t.official.text + t.witness + t.claim + t.variants.map((v) => v.truth + v.confess + v.why).join(' '));
  const stats = {
    casiCurati: CURATED_IDS.length,
    variantiCasoRitorno: 3,
    documentiCasiCurati: defs.reduce((a, d) => a + d.docs.length, 0),
    domandeColloquio: defs.reduce((a, d) => a + d.topics.length, 0),
    sentenzeSpeciali: defs.reduce((a, d) => a + (d.specials?.length ?? 0), 0),
    documentiAmbiente: LORE.length,
    templateProcedurali: TEMPLATES.length,
    veritaCanonicheProcedurali: TEMPLATES.length * 2,
    patternEventi: EVENTS.length,
    personaggi: NPCS.length,
    conversazioni: CONVOS.length,
    oggettiInterattivi: OBJECTS.filter((o) => o.interact).length + Object.keys(OBJ_LABEL).filter((k) => k.startsWith('porta') || k === 'montacarichi' || k === 'portone' || k === 'cancello_riservato').length,
    vociDiario: Object.keys(KNOWLEDGE).length,
    collegamenti: LINKS.length,
    misteri: MYSTERIES.length,
    turniCampagna: DAYS.length,
    finali: Object.keys(ENDINGS).length,
    paroleCasiCurati: w,
    paroleDialoghiMondo: cw,
    paroleTemplate: tw,
  };
  console.log(JSON.stringify(stats, null, 2));
});
