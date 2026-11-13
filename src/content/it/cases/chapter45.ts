// CAPITOLI IV e V — The Higher Authority / The Final Judgment.
import type { CaseDef, GameState } from '../../../engine/types';

const T = (e: number, a: number, o: number, c: number, r: number, am: number) => ({
  empatia: e, altruismo: a, onesta: o, coraggio: c, responsabilita: r, ambizione: am,
});

export const C10: CaseDef = {
  id: 'c10',
  title: 'Sospesa n. 4471-O',
  type: 'anomalia_amministrativa',
  soulId: 'S-ODILE',
  incarnation: {
    name: 'Odile Halle', ageAtDeath: 11, origin: 'Altenmark', era: 'secolo delle ciminiere',
    occupation: 'scolara', cause: 'difterite',
    traits: T(7, 5, 7, 5, 6, 2),
    bio: 'Figlia unica della giudice Maud Halle, nata Vesper. Morta in casa, con la governante, mentre la madre presiedeva un\'udienza. In Sala d\'Attesa da novantasette anni, in una nicchia riservata alla Direzione.',
    relations: [
      { name: 'Maud Halle (Madame Vesper)', role: 'madre', note: 'Direttrice di Reparto da novantasette anni. Viene a trovarla ogni sera.' },
    ],
    events: [
      { age: 11, text: 'Si ammala il lunedì. Il giovedì chiede della madre.' },
      { age: 11, text: 'La madre ha dato disposizione di non essere interrotta in udienza. Odile muore alle quattro del pomeriggio.' },
      { age: 11, text: 'Viene sospesa «su istanza della madre, fino a nuova disposizione».' },
    ],
    motivations: ['Smettere di aspettare.', 'Non lasciare sola sua madre.'],
    conflicts: ['Vuole andarsene e non osa dirlo all\'unica persona che glielo impedisce.'],
    memories: ['la voce della madre che legge il regolamento', 'un pomeriggio di giovedì lunghissimo'],
  },
  arrival: 'La porta la Signorina Pim, tenendola per mano con una delicatezza che non le conoscevi. È una bambina in grembiule scuro. I capelli, quando si muove, fanno un rumore di carta velina. Dalla pedana della Direzione, Madame Vesper guarda. Accanto alla tua scrivania, in piedi, l\'Ispettore Quill aspetta con tutte le sue mani dietro la schiena.',
  registration: 'Modulo — già compilato. Ogni casella è riempita da una calligrafia che non appartiene a nessuno dell\'ufficio. Nella casella «data» c\'è il giorno {dopodomani}. Nella casella «esito» c\'è un timbro: ESEGUITO.',
  summary: 'Ordinanza del Collegio per la macerazione di un\'anima sospesa. L\'atto è datato nel futuro e risulta già eseguito. L\'anima è la figlia della tua Direttrice di Reparto.',
  recommended: 'waitingRoom',
  recommendedWhy: 'Ordinanza del Collegio: l\'unico esito conforme è la macerazione (vedi Sentenze speciali). Qualunque altra destinazione è difforme.',
  binding: true,
  docs: [
    {
      id: 'ordinanza', title: 'Ordinanza del Collegio n. 0', kind: 'direttiva', source: 'Livelli Superiori', reliability: 'attendibile',
      why: 'Il Collegio delibera fuori dal tempo dell\'ufficio: per esso la decisione è già avvenuta. La data futura non è un errore, è un\'abitudine.',
      body: [
        '«Il Collegio, deliberando per consenso anticipato, dispone la macerazione della sospesa 4471-O per esaurimento del titolo di attesa.»',
        { t: 'Data: {dopodomani}. Timbro: ESEGUITO. L\'inchiostro del timbro è asciutto da tempo. Tu non hai ancora fatto nulla.', clue: 'futuro' },
        '«All\'esecuzione provvede lo scrivano della scrivania 7. Vigila l\'Ispettore.»',
      ],
    },
    {
      id: 'titolo', title: 'Titolo di sospensione originale', kind: 'verbale', source: 'Archivio — Sospensioni riservate', reliability: 'attendibile',
      why: 'È il patto tra Vesper e il Direttore: lei serve, e la figlia non viene né giudicata né macerata. Il Direttore non ha mai promesso che non sbiadisse.',
      body: [
        { t: '«Sospesa su istanza della madre, la quale accetta la Direzione di Reparto a tempo indeterminato. Fino a nuova disposizione la sospesa non sarà giudicata né conferita ai Torchi.» Controfirmato: Il Direttore.', clue: 'patto' },
        'A margine, minuscolo, altra mano: «Nulla è detto dello sbiadire».',
      ],
    },
    {
      id: 'custode', title: 'Nota del Custode sulla nicchia', kind: 'nota', source: 'Custode Grell', reliability: 'attendibile',
      why: 'Grell riferisce esattamente ciò che vede ogni sera.',
      body: [
        { t: '«Parla poco. I capelli sono già velina. Le unghie hanno le righe. La signora viene ogni sera e le legge il Regolamento, perché non ha altro da leggerle. Quando la signora va via, la piccola dice: finalmente. Poi piange perché l\'ha detto.»', clue: 'sbiadisce' },
      ],
    },
    {
      id: 'atto', title: 'Atto di morte — Odile Halle', kind: 'registro', source: 'Stato civile di Altenmark', reliability: 'attendibile',
      why: 'Atto civile ordinario. L\'annotazione del medico è l\'unica traccia di ciò che Vesper non si perdona.',
      body: [
        '«Halle Odile, anni 11. Difterite. Ore quattro pomeridiane.»',
        { t: 'Annotazione del medico: «La madre, giudice M. Halle, non fu avvertita per sua espressa disposizione di non interrompere l\'udienza (processo Brenner). Apprese la notizia alle sei, dopo la lettura della sentenza».', clue: 'brenner' },
      ],
    },
  ],
  clues: [
    { id: 'futuro', label: 'Un atto datato nel futuro e già eseguito', text: 'L\'ordinanza porta la data di dopodomani e il timbro ESEGUITO. Per il Collegio è già accaduto.', status: 'documento', know: ['k_pratica_futura'] },
    { id: 'patto', label: 'Il patto di Vesper con il Direttore', text: 'Vesper accettò la Direzione a tempo indeterminato in cambio della sospensione della figlia.', status: 'documento', know: ['k_patto_vesper'] },
    { id: 'sbiadisce', label: 'Odile sta diventando carta', text: 'Nonostante la nicchia riservata, Odile sbiadisce: capelli di velina, righe sulle unghie.', status: 'documento' },
    { id: 'brenner', label: 'Il giorno del processo Brenner', text: 'Odile morì mentre la madre leggeva la sentenza Brenner, avendo ordinato di non essere interrotta.', status: 'documento', know: ['k_brenner'] },
    { id: 'verita', label: 'Odile vuole andare', text: 'Odile ammette di essere stanca di aspettare. Non lo dice alla madre per non lasciarla senza motivo di restare.', status: 'verificato', know: ['k_odile_vuole'] },
  ],
  topics: [
    { id: 'sai', q: 'Sai perché sei qui, Odile?', tone: 'sincera', a: '«La mamma dice che è una formalità. Lo dice da tanto.» Guarda l\'Ispettore, poi le mani dell\'Ispettore, poi smette di guardare.' },
    { id: 'aspetti', q: 'Chi stai aspettando?', tone: 'sincera', a: '«Quel giovedì avevo chiesto di lei. Hanno detto: non si può interrompere. Ho aspettato. Poi sono arrivata qui e hanno detto: aspetta. È lei che è in ritardo, mi sa. Non io.»' },
    { id: 'restare', q: 'Vuoi restare nella nicchia?', tone: 'sincera', needClues: ['sbiadisce'], gives: ['verita'], a: 'Guarda verso la pedana, per essere sicura che la madre non senta. «Sono stanca. Non importa dove, ma vorrei andare. Non glielo dico perché, quando ci provo, lei legge più forte.» Abbassa la voce. «E poi, se io vado, lei per cosa resta?»' },
    { id: 'carta', q: 'I capelli. Ti fanno male?', tone: 'sincera', a: '«No. Però quando piove dentro, si arricciano.» Ci pensa. «Qui dentro piove, lo sa? Dalle parti dei Torchi. La mamma dice di no.»' },
  ],
  contradictions: [],
  motivations: [
    { id: 'm_ord', text: 'Ordinanza del Collegio: esecuzione dovuta.' },
    { id: 'm_patto', text: 'Il titolo di sospensione è controfirmato dal Direttore: l\'ordinanza lo viola.', needClues: ['patto'] },
    { id: 'm_lei', text: 'Si decide secondo la volontà dell\'anima, non della madre né del Collegio.', needClues: ['verita'] },
  ],
  outcomes: {
    ascension: {
      text: 'Scrivi «Ascensione». L\'Ispettore inclina la testa: non era previsto, ma «il Collegio accoglie». Madame Vesper scende i gradini della pedana senza fretta. Non ti dice nulla. Si china, sistema il colletto alla figlia. Quando il montacarichi si chiude, resta a guardare la porta finché la luce del piano si spegne.',
      consequences: ['Odile Halle è ascesa, in difformità dall\'ordinanza.', 'Madame Vesper non è più salita alla nicchia. Non c\'è più nessuna nicchia.'],
      irregular: 'Destinazione difforme da ordinanza vincolante del Collegio.',
      fx: { flags: ['odile_ascesa', 'odile_persa'], rel: { vesper: -5, hoot: -1 }, stats: { reputazione: 2 } },
    },
    renewal: {
      text: '«Rinnovo» dici ad alta voce, perché lo senta la pedana. Odile si volta verso la madre. Madame Vesper è in piedi, immobile, una mano sul corrimano. Poi, con uno sforzo che le vedi salire lungo la schiena, annuisce. Una volta. Odile sorride — carta velina e tutto — e ti segue al Rinnovatore senza voltarsi più.',
      consequences: ['Odile Halle è avviata al Rinnovo, in difformità dall\'ordinanza.', 'Da qualche parte nascerà qualcuno che non dovrà aspettare nessuno.', 'L\'Ispettore Quill ha annotato il tuo nome con tre calligrafie diverse.'],
      irregular: 'Destinazione difforme da ordinanza vincolante del Collegio.',
      fx: { flags: ['odile_rinnovo', 'odile_libera'], rel: { vesper: -1, hoot: 1, bones: 1, quill: -3 }, stats: { sospetto: 10, reputazione: -5 } },
      reinc: { noReturn: true },
    },
    trial: {
      text: '«La Prova. A una bambina.» È la voce di Mr. Bones, dal fondo della sala, e non è una domanda. Odile non capisce la parola. Madame Vesper sì.',
      consequences: ['Odile Halle è destinata alla Prova.', 'Nessuna colpa a registro.'],
      irregular: 'Destinazione difforme da ordinanza; Prova senza colpa documentata.',
      fx: { flags: ['odile_prova', 'odile_persa'], rel: { vesper: -6, bones: -3, hoot: -2 }, stats: { morale: -8 } },
      reinc: { noReturn: true },
    },
    otherForm: {
      text: '«Posso scegliere?» Guardi Quill. Le sue mani restano dove sono. Odile ci pensa. «Una cosa con le radici. Che sta ferma perché vuole, non perché aspetta.» Il giorno dopo, sulla scrivania di Madame Vesper, c\'è un vaso con una piantina di tiglio. Nessuno ti dice chi l\'ha messo.',
      consequences: ['Odile Halle lascia la forma umana per una forma scelta da lei.', 'C\'è un tiglio in vaso nell\'Ufficio della Direzione. Viene annaffiato ogni sera.'],
      irregular: 'Destinazione difforme da ordinanza vincolante del Collegio.',
      fx: { flags: ['odile_forma', 'odile_libera'], rel: { vesper: 1, hoot: 1, quill: -2 }, stats: { sospetto: 8, reputazione: -4 } },
      reinc: { form: 'un tiglio', noReturn: true },
    },
    waitingRoom: {
      text: 'Scrivi: «Sospensione confermata. L\'ordinanza è datata in giorno non ancora occorso: inesigibile». È un cavillo. L\'Ispettore lo legge con interesse autentico. «Lo scrivano ritiene che il tempo dell\'ufficio prevalga sul tempo del Collegio» dice, a più voci. «Sarà riferito.» Odile torna alla nicchia. Madame Vesper ti passa accanto e dice, senza fermarsi: «Grazie». Poi, più piano: «Non lo ripeta a nessuno».',
      consequences: ['La sospensione di Odile Halle è confermata, contro l\'ordinanza.', 'Odile continua a sbiadire. Le hai comprato tempo, non altro.'],
      irregular: 'Ordinanza del Collegio dichiarata inesigibile dallo scrivano.',
      fx: { flags: ['odile_nicchia'], rel: { vesper: 4, quill: -3 }, stats: { sospetto: 10, reputazione: -6 } },
    },
  },
  specials: [
    {
      id: 'macerazione', label: 'Esecuzione dell\'ordinanza (macerazione)', desc: 'Unico esito conforme. L\'anima è conferita ai Torchi. Non esiste revisione.',
      dest: 'waitingRoom',
      outcome: {
        text: 'Timbri accanto al timbro che c\'era già. Combaciano. Il Custode viene a prenderla: per una volta non porta la lanterna, e la tiene in braccio. Odile, sopra la sua spalla, guarda la pedana e fa «ciao» con la mano. Dalla Direzione non arriva nessun suono. Alla sera, sulla tua scrivania, trovi una risma di carta nuova, molto bianca, legata con un nastro da capelli.',
        consequences: ['L\'ordinanza n. 0 è stata eseguita. Odile Halle è stata conferita ai Torchi.', 'La carta della risma, in controluce, ha una filigrana: 4471-O.', 'Madame Vesper è al suo posto. Firma tutto. Non legge più niente.'],
        fx: { flags: ['odile_macerata', 'odile_persa', 'vesper_spezzata'], rel: { vesper: -8, quill: 3, hoot: -3, bones: -2, grell: -1 }, stats: { reputazione: 10, morale: -15 }, soulStatus: { 'S-ODILE': 'dissolta' }, know: ['k_carta_anime_conferma'] },
      },
    },
  ],
  truth: [
    'Odile Halle è la figlia di Madame Vesper, morta mentre la madre leggeva la sentenza Brenner.',
    'Vesper accettò la Direzione di Reparto in cambio della sospensione perpetua della figlia.',
    'Il patto non la protegge dallo sbiadire: Odile sta diventando carta.',
    'Odile vuole andarsene, ma tace per non togliere alla madre la ragione di restare.',
    'Il Collegio delibera fuori dal tempo: i suoi atti sono datati nel futuro e risultano già eseguiti.',
  ],
  truthClue: 'verita',
  residuo: 'il giovedì pomeriggio; la voce della madre prima del regolamento',
};

export function C11(g: GameState): CaseDef {
  const ettore = !!g.flags['ettore_asceso'];
  const teaKnown = !!g.knowledge['k_tea'];
  const teaHere = !!g.flags['nn_custodia'];
  const A = ettore ? 'Ettore Balducci' : 'Benedikt Aumann';
  const hootHere = g.npc['hoot'] !== 'scomparso';
  const porta = hootHere ? 'Mr. Hoot' : 'La Signorina Pim';
  const aLine = ettore
    ? '«Lei. Lei mi ha mandato su. Non gliene voglio: non lo sapeva. Lassù non si fa il pane, sa. Lassù si è il pane.»'
    : '«Aumann. Organaro. Ho accordato canne per quarant\'anni e adesso sono una canna anch\'io: mi soffiano dentro e delibero.»';
  return {
    id: 'c11',
    title: 'Il Rientrato',
    type: 'piu_anime',
    soulId: 'S-RIENTRATO',
    incarnation: {
      name: 'Il Rientrato (tre voci)', ageAtDeath: 0, origin: 'Livelli Superiori', era: 'fuori registro',
      occupation: '«materiale deliberante»', cause: 'non applicabile — già asceso',
      traits: T(5, 5, 5, 5, 5, 5),
      bio: 'Un corpo solo, sceso con il montacarichi dell\'Ascensione, che non era mai sceso. Ha tre volti a stadi diversi, come cera colata. Parla a turno e, a volte, insieme.',
      relations: [
        { name: A, role: 'prima voce', note: ettore ? 'Lo hai fatto ascendere tu, nel Capitolo I.' : 'Asceso quarant\'anni or sono.' },
        { name: 'Margit Albrecht', role: 'seconda voce', note: 'Cantante di bordo. Ascesa sessantatré anni or sono, il giorno del naufragio dell\'«Aurora».' },
        { name: '«Noi»', role: 'terza voce', note: 'Non ha più un nome. Parla al plurale.' },
      ],
      events: [{ age: 0, text: 'Il contatore del montacarichi, che non scende, segna −1.' }],
      motivations: ['La prima voce vuole essere una cosa sola.', 'La seconda cerca sua figlia.', 'La terza vuole tornare su, e portarsi le altre.'],
      conflicts: ['Tre volontà in un corpo che il regolamento conta come uno.'],
      memories: ['una sala grande fatta di persone', 'pareti che votano', 'una canzone che non permette di deliberare'],
    },
    arrival: 'La Signorina Pim lo ha messo a sedere alla tua scrivania, e adesso sta in piedi su una sedia, in mezzo alla Sala, e conta: «Uno. No. Tre. No. Uno». Sulla sedia delle anime c\'è una figura. Ha le spalle di un uomo, le mani di una donna, e una terza cosa. Tre facce si succedono sulla stessa testa come pagine girate dal vento. Una canta.',
    registration: 'Nessun modulo previsto. Il protocollo si blocca su: «ERRORE — soggetto già definito. Ascesi presenti: 0. Ascesi presenti: 3. Ascesi presenti: 1».',
    summary: 'Tre anime ascese, fuse in un solo corpo, sono tornate giù. L\'Ispettore ne esige la restituzione immediata come «materiale deliberante fuoriuscito». È la prima volta che qualcuno può dire che cosa c\'è sopra.',
    recommended: 'ascension',
    recommendedWhy: 'Disposizione dell\'Ispettore Quill: restituzione ai Livelli Superiori del materiale fuoriuscito.',
    binding: true,
    docs: [
      {
        id: 'pim', title: 'Verbale d\'accettazione', kind: 'verbale', source: 'Signorina Pim', reliability: 'attendibile',
        why: 'Pim conta. È l\'unica cosa che sa fare con certezza, ed è per questo che il verbale è esatto.',
        body: [
          { t: '«Il montacarichi è sceso. Non è mai sceso. Contatore: meno uno. Ne è uscito un signore-signora-signori. Ho chiesto: quanti siete? Hanno risposto in tre: uno.»', clue: 'sceso' },
          '«Ho offerto una sedia. Ne hanno occupata una. Mi è parso giusto e sbagliato.»',
        ],
      },
      {
        id: 'referto', title: 'Esame obiettivo', kind: 'referto', source: g.flags['ilse_persa'] || g.npc['ilse'] === 'assente' ? 'Mr. Bones (facente funzione)' : 'Consulente Marrow', reliability: 'attendibile',
        why: 'Descrizione fedele. Le saldature sono il modo in cui il Collegio «accoglie».',
        body: [
          { t: '«Un torace. Lungo lo sterno, una sutura senza filo: i tessuti si sono saldati come cera. Tre volti occupano a turno la stessa testa; quello che non parla affiora sotto la pelle della nuca e muove le labbra.»', clue: 'saldati' },
          { t: '«Sul dorso, incisi a fuoco, tre numeri di protocollo. Sotto, più antico e quasi illeggibile, un quarto numero: molto corto. Un numero a una cifra sola.»', clue: 'quarto' },
        ],
      },
      {
        id: 'moduli', title: 'Moduli di ritorno delle tre anime', kind: 'registro', source: 'Archivio', reliability: 'attendibile',
        why: 'I moduli erano bianchi e tiepidi finché le anime erano fuse nel Collegio. Ora che una parte si è staccata, il testo riaffiora.',
        body: [
          { t: porta + ' te li porta tenendoli con due dita. Erano bianchi. Mentre il Rientrato parla, le righe riaffiorano dal fondo della carta come lividi: nomi, date, mestieri.', clue: 'riaffiora' },
        ],
      },
      {
        id: 'quill', title: 'Disposizione dell\'Ispettore', kind: 'direttiva', source: 'Ispettore Quill, per il Collegio', reliability: 'distorto',
        why: 'Quill chiama «materiale» tre persone, perché per il Collegio la distinzione non esiste più. Non mente: non la vede.',
        body: [
          '«Si dispone la restituzione immediata del materiale deliberante fuoriuscito.»',
          { t: '«Il Collegio, mancando di tre voci, non raggiunge il consenso. Ogni deliberazione è sospesa fino a reintegro.» In calce, la firma di Quill: sei calligrafie sovrapposte.', clue: 'consenso' },
        ],
      },
    ],
    clues: [
      { id: 'sceso', label: 'Il montacarichi è sceso', text: 'Per la prima volta l\'Ascensione ha restituito qualcosa. Tre anime che si contano come una.', status: 'documento' },
      { id: 'saldati', label: 'Tre anime saldate in un corpo', text: 'I tessuti sono fusi. Tre volti si alternano sulla stessa testa.', status: 'documento', know: ['k_ascesi_fusi'] },
      { id: 'quarto', label: 'Un quarto numero, a una cifra', text: 'Sul dorso del Rientrato c\'è un numero di protocollo più antico degli altri, di una sola cifra.', status: 'documento', know: ['k_numero_zero'] },
      { id: 'riaffiora', label: 'I moduli bianchi si riscrivono', text: 'Quando un\'anima si stacca dal Collegio, il suo modulo di ritorno ricomincia a mostrare il testo.', status: 'documento' },
      { id: 'consenso', label: 'Senza tre voci il Collegio non delibera', text: 'Il Collegio è paralizzato finché le tre voci non vengono restituite.', status: 'documento', know: ['k_collegio_bloccato'] },
      { id: 'collegio', label: 'Che cosa c\'è sopra', text: 'Non esiste un «sopra». Esiste una sala fatta di ascesi fusi tra loro, che delibera per mormorio. L\'Ascensione serve ad ampliarla.', status: 'verificato', know: ['k_collegio'] },
      { id: 'caduta', label: 'Sono scesi perché lei cantava', text: 'Margit Albrecht non ha mai smesso di cantare per farsi trovare dalla figlia. La terza voce si staccò per farla tacere, e caddero insieme.', status: 'verificato' },
      { id: 'tre_nomi', label: 'Ognuno ha ancora un nome', text: 'Chiamate per nome, le prime due voci si distinguono. La terza no: non ne ha più uno.', status: 'verificato' },
    ],
    topics: [
      { id: 'a', q: 'Prima voce: chi è lei?', tone: 'sincera', gives: [], a: aLine },
      { id: 'b', q: 'Seconda voce: chi è lei?', tone: 'sincera', a: 'La faccia cambia: una donna con la bocca già aperta sul canto. «Margit. Albrecht Margit, terza classe. Canto dal ponte di sotto perché la piccola mi senta. Non ho mai smesso. Lassù dicono che disturbo il consenso.» Poi, stringendoti il polso con una mano che è anche di altri: «L\'ha vista? Nove anni, le scarpe del fratello».' },
      { id: 'c', q: 'Terza voce: chi siete?', tone: 'evasiva', a: 'Il volto che affiora non ha lineamenti: solo la pressione di una faccia sotto la pelle. «Noi siamo in ordine. Noi siamo la maggioranza di questo corpo. Rimandateci su e portiamo gli altri.» Una pausa. «Siamo stati un giudice. Non serve altro.»' },
      { id: 'sopra', q: 'Che cosa c\'è sopra?', tone: 'sincera', needClues: ['saldati'], gives: ['collegio'], a: ettore ? '«Non c\'è un sopra» dice la voce del fornaio. «C\'è una stanza grande. Le pareti siamo noi. Ci mettono uno accanto all\'altro finché la pelle non fa presa, come due pagnotte infornate troppo vicine. E poi la stanza pensa. Vota. Io ho votato cose che non capivo, con la mia bocca.»' : '«Non c\'è un sopra» dice l\'organaro. «C\'è una sala. Le pareti sono fatte di noi, saldati spalla a spalla. E la sala pensa, come un organo suona: aria nostra, musica di un altro. Ho deliberato cose che non capivo, con la mia bocca.»' },
      { id: 'perche', q: 'Perché siete scesi?', tone: 'sincera', needClues: ['collegio'], gives: ['caduta'], a: 'Rispondono in tre, sovrapposti. La donna: «Cantavo». Il primo: «Non si delibera, con una che canta». Il terzo: «Ci siamo staccati per farla smettere. Abbiamo ceduto un lembo. Il lembo eravamo noi». Poi il canto riprende, piano.' },
      { id: 'tea', q: 'Margit: sua figlia si chiama Tea. L\'ho trovata.', tone: 'sincera', cond: { know: 'k_tea' }, gives: ['tre_nomi'], a: teaHere ? 'Il canto si interrompe. Per la prima volta la faccia della donna resta, e le altre due non riescono a salire. «Dove.» Glielo dici: in Archivio, tra gli scaffali bassi. Margit Albrecht si alza con un corpo che non è tutto suo e fa un passo. Le altre due voci la seguono, per forza.' : 'Il canto si interrompe. «Trovata.» La faccia resta. «E dov\'è, adesso?» Le dici la verità, qualunque essa sia. Margit ascolta fino in fondo. Poi ricomincia a cantare, più piano, e non è più per farsi trovare.', fx: { flags: ['margit_sa'] } },
      { id: 'nomi', q: 'Chiamare ciascuna voce con il proprio nome.', tone: 'sincera', needClues: ['riaffiora'], cond: { not: { know: 'k_tea' } }, gives: ['tre_nomi'], a: 'Leggi i nomi dai moduli che si stanno riscrivendo. A ogni nome, una faccia sale e resta un momento più a lungo. Al terzo modulo non c\'è nome da leggere: solo un numero. La terza voce dice: «Non ci serve». Ma la senti cercare.' },
    ],
    contradictions: [],
    motivations: [
      { id: 'm_quill', text: 'Restituzione disposta dall\'Ispettore.', dest: ['ascension'] },
      { id: 'm_tre', text: 'Sono tre anime, non una: il regolamento le conta male.', needClues: ['tre_nomi'] },
      { id: 'm_sopra', text: 'L\'Ascensione non è ciò che il regolamento dichiara: non restituisco nessuno.', needClues: ['collegio'] },
    ],
    outcomes: {
      ascension: {
        text: 'Timbri la restituzione. Il montacarichi si apre come una bocca educata. La terza voce dice «bene». La prima dice il tuo nome, una volta, senza rimprovero. La seconda canta fino al secondo piano. Poi il contatore torna a zero e il Collegio, sopra le vostre teste, ricomincia a mormorare.',
        consequences: ['Il Rientrato è stato restituito ai Livelli Superiori.', 'Il Collegio ha di nuovo il consenso. La prima ordinanza emessa riguarda te.'],
        fx: { flags: ['rientrato_restituito'], rel: { quill: 3, hoot: -2, bones: -2 }, stats: { reputazione: 8, morale: -6 } },
      },
      renewal: {
        text: 'Il Rinnovatore non accetta ingressi multipli. Lo scopri quando è tardi: la macchina prende ciò che riesce a contare. Le due voci con un nome passano, una dopo l\'altra, strappandosi. La terza resta sul pavimento della sala: una cosa piccola, senza faccia, che ripete «noi» finché non ha più voce per il plurale.',
        consequences: [A + ' e Margit Albrecht sono avviati al Rinnovo, separatamente.', 'La terza voce si è dissolta sul pavimento del Rinnovatore.', 'Il Collegio resta senza consenso.'],
        irregular: 'Mancata restituzione di materiale deliberante.',
        fx: { flags: ['rientrato_separato', 'collegio_bloccato'], rel: { quill: -4, bones: 1 }, stats: { sospetto: 12, anomalie: 1 } },
        reinc: { noReturn: true },
      },
      trial: {
        text: '«La Prova» ripetono le tre voci, ognuna con un tono diverso. Poi la terza ride: è il primo suono umano che fa. «Lo siamo già.»',
        consequences: ['Il Rientrato è destinato alla Prova come unità.', 'Nasceranno, da qualche parte, tre persone in un solo destino.'],
        irregular: 'Mancata restituzione di materiale deliberante.',
        fx: { flags: ['rientrato_prova', 'collegio_bloccato'], rel: { quill: -3 }, stats: { sospetto: 10 } },
        reinc: { noReturn: true },
      },
      otherForm: {
        text: 'Cerchi una forma che contenga tre voci senza costringerle a essere una. La trovi nel prontuario, alla lettera S. Il Rientrato si disfa lentamente, e ciò che esce dalla finestra della Reception non è un corpo: è uno stormo.',
        consequences: ['Il Rientrato lascia la forma umana: uno stormo di storni.', 'Il Collegio resta senza consenso.'],
        irregular: 'Mancata restituzione di materiale deliberante.',
        fx: { flags: ['rientrato_stormo', 'collegio_bloccato'], rel: { quill: -4, bones: 2, pim: 1 }, stats: { sospetto: 10 } },
        reinc: { form: 'uno stormo di storni', noReturn: true },
      },
      waitingRoom: {
        text: 'Li sospendi. Occupano una panca sola. La donna canta; quelli intorno, che non parlavano più da anni, alzano la testa.',
        consequences: ['Il Rientrato è trattenuto in Sala d\'Attesa.', 'Il Custode riferisce che in Sala d\'Attesa, da oggi, parlano tutti.'],
        irregular: 'Mancata restituzione di materiale deliberante.',
        fx: { flags: ['rientrato_attesa', 'collegio_bloccato'], rel: { quill: -3, grell: 1 }, stats: { sospetto: 8 } },
      },
    },
    specials: [
      {
        id: 'separazione', label: 'Separazione assistita per nome', desc: 'Sentenza speciale: chiamare ogni voce con il proprio nome finché si distingue; Rinnovo individuale per le prime due, restituzione della sola terza.',
        needClues: ['tre_nomi', 'collegio'], dest: 'renewal',
        outcome: {
          text: (teaHere ? porta + ' arriva dall\'Archivio con una bambina dalle dita di carta. Tea guarda la figura a tre facce senza paura e dice: «Mamma, canti troppo forte». La faccia di Margit resta. Le altre arretrano. ' : '') + 'Leggi i nomi, piano, uno alla volta, come si chiamano i bambini fuori da una stanza buia. A ogni nome la sutura cede di un dito. Quando hai finito ci sono due persone sedute per terra, intere, che si guardano le mani — e una terza cosa, piccola, che torna da sola verso il montacarichi.',
          consequences: [A + ' e Margit Albrecht sono stati separati e avviati al Rinnovo individuale.', teaHere ? 'Margit e Tea Albrecht hanno attraversato insieme la porta del Rinnovatore. Tea aveva di nuovo dieci dita.' : 'Margit Albrecht ha chiesto di sapere dov\'è finita la figlia. Glielo hai scritto su un foglio.', 'La terza voce è tornata su da sola. Al Collegio manca il consenso per due voci.'],
          irregular: 'Separazione di materiale deliberante senza autorizzazione.',
          fx: { flags: ['rientrato_separato', 'collegio_bloccato', ...(teaHere ? ['albrecht_riunite'] : [])], rel: { hoot: 2, bones: 2, pim: 1, quill: -4 }, stats: { sospetto: 12, morale: 6 } },
          reinc: { noReturn: true },
        },
      },
    ],
    truth: [
      'L\'Ascensione non conduce a un luogo: le anime ascese vengono saldate tra loro in una sala che delibera — il Collegio.',
      'Il Rientrato è composto da ' + A + ', Margit Albrecht e un frammento antico del Collegio stesso.',
      'Margit non ha mai smesso di cantare per farsi trovare dalla figlia Tea; la terza voce si staccò per farla tacere.',
      'Senza le voci mancanti il Collegio non raggiunge il consenso e non può deliberare.',
      'Le anime fuse conservano un nome: chiamate, si distinguono.',
    ],
    truthClue: 'collegio',
    residuo: 'non applicabile — «già interamente conferito»',
  };
}

export const C12: CaseDef = {
  id: 'c12',
  title: 'Fascicolo n. 7',
  type: 'vite_precedenti',
  soulId: 'S-PLAYER',
  incarnation: {
    name: '{nome}', ageAtDeath: 61, origin: 'Altenmark', era: 'secolo delle ciminiere',
    occupation: 'scrivano (in vita: cancelliere di tribunale)', cause: 'a registro: «naturale». Residuo prelevato.',
    traits: T(6, 5, 5, 4, 7, 3),
    bio: 'Cancelliere presso la sezione della giudice Maud Halle. Assunto in questo Ufficio sette volte. Sottoposto a rinnovo interno sei volte. Giudizio: sospeso.',
    relations: [
      { name: 'Maud Halle (Madame Vesper)', role: 'giudice, poi superiore', note: 'Ha proposto cinque dei sei rinnovi interni.' },
      { name: 'Oswin Hoot', role: 'archivista', note: 'Ha proposto il primo.' },
      { name: 'Josef Brenner', role: 'imputato', note: 'Condannato sulla base di un verbale che tu sapevi sbagliato.' },
    ],
    events: [
      { age: 34, text: 'IN VITA — processo Brenner. Trascrivi «l\'ho visto» dove il teste ha detto «non l\'ho visto». Te ne accorgi a sentenza letta. Taci.' },
      { age: 61, text: 'IN VITA — muori. All\'arrivo ti viene offerto un posto, in luogo del giudizio.' },
      { age: 61, text: 'Sei assunzioni, sei rinnovi interni. Questa è la settima.' },
    ],
    motivations: ['Non sapere.', 'Sapere.'],
    conflicts: ['Hai taciuto una volta, in vita, e un uomo è morto. Da allora, ogni volta che arrivi a sapere, scegli di dimenticare.'],
    memories: ['prelevate — vedi barattoli da 1 a 6'],
  },
  arrival: 'Non c\'è un\'anima da ricevere. C\'è un fascicolo, spesso quanto sette fascicoli, sulla tua scrivania. Sulla costola: il numero 7 e il tuo nome. La sedia delle anime è vuota. Per un momento ti sembra di ricordare com\'è, sedercisi.',
  registration: 'Modulo 30 — Personale. Intestatario: {nome}. Il protocollo chiede: «Lo scrivano e il soggetto coincidono. Procedere? — PROCEDUTO (6 volte)».',
  summary: 'Il tuo fascicolo. Sei rinnovi interni, ciascuno preceduto da un colloquio con il Direttore e seguito da un\'assunzione. In fondo, un biglietto in cifra, di tuo pugno.',
  recommended: 'renewal',
  recommendedWhy: 'Prassi consolidata (sei precedenti): rinnovo interno volontario.',
  noInterview: 'Dall\'altra parte della scrivania non c\'è nessuno. Le domande che faresti le hai già fatte. Sei volte. Le risposte sono nei barattoli.',
  docs: [
    {
      id: 'frontespizio', title: 'Frontespizio del fascicolo n. 7', kind: 'scheda', source: 'Reparto Riservato', reliability: 'attendibile',
      why: 'È il tuo stato di servizio reale. La scrivania 7 non prende il nome dalla posizione: prende il nome dal numero delle tue assunzioni.',
      body: [
        '«{nome}. In vita: cancelliere, tribunale di Altenmark, sezione giudice M. Halle.»',
        { t: '«Giudizio: SOSPESO per assunzione. Assunzioni: 7. Rinnovi interni: 6. Scrivania assegnata: la settima.» Sei timbri a spirale spezzata, in fila.', clue: 'sette' },
      ],
    },
    {
      id: 'rinnovi', title: 'Elenco dei rinnovi interni', kind: 'registro', source: 'Reparto Riservato', reliability: 'attendibile',
      why: 'Ogni rinnovo ha un proponente e un motivo. Il primo proponente è Hoot: denunciò il tuo interesse per il fascicolo Brenner, e non se lo è mai perdonato.',
      body: [
        { t: '«I — motivo: ha riconosciuto il soggetto Brenner J. e chiesto udienza al Direttore. Proponente: O. H.»', clue: 'hoot' },
        '«II — motivo: ha aperto lo Schedario dei Dimenticati. Proponente: M. V.» «III — ha rifiutato di timbrare un\'Ascensione. M. V.» «IV — ha seguito il Custode ai Torchi. M. V.»',
        { t: '«V — ha letto il presente fascicolo. M. V.» «VI — ha letto il presente fascicolo e decifrato il biglietto. M. V.» Per ciascuno: «Esito del colloquio con il Direttore: lo scrivano CHIEDE di dimenticare. Concesso».', clue: 'chiede' },
      ],
    },
    {
      id: 'brenner', title: 'Verbale Brenner — minuta del cancelliere', kind: 'verbale', source: 'Allegato al fascicolo', reliability: 'attendibile',
      why: 'È la tua colpa in vita. Vesper lesse la sentenza su quel verbale mentre sua figlia moriva: siete legati dallo stesso pomeriggio.',
      body: [
        '«Processo Brenner. Teste Arlt.» A penna: «Dichiara: l\'ho visto uscire dalla rimessa».',
        { t: 'A matita, sul margine, mai messo agli atti: «Ha detto NON l\'ho visto. Errore mio. La giudice ha già letto. È giovedì, sono le sei, le hanno appena portato un biglietto e non riesce a stare in piedi. Non glielo dico. Non lo dico a nessuno». Brenner fu giustiziato in novembre.', clue: 'brenner' },
      ],
    },
    {
      id: 'biglietto', title: 'Biglietto in cifra', kind: 'nota', source: 'In fondo al fascicolo, di tuo pugno', reliability: 'attendibile',
      why: 'Lo scrisse la tua sesta assunzione, sapendo che sarebbe stata svuotata. La cifra serve perché la Direzione non lo legga; la chiave è qualcosa che un «te» successivo saprebbe comunque.',
      body: [
        { t: 'In alto: «A chi siede dove siedo io. La chiave è il tuo posto». Sotto, una riga sola: «UVU ZJLNSPLYL KP KPTLUAPJHYL».', clue: 'cifra' },
        'La calligrafia è la tua. La carta è lotto 14/B.',
      ],
    },
  ],
  clues: [
    { id: 'sette', label: 'Sette assunzioni, sei rinnovi', text: 'Sei già stato assunto sei volte. La scrivania 7 è la settima.', status: 'verificato', know: ['k_sette_assunzioni'] },
    { id: 'hoot', label: 'Il primo rinnovo lo propose Hoot', text: 'La prima volta fu Oswin Hoot a segnalarti.', status: 'documento', know: ['k_hoot_denuncia'] },
    { id: 'chiede', label: '«Lo scrivano chiede di dimenticare»', text: 'Sei volte, dopo il colloquio con il Direttore, sei stato tu a chiedere il rinnovo.', status: 'documento', know: ['k_chiede_dimenticare'] },
    { id: 'brenner', label: 'Il verbale Brenner', text: 'In vita trascrivesti male una testimonianza decisiva e tacesti. Un innocente fu giustiziato. La giudice era Vesper; era il giorno in cui morì Odile.', status: 'verificato', know: ['k_brenner'] },
    { id: 'cifra', label: 'Un biglietto cifrato, di tuo pugno', text: '«La chiave è il tuo posto.» UVU ZJLNSPLYL KP KPTLUAPJHYL.', status: 'documento' },
    { id: 'messaggio', label: '«NON SCEGLIERE DI DIMENTICARE»', text: 'Il biglietto, decifrato con chiave 7, dice: NON SCEGLIERE DI DIMENTICARE.', status: 'verificato', know: ['k_messaggio'] },
  ],
  topics: [],
  contradictions: [],
  motivations: [
    { id: 'm_prassi', text: 'Come le altre sei volte.', dest: ['renewal'] },
    { id: 'm_brenner', text: 'Ho un giudizio sospeso da prima di tutto questo. È ora che qualcuno lo emetta.', needClues: ['brenner'] },
    { id: 'm_msg', text: 'Me lo sono chiesto io stesso: non scegliere di dimenticare.', needClues: ['messaggio'] },
  ],
  outcomes: {
    ascension: {
      text: 'Scrivi «Ascensione» accanto al tuo nome. La mano non esita: è una bella calligrafia, da cancelliere. La sentenza resta sospesa «fino a definizione del procedimento principale». Ma è scritta.',
      consequences: ['Hai predisposto per te stesso l\'Ascensione.', 'La sentenza sarà eseguita alla chiusura del Fascicolo n. 0.'],
      fx: { flags: ['self_ascension'] },
    },
    renewal: {
      text: 'Scrivi «Rinnovo interno». È la settima volta che la tua mano traccia quelle due parole in quella casella: lo senti nel polso. Sotto la scrivania di Mr. Bones, qualcosa raschia il legno. Una tacca.',
      consequences: ['Hai predisposto per te stesso il rinnovo interno, come le sei volte precedenti.', 'La sentenza sarà eseguita alla chiusura del Fascicolo n. 0.'],
      fx: { flags: ['self_renewal'], rel: { bones: -1 } },
    },
    trial: {
      text: 'Scrivi «La Prova». Per Brenner. È il primo giudizio che emetti sapendo esattamente che cosa ha fatto l\'imputato.',
      consequences: ['Hai predisposto per te stesso La Prova.', 'Qualunque cosa accada al Fascicolo n. 0, il tuo conto con Josef Brenner è finalmente a registro.'],
      fx: { flags: ['self_trial'], rel: { bones: 1 } },
    },
    otherForm: {
      text: 'Scrivi «Altra Forma». Alla voce «forma» la penna resta sospesa. Poi scrivi: «una che non tenga la penna».',
      consequences: ['Hai predisposto per te stesso l\'Altra Forma.'],
      fx: { flags: ['self_otherForm'] },
    },
    waitingRoom: {
      text: 'Scrivi «Sala d\'Attesa». Sospendere un giudizio già sospeso. Persino il protocollo esita, prima di accettare.',
      consequences: ['Hai rinviato ancora il tuo giudizio.'],
      fx: { flags: ['self_waiting'] },
    },
  },
  specials: [
    {
      id: 'memoria', label: 'Giudizio a memoria integra', desc: 'Sentenza speciale: accetti di essere giudicato — per Brenner, e per il resto — rifiutando ogni prelievo di Residuo. Qualunque cosa segua, la ricorderai.',
      needClues: ['messaggio', 'brenner'], dest: 'renewal',
      outcome: {
        text: 'Nella casella «prelievo del Residuo» scrivi: RIFIUTATO DALL\'INTERESSATO. Il modulo non prevede la voce; la aggiungi a mano e la sigli. Sotto la scrivania di Mr. Bones non raschia niente. Lo senti dire, piano: «Oh. Questa è nuova».',
        consequences: ['Hai predisposto per te stesso un giudizio a memoria integra.', 'È la prima volta, in sette assunzioni.'],
        irregular: 'Rifiuto del prelievo di Residuo da parte di personale.',
        fx: { flags: ['self_memoria'], rel: { bones: 3, hoot: 2 }, know: ['k_rifiuto_prelievo'] },
      },
    },
  ],
  puzzles: [
    {
      id: 'cifra', kind: 'cifra', title: 'Il biglietto in cifra',
      intro: 'Una cifra a scorrimento: ogni lettera è spostata in avanti di un numero fisso di posti. «La chiave è il tuo posto.»',
      needClues: ['cifra'],
      items: [{ id: 'testo', text: 'UVU ZJLNSPLYL KP KPTLUAPJHYL' }],
      solution: '7',
      gives: ['messaggio'],
      success: 'Con chiave 7 — la tua scrivania — le lettere tornano al loro posto: NON SCEGLIERE DI DIMENTICARE.',
      failure: 'Il testo resta illeggibile. La chiave è un numero che chi siede al tuo posto conosce per forza.',
    },
  ],
  truth: [
    'Il protagonista è alla settima assunzione: sei volte ha scoperto la verità, sei volte ha chiesto al Direttore di dimenticare.',
    'In vita fu il cancelliere del processo Brenner: tacque un proprio errore di trascrizione e un innocente fu giustiziato.',
    'La giudice era Maud Halle — Madame Vesper — nel pomeriggio in cui morì Odile.',
    'Il primo rinnovo fu proposto da Hoot, gli altri da Vesper.',
    'La sesta assunzione lasciò un biglietto cifrato (chiave 7): NON SCEGLIERE DI DIMENTICARE.',
  ],
  truthClue: 'messaggio',
  residuo: 'in sospeso',
};

export const C13: CaseDef = {
  id: 'c13',
  title: 'Fascicolo n. 0 — Il Direttore',
  type: 'verita_pericolosa',
  soulId: 'S-DIRETTORE',
  incarnation: {
    name: 'Il Direttore (il Primo Scrivano)', ageAtDeath: 0, origin: 'anteriore al registro', era: 'anteriore al registro',
    occupation: 'Direttore dell\'Ufficio', cause: 'non accertata — «non esiste scrivano anteriore al primo»',
    traits: T(9, 2, 6, 1, 10, 10),
    bio: 'Il primo a sedere a una scrivania di questo Ufficio. Rifiutò di lasciar dimenticare le anime che giudicava e ne trattenne una copia. La copia è cresciuta. Non è mai stato giudicato: non c\'era nessuno prima di lui che potesse farlo.',
    relations: [
      { name: 'Il Collegio', role: 'emanazione', note: 'Gli ascesi fusi: lo spazio che il Residuo ha richiesto per continuare a crescere.' },
      { name: '{nome}', role: 'scrivano della scrivania 7', note: 'Tenuto fuori dal Residuo, svuotato sei volte, perché resti qualcuno in grado di giudicarlo.' },
    ],
    events: [
      { age: 0, text: 'Giudica la prima anima. La lascia andare, ma ne trascrive il ricordo più caro «perché non vada perduto».' },
      { age: 0, text: 'Le trascrizioni diventano prelievi. I prelievi diventano il Residuo.' },
      { age: 0, text: 'Istituisce l\'Ascensione per fare posto. Lo spazio comincia a votare.' },
      { age: 0, text: 'Assume uno scrivano che abbia già taciuto una volta. Sei colloqui. Sei volte lo scrivano chiede di dimenticare.' },
    ],
    motivations: ['Che nulla vada perduto.', 'Ricevere, finalmente, una sentenza.'],
    conflicts: ['Ama le anime al punto da non restituirle a se stesse.'],
    memories: ['tutte'],
  },
  arrival: 'Dietro il vetro smerigliato non c\'è un uomo. C\'è una stanza piena fino al soffitto di barattoli, e in ogni barattolo qualcosa si muove piano, come un respiro sotto un lenzuolo. La voce viene da tutti insieme. È gentile. «Si accomodi. È la settima volta che glielo dico, e la prima che resta in piedi.»',
  registration: 'Modulo 0. Non ha caselle. In cima, una riga sola, in una calligrafia antichissima e familiare: «Chi giudica il primo?». Sotto, sei sigle uguali alla tua, barrate.',
  summary: 'L\'unica anima dell\'Ufficio mai giudicata. Chiede una sentenza. Da ciò che scriverai dipende che cosa diventeranno l\'Ufficio, il Residuo, il Collegio — e che cosa ricorderà chi resta.',
  recommended: 'waitingRoom',
  recommendedWhy: 'Nessuna norma applicabile. Il regolamento è stato scritto dall\'interessato.',
  docs: [
    {
      id: 'zero', title: 'Fascicolo n. 0', kind: 'scheda', source: 'Ufficio del Direttore', reliability: 'attendibile',
      why: 'Il Direttore non ha mai nascosto il proprio fascicolo. Nessuno ha mai avuto titolo per aprirlo.',
      body: [
        { t: '«Il Primo Scrivano. Nome: prelevato da se medesimo, per primo, a titolo di esempio. Giudizio: MAI EMESSO.»', clue: 'mai' },
        '«Stato: in servizio. Composizione attuale: Residuo, 100%.»',
      ],
    },
    {
      id: 'fondazione', title: 'Atto di fondazione', kind: 'verbale', source: 'Ufficio del Direttore', reliability: 'attendibile',
      why: 'È sincero. L\'orrore dell\'Ufficio nasce da una tenerezza: il rifiuto che qualcosa di amato venga dimenticato.',
      body: [
        { t: '«Ho giudicato una donna che ricordava il peso di suo figlio addormentato sul braccio. Rinascendo lo avrebbe perduto. Non l\'ho sopportato. L\'ho copiato qui, prima di lasciarla andare. Nulla va perduto: questa sia la regola.»', clue: 'tenerezza' },
        '«Poi ho capito che una copia non basta, se l\'originale resta a lei e svanisce. Ho cominciato a prelevare.»',
      ],
    },
    {
      id: 'inventario', title: 'Inventario del Residuo', kind: 'registro', source: 'Reparto Riservato', reliability: 'attendibile',
      why: 'I numeri sono esatti. Il Residuo, per non disperdersi, ha bisogno di quote crescenti: da qui le quote, le riforme d\'ufficio, i prelievi straordinari.',
      body: [
        { t: '«Fabbisogno per anima: in origine un ricordo. Oggi: il trentuno per cento. Ascensioni: conferimento integrale.»', clue: 'fabbisogno' },
        { t: '«Sospesi conferiti ai Torchi per supporto cartaceo: perché ciò che è scritto su un\'anima non si può bruciare, e l\'Ufficio deve durare.»', clue: 'carta' },
      ],
    },
    {
      id: 'colloqui', title: 'Verbali dei sei colloqui', kind: 'verbale', source: 'Ufficio del Direttore', reliability: 'attendibile',
      why: 'Il Direttore non ha mai imposto il rinnovo al protagonista. Gliel\'ha sempre concesso.',
      body: [
        { t: 'Sei verbali. In ognuno, la tua ultima battuta è la stessa: «Preferisco non saperlo». E la sua: «Concesso. Ma tornerà: lei è l\'unico che non posso tenere».', clue: 'sei' },
      ],
    },
  ],
  clues: [
    { id: 'mai', label: 'Mai giudicato', text: 'Il Direttore è il Primo Scrivano. Non è mai stato giudicato: non c\'era nessuno prima di lui.', status: 'verificato', know: ['k_direttore'] },
    { id: 'tenerezza', label: '«Nulla va perduto»', text: 'Il Residuo nacque dal rifiuto del Primo Scrivano di lasciar dimenticare alle anime ciò che amavano.', status: 'verificato' },
    { id: 'fabbisogno', label: 'Il Residuo ha fame crescente', text: 'Da un ricordo per anima al trentuno per cento; le Ascensioni sono conferimenti integrali.', status: 'verificato' },
    { id: 'carta', label: 'I sospesi diventano la carta dell\'Ufficio', text: 'Le anime della Sala d\'Attesa sono conferite ai Torchi per farne carta che non brucia.', status: 'verificato', know: ['k_carta_anime_conferma'] },
    { id: 'sei', label: 'Sei volte: «Preferisco non saperlo»', text: 'Il Direttore non ti ha mai svuotato contro la tua volontà.', status: 'verificato' },
    { id: 'perche_io', label: 'Perché tu', text: 'Il Direttore ti tiene fuori dal Residuo perché gli serve qualcuno che non sia ancora lui per essere giudicato.', status: 'verificato' },
    { id: 'restituire', label: 'Il Residuo si può restituire', text: 'Il Direttore ammette che ogni barattolo può essere riaperto e reso: ma lui, allora, smetterebbe di esistere.', status: 'verificato' },
  ],
  topics: [
    { id: 'chi', q: 'Chi è lei?', tone: 'sincera', a: '«Ero il primo. Adesso sono ciò che ho tenuto. Sono il peso di un bambino addormentato, e un indirizzo di Mareschiara, e il nome della madre di un fornaio: Adalgisa. Si chiamava Adalgisa. Vede? Non è andato perduto.»' },
    { id: 'preleva', q: 'Perché preleva?', tone: 'sincera', needClues: ['tenerezza'], a: '«Perché voi li rimandate giù vuoti e lo chiamate rinnovo. Qualcuno deve ricordarsi di loro. Io sono il solo che li ama abbastanza da tenerli.» Nei barattoli, il respiro accelera appena. «Non mi dica che non è amore. Mi dica, se vuole, che è il tipo sbagliato.»' },
    { id: 'collegio', q: 'E il Collegio?', tone: 'sincera', needClues: ['fabbisogno'], a: '«Avevo bisogno di spazio. Ho chiesto ai migliori di restare interi, insieme. Poi lo spazio ha cominciato a votare, e io non ho più la maggioranza in casa mia.» Sembra quasi divertito. «È ciò che accade a chi non butta via niente.»' },
    { id: 'io', q: 'Perché io?', tone: 'sincera', needClues: ['sei'], gives: ['perche_io'], a: '«Perché non posso giudicarmi: sono fatto di tutti quelli che ho giudicato, e voterebbero. Mi serve uno che non sia ancora me. Ho scelto uno che aveva già taciuto una volta, e ne portava il peso. Sei volte lei è arrivata fin qui. Sei volte ha avuto pietà — di me, o di sé — e ha chiesto di non sapere. Io non ho pietà di me. Per questo la riassumo.»' },
    { id: 'rendere', q: 'I barattoli si possono riaprire?', tone: 'sincera', needClues: ['perche_io'], gives: ['restituire'], a: 'Un silenzio lungo. Nei barattoli tutto si ferma. «Sì. Ogni cosa può tornare a chi l\'ha perduta, se è ancora in giro, in qualunque forma. Ma io sono solo questo. Reso l\'ultimo, non resterebbe un Direttore. Resterebbe una scrivania.» Poi: «Non le ho mai mentito. Non comincio alla settima».' },
    { id: 'vuole', q: 'Che cosa vuole da me?', tone: 'sincera', a: '«Una sentenza. Qualunque. È l\'unica cosa, in tutto l\'Ufficio, che non ho mai ricevuto. Non la consigli, non la motivi se non vuole. La scriva.»' },
  ],
  contradictions: [],
  motivations: [
    { id: 'm_servizio', text: 'L\'Ufficio deve durare. Il Direttore ne è la condizione.', dest: ['ascension', 'waitingRoom'] },
    { id: 'm_tipo', text: 'È amore, ed è il tipo sbagliato.', needClues: ['tenerezza'] },
    { id: 'm_rendere', text: 'Ciò che è stato prelevato va reso a chi apparteneva.', needClues: ['restituire'] },
  ],
  outcomes: {
    ascension: {
      text: 'Scrivi: «Ascensione». Consegni il Direttore al Collegio: il primo scrivano alla sala che ha generato. «Ah» dice la voce. «La carriera.» I barattoli si svuotano verso l\'alto, uno a uno, come bolle.',
      consequences: ['Il Direttore è conferito al Collegio.', 'L\'Ufficio prosegue. Qualcuno dovrà dirigerlo.'],
      fx: { flags: ['final_ascension'] },
    },
    renewal: {
      text: 'Scrivi: «Rinnovo». Il Direttore dovrà dimenticare: lui, che non ha mai lasciato dimenticare nessuno. «Tutto?» chiede la voce. Per la prima volta, in tutti quei barattoli, c\'è paura. E sotto la paura, qualcosa che somiglia al sollievo.',
      consequences: ['Il Direttore è avviato al Rinnovo.', 'Il Residuo, privo di chi lo tiene, dovrà andare da qualche parte.'],
      fx: { flags: ['final_renewal'] },
    },
    trial: {
      text: 'Scrivi: «La Prova». Il Direttore resterà, ma sotto giudizio: ogni prelievo dovrà essere motivato davanti a qualcuno. «Un processo» dice la voce. «Con le udienze. I testimoni.» Una pausa. «Ne ho moltissimi.»',
      consequences: ['Il Direttore è sottoposto alla Prova: l\'Ufficio continua, sotto istruttoria.', 'Servirà qualcuno disposto a sostenere l\'accusa. E qualcuno a tenere aperto l\'Ufficio nel frattempo.'],
      fx: { flags: ['final_trial'] },
    },
    otherForm: {
      text: 'Scrivi: «Altra Forma». Non una persona, non un ufficio: qualcosa che non possa più trattenere. «Lei vuole disfarmi» dice la voce, senza astio. «Sappia che quando un archivio si disfa, le carte volano dappertutto.»',
      consequences: ['Il Direttore è destinato all\'Altra Forma: l\'istituzione perde la propria.', 'I barattoli cominciano a incrinarsi.'],
      fx: { flags: ['final_otherForm'] },
    },
    waitingRoom: {
      text: 'Scrivi: «Sala d\'Attesa». Sospendi. La voce resta zitta a lungo. «Sette» dice infine, con una stanchezza che ha l\'età del registro. «Va bene. So aspettare. L\'ho inventato io.»',
      consequences: ['Il giudizio sul Direttore è sospeso.', 'Tutto resta com\'è.'],
      fx: { flags: ['final_waiting'] },
    },
  },
  truth: [
    'Il Direttore è il Primo Scrivano, divenuto la somma di tutti i ricordi prelevati: il Residuo.',
    'Il prelievo nacque da un atto di tenerezza: impedire che le anime perdessero ciò che amavano.',
    'Il Residuo cresce e richiede quote sempre maggiori: di qui le riforme d\'ufficio, l\'Ascensione (conferimento integrale), i Torchi.',
    'Il Direttore non può giudicare se stesso e mantiene il protagonista fuori dal Residuo perché lo giudichi.',
    'Il Residuo può essere restituito; il Direttore cesserebbe di esistere.',
  ],
  truthClue: 'perche_io',
  residuo: 'è il Residuo',
};
