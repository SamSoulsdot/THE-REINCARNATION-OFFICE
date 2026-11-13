// Narrative Engine — generazione procedurale deterministica.
// Pipeline: personaggio → personalità → relazioni → eventi → conflitti → VERITÀ CANONICA
// → ricordi → documenti → testimonianze → dialoghi → conseguenze.
// Documenti e risposte sono DERIVATI dalla variante di verità: nessun testo è generato a prescindere.
import type { CaseDef, Decision, Destination, DocDef, GameState, Incarnation, Inheritance, LifeEvent, OutcomeDef, Soul, TopicDef, Traits } from './types';
import { DESTINATIONS, TRAIT_KEYS } from './types';
import { Rng, mixSeed } from './rng';
import { DEST_LABEL } from './text';
import {
  ERAS, EVENTS, FEAR_BY_CAUSE, FEAR_DEFAULT, NAMES_F, NAMES_M, OTHER_FORMS, PREDISPOSITION, SURNAMES, TEMPLATES, TOWNS, VERDICT_REACTIONS,
} from '../content';
import type { CaseTemplate } from '../content/it/templates';

export function templateById(id: string): CaseTemplate {
  const t = TEMPLATES.find((x) => x.id === id);
  if (!t) throw new Error('Template sconosciuto: ' + id);
  return t;
}

function fill(text: string, v: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (m, k) => (k in v ? v[k] : m));
}

function clampTrait(n: number): number {
  return Math.max(0, Math.min(10, Math.round(n)));
}

function fearForCause(cause: string): string {
  const c = cause.toLowerCase();
  for (const [k, f] of FEAR_BY_CAUSE) if (c.includes(k)) return f;
  return FEAR_DEFAULT;
}

export interface LifeOpts {
  tplId?: string;
  variant?: number;
  prev?: Incarnation;
  inherited?: Inheritance;
  trial?: boolean;
  linked?: string;
}

/** Costruisce una vita completa e coerente con un template e una variante di verità. */
export function buildLife(seed: number, opts: LifeOpts = {}): Omit<Incarnation, 'index'> {
  const rng = new Rng(seed);
  const tpl = opts.tplId ? templateById(opts.tplId) : rng.pick(TEMPLATES);
  const variant = opts.variant ?? rng.int(0, 1);
  const gender: 'm' | 'f' = rng.chance(0.5) ? 'm' : 'f';
  const first = rng.pick(gender === 'm' ? NAMES_M : NAMES_F);
  const last = rng.pick(SURNAMES);
  const origin = rng.pick(TOWNS);
  const era = rng.pick(ERAS);
  const occParts = tpl.occ.split('/');
  const occupation = gender === 'm' ? occParts[0] : occParts[1] ?? occParts[0];
  const age = rng.int(tpl.age[0], tpl.age[1]);
  const cause = rng.pick(tpl.causes);
  const altroGender = rng.chance(0.5) ? 'm' : 'f';
  const altro = rng.pick(altroGender === 'm' ? NAMES_M : NAMES_F) + ' ' + rng.pick(SURNAMES.filter((s) => s !== last));
  const teste = rng.pick(rng.chance(0.5) ? NAMES_M : NAMES_F) + ' ' + rng.pick(SURNAMES.filter((s) => s !== last));
  const v = { nome: first, cognome: last, luogo: origin, altro, teste, o: gender === 'm' ? 'o' : 'a' };

  // Eventi di vita: compatibili per età e (preferibilmente) per tag del template.
  const pool = EVENTS.filter((e) => e.age[0] <= age - 1);
  const preferred = rng.shuffle(pool.filter((e) => e.tags.some((t) => tpl.tags.includes(t))));
  const others = rng.shuffle(pool.filter((e) => !preferred.includes(e)));
  const chosen = [...preferred.slice(0, 2), ...others.slice(0, 2)].slice(0, age < 30 ? 2 : 3);
  const traits: Traits = { empatia: 5, altruismo: 5, onesta: 5, coraggio: 5, responsabilita: 5, ambizione: 5 };
  for (const k of TRAIT_KEYS) {
    const base = opts.prev ? opts.prev.traits[k] * 0.35 + rng.int(0, 10) * 0.65 : rng.int(2, 8);
    traits[k] = clampTrait(base);
  }
  const events: LifeEvent[] = [];
  const memories: string[] = [tpl.memory];
  const conflicts: string[] = [tpl.conflict];
  for (const e of chosen) {
    const a = Math.min(age - 1, rng.int(e.age[0], Math.min(e.age[1], age - 1)));
    events.push({ age: a, text: fill(e.text, v), tag: e.id });
    if (e.mem) memories.push(e.mem);
    if (e.conflict) conflicts.push(e.conflict);
    if (e.trait) for (const [k, d] of Object.entries(e.trait)) traits[k as keyof Traits] = clampTrait(traits[k as keyof Traits] + (d as number));
  }
  if (opts.trial && opts.prev) {
    events.push({ age: Math.max(6, Math.min(age - 2, rng.int(10, 25))), text: 'LA PROVA — vive sotto il peso di «' + (opts.prev.conflicts[0] ?? 'un torto antico') + '», senza conoscerne l\'origine.', tag: 'prova' });
  }
  // L'atto centrale del caso avviene nella maturità della vita.
  const actAge = Math.max(16, Math.min(age - 1, Math.round(age * rng.int(55, 85) / 100)));
  events.push({ age: actAge, text: 'L\'atto a registro: ' + tpl.title.toLowerCase() + '.', tag: 'atto' });
  events.push({ age, text: 'Muore: ' + cause + '.', tag: 'morte' });
  events.sort((a, b) => a.age - b.age);

  const bio = fill(
    `${occupation[0].toUpperCase() + occupation.slice(1)} a {luogo}. ` +
      (chosen[0] ? fill(chosen[0].text, v) + ' ' : '') +
      `A registro compare per «${tpl.title.toLowerCase()}».`,
    v,
  );
  return {
    name: first + ' ' + last,
    ageAtDeath: age,
    origin,
    era,
    occupation,
    cause,
    traits,
    bio,
    relations: [
      { name: altro, role: tpl.rel.role, note: fill(tpl.rel.note, v) },
      { name: teste, role: fill(tpl.wit, v), note: 'Ha reso dichiarazione al Servizio Testimonianze.' },
    ],
    events,
    motivations: [fill(tpl.variants[variant].weigh, v)],
    conflicts,
    memories,
    inherited: opts.inherited,
    gender,
    tpl: tpl.id,
    variant,
    linked: opts.linked,
  };
}

export function generateSoul(seed: number, id: string, opts: LifeOpts = {}): Soul {
  const inc = buildLife(mixSeed(seed, 'life', 1), opts);
  return { id, seed, curated: false, incarnations: [{ ...inc, index: 1 }], status: 'in_arrivo', notes: [] };
}

/** Ereditarietà selettiva: mai una copia della personalità precedente. */
export function inherit(prev: Incarnation, dest: Destination, rng: Rng): { inherited: Inheritance; residuo: string } {
  const inh: Inheritance = { predisposizioni: [], paure: [], inclinazioni: [], talenti: [], conflitti: [], memorie: [], legami: [] };
  const extreme = [...TRAIT_KEYS].sort((a, b) => Math.abs(prev.traits[b] - 5) - Math.abs(prev.traits[a] - 5));
  for (const k of extreme.slice(0, 2)) {
    if (inh.predisposizioni.length === 0 || rng.chance(0.6)) inh.predisposizioni.push(PREDISPOSITION[k][prev.traits[k] >= 5 ? 0 : 1]);
  }
  inh.paure.push(fearForCause(prev.cause));
  if (dest === 'otherForm') {
    const kept = new Set<string>();
    const residuo = prev.memories.filter((m) => !kept.has(m)).join('; ') || 'un ricordo senza nome';
    return { inherited: inh, residuo };
  }
  if (rng.chance(0.6)) inh.inclinazioni.push('una familiarità inspiegabile con il mestiere di ' + prev.occupation.split(',')[0]);
  const talents = prev.events.map((e) => EVENTS.find((p) => p.id === e.tag)?.talent).filter((t): t is string => !!t);
  if (talents.length) inh.talenti.push(rng.pick(talents));
  if (prev.conflicts.length && (dest === 'trial' || rng.chance(0.7))) inh.conflitti.push('irrisolto: ' + prev.conflicts[0]);
  const mems = rng.shuffle(prev.memories);
  const nMem = dest === 'trial' ? 2 : 1;
  inh.memorie.push(...mems.slice(0, nMem));
  if (prev.relations[0]) inh.legami.push('un legame con chi fu ' + prev.relations[0].name + ' (' + prev.relations[0].role + ')');
  const residuo = mems.slice(nMem).join('; ') || 'un ricordo senza nome';
  return { inherited: inh, residuo };
}

/** Crea la prossima incarnazione di un'anima (Rinnovo, Prova, Altra Forma). */
export function nextIncarnation(soul: Soul, dest: Destination, form?: string): { inc: Incarnation; residuo: string } {
  const prev = soul.incarnations[soul.incarnations.length - 1];
  const index = prev.index + 1;
  const rng = new Rng(mixSeed(soul.seed, 'inc', index));
  const { inherited, residuo } = inherit(prev, dest, rng);
  if (dest === 'otherForm') {
    const f = form ?? rng.pick(OTHER_FORMS);
    const years = rng.int(2, 14);
    const inc: Incarnation = {
      index,
      name: f,
      ageAtDeath: years,
      origin: rng.pick(TOWNS),
      era: prev.era,
      occupation: 'nessuna (forma non umana)',
      cause: rng.pick(['il freddo', 'la vecchiaia della specie', 'una mano d\'uomo', 'un inverno troppo lungo']),
      traits: { empatia: clampTrait(prev.traits.empatia * 0.5), altruismo: 0, onesta: 10, coraggio: clampTrait(prev.traits.coraggio * 0.7 + 2), responsabilita: 0, ambizione: 0 },
      bio: 'Ha vissuto ' + years + ' anni come ' + f + '. Dell\'anima precedente conserva soltanto: ' + inherited.predisposizioni[0] + ', e ' + inherited.paure[0] + '.',
      relations: [],
      events: [{ age: years, text: 'Muore: ' + 'la forma si consuma.' }],
      motivations: [],
      conflicts: [],
      memories: [inherited.paure[0]],
      inherited,
      form: f,
    };
    return { inc, residuo };
  }
  const life = buildLife(mixSeed(soul.seed, 'life', index), { prev, inherited, trial: dest === 'trial' });
  return { inc: { ...life, index }, residuo };
}

function soulArticle(inc: Incarnation): Record<string, string> {
  const [first, ...rest] = inc.name.split(' ');
  const rel = inc.relations[0]?.name ?? 'un tale';
  const wit = inc.relations[1]?.name ?? 'un testimone';
  return { nome: first, cognome: rest.join(' '), luogo: inc.origin, altro: rel, teste: wit, o: inc.gender === 'f' ? 'a' : 'o' };
}

function genericOutcomes(inc: Incarnation, rng: Rng, returnIn: number): Record<Destination, OutcomeDef> {
  const v = soulArticle(inc);
  const out = {} as Record<Destination, OutcomeDef>;
  const status: Record<Destination, string> = {
    ascension: inc.name + ' è asces' + v.o + '. Il fascicolo sale ai Livelli Superiori.',
    renewal: inc.name + ' è avviat' + v.o + ' al Rinnovo.',
    trial: inc.name + ' è destinat' + v.o + ' alla Prova.',
    otherForm: inc.name + ' lascia la forma umana.',
    waitingRoom: inc.name + ' è trattenut' + v.o + ' in Sala d\'Attesa.',
  };
  for (const d of DESTINATIONS) {
    out[d] = {
      text: fill(rng.pick(VERDICT_REACTIONS[d]), v),
      consequences: [status[d]],
      reinc: d === 'renewal' || d === 'trial' || d === 'otherForm' ? { returnIn } : undefined,
      fx: d === 'waitingRoom' ? { stats: { pendenti: 1 } } : undefined,
    };
  }
  return out;
}

export interface ProcCtx {
  caseId: string;
  day: number;
  mode: 'campaign' | 'endless';
  prevDecision?: Decision;
  prevName?: string;
  linkedDecision?: Decision;
}

/** Caso procedurale per un'anima rientrata dall'Altra Forma: niente colloquio, una sola osservazione. */
function formReturnCase(soul: Soul, inc: Incarnation, ctx: ProcCtx): CaseDef {
  const prev = soul.incarnations[inc.index - 2];
  const rng = new Rng(mixSeed(soul.seed, 'case', inc.index));
  const echo = prev?.conflicts[0] ?? 'qualcosa di irrisolto';
  return {
    id: ctx.caseId,
    title: 'Rientro da Altra Forma — ' + inc.name,
    type: 'ritorno',
    procedural: true,
    soulId: soul.id,
    arrival: 'Sulla sedia delle anime non c\'è una persona. C\'è ' + inc.name + ', o ciò che ne resta dopo ' + inc.ageAtDeath + ' anni. Ti guarda come ti guardano le cose che non possono parlare.',
    registration: 'Modulo 6/F — Rientro da Altra Forma. Il protocollo avverte: «soggetto non verbalizzabile». L\'Indice aggancia la vita precedente: ' + (prev?.name ?? 'ignota') + '.',
    summary: 'Rientro da Altra Forma disposta da te. L\'anima fu ' + (prev?.name ?? 'qualcuno') + '. Va stabilito se e come restituirle una vita umana.',
    recommended: 'renewal',
    recommendedWhy: 'Art. 27: al rientro da Altra Forma si procede d\'ufficio al Rinnovo.',
    noInterview: 'Il soggetto non parla. Ma quando leggi ad alta voce il nome «' + (prev?.name ?? '') + '», smette di muoversi.',
    pastLives: prev ? [prev.name + ', ' + prev.occupation + ' — destinat' + (prev.gender === 'f' ? 'a' : 'o') + ' all\'Altra Forma a questa scrivania.'] : [],
    docs: [
      {
        id: 'osservazione', title: 'Nota d\'osservazione', kind: 'nota', source: 'Servizio Testimonianze', reliability: 'attendibile',
        why: 'Chi osservò la creatura riferì ciò che vide; il nesso con la vita precedente è nel solo Indice.',
        body: [
          'Chi l\'ha conosciuta in questa forma riferisce un\'abitudine costante.',
          { t: 'Evitava sempre ' + (inc.inherited?.paure[0] ?? 'un certo luogo') + ', e mostrava ' + (inc.inherited?.predisposizioni[0] ?? 'una strana inclinazione') + '. Chi fu ' + (prev?.name ?? '') + ' portava in sé: ' + echo + '.', clue: 'eco' },
        ],
      },
    ],
    clues: [
      { id: 'eco', label: 'Un\'abitudine che viene da un\'altra vita', text: 'Anche in una forma senza parola, l\'anima ha conservato una paura e un\'inclinazione della vita precedente.', status: 'verificato', know: ['k_memorie_frammento'] },
    ],
    topics: [],
    contradictions: [],
    motivations: [{ id: 'm_eco', text: 'Ciò che resta dopo l\'Altra Forma è ciò che l\'anima è davvero.', needClues: ['eco'] }],
    outcomes: genericOutcomes(inc, rng, rng.int(4, 7)),
    truth: ['L\'anima è la stessa di ' + (prev?.name ?? 'una vita precedente') + ', rientrata dall\'Altra Forma.', 'Ha conservato: ' + (inc.inherited?.paure[0] ?? '—') + '; ' + (inc.inherited?.predisposizioni[0] ?? '—') + '.'],
    truthClue: 'eco',
    residuo: 'niente che abbia un nome',
  };
}

/** Deriva un caso completo dalla vita (template + variante) di un'incarnazione. */
export function makeProceduralCase(soul: Soul, inc: Incarnation, ctx: ProcCtx): CaseDef {
  if (inc.form) return formReturnCase(soul, inc, ctx);
  const tpl = templateById(inc.tpl ?? TEMPLATES[0].id);
  const variant = tpl.variants[inc.variant ?? 0];
  const rng = new Rng(mixSeed(soul.seed, 'case', inc.index));
  const v = soulArticle(inc);
  const f = (s: string) => fill(s, v);
  const prev = inc.index > 1 ? soul.incarnations[inc.index - 2] : undefined;
  const isReturn = !!prev;

  const docs: DocDef[] = [
    {
      id: 'scheda', title: 'Scheda d\'ingresso 1/A', kind: 'scheda', source: 'Sportello Accettazione', reliability: 'attendibile',
      why: 'Compilata d\'ufficio all\'arrivo.',
      body: [
        `${inc.name.toUpperCase()}, anni ${inc.ageAtDeath}. ${inc.occupation[0].toUpperCase() + inc.occupation.slice(1)}. Provenienza: ${inc.origin} (${inc.era}).`,
        `Causa del decesso: ${inc.cause}.`,
        ...inc.events.filter((e) => e.tag !== 'atto' && e.tag !== 'morte').map((e) => `A ${e.age} anni: ${e.text}`),
        { t: `Persone citate nel fascicolo: ${inc.relations.map((r) => r.name + ' (' + r.role + ')').join('; ')}.`, clue: 'persone' },
      ],
    },
    {
      id: 'ufficiale', title: f(tpl.official.title), kind: 'rapporto', source: f(tpl.official.source),
      reliability: variant.flawed === 'ufficiale' ? (variant.tone === 'menzogna' ? 'falsificato' : 'distorto') : 'attendibile',
      why: variant.flawed === 'ufficiale' ? f(variant.why) : 'La versione ufficiale è esatta nei fatti che riporta.',
      body: [{ t: f(tpl.official.text), clue: 'ufficiale' }],
    },
    {
      id: 'teste', title: 'Dichiarazione di ' + v.teste + ', ' + f(tpl.wit), kind: 'testimonianza', source: 'Servizio Testimonianze',
      reliability: variant.flawed === 'teste' ? 'distorto' : 'attendibile',
      why: variant.flawed === 'teste' ? f(variant.why) : 'Il teste riferisce con esattezza ciò che vide.',
      body: [{ t: f(tpl.witness), clue: 'teste' }],
    },
  ];
  const topics: TopicDef[] = [
    { id: 'vita', q: 'Mi parli della sua vita.', tone: 'sincera', a: `«${inc.occupation[0].toUpperCase() + inc.occupation.slice(1)}, a ${inc.origin}. ${inc.events[0] ? inc.events[0].text : 'Niente che meriti un fascicolo.'} Il resto è nelle carte: lo sapete meglio di me.»` },
    { id: 'atto', q: 'Veniamo al fatto a registro.', tone: variant.tone, a: f(tpl.claim), gives: ['dichiarazione'] },
    { id: 'confronto', q: 'La versione ufficiale e la dichiarazione di ' + v.teste + ' non stanno insieme. Che cosa accadde davvero?', tone: 'sincera', needContra: 'x_versioni', a: f(variant.confess), gives: ['verita'] },
    { id: 'altro', q: 'Che cosa prova, oggi, per ' + v.altro + '?', tone: 'sincera', needClues: ['verita'], a: inc.traits.empatia >= 6 ? '«Ci penso ogni giorno. Non è rimorso: il rimorso passa. È che l{o} vedo.»'.replace('{o}', 'o') : '«Niente che cambi i fatti. Ho smesso di interrogarmi: non portava da nessuna parte.»' },
  ];
  const clues = [
    { id: 'persone', label: 'Le persone del fascicolo', text: inc.relations.map((r) => r.name + ', ' + r.role).join(' — '), status: 'documento' as const },
    { id: 'ufficiale', label: 'Versione ufficiale', text: f(tpl.official.text), status: 'documento' as const },
    { id: 'teste', label: 'Dichiarazione di ' + v.teste, text: f(tpl.witness), status: 'testimonianza' as const },
    { id: 'dichiarazione', label: 'Dichiarazione dell\'anima', text: f(tpl.claim), status: 'testimonianza' as const },
    { id: 'verita', label: 'Ciò che accadde davvero', text: f(variant.truth), status: 'verificato' as const },
  ];
  const pastLives: string[] = [];
  if (isReturn && prev) {
    const d = ctx.prevDecision;
    pastLives.push(`${prev.name}, ${prev.occupation}${d ? ' — giudicat' + (prev.gender === 'f' ? 'a' : 'o') + ' da te il giorno ' + d.day + ': ' + DEST_LABEL[d.destination] : ''}.`);
    docs.push({
      id: 'indice', title: 'Estratto dell\'Indice delle Reincarnazioni', kind: 'registro', source: 'Archivio', reliability: 'attendibile',
      why: 'L\'Indice riporta fedelmente la vita precedente e il tuo giudizio.',
      body: [
        `Vita precedente: ${prev.name}, ${prev.occupation}, ${prev.origin}. Causa del decesso: ${prev.cause}.`,
        d ? `Giudizio: ${DEST_LABEL[d.destination]}. Scrivano: tu. Motivazione: «${d.motivation}». Residuo trattenuto: ${d.residuo}.` : 'Giudizio: non reperito.',
        { t: `Ereditato a registro: ${[...(inc.inherited?.predisposizioni ?? []), ...(inc.inherited?.paure ?? []).map((p) => 'paura: ' + p)].join('; ')}.`, clue: 'indice' },
      ],
    });
    clues.push({ id: 'indice', label: 'Vita precedente: ' + prev.name, text: 'Quest\'anima è già passata dalla tua scrivania come ' + prev.name + '.', status: 'documento' as const });
    clues.push({ id: 'eco', label: 'Un ricordo che non le appartiene', text: 'L\'anima ricorda un frammento della vita di ' + prev.name + ': ' + (inc.inherited?.memorie[0] ?? '—') + '.', status: 'testimonianza' as const });
    topics.push({
      id: 'frammento', q: 'Le capita di ricordare cose che non ha vissuto?', tone: 'confusa', needClues: ['indice'], gives: ['eco'],
      fx: { know: ['k_memorie_frammento'] },
      a: `«È strano che me lo chieda. Sogno ${inc.inherited?.memorie[0] ?? 'una casa che non conosco'}. E ho sempre avuto paura di una cosa precisa — ${inc.inherited?.paure[0] ?? 'non so dire cosa'} — senza che mi sia mai successo niente.» Ti guarda meglio. «Ci siamo già visti?»`,
    });
  }
  if (ctx.linkedDecision && inc.linked) {
    const ld = ctx.linkedDecision;
    docs.push({
      id: 'collegato', title: 'Nota di collegamento tra fascicoli', kind: 'nota', source: 'Archivio', reliability: 'attendibile',
      why: 'L\'Archivio collega d\'ufficio le anime che compaiono l\'una nel fascicolo dell\'altra.',
      body: [
        { t: `Questa persona compare nel fascicolo di ${inc.linked}, da te giudicat${'o'} il giorno ${ld.day} (${DEST_LABEL[ld.destination]}).`, clue: 'collegato' },
      ],
    });
    clues.push({ id: 'collegato', label: 'Compare nel fascicolo di ' + inc.linked, text: 'Le due anime erano legate in vita. Il tuo giudizio sull\'altra è a registro.', status: 'documento' as const });
    topics.push({
      id: 'legame', q: 'Lei conosceva ' + inc.linked + '.', tone: 'sincera', needClues: ['collegato'],
      a: ld.truthFound
        ? '«Sì. E so che lei, a quella scrivania, ha saputo come andarono davvero le cose. Qui dentro le voci girano, tra chi aspetta. Mi ha fatto piacere: almeno uno.»'
        : '«Sì. E so che lei ha chiuso quel fascicolo senza sapere com\'era andata. Non glielo rimprovero. Ma glielo dico: non era come stava scritto.»',
    });
  }

  const returnIn = ctx.mode === 'endless' ? rng.int(3, 6) : rng.int(4, 7);
  return {
    id: ctx.caseId,
    title: tpl.title + ' — ' + inc.name,
    type: isReturn ? 'ritorno' : 'ordinario',
    procedural: true,
    soulId: soul.id,
    pastLives,
    arrival: isReturn
      ? f('{nome} {cognome} entra e si ferma un passo prima della sedia, come chi riconosce una stanza. Poi scuote la testa e si siede.')
      : f(rng.pick([
          '{nome} {cognome} si siede sul bordo della sedia, il cappello sulle ginocchia.',
          '{nome} {cognome} resta in piedi finché non l{o} inviti a sedere. Poi si siede dritt{o}, come in un ufficio del catasto.',
          '{nome} {cognome} entra guardandosi le mani, e continua a guardarsele.',
          '{nome} {cognome} saluta con un cenno e aspetta. Ha l\'aria di chi ha già aspettato molto.',
        ])),
    registration: 'Modulo 1/A — Ingresso ordinario' + (isReturn ? ', con cartiglio «RITORNO».' : '.') + ' Tre documenti allegati.',
    summary: f(tpl.official.text),
    recommended: tpl.recommended,
    recommendedWhy: tpl.rule,
    docs,
    clues,
    topics,
    contradictions: [
      { id: 'x_versioni', a: 'ufficiale', b: 'teste', label: 'Due versioni dello stesso fatto', note: 'La versione ufficiale e la dichiarazione di ' + v.teste + ' descrivono lo stesso fatto in modi che non possono essere veri entrambi per intero.' },
    ],
    motivations: [{ id: 'm_peso', text: f(variant.weigh), needClues: ['verita'] }],
    outcomes: genericOutcomes(inc, rng, returnIn),
    truth: [f(variant.truth), f(variant.why)],
    truthClue: 'verita',
    residuo: undefined,
  };
}
