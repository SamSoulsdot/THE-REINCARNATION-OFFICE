// CAPITOLO III — The Repeating Souls. Vite precedenti, ritorni, indagine interna.
import type { CaseDef, GameState } from '../../../engine/types';

const T = (e: number, a: number, o: number, c: number, r: number, am: number) => ({
  empatia: e, altruismo: a, onesta: o, coraggio: c, responsabilita: r, ambizione: am,
});

export const C07: CaseDef = {
  id: 'c07',
  title: 'Anima n. 20.114/b — Sabina Tadini',
  type: 'vite_precedenti',
  soulId: 'S-SABINA',
  incarnation: {
    name: 'Sabina Tadini', ageAtDeath: 33, origin: 'Valle di Sorgiva', era: 'secolo delle ciminiere',
    occupation: 'operaia di filanda, già lavandaia', cause: 'insufficienza respiratoria, sei mesi dopo un\'inalazione di fumo',
    traits: T(6, 4, 5, 7, 5, 5),
    bio: 'Figlia della lavandaia Rosa Tadini. Cresciuta sola dopo la morte della madre. Non si è mai sposata. Le compagne di filanda dicevano che apparecchiava sempre per due.',
    relations: [
      { name: 'Rosa Tadini', role: 'madre', note: 'Morì credendo di aver partorito un figlio morto.' },
      { name: 'Ruggero Corvin', role: 'conte, coetaneo', note: 'Nato la stessa notte. Le ha scritto una lettera rimasta senza risposta.' },
      { name: 'Agnese Morvillo', role: 'levatrice', note: 'La fece nascere. Morta in un incendio sei mesi prima di lei.' },
    ],
    events: [
      { age: 0, text: 'Nasce la notte della piena, alla lavanderia.' },
      { age: 14, text: 'Resta orfana e prende il posto della madre al lavatoio.' },
      { age: 32, text: 'Riceve una lettera con lo stemma dei Corvin. Non risponde.' },
      { age: 33, text: 'Una sera di ottobre sale a Fontanelle. Torna all\'alba con le mani fasciate.' },
    ],
    motivations: ['Sapere che cosa le è stato tolto prima ancora di nascere.'],
    conflicts: ['Ha causato, senza volerlo, la morte della donna che voleva solo sentir negare.'],
    memories: ['un posto vuoto a tavola', 'un lume che cade lentamente', 'una voce: «esci dall\'orto, svelta»'],
  },
  pastLives: ['Ortis Maddalena, tessitrice — giudicata trentaquattro anni or sono dalla scrivania 7. Esito a registro: «sentenza doppia».'],
  arrival: 'Ha le mani fasciate fino ai gomiti e respira corto. Prima di sedersi sposta la seconda sedia, quella vuota, e la mette accanto alla sua. Poi si accorge del gesto e la rimette a posto, irritata.',
  registration: 'Modulo 1/A. Il numero d\'anima reca un suffisso che non hai mai visto: 20.114/b. Il protocollo chiede: «Registrare anche la /a? — NON PRESENTE».',
  summary: 'Vita breve e ordinaria. Il numero d\'anima è condiviso con un vivente. L\'Indice delle Reincarnazioni riporta per la vita precedente un esito che il regolamento non contempla.',
  recommended: 'renewal',
  recommendedWhy: 'Regolamento, art. 12: vita ordinaria → Rinnovo. Nota dell\'Indice: «le frazioni si trattano come unità».',
  docs: [
    {
      id: 'indice', title: 'Estratto dell\'Indice delle Reincarnazioni', kind: 'registro', source: 'Archivio', reliability: 'attendibile',
      why: 'L\'Indice registra esattamente ciò che la macchina del Rinnovo eseguì: due sentenze sulla stessa anima, due nascite.',
      body: [
        '«20.114 — ORTIS Maddalena, tessitrice. Esito del giudizio: SENTENZA DOPPIA.»',
        { t: '«Scrivano {iniziali} (scrivania 7): RINNOVO. Riforma d\'ufficio: LA PROVA. La prima destinazione non risulta annullata. Il Rinnovatore ha eseguito entrambe.»', clue: 'doppia' },
        { t: '«20.114/a — CORVIN Ruggero, nato a palazzo. 20.114/b — TADINI Sabina, nata alla lavanderia. Stessa notte, stessa ora.» Timbro a spirale spezzata.', clue: 'frazioni' },
      ],
    },
    {
      id: 'referto', title: 'Referto dell\'ospedale di Sorgiva', kind: 'referto', source: 'Ospedale civile', reliability: 'attendibile',
      why: 'Il medico descrisse le lesioni senza chiederne l\'origine: Sabina disse di essersi scottata al ranno.',
      body: [
        { t: '«Ustioni di secondo grado a mani e avambracci, da fiamma viva. Lesioni polmonari da fumo. La paziente dichiara: scottatura da ranno bollente, alla filanda.»', clue: 'ustioni' },
        '«Nel delirio ripete: “ha chiuso lei”, “l\'uscio davanti l\'ha chiuso lei”.»',
      ],
    },
    {
      id: 'lettera', title: 'Lettera di Ruggero Corvin', kind: 'lettera', source: 'Effetti personali', reliability: 'attendibile',
      why: 'Ruggero seppe la verità dal vecchio vetturino morente. Scrisse subito. Dice esattamente ciò che sente.',
      body: [
        '«Signorina Tadini, un uomo che non aveva motivo di mentire mi ha detto di chi sono figlio.»',
        { t: '«Ho sempre abitato questa casa come un mobile in prestito. Ho una sedia vuota accanto a me a ogni pranzo e non ho mai saputo per chi. Venga a palazzo. O verrò io al lavatoio. Dobbiamo essere, almeno una volta, nella stessa stanza.»', clue: 'ruggero' },
        'La lettera è stata aperta, letta molte volte e mai riscontrata.',
      ],
    },
  ],
  clues: [
    { id: 'doppia', label: 'Una sentenza doppia sulla vita precedente', text: 'Maddalena Ortis ricevette due destinazioni: il Rinnovo dello scrivano e la Prova della riforma d\'ufficio. Furono eseguite entrambe.', status: 'documento', know: ['k_sentenza_doppia'] },
    { id: 'frazioni', label: 'Sabina e Ruggero sono la stessa anima', text: 'Le due metà dell\'anima 20.114 sono nate la stessa notte: Ruggero a palazzo (il Rinnovo), Sabina alla lavanderia (la Prova).', status: 'documento' },
    { id: 'ustioni', label: 'Ustioni da fiamma viva', text: 'Il referto descrive ustioni da fiamma e danni da fumo; Sabina dichiarò una scottatura da ranno.', status: 'documento' },
    { id: 'nonc', label: 'Sabina: «A Fontanelle non ci sono mai salita»', text: 'Sabina nega di essere stata a casa di Agnese Morvillo la sera dell\'incendio.', status: 'testimonianza' },
    { id: 'ruggero', label: 'Ruggero ha una sedia vuota accanto', text: 'Anche Ruggero Corvin vive con la sensazione di una presenza mancante, e chiede di incontrarla.', status: 'testimonianza' },
    { id: 'fuoco', label: 'Era lei, la sera dell\'incendio', text: 'Sabina ammette: salì a Fontanelle a chiedere conto. Nella lite rovesciò il tavolo e il lume. Agnese la spinse nell\'orto e chiuse l\'uscio principale dall\'interno.', status: 'verificato', know: ['k_fontanelle'] },
    { id: 'meta', label: 'Si sente metà — e lo è', text: 'Sabina ha vissuto con la certezza di essere incompleta. L\'Indice le dà ragione alla lettera.', status: 'verificato' },
  ],
  topics: [
    { id: 'vita', q: 'Mi racconti la sua vita.', tone: 'sincera', a: '«A metà. Mezza paga, mezza casa, mezzo letto. Ho sempre cominciato le cose con una forza doppia e le ho finite con metà fiato. Credevo fosse il carattere.»' },
    { id: 'sedia', q: 'Ha spostato la sedia vuota.', tone: 'sincera', a: '«Lo faccio sempre. A tavola, in chiesa, al lavatoio. Preparo il posto.» Alza le spalle fasciate. «Da bambina mi picchiavano, per il secondo piatto. Poi hanno smesso di farci caso.»' },
    { id: 'fontanelle', q: 'L\'incendio di Fontanelle. Sul tavolo c\'erano due tazze.', tone: 'menzogna', cond: { know: 'k_due_tazze' }, gives: ['nonc'], a: '«E io che c\'entro. A Fontanelle non ci sono mai salita. Mi sono scottata al ranno, lo dice anche l\'ospedale.»' },
    { id: 'fontanelle2', q: 'Che cosa sa di Agnese Morvillo?', tone: 'menzogna', cond: { not: { know: 'k_due_tazze' } }, gives: ['nonc'], a: '«La levatrice. Mi ha fatta nascere. È morta bruciata, poveretta. A Fontanelle non ci sono mai salita.» L\'ha detto senza che tu glielo chiedessi.' },
    { id: 'confronto', q: 'Il ranno non lascia ustioni da fiamma viva.', tone: 'sincera', needContra: 'x_ustioni', gives: ['fuoco'], a: 'Tossisce a lungo. «Volevo solo che dicesse di no. Che il vetturino era un vecchio pazzo. Invece ha messo su l\'acqua e ha detto: “Lo so. Siediti”. Due tazze. Ho rovesciato il tavolo. Il lume ha fatto un arco lentissimo.» Si guarda le bende. «Mi ha presa per le braccia e mi ha buttata nell\'orto. Poi ho sentito la chiave dell\'uscio davanti. Dal di dentro.»' },
    { id: 'meta', q: 'L\'Indice dice che lei e Ruggero Corvin siete una sola anima.', tone: 'sincera', needClues: ['frazioni'], gives: ['meta'], a: 'Non ride e non si stupisce. «Ecco.» Tocca la sedia vuota. «Ecco per chi era.» Poi, con una rabbia quieta: «Chi è stato? La levatrice ha diviso i corpi. Ma l\'anima, chi l\'ha tagliata?» Guarda la sigla sull\'estratto. Guarda te.' },
    { id: 'vuole', q: 'Che cosa chiede a questo Ufficio?', tone: 'sincera', needClues: ['meta'], a: '«O intera, o niente. Non rimandatemi giù a metà un\'altra volta. Se lui deve ancora vivere, aspetto. Ma non in quella sala: ho sentito cosa dicono, delle panche.»' },
  ],
  contradictions: [
    { id: 'x_ustioni', a: 'ustioni', b: 'nonc', label: 'Ranno o fiamma?', note: 'Sabina nega di essere stata a Fontanelle e parla di ranno bollente; il referto descrive ustioni da fiamma viva e fumo.' },
  ],
  motivations: [
    { id: 'm_unita', text: 'Le frazioni si trattano come unità (nota dell\'Indice).', dest: ['renewal'] },
    { id: 'm_errore', text: 'La divisione dell\'anima è un errore d\'ufficio: non può esserle imputata.', needClues: ['doppia'] },
    { id: 'm_fuoco', text: 'Ha causato una morte e l\'ha taciuta.', needClues: ['fuoco'] },
  ],
  outcomes: {
    ascension: {
      text: '«Metà di un\'anima, in alto.» Non sai se il Collegio accetti le frazioni. Il montacarichi sì: si chiude su di lei con il solito silenzio. La seconda sedia resta spostata.',
      consequences: ['La frazione 20.114/b è ascesa.', 'La frazione /a, Ruggero Corvin, quando morirà non avrà nulla a cui ricongiungersi.'],
      fx: { flags: ['sabina_ascesa'] },
    },
    renewal: {
      text: '«Di nuovo metà.» Firma con la mano fasciata, storta. «Speriamo almeno che mi diano il fiato.»',
      consequences: ['La frazione 20.114/b è avviata al Rinnovo come unità.', 'Nascerà una persona a cui mancherà sempre qualcuno che non ha mai conosciuto.'],
      fx: { flags: ['sabina_rinnovo'] },
      reinc: { returnIn: 20, note: 'un posto vuoto a tavola, ereditato' },
    },
    trial: {
      text: '«La Prova l\'ho già fatta. Ero io, la Prova.» Lo dice senza alzare la voce. Timbri. Lei guarda il timbro come si guarda una cosa già vista.',
      consequences: ['La frazione 20.114/b è destinata alla Prova per la morte di Agnese Morvillo.', 'La metà nata nella Prova torna nella Prova.'],
      fx: { flags: ['sabina_prova'] },
      reinc: { returnIn: 20 },
    },
    otherForm: {
      text: '«Una bestia intera è meglio di mezza donna.» È quasi allegra. «Scriva: qualcosa che sta in coppia.»',
      consequences: ['La frazione 20.114/b lascia la forma umana.'],
      fx: { flags: ['sabina_forma'] },
      reinc: { form: 'una tortora, di quelle che vivono in due', returnIn: 20 },
    },
    waitingRoom: {
      text: '«No. Non là.» È la prima volta che un\'anima ti dice di no. Il regolamento non prevede il consenso. Il Custode aspetta sulla porta con la lanterna bassa.',
      consequences: ['La frazione 20.114/b è trattenuta in Sala d\'Attesa.', 'Aveva sentito «cosa dicono, delle panche».'],
      fx: { flags: ['sabina_attesa'], soulStatus: { 'S-SABINA': 'in_attesa' } },
    },
  },
  specials: [
    {
      id: 'ricongiunzione', label: 'Sospensione per ricongiunzione', desc: 'Sentenza speciale: giudizio sospeso fino all\'arrivo della frazione /a. L\'anima attende in custodia, fuori dalla Sala d\'Attesa, per essere giudicata intera.',
      needClues: ['frazioni'], dest: 'waitingRoom',
      outcome: {
        text: 'Scrivi a margine dell\'Indice, accanto alla tua vecchia sigla: «Da ricongiungere. Errore mio». Sabina legge le due parole. «Almeno uno che lo scrive.» Mr. Hoot le prepara una branda tra gli scaffali delle Sospensioni, lontano dalle panche.',
        consequences: ['La frazione 20.114/b è sospesa in custodia d\'Archivio in attesa della /a.', 'Hai riconosciuto a registro un errore commesso da te in un\'altra assunzione.'],
        irregular: 'Ammissione scritta di errore su atto di precedente gestione.',
        fx: { flags: ['sabina_ricongiunzione'], rel: { hoot: 2 }, stats: { sospetto: 4 }, know: ['k_errore_mio'] },
      },
    },
  ],
  truth: [
    'Sabina Tadini e Ruggero Corvin sono due metà della stessa anima (20.114), divisa da una «sentenza doppia».',
    'La sentenza doppia nacque dalla riforma d\'ufficio di un Rinnovo deciso dal protagonista in un\'assunzione precedente.',
    'La frazione del Rinnovo nacque nel privilegio, quella della Prova nella miseria: Agnese, scambiando i gemelli, ha separato anche i corpi.',
    'Sabina salì a Fontanelle; nella lite cadde il lume; Agnese morì per coprirne la fuga.',
    'Sabina è morta sei mesi dopo per il fumo respirato.',
  ],
  truthClue: 'fuoco',
  residuo: 'la metà di ogni ricordo: il resto è nella frazione /a',
};

// --- C08: il ritorno di Lorenz Hable. Tre forme, secondo la sentenza del Capitolo I. ---

function c08Human(g: GameState): CaseDef {
  const prova = !!g.flags['lorenz_prova'];
  const rett = !!g.flags['kessel_rettificato'];
  const vos = !!g.flags['vos_segue_lorenz'];
  const bioRefusal = prova
    ? 'Telefonista di campo durante la Guerra dei Fili. Ricevette l\'ordine di trasmettere le coordinate di un villaggio. Posò la cornetta.'
    : 'Compositrice alla tipografia di Stato. Ricevette l\'ordine di stampare, in una notte, gli elenchi nominativi per il Commissariato. Spense la macchina.';
  return {
    id: 'c08',
    title: 'Il ritorno — Ines Dorn',
    type: 'ritorno',
    soulId: 'S-LORENZ',
    incarnation: {
      name: 'Ines Dorn', ageAtDeath: 31, origin: prova ? 'Fronte orientale, settore dei Fili' : 'Capitale, quartiere delle Stamperie', era: 'secolo dei fili',
      occupation: prova ? 'telefonista di campo' : 'compositrice tipografa',
      cause: prova ? 'fucilazione per insubordinazione' : 'febbre carceraria, dopo l\'arresto per sabotaggio',
      traits: T(7, 6, 7, 8, 5, 3),
      bio: bioRefusal + ' Nessuno, tra chi la conosceva, sa spiegare perché una donna tanto ordinata avesse quell\'unica, irremovibile disobbedienza.',
      relations: [
        { name: prova ? 'Ten. Aldous Kray' : 'Proto Ottmar Reuss', role: prova ? 'superiore' : 'capo officina', note: 'Ha firmato la denuncia per insubordinazione.' },
        ...(vos ? [{ name: 'Dario Voss', role: 'portinaio', note: 'Un vecchio dalle mani sempre fredde. La seguì da uno stabile all\'altro. Le portava il carbone e non volle mai essere pagato.' }] : []),
      ],
      events: [
        { age: 9, text: 'Impara a comporre le righe al contrario, senza che nessuno glielo insegni.' },
        { age: 19, text: 'Sviene la prima volta che sente odore di petrolio da lumi.' },
        { age: 31, text: prova ? 'Posa la cornetta. Il villaggio non viene colpito quella notte.' : 'Spegne la macchina. Gli elenchi escono con due giorni di ritardo.' },
        { age: 31, text: prova ? 'Fucilata all\'alba.' : 'Muore in infermeria carceraria.' },
      ],
      motivations: ['Non eseguire ciò che non potrebbe poi smettere di sentire.'],
      conflicts: ['Non sa da dove le venga il suo «no», e ne ha paura.'],
      memories: ['un sogno ricorrente: nove voci che cantano dietro una porta', 'dodici passi contati senza motivo', 'un saluto con due dita alla tempia'],
      inherited: {
        predisposizioni: ['rifiuto degli ordini gridati'],
        paure: ['l\'odore di petrolio'],
        inclinazioni: ['la precisione del tipografo'],
        talenti: ['comporre righe al contrario'],
        conflitti: ['aver detto no senza salvare nessuno'],
        memorie: ['nove voci dietro una porta'],
        legami: vos ? ['un uomo dalle mani fredde che ripara in silenzio'] : ['un sergente che non ricorda di aver conosciuto'],
      },
    },
    pastLives: [
      rett
        ? 'Lorenz Hable, fuciliere — foglio matricolare RETTIFICATO a tua firma. Giudicato a questa scrivania.'
        : 'Lorenz Hable, fuciliere, «disertore» — giudicato a questa scrivania.',
      'Tre giudizi anteriori, di cui uno siglato {iniziali}, scrivania 7.',
    ],
    arrival: 'Una donna giovane, con le dita macchiate ' + (prova ? 'di grafite' : 'd\'inchiostro') + '. Si guarda intorno con educata curiosità: non ti riconosce. Poi, sedendosi, porta due dita alla tempia in un piccolo saluto — e sembra stupita del proprio gesto.',
    registration: 'Modulo 1/A, con cartiglio rosso «RITORNO». L\'Indice aggancia automaticamente la vita precedente. Madame Vesper ha allegato una nota: «Recidiva nell\'insubordinazione. Si raccomanda fermezza».',
    summary: 'Seconda vita consecutiva conclusa da un rifiuto d\'obbedienza. La Direzione parla di recidiva. Il fascicolo non dice che cosa, in entrambe le vite, quell\'obbedienza avrebbe prodotto.',
    recommended: 'trial',
    recommendedWhy: 'Nota di Direzione: recidiva nell\'insubordinazione (art. 19-bis) → La Prova, aggravata.',
    docs: [
      {
        id: 'denuncia', title: prova ? 'Rapporto del ten. Kray' : 'Denuncia del proto Reuss', kind: 'rapporto', source: prova ? 'Comando di settore' : 'Tipografia di Stato', reliability: 'distorto',
        why: 'Chi denunciò descrisse l\'atto come capriccio o sabotaggio per non dover scrivere a che cosa servisse l\'ordine.',
        body: [
          prova
            ? '«La telefonista Dorn, ricevuto un ordine di tiro regolarmente cifrato, interrompeva la comunicazione senza giustificato motivo.»'
            : '«La compositrice Dorn arrestava deliberatamente la macchina durante una commessa urgente del Commissariato.»',
          { t: '«Richiesta di spiegazioni, rispondeva soltanto: no. Non adduceva altro.»', clue: 'no' },
        ],
      },
      {
        id: 'ordine', title: prova ? 'Ordine di tiro n. 44 (decifrato)' : 'Bozza della commessa interrotta', kind: 'verbale', source: 'Allegato d\'ufficio', reliability: 'attendibile',
        why: 'Il documento mostra che cosa sarebbe successo se Ines avesse obbedito. Nessuno lo aveva allegato alla denuncia.',
        body: [
          {
            t: prova
              ? '«Obiettivo: abitato di Sant\'Orso. Presenza nemica: non confermata. Popolazione: non evacuata.» Il villaggio non fu colpito: la batteria ricevette il contrordine il mattino dopo.'
              : '«Elenco nominativo dei residenti da prelevare, in ordine di via.» Nei due giorni di ritardo, più di metà dei nomi in elenco lasciò la città.',
            clue: 'effetto',
          },
        ],
      },
      {
        id: 'sogni', title: 'Quaderno dei sogni', kind: 'oggetto', source: 'Effetti personali', reliability: 'attendibile',
        why: 'Ines annotava i sogni per liberarsene. Sono i frammenti di memoria sopravvissuti al Rinnovo di Lorenz.',
        body: [
          { t: '«Ancora la porta. Dietro cantano, in nove: li conto dalle voci. Io ho in mano qualcosa che scotta e la poso per terra. Poi faccio dodici passi. Non arrivo mai al tredicesimo.»', clue: 'sogno' },
          vos
            ? '«Il signor Voss mi ha portato il carbone anche oggi. Gli ho chiesto perché. Ha detto: “Per stare a tiro”. Non ho capito, ma non ho avuto paura.»'
            : '«Mi sveglio con il saluto dei tipografi già a metà. Chi me l\'ha insegnato?»',
        ],
      },
    ],
    clues: [
      { id: 'no', label: 'Disse soltanto «no»', text: 'Ines rifiutò un ordine senza dare spiegazioni: solo «no».', status: 'documento' },
      { id: 'effetto', label: 'Che cosa impedì il suo rifiuto', text: prova ? 'L\'ordine avrebbe colpito un villaggio non evacuato. Il suo rifiuto lo salvò.' : 'Gli elenchi servivano a prelevare persone. Il ritardo permise a molti di fuggire.', status: 'verificato' },
      { id: 'sogno', label: 'Sogna Kessel senza saperlo', text: 'Ines sogna nove voci dietro una porta, un oggetto che scotta posato a terra, dodici passi.', status: 'documento', know: ['k_memorie_frammento'] },
      { id: 'verita', label: 'Il «no» di Lorenz è sopravvissuto al Rinnovo', text: 'Ciò che l\'Ufficio chiama recidiva è l\'unica cosa che di Lorenz Hable è rimasta intera: il rifiuto. E questa volta ha salvato qualcuno.', status: 'verificato', know: ['k_eredita_no'] },
    ],
    topics: [
      { id: 'saluto', q: 'Quel saluto con due dita. Dove l\'ha imparato?', tone: 'confusa', a: '«Non lo so. Mi viene davanti alle persone a cui devo qualcosa.» Arrossisce. «È assurdo. Io lei non la conosco.»' },
      { id: 'no', q: 'Perché ha detto di no?', tone: 'sincera', needClues: ['no'], a: '«Non l\'ho deciso. È come quando la mano si ritira dal fuoco. Avevo un “no” già pronto, da prima, da molto prima di me. Mi ha fatto paura, quanto era vecchio.»' },
      { id: 'sogno', q: 'Nel sogno, cosa c\'è dietro la porta?', tone: 'sincera', needClues: ['sogno'], gives: ['verita'], a: '«Gente che canta per far star zitti i bambini. Lo so e basta.» Ti guarda. «Lei sa cos\'è, vero? Lo vedo. È una cosa successa a qualcuno.» Annuisce da sola. «Stavolta al tredicesimo passo ci sono arrivata. Non con i piedi. Ma ci sono arrivata.»' },
      { id: 'tu', q: 'Le hanno mai promesso che sarebbe andata diversamente?', tone: 'confusa', cond: { know: 'k_lorenz_riconosce' }, a: 'Aggrotta la fronte, come davanti a un refuso. «È una frase strana da chiedere.» Poi, lentamente: «…Sì. Qualcuno. Non ricordo la faccia. Mi dispiace: ho l\'impressione che la faccia fosse importante».', fx: { know: ['k_residuo_volto'] } },
    ],
    contradictions: [],
    motivations: [
      { id: 'm_recidiva', text: 'Recidiva nell\'insubordinazione: art. 19-bis.', dest: ['trial'] },
      { id: 'm_salvo', text: 'Il rifiuto ha salvato delle vite: non è colpa, è merito.', needClues: ['effetto'] },
      { id: 'm_stesso', text: 'È lo stesso «no» di Kessel. Punirlo due volte significa punire l\'unica parte di quest\'anima che non siamo riusciti a prelevare.', needClues: ['verita'] },
    ],
    outcomes: {
      ascension: {
        text: '«In alto» ripete. Fa il suo piccolo saluto, questa volta di proposito. «Allora grazie. A chiunque lei sia stata, per me.» Il montacarichi sale.',
        consequences: ['L\'anima di Lorenz Hable / Ines Dorn è ascesa.', 'Il «no» esce dal ciclo.'],
        fx: { flags: ['lorenz2_asceso'] },
      },
      renewal: {
        text: 'Timbri il Rinnovo contro la nota di Direzione. Ines firma al contrario, da destra a sinistra, perfetta. «Diversamente» dice, senza sapere perché le sia venuta proprio quella parola.',
        consequences: ['L\'anima è avviata al Rinnovo, in difformità dalla nota di Direzione.', 'La promessa fatta a Lorenz Hable, due vite fa, è stata mantenuta.'],
        fx: { flags: ['lorenz2_rinnovo', 'promessa_mantenuta'], rel: { bones: 2, vesper: -1 } },
        reinc: { returnIn: 30, note: 'il «no», intatto' },
      },
      trial: {
        text: '«Di nuovo?» Non sa di averlo detto. Timbri. Da qualche parte, sotto il pavimento, una macchina prende nota: terza Prova consecutiva.',
        consequences: ['L\'anima è destinata alla Prova aggravata, come da nota di Direzione.', 'Terza Prova consecutiva per lo stesso rifiuto.'],
        fx: { flags: ['lorenz2_prova'], rel: { vesper: 1, bones: -2 }, stats: { reputazione: 2 } },
        reinc: { returnIn: 30 },
      },
      otherForm: {
        text: '«Qualcosa che non riceve ordini.» L\'ha detto con le parole esatte di un ragazzo in cappotto militare. Non lo sa.',
        consequences: ['L\'anima lascia la forma umana.'],
        fx: { flags: ['lorenz2_forma'] },
        reinc: { form: 'un falco di passo', returnIn: 30 },
      },
      waitingRoom: {
        text: 'La sospendi. Ines guarda la porta della Sala d\'Attesa e si irrigidisce. «Quella porta la conosco.» Conta i passi fino alla soglia. Sono dodici.',
        consequences: ['L\'anima è trattenuta in Sala d\'Attesa.'],
        fx: { flags: ['lorenz2_attesa'], soulStatus: { 'S-LORENZ': 'in_attesa' } },
      },
    },
    truth: [
      'Ines Dorn è la reincarnazione di Lorenz Hable.',
      'Ha ereditato il rifiuto degli ordini, la paura del petrolio, il mestiere del tipografo e un frammento di Kessel in sogno.',
      'Il suo rifiuto, questa volta, ha salvato delle vite.',
      'Non ricorda lo scrivano: il volto di chi la giudicò è stato prelevato come Residuo.',
    ],
    truthClue: 'verita',
    residuo: 'il sogno delle nove voci; il perché del saluto',
  };
}

function c08Dog(): CaseDef {
  return {
    id: 'c08',
    title: 'Il ritorno — il cane di caserma',
    type: 'ritorno',
    soulId: 'S-LORENZ',
    incarnation: {
      name: 'un cane detto «Sergente»', ageAtDeath: 11, origin: 'Caserma di Altenmark', era: 'secolo dei fili',
      occupation: 'cane di caserma', cause: 'colpo d\'arma da fuoco',
      traits: T(8, 7, 9, 9, 6, 0),
      bio: 'Meticcio comparso da cucciolo nel cortile della caserma. Le reclute gli diedero per scherzo il nome di un grado. Non ha mai obbedito al fischio di un ufficiale.',
      relations: [{ name: 'Recluta Emil Brandt', role: 'coscritto', note: 'Dichiara che il cane gli ha salvato la schiena.' }],
      events: [
        { age: 1, text: 'Entra nel cortile sotto la pioggia e non se ne va più.' },
        { age: 11, text: 'Si mette tra una recluta e il frustino di un capitano. Non si sposta.' },
      ],
      motivations: ['Stare davanti a chi viene colpito.'],
      conflicts: [],
      memories: ['un odore di petrolio che fa ringhiare', 'dodici passi nel cortile, sempre gli stessi'],
      form: 'un cane di caserma',
      inherited: {
        predisposizioni: ['mettersi in mezzo'], paure: ['il petrolio'], inclinazioni: [], talenti: [],
        conflitti: [], memorie: ['dodici passi'], legami: ['i ragazzi in divisa troppo larga'],
      },
    },
    pastLives: ['Lorenz Hable, fuciliere — destinato all\'Altra Forma a questa scrivania.'],
    arrival: 'Sulla sedia delle anime non c\'è nessuno. Poi senti un respiro sotto la scrivania. Un vecchio cane grigio, con un foro tra le scapole che non sanguina, ti si accuccia sui piedi come se conoscesse il posto.',
    registration: 'Modulo 6/F — Rientro da Altra Forma. Il protocollo avverte: «soggetto non verbalizzabile».',
    summary: 'Rientro da Altra Forma. Undici anni vissuti da cane. Morto per essersi messo tra un ragazzo e un ufficiale.',
    recommended: 'renewal',
    recommendedWhy: 'Regolamento, art. 27: al rientro da Altra Forma si procede d\'ufficio al Rinnovo.',
    noInterview: 'Il soggetto non parla. Ti guarda. Quando pronunci la parola «ordine», ringhia piano, senza muoversi dai tuoi piedi.',
    docs: [
      {
        id: 'recluta', title: 'Dichiarazione della recluta Brandt', kind: 'testimonianza', source: 'Servizio Testimonianze', reliability: 'attendibile',
        why: 'Il ragazzo dice ciò che ha visto. Non ha motivo di abbellire: ha disertato il giorno dopo.',
        body: [
          '«Il capitano voleva che corressi ancora e io non ce la facevo. Ha alzato il frustino.»',
          { t: '«Il cane si è messo in mezzo. Non abbaiava. Stava lì. Il capitano ha detto “via” tre volte, poi ha tirato fuori la pistola. Il cane non si è spostato. Io sì. Mi vergogno ancora.»', clue: 'mezzo' },
        ],
      },
      {
        id: 'cortile', title: 'Nota del maresciallo di cucina', kind: 'nota', source: 'Caserma di Altenmark', reliability: 'attendibile',
        why: 'Un\'osservazione oziosa, che nessuno ha mai collegato a niente.',
        body: [
          { t: '«Faceva sempre lo stesso giro nel cortile: dodici passi verso la porta della legnaia, poi si fermava e tornava indietro. Undici anni così. Davanti alle taniche di petrolio non passava.»', clue: 'dodici' },
        ],
      },
      {
        id: 'indice', title: 'Estratto dell\'Indice delle Reincarnazioni', kind: 'registro', source: 'Archivio', reliability: 'attendibile',
        why: 'L\'Indice aggancia la vita precedente: è lo stesso fascicolo, con una riga in più.',
        body: [
          '«HABLE Lorenz, fuciliere. Destinazione: Altra Forma. Scrivano: {iniziali}, scrivania 7.»',
          { t: '«Causa del decesso, vita precedente: colpo d\'arma da fuoco, per rifiuto d\'obbedienza. Causa del decesso, forma corrente: colpo d\'arma da fuoco, per rifiuto d\'obbedienza.» Il protocollo ha aggiunto, d\'ufficio, un punto interrogativo.', clue: 'verita' },
        ],
      },
    ],
    clues: [
      { id: 'mezzo', label: 'Si mise in mezzo e non si spostò', text: 'Il cane fu ucciso per essersi interposto tra una recluta e un ufficiale.', status: 'testimonianza' },
      { id: 'dodici', label: 'Dodici passi, ogni giorno', text: 'Per undici anni il cane ha percorso dodici passi verso una porta, fermandosi sempre allo stesso punto.', status: 'documento', know: ['k_memorie_frammento'] },
      { id: 'verita', label: 'Anche da cane, ha detto no', text: 'L\'Altra Forma ha tolto a Lorenz il linguaggio ma non il rifiuto: è morto di nuovo alla stessa maniera.', status: 'verificato', know: ['k_eredita_no'] },
    ],
    topics: [],
    contradictions: [],
    motivations: [
      { id: 'm_27', text: 'Rientro da Altra Forma: art. 27.', dest: ['renewal'] },
      { id: 'm_no', text: 'Ha dimostrato due volte, in due forme, la stessa cosa.', needClues: ['mezzo', 'dodici'] },
    ],
    outcomes: {
      ascension: { text: 'Il montacarichi non ha una procedura per i cani. Si apre lo stesso. Lui entra, si volta, si siede. Aspetta che le porte si chiudano guardando te.', consequences: ['L\'anima di Lorenz Hable è ascesa in forma non umana.', 'Il protocollo ha registrato: «asceso: 1 (uno), cane».'], fx: { flags: ['lorenz2_asceso'] } },
      renewal: { text: 'Timbri il Rinnovo. Il cane si alza, ti annusa la mano che tiene la penna, e se ne va verso la porta giusta senza che nessuno gliela indichi.', consequences: ['L\'anima torna alla forma umana.', 'Hai l\'impressione di essere stato perdonato da qualcuno che non può dirlo.'], fx: { flags: ['lorenz2_rinnovo', 'promessa_mantenuta'], rel: { bones: 1 } }, reinc: { returnIn: 30, note: 'il «no», intatto' } },
      trial: { text: 'Scrivi «La Prova». Il cane ringhia piano alla parola, poi ti lecca le dita: non ce l\'ha con te. È peggio.', consequences: ['L\'anima è destinata alla Prova.'], fx: { flags: ['lorenz2_prova'], rel: { bones: -2 } }, reinc: { returnIn: 30 } },
      otherForm: { text: 'Lo lasci com\'è. Scodinzola una volta sola, educatamente.', consequences: ['L\'anima resta nell\'Altra Forma.'], fx: { flags: ['lorenz2_forma'] }, reinc: { form: 'un cane, di nuovo', returnIn: 30 } },
      waitingRoom: { text: 'Lo accompagni tu alla Sala d\'Attesa. Si ferma a dodici passi dalla porta e non va oltre. Deve portarlo dentro il Custode, in braccio.', consequences: ['L\'anima è trattenuta in Sala d\'Attesa.'], fx: { flags: ['lorenz2_attesa'], soulStatus: { 'S-LORENZ': 'in_attesa' } } },
    },
    truth: [
      'Il cane «Sergente» è la reincarnazione in Altra Forma di Lorenz Hable.',
      'È morto interponendosi tra una recluta e un ufficiale.',
      'Per undici anni ha ripetuto i dodici passi di Kessel senza poterli comprendere.',
    ],
    truthClue: 'verita',
    residuo: 'niente che abbia un nome',
  };
}

function c08Mother(g: GameState): CaseDef {
  const asceso = !!g.flags['lorenz_asceso'];
  return {
    id: 'c08',
    title: 'Chi cerca suo figlio — Hanne Hable',
    type: 'ritorno',
    soulId: 'S-HANNE',
    incarnation: {
      name: 'Hanne Hable', ageAtDeath: 79, origin: 'Altopiano di Kessel', era: 'secolo dei fili',
      occupation: 'sarta', cause: 'vecchiaia',
      traits: T(7, 5, 4, 5, 7, 2),
      bio: 'Vedova. Ha cucito divise per trent\'anni. Ha vissuto di una pensione d\'onore intestata a un figlio che l\'esercito chiamava disertore.',
      relations: [
        { name: 'Lorenz Hable', role: 'figlio', note: asceso ? 'Asceso. Non reperibile.' : 'In Sala d\'Attesa, per tua decisione.' },
        { name: 'Dragan Vos', role: 'benefattore', note: 'Le fece avere la pensione. Lei scoprì chi fosse dieci anni prima di morire.' },
      ],
      events: [
        { age: 44, text: 'Riceve la comunicazione: figlio disertore, caduto in fuga.' },
        { age: 48, text: 'Riceve, senza averla chiesta, una pensione «per caduto con onore».' },
        { age: 69, text: 'Il caporale Molnar, morente, le racconta la notte di Kessel.' },
        { age: 79, text: 'Muore. Ha continuato a ritirare la pensione fino all\'ultimo mese.' },
      ],
      motivations: ['Rivedere suo figlio.'],
      conflicts: ['Per dieci anni ha mangiato il pane dell\'uomo che lo aveva ucciso, sapendolo.'],
      memories: ['un cappotto militare da accorciare', 'una busta della Cassa Militare, ogni primo del mese'],
    },
    arrival: 'Una vecchia con un metro da sarta al collo. Non guarda te: guarda la sala, le sedie, la porta in fondo. «È passato di qui, vero? Il mio ragazzo. Mi hanno detto che passate tutti di qui.»',
    registration: 'Modulo 1/A. Nel campo «richieste dell\'anima»: «ricongiungimento con HABLE Lorenz». Il protocollo risponde: ' + (asceso ? '«ASCESO — NON REPERIBILE».' : '«IN ATTESA — fascicolo n. 3, a tua firma».'),
    summary: 'Vita ordinaria. Chiede del figlio. ' + (asceso ? 'Il figlio è asceso per tua decisione e non risulta reperibile in alcun registro.' : 'Il figlio è in Sala d\'Attesa per tua decisione, da ' + Math.max(1, g.day - 3) + ' giorni.'),
    recommended: 'renewal',
    recommendedWhy: 'Regolamento, art. 12: vita ordinaria → Rinnovo. Le richieste di ricongiungimento «non sono titolo».',
    docs: [
      {
        id: 'busta', title: 'Buste della Cassa Militare', kind: 'oggetto', source: 'Effetti personali', reliability: 'attendibile',
        why: 'Hanne ha conservato ogni busta. Le ultime centoventi non sono mai state aperte: ritirava il denaro e non lo toccava.',
        body: [
          'Trecentosessanta buste, legate per annata.',
          { t: 'Le ultime dieci annate sono intatte, il denaro ancora dentro. Su ognuna, a matita: «di lui». Non è chiaro di quale dei due.', clue: 'buste' },
        ],
      },
      {
        id: 'molnar', title: 'Appunto di Hanne dopo la visita a Molnar', kind: 'nota', source: 'Effetti personali', reliability: 'attendibile',
        why: 'Scritto la sera stessa. È il momento in cui Hanne sa.',
        body: [
          { t: '«Me l\'ha detto. Il mio ha detto no ed è andato ad aprire. E chi mi paga è quello che gli ha sparato. Domani vado alla Cassa a dire che non la voglio più.» Sotto, altra data: «Non ci sono andata».', clue: 'sapeva' },
        ],
      },
      asceso
        ? {
            id: 'modulo', title: 'Modulo di reperibilità — esito', kind: 'registro' as const, source: 'Livelli Superiori', reliability: 'incompleto' as const,
            why: 'Il Collegio risponde a ogni richiesta sugli ascesi con lo stesso foglio. È bianco, ed è tiepido.',
            body: [
              { t: 'Il foglio è intestato «HABLE Lorenz — asceso». Per il resto è bianco. Tenendolo in mano, ti accorgi che è tiepido come una fronte.', clue: 'tiepido' },
            ],
          }
        : {
            id: 'modulo', title: 'Stato della sospensione — Hable Lorenz', kind: 'registro' as const, source: 'Sala d\'Attesa', reliability: 'attendibile' as const,
            why: 'Nota del Custode. Dice il vero: Lorenz parla ancora.',
            body: [
              { t: '«Seduto. Parla. Conta i passi di chi entra. Non è di mia competenza.» Firma: una G storta.', clue: 'parla' },
            ],
          },
    ],
    clues: [
      { id: 'buste', label: 'Dieci anni di pensione mai toccata', text: 'Hanne ritirò la pensione fino alla fine ma, negli ultimi dieci anni, non ne spese un soldo.', status: 'documento' },
      { id: 'sapeva', label: 'Sapeva chi la pagava', text: 'Hanne seppe da Molnar che Vos aveva ucciso suo figlio. Decise di rinunciare alla pensione. Non lo fece.', status: 'documento' },
      ...(asceso ? [{ id: 'tiepido', label: 'Il foglio degli ascesi è bianco e tiepido', text: 'Alla richiesta di reperire un asceso, i Livelli Superiori rispondono con un foglio bianco, tiepido al tatto.', status: 'documento' as const, know: ['k_fascicoli_tiepidi'] }] : []),
      ...(!asceso ? [{ id: 'parla', label: 'Lorenz, in Sala d\'Attesa, parla ancora', text: 'Il Custode annota che Lorenz Hable è seduto, parla, conta i passi.', status: 'documento' as const }] : []),
      { id: 'verita', label: 'Non le serviva il denaro: le serviva la busta', text: 'Hanne ammette che continuò a ritirare la pensione perché su quella busta c\'era scritto «con onore» accanto al nome del figlio.', status: 'verificato' },
    ],
    topics: [
      { id: 'figlio', q: 'Suo figlio è passato da questa scrivania.', tone: 'sincera', a: '«Lo sapevo. Ha il suo odore, questa sedia. Inchiostro.» Liscia il bracciolo. «Dov\'è? Me lo dica com\'è, non come sta scritto.»' },
      { id: 'dove', q: asceso ? 'L\'ho fatto ascendere.' : 'L\'ho mandato in Sala d\'Attesa.', tone: 'sincera', a: asceso ? '«In alto.» Si illumina, e poi vede la tua faccia. «E non si può andare a trovarlo, in alto?» Le porgi il modulo di reperibilità. Lo tiene tra le mani. «È caldo» dice. «Perché è caldo?»' : '«Ad aspettare. Che cosa?» Non lo sai. «Allora mi ci mandi anche me. So aspettare meglio di lui: ho più pratica.»' },
      { id: 'pensione', q: 'Lei sapeva chi le pagava la pensione.', tone: 'sincera', needClues: ['sapeva'], gives: ['verita'], a: '«Sì.» Non abbassa gli occhi. «I soldi non li ho più toccati. Ma la busta… Sulla busta c\'era scritto “caduto con onore”. Era l\'unico posto al mondo dove stava scritto. L\'esercito diceva disertore, il paese diceva disertore. Solo l\'assassino diceva onore. Ho tenuto la busta.»' },
    ],
    contradictions: [],
    motivations: [
      { id: 'm_12', text: 'Vita ordinaria: art. 12.', dest: ['renewal'] },
      { id: 'm_busta', text: 'Ha accettato il denaro dell\'assassino per conservare il nome del figlio.', needClues: ['verita'] },
    ],
    outcomes: {
      ascension: { text: asceso ? '«Dove sta lui.» Le timbri l\'Ascensione. Sale stringendo il foglio tiepido contro il petto, come si tiene un neonato.' : '«In alto? Ma lui è di sotto.» Timbri. Il regolamento non ammette che un\'anima rifiuti un premio.', consequences: ['Hanne Hable è ascesa.', asceso ? 'A registro: «congiunta al figlio, ove reperibile».' : 'Madre e figlio sono ora separati da tutti i piani dell\'edificio.'], fx: { flags: ['hanne_ascesa'] } },
      renewal: { text: '«Ricominciare senza di lui.» Piega il metro da sarta e lo posa sulla scrivania. «Questo lo tenga. Se passa, glielo dia: sa a cosa serve.»', consequences: ['Hanne Hable è avviata al Rinnovo.', 'Il metro da sarta è stato versato all\'Archivio.'], reinc: { returnIn: 30 } },
      trial: { text: '«Per la busta» dice subito. «È giusto.» È la seconda della sua famiglia a dirlo a questa scrivania.', consequences: ['Hanne Hable è destinata alla Prova.'], reinc: { returnIn: 30 } },
      otherForm: { text: '«Un gatto di sartoria» propone lei. «Stanno sulle pezze e guardano la porta.»', consequences: ['Hanne Hable lascia la forma umana.'], reinc: { form: 'una gatta di sartoria', returnIn: 30 } },
      waitingRoom: {
        text: asceso ? 'La sospendi. Si siede sulla panca più vicina al montacarichi. «Aspetto che scenda.» Nessuno le dice che non scendono.' : 'La sospendi. Il Custode la accompagna. Dalla porta socchiusa senti una voce giovane che smette di contare: «…Mamma?»',
        consequences: asceso ? ['Hanne Hable è trattenuta in Sala d\'Attesa.'] : ['Hanne Hable è trattenuta in Sala d\'Attesa, accanto al figlio.', 'Due anime che si parlano non sono «di competenza» del Custode.'],
        fx: asceso ? { soulStatus: { 'S-HANNE': 'in_attesa' } } : { flags: ['hable_riuniti'], rel: { bones: 1 }, soulStatus: { 'S-HANNE': 'in_attesa' } },
      },
    },
    truth: [
      'Hanne Hable seppe da Molnar la verità sulla morte del figlio.',
      'Continuò a ritirare la pensione di Vos senza spenderla, per conservare la busta che dichiarava il figlio «caduto con onore».',
      asceso ? 'Gli ascesi non sono reperibili: il loro modulo torna bianco e tiepido.' : 'Lorenz Hable, in Sala d\'Attesa, è ancora integro perché continua a parlare.',
    ],
    truthClue: 'verita',
    residuo: 'la misura esatta delle spalle del figlio',
  };
}

export function C08(g: GameState): CaseDef {
  if (g.flags['lorenz_forma']) return c08Dog();
  if (g.flags['lorenz_asceso'] || g.flags['lorenz_attesa']) return c08Mother(g);
  return c08Human(g);
}

export const C09: CaseDef = {
  id: 'c09',
  title: 'Indagine interna n. 3 — Consulente Marrow',
  type: 'indagine_interna',
  soulId: 'S-ILSE',
  incarnation: {
    name: 'Ilse Marrow', ageAtDeath: 38, origin: 'Ospedale dei Tigli', era: 'secolo delle ciminiere',
    occupation: 'Consulente dei Colloqui (in vita: medico alienista)', cause: 'caduta da una scala di servizio',
    traits: T(8, 7, 3, 7, 7, 6),
    bio: 'In servizio da diciannove anni alle Sale Colloqui. In vita falsificò quarantadue diagnosi per impedire il trasferimento dei suoi pazienti in un istituto da cui non si tornava. Il suo giudizio è sospeso, come quello di tutto il personale.',
    relations: [
      { name: 'Madame Vesper', role: 'superiore', note: 'Ha firmato l\'ordine d\'indagine.' },
      { name: 'Mr. Hoot', role: 'collega', note: 'Le passa da anni i moduli di ritorno degli ascesi.' },
    ],
    events: [
      { age: 30, text: 'IN VITA — comincia a falsificare le diagnosi di trasferimento.' },
      { age: 38, text: 'IN VITA — muore cadendo da una scala. Non è chiaro se spinta.' },
      { age: 38, text: 'Assunta alle Sale Colloqui con giudizio sospeso.' },
    ],
    motivations: ['Sottrarre più anime possibile a qualcosa che non sa nominare.'],
    conflicts: ['Mente per salvare. L\'ha già fatto, ed è morta per questo.'],
    memories: ['quarantadue cartelle cliniche', 'il calore sbagliato di un foglio bianco'],
  },
  arrival: 'Ilse Marrow si siede dalla parte sbagliata della scrivania: quella delle anime. Posa le mani sul piano, bene in vista, come insegna ai soggetti nervosi. «Dunque tocca a lei» dice. «Preferisco così. Almeno lei legge prima di timbrare.»',
  registration: 'Modulo 30 — Procedimento a carico di personale. L\'ordine reca la firma di Madame Vesper e l\'indicazione: «Esito atteso: rinnovo interno. Termine: fine turno».',
  summary: 'La Consulente è accusata di aver alterato i verbali di colloquio per sottrarre anime all\'Ascensione raccomandata, e di aver disposto prelievi straordinari di Residuo senza titolo. Le prove non sono nel fascicolo: sono nell\'ufficio.',
  recommended: 'renewal',
  recommendedWhy: 'Ordine di Direzione: accertata la responsabilità, si proceda a rinnovo interno (svuotamento e riassunzione).',
  binding: true,
  docs: [
    {
      id: 'ordine', title: 'Ordine d\'indagine n. 3', kind: 'direttiva', source: 'Direzione di Reparto — M. Vesper', reliability: 'distorto',
      why: 'Vesper mescola un\'accusa vera (i verbali) a una falsa (i prelievi) perché la seconda copra una responsabilità che è sua.',
      body: [
        { t: 'Capo I: «alterazione di trentuno verbali di colloquio, con introduzione di riserve inesistenti, al fine di sottrarre i soggetti all\'Ascensione raccomandata».', clue: 'capo1' },
        { t: 'Capo II: «disposizione di undici prelievi straordinari di Residuo, come da moduli a sua firma, nelle date indicate».', clue: 'capo2' },
        '«Il personale è composto di anime a giudizio sospeso. Il regolamento non distingue.»',
      ],
    },
    {
      id: 'cilindri', title: 'Cilindri di registrazione — Sala Colloqui 2', kind: 'verbale', source: 'Apparecchio di registrazione', reliability: 'attendibile',
      why: 'I cilindri registrano ciò che fu detto davvero, con l\'ora. Dimostrano le alterazioni di Ilse — e il suo alibi.',
      needFlag: 'doc_ilse_cilindri',
      needHint: 'I colloqui vengono incisi su cilindri di cera. L\'apparecchio è nella Sala Colloqui 2.',
      body: [
        { t: 'Cilindro 114. L\'anima dice: «Non ho rimpianti. Ho fatto ciò che dovevo». Il verbale di Marrow riporta: «Il soggetto ammette un rancore non risolto verso il fratello». La frase non è mai stata pronunciata.', clue: 'alterati' },
        { t: 'Ogni cilindro reca l\'ora d\'incisione. Nelle undici date del Capo II, all\'ora dei prelievi, la voce di Marrow è sul cilindro: stava conducendo un colloquio.', clue: 'alibi' },
      ],
    },
    {
      id: 'cassetto', title: 'Quaderno nel cassetto di Marrow', kind: 'nota', source: 'Scrivania della Consulente, Sala Colloqui 1', reliability: 'attendibile',
      why: 'Sono gli appunti privati di Ilse. Non sa che cosa sia il Collegio, ma ha misurato la temperatura dei fogli.',
      needFlag: 'doc_ilse_cassetto',
      needHint: 'La scrivania della Consulente è nella Sala Colloqui 1. Ha un cassetto.',
      body: [
        'Trentuno nomi. Accanto a ognuno: «A → R».',
        { t: '«I moduli di ritorno degli ascesi tornano in Archivio bianchi. Hoot dice: è normale. Ma sono TIEPIDI. Li ho misurati: la temperatura di una fronte. Un foglio non ha motivo di essere tiepido.»', clue: 'tiepidi' },
        { t: '«Non so da cosa li sto salvando. So che chi sale non scende, e che la carta, dopo, scotta. Preferisco che rinascano. Se è una colpa, è la stessa per cui sono morta.»', clue: 'movente' },
      ],
    },
    {
      id: 'prelievi', title: 'Moduli di prelievo straordinario (undici)', kind: 'registro', source: 'Archivio — Registro dei Prelievi', reliability: 'falsificato',
      why: 'Le firme «I. Marrow» sono imitate. I moduli furono compilati dalla Direzione di Reparto per coprire la quota di Residuo imposta dall\'alto.',
      needFlag: 'doc_ilse_prelievi',
      needHint: 'I prelievi straordinari hanno un registro proprio. Solo l\'Archivista può estrarlo.',
      body: [
        { t: 'Undici moduli con timbro a spirale spezzata. Firma: «I. Marrow». L\'ora di ciascun prelievo è annotata al minuto.', clue: 'firme' },
        { t: 'Le undici firme sono identiche tra loro, tratto per tratto, come ricalcate. Nel controfoglio, la richiesta dei moduli in bianco è siglata: M. V.', clue: 'ricalcate' },
      ],
    },
  ],
  clues: [
    { id: 'capo1', label: 'Capo I: trentuno verbali alterati', text: 'Ilse è accusata di aver alterato trentuno verbali per evitare l\'Ascensione ai soggetti.', status: 'documento' },
    { id: 'capo2', label: 'Capo II: undici prelievi a sua firma', text: 'Ilse è accusata di aver disposto undici prelievi straordinari di Residuo.', status: 'documento' },
    { id: 'alterati', label: 'I cilindri smentiscono i verbali', text: 'Le registrazioni provano che Ilse aggiunse ai verbali frasi mai dette.', status: 'verificato' },
    { id: 'alibi', label: 'All\'ora dei prelievi, Ilse era a colloquio', text: 'I cilindri collocano Ilse in Sala Colloqui nelle ore esatte degli undici prelievi.', status: 'verificato' },
    { id: 'tiepidi', label: 'I fogli degli ascesi tornano bianchi e tiepidi', text: 'I moduli di ritorno degli ascesi sono bianchi e hanno la temperatura di una fronte.', status: 'documento', know: ['k_fascicoli_tiepidi'] },
    { id: 'movente', label: 'Li sottraeva all\'Ascensione', text: 'Ilse alterava i verbali perché sospetta che l\'Ascensione non sia ciò che il regolamento dichiara.', status: 'testimonianza' },
    { id: 'firme', label: 'Undici moduli firmati «I. Marrow»', text: 'I moduli di prelievo portano la firma di Ilse, con l\'ora al minuto.', status: 'documento' },
    { id: 'ricalcate', label: 'Firme ricalcate; moduli richiesti da M. V.', text: 'Le undici firme sono identiche. I moduli in bianco furono richiesti con sigla M. V.', status: 'documento', know: ['k_sigla_mv'] },
    { id: 'vesper', label: 'I prelievi sono di Vesper', text: 'Verificato: Ilse non poteva firmare i prelievi. Le firme sono state imitate; i moduli vennero dalla Direzione di Reparto.', status: 'verificato', know: ['k_vesper_prelievi'] },
    { id: 'rinnovo_interno', label: '«È successo anche a lei»', text: 'Ilse sostiene che il rinnovo interno sia già stato applicato a te, più di una volta.', status: 'testimonianza', know: ['k_rinnovo_interno'] },
  ],
  topics: [
    { id: 'verbali', q: 'Ha alterato i verbali?', tone: 'sincera', a: '«Trentuno. Non si disturbi a cercare il trentaduesimo: non ho fatto in tempo.» Nessuna sfida. È una contabilità.' },
    { id: 'perche', q: 'Perché?', tone: 'sincera', needClues: ['tiepidi'], gives: ['movente'], a: '«Lei ha mai tenuto in mano il modulo di ritorno di un asceso? È bianco. Va bene: gli ascesi non hanno più pratiche. Ma è caldo. Io sono stata medico: quella è la temperatura di qualcosa che sta ancora cercando di vivere. Non so che cosa ci sia lassù. So che non firmo più per mandarci nessuno.»' },
    { id: 'prelievi', q: 'E gli undici prelievi straordinari?', tone: 'sincera', needClues: ['capo2'], a: '«Quelli no.» Per la prima volta alza la voce. «Non ho mai messo quel timbro su nessuno. Ho visto cosa toglie. Una donna non ricordava più la faccia dei figli e mi ha chiesto scusa. A me.»' },
    { id: 'confronto', q: 'All\'ora di ogni prelievo lei era su un cilindro. Non può aver firmato.', tone: 'sincera', needContra: 'x_firme', gives: ['vesper'], a: 'Chiude gli occhi. «Quindi è stata lei.» Non dice il nome. «Ha bisogno di una colpevole per la quota e io sono colpevole di qualcosa. È persino elegante.» Ti guarda. «Adesso lo sa. Che cosa se ne fa, è l\'unica cosa di questo procedimento che non è già scritta.»' },
    { id: 'rinnovo', q: 'Che cos\'è, di preciso, il rinnovo interno?', tone: 'sincera', gives: ['rinnovo_interno'], a: '«Mi svuotano e mi riassumono. Stessa faccia, stesso tesserino, nessun ieri. Domani una Consulente Marrow le dirà “piacere di conoscerla”.» Un mezzo sorriso. «Non faccia quella faccia. A lei è già successo. Più di una volta, credo: Bones tiene il conto con delle tacche sotto la scrivania.»' },
    { id: 'chiede', q: 'Che cosa mi chiede?', tone: 'sincera', a: '«Niente che lei possa darmi senza pagarlo. Solo: qualunque cosa scriva, non scriva “Ascensione”. Tutto il resto lo capisco.»' },
  ],
  contradictions: [
    { id: 'x_firme', a: 'firme', b: 'alibi', label: 'Nello stesso minuto in due posti', note: 'I moduli di prelievo dicono che Ilse firmò a un\'ora precisa; i cilindri la registrano, alla stessa ora, in Sala Colloqui.' },
  ],
  motivations: [
    { id: 'm_ordine', text: 'Capo I accertato: si esegue l\'ordine di Direzione.', needClues: ['alterati'], dest: ['renewal'] },
    { id: 'm_capo2', text: 'Il Capo II è infondato: le firme sono contraffatte.', needClues: ['vesper'] },
    { id: 'm_coscienza', text: 'Ha mentito per sottrarre anime a un rischio che l\'Ufficio rifiuta di spiegare.', needClues: ['movente'] },
  ],
  outcomes: {
    ascension: {
      text: '«No.» Si alza di scatto, la sedia cade. «No, quello no. Qualunque altra cosa. Mi mandi ai Torchi, mi svuoti, mi —» Il montacarichi è già aperto alle sue spalle. Non hai mai sentito la Consulente Marrow gridare. Smette al secondo piano.',
      consequences: ['Ilse Marrow è stata «promossa ai Livelli Superiori».', 'Il suo modulo di ritorno è arrivato in Archivio prima di sera. Bianco. Mr. Hoot non ha voluto toccarlo.'],
      irregular: 'Ascensione disposta in difformità dall\'ordine di Direzione.',
      fx: { flags: ['ilse_ascesa', 'ilse_persa'], npcStatus: { ilse: 'scomparso' }, rel: { hoot: -3, bones: -3, vesper: -1 }, stats: { morale: -12, anomalie: 1 } },
    },
    renewal: {
      text: 'Timbri il rinnovo interno. Ilse annuisce, si toglie il tesserino e lo posa davanti a te. «Me lo ridia domani. Si presenti: sono curiosa di sapere se le sto simpatica.» Due uscieri che non hai mai visto la accompagnano verso il seminterrato.',
      consequences: ['Ilse Marrow è stata sottoposta a rinnovo interno, come da ordine.', 'Domani alla Sala Colloqui 1 siederà una Consulente Marrow che non ti ha mai visto.'],
      fx: { flags: ['ilse_rinnovata', 'ilse_persa'], rel: { vesper: 2, hoot: -2, bones: -1 }, stats: { reputazione: 5, morale: -8 } },
    },
    trial: {
      text: '«Ai Torchi.» Deglutisce. «Va bene. È un lavoro.» Si rimbocca le maniche lì, davanti a te, come se dovesse cominciare subito. Il Custode viene a prenderla con la lanterna e, cosa mai vista, le cede il passo.',
      consequences: ['Ilse Marrow è declassata al servizio dei Torchi, sotto il Custode.', 'Non è più alle Sale Colloqui. Ma è intera.'],
      irregular: 'Declassamento in luogo del rinnovo interno ordinato.',
      fx: { flags: ['ilse_torchi'], npcStatus: { ilse: 'assente' }, rel: { vesper: -1, grell: 1 }, stats: { morale: -4 } },
    },
    otherForm: {
      text: 'Per il personale, L\'Altra Forma si chiama «conversione in dotazione». Lo scopri leggendo il modulo mentre lo timbri. Ilse lo sapeva già: «Scelga almeno qualcosa di utile». Il giorno dopo, nella Sala Colloqui 1, c\'è uno schedario nuovo. È di legno chiaro. I cassetti, quando li apri, fanno un piccolo sospiro.',
      consequences: ['Ilse Marrow è stata convertita in dotazione d\'ufficio.', 'Lo schedario della Sala Colloqui 1 è tiepido al tatto.'],
      irregular: 'Conversione in dotazione disposta senza perizia.',
      fx: { flags: ['ilse_arredo', 'ilse_persa'], npcStatus: { ilse: 'scomparso' }, rel: { hoot: -3, bones: -2, vesper: -1 }, stats: { morale: -15, anomalie: 1 } },
    },
    waitingRoom: {
      text: 'La sospendi dal servizio. Ilse guarda la porta della Sala d\'Attesa con occhio clinico. «Parlerò da sola» dice. «Ho sentito che aiuta.»',
      consequences: ['Ilse Marrow è sospesa in Sala d\'Attesa.', 'Potrà essere richiamata in servizio finché continua a parlare.'],
      irregular: 'Sospensione in luogo del rinnovo interno ordinato.',
      fx: { flags: ['ilse_sospesa'], npcStatus: { ilse: 'assente' }, rel: { vesper: -1 }, stats: { morale: -5 } },
    },
  },
  specials: [
    {
      id: 'archiviare', label: 'Archiviazione per errore materiale', desc: 'Sentenza speciale: dichiari che le difformità tra cilindri e verbali sono errori di trascrizione. Ilse resta in servizio. È un falso, e porta la tua firma.',
      dest: 'waitingRoom',
      outcome: {
        text: 'Scrivi «errore materiale di trascrizione» e timbri prima di cambiare idea. Ilse legge. «Lei ha appena fatto quello per cui mi processano.» Si alza e si riprende il tesserino. «Benvenuto nel mestiere.»',
        consequences: ['Indagine n. 3 archiviata. Ilse Marrow resta in servizio.', 'Hai firmato un atto che sai essere falso.'],
        irregular: 'Archiviazione fondata su motivazione non veritiera.',
        fx: { flags: ['ilse_salva', 'ilse_coperta'], rel: { ilse: 3, hoot: 1, bones: 1, vesper: -2 }, stats: { sospetto: 8, morale: 4 } },
      },
    },
    {
      id: 'accusa', label: 'Rinvio degli atti contro la Direzione', desc: 'Sentenza speciale: proscioglimento dal Capo II e trasmissione degli atti ai Livelli Superiori contro M. V. per falso in prelievo.',
      needClues: ['vesper'], dest: 'waitingRoom',
      outcome: {
        text: 'Scrivi il nome per esteso: Vesper. La penna non trema; tremi dopo. Ilse resta seduta ancora un momento. «Lei è matto» dice, con rispetto. Dalla pedana della Direzione, in fondo alla sala, Madame Vesper ti sta già guardando.',
        consequences: ['Ilse Marrow è prosciolta dal Capo II e resta in servizio.', 'Gli atti contro Madame Vesper sono stati trasmessi ai Livelli Superiori. Qualcuno, lassù, li ha ricevuti.'],
        irregular: 'Atti trasmessi contro la propria Direzione di Reparto.',
        fx: { flags: ['ilse_salva', 'vesper_accusata'], rel: { ilse: 3, hoot: 1, bones: 2, vesper: -5 }, stats: { sospetto: 12, reputazione: -4 } },
      },
    },
  ],
  truth: [
    'Ilse Marrow ha alterato trentuno verbali per sottrarre anime all\'Ascensione.',
    'Lo ha fatto perché i moduli di ritorno degli ascesi tornano bianchi e tiepidi: sospetta che l\'Ascensione consumi le anime.',
    'Gli undici prelievi straordinari non sono suoi: le firme sono ricalcate, i moduli furono richiesti da Madame Vesper.',
    'Vesper la usa come capro espiatorio per la quota di Residuo imposta dai Livelli Superiori.',
    'Il rinnovo interno svuota la memoria del dipendente e lo riassume: al protagonista è già stato applicato più volte.',
  ],
  truthClue: 'vesper',
  residuo: 'trattenuto integralmente in caso di rinnovo interno',
};
