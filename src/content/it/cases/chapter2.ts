// CAPITOLO II — The Forgotten Files. Ricorso, anima senza identità, anime collegate.
import type { CaseDef } from '../../../engine/types';

const T = (e: number, a: number, o: number, c: number, r: number, am: number) => ({
  empatia: e, altruismo: a, onesta: o, coraggio: c, responsabilita: r, ambizione: am,
});

export const C04: CaseDef = {
  id: 'c04',
  title: 'Ricorso n. 77/R — Cornelia Asher',
  type: 'ricorso',
  soulId: 'S-CORNELIA',
  incarnation: {
    name: 'Greta Lund (già Cornelia Asher)', ageAtDeath: 52, origin: 'Penitenziario femminile di Brannholm', era: 'secolo dei fili',
    occupation: 'cucitrice, detenuta', cause: 'polmonite, in cella',
    traits: T(5, 4, 8, 6, 6, 3),
    bio: 'Come Greta Lund ha scontato dodici anni per un furto di biancheria che ha sempre negato. È morta ripetendo di essere innocente «anche dell\'altra cosa», senza saper dire quale.',
    relations: [
      { name: 'Edmund Asher', role: 'marito (vita precedente)', note: 'Farmacista. Morto per avvelenamento da arsenico.' },
      { name: 'Dott. Brandt', role: 'medico di Edmund', note: 'Una sua lettera non compare nel fascicolo.' },
    ],
    events: [
      { age: 0, text: 'VITA PRECEDENTE — Cornelia Asher viene giudicata per il veneficio del marito: La Prova.' },
      { age: 22, text: 'Greta Lund, guardarobiera, è accusata del furto di un corredo.' },
      { age: 40, text: 'Condannata. Rifiuta la grazia in cambio di una confessione.' },
      { age: 52, text: 'Muore in cella. Il ricorso si iscrive da sé a registro.' },
    ],
    motivations: ['Essere creduta una volta, da qualcuno che abbia il potere di scriverlo.'],
    conflicts: ['Ha vissuto una vita intera come pena per un atto che non ha commesso.'],
    memories: ['un bancone di farmacia', 'la frase «vedrai cosa ti lascio»', 'dodici inverni di lana grigia'],
  },
  pastLives: ['Cornelia Asher — giudicata quarantun anni or sono dalla scrivania 7. Sentenza a registro: La Prova, per veneficio.'],
  arrival: 'Una donna magra, con le dita piene di piccoli tagli da ago. Non si siede. Posa sulla scrivania un foglio che nessuno le ha dato: un\'istanza, compilata in una calligrafia che cambia a metà, come se l\'avessero scritta due persone.',
  registration: 'Modulo 9/R — Ricorso avverso sentenza. ATTENZIONE: la Direttiva 2 sospende l\'esame dei ricorsi. Il fascicolo originale è allegato «per mera conoscenza».',
  summary: 'L\'anima ricorre contro la sentenza che la destinò alla Prova. Il fascicolo originale contiene la prova d\'acquisto dell\'arsenico. La sentenza porta due destinazioni, una cancellata.',
  recommended: 'trial',
  recommendedWhy: 'Direttiva 2: ricorsi sospesi. Art. 40: in pendenza di sospensione la sentenza impugnata si intende confermata.',
  docs: [
    {
      id: 'istanza', title: 'Istanza di ricorso 77/R', kind: 'lettera', source: 'La ricorrente', reliability: 'attendibile',
      why: 'Cornelia dice il vero. La seconda calligrafia è quella di Greta: la convinzione d\'innocenza ha attraversato il Rinnovo.',
      body: [
        '«Non ho avvelenato Edmund Asher. L\'ho detto allora a uno scrivano che mi ha creduta: gliel\'ho visto in faccia. Poi mi è arrivata La Prova.»',
        { t: '«Ho fatto dodici anni per una cosa che non ho fatto, sapendo di averne già pagata un\'altra che non avevo fatto. Chiedo che qualcuno guardi la pagina tre.»', clue: 'creduta' },
      ],
    },
    {
      id: 'sentenza', title: 'Sentenza originale (minuta)', kind: 'verbale', source: 'Archivio — fascicolo Asher', reliability: 'contraddittorio',
      why: 'Lo scrivano della 7 assolse Cornelia (Rinnovo). La sentenza fu riformata d\'ufficio dalla Direzione di Reparto per raggiungere la quota trimestrale di Prove.',
      body: [
        'Scrivano: {iniziali}, scrivania 7. Motivazione: «Le evidenze non sostengono l\'accusa. Vedi pag. 3».',
        { t: 'Destinazione: «IL RINNOVO», barrato con un solo tratto. Sopra, altra mano e altro inchiostro: «LA PROVA — riformata d\'ufficio». Nessuna firma accanto alla riforma, solo un timbro a spirale spezzata.', clue: 'riformata' },
      ],
    },
    {
      id: 'pagina3', title: 'Pagina 3 — Registro dei veleni, Farmacia Asher', kind: 'registro', source: 'Archivio — fascicolo Asher', reliability: 'falsificato',
      why: 'La pagina fu riscritta e sostituita dopo la sentenza per giustificare la riforma. È su carta di un lotto distribuito il trimestre successivo.',
      body: [
        { t: '«Arsenico, grammi 30. Ritirato da: C. Asher. Uso dichiarato: derattizzazione.» La data precede di sei giorni la morte di Edmund.', clue: 'pagina3' },
        { t: 'La carta è più bianca delle altre pagine. In controluce si legge una filigrana: LOTTO 14/B.', clue: 'filigrana' },
      ],
    },
    {
      id: 'circolare', title: 'Circolare Economato n. 6 — forniture cartacee', kind: 'direttiva', source: 'Economato', reliability: 'attendibile',
      why: 'Documento contabile ordinario. Nessuno pensò che una data di fornitura potesse smentire un fascicolo.',
      body: [
        '«Si comunica agli uffici l\'esaurimento del lotto 9/A.»',
        { t: '«Il lotto 14/B entra in distribuzione dal primo giorno del trimestre corrente.» La circolare è datata tre mesi DOPO la sentenza Asher.', clue: 'lotto_data' },
      ],
    },
    {
      id: 'originale', title: 'Pagina 3 originale e lettera del dott. Brandt', kind: 'registro', source: 'Schedario dei Dimenticati (Archivio)', reliability: 'attendibile',
      why: 'Mr. Hoot conserva gli originali di ogni atto sostituito. Questa è la pagina che lo scrivano della 7 lesse davvero.',
      needFlag: 'doc_asher_originale',
      needHint: 'Se una pagina è stata sostituita, l\'originale potrebbe essere stato conservato da qualcuno. In Archivio c\'è uno schedario che non compare in pianta.',
      body: [
        { t: '«Arsenico, grammi 30. Ritirato da: E. Asher, titolare. Uso dichiarato: laboratorio.» Carta ingiallita, lotto 9/A.', clue: 'originale' },
        { t: 'Lettera del dott. Brandt: «Gli ho detto: sei mesi, forse meno. Mi ha chiesto se l\'arsenico a piccole dosi lascia tracce riconoscibili. Ho risposto di sì. Ha detto: bene. Sua moglie aveva chiesto la separazione quella settimana.»', clue: 'brandt' },
        { t: 'Spillata sul retro, una richiesta di carta: «N. 1 foglio lotto 14/B per rifacimento atti — quota trimestrale Prove». Sigla del richiedente: M. V.', clue: 'mv' },
      ],
    },
  ],
  clues: [
    { id: 'creduta', label: '«Lo scrivano mi aveva creduta»', text: 'Cornelia sostiene che lo scrivano originale la ritenne innocente, e chiede di guardare la pagina 3.', status: 'testimonianza' },
    { id: 'riformata', label: 'Sentenza riformata d\'ufficio', text: 'La destinazione originale era il Rinnovo. Qualcuno l\'ha cambiata in Prova, senza firma, con un timbro a spirale.', status: 'documento', know: ['sym_spirale_riforma'] },
    { id: 'pagina3', label: 'Pag. 3: l\'arsenico ritirato da C. Asher', text: 'La pagina 3 del fascicolo attribuisce a Cornelia l\'acquisto dell\'arsenico.', status: 'documento' },
    { id: 'filigrana', label: 'Filigrana LOTTO 14/B', text: 'La pagina 3 è su carta più bianca, con filigrana del lotto 14/B.', status: 'documento' },
    { id: 'lotto_data', label: 'Il lotto 14/B esiste da dopo la sentenza', text: 'La carta 14/B fu distribuita tre mesi dopo la data della sentenza Asher.', status: 'documento' },
    { id: 'sostituita', label: 'La pagina 3 è stata sostituita', text: 'Verificato: la pagina 3 non poteva esistere alla data del giudizio. È stata inserita dopo.', status: 'verificato', know: ['k_atti_sostituiti'] },
    { id: 'originale', label: 'Originale: l\'arsenico lo ritirò Edmund', text: 'Nella pagina originale l\'arsenico risulta ritirato da Edmund Asher in persona.', status: 'verificato' },
    { id: 'brandt', label: 'Edmund sapeva di morire', text: 'Il medico attesta che Edmund, condannato da un male, si informò su come l\'arsenico lasci tracce. La moglie aveva chiesto la separazione.', status: 'testimonianza' },
    { id: 'mv', label: 'Carta richiesta da «M. V.» per la quota Prove', text: 'La carta per rifare l\'atto fu richiesta con sigla M. V., con causale «quota trimestrale Prove».', status: 'documento', know: ['k_sigla_mv'] },
    { id: 'verita', label: 'Edmund si avvelenò per incastrarla', text: 'Edmund Asher, morente, si avvelenò lentamente in modo che la colpa ricadesse sulla moglie che voleva lasciarlo. Cornelia era innocente.', status: 'verificato' },
  ],
  topics: [
    { id: 'ora', q: 'Perché ricorrere adesso, dopo quarant\'anni?', tone: 'sincera', a: '«Non l\'ho deciso. Sono morta dicendo “sono innocente” e il modulo si è compilato. La signorina all\'ingresso dice che succede, quando una frase non si consuma.»' },
    { id: 'edmund', q: 'Mi parli di Edmund.', tone: 'sincera', a: '«Pesava tutto. Le polveri, le parole, me. Quando gli dissi che me ne andavo non alzò la voce. Disse: “Vedrai cosa ti lascio”. Credevo parlasse del negozio.»' },
    { id: 'greta', q: 'E la vita di Greta Lund?', tone: 'sincera', a: '«Un corredo sparito, una guardarobiera senza famiglia. Mi offrirono la grazia se confessavo. Ho detto di no con una rabbia che non era della mia età. Adesso so di chi era.»' },
    { id: 'scrivano', q: 'Lo scrivano che la giudicò. Lo riconoscerebbe?', tone: 'sincera', needClues: ['creduta'], a: 'Ti guarda a lungo. «Aveva un altro modo di tenere la penna. Ma era seduto come lei.» Abbassa gli occhi sul fascicolo. «Mi scusi. In prigione si impara a guardare le posture.»', fx: { know: ['k_cornelia_postura'] } },
    { id: 'confronto', q: 'Questa pagina è su una carta che allora non esisteva.', tone: 'sincera', needContra: 'x_carta', gives: ['sostituita'], a: '«Allora non sono pazza.» Si siede, finalmente. «Dodici anni a ripetermi che qualcuno aveva cambiato le carte. Le compagne di cella ridevano: “quali carte, Lund? Hai rubato delle lenzuola”.»' },
    { id: 'verita', q: 'L\'arsenico lo ritirò Edmund. Sapeva di morire.', tone: 'sincera', needClues: ['originale', 'brandt'], gives: ['verita'], a: 'Non piange. «Ecco cosa mi ha lasciato.» Poi, piano: «E voi gli avete dato una mano. Lui ha preparato la colpa e questo ufficio l\'ha timbrata. Due volte».' },
  ],
  contradictions: [
    { id: 'x_carta', a: 'filigrana', b: 'lotto_data', label: 'Una pagina più giovane della sentenza', note: 'La pagina 3 è stampata su carta del lotto 14/B, distribuito tre mesi dopo la sentenza che avrebbe dovuto fondare.' },
  ],
  motivations: [
    { id: 'm_sosp', text: 'Ricorso inammissibile per sospensione (Direttiva 2).', dest: ['trial', 'waitingRoom'] },
    { id: 'm_falso', text: 'La sentenza impugnata si fonda su un atto sostituito: è nulla.', needClues: ['sostituita'] },
    { id: 'm_innocente', text: 'La ricorrente era innocente. L\'Ufficio le deve una vita.', needClues: ['verita'] },
  ],
  outcomes: {
    ascension: {
      text: 'Accogli il ricorso e scrivi la destinazione più alta. Cornelia la legge due volte. «È un risarcimento?» «È ciò che prevede il modulo.» Sale senza voltarsi, con l\'istanza ancora in mano.',
      consequences: ['Ricorso 77/R accolto. Cornelia Asher è ascesa.', 'La riforma d\'ufficio di quarant\'anni fa è annullata a registro.'],
      fx: { flags: ['cornelia_accolto', 'cornelia_ascesa'], stats: { ricorsi: 1 } },
    },
    renewal: {
      text: 'Riscrivi la parola che una mano estranea aveva barrato: IL RINNOVO. Cornelia la guarda come si guarda una firma autentica. «È la sua calligrafia» dice. «Più o meno.»',
      consequences: ['Ricorso 77/R accolto. Cornelia Asher è avviata al Rinnovo, come da sentenza originale.', 'La pagina sostituita resta nel fascicolo, annotata come «non genuina».'],
      fx: { flags: ['cornelia_accolto'], stats: { ricorsi: 1 }, rel: { hoot: 1 } },
      reinc: { returnIn: 8, note: 'un senso di giustizia ostinato; diffidenza verso i documenti troppo puliti' },
    },
    trial: {
      text: '«Confermata.» La parola resta nell\'aria. Cornelia ripiega l\'istanza in quattro. «Tre» dice soltanto. «Con questa fanno tre.» Si avvia da sola: la strada la conosce.',
      consequences: ['Ricorso 77/R respinto. La Prova è confermata.', 'Cornelia Asher affronterà una terza vita di espiazione per un atto non commesso.'],
      fx: { flags: ['cornelia_respinto'], stats: { reputazione: 3 }, rel: { vesper: 1, hoot: -1 } },
      reinc: { returnIn: 8, note: 'Prova: una vita in cui nessuno crederà alla sua parola' },
    },
    otherForm: {
      text: '«Un\'altra forma.» Ci pensa. «Una che non possano accusare?» Non è la domanda di una vinta: è una richiesta precisa.',
      consequences: ['Ricorso 77/R definito con ridestinazione. Cornelia Asher lascia la forma umana.'],
      fx: { flags: ['cornelia_accolto'], stats: { ricorsi: 1 } },
      reinc: { form: 'una civetta di campanile', returnIn: 12 },
    },
    waitingRoom: {
      text: 'Sospendi. È ciò che la Direttiva suggerisce senza dirlo. Cornelia annuisce: «Aspettare che vi torni la voglia di leggere». Prende posto sulla panca con la schiena dritta di chi ha fatto dodici anni di appello.',
      consequences: ['Ricorso 77/R sospeso. Cornelia Asher è trattenuta in Sala d\'Attesa.'],
      fx: { flags: ['cornelia_attesa'], stats: { pendenti: 1 } },
    },
  },
  truth: [
    'Edmund Asher, malato terminale, ritirò l\'arsenico e si avvelenò lentamente per far ricadere la colpa sulla moglie.',
    'Lo scrivano della scrivania 7 (il protagonista, in un\'assunzione precedente) assolse Cornelia: Rinnovo.',
    'La sentenza fu riformata d\'ufficio in Prova per raggiungere una quota trimestrale; la pagina 3 fu riscritta su carta 14/B.',
    'La richiesta di carta è siglata M. V.: Madame Vesper.',
    'Mr. Hoot conserva gli originali sostituiti nello Schedario dei Dimenticati.',
  ],
  truthClue: 'verita',
  residuo: 'il suono del campanello della farmacia; la certezza di essere stata creduta, una volta',
};

export const C05: CaseDef = {
  id: 'c05',
  title: 'Pratica N.N. — la bambina di carta',
  type: 'senza_identita',
  soulId: 'S-NN',
  incarnation: {
    name: 'N.N.', ageAtDeath: 9, origin: 'ignota', era: 'ignota',
    occupation: 'nessuna', cause: 'non accertata',
    traits: T(7, 6, 8, 6, 4, 1),
    bio: 'Anima priva di fascicolo, rinvenuta dal Custode in un corridoio di servizio. Non ricorda il proprio nome. Parte del corpo non è più corpo.',
    relations: [],
    events: [{ age: 9, text: 'Unico dato certo: è morta bambina, molto tempo fa.' }],
    motivations: ['Ritrovare il proprio nome prima che finisca di cancellarsi.'],
    conflicts: ['Le è stato detto di aspettare qualcuno che non poteva tornare.'],
    memories: ['scarpe troppo grandi', 'una voce che canta da sotto', 'panche che diventano sempre meno'],
  },
  arrival: 'Non arriva dalla Reception. La accompagna il Custode, tenendola per la manica perché la mano non si può stringere: le dita sono foglietti piegati in tre, e frusciano. Avrà nove anni. Ti guarda la scrivania con interesse. «Posso avere una matita?»',
  registration: 'Modulo — nessuno. Il protocollo rifiuta la registrazione: «intestatario assente». Madame Vesper ha annotato: «Art. 31. Rinviare in Sala d\'Attesa e non perdere tempo».',
  summary: 'Anima senza identità accertata. Presenta una trasformazione cartacea progressiva degli arti. Senza un nome non può essere giudicata; con un nome, qualcuno dovrà spiegare dov\'è stata finora.',
  recommended: 'waitingRoom',
  recommendedWhy: 'Regolamento, art. 31: anima priva di identità accertata → rinvio in Sala d\'Attesa fino ad accertamento.',
  docs: [
    {
      id: 'cartellino', title: 'Cartellino di rinvenimento', kind: 'nota', source: 'Custode Grell', reliability: 'incompleto',
      why: 'Grell scrive il minimo. Non dice che la stava portando ai Torchi insieme agli altri «muti», e che lei parlò.',
      body: [
        { t: '«Trovata nel corridoio di servizio tra Sala d\'Attesa e Torchi. Camminava. Parlava. Non andava dove vanno gli altri.»', clue: 'corridoio' },
        '«La consegno al piano perché parla. Quelli che parlano non sono di mia competenza.» Firma: una G storta.',
      ],
    },
    {
      id: 'esame', title: 'Esame obiettivo — Consulente Marrow', kind: 'referto', source: 'Sale Colloqui', reliability: 'attendibile',
      why: 'Ilse Marrow descrive con esattezza ciò che vede. Non sa ancora che cosa significhi.',
      body: [
        '«Soggetto vigile, collaborante, di buon umore. Età apparente nove anni.»',
        { t: '«Le dita della mano sinistra sono fogli. Non “simili a”: fogli, grammatura d\'ufficio, piegati in tre. In controluce: filigrana LOTTO 9/A e un prestampato parziale, “…odulo 14 — Sala d\'Att…”.»', clue: 'dita' },
        { t: '«Sull\'avambraccio, sotto la pelle, affiorano righe di scrittura in formazione. Non prova dolore: riferisce “solletico, quando si scrive”. Alla domanda “chi scrive?” risponde: “Si scrive”.»', clue: 'scrittura' },
      ],
    },
    {
      id: 'effetti', title: 'Verbale degli effetti personali', kind: 'verbale', source: 'Sportello Accettazione', reliability: 'attendibile',
      why: 'Pim ha elencato gli oggetti con cura. Sono i soli testimoni rimasti della bambina.',
      body: [
        { t: 'Un bottone d\'ottone con un\'ancora in rilievo: è il bottone della divisa dell\'Istituto Stella Maris per figli di naviganti.', clue: 'bottone' },
        { t: 'Un paio di scarpe da uomo, misura grande, legate alle caviglie con lo spago perché non si sfilino.', clue: 'scarpe' },
        'Nessun documento. Canticchia sempre lo stesso motivo; dice che è «quella del ponte di sotto».',
      ],
    },
    {
      id: 'registro', title: 'Registro della Sala d\'Attesa — naufragio dell\'«Aurora»', kind: 'registro', source: 'Archivio, scaffale delle Sospensioni', reliability: 'attendibile',
      why: 'Il registro è corretto. Tre bambine dello stesso naufragio furono sospese lo stesso giorno. Una sola corrisponde a tutti i riscontri.',
      needFlag: 'doc_nn_registro',
      needHint: 'Se è stata in Sala d\'Attesa, un registro deve averla contata entrare. I registri delle Sospensioni sono in Archivio.',
      body: [
        'Sessantatré anni or sono. Naufragio del traghetto «Aurora». Minori sospese in Sala d\'Attesa:',
        { t: 'ROHMER Elsa, anni 10. Orfana di entrambi i genitori, figlia unica. Allieva dell\'Istituto Stella Maris. Sospesa «in attesa di nomina di un tutore».', clue: 'reg_elsa' },
        { t: 'VANIN Lidia, anni 8. Viaggiava con il padre, macchinista di bordo. Scuola comunale. Sospesa «in attesa del padre».', clue: 'reg_lidia' },
        { t: 'ALBRECHT Tea, anni 9. Allieva dello Stella Maris. Un fratello maggiore, superstite. Sospesa «in attesa della madre, Albrecht Margit, cantante di bordo in terza classe».', clue: 'reg_tea' },
        { t: 'Annotazione a margine, stessa data: «ALBRECHT Margit — ASCESA. Non reperibile per ricongiungimento». Nessuno ha aggiornato la sospensione della figlia.', clue: 'madre_ascesa' },
      ],
    },
  ],
  clues: [
    { id: 'corridoio', label: 'Trovata tra la Sala d\'Attesa e i Torchi', text: 'Il Custode l\'ha trovata in un corridoio di servizio che collega la Sala d\'Attesa a un luogo chiamato «i Torchi».', status: 'documento', know: ['k_torchi'] },
    { id: 'dita', label: 'Dita di carta, lotto 9/A, «Modulo 14 — Sala d\'Attesa»', text: 'Le dita della bambina sono fogli d\'ufficio con filigrana e prestampato di un modulo della Sala d\'Attesa.', status: 'documento', know: ['k_dita_carta'] },
    { id: 'scrittura', label: 'Scrittura che affiora sotto la pelle', text: 'Sulla pelle della bambina compaiono righe di scrittura «in formazione». Dice che «si scrive».', status: 'documento' },
    { id: 'bottone', label: 'Bottone dello Stella Maris', text: 'Portava la divisa dell\'Istituto Stella Maris per figli di naviganti.', status: 'documento' },
    { id: 'scarpe', label: 'Scarpe da uomo, troppo grandi', text: 'Ha ai piedi scarpe da uomo legate con lo spago.', status: 'documento' },
    { id: 'ricordo', label: 'Il fratello, le scarpe, la mamma che canta di sotto', text: 'Ricorda un fratello che le diede le sue scarpe mentre l\'acqua saliva, e la madre che cantava dal ponte inferiore.', status: 'testimonianza' },
    { id: 'reg_elsa', label: 'Registro: Elsa Rohmer', text: 'Orfana, figlia unica, Stella Maris. In attesa di un tutore.', status: 'documento' },
    { id: 'reg_lidia', label: 'Registro: Lidia Vanin', text: 'Con il padre macchinista, scuola comunale. In attesa del padre.', status: 'documento' },
    { id: 'reg_tea', label: 'Registro: Tea Albrecht', text: 'Stella Maris, un fratello maggiore, madre cantante di terza classe. In attesa della madre.', status: 'documento' },
    { id: 'madre_ascesa', label: 'La madre era già ascesa', text: 'Margit Albrecht fu ascesa lo stesso giorno. Alla figlia fu detto di aspettarla. «Non reperibile per ricongiungimento».', status: 'documento', know: ['k_ascesi_irreperibili'] },
    { id: 'identita', label: 'È Tea Albrecht', text: 'Identità accertata: Tea Albrecht, nove anni, naufragio dell\'«Aurora». In Sala d\'Attesa da sessantatré anni.', status: 'verificato', know: ['k_tea'] },
    { id: 'muti', label: '«Il signore con la lanterna prende quelli che non parlano più»', text: 'Secondo la bambina, in Sala d\'Attesa le panche «diventano meno» e il Custode porta via chi smette di parlare.', status: 'testimonianza', know: ['k_grell_muti'] },
  ],
  topics: [
    { id: 'nome', q: 'Come ti chiami?', tone: 'confusa', a: '«Me lo sono scritta da qualche parte, per non perderlo.» Si guarda il braccio, lo gira verso la lampada. «Era qui. È andato sotto. Adesso c\'è scritto “in triplice copia”.»' },
    { id: 'ricordi', q: 'Che cosa ricordi?', tone: 'sincera', gives: ['ricordo'], a: '«Le scarpe. Sono di mio fratello. Me le ha date quando l\'acqua è arrivata alle ginocchia: “Tienile tu, che corri di più”. E la mamma che cantava dal ponte di sotto, perché quelli di terza non li facevano salire. Cantava forte, per farsi trovare.»' },
    { id: 'dove', q: 'Dove sei stata, tutto questo tempo?', tone: 'sincera', gives: ['muti'], a: '«Nella sala con le panche. All\'inizio eravamo tanti. Poi le panche sono diventate meno. Viene il signore con la lanterna e prende quelli che non parlano più. Io parlavo. Da sola, ma vale. Mi dicevano: aspetta la mamma. Ho aspettato benissimo.»' },
    { id: 'male', q: 'Ti fa male la mano?', tone: 'sincera', needClues: ['dita'], a: '«No. Fa solletico quando si scrive.» Apre le dita: frusciano. «Su questo c\'è scritto “il richiedente dichiara”. Io non ho dichiarato niente. Però è bello avere le parole già pronte.»' },
    { id: 'elsa', q: 'Ti chiami Elsa Rohmer?', tone: 'confusa', needClues: ['reg_elsa'], cond: { not: { clue: ['c05', 'identita'] } }, fx: { vars: { nn_errori: 1 } }, a: '«Elsa…» Ci prova, come un vestito. «Elsa aveva le trecce e nessuno che le portasse le scarpe. Stava accanto a me sulla panca. Poi ha smesso di parlare.» Un dito le si ripiega da solo, con un piccolo schiocco di carta. «Non sono io. Non me lo chieda più, per favore: ogni volta che sbaglio mi si piega qualcosa.»' },
    { id: 'lidia', q: 'Ti chiami Lidia Vanin?', tone: 'confusa', needClues: ['reg_lidia'], cond: { not: { clue: ['c05', 'identita'] } }, fx: { vars: { nn_errori: 1 } }, a: '«Lidia aspettava il papà. Il suo papà stava di sotto con le macchine, non cantava.» Scuote la testa e un angolo dell\'orecchio fa un rumore di pagina voltata. «No. Mi dispiace.»' },
    { id: 'tea', q: 'Ti chiami Tea Albrecht?', tone: 'sincera', needClues: ['reg_tea'], gives: ['identita'], a: 'Per un momento non succede nulla. Poi la scrittura sull\'avambraccio si ferma. «Tea» dice. «Tea, è corto, ci stava tutto.» Ride. «Albrecht Tea, terzo banco, Stella Maris, le scarpe sono di Jonas!» Poi si fa seria, con la serietà dei nove anni: «E la mamma? Mi hanno detto di aspettarla. È tanto che aspetto?»' },
    { id: 'mamma', q: 'Tua madre non può venire, Tea.', tone: 'sincera', needClues: ['identita', 'madre_ascesa'], a: '«È salita?» Lo sa già, in qualche modo. «Lo dicevano, quelli sulle panche: chi sale non lo richiamano. Allora perché mi hanno detto di aspettare?» Non c\'è una risposta nel regolamento. Lei aspetta lo stesso che tu la trovi.' },
  ],
  contradictions: [],
  motivations: [
    { id: 'm_31', text: 'Identità non accertata: art. 31.', dest: ['waitingRoom'] },
    { id: 'm_tea', text: 'Identità accertata: Tea Albrecht ha diritto a un giudizio.', needClues: ['identita'] },
    { id: 'm_colpa', text: 'Sessantatré anni di attesa per un errore d\'ufficio: l\'Ufficio è in debito.', needClues: ['madre_ascesa'] },
  ],
  outcomes: {
    ascension: {
      text: '«Vado dalla mamma?» Non sai rispondere, e timbri lo stesso. Tea entra nel montacarichi tenendosi le scarpe. Le dita di carta salutano con un fruscio.',
      consequences: ['L\'anima è ascesa. A registro: «congiunta alla madre, ove reperibile».', 'Nessuno ha mai saputo dire dove siano reperibili gli ascesi.'],
      fx: { flags: ['nn_ascesa'] },
    },
    renewal: {
      text: 'Il modulo del Rinnovo chiede il prelievo del Residuo. La casella resta vuota: di lei non c\'è abbastanza da prelevare. Timbri comunque. Per la prima volta, qualcuno lascia questo ufficio ricordando tutto.',
      consequences: ['L\'anima è avviata al Rinnovo con Residuo «insufficiente al prelievo».', 'Nascerà una bambina che ricorda un naufragio e una sala con le panche.'],
      irregular: 'Rinnovo eseguito senza prelievo del Residuo.',
      fx: { flags: ['nn_rinnovo'], know: ['k_rinnovo_senza_residuo'] },
      reinc: { noReturn: true, note: 'memoria integra: rinasce ricordando' },
    },
    trial: {
      text: '«Una prova di cosa?» chiede. Non c\'è un articolo che lo spieghi a una bambina di nove anni. Mr. Bones, dalla sua scrivania, smette di scrivere per la prima volta da quando lo conosci.',
      consequences: ['L\'anima è destinata alla Prova.', 'Nessuna colpa a registro giustifica la destinazione.'],
      irregular: 'Prova inflitta in assenza di colpa documentata.',
      fx: { flags: ['nn_prova'], rel: { bones: -2, hoot: -2 }, stats: { morale: -5 } },
      reinc: { noReturn: true },
    },
    otherForm: {
      text: '«Posso scegliere?» Il regolamento non lo vieta. Ci pensa con la lingua tra i denti. «Una cosa che vola sopra l\'acqua.» Lo scrivi. Le dita di carta sono le prime a diventare piume.',
      consequences: ['L\'anima lascia la forma umana per una forma scelta da lei.', 'A registro, sotto «forma»: rondine di mare.'],
      fx: { flags: ['nn_forma'], rel: { bones: 1 } },
      reinc: { form: 'una rondine di mare', noReturn: true },
    },
    waitingRoom: {
      text: '«Ancora le panche?» Non protesta. È brava ad aspettare, te l\'ha detto. Il Custode la riprende per la manica. Sulla soglia lei si volta: «Se smetto di parlare, lei viene a vedere?» La porta si chiude prima che tu risponda.',
      consequences: ['L\'anima è rinviata in Sala d\'Attesa ai sensi dell\'art. 31.', 'La trasformazione cartacea era a uno stadio avanzato.'],
      fx: { flags: ['nn_attesa'], rel: { vesper: 1, hoot: -1 }, soulStatus: { 'S-NN': 'in_attesa' } },
    },
  },
  specials: [
    {
      id: 'custodia', label: 'Affidamento in custodia all\'Archivio', desc: 'Sentenza speciale: sospensione del giudizio con affidamento a Mr. Hoot. Tea resta nell\'Ufficio, fuori dalla Sala d\'Attesa.',
      needClues: ['identita'], dest: 'waitingRoom',
      outcome: {
        text: 'Scrivi «Sala d\'Attesa» nella casella e, nelle note, «presso l\'Archivio, in custodia». È un trucco da scrivano. Mr. Hoot arriva a prenderla con una matita già temperata. «Abbiamo molti scaffali bassi» le dice. «E io ho la vista stanca.»',
        consequences: ['Tea Albrecht è affidata in custodia all\'Archivio.', 'La trasformazione cartacea si è arrestata: lontano dalla Sala d\'Attesa, non «si scrive» più.'],
        irregular: 'Sospensione eseguita fuori dalla Sala d\'Attesa.',
        fx: { flags: ['nn_custodia'], rel: { hoot: 2, bones: 1, vesper: -1 }, know: ['k_carta_si_ferma'] },
      },
    },
  ],
  truth: [
    'N.N. è Tea Albrecht, nove anni, morta nel naufragio dell\'«Aurora».',
    'Fu sospesa in Sala d\'Attesa «in attesa della madre», che era stata ascesa lo stesso giorno e non era più reperibile.',
    'Le anime trattenute troppo a lungo in Sala d\'Attesa diventano carta d\'ufficio: è l\'origine dei moduli.',
    'Il Custode porta ai Torchi chi smette di parlare. Tea continuò a parlare da sola e fu risparmiata.',
    'Lontano dalla Sala d\'Attesa la trasformazione si arresta.',
  ],
  truthClue: 'identita',
  residuo: 'non prelevabile — «materia insufficiente»',
};

export const C06: CaseDef = {
  id: 'c06',
  title: 'Il commendatore Vos',
  type: 'piu_anime',
  soulId: 'S-VOS',
  incarnation: {
    name: 'Dragan Vos', ageAtDeath: 84, origin: 'Kessel, poi capitale', era: 'secolo dei fili',
    occupation: 'sergente, poi presidente dell\'Opera Orfani di Guerra', cause: 'vecchiaia, nel proprio letto',
    traits: T(4, 7, 2, 6, 8, 7),
    bio: 'Sottufficiale decorato. Dopo la guerra ha fondato e diretto per cinquant\'anni l\'Opera Orfani di Guerra. Tre scuole portano il suo nome.',
    relations: [
      { name: 'Lorenz Hable', role: 'sottoposto', note: 'Classificato disertore nel rapporto firmato da Vos.' },
      { name: 'Hanne Hable', role: 'madre di Lorenz', note: 'Pensionata d\'onore su domanda di Vos.' },
      { name: 'Idris Molnar', role: 'caporale', note: 'Assunto da Vos come custode dell\'Opera. Ha taciuto per tutta la vita.' },
    ],
    events: [
      { age: 29, text: 'Notte di Kessel. Firma il rapporto sulla «cascina deserta».' },
      { age: 33, text: 'Fonda l\'Opera Orfani di Guerra.' },
      { age: 34, text: 'Fa assegnare una pensione d\'onore alla madre di un disertore.' },
      { age: 84, text: 'Muore nel sonno. Funerali di Stato.' },
    ],
    motivations: ['Che il bene fatto dopo pesi più del male fatto prima.', 'Che nessuno apra mai il rapporto di Kessel.'],
    conflicts: ['Ha costruito cinquant\'anni di opere su una notte che non ha mai nominato.'],
    memories: ['una torcia posata per terra', 'il freddo alle mani', 'nove voci che cantano'],
  },
  arrival: 'Un vecchio diritto, con il nastrino di una decorazione all\'occhiello. Si siede prima che tu lo inviti e posa le mani sulle ginocchia. Sono mani che hanno sempre freddo: se le sfrega senza accorgersene.',
  registration: 'Modulo 1/A — Ingresso ordinario, con nota di merito. Il fascicolo è voluminoso: encomi, bilanci, tre intitolazioni. Un solo foglio è più vecchio degli altri.',
  summary: 'Benefattore riconosciuto. Cinquant\'anni di opere documentate. A registro risulta una sola azione di guerra, classificata regolare.',
  recommended: 'ascension',
  recommendedWhy: 'Regolamento, art. 4: opere di pubblica utilità documentate, nessuna colpa a registro → Ascensione raccomandata.',
  docs: [
    {
      id: 'opera', title: 'Bilanci dell\'Opera Orfani di Guerra', kind: 'registro', source: 'Opera Orfani', reliability: 'attendibile',
      why: 'I bilanci sono veri. Vos ha realmente mantenuto oltre quattromila orfani. Alcuni li aveva resi orfani lui.',
      body: [
        'Cinquant\'anni di esercizio. Orfani assistiti: 4.380. Nessun ammanco.',
        { t: 'Nell\'elenco dei primi nove assistiti, tutti dal distretto di Kessel, la causale è identica: «genitori periti nell\'incendio di una cascina».', clue: 'nove_orfani' },
      ],
    },
    {
      id: 'rapporto', title: 'Rapporto sulla notte di Kessel (copia del dichiarante)', kind: 'rapporto', source: 'Carte personali di Vos', reliability: 'menzognero',
      why: 'È lo stesso rapporto falso del caso Hable. Vos ne ha conservato la copia per tutta la vita, nel cassetto del comodino.',
      body: [
        { t: '«Cascina trovata deserta. Il fuciliere Hable, datosi alla fuga, veniva colpito da fuoco nemico.»', clue: 'rapporto' },
        'La carta è lisa lungo le pieghe: è stata aperta e richiusa migliaia di volte.',
      ],
    },
    {
      id: 'pensione', title: 'Domanda di pensione per Hanne Hable', kind: 'lettera', source: 'Cassa Militare', reliability: 'contraddittorio',
      why: 'Vos chiese per la madre di Lorenz una pensione «per caduto con onore» senza ritrattare il rapporto: non poteva fare l\'una cosa senza confessare l\'altra.',
      body: [
        { t: '«Il sottoscritto garantisce personalmente che il fuciliere Hable cadde con onore nell\'adempimento del dovere.» Firmato: D. Vos.', clue: 'onore' },
      ],
    },
    {
      id: 'rettifica', title: 'Rettifica del foglio matricolare Hable', kind: 'verbale', source: 'Scrivania 7 — atti rinviati', reliability: 'attendibile',
      why: 'È l\'atto che il protagonista ha redatto chiudendo il caso Hable. Esiste solo se quella sentenza speciale è stata emessa.',
      cond: { flag: 'kessel_rettificato' },
      body: [
        { t: '«Si annulla la classificazione “disertore”. Il fuciliere Hable fu ucciso dal proprio sergente per aver rifiutato di incendiare una cascina con nove persone all\'interno.» In calce, la tua sigla.', clue: 'rettifica' },
      ],
    },
  ],
  clues: [
    { id: 'nove_orfani', label: 'I primi nove orfani venivano da una cascina bruciata', text: 'I primi nove assistiti dell\'Opera persero i genitori «nell\'incendio di una cascina» a Kessel.', status: 'documento' },
    { id: 'rapporto', label: 'Rapporto: cascina deserta, Hable disertore', text: 'Vos conservava la copia del proprio rapporto: cascina deserta, Hable disertore ucciso dal nemico.', status: 'documento' },
    { id: 'onore', label: 'Vos garantì che Hable «cadde con onore»', text: 'Nella domanda di pensione Vos garantisce che Lorenz Hable morì con onore.', status: 'documento' },
    { id: 'rettifica', label: 'La tua rettifica sul caso Hable', text: 'Il fascicolo contiene l\'atto con cui hai accertato che Vos uccise Hable.', status: 'verificato' },
    { id: 'verita', label: 'Vos confessa Kessel', text: 'Vos ammette: la cascina non era deserta, sparò lui a Lorenz Hable, e appiccò il fuoco con le proprie mani.', status: 'verificato', know: ['k_kessel'] },
    { id: 'orfani_suoi', label: 'Ha mantenuto i figli di chi aveva ucciso', text: 'I nove orfani di Kessel erano i figli delle persone bruciate nella cascina. Vos li ha cresciuti senza mai dire chi fosse.', status: 'verificato' },
  ],
  topics: [
    { id: 'opera', q: 'Mi parli dell\'Opera.', tone: 'sincera', a: '«Quattromilatrecentottanta. Li so a memoria per annata. Ho mangiato alla loro mensa ogni domenica per cinquant\'anni. Non è una difesa. È un fatto.»' },
    { id: 'kessel', q: 'La notte di Kessel.', tone: 'menzogna', a: '«Un\'azione di interdizione. Una cascina vuota, perché il nemico non vi trovasse riparo. Perdemmo un uomo che non resse. Succede.» Si sfrega le mani.' },
    { id: 'confronto', q: 'Disertore nel rapporto, «caduto con onore» nella sua domanda. Quale delle due firme è falsa?', tone: 'sincera', needContra: 'x_onore', gives: ['verita'], a: 'Le mani si fermano. «Tutte e due sono mie.» Respira. «Erano nove. Avevo l\'ordine scritto in tasca e freddo alle dita. Il ragazzo posò la torcia e disse no, piano, come si dice a tavola. Se avesse gridato forse non avrei… Gli ho sparato perché, se lui poteva dire no, allora potevo anch\'io, e io non volevo saperlo.»' },
    { id: 'saputo', q: 'So cosa accadde a Kessel. L\'ho accertato io.', tone: 'sincera', cond: { any: [{ clue: ['c03', 'verita'] }, { flag: 'kessel_rettificato' }] }, gives: ['verita'], a: 'Non finge sorpresa. «Allora il ragazzo è passato di qui.» Annuisce lentamente. «Bene. Ho aspettato cinquantacinque anni che qualcuno me lo dicesse in faccia. Ho pagato perfino un caporale perché tacesse, e ogni Natale speravo che parlasse.»' },
    { id: 'orfani', q: 'I primi nove orfani dell\'Opera.', tone: 'sincera', needClues: ['nove_orfani', 'verita'], gives: ['orfani_suoi'], a: '«I loro figli. Erano dai nonni, quella notte. Li ho cercati uno per uno. La più piccola mi chiamava zio.» Per la prima volta abbassa lo sguardo. «Non gliel\'ho mai detto. Avrei tolto loro anche l\'Opera.»' },
    { id: 'lorenz', q: 'Dove vorrebbe essere mandato?', tone: 'sincera', needClues: ['verita'], a: '«Dove ha mandato il ragazzo.» Lo dice subito. «Non per chiedergli scusa: non ne ho il diritto. Per stargli a tiro. Che abbia lui, una volta, la pistola in mano. In senso figurato. O no.»' },
  ],
  contradictions: [
    { id: 'x_onore', a: 'rapporto', b: 'onore', label: 'Disertore o caduto con onore?', note: 'Lo stesso uomo ha firmato un rapporto che chiama Hable disertore e una garanzia che lo dichiara caduto con onore.' },
  ],
  motivations: [
    { id: 'm_opere', text: 'Cinquant\'anni di opere documentate: art. 4.', dest: ['ascension'] },
    { id: 'm_kessel', text: 'Nove morti e un omicidio coperti da un rapporto falso.', needClues: ['verita'] },
    { id: 'm_orfani', text: 'Ha riparato per cinquant\'anni, in silenzio, proprio verso chi aveva colpito.', needClues: ['orfani_suoi'] },
  ],
  outcomes: {
    ascension: {
      text: 'Vos legge la destinazione e, per un istante, sembra deluso. «Così, dunque. Senza che nessuno me lo chieda.» Si alza, si aggiusta il nastrino. Sale come è vissuto: con tutti gli onori.',
      consequences: ['Dragan Vos è asceso, come da raccomandazione.', 'Il rapporto di Kessel non verrà più aperto da nessuno.'],
      fx: { flags: ['vos_asceso'], stats: { reputazione: 2 } },
    },
    renewal: {
      text: '«Un\'altra vita. Qualunque.» Annuisce. «Preferirei una con le mani calde.» Firma con un tratto da sottufficiale.',
      consequences: ['Dragan Vos è avviato al Rinnovo.', 'Porterà con sé il bisogno di riparare senza sapere che cosa.'],
      reinc: { returnIn: 9, note: 'predisposizione alla beneficenza anonima; mani sempre fredde' },
    },
    trial: {
      text: '«Sì» dice soltanto. Poi, alzandosi: «Mi metta dalla parte della porta sprangata. Dentro. Voglio sapere che cosa cantavano».',
      consequences: ['Dragan Vos è destinato alla Prova.', 'La sua prossima vita conoscerà un ordine eseguito da altri.'],
      fx: { flags: ['vos_prova'] },
      reinc: { returnIn: 9, note: 'Prova: una vita dalla parte di chi è chiuso dentro' },
    },
    otherForm: {
      text: 'Non discute. «Un animale da soma, magari. Qualcosa che porta pesi e non firma niente.» Il nastrino resta sulla scrivania.',
      consequences: ['Dragan Vos lascia la forma umana.', 'La decorazione è stata versata all\'Archivio.'],
      reinc: { form: 'un mulo d\'alta quota', returnIn: 12 },
    },
    waitingRoom: {
      text: '«Aspettare.» Si risiede. «L\'ho fatto per cinquantacinque anni. Sono allenato.» Si sfrega le mani.',
      consequences: ['Dragan Vos è trattenuto in Sala d\'Attesa.'],
      fx: { stats: { pendenti: 1 } },
    },
  },
  specials: [
    {
      id: 'stessa_sorte', label: 'Vincolo karmico con Lorenz Hable', desc: 'Sentenza speciale: La Prova, con vincolo a registro alla sorte di Lorenz Hable. Ovunque sia quell\'anima, questa le sarà posta accanto.',
      needClues: ['verita'], dest: 'trial',
      outcome: {
        text: 'Scrivi il vincolo a margine. Vos lo legge e chiude gli occhi. «Grazie» dice, ed è la parola più strana che sia stata detta a questa scrivania.',
        consequences: ['Dragan Vos è destinato alla Prova con vincolo karmico a Lorenz Hable.', 'Le due anime si ritroveranno, in qualche forma, nella prossima vita di entrambi.'],
        irregular: 'Vincolo karmico imposto senza istruttoria del Reparto Legami.',
        fx: { flags: ['vos_prova', 'vos_segue_lorenz'], rel: { bones: 1 } },
        reinc: { noReturn: true },
      },
    },
  ],
  truth: [
    'Vos ordinò ed eseguì l\'incendio della cascina di Kessel con nove persone all\'interno.',
    'Uccise Lorenz Hable che si era rifiutato, e scrisse un rapporto falso.',
    'Fondò l\'Opera Orfani di Guerra e crebbe per primi i figli delle sue vittime, senza mai rivelarsi.',
    'Fece assegnare alla madre di Lorenz una pensione d\'onore senza ritrattare il rapporto.',
    'Desidera essere giudicato: ha atteso per tutta la vita che qualcuno lo accusasse.',
  ],
  truthClue: 'verita',
  residuo: 'il numero d\'annata degli orfani; il suono di una torcia posata per terra',
};
