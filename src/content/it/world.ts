// Mondo esplorabile: personaggi, routine, oggetti, documenti d'ambiente, enigmi ambientali.
import type { Cond, Convo, Line, LoreDoc, PuzzleDef } from '../../engine/types';

const N = (t: string): Line => ({ s: 'narr', t });
const S = (s: string, t: string): Line => ({ s, t });
const YOU = (t: string): Line => ({ s: 'you', t });

export interface NpcDef {
  id: string;
  name: string;
  role: string;
  sprite: string;
  /** Presente nell'ufficio se la condizione è vera. */
  cond?: Cond;
  /** Per fase del turno (0..4): punto di sosta e stato. Le voci con cond hanno precedenza. */
  routine: { phase?: number[]; cond?: Cond; spot: string; state: 'Working' | 'Moving' | 'Talking' | 'Resting' | 'Unavailable' }[];
}

export const NPCS: NpcDef[] = [
  { id: 'pim', name: 'Signorina Pim', role: 'Accettazione', sprite: 'pim', routine: [
    { cond: { all: [{ dayMin: 11 }, { dayMax: 11 }, { not: { flag: 'closed_c11' } }] }, spot: 'pim_hall', state: 'Talking' },
    { phase: [2], spot: 'pim_register', state: 'Working' },
    { phase: [4], spot: 'pim_bench', state: 'Resting' },
    { spot: 'pim_counter', state: 'Working' },
  ] },
  { id: 'bones', name: 'Mr. Bones', role: 'Scrivano, scrivania 1', sprite: 'bones', routine: [
    { phase: [2], spot: 'bones_samovar', state: 'Resting' },
    { spot: 'bones_desk', state: 'Working' },
  ] },
  { id: 'vesper', name: 'Madame Vesper', role: 'Direttrice di Reparto', sprite: 'vesper', routine: [
    { cond: { dayMax: 3 }, phase: [0, 1], spot: 'vesper_floor', state: 'Working' },
    { cond: { all: [{ dayMin: 10 }, { not: { flag: 'odile_persa' } }, { not: { flag: 'odile_libera' } }] }, phase: [4], spot: 'vesper_desk', state: 'Unavailable' },
    { phase: [1], spot: 'vesper_floor', state: 'Moving' },
    { phase: [3], spot: 'vesper_rail', state: 'Working' },
    { spot: 'vesper_desk', state: 'Working' },
  ] },
  { id: 'hoot', name: 'Mr. Hoot', role: 'Archivista', sprite: 'hoot', cond: { npc: ['hoot', 'attivo'] }, routine: [
    { phase: [1], spot: 'hoot_shelves', state: 'Working' },
    { phase: [3], spot: 'hoot_leggio', state: 'Working' },
    { spot: 'hoot_desk', state: 'Working' },
  ] },
  { id: 'grell', name: 'Il Custode', role: 'Custode', sprite: 'grell', routine: [
    { cond: { dayMin: 12 }, phase: [2, 3], spot: 'grell_gate', state: 'Working' },
    { phase: [1], spot: 'grell_attesa', state: 'Working' },
    { phase: [2], spot: 'grell_samovar', state: 'Resting' },
    { phase: [3], spot: 'grell_stairs', state: 'Moving' },
    { spot: 'grell_stove', state: 'Working' },
  ] },
  { id: 'ilse', name: 'Consulente Marrow', role: 'Consulente dei Colloqui', sprite: 'ilse', cond: { any: [{ npc: ['ilse', 'attivo'] }, { flag: 'ilse_torchi' }] }, routine: [
    { cond: { flag: 'ilse_torchi' }, spot: 'ilse_torchi', state: 'Working' },
    { phase: [2], spot: 'ilse_samovar', state: 'Resting' },
    { phase: [3], spot: 'ilse_int2', state: 'Working' },
    { spot: 'ilse_desk', state: 'Working' },
  ] },
  { id: 'quill', name: 'Ispettore Quill', role: 'Inviato dei Livelli Superiori', sprite: 'quill', cond: { all: [{ dayMin: 10 }, { mode: 'campaign' }] }, routine: [
    { phase: [1, 3], spot: 'quill_desk', state: 'Working' },
    { phase: [2], spot: 'quill_archive', state: 'Moving' },
    { spot: 'quill_stairs', state: 'Working' },
  ] },
  { id: 'scrivano3', name: 'Scrivano della 3', role: 'Scrivano', sprite: 'clerk', routine: [{ spot: 'scrivano3_desk', state: 'Working' }] },
  { id: 'scrivano6', name: 'Scrivana della 6', role: 'Scrivana', sprite: 'clerk2', routine: [{ spot: 'scrivano6_desk', state: 'Working' }] },
  { id: 'tea', name: 'Tea', role: 'In custodia all\'Archivio', sprite: 'tea', cond: { all: [{ flag: 'nn_custodia' }, { not: { flag: 'albrecht_riunite' } }] }, routine: [{ spot: 'tea_spot', state: 'Resting' }] },
  { id: 'sabina', name: 'Sabina Tadini', role: 'Sospesa in custodia', sprite: 'soul', cond: { flag: 'sabina_ricongiunzione' }, routine: [{ spot: 'sabina_spot', state: 'Resting' }] },
];

export const SPEAKERS: Record<string, string> = {
  narr: '', you: 'Tu', soul: 'L\'anima', direttore: 'Il Direttore',
  ...Object.fromEntries(NPCS.map((n) => [n.id, n.name])),
};

export const OBJ_LABEL: Record<string, string> = {
  scrivania7: 'Scrivania 7 (la tua)', scrivania_bones: 'Scrivania 1', scrivania3: 'Scrivania 3', scrivania4: 'Scrivania 4', scrivania5: 'Scrivania 5', scrivania6: 'Scrivania 6',
  colonna_a: 'Colonna', pendola: 'Pendola', tubo: 'Posta pneumatica', pile_a: 'Pratiche pendenti',
  bancone: 'Bancone dell\'Accettazione', panca_a: 'Panca', registro_arrivi: 'Registro degli Arrivi', bacheca: 'Bacheca delle Direttive', pianta_a: 'Pianta',
  stufa: 'Stufa', samovar: 'Samovar', armadietti: 'Armadietti', marcatempo: 'Orologio marcatempo', tavolo_dip: 'Tavolo', branda_a: 'Branda',
  scrivania_ilse: 'Scrivania della Consulente', armadio_ilse: 'Armadio', schedario_tiepido: 'Schedario nuovo', tavolo_col2: 'Tavolo dei colloqui', apparecchio: 'Apparecchio a cilindri', specchio: 'Specchio',
  scaffale_n3: 'Scaffali', schedario_dimenticati: 'Schedario senza numero', scrivania_hoot: 'Scrivania dell\'Archivista', leggio: 'Leggio del Regolamento', indice: 'Indice delle Reincarnazioni',
  registro_sospensioni: 'Registri delle Sospensioni', scaffale_personale: 'Stati di servizio',
  scrivania_vesper: 'Scrivania della Direzione', armadio_dir_b: 'Armadio della Direzione', cassaforte: 'Cassaforte', tiglio: 'Tiglio in vaso',
  barattoli: 'Barattoli', torchio: 'Torchio', panca_torchi: 'Panca', risme: 'Risme', fascicolo7: 'Leggio', scrivania_direttore: 'Scrivania del Direttore',
  cancello_riservato: 'Cancello', porta_direttore: 'Vetro smerigliato', portone: 'Portone', porta_attesa: 'Sala d\'Attesa', porta_prova: 'La Prova',
  porta_forma: 'L\'Altra Forma', montacarichi: 'Montacarichi dell\'Ascensione', porta_rinnovo: 'Il Rinnovatore',
};

export const AREA_LABEL: Record<string, string> = {
  reception: 'Reception', judgment: 'Sala dei Giudizi', employee: 'Area Dipendenti', interview: 'Sale Colloqui',
  archive: 'Archivio', management: 'Direzione di Reparto', restricted: 'Reparto Riservato', director: 'Ufficio del Direttore',
};
export const AREA_LOCKED: Record<string, string> = {
  interview: 'Le Sale Colloqui sono chiuse a chiave. Ti verranno aperte quando avrai un colloquio da condurre.',
  archive: 'In cima alla scala c\'è una catenella con un cartello: «Archivio — accesso su presentazione all\'Archivista».',
  management: 'Un usciere che non avevi notato ti sbarra la scala. «La Direzione riceve su convocazione.»',
  restricted: 'Il cancello è chiuso. Non ha serratura visibile. Ha, in compenso, una spirale di ferro grande quanto te.',
  director: 'Il vetro smerigliato non ha maniglia da questa parte.',
};

/** Eventi all'ingresso in una stanza (una volta sola). */
export const ROOM_EVENTS: { room: string; convo: string }[] = [
  { room: 'judgment', convo: 'ev_sala' }, { room: 'employee', convo: 'ev_dipendenti' }, { room: 'interview1', convo: 'ev_colloqui' },
  { room: 'archive', convo: 'ev_archivio' }, { room: 'management', convo: 'ev_direzione' }, { room: 'restricted', convo: 'ev_riservato' }, { room: 'director', convo: 'ev_direttore' },
  { room: 'judgment', convo: 'ev_pendola' }, { room: 'reception', convo: 'ev_rientrato' }, { room: 'judgment', convo: 'ev_quill_arrivo' },
];

export const WORLD_PUZZLES: PuzzleDef[] = [
  {
    id: 'schedario', kind: 'codice', title: 'Lo schedario senza numero',
    intro: 'Quattro rotelle d\'ottone, da 0 a 9. Sul bordo, graffiato a temperino con la calligrafia minuta di chi ha la vista stanca: «Il lotto che finì · il lotto che cominciò · la scrivania che restò vuota».',
    solution: '9147',
    success: 'Le rotelle si allineano con uno scatto morbido. Lo schedario si apre senza cigolare: qualcuno lo olia. Dentro, in ordine perfetto, ci sono i fogli che l\'ufficio ha sostituito. Tutti gli originali. Decenni di originali.',
    failure: 'Le rotelle girano a vuoto. Tre numeri, dice l\'incisione: due lotti di carta e una scrivania.',
    fx: { flags: ['schedario_aperto', 'doc_asher_originale'], know: ['k_hoot_dimenticati'], rel: { hoot: 1 }, vars: { arch_today: 1 } },
  },
];

export const LORE: LoreDoc[] = [
  { id: 'regolamento', title: 'Regolamento Generale — art. 7', source: 'Leggio dell\'Archivio', kind: 'direttiva',
    body: ['Art. 7 — Del Residuo.', '«A ogni giudizio lo scrivano dispone il prelievo del Residuo, nella misura strettamente necessaria a che l\'anima non rechi con sé, nella nuova esistenza, il peso della precedente.»', '«Il Residuo è custodito. Nulla va perduto.»'],
    altCond: { chapterMin: 2 },
    altBody: ['Art. 7 — Del Residuo.', '«A ogni giudizio lo scrivano dispone il prelievo del Residuo, nella misura necessaria.»', 'La parola «strettamente» non c\'è più. Sei sicuro che ci fosse. Guardi meglio: dove stava, la carta è leggermente più chiara, come una pelle che ha cicatrizzato.', '«Il Residuo è custodito. Nulla va perduto. Nulla va perduto. Nulla va» — la riga continua oltre il margine, più piccola, in una calligrafia che non è a stampa.'],
    altFx: { know: ['k_regolamento_cambia'], stats: { anomalie: 1 } } },
  { id: 'stato_servizio', title: 'Stato di servizio', source: 'Archivio — scaffale del personale', kind: 'scheda',
    body: ['Tra «Hoot, O.» e «Marrow, I.» c\'è una cartella con il tuo nome.', '«{nome}. Scrivano. Scrivania assegnata: 7. Data di assunzione:» — una data di undici anni anteriore al tuo arrivo.', '«Note di qualifica: diligente. Tende ad approfondire.»', 'Ultima riga, altra mano: «Cessato per rinnovo. Posto mantenuto vacante su disposizione del Direttore».', 'Sotto ancora, a matita, cancellato e ancora leggibile: «VI».'],
    fx: { know: ['k_stato_servizio', 'k_scrivania7'] } },
  { id: 'registro_arrivi', title: 'Registro degli Arrivi', source: 'Reception', kind: 'registro',
    body: ['Un volume alto come un bambino. Ogni riga un\'anima: numero, ora, firma dell\'addetta. La firma è sempre la stessa, da pagine e pagine: una P con un ricciolo.', 'Sfogli all\'indietro. La carta ingiallisce, poi si fa spessa come cuoio. La firma non cambia.', 'Alla prima pagina, prima riga: il numero 1, un\'ora, e poi niente. La riga è rimasta in bianco. Nessun nome. Nessuna firma.', 'Dal bancone, la Signorina Pim ti sta guardando. Sorride come sempre.'],
    fx: { know: ['k_pim_senza_fascicolo'] } },
  { id: 'modulario', title: 'Modulario Generale dei Timbri', source: 'Scrivania dell\'Archivista', kind: 'registro',
    body: ['Quattrocentododici timbri, ognuno con impronta, colore dell\'inchiostro e ufficio competente.', 'Tra il n. 211 («Visto, si approvi») e il n. 212 («Visto, si approvi con riserva») la numerazione salta: manca una pagina, tagliata rasente alla rilegatura con molta cura.', 'In fondo al volume: «Compilato dall\'Archivista O. Hoot».'] },
  { id: 'lettera_armadietto', title: 'Biglietto nell\'armadietto 7', source: 'Area Dipendenti', kind: 'nota',
    body: ['L\'armadietto con il tuo numero non è vuoto. C\'è un cappotto della tua taglia, piegato. In tasca, un biglietto del tram di una città che non esiste più e un foglietto:', '«Se stai leggendo, il cappotto ti va. Lo sapevo. Non chiedere a Vesper. Chiedi a quello che non ha più niente da perdere.»', 'La calligrafia è la tua. Non ricordi di averlo scritto.'],
    fx: { know: ['k_cassetto_penna'], flags: ['letto_armadietto'] } },
  { id: 'bottoni', title: 'La scatola di latta', source: 'Il Custode', kind: 'oggetto',
    body: ['Grell apre la scatola senza una parola. Bottoni. Centinaia. D\'osso, d\'ottone, di madreperla. Fibbie. Un ditale. Una fede sottile. Un dentino da latte montato in argento.', '«Quello che la carta non prende» dice. È la frase più lunga che gli hai sentito dire.', 'Ogni bottone ha un cartellino legato con un filo, e su ogni cartellino c\'è un nome. Li ha scritti lui, uno per uno, con una grafia da bambino.'],
    fx: { know: ['k_grell_bottoni'], rel: { grell: 1 } } },
];

export const OVERHEARD: { id: string; a: string; b: string; phase: number; cond?: Cond; lines: string[] }[] = [
  { id: 'oh_samovar1', a: 'bones', b: 'grell', phase: 2, cond: { chapterMax: 2 }, lines: ['…e quante, questa settimana?', 'Quattro.', 'Quattro. Una volta erano quattro al mese.', '…', 'Zitto. Arriva il nuovo.'] },
  { id: 'oh_samovar2', a: 'bones', b: 'ilse', phase: 2, cond: { all: [{ chapterMin: 2 }, { chapterMax: 3 }, { npc: ['ilse', 'attivo'] }, { not: { flag: 'ilse_rinnovata' } }] }, lines: ['Gliel\'hai detto?', 'Non tocca a me. L\'ultima volta che gliel\'ho detto io —', 'Lo so cos\'è successo l\'ultima volta. C\'ero.', '…Buongiorno.'] },
  { id: 'oh_samovar3', a: 'bones', b: 'grell', phase: 2, cond: { chapterMin: 4 }, lines: ['Sette. Dici che stavolta…', 'Parla.', 'Chi?', 'Il nuovo. Parla ancora. Non è mio.'] },
];

export const CONVOS: Convo[] = [
  // ============ EVENTI DI STANZA ============
  { id: 'ev_sala', once: true, lines: [
    N('La Sala dei Giudizi. Otto scrivanie in due file sotto una pendola alta quanto una porta. L\'aria sa di inchiostro, ceralacca e polvere tiepida.'),
    N('Sulla parete di fondo, le porte: una doppia, imbottita, da cui non viene alcun suono. Una stretta, di ferro. Una troppo bassa per chiunque. Un cancelletto d\'ottone con un contatore di piani.'),
    N('A una scrivania, uno scheletro in gilet sta temperando una matita. Alza la testa. Non ha palpebre, e tuttavia ti squadra.'),
    { fx: { know: ['k_loc_sala'] } },
  ] },
  { id: 'ev_dipendenti', once: true, lines: [
    N('L\'Area Dipendenti. Una stufa di ghisa che ticchetta, un samovar ammaccato, una fila di armadietti numerati. Su uno c\'è il 7.'),
    { fx: { know: ['k_loc_dipendenti'] } },
  ] },
  { id: 'ev_colloqui', once: true, lines: [
    N('Le Sale Colloqui. Tappeti spessi, perché le voci non escano. Nella seconda stanza qualcosa gira piano, con un fruscio di cera.'),
    { fx: { know: ['k_loc_colloqui'] } },
  ] },
  { id: 'ev_archivio', once: true, lines: [
    N('Scendi. La temperatura cala di un grado a ogni gradino. L\'Archivio è un piano sotto la Sala, eppure gli scaffali salgono più in alto del soffitto da cui sei venuto.'),
    N('Odore di carta. Ma non di carta vecchia: di carta e di qualcos\'altro, sotto. Come un armadio di biancheria in una casa dove qualcuno è stato a lungo malato.'),
    { fx: { know: ['k_loc_archivio'] } },
  ] },
  { id: 'ev_direzione', once: true, lines: [
    N('La pedana della Direzione. Da quassù si vedono tutte le scrivanie, e chi ci siede, e che cosa scrive.'),
    N('In fondo, una porta di vetro smerigliato. Dietro c\'è una luce accesa. Per un momento ti pare che un\'ombra la attraversi — troppo larga, e senza un contorno preciso, come un respiro su un vetro.'),
    { fx: { know: ['k_loc_direzione', 'k_p_direttore'] } },
  ] },
  { id: 'ev_riservato', once: true, lines: [
    N('Sotto l\'Archivio c\'è un altro piano. Il pavimento è una grata di ferro: sotto la grata, buio, e nel buio un gocciolio.'),
    N('Due macchine occupano metà della sala. Sono torchi da stampa, ma grandi come stanze. Da un lato di ciascuno c\'è una panca. Dall\'altro, risme. Tra la panca e le risme, il piano della pressa è ancora umido.'),
    N('Qui dentro piove. Poco, dall\'alto, tiepido.'),
    { fx: { know: ['k_loc_riservato', 'k_torchi_visti', 'k_torchi'], stats: { anomalie: 1 } } },
  ] },
  { id: 'ev_direttore', once: true, lines: [
    N('Il vetro smerigliato si è aperto da solo.'),
    { fx: { know: ['k_loc_direttore'] } },
  ] },
  { id: 'ev_pendola', once: true, cond: { all: [{ dayMin: 7 }, { phaseMin: 2 }] }, lines: [
    N('La pendola batte. Conti senza volerlo: dieci, undici, dodici. Tredici.'),
    N('Poi le lancette fanno un giro intero all\'indietro, senza fretta, e si rimettono dov\'erano. Lo Scrivano della 3 non alza la testa. Mr. Bones sì: guarda la pendola, poi guarda te, e fa un piccolo gesto con la mano d\'osso — «visto?».'),
    { fx: { know: ['k_orologio'], stats: { anomalie: 1 } } },
  ] },
  { id: 'ev_quill_arrivo', once: true, cond: { all: [{ dayMin: 10 }, { mode: 'campaign' }] }, lines: [
    N('In fondo alla Sala, ai piedi della scala della Direzione, c\'è qualcuno che ieri non c\'era. Alto, stretto, vestito di un grigio che sembra carta assorbente.'),
    N('Tiene le mani dietro la schiena. Quando si volta, te ne accorgi: sono più di due, o le dita sono troppe. Sul volto porta un modulo in bianco, come una maschera.'),
    S('quill', '«Noi siamo l\'Ispettore. Lo scrivano della 7 prosegua. Noi guardiamo soltanto.»'),
    { fx: { know: ['k_p_quill'] } },
  ] },
  { id: 'ev_rientrato', once: true, cond: { all: [{ dayMin: 11 }, { dayMax: 11 }] }, lines: [
    N('Il campanello del bancone sta suonando da solo, senza che nessuno lo tocchi. Il bancone è vuoto.'),
    N('La Signorina Pim non è al suo posto. È la prima volta.'),
  ] },

  // ============ SIGNORINA PIM ============
  { id: 'pim_intro', npc: 'pim', title: 'Presentarsi', once: true, prio: 100, lines: [
    S('pim', '«Buongiorno e benvenuto all\'Ufficio Reincarnazioni, Sezione Occidentale! Lei è il numero… no. Lei non è un numero. Lei è il personale.» Il sorriso non si sposta di un millimetro.'),
    S('pim', '«Scrivano, scrivania sette. È rimasta libera… oh, da un po\'. L\'abbiamo spolverata. Più volte.»'),
    YOU('Che cosa devo fare, esattamente?'),
    S('pim', '«Loro entrano da quel portone. Io li conto e suono il campanello. Lei li riceve, legge il fascicolo, parla con loro se serve, e decide dove vanno. Cinque porte. È tutto scritto.» Una pausa minuscola. «Quasi tutto.»'),
    S('pim', '«La sua scrivania è in Sala dei Giudizi, oltre la porta doppia. Quella accanto alla colonna. E a fine turno si timbra l\'uscita all\'orologio marcatempo. Non si dimentichi di timbrare: chi non timbra, per l\'ufficio, non se n\'è mai andato.»'),
    { fx: { flags: ['met_pim'], know: ['k_p_pim', 'k_loc_reception'] } },
  ] },
  { id: 'pim_conta', npc: 'pim', title: 'Quanti, oggi?', lines: [
    { if: { chapterMax: 2 }, then: [S('pim', '«Trecentoquarantuno prima di pranzo. Quarantuno bambini. Io i bambini li conto a parte, non so perché. Abitudine.»')],
      else: [S('pim', '«Meno di ieri. È da un po\' che sono meno. Non è che muoiano meno, sa. È che…» Guarda il portone. «Niente. Conto quelli che entrano. Non è mio compito contare quelli che dovrebbero.»')] },
  ] },
  { id: 'pim_portone', npc: 'pim', title: 'Da dove arrivano?', cond: { chapterMin: 2 }, once: true, lines: [
    S('pim', '«Da fuori.»'),
    YOU('E fuori cosa c\'è?'),
    S('pim', '«Non lo so! Non sono mai uscita.» Lo dice allegra. «Sono sempre stata qui. Prima del bancone c\'era una sedia. Prima della sedia stavo in piedi.»'),
    { fx: { rel: { pim: 1 } } },
  ] },
  { id: 'pim_registro', npc: 'pim', title: 'La prima riga del Registro è in bianco.', cond: { know: 'k_pim_senza_fascicolo' }, once: true, lines: [
    S('pim', 'Il sorriso resta. Gli occhi no. «Ha sfogliato fino in fondo. Non lo fa nessuno.»'),
    S('pim', '«Quando sono arrivata non c\'era chi registrasse. C\'ero solo io, e un portone. Ho pensato: aspetto che venga qualcuno. Poi ne è arrivato un altro, e ho pensato: intanto lo conto.»'),
    S('pim', '«Se qualcuno riempie quella riga, poi mi tocca sedermi dall\'altra parte di una scrivania. E io qui ci sto bene. Mi piace contare.»'),
    { choice: [
      { t: 'Quella riga resterà com\'è. Non la riempirò io.', fx: { rel: { pim: 2 }, flags: ['pim_promessa'] }, lines: [S('pim', '«Grazie.» Per un attimo il sorriso diventa un altro: più piccolo, e suo. «Se le serve far arrivare qualcosa da un reparto all\'altro senza che passi dal protocollo, me lo dia. La posta non la guarda nessuno.»')] },
      { t: 'Tutti devono essere a registro. Anche lei.', fx: { rel: { pim: -2 } }, lines: [S('pim', '«Certo. Il regolamento.» Il sorriso torna al suo posto, perfetto. «Trecentoquarantadue.» Ha contato anche te.')] },
    ] },
  ] },
  { id: 'pim_c11', npc: 'pim', title: 'Che cosa ha visto?', cond: { all: [{ dayMin: 11 }, { dayMax: 11 }, { not: { flag: 'closed_c11' } }] }, prio: 90, lines: [
    S('pim', 'È in piedi su una sedia, in mezzo alla Sala, e non sorride. «Il montacarichi è sceso. Non scende. Ha un contatore, lo sa? Segna meno uno.»'),
    S('pim', '«Ne è uscito… ho provato a contarlo. Uno. Tre. Uno. Non riesco a contarlo.» Le trema la voce. «Io conto tutto. È alla sua scrivania. L\'ho messo lì perché non sapevo dove metterlo.»'),
  ] },
  { id: 'pim_ally', npc: 'pim', title: 'Domani salgo dal Direttore.', cond: { dayMin: 13 }, once: true, prio: 80, lines: [
    { if: { relMin: ['pim', 1] }, then: [
      S('pim', '«Lo so. Si sente dalla posta: da stamattina non arriva più niente dall\'alto.»'),
      S('pim', '«Io non so giudicare. Ma so dove vanno le cose. Se domani serve che un barattolo, o cento, arrivino a chi li ha perduti… conosco ogni indirizzo. Li ho contati tutti all\'ingresso.»'),
      { fx: { flags: ['ally_pim'] } },
    ], else: [S('pim', '«Buona fortuna, scrivano.» Sorride. «Milleottocentododici. Sono i giorni che ho contato, questa volta, da quando è arrivato lei.»')] },
  ] },

  // ============ MR. BONES ============
  { id: 'bones_intro', npc: 'bones', title: 'Presentarsi', once: true, prio: 100, lines: [
    S('bones', '«Ah. Il nuovo.» Posa la matita. «Di nuovo.»'),
    YOU('Di nuovo?'),
    S('bones', '«Modo di dire. Qui dentro tutto è “di nuovo”: è la ragione sociale.» Fa schioccare le falangi. «Bones. Scrivania uno. Sono qui da prima che il regolamento avesse gli articoli. Allora era una frase sola.»'),
    YOU('Quale frase?'),
    S('bones', '«Me la sono dimenticata. Buffo, eh? In un posto dove non si butta via niente.» Riprende la matita. «Un consiglio gratis: leggi tutto, credi a metà, e timbra piano. Il timbro non si cancella. Loro sì.»'),
    { fx: { flags: ['met_bones'], know: ['k_p_bones'], rel: { bones: 1 } } },
  ] },
  { id: 'bones_metodo', npc: 'bones', title: 'Come giudica, lei?', cond: { flag: 'met_bones' }, once: true, lines: [
    S('bones', '«Io? Rinnovo. A tutti. Da quattrocento anni.»'),
    YOU('Senza leggere?'),
    S('bones', '«Leggo, leggo. Poi timbro Rinnovo. Nessuno si è mai lamentato.» Una pausa. «Nessuno se lo ricorda, per lamentarsi. È un sistema che si regge benissimo sulle proprie gambe, non trovi? Io, che non ho più i polpacci, apprezzo.»'),
  ] },
  { id: 'bones_lorenz', npc: 'bones', title: 'Un\'anima mi ha riconosciuto.', cond: { know: 'k_lorenz_riconosce' }, once: true, lines: [
    S('bones', '«Il ragazzo col buco nella schiena. Sì, ho sentito.» Non smette di scrivere. «Capita. Loro hanno la memoria lunga e noi la penna corta.»'),
    YOU('Dice che gli ho fatto una promessa. Undici anni fa io non ero qui.'),
    S('bones', '«Mh.» Adesso smette. «E tu che cosa ne pensi?»'),
    { choice: [
      { t: 'Che si sbaglia. Mi confonde con un altro.', lines: [S('bones', '«Ecco. Bravo. Tienitela stretta, questa. È una spiegazione che dura almeno fino al secondo capitolo.» Non capisci che cosa intenda con “capitolo”. Lui sì.')] },
      { t: 'Che non è la prima volta che siedo a quella scrivania.', fx: { rel: { bones: 1 } }, lines: [S('bones', 'Le orbite vuote ti fissano a lungo. «Sei più svelto dell\'altra volta.» Poi, come se non avesse detto nulla: «Ho finito le matite. Ne hai una?»')] },
    ] },
  ] },
  { id: 'bones_tacche', npc: 'bones', title: 'Le tacche sotto la sua scrivania.', cond: { know: 'k_tacche_bones' }, once: true, lines: [
    S('bones', '«Hai guardato sotto il mio tavolo. Maleducato.» Non è arrabbiato. «Sei. Le hai contate.»'),
    { if: { any: [{ know: 'k_rinnovo_interno' }, { know: 'k_tacche_significato' }] }, then: [
      YOU('Sono i miei rinnovi interni.'),
      S('bones', '«Sono le volte che ti ho visto andare su per quella scala con la faccia di chi ha capito, e tornare giù il giorno dopo a chiedermi dov\'è il bagno.» Passa un dito d\'osso sul bordo del tavolo. «Sei volte ho pensato: stavolta no. Ho smesso di pensarlo alla quarta. Le tacche le faccio per abitudine.»'),
      YOU('Perché non me l\'ha mai detto?'),
      S('bones', '«Te l\'ho detto. Alla seconda. Sei salito un giorno prima.» Scrolla le clavicole. «Non è il saperlo, il problema. È cosa ne fai quando sei lassù.»'),
      { fx: { rel: { bones: 1 }, know: ['k_tacche_significato'] } },
    ], else: [
      S('bones', '«Conto una cosa. Non ti dico quale. Se ci arrivi da solo vale di più; se te lo dico io finisce come le altre volte.»'),
    ] },
  ] },
  { id: 'bones_natura', npc: 'bones', title: 'Lei che cos\'è, Mr. Bones?', cond: { all: [{ chapterMin: 3 }, { relMin: ['bones', 2] }] }, once: true, lines: [
    S('bones', '«Uno scrivano. Come te.» Si guarda la mano. «Più avanti, diciamo.»'),
    S('bones', '«Ogni volta che ti svuotano, tolgono quello che sai. Ma per arrivarci devono passare da quello che sei. Un po\' se ne va insieme. La prima volta la faccia non ti dice più niente allo specchio. Poi smetti di sentire il freddo. Poi la fame. Poi…» Batte le nocche sullo sterno: un suono di legno cavo.'),
    S('bones', '«A me hanno tolto finché non c\'è stato più niente da togliere tranne la struttura. E la struttura, vedi, non dimentica. Non ha con che cosa.» Ti guarda. «Tu sei a sei. Io ho smesso di contare le mie verso le quaranta.»'),
    { fx: { know: ['k_bones_natura'], rel: { bones: 1 } } },
  ] },
  { id: 'bones_quill', npc: 'bones', title: 'L\'Ispettore.', cond: { all: [{ dayMin: 10 }, { mode: 'campaign' }] }, once: true, lines: [
    S('bones', '«Quello non è un ispettore. È un dito.»'),
    YOU('Un dito di chi?'),
    S('bones', '«Di quello che c\'è sopra. Lo allungano quaggiù quando vogliono toccare qualcosa senza scendere.» Abbassa la voce. «Non dargli nomi. Qualunque nome gli dai, se lo porta su.»'),
  ] },
  { id: 'bones_chiave', npc: 'bones', title: 'Devo scendere sotto l\'Archivio.', cond: { all: [{ dayMin: 12 }, { not: { area: 'restricted' } }] }, prio: 85, lines: [
    S('bones', '«Il Custode non te l\'ha data? E il dito nemmeno?» Sospira: un suono d\'aria tra le costole. Apre il cassetto e ne toglie una chiave nera, senza spago.'),
    S('bones', '«Tieni. È un doppione. L\'hai fatto fare tu, alla terza. Le altre volte l\'hai trovata da solo, nel mio cassetto, quando ero al samovar. Stavolta te la do io: sono curioso di vedere se cambia qualcosa.»'),
    { fx: { areas: ['restricted'], flags: ['chiave_bones'] } },
  ] },
  { id: 'bones_ally', npc: 'bones', title: 'Domani salgo dal Direttore.', cond: { dayMin: 13 }, once: true, prio: 80, lines: [
    S('bones', '«Lo so. Hai la faccia. È la settima volta che te la vedo.»'),
    { if: { any: [{ relMin: ['bones', 3] }, { flag: 'promessa_mantenuta' }, { flag: 'self_memoria' }] }, then: [
      S('bones', '«Però c\'è una cosa che le altre sei volte non c\'era.» Apre il cassetto. Dentro c\'è un temperino, vecchissimo. «Questo. Non l\'ho usato. Non ho fatto la settima tacca. Volevo vedere.»'),
      S('bones', '«Senti. Io non ho gambe per le rivoluzioni e non ho stomaco per le riforme. Ma se lassù scrivi qualcosa che ha bisogno di uno che resti a questa scrivania e dica a tutti “è vero, c\'ero” — io c\'ero. A tutte e sette.»'),
      { fx: { flags: ['ally_bones'] } },
    ], else: [
      S('bones', '«Ti direi buona fortuna, ma te l\'ho detto sei volte e guarda.» Prende il temperino dal cassetto e lo posa sul tavolo, bene in vista. Non lo apre. Non ancora.'),
    ] },
  ] },

  // ============ MADAME VESPER ============
  { id: 'vesper_intro', npc: 'vesper', title: 'Presentarsi', once: true, prio: 100, lines: [
    S('vesper', 'È alta, velata, in grigio ferro. I guanti non hanno una piega. «Lo scrivano della sette.» Non è un saluto: è una verifica d\'inventario.'),
    S('vesper', '«Tre cose. Primo: il regolamento non è un suggerimento. Secondo: ogni sentenza porta la sua sigla, e della sua sigla lei risponde a me. Terzo: le anime parlano. Lei non è tenuto a crederci.»'),
    YOU('E se il regolamento e i fatti non coincidono?'),
    S('vesper', '«Allora i fatti sono stati raccolti male.» Una pausa. Dietro il velo, qualcosa che in un\'altra persona sarebbe stanchezza. «Lavori bene. Questo reparto ha bisogno di qualcuno che lavori bene e non faccia domande alla Direzione. Le ho appena detto quale delle due cose conta di più.»'),
    { fx: { flags: ['met_vesper'], know: ['k_p_vesper'] } },
  ] },
  { id: 'vesper_direttiva', npc: 'vesper', title: 'Le direttive.', cond: { flag: 'met_vesper' }, lines: [
    S('vesper', '«Sono affisse in Reception. Lei può rispettarle, o può non rispettarle e farmelo sapere, o può non rispettarle e scrivere il contrario nel rapporto.» Ti guarda. «Conosco tutte e tre le specie di scrivano. La terza dura meno di quanto crede.»'),
    { ui: 'directives' },
  ] },
  { id: 'vesper_mv', npc: 'vesper', title: 'La sigla M. V. sulle richieste di carta.', cond: { all: [{ know: 'k_sigla_mv' }, { not: { flag: 'vesper_spezzata' } }] }, once: true, lines: [
    S('vesper', 'Non si muove. «Prosegua.»'),
    YOU('La pagina tre del fascicolo Asher è stata rifatta. La carta l\'ha chiesta lei.'),
    S('vesper', '«Sì.»'),
    N('Ti aspettavi una smentita. Non sai che cosa fare di un sì.'),
    S('vesper', '«Le quote non le scrivo io. Arrivano. Tante Prove, tante Ascensioni, tanto Residuo a trimestre. Un reparto che non le raggiunge viene accorpato. Lei sa che cosa significa “accorpare”, per un ufficio fatto di anime a giudizio sospeso?»'),
    S('vesper', '«Io faccio in modo che questo reparto esista ancora il trimestre successivo. Con tutti quelli che ci sono dentro. Se per questo una pagina va riscritta, la riscrivo, e la sigla la metto: non mi nascondo.»'),
    { choice: [
      { t: 'Una donna ha fatto dodici anni di prigione per quella pagina.', fx: { rel: { vesper: -1 } }, lines: [S('vesper', '«Lo so. Ho letto il fascicolo di ritorno. Li leggo tutti.» La voce non cambia. I guanti, sul piano della scrivania, sì: si stringono. «Vada a lavorare, scrivano.»')] },
      { t: 'Capisco. Non lo riferirò.', fx: { rel: { vesper: 2 }, stats: { sospetto: -2 } }, lines: [S('vesper', '«Non le ho chiesto di capire.» Ma dopo un momento: «Grazie».')] },
      { t: 'Riferirò tutto ai Livelli Superiori.', fx: { rel: { vesper: -3 }, stats: { sospetto: 6 }, flags: ['minacciato_vesper'] }, lines: [S('vesper', '«Faccia.» Quasi con dolcezza. «Chi crede che me le mandi, le quote?»')] },
    ] },
  ] },
  { id: 'vesper_c10', npc: 'vesper', title: '(Ti fa cenno di avvicinarti.)', cond: { all: [{ dayMin: 10 }, { dayMax: 10 }, { not: { flag: 'closed_c10' } }] }, once: true, prio: 95, lines: [
    S('vesper', 'Parla senza voltarsi, guardando la sala dalla balaustra. «Oggi le arriverà una pratica. È già compilata. Lei dovrà soltanto timbrare.»'),
    S('vesper', '«In novantasette anni non le ho mai — non ho mai chiesto niente a uno scrivano.» Il velo si muove appena, come se sotto qualcuno avesse deglutito. «La smarrisca. Le pratiche si smarriscono. Gliene sarò… Non so che cosa le sarò. Ma lo sarò.»'),
    YOU('Chi è la sospesa 4471-O?'),
    S('vesper', '«Lo leggerà.» Si volta. Non l\'hai mai vista di fronte, da così vicino. Dietro il velo ha gli occhi di una persona che non dorme da un secolo. «Legga tutto. Poi faccia quello che fa lei. L\'ho vista lavorare. Sei volte.»'),
  ] },
  { id: 'vesper_dopo', npc: 'vesper', title: 'Odile.', cond: { flag: 'closed_c10' }, once: true, prio: 85, lines: [
    { if: { flag: 'vesper_spezzata' }, then: [
      S('vesper', 'Firma un foglio. Lo sposta. Ne firma un altro. Non ha letto né l\'uno né l\'altro.'),
      YOU('Madame.'),
      S('vesper', '«Lo scrivano ha eseguito un\'ordinanza regolare. La Direzione ne prende atto.» Firma. Sposta. Sulla scrivania c\'è una risma nuova, molto bianca, legata con un nastro. Non l\'ha toccata. La tiene dove può vederla.'),
    ], else: [{ if: { flag: 'odile_rinnovo' }, then: [
      S('vesper', '«Ho odiato le sue mani per tutta la notte.» Lo dice piano, senza ostilità. «Poi mi sono accorta di una cosa. Era sera, e io non dovevo salire alla nicchia. Mi sono seduta. Non mi sedevo, di sera, da novantasette anni.»'),
      S('vesper', '«Da qualche parte c\'è una bambina che non mi aspetta. Non so se la perdonerò, scrivano. Ma credo di averla già ringraziata, da qualche parte dove non mi sento.»'),
      { fx: { rel: { vesper: 3 } } },
    ], else: [{ if: { flag: 'odile_forma' }, then: [
      S('vesper', 'Sta annaffiando la piantina di tiglio con un bicchiere. «Cresce verso la finestra» dice. «Non c\'è niente, fuori da quella finestra. Cresce lo stesso.»'),
      S('vesper', '«Le leggo ancora, la sera. Ma non il regolamento.» Posa il bicchiere. «Ho scoperto di ricordare delle filastrocche. Non sapevo di averle tenute.»'),
      { fx: { rel: { vesper: 2 } } },
    ], else: [{ if: { flag: 'odile_nicchia' }, then: [
      S('vesper', '«Le ha comprato del tempo.» Non ti guarda. «Stanotte ho contato le righe sulle sue unghie. Sono una in più di ieri. Lei lo sapeva, quando ha firmato? Che il tempo, là dentro, è quello che la consuma?»'),
      S('vesper', '«Non la sto rimproverando. Sto chiedendo a qualcuno, per la prima volta, se ho sbagliato io. Novantasette anni fa.»'),
    ], else: [
      S('vesper', 'Guarda la porta del montacarichi, dall\'alto della pedana. «Non reperibile» dice soltanto. «Lo scriveranno anche di lei. Io l\'ho scritto di tanti.»'),
    ] }] }] }] },
  ] },
  { id: 'vesper_brenner', npc: 'vesper', title: 'Il processo Brenner. Ero il suo cancelliere.', cond: { all: [{ know: 'k_brenner' }, { know: 'k_sette_assunzioni' }, { not: { flag: 'vesper_spezzata' } }] }, once: true, prio: 90, lines: [
    S('vesper', 'Per la prima volta da quando la conosci, si siede.'),
    S('vesper', '«“L\'ho visto.” Ho letto la sentenza su quelle tre parole. E mentre leggevo mi hanno portato un biglietto, e io ho alzato la mano perché aspettassero, e ho finito di leggere.» Si toglie un guanto. La mano, sotto, è la mano di una donna qualsiasi. «Il biglietto diceva che Odile era morta alle quattro. Erano le sei.»'),
    YOU('Il teste aveva detto «non l\'ho visto». L\'errore era mio. Me ne sono accorto e ho taciuto.'),
    S('vesper', '«Lo so. L\'ho saputo qui, dal suo fascicolo, la prima volta che è arrivato.» Una pausa lunghissima. «Sa perché ho firmato cinque volte il suo rinnovo? Non per proteggere l\'ufficio. Perché lei, ogni volta che ricordava, veniva a dirmelo con quella faccia. E io non sopportavo che esistesse un altro, al mondo, a ricordare quel giovedì.»'),
    S('vesper', '«Brenner l\'abbiamo ammazzato in due. Io ho perso una figlia mentre lo facevo, e ho creduto per un secolo che fosse il prezzo. Non era il prezzo. Era solo lo stesso pomeriggio.»'),
    { fx: { know: ['k_stesso_pomeriggio'], rel: { vesper: 2 }, flags: ['vesper_confessa'] } },
  ] },
  { id: 'vesper_ally', npc: 'vesper', title: 'Domani salgo dal Direttore.', cond: { dayMin: 13 }, once: true, prio: 80, lines: [
    { if: { flag: 'vesper_spezzata' }, then: [S('vesper', '«La Direzione ne prende atto.» Firma. Sposta.')],
      else: [{ if: { all: [{ relMin: ['vesper', 1] }, { any: [{ flag: 'odile_libera' }, { flag: 'odile_nicchia' }] }, { not: { flag: 'vesper_accusata' } }] }, then: [
        S('vesper', '«Ho firmato novantasette anni di riforme d\'ufficio. So dove sta ogni atto rifatto, ogni quota, ogni prelievo in più. Li ho siglati tutti.»'),
        S('vesper', '«Se domani lei scrive qualcosa che ha bisogno di un testimone a carico» — raddrizza le spalle — «io sono il testimone migliore che questo edificio possieda. Mi dica dove firmare. Per una volta, leggerò prima.»'),
        { fx: { flags: ['ally_vesper'] } },
      ], else: [
        S('vesper', '«Faccia ciò che deve.» Torna alle sue carte. «Io farò ciò che devo io. È improbabile che coincidano.»'),
      ] }] },
  ] },

  // ============ MR. HOOT ============
  { id: 'hoot_intro', npc: 'hoot', title: 'Presentarsi', once: true, prio: 100, lines: [
    S('hoot', 'Una testa di gufo ruota verso di te — più di quanto una testa dovrebbe — e due occhiali da contabile ti mettono a fuoco. «Oh! Lo scrivano nuovo. Si accomodi, si accomodi. Attento al gradino: non c\'è.»'),
    S('hoot', '«Oswin Hoot, Archivista. Qui c\'è tutto ciò che è stato deciso, in ordine di decisione. L\'Indice delle Reincarnazioni è quel mobile a cassettini: ogni anima, ogni vita, ogni sentenza. Lo consulti quando vuole.»'),
    YOU('E ciò che non è stato deciso?'),
    S('hoot', 'Le piume del collo gli si gonfiano appena. «Che domanda curiosa, per un primo giorno in Archivio.» Sistema gli occhiali. «Se cerca una cosa che c\'è, la chieda. Se cerca una cosa che non c\'è» — abbassa la voce — «la chieda a voce bassa.»'),
    { fx: { flags: ['met_hoot'], know: ['k_p_hoot'], rel: { hoot: 1 } } },
  ] },
  { id: 'hoot_spirale', npc: 'hoot', title: 'Questo timbro non è nel Modulario.', cond: { know: 'sym_spirale' }, once: true, lines: [
    S('hoot', '«No. Non c\'è.» Si toglie gli occhiali e li pulisce a lungo. «Il Modulario l\'ho compilato io. E quella pagina l\'ho tagliata io.»'),
    YOU('Perché?'),
    S('hoot', '«Perché un modulario dice che cosa è regolare. E io non ho voluto essere quello che scriveva che quel timbro lo è.» Rimette gli occhiali. «È una vigliaccheria piccola. Ne ho di più grandi. Non mi chieda altro, per oggi: sono un vecchio uccello e mi spavento.»'),
    { fx: { rel: { hoot: 1 } } },
  ] },
  { id: 'hoot_schedario', npc: 'hoot', title: 'Lo schedario in fondo, quello senza numero.', cond: { all: [{ know: 'sym_spirale_schedario' }, { not: { flag: 'schedario_aperto' } }] }, lines: [
    S('hoot', '«Quale schedario?» Ma lo dice guardando proprio in quella direzione. «In pianta non risulta alcuno schedario.»'),
    S('hoot', '«Se esistesse, avrebbe una combinazione. E io, che dimentico tutto, l\'avrei legata a tre cose che non posso dimenticare: il lotto di carta che finì, il lotto che cominciò, e la scrivania che restò vuota. In quest\'ordine.» Torna alle sue schede. «Ma non esiste. Buona giornata.»'),
    { if: { not: { know: 'k_atti_sostituiti' } }, then: [N('Lotti di carta. Non ne sai ancora niente. Forse qualche fascicolo ne parla.')] },
  ] },
  { id: 'hoot_dimenticati', npc: 'hoot', title: 'Ho aperto lo schedario.', cond: { flag: 'schedario_aperto' }, once: true, lines: [
    S('hoot', '«Ah.» Si siede. Sembra più piccolo. «Bene. Era ora. Sono stanco di essere l\'unico a sapere dov\'è.»'),
    S('hoot', '«Quando rifanno un atto, l\'originale dovrebbe andare ai Torchi. Io lo ritiro prima. Li tengo tutti. Non per coraggio: non ho mai fatto vedere niente a nessuno. Li tengo perché un archivista che lascia distruggere un originale non è più un archivista. È un mobile.»'),
    S('hoot', '«Li chiamo i Dimenticati. Ci sono anche carte che la riguardano, là dentro. Più in fondo. Non le cerchi oggi.»'),
    { fx: { rel: { hoot: 1 } } },
  ] },
  { id: 'hoot_registro_nn', npc: 'hoot', title: 'Mi serve il registro delle Sospensioni.', cond: { all: [{ dayMin: 5 }, { not: { flag: 'doc_nn_registro' } }, { not: { flag: 'closed_c05' } }] }, lines: [
    S('hoot', '«Per la piccola con le dita di carta.» Annuisce. «È sullo scaffale basso, in fondo a destra. Da ieri è “schedario riservato”, per direttiva: dovrei segnalare ogni richiesta.»'),
    S('hoot', '«Io non ho sentito nessuna richiesta. Ho sentito uno scrivano dire “buongiorno”. Buongiorno a lei.» Ti volta le spalle con cura.'),
  ] },
  { id: 'hoot_prelievi', npc: 'hoot', title: 'Il Registro dei Prelievi straordinari.', cond: { all: [{ dayMin: 9 }, { not: { flag: 'doc_ilse_prelievi' } }, { not: { flag: 'closed_c09' } }] }, once: true, lines: [
    S('hoot', '«Non esce dall\'Archivio. È la regola.» Poi prende un registro dal ripiano sotto la scrivania e lo posa, aperto, sul bordo del tavolo, dalla tua parte. «Io però sono vecchio, e lascio le cose in giro.»'),
    S('hoot', '«La dottoressa Marrow mi ha chiesto per anni di toccare i fogli degli ascesi. Io le dicevo: è normale. Non era normale. Lo sapevo. Glielo dica, se la rivede: lo sapevo.»'),
    { fx: { flags: ['doc_ilse_prelievi'] } },
  ] },
  { id: 'hoot_stato', npc: 'hoot', title: 'C\'è uno stato di servizio a mio nome.', cond: { know: 'k_stato_servizio' }, once: true, lines: [
    S('hoot', 'Chiude gli occhi. Tutti e due, lentamente, come fanno i gufi. «L\'ha trovato.»'),
    YOU('È datato undici anni prima che arrivassi.'),
    S('hoot', '«È datato il giorno in cui è arrivato. Quella volta.» Riapre gli occhi. «Non posso dirle di più. Non perché non voglia. Perché le altre volte gliel\'ho detto io, tutto insieme, e lei è salito di corsa su quella scala, e il giorno dopo mi ha chiesto come mi chiamavo.»'),
    S('hoot', '«Stavolta lo trovi un pezzo alla volta. Io le lascio le luci accese.»'),
    { fx: { rel: { hoot: 1 }, know: ['k_ero_io'] } },
  ] },
  { id: 'hoot_denuncia', npc: 'hoot', title: 'Il mio primo rinnovo lo propose lei.', cond: { know: 'k_hoot_denuncia' }, once: true, prio: 90, lines: [
    S('hoot', 'Non risponde subito. Le mani — ha mani d\'uomo, macchiate d\'inchiostro — tremano sul bordo della scrivania.'),
    S('hoot', '«Sì. O. H. Sono io.» Un respiro. «Lei aveva riconosciuto un\'anima. Un certo Brenner. Venne da me a chiedere il fascicolo, e poi a chiedere del Direttore. Ebbi paura. Pensai: se sale, ci accorpano tutti. Scrissi due righe alla Direzione.»'),
    S('hoot', '«Il giorno dopo lei entrò in Archivio e mi disse: “Buongiorno, sono lo scrivano nuovo”. Mi chiese dov\'era l\'Indice.» Gli occhiali gli si appannano. «Ho cominciato a tenere gli originali quella sera. Ogni foglio che salvo è una riga di una lettera di scuse che non ho mai saputo come consegnarle.»'),
    { choice: [
      { t: 'Ha avuto paura. Io ho taciuto, una volta, per lo stesso motivo. La perdono.', fx: { rel: { hoot: 3 }, flags: ['hoot_perdonato'] }, lines: [S('hoot', 'Fa un verso piccolo, da uccello. Poi si ricompone, si soffia il becco in un fazzoletto a quadri. «Sei volte ho sperato che lo trovasse scritto, e sei volte ho sperato di no. Grazie. Adesso so quale delle due volevo.»')] },
      { t: 'Sei vite, Hoot. Me ne ha tolte sei.', fx: { rel: { hoot: -3 }, flags: ['hoot_condannato'] }, lines: [S('hoot', '«Una» dice piano. «Io gliene ho tolta una. Le altre cinque… Ma ha ragione. La prima è quella che conta.» Torna alle schede. Le mette in ordine. Erano già in ordine.')] },
    ] },
  ] },
  { id: 'hoot_ally', npc: 'hoot', title: 'Domani salgo dal Direttore.', cond: { dayMin: 13 }, once: true, prio: 80, lines: [
    { if: { all: [{ relMin: ['hoot', 3] }, { not: { flag: 'hoot_condannato' } }] }, then: [
      S('hoot', '«Allora le servirà questo.» Posa sul tavolo una chiave d\'ottone. «Lo Schedario dei Dimenticati. Tutti gli originali. Se domani qualcuno dovrà dimostrare che cosa ha fatto questo ufficio, la prova è lì, in ordine cronologico, con l\'indice analitico. L\'ho compilato io. È il lavoro di cui vado fiero.»'),
      S('hoot', '«Sono un vecchio uccello pauroso. Ma ho una paura sola, ormai: che lei torni giù a chiedermi come mi chiamo.»'),
      { fx: { flags: ['ally_hoot'] } },
    ], else: [
      S('hoot', '«Sì. Immaginavo.» Sistema una scheda. «Le lascio le luci accese, come sempre.» Non aggiunge altro.'),
    ] },
  ] },

  // ============ IL CUSTODE ============
  { id: 'grell_intro', npc: 'grell', title: 'Presentarsi', once: true, prio: 100, lines: [
    N('È curvo, avvolto in un pastrano che sa di carbone. Porta una lanterna spenta e un mazzo di chiavi che non tintinna: le ha fasciate una per una con lo spago.'),
    S('grell', '«Custode.» Indica la stufa. «Caldaie.» Indica le chiavi. «Porte.» Ha finito.'),
    { fx: { flags: ['met_grell'], know: ['k_p_grell'] } },
  ] },
  { id: 'grell_attesa', npc: 'grell', title: 'Che cosa c\'è nella Sala d\'Attesa?', cond: { flag: 'met_grell' }, once: true, lines: [
    S('grell', '«Panche.»'),
    YOU('E sulle panche?'),
    S('grell', '«Quelli che aspettano.» Ci pensa, con fatica. «Finché parlano.»'),
  ] },
  { id: 'grell_muti', npc: 'grell', title: 'Dove porta quelli che non parlano più?', cond: { know: 'k_grell_muti' }, once: true, lines: [
    S('grell', 'Ti guarda a lungo. Ha occhi chiarissimi, da animale di galleria. «Giù.»'),
    YOU('Ai Torchi.'),
    S('grell', '«Sono leggeri. Non pesano niente, dopo.» Si guarda le mani. «Li porto in braccio. Non li trascino. Si può scrivere, questo? Che non li trascino.»'),
    { fx: { rel: { grell: 1 }, know: ['k_torchi'] } },
  ] },
  { id: 'grell_bottoni', npc: 'grell', title: 'Che cosa tiene in quella scatola?', cond: { all: [{ chapterMin: 2 }, { flag: 'met_grell' }] }, once: true, lines: [
    { doc: 'bottoni' },
  ] },
  { id: 'grell_chiave', npc: 'grell', title: 'Devo entrare nel Reparto Riservato.', cond: { all: [{ dayMin: 12 }, { not: { area: 'restricted' } }] }, prio: 90, lines: [
    { if: { relMin: ['grell', 1] }, then: [
      S('grell', 'Sfascia una chiave dallo spago. È nera, e più pesante di quanto dovrebbe. Te la mette in mano e ti chiude le dita sopra con le sue.'),
      S('grell', '«Non guardare la panca.» Poi, dopo uno sforzo visibile: «Hanno i nomi. Nella mia scatola. Tutti. Diglielo, a quello di sopra. Che hanno i nomi».'),
      { fx: { areas: ['restricted'], flags: ['chiave_grell'] } },
    ], else: [
      S('grell', '«No.» Si rimette le chiavi sotto il pastrano. Non ti conosce abbastanza. O ti conosce.'),
      N('Forse qualcun altro, in questo ufficio, ha un modo per farti scendere.'),
    ] },
  ] },
  { id: 'grell_ally', npc: 'grell', title: 'Domani salgo dal Direttore.', cond: { dayMin: 13 }, once: true, prio: 80, lines: [
    { if: { relMin: ['grell', 2] }, then: [
      S('grell', '«I torchi.» Fa il gesto di una leva. «Si fermano dal basso. C\'è una valvola. La so solo io.»'),
      S('grell', '«Se dici: ferma. Fermo.» Ti guarda. «Mai nessuno ha detto: ferma.»'),
      { fx: { flags: ['ally_grell'] } },
    ], else: [S('grell', 'Annuisce. Accende la lanterna, anche se non è buio, e te la tiene alzata un momento davanti alla faccia, come per ricordarsela.')] },
  ] },

  // ============ ILSE MARROW ============
  { id: 'ilse_intro', npc: 'ilse', title: 'Presentarsi', once: true, prio: 100, cond: { not: { flag: 'ilse_rinnovata' } }, lines: [
    S('ilse', '«Marrow. Consulente dei Colloqui. In vita ero medico: mi è rimasto il vizio di osservare.» Ti osserva. «Lei dorme poco. No — lei non sa se dorme. Interessante.»'),
    S('ilse', '«Le anime mentono per tre motivi: paura, vergogna, amore. Le prime due cedono davanti a un documento. La terza no: per quella deve trovare la contraddizione e metterla sul tavolo con garbo.»'),
    S('ilse', '«Confronti sempre due cose che non possono essere vere insieme. E quando ha un dubbio, mi chiami. Preferisco un colloquio in più che un timbro in meno.»'),
    { fx: { flags: ['met_ilse'], know: ['k_p_ilse'], rel: { ilse: 1 } } },
  ] },
  { id: 'ilse_bianca', npc: 'ilse', title: '(Ti guarda senza riconoscerti.)', cond: { flag: 'ilse_rinnovata' }, once: true, prio: 100, lines: [
    S('ilse', '«Buongiorno! Marrow, Consulente dei Colloqui. Lei dev\'essere lo scrivano della sette.» Ti tende la mano. Stessa mano, stessa stretta. «È nuovo? Io credo di esserlo. Non trovo le mie penne: qualcuno deve averle spostate.»'),
    N('Sulla scrivania ci sono le sue penne, dove le ha sempre tenute. Le guarda e non le vede.'),
    S('ilse', '«Mi hanno detto che lei è molto diligente. Lavoreremo bene.» Sorride. È un sorriso gentile, e non c\'è nessuno dietro.'),
    { fx: { stats: { anomalie: 1 } } },
  ] },
  { id: 'ilse_consiglio', npc: 'ilse', title: 'Un consiglio sui colloqui.', cond: { all: [{ flag: 'met_ilse' }, { not: { flag: 'ilse_rinnovata' } }, { not: { flag: 'ilse_torchi' } }] }, lines: [
    S('ilse', '«Non chieda mai “perché l\'ha fatto”. Chieda “che cosa ha visto”. Il perché se lo sono raccontato per una vita intera ed è lucidissimo. Quello che hanno visto, invece, non hanno avuto il tempo di aggiustarlo.»'),
  ] },
  { id: 'ilse_ascesi', npc: 'ilse', title: 'Che cosa pensa dell\'Ascensione?', cond: { all: [{ chapterMin: 2 }, { chapterMax: 3 }, { flag: 'met_ilse' }, { not: { flag: 'ilse_rinnovata' } }, { not: { flag: 'closed_c09' } }] }, once: true, lines: [
    S('ilse', 'Smette di scrivere. «Perché me lo chiede?»'),
    YOU('Curiosità.'),
    S('ilse', '«La curiosità è una febbre. Me ne intendo.» Chiude il quaderno, e ci tiene sopra la mano. «Penso che un medico che manda i pazienti in un reparto da cui non torna mai nessuno, a un certo punto, dovrebbe chiedere di visitarlo. E che il fatto che nessuno glielo lasci fare sia già una diagnosi.»'),
    { fx: { rel: { ilse: 1 } } },
  ] },
  { id: 'ilse_torchi', npc: 'ilse', title: 'Dottoressa.', cond: { flag: 'ilse_torchi' }, once: true, prio: 100, lines: [
    N('Ha le maniche rimboccate e gli avambracci grigi di polpa di carta. Sta scrivendo qualcosa su un cartellino legato a un filo.'),
    S('ilse', '«Scrivano. Benvenuto al piano di sotto.» Ti mostra il cartellino: un nome. «Grell li scriveva con la grafia di un bambino. Adesso li scrivo io. Prima di ogni carico chiedo il nome. Qualcuno se lo ricorda ancora.»'),
    S('ilse', '«Lei mi ha mandata nell\'unico posto di questo edificio dove si vede tutto. Non so se ringraziarla. Ma se domani le servisse qualcuno che ha visto — ho visto.»'),
    { fx: { flags: ['ally_ilse'] } },
  ] },
  { id: 'ilse_ally', npc: 'ilse', title: 'Domani salgo dal Direttore.', cond: { all: [{ dayMin: 13 }, { not: { flag: 'ilse_rinnovata' } }, { not: { flag: 'ilse_torchi' } }] }, once: true, prio: 80, lines: [
    S('ilse', '«Trentuno verbali alterati, e sono ancora qui a dirglielo. Grazie a lei.»'),
    S('ilse', '«Se lassù le chiedono chi può testimoniare che cosa torna giù dall\'Ascensione: io ho le temperature. Annotate, datate. Un medico tiene sempre la cartella.»'),
    { fx: { flags: ['ally_ilse'] } },
  ] },

  // ============ ISPETTORE QUILL ============
  { id: 'quill_intro', npc: 'quill', title: 'Presentarsi', once: true, prio: 100, lines: [
    { fx: { flags: ['met_quill'] } },
    S('quill', '«Lo scrivano della 7.» Le voci sono almeno quattro, non del tutto sincronizzate. «Noi abbiamo letto i suoi atti. Tutti.»'),
    { if: { statMin: ['irregolari', 4] }, then: [S('quill', '«Lo scrivano ha una grafia regolare e dei giudizi irregolari. Noi troviamo la combinazione… istruttiva.»')],
      else: [S('quill', '«Lo scrivano è regolare. Noi apprezziamo ciò che è regolare. Dura.»')] },
    S('quill', '«Una domanda. In Archivio risulterebbe uno schedario non compreso in pianta, nel quale un dipendente tratterrebbe atti destinati ai Torchi. Lo scrivano ne ha notizia?»'),
    { choice: [
      { t: 'Nessuna notizia.', fx: { rel: { hoot: 1 } }, lines: [S('quill', '«Annotiamo: nessuna notizia.» Una delle mani scrive, dietro la schiena. Senti la penna. «Lo scrivano sappia che noi annotiamo anche ciò che non viene detto.»')] },
      { t: 'L\'Archivista Hoot conserva gli originali degli atti sostituiti.', cond: { know: 'k_hoot_dimenticati' }, fx: { npcStatus: { hoot: 'scomparso' }, flags: ['hoot_denunciato'], stats: { reputazione: 12, morale: -10 }, rel: { bones: -4, quill: 3, vesper: 1 } }, lines: [
        S('quill', '«Annotiamo.» Tutte le voci insieme, questa volta, perfettamente sincronizzate. «Lo scrivano è molto utile.»'),
        N('Quando scendi in Archivio, più tardi, la scrivania dell\'Archivista è in ordine. Gli occhiali sono piegati sul Modulario. La lampada verde è accesa. Non c\'è nessuno.'),
        N('Lo schedario senza numero non c\'è più. Sul pavimento, dove stava, c\'è un rettangolo di pietra più chiara.'),
      ] },
      { t: 'Gli atti destinati ai Torchi? Che cosa sono i Torchi?', lines: [S('quill', 'Silenzio. Le dita, dietro la schiena, smettono di muoversi. «Lo scrivano prosegua il suo lavoro.» Hai l\'impressione di aver fatto la domanda giusta alla cosa sbagliata.')] },
    ] },
  ] },
  { id: 'quill_permesso', npc: 'quill', title: 'Chiedo l\'accesso al Reparto Riservato.', cond: { all: [{ dayMin: 12 }, { not: { area: 'restricted' } }] }, prio: 90, lines: [
    { if: { statMin: ['reputazione', 60] }, then: [
      S('quill', '«Lo scrivano è affidabile. Lo scrivano può vedere.» Una mano — la terza — ti porge un lasciapassare. È tiepido. «Noi desideriamo che lo scrivano veda. Chi vede comprende la necessità.»'),
      { fx: { areas: ['restricted'], flags: ['permesso_quill'] } },
    ], else: [
      S('quill', '«No.» Senza inflessione. «Lo scrivano non gode della necessaria reputazione.»'),
    ] },
  ] },
  { id: 'quill_c11', npc: 'quill', title: 'Il Rientrato.', cond: { all: [{ dayMin: 11 }, { dayMax: 11 }, { not: { flag: 'closed_c11' } }] }, once: true, prio: 95, lines: [
    S('quill', 'Per la prima volta le voci non sono calme. «Quello è nostro. Quello siamo noi. Lo scrivano lo restituisca.»'),
    S('quill', '«Senza di esso non c\'è consenso. Senza consenso non c\'è ordinanza. Senza ordinanza» — le mani si stringono tra loro, troppe — «non c\'è noi.»'),
    { fx: { know: ['k_collegio_bloccato'] } },
  ] },

  // ============ COMPARSE ============
  { id: 'scrivano3_bark', npc: 'scrivano3', title: 'Buongiorno.', lines: [
    { if: { chapterMax: 2 }, then: [N('Lo Scrivano della 3 non alza la testa. Sta ricopiando una pagina su un\'altra pagina identica. Quando ha finito, ricomincia.')],
      else: [N('Lo Scrivano della 3 alza la testa. Ti guarda. Apre la bocca come per dire una cosa urgente. Poi la richiude, e ricomincia a ricopiare. Sulla pagina, ti accorgi, ha scritto cento volte la stessa parola: «prima».')] },
  ] },
  { id: 'scrivano6_bark', npc: 'scrivano6', title: 'Buongiorno.', lines: [
    S('scrivano6', '«Sst.» Indica la pedana con il mento, senza smettere di timbrare. «Ci guarda. Timbri qualcosa.»'),
  ] },
  { id: 'tea_bark', npc: 'tea', title: 'Come stai, Tea?', lines: [
    { fx: { know: ['k_p_tea'] } },
    { if: { flag: 'tea_parlato' }, then: [S('tea', '«Ho contato i cassetti dell\'Indice. Sono più dei numeri che so. Il signor Hoot dice che posso inventarne di nuovi.»')],
      else: [
        S('tea', '«Bene! Qui non si scrive più.» Ti mostra la mano: le dita sono ancora fogli, ma fermi, asciutti. «Il signor Hoot mi fa mettere a posto le schede basse. Dice che ho le dita giuste.»'),
        S('tea', '«Canto piano, così non disturbo. Però canto. Se la mamma passa, mi sente.»'),
        { fx: { flags: ['tea_parlato'], rel: { hoot: 1 } } },
      ] },
  ] },
  { id: 'sabina_bark', npc: 'sabina', title: 'Sabina.', lines: [
    S('soul', '«Aspetto. Ma qui si aspetta meglio.» Accanto alla sua branda ne ha preparata un\'altra, con la coperta rimboccata. «Quando arriva, non voglio che trovi il posto freddo.»'),
  ] },

  // ============ OGGETTI: SALA DEI GIUDIZI ============
  { id: 'o_scrivania7', obj: 'scrivania7', lines: [
    { if: { not: { flag: 'at_desk' } }, then: [
      N('La scrivania 7. Legno scuro, un sottomano di cuoio, una lampada, un timbro a cinque facce. Il piano è stato spolverato da poco, ma sotto la polvere tolta c\'è l\'ombra di altra polvere: è rimasta vuota a lungo.'),
      N('Ti siedi. La sedia è regolata alla tua altezza.'),
      { fx: { flags: ['at_desk'], know: ['k_scrivania7'] } },
    ] },
    { ui: 'desk' },
  ] },
  { id: 'o_cassetto', obj: 'colonna_a', cond: { not: { know: 'k_cassetto_penna' } }, prio: 5, lines: [
    N('La colonna accanto alla tua scrivania. A mezza altezza, dal lato che dalla Direzione non si vede, qualcuno ha inciso con un pennino una fila di numeri romani: I, II, III, IV, V, VI. Sono stati raschiati via uno per uno. Si leggono lo stesso.'),
    N('Nel cassetto della scrivania, che apri per cercare una gomma, c\'è una penna. È consumata. L\'impugnatura è scavata in due punti: ci appoggi le dita e combaciano.'),
    { fx: { know: ['k_cassetto_penna', 'k_scrivania7'] } },
  ] },
  { id: 'o_colonna', obj: 'colonna_a', lines: [N('I numeri raschiati sono ancora lì. Sotto il VI c\'è spazio per un altro.')] },
  { id: 'o_bones_desk', obj: 'scrivania_bones', cond: { all: [{ chapterMin: 3 }, { not: { know: 'k_tacche_bones' } }] }, prio: 5, lines: [
    N('Aspetti che Mr. Bones sia al samovar. Ti chini. Sotto il piano della sua scrivania, vicino alla gamba destra, ci sono delle tacche fatte col temperino.'),
    N('Sei. Le prime sono nere di vecchiaia. L\'ultima è più chiara: avrà una decina d\'anni. Accanto c\'è lo spazio per una settima, e il legno, lì, è già stato lisciato col pollice molte volte.'),
    { fx: { know: ['k_tacche_bones'] } },
  ] },
  { id: 'o_bones_desk2', obj: 'scrivania_bones', lines: [N('La scrivania 1. Ogni cosa è al suo posto da così tanto tempo che ha lasciato l\'impronta nel legno.')] },
  { id: 'o_scrivania3', obj: 'scrivania3', lines: [N('La scrivania 3. Due pile di fogli: quelli da ricopiare e quelli ricopiati. Sono alte uguali.')] },
  { id: 'o_scrivania4', obj: 'scrivania4', lines: [
    N('Una scrivania coperta da un telo. Sollevi un lembo: il piano è pulito, il calamaio pieno. Sul sottomano, un cartoncino: «Riservata. In attesa di assegnazione».'),
    { if: { flag: 'ilse_rinnovata' }, then: [N('L\'inchiostro del calamaio è fresco. Qualcuno lo rabbocca.')] },
  ] },
  { id: 'o_scrivania5', obj: 'scrivania5', lines: [N('Sotto il telo, una scrivania identica alla tua. Sul bordo, il numero è stato tolto: restano i due fori delle viti.')] },
  { id: 'o_scrivania6', obj: 'scrivania6', lines: [N('La scrivania 6. La Scrivana timbra senza guardare. Il timbro cade sempre nello stesso punto: ha scavato una conca.')] },
  { id: 'o_pendola', obj: 'pendola', lines: [
    { if: { know: 'k_orologio' }, then: [N('La pendola segna un\'ora plausibile. Il pendolo, però, va da destra a sinistra e non torna: va da destra a sinistra, e poi di nuovo da destra a sinistra.')],
      else: [N('Una pendola di noce, più alta di te. Il quadrante non ha il dodici: al suo posto c\'è una piccola spirale. Tiene il tempo con un passo lento, da infermiere di notte.')] },
  ] },
  { id: 'o_tubo', obj: 'tubo', lines: [
    N('La posta pneumatica. Tre bocche d\'ottone: «Direzione», «Archivio», e una terza con la targhetta svitata.'),
    { if: { chapterMin: 4 }, then: [N('Dalla terza bocca esce aria tiepida, a intervalli. Regolari. Ci metti la mano davanti: è un respiro.'), { fx: { stats: { anomalie: 1 } } }] },
  ] },
  { id: 'o_pile', obj: 'pile_a', lines: [N('Le pratiche pendenti. Ogni cartella è un\'anima che aspetta in corridoio che qualcuno abbia tempo.'), { ui: 'office' }] },
  { id: 'o_porta_attesa', obj: 'porta_attesa', lines: [
    N('La Sala d\'Attesa. Una porta doppia, imbottita di cuoio verde, con borchie d\'ottone. Non ha maniglia da questa parte.'),
    { if: { chapterMin: 2 }, then: [N('Avvicini l\'orecchio. Voci. Poche. Una conta. Una recita un indirizzo. Una, molto vicina alla porta, dice soltanto: «…ancora qui, ancora qui, ancora qui».')],
      else: [N('Dall\'interno non viene alcun suono. È una stanza molto ben isolata. O molto educata.')] },
    { if: { flag: 'rientrato_attesa' }, then: [N('Qualcuno, là dentro, canta. E gli altri — tutti — le vanno dietro.')] },
  ] },
  { id: 'o_porta_prova', obj: 'porta_prova', lines: [N('La Prova. Una porta stretta, di ferro, con uno spioncino. Lo spioncino è dalla parte di dentro.')] },
  { id: 'o_porta_forma', obj: 'porta_forma', lines: [N('L\'Altra Forma. Una porticina alta fino al tuo ginocchio. Ogni volta che la guardi ti sembra di una misura diversa: adesso, per esempio, ci passerebbe giusto un gatto.')] },
  { id: 'o_montacarichi', obj: 'montacarichi', lines: [
    N('Il montacarichi dell\'Ascensione. Un cancelletto d\'ottone lucidissimo, una cabina foderata di velluto. Sopra la porta, un contatore di piani a rulli.'),
    N('Cerchi il pulsante di chiamata. Non c\'è. C\'è solo, dentro la cabina, una leva con una posizione sola: SU.'),
    { if: { flag: 'closed_c11' }, then: [N('Il contatore, adesso, ha una cifra in più sulla sinistra. È un segno meno.')] },
    { fx: { know: ['k_montacarichi'] } },
  ] },
  { id: 'o_porta_rinnovo', obj: 'porta_rinnovo', lines: [
    N('Il Rinnovatore. Una porta girevole di vetro e ottone, come quella di un grande albergo. Gira piano, sempre, anche quando non passa nessuno.'),
    N('Chi entra da un lato non esce dall\'altro. Dall\'altro esce soltanto un filo d\'aria, che sa di bucato.'),
  ] },
  // ============ OGGETTI: RECEPTION ============
  { id: 'o_portone', obj: 'portone', lines: [
    N('Il portone. Due battenti di quercia alti quattro metri. Dal lato interno non c\'è serratura: non è fatto per chiudere fuori qualcuno.'),
    { if: { chapterMin: 3 }, then: [N('Provi a spingere. Si apre di un dito. Fuori c\'è nebbia, e nella nebbia una fila. Non ne vedi la fine. Nessuno, nella fila, parla.')] },
  ] },
  { id: 'o_bancone', obj: 'bancone', lines: [N('Il bancone dell\'Accettazione. Un campanello d\'ottone, un pennino, un tampone. Il legno, dove la Signorina Pim appoggia i gomiti, è scavato in due conche profonde un dito.')] },
  { id: 'o_panca', obj: 'panca_a', lines: [
    N('Una panca per chi attende il proprio turno. Il sedile è lucido d\'uso.'),
    { if: { know: 'k_carta_anime' }, then: [N('Guardi meglio le venature. Non sai più se vuoi continuare a guardare le venature.')] },
  ] },
  { id: 'o_registro', obj: 'registro_arrivi', lines: [{ doc: 'registro_arrivi' }] },
  { id: 'o_bacheca', obj: 'bacheca', lines: [N('La bacheca delle Direttive. I fogli nuovi sono appuntati sopra i vecchi: lo strato è spesso un palmo.'), { ui: 'directives' }] },
  { id: 'o_pianta', obj: 'pianta_a', lines: [N('Una pianta d\'appartamento. È morta da tempo, e tuttavia qualcuno la annaffia: la terra è umida.')] },
  // ============ OGGETTI: AREA DIPENDENTI ============
  { id: 'o_stufa', obj: 'stufa', lines: [
    N('Una stufa di ghisa. Ticchetta come un orologio. Dallo sportello viene una luce rossa.'),
    { if: { know: 'k_carta_anime_conferma' }, then: [N('Il Custode la carica a carbone. Non a carta. La carta di questo ufficio non brucia: adesso sai perché.')] },
  ] },
  { id: 'o_samovar', obj: 'samovar', lines: [N('Il samovar. Il tè non sa di niente, ma è caldo. Ne bevi una tazza in piedi.'), { ui: 'rest' }] },
  { id: 'o_armadietti', obj: 'armadietti', lines: [
    { if: { flag: 'letto_armadietto' }, then: [N('Il tuo armadietto. Il cappotto è ancora lì, piegato. Ti va perfettamente: l\'hai provato.')],
      else: [{ if: { dayMin: 3 }, then: [{ doc: 'lettera_armadietto' }], else: [N('Armadietti di lamiera, numerati. Il 7 è chiuso con un lucchetto a combinazione che non ti hanno dato. Pim ha detto che «te lo ricorderai».')] }] },
  ] },
  { id: 'o_marcatempo', obj: 'marcatempo', lines: [{ ui: 'endday' }] },
  { id: 'o_tavolo_dip', obj: 'tavolo_dip', lines: [
    N('Il tavolo del personale. Tazze spaiate, un mazzo di carte a cui mancano i re.'),
    { if: { chapterMin: 3 }, then: [N('Qualcuno ha lasciato una partita a metà. Le mani in gioco sono quattro. Le sedie sono due.')] },
  ] },
  { id: 'o_branda', obj: 'branda_a', lines: [N('Una branda per i turni lunghi. Ti ci stendi un momento.'), { ui: 'rest' }] },
  // ============ OGGETTI: SALE COLLOQUI ============
  { id: 'o_scrivania_ilse', obj: 'scrivania_ilse', cond: { all: [{ dayMin: 9 }, { not: { flag: 'doc_ilse_cassetto' } }, { not: { flag: 'closed_c09' } }] }, prio: 5, lines: [
    N('La scrivania della Consulente. Il cassetto non è chiuso a chiave: Ilse Marrow non chiude a chiave niente. Dentro, sotto le penne, c\'è un quaderno.'),
    N('Lo prendi. È per l\'indagine. Te lo ripeti.'),
    { fx: { flags: ['doc_ilse_cassetto'] } },
  ] },
  { id: 'o_scrivania_ilse2', obj: 'scrivania_ilse', lines: [N('La scrivania della Consulente. Penne in fila per lunghezza, un termometro da medico usato come segnalibro.')] },
  { id: 'o_armadio_ilse', obj: 'armadio_ilse', lines: [N('Verbali di colloquio, rilegati per annata. Diciannove annate. Su ogni costola, la stessa mano ordinata.')] },
  { id: 'o_schedario_tiepido', obj: 'schedario_tiepido', lines: [
    N('Lo schedario nuovo. Legno chiaro, quattro cassetti, maniglie d\'ottone.'),
    N('Apri il primo. Fa un piccolo sospiro. Dentro ci sono dei verbali, in ordine perfetto, per lunghezza. Appoggi il palmo sul fianco del mobile.'),
    N('È tiepido. La temperatura di una fronte.'),
    { fx: { stats: { anomalie: 1 } } },
  ] },
  { id: 'o_tavolo_col2', obj: 'tavolo_col2', lines: [N('Il tavolo dei colloqui. Due sedie. Quella dell\'anima è inchiodata al pavimento: «perché non si avvicinino», ti hanno detto. O perché non si allontanino.')] },
  { id: 'o_apparecchio', obj: 'apparecchio', cond: { all: [{ dayMin: 9 }, { not: { flag: 'doc_ilse_cilindri' } }, { not: { flag: 'closed_c09' } }] }, prio: 5, lines: [
    N('L\'apparecchio a cilindri. Una tromba d\'ottone, un rullo di cera, una manovella. Nello scomparto ci sono i cilindri incisi, ciascuno con data e ora.'),
    N('Ne monti uno. La voce di un\'anima, sottile: «Non ho rimpianti». Poi la voce di Ilse, più vicina: «Annoto: nessun rimpianto». Non è quello che ha annotato.'),
    N('Prendi i cilindri delle date indicate nell\'ordine d\'indagine.'),
    { fx: { flags: ['doc_ilse_cilindri'] } },
  ] },
  { id: 'o_apparecchio2', obj: 'apparecchio', lines: [N('L\'apparecchio gira a vuoto, con un fruscio di cera. Incide anche il silenzio. Ci sono armadi interi di silenzio, in Archivio.')] },
  { id: 'o_specchio', obj: 'specchio', lines: [
    { if: { chapterMin: 3 }, then: [
      N('Lo specchio della Sala 2. Riflette il tavolo, le due sedie, te.'),
      N('E una terza sedia, contro il muro, che nella stanza non c\'è. Qualcuno ci è seduto, di spalle. Ha il tuo cappotto. Sta scrivendo.'),
      N('Ti volti. Niente sedia. Ti rivolti. Nello specchio, la figura ha smesso di scrivere. Ha alzato appena la testa, come chi ha sentito qualcuno entrare.'),
      { fx: { know: ['k_specchio'], stats: { anomalie: 1 } } },
    ], else: [N('Uno specchio a figura intera, in una cornice annerita. «Serve alle anime» ha detto qualcuno «per abituarsi a non riconoscersi.»')] },
  ] },
  // ============ OGGETTI: ARCHIVIO ============
  { id: 'o_scaffali', obj: 'scaffale_n3', lines: [
    N('Scaffali. Salgono oltre il punto in cui la lampada arriva. Ogni costola un numero, ogni numero una vita.'),
    { if: { know: 'k_fascicoli_tiepidi' }, then: [N('Passi il dorso della mano lungo una fila. Freddi. Freddi. Freddi. Uno tiepido. Ritiri la mano.')] },
  ] },
  { id: 'o_schedario', obj: 'schedario_dimenticati', lines: [
    { if: { npc: ['hoot', 'scomparso'] }, then: [N('Dove stava lo schedario c\'è un rettangolo di pietra più chiara. E, in un angolo, una piuma.')],
      else: [{ if: { flag: 'schedario_aperto' }, then: [
        N('Lo Schedario dei Dimenticati. Gli originali, in ordine. Ogni foglio ha un cartellino: «sostituito il…», «riforma d\'ufficio», «per quota».'),
        { if: { all: [{ chapterMin: 3 }, { not: { know: 'k_sentenza_doppia' } }] }, then: [N('Più in fondo ci sono cartelle con una sigla che conosci. Tante. Non le apri. Non ancora.')] },
      ], else: [
        N('In fondo all\'ultima corsia c\'è uno schedario di ferro che non compare nella pianta appesa all\'ingresso. Non ha numero.'),
        N('Sul fianco è inciso un segno che conosci — ma qui la spirale è intera, rotonda, antica. Il taglio che la spezza è stato aggiunto dopo, a punta di temperino, da una mano che tremava.'),
        { fx: { know: ['sym_spirale_schedario'], puzzle: 'schedario' } },
      ] }] },
  ] },
  { id: 'o_hoot_desk', obj: 'scrivania_hoot', lines: [{ doc: 'modulario' }] },
  { id: 'o_leggio', obj: 'leggio', lines: [{ doc: 'regolamento' }] },
  { id: 'o_indice', obj: 'indice', lines: [N('L\'Indice delle Reincarnazioni. Migliaia di cassettini d\'ottone. Tiri il tuo: scorre senza attrito.'), { ui: 'archive' }] },
  { id: 'o_reg_sosp', obj: 'registro_sospensioni', cond: { all: [{ dayMin: 5 }, { not: { flag: 'doc_nn_registro' } }, { not: { flag: 'closed_c05' } }] }, prio: 5, lines: [
    N('I registri delle Sospensioni. Uno per decennio. Cerchi all\'indietro: sessant\'anni, sessantatré.'),
    N('«Naufragio dell\'“Aurora”». Tre bambine sospese lo stesso giorno. Stacchi la pagina con cura e la aggiungi al fascicolo.'),
    { if: { flag: 'dir_d_archivio' }, then: [N('La Direttiva 3 vieta questa consultazione. L\'hai fatta.')] },
    { fx: { flags: ['doc_nn_registro'], vars: { arch_today: 1 } } },
  ] },
  { id: 'o_reg_sosp2', obj: 'registro_sospensioni', lines: [
    N('I registri delle Sospensioni. Nomi, date, e una colonna intitolata «esito». Nella colonna «esito» c\'è quasi sempre la stessa parola, abbreviata: «conf.».'),
    { if: { know: 'k_carta_anime_conferma' }, then: [N('Conferita.')] },
  ] },
  { id: 'o_personale', obj: 'scaffale_personale', lines: [
    { if: { dayMin: 6 }, then: [{ doc: 'stato_servizio' }], else: [N('Gli stati di servizio del personale, in ordine alfabetico. Sono pochi. Per un ufficio così antico, sono davvero pochi.')] },
  ] },
  { id: 'o_cancello', obj: 'cancello_riservato', lines: [
    N('In fondo all\'Archivio c\'è un cancello di ferro. Al centro, fusa nel metallo, una spirale spezzata grande quanto una persona.'),
    { fx: { know: ['sym_spirale_cancello'] } },
    { if: { area: 'restricted' }, then: [N('È aperto.')], else: [{ if: { dayMin: 12 }, then: [N('Oggi devi passare di qui. Qualcuno, in questo ufficio, ha la chiave — o l\'autorità — per aprirlo.')], else: [N('Da sotto viene un rumore regolare, molto lento, come di una pressa. E un odore di carta bagnata.')] }] },
  ] },
  // ============ OGGETTI: DIREZIONE ============
  { id: 'o_vesper_desk', obj: 'scrivania_vesper', lines: [
    N('La scrivania della Direzione. Tre pile: «Quote», «Riforme», «Varie». La pila delle Riforme è la più alta.'),
    { if: { flag: 'odile_macerata' }, then: [N('E una risma di carta molto bianca, legata con un nastro da capelli. Intatta.')] },
    { ui: 'office' },
  ] },
  { id: 'o_armadio_dir', obj: 'armadio_dir_b', lines: [
    N('Faldoni di direttive, per trimestre. Li scorri. Le quote crescono a ogni trimestre: di poco, ma sempre. Non c\'è un solo trimestre, in tutto l\'armadio, in cui diminuiscano.'),
  ] },
  { id: 'o_cassaforte', obj: 'cassaforte', lines: [
    { if: { know: 'k_patto_vesper' }, then: [N('Nella cassaforte, lo sai ormai, c\'è un solo foglio: un titolo di sospensione, controfirmato.')],
      else: [N('Una cassaforte a muro. Lo sportello ha due serrature. Una è consumata dall\'uso. L\'altra non è mai stata toccata.')] },
  ] },
  { id: 'o_tiglio', obj: 'tiglio', lines: [N('Una piantina di tiglio in un vaso di coccio. Ha messo due foglie nuove. Sono rivolte verso la scrivania.')] },
  { id: 'o_porta_direttore', obj: 'porta_direttore', lines: [
    { if: { area: 'director' }, then: [N('Il vetro smerigliato è socchiuso.')], else: [
      N('L\'ufficio del Direttore. Vetro smerigliato, lettere dorate: «IL DIRETTORE». Sotto, più piccolo: «Riceve».' ),
      N('Nessun orario. Dietro il vetro, una luce. Ogni tanto la luce si abbassa, come quando qualcosa di grande ci passa davanti. Bussi. Il suono non è quello del vetro: è sordo, come bussare su un fianco.'),
      { fx: { know: ['k_p_direttore'] } },
    ] },
  ] },
  // ============ OGGETTI: REPARTO RISERVATO ============
  { id: 'o_barattoli', obj: 'barattoli', lines: [
    N('Scaffali di barattoli. Vetro spesso, tappo di sughero, ceralacca. In ognuno c\'è qualcosa di pallido che si muove piano, come un respiro sotto un lenzuolo. Ogni etichetta porta un nome e una riga: «il nome della madre». «Il peso di una pagnotta». «Un motivo cantato».'),
    N('Su uno scaffale a parte ce ne sono sei, in fila, numerati da I a VI. Sull\'etichetta di tutti e sei c\'è lo stesso nome.'),
    N('È il tuo.'),
    N('Nel barattolo VI, quello che si muove si avvicina al vetro, dalla tua parte, e ci resta appoggiato.'),
    { fx: { know: ['k_barattoli'], stats: { anomalie: 1 } } },
  ] },
  { id: 'o_torchio', obj: 'torchio', lines: [
    N('Il torchio. La vite è grossa come un tronco. Il piano inferiore è coperto da un feltro grigio, ancora umido.'),
    N('Nel feltro c\'è un\'impronta. Non è una sagoma: non è così semplice. È una pressione, la memoria di una pressione, e ha all\'incirca la lunghezza di una persona distesa.'),
    { if: { flag: 'odile_macerata' }, then: [N('Ce n\'è una più corta, accanto. Recente.')] },
  ] },
  { id: 'o_panca_torchi', obj: 'panca_torchi', lines: [N('La panca. È uguale a quelle della Reception. Grell ha detto di non guardarla. La guardi. Qualcuno, col dito, ha scritto nella polvere del sedile: «ancora qui».')] },
  { id: 'o_risme', obj: 'risme', lines: [
    N('Risme di carta nuova, legate con lo spago. Lotto 14/B. Ne sollevi un foglio controluce.'),
    N('La filigrana non è un marchio. È una venatura fine, irregolare, che si dirama da un punto. Hai già visto quel disegno: sul dorso di una mano.'),
    { fx: { know: ['k_carta_anime_conferma'] } },
  ] },
  { id: 'o_fascicolo7', obj: 'fascicolo7', lines: [
    { if: { flag: 'has_file7' }, then: [N('Il leggio è vuoto. Il fascicolo è sulla tua scrivania.')], else: [
      N('Su un leggio, sotto una candela, c\'è un fascicolo spesso quanto sette fascicoli. Sulla costola, un numero: 7. E un nome.'),
      N('Non è stato nascosto. È stato messo dove lo avresti trovato. Accanto, sul leggio, la cera di sei candele precedenti.'),
      N('Lo prendi. Pesa come una cosa già portata.'),
      { fx: { flags: ['has_file7'], queue: ['c12'] } },
    ] },
  ] },
  // ============ OGGETTI: UFFICIO DEL DIRETTORE ============
  { id: 'o_direttore', obj: 'scrivania_direttore', lines: [
    { if: { flag: 'closed_c13' }, then: [N('La scrivania è vuota.')], else: [
      N('Una scrivania. È la più vecchia che tu abbia mai visto: il legno è diventato pietra. Sopra c\'è un solo fascicolo, sottile, e un timbro a cinque facce identico al tuo.'),
      N('Dall\'altra parte non c\'è una sedia. Ci sono i barattoli, fino al soffitto.'),
      { fx: { openCase: 'c13' } },
    ] },
  ] },
];
