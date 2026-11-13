import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import type { GameState } from '../../src/engine/types';
import { SCHEMA_VERSION } from '../../src/engine/types';
import { newCampaign, newEndless } from '../../src/engine/sim';
import { goalViews, endlessSummary } from '../../src/engine/endless';
import { startDay } from '../../src/engine/campaign';
import { playDay, solveCase, type BotOpts } from '../helpers/bot';
import { checksum, parseSave, serialize, validateSave } from '../../src/persistence/save';
import { AUTO_SLOT, autosave, deleteSave, exportSave, getDB, importSave, listSaves, readSave, resetDB, unlockEnding, writeSave, getMeta } from '../../src/persistence/db';
import { DOORS, OBJECTS, ROOMS, SPOTS, canStep, findPath, solidSet, tileAt } from '../../src/world/map';
import { getCaseDef } from '../../src/engine/cases';

const bot: BotOpts = { investigate: true, pick: (g, def) => ({ dest: (['renewal', 'trial', 'otherForm', 'renewal', 'waitingRoom', 'ascension'] as const)[g.decisions.length % 6] ?? def.recommended }) };

function playEndless(days: number, seed = 31): GameState {
  const g = newEndless('Ada Loris', seed);
  for (let i = 0; i < days; i++) playDay(g, bot);
  return g;
}

describe('modalità Endless', () => {
  it('è giocabile per molti turni, con casi sempre nuovi', () => {
    const g = playEndless(20);
    expect(g.day).toBe(21);
    expect(g.decisions.length).toBeGreaterThanOrEqual(60);
    expect(g.endless!.totals.turni).toBe(20);
    expect(new Set(g.decisions.map((d) => d.caseTitle)).size).toBeGreaterThan(40);
  });

  it('le anime tornano: stesse identità, nuove incarnazioni, vita precedente a fascicolo', () => {
    const g = playEndless(20);
    const returns = g.decisions.filter((d) => /:([2-9])$/.test(d.caseId));
    expect(returns.length).toBeGreaterThan(5);
    const multi = Object.values(g.souls).filter((s) => s.incarnations.length >= 3);
    expect(multi.length).toBeGreaterThan(0);
    const s = multi[0];
    expect(new Set(s.incarnations.map((i) => i.name)).size).toBe(s.incarnations.length);
    expect(s.incarnations[1].inherited).toBeDefined();
    expect(g.endless!.totals.ritorni).toBeGreaterThan(0);
  });

  it('un caso di ritorno cita il giudizio precedente dello stesso scrivano', () => {
    const g = newEndless('Ada', 4);
    startDay(g);
    const first = g.queue[0];
    solveCase(g, first.caseId, { investigate: true, pick: () => ({ dest: 'trial' }) });
    const soul = g.souls[first.soulId];
    g.day = soul.returnDay!;
    for (const q of g.queue) q.state = 'chiuso';
    startDay(g);
    const back = g.queue.find((q) => q.soulId === first.soulId)!;
    expect(back.kind).toBe('ritorno');
    const def = getCaseDef(g, back.caseId);
    expect(def.type).toBe('ritorno');
    expect(def.docs.some((d) => d.id === 'indice')).toBe(true);
    expect(def.pastLives!.join(' ')).toContain('La Prova');
    expect(def.topics.some((t) => t.id === 'frammento')).toBe(true);
    // la vita nata dalla Prova porta il segno del conflitto precedente
    expect(soul.incarnations[1].events.some((e) => e.tag === 'prova')).toBe(true);
  });

  it('eventi periodici, direttive, obiettivi autonomi e statistiche evolvono', () => {
    const g = playEndless(20);
    expect(g.endless!.eventLog.length).toBe(6);
    expect(g.directives.length).toBeGreaterThanOrEqual(4);
    expect(g.endless!.goalsDone).toBeGreaterThan(0);
    expect(goalViews(g)).toHaveLength(3);
    const sum = Object.fromEntries(endlessSummary(g).map((r) => [r.label, r.value]));
    expect(Number(sum['Pratiche evase'])).toBe(g.decisions.length);
    expect(Number(sum['Anime con più di una vita'])).toBeGreaterThan(5);
  });

  it('la complessità cresce: più pratiche per turno e anime collegate', () => {
    const g = playEndless(24, 8);
    const perDay = (d: number) => g.decisions.filter((x) => x.day === d).length;
    expect(perDay(22)).toBeGreaterThan(perDay(1));
    expect(Object.values(g.souls).some((s) => s.incarnations[0].linked)).toBe(true);
  });

  it('è deterministica rispetto al seed', () => {
    expect(JSON.stringify(playEndless(6, 5))).toBe(JSON.stringify(playEndless(6, 5)));
    expect(JSON.stringify(playEndless(3, 5))).not.toBe(JSON.stringify(playEndless(3, 6)));
  });
});

describe('salvataggi: schema, validazione, persistenza reale', () => {
  beforeEach(async () => { await resetDB(); });

  const midGame = (): GameState => {
    const g = newCampaign('Ada Loris', 99);
    const o: BotOpts = { investigate: true, pick: (_g, def) => ({ dest: def.recommended }) };
    playDay(g, o); playDay(g, o); playDay(g, o);
    startDay(g);
    return g;
  };

  it('serializzazione e ritorno conservano l\'intero stato', () => {
    const g = midGame();
    const file = serialize(g, 'slot1');
    const v = parseSave(JSON.stringify(file));
    expect(v.ok).toBe(true);
    if (v.ok) {
      expect(v.save.state).toEqual(JSON.parse(JSON.stringify(g)));
      expect(v.save.meta.day).toBe(4);
      expect(v.save.schema).toBe(SCHEMA_VERSION);
    }
  });

  it('una partita ricaricata prosegue esattamente come l\'originale', async () => {
    const g = midGame();
    await writeSave('slot1', g);
    const loaded = await readSave('slot1');
    expect(loaded.status).toBe('ok');
    if (loaded.status !== 'ok') return;
    const o: BotOpts = { investigate: true, pick: (_g, def) => ({ dest: def.recommended }) };
    const a = g, b = loaded.state;
    for (const st of [a, b]) { st.dayStarted = false; }
    playDay(a, o); playDay(b, o);
    expect(JSON.stringify(b)).toBe(JSON.stringify(a));
    expect(b.decisions.length).toBeGreaterThan(8);
    expect(Object.keys(b.knowledge).length).toBeGreaterThan(5);
  });

  it('rifiuta JSON non valido, formati estranei, checksum errati e stati incoerenti', () => {
    const file = serialize(midGame(), 'slot1');
    expect(parseSave('non è json').ok).toBe(false);
    expect(parseSave('{"ciao":1}').ok).toBe(false);
    expect(validateSave({ ...file, format: 'altro' }).ok).toBe(false);
    const tampered = JSON.parse(JSON.stringify(file));
    tampered.state.credits = 999999;
    const t = validateSave(tampered);
    expect(t.ok).toBe(false);
    if (!t.ok) expect(t.error).toContain('danneggiato');
    const broken = JSON.parse(JSON.stringify(file));
    delete broken.state.souls;
    broken.checksum = checksum(JSON.stringify(broken.state));
    expect(validateSave(broken).ok).toBe(false);
    const orphan = JSON.parse(JSON.stringify(file));
    orphan.state.decisions[0].soulId = 'INESISTENTE';
    orphan.checksum = checksum(JSON.stringify(orphan.state));
    expect(validateSave(orphan).ok).toBe(false);
    expect(validateSave({ ...file, schema: SCHEMA_VERSION + 1 }).ok).toBe(false);
  });

  it('migra i salvataggi di schema precedente', () => {
    const file = JSON.parse(JSON.stringify(serialize(midGame(), 'slot1')));
    file.schema = 0;
    file.state.schema = 0;
    delete file.state.docsSeen;
    delete file.state.linkAttempts;
    file.checksum = checksum(JSON.stringify(file.state));
    const v = validateSave(file);
    expect(v.ok).toBe(true);
    if (v.ok) { expect(v.save.schema).toBe(SCHEMA_VERSION); expect(v.save.state.docsSeen).toEqual({}); expect(v.save.state.linkAttempts).toBe(0); }
  });

  it('slot manuali: scrittura, elenco, eliminazione', async () => {
    const g = midGame();
    await writeSave('slot2', g);
    let list = await listSaves();
    expect(list.find((s) => s.slot === 'slot2')!.status).toBe('ok');
    expect(list.find((s) => s.slot === 'slot1')!.status).toBe('empty');
    expect(list.find((s) => s.slot === 'slot2')!.meta!.playerName).toBe('Ada Loris');
    await deleteSave('slot2');
    list = await listSaves();
    expect(list.find((s) => s.slot === 'slot2')!.status).toBe('empty');
    expect((await readSave('slot2')).status).toBe('empty');
  });

  it('autosave con copia di riserva: un autosave corrotto viene recuperato', async () => {
    const g = midGame();
    await autosave(g);
    g.credits += 7;
    await autosave(g);
    const rec = (await getDB().saves.get(AUTO_SLOT))!;
    await getDB().saves.put({ ...rec, json: rec.json.slice(0, rec.json.length / 2) });
    const list = await listSaves();
    expect(list.find((s) => s.slot === AUTO_SLOT)!.status).toBe('corrupt');
    const r = await readSave(AUTO_SLOT);
    expect(r.status).toBe('ok');
    if (r.status === 'ok') { expect(r.recovered).toBe(true); expect(r.state.credits).toBe(g.credits - 7); }
  });

  it('uno slot manuale corrotto è segnalato, non caricato, ed esportabile', async () => {
    await writeSave('slot3', midGame());
    const rec = (await getDB().saves.get('slot3'))!;
    await getDB().saves.put({ ...rec, json: '{"format":"reincarnation-office-save","schema":1,' });
    const r = await readSave('slot3');
    expect(r.status).toBe('corrupt');
    expect(await exportSave('slot3')).toContain('reincarnation-office-save');
  });

  it('esportazione e importazione JSON tra slot', async () => {
    const g = midGame();
    await writeSave('slot1', g);
    const json = (await exportSave('slot1'))!;
    const imp = await importSave(json, 'slot4');
    expect(imp.ok).toBe(true);
    const r = await readSave('slot4');
    expect(r.status).toBe('ok');
    if (r.status === 'ok') expect(r.state).toEqual(JSON.parse(JSON.stringify(g)));
    expect((await importSave('{"x":1}', 'slot4')).ok).toBe(false);
    // un'importazione fallita non sovrascrive lo slot
    expect((await readSave('slot4')).status).toBe('ok');
  });

  it('salva e ricarica anche la modalità Endless e i finali sbloccati', async () => {
    const g = playEndless(4);
    await autosave(g);
    const r = await readSave('endless');
    expect(r.status).toBe('ok');
    if (r.status === 'ok') { expect(r.state.endless!.totals.turni).toBe(4); expect(r.state.mode).toBe('endless'); }
    expect((await readSave(AUTO_SLOT)).status).toBe('empty');
    await unlockEnding('cycle'); await unlockEnding('cycle'); await unlockEnding('rebel');
    expect(await getMeta<string[]>('endings', [])).toEqual(['cycle', 'rebel']);
  });
});

describe('mappa: percorribilità', () => {
  const all = ['reception', 'judgment', 'employee', 'interview', 'archive', 'management', 'restricted', 'director'];
  const ctx = (areas: string[]) => ({ areas, solids: solidSet(() => true) });
  const start = SPOTS.player_start;

  it('ogni stanza è raggiungibile quando la sua area è sbloccata', () => {
    for (const r of ROOMS) {
      const cx = Math.round((r.x0 + r.x1) / 2), cy = Math.round((r.y0 + r.y1) / 2);
      let ok = false;
      for (let dy = -2; dy <= 2 && !ok; dy++) for (let dx = -2; dx <= 2 && !ok; dx++) if (findPath(start.x, start.y, cx + dx, cy + dy, ctx(all)) !== null) ok = true;
      expect(ok, r.id).toBe(true);
    }
  });

  it('le aree chiuse non sono attraversabili', () => {
    const base = ['reception', 'judgment', 'employee'];
    expect(findPath(start.x, start.y, 28, 26, ctx(base))).toBeNull(); // Archivio
    expect(findPath(start.x, start.y, 17, 3, ctx(base))).toBeNull(); // Direzione
    expect(findPath(start.x, start.y, 38, 29, ctx([...base, 'archive']))).toBeNull(); // Riservato
    expect(findPath(start.x, start.y, 28, 26, ctx([...base, 'archive']))).not.toBeNull();
    expect(findPath(start.x, start.y, 25, 4, ctx(all.filter((a) => a !== 'director')))).toBeNull();
  });

  it('ogni oggetto interattivo e ogni porta esaminabile ha una tessera d\'accesso raggiungibile', () => {
    const c = ctx(all);
    for (const o of OBJECTS.filter((x) => x.interact)) expect(findPath(start.x, start.y, o.x, o.y, c), o.id).not.toBeNull();
    for (const d of DOORS.filter((x) => x.interact)) expect(findPath(start.x, start.y, d.x, d.y, c), d.id).not.toBeNull();
  });

  it('i punti di sosta dei personaggi sono liberi e raggiungibili', () => {
    const c = ctx(all);
    for (const [id, s] of Object.entries(SPOTS)) {
      expect(tileAt(s.x, s.y), id).not.toBeNull();
      expect(c.solids.has(s.x + ',' + s.y), id + ' su un oggetto').toBe(false);
      if (id !== 'player_start') expect(findPath(start.x, start.y, s.x, s.y, c), id).not.toBeNull();
    }
  });

  it('i dislivelli si superano solo dalle scale', () => {
    const c = ctx(all);
    expect(canStep(22, 21, 22, 22, c)).toBe(true); // scala dell'Archivio
    expect(canStep(26, 21, 26, 22, c)).toBe(false); // balaustra sopra l'Archivio
    expect(canStep(16, 9, 16, 8, c)).toBe(true); // scala della Direzione
    expect(canStep(19, 25, 20, 25, c)).toBe(false); // Reception → fossa dell'Archivio
  });
});
