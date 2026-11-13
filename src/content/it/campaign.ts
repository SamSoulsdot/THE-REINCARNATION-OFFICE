// Struttura della campagna: capitoli, turni, obiettivi d'agenda, finali.
import type { Cond, Effects } from '../../engine/types';

export interface Beat { id: string; text: string; done: Cond; optional?: boolean }
export interface DayDef {
  day: number;
  chapter: number;
  title: string;
  memo: { from: string; text: string[] };
  cases: string[];
  procedural: number;
  directive?: string;
  fx?: Effects;
  beats: Beat[];
}

export const CHAPTERS: Record<number, { title: string; subtitle: string; intro: string[] }> = {
  1: { title: 'Capitolo I', subtitle: 'The New Employee', intro: [
    'Non ricordi il viaggio. Ricordi un portone, una nebbia, e la sensazione precisa di essere in ritardo.',
    'Qualcuno ti ha messo in mano un tesserino. C\'è il tuo nome, una qualifica — SCRIVANO — e un numero di scrivania.',
    'Ufficio Reincarnazioni, Sezione Occidentale. Si lavora su turni. Si timbra all\'entrata e all\'uscita. Tutto il resto, ti hanno detto, «è scritto».',
  ] },
  2: { title: 'Capitolo II', subtitle: 'The Forgotten Files', intro: [
    'Tre turni. Hai imparato dove sono i timbri, come si chiama il tè e quale gradino dell\'Archivio non esiste.',
    'Hai anche imparato che un soldato morto ti conosce, e che qualcuno con le tue iniziali ha già usato la tua scrivania.',
    'Stamattina la Direzione ti ha convocato. La scala che porta alla pedana, fino a ieri, aveva un usciere. Oggi no.',
  ] },
  3: { title: 'Capitolo III', subtitle: 'The Repeating Souls', intro: [
    'Le anime che hai giudicato sono andate dove le hai mandate. Alcune hanno vissuto. Tutte, prima o poi, muoiono di nuovo.',
    'L\'Indice delle Reincarnazioni ha cominciato ad agganciare i fascicoli da solo: accanto a certi nomi nuovi compare, in rosso, un cartiglio. RITORNO.',
    'Tornano con un\'altra faccia e un altro nome. Qualcosa, però, se lo portano dietro. E qualcosa di tuo è rimasto attaccato a loro.',
  ] },
  4: { title: 'Capitolo IV', subtitle: 'The Higher Authority', intro: [
    'C\'è un piano di sopra. L\'hai sempre saputo: ci va il montacarichi. Non ti eri mai chiesto chi ci abitasse.',
    'Stamattina, per la prima volta da quando sei qui, qualcuno è sceso. Non con il montacarichi. Per le scale della Direzione, senza far rumore.',
    'Dice di chiamarsi «noi».',
  ] },
  5: { title: 'Capitolo V', subtitle: 'The Final Judgment', intro: [
    'Sai chi sei. Sai quante volte lo hai saputo.',
    'Sai di che cosa è fatta la carta su cui scrivi, dove vanno quelli che salgono, che cosa c\'è nei barattoli.',
    'Resta un fascicolo. Ha il numero più corto di tutto l\'Archivio, e nessuno lo ha mai aperto, perché non c\'era nessuno, prima di lui, che potesse farlo.',
    'Adesso c\'è.',
  ] },
};

export const DAYS: DayDef[] = [
  { day: 1, chapter: 1, title: 'Primo turno', cases: ['c01'], procedural: 1,
    memo: { from: 'Signorina Pim — Accettazione', text: ['Benvenuto! Si presenti al bancone per il tesserino.', 'La sua scrivania è la n. 7, in Sala dei Giudizi.', 'A fine turno timbri l\'uscita all\'orologio marcatempo, in Area Dipendenti. Chi non timbra, per l\'ufficio, non se n\'è mai andato.'] },
    beats: [
      { id: 'b_pim', text: 'Presentati alla Signorina Pim, al bancone della Reception.', done: { flag: 'met_pim' } },
      { id: 'b_desk', text: 'Raggiungi la tua scrivania, la n. 7, in Sala dei Giudizi.', done: { flag: 'at_desk' } },
      { id: 'b_c01', text: 'Evadi la tua prima pratica: Ettore Balducci.', done: { flag: 'closed_c01' } },
      { id: 'b_bones', text: 'Fai conoscenza con il collega della scrivania 1.', done: { flag: 'met_bones' }, optional: true },
    ] },
  { day: 2, chapter: 1, title: 'Secondo turno', cases: ['c02'], procedural: 2, directive: 'd_quota', fx: { areas: ['interview', 'archive'] },
    memo: { from: 'Direzione di Reparto', text: ['Lo scrivano della 7 si presenti alla Direttrice, che in mattinata ispeziona la Sala.', 'È in vigore la Direttiva 1 (quota minima). Si veda la bacheca.', 'Da oggi lo scrivano ha accesso alle Sale Colloqui e all\'Archivio.'] },
    beats: [
      { id: 'b_vesper', text: 'Presentati a Madame Vesper.', done: { flag: 'met_vesper' } },
      { id: 'b_c02', text: 'Evadi la pratica: Agnese Morvillo.', done: { flag: 'closed_c02' } },
      { id: 'b_hoot', text: 'Scendi in Archivio e presentati all\'Archivista.', done: { flag: 'met_hoot' } },
      { id: 'b_ilse', text: 'Presentati alla Consulente dei Colloqui.', done: { flag: 'met_ilse' }, optional: true },
      { id: 'b_grell', text: 'In Area Dipendenti c\'è qualcuno che bada alla stufa.', done: { flag: 'met_grell' }, optional: true },
    ] },
  { day: 3, chapter: 1, title: 'Terzo turno', cases: ['c03'], procedural: 2,
    memo: { from: 'Sportello Accettazione', text: ['Pratica 1/C in arrivo: morte violenta, classificazione contestata.', 'Nota a matita, non firmata: «Questo l\'ha già visto. Non glielo dica».'] },
    beats: [
      { id: 'b_c03', text: 'Evadi la pratica: Lorenz Hable.', done: { flag: 'closed_c03' } },
      { id: 'b_penna', text: 'C\'è qualcosa che non torna, intorno alla tua scrivania. Guarda meglio.', done: { know: 'k_cassetto_penna' }, optional: true },
    ] },
  { day: 4, chapter: 2, title: 'Quarto turno', cases: ['c04'], procedural: 2, directive: 'd_ricorsi', fx: { areas: ['management'] },
    memo: { from: 'Direzione di Reparto', text: ['È in vigore la Direttiva 2: l\'esame dei ricorsi è sospeso.', 'È pervenuto il ricorso 77/R. Lo scrivano ne prenda visione «per mera conoscenza».', 'La scala della Direzione è aperta allo scrivano.'] },
    beats: [
      { id: 'b_c04', text: 'Definisci il ricorso 77/R: Cornelia Asher.', done: { flag: 'closed_c04' } },
      { id: 'b_sched', text: 'Se una pagina è stata sostituita, l\'originale è da qualche parte.', done: { flag: 'schedario_aperto' }, optional: true },
    ] },
  { day: 5, chapter: 2, title: 'Quinto turno', cases: ['c05'], procedural: 2, directive: 'd_archivio',
    memo: { from: 'Custode', text: ['Trovata una. Parla. Non è mia.', 'La porto alla 7.'] },
    beats: [
      { id: 'b_c05', text: 'Definisci la pratica N.N.', done: { flag: 'closed_c05' } },
      { id: 'b_nn', text: 'Senza un nome non può essere giudicata. Un registro deve averla contata.', done: { flag: 'doc_nn_registro' }, optional: true },
    ] },
  { day: 6, chapter: 2, title: 'Sesto turno', cases: ['c06'], procedural: 2,
    memo: { from: 'Sportello Accettazione', text: ['In arrivo con nota di merito: comm. Dragan Vos.', 'La Direzione raccomanda «la sollecitudine dovuta ai benemeriti».'] },
    beats: [
      { id: 'b_c06', text: 'Evadi la pratica: Dragan Vos.', done: { flag: 'closed_c06' } },
      { id: 'b_stato', text: 'In Archivio, tra gli stati di servizio del personale, c\'è una cartella in più.', done: { know: 'k_stato_servizio' }, optional: true },
      { id: 'b_regol', text: 'Rileggi il Regolamento sul leggio dell\'Archivio.', done: { know: 'k_regolamento_cambia' }, optional: true },
    ] },
  { day: 7, chapter: 3, title: 'Settimo turno', cases: ['c07'], procedural: 2,
    memo: { from: 'Archivio — Indice delle Reincarnazioni', text: ['Si segnala anima con suffisso: 20.114/b.', 'L\'Indice non sa come trattare le frazioni. Si rimette allo scrivano.'] },
    beats: [
      { id: 'b_c07', text: 'Evadi la pratica: Sabina Tadini.', done: { flag: 'closed_c07' } },
      { id: 'b_tacche', text: 'Mr. Bones, a mezzogiorno, lascia la scrivania.', done: { know: 'k_tacche_bones' }, optional: true },
    ] },
  { day: 8, chapter: 3, title: 'Ottavo turno', cases: ['c08'], procedural: 2, directive: 'd_prove',
    memo: { from: 'Direzione di Reparto', text: ['È in vigore la Direttiva 4: obiettivo trimestrale di Prove.', 'Pratica con cartiglio RITORNO in arrivo alla 7.', 'Lo scrivano tenga presente la Direttiva nel motivare.'] },
    beats: [
      { id: 'b_c08', text: 'Evadi la pratica con cartiglio RITORNO.', done: { flag: 'closed_c08' } },
      { id: 'b_specchio', text: 'Nella Sala Colloqui 2 c\'è uno specchio.', done: { know: 'k_specchio' }, optional: true },
    ] },
  { day: 9, chapter: 3, title: 'Nono turno', cases: ['c09'], procedural: 1,
    memo: { from: 'Direzione di Reparto — RISERVATO', text: ['Ordine d\'indagine n. 3 a carico della Consulente Marrow.', 'Esito atteso: rinnovo interno. Termine: fine turno.', 'Le prove non sono nel fascicolo. Lo scrivano le raccolga.'] },
    beats: [
      { id: 'b_c09', text: 'Definisci l\'indagine interna n. 3.', done: { flag: 'closed_c09' } },
      { id: 'b_cil', text: 'I cilindri di registrazione sono nella Sala Colloqui 2.', done: { flag: 'doc_ilse_cilindri' }, optional: true },
      { id: 'b_cas', text: 'La scrivania della Consulente ha un cassetto.', done: { flag: 'doc_ilse_cassetto' }, optional: true },
      { id: 'b_prel', text: 'Il Registro dei Prelievi lo custodisce l\'Archivista.', done: { flag: 'doc_ilse_prelievi' }, optional: true },
    ] },
  { day: 10, chapter: 4, title: 'Decimo turno', cases: ['c10'], procedural: 1, directive: 'd_segnalazione',
    memo: { from: 'Ispettore Quill, per il Collegio', text: ['Noi siamo in sede.', 'È in vigore la Direttiva 5: ogni giudizio irregolare va segnalato.', 'Lo scrivano della 7 riceverà oggi una pratica già compilata. Lo scrivano timbri.'] },
    beats: [
      { id: 'b_quill', text: 'L\'Ispettore desidera parlarti.', done: { flag: 'met_quill' } },
      { id: 'b_c10', text: 'Definisci la pratica: sospesa n. 4471-O.', done: { flag: 'closed_c10' } },
    ] },
  { day: 11, chapter: 4, title: 'Undicesimo turno', cases: ['c11'], procedural: 1, directive: 'd_ascensioni',
    memo: { from: 'Signorina Pim — Accettazione', text: ['IL MONTACARICHI È SCESO.', 'Non so come contarlo. L\'ho messo alla sua scrivania.', '(La calligrafia, di solito perfetta, trema.)'] },
    beats: [{ id: 'b_c11', text: 'Decidi che cosa fare del Rientrato.', done: { flag: 'closed_c11' } }] },
  { day: 12, chapter: 4, title: 'Dodicesimo turno', cases: [], procedural: 1,
    memo: { from: '(senza mittente — posta pneumatica, terza bocca)', text: ['C\'è un piano sotto l\'Archivio.', 'C\'è un fascicolo che ti aspetta, là sotto, dove lo hai trovato le altre volte.', 'Oggi nessuno ti assegna una pratica. Oggi la pratica sei tu.'] },
    beats: [
      { id: 'b_ris', text: 'Trova il modo di scendere nel Reparto Riservato, oltre il cancello dell\'Archivio.', done: { area: 'restricted' } },
      { id: 'b_f7', text: 'Recupera il Fascicolo n. 7.', done: { flag: 'has_file7' } },
      { id: 'b_c12', text: 'Alla tua scrivania, apri il Fascicolo n. 7.', done: { flag: 'closed_c12' } },
      { id: 'b_bar', text: 'Guarda gli scaffali del Reparto Riservato.', done: { know: 'k_barattoli' }, optional: true },
    ] },
  { day: 13, chapter: 5, title: 'Tredicesimo turno', cases: [], procedural: 2,
    memo: { from: 'Il Direttore', text: ['Domani.', 'Venga quando vuole. Il vetro sarà aperto.', 'Oggi faccia ciò che non ha mai fatto le altre volte: parli con loro.'] },
    beats: [
      { id: 'b_parla', text: 'Parla con chi è rimasto: dì a qualcuno che domani salirai.', done: { any: [{ seen: 'bones_ally' }, { seen: 'hoot_ally' }, { seen: 'vesper_ally' }, { seen: 'pim_ally' }, { seen: 'grell_ally' }, { seen: 'ilse_ally' }] } },
    ] },
  { day: 14, chapter: 5, title: 'Ultimo turno', cases: [], procedural: 0, fx: { areas: ['director'] },
    memo: { from: 'Il Direttore', text: ['Il vetro è aperto.'] },
    beats: [{ id: 'b_c13', text: 'Sali alla Direzione. Entra nell\'ufficio del Direttore. Apri il Fascicolo n. 0.', done: { flag: 'closed_c13' } }] },
];

export const LAST_DAY = 14;

export interface EndingDef { id: string; title: string; subtitle: string; text: string[] }

export const ENDINGS: Record<string, EndingDef> = {
  perfect: { id: 'perfect', title: 'The Perfect Employee', subtitle: 'L\'Impiegato Perfetto', text: [
    'Hai consegnato il Primo Scrivano alla sala che aveva generato. Il Collegio lo ha accolto con un mormorio lungo, soddisfatto, che è sceso per le scale come un odore.',
    'Il mattino dopo, sul vetro smerigliato, le lettere dorate erano le stesse: IL DIRETTORE. Sotto, più piccolo: «Riceve». Dietro il vetro c\'era una scrivania, e sulla scrivania il tuo timbro.',
    'Le quote arrivano ancora. Ora le firmi tu. Le rispetti con una diligenza che i Livelli Superiori definiscono, in una nota di encomio a sei calligrafie, «esemplare». Sei molto bravo. Lo sei sempre stato: stava scritto nel tuo stato di servizio.',
    'Ogni tanto, la sera, apri un barattolo vuoto e ci guardi dentro. Non sai bene che cosa ti aspetti di trovarci. Poi lo richiudi, e sigli le Ascensioni del giorno.',
    'Nulla va perduto. L\'hai fatto incidere sopra la porta.',
  ] },
  reformer: { id: 'reformer', title: 'The Reformer', subtitle: 'Il Riformatore', text: [
    'Non hai distrutto l\'Ufficio. Lo hai messo sotto processo — e, cosa più difficile, lo hai tenuto aperto mentre il processo durava.',
    'Il timbro a spirale è stato ritirato dal servizio. Il Modulario ha di nuovo la pagina 211-bis: l\'ha reinserita chi l\'aveva tagliata, con una nota a margine: «Non era regolare. Lo sapevamo».',
    'Il Residuo non si preleva più. Si chiede. Alcune anime scelgono di lasciare qualcosa: un dolore, un nome che pesa. La maggior parte no. Rinascono più pesanti e, dicono i registri, più lente a commettere la stessa cosa due volte.',
    'La Sala d\'Attesa ha una porta con la maniglia da entrambe le parti. I Torchi sono fermi. La carta, adesso, si fa con gli stracci, e brucia come ogni altra carta.',
    'Non è giusto. Non ancora. Ma ogni sentenza, adesso, ha una firma leggibile, e sotto la firma una riga nuova: «L\'interessato può chiedere perché».',
  ] },
  rebel: { id: 'rebel', title: 'The Rebel', subtitle: 'Il Ribelle', text: [
    'Hai scritto «Altra Forma» accanto al numero zero, e l\'Ufficio ha smesso di avere quella di un ufficio.',
    'I barattoli si sono incrinati tutti insieme: un suono come di ghiaccio a primavera. Ciò che c\'era dentro non è salito e non è sceso. È andato. A cercare, ognuno, chi lo aveva perduto.',
    'Il Collegio ha deliberato per l\'ultima volta, a maggioranza, di non esistere. Le pareti si sono sedute. Qualcuna si è alzata e se n\'è andata con le proprie gambe.',
    'Non c\'è più nessuno che giudichi. I morti, adesso, arrivano a un portone aperto e trovano un atrio vuoto, delle panche, e una ragazza che sorride e non conta più. Alcuni restano. Altri proseguono, senza che nessuno dica loro verso dove.',
    'Nel mondo dei vivi cominciano a nascere bambini che ricordano. Non tutto. Un odore di pane, una canzone dal ponte di sotto, dodici passi. Nessuno sa ancora se sia una grazia o una condanna. Non c\'è più un modulo per stabilirlo.',
  ] },
  cycle: { id: 'cycle', title: 'The Eternal Cycle', subtitle: 'Il Ciclo Eterno', text: [
    'Non ricordi il viaggio. Ricordi un portone, una nebbia, e la sensazione precisa di essere in ritardo.',
    'Qualcuno ti ha messo in mano un tesserino. C\'è il tuo nome, una qualifica — SCRIVANO — e un numero di scrivania. È l\'otto.',
    '«Buongiorno e benvenuto all\'Ufficio Reincarnazioni!» dice la ragazza al bancone. Il sorriso non si sposta di un millimetro. «Scrivania otto. È rimasta libera… oh, da un po\'.»',
    'In Sala dei Giudizi uno scheletro in gilet sta temperando una matita. Alza la testa. «Ah» dice. «Il nuovo.» Posa la matita. Apre un cassetto.',
    'Senti, sotto il piano della sua scrivania, un piccolo rumore di lama sul legno.',
    '«Di nuovo.»',
  ] },
  newbeginning: { id: 'newbeginning', title: 'The New Beginning', subtitle: 'Il Nuovo Inizio', text: [
    'Hai scritto «Rinnovo» accanto al numero zero. E nella casella del prelievo, per lui come per te, la stessa parola: RIFIUTATO.',
    'Il Primo Scrivano ha dimenticato. Non per sottrazione: per restituzione. Barattolo dopo barattolo, ogni cosa è tornata a chi apparteneva — a chi era ancora in giro, in qualunque vita, in qualunque forma. Un fornaio, da qualche parte, ha saputo all\'improvviso come si chiamava una donna morta da un secolo, e si è messo a piangere sull\'impasto senza sapere perché.',
    'Quando l\'ultimo barattolo è stato vuoto, dietro la scrivania di pietra c\'era soltanto un uomo molto vecchio, molto leggero, che ti ha chiesto con cortesia dove fosse l\'uscita. Gliel\'hai indicata. È uscito dalla porta girevole. Dall\'altra parte, questa volta, è uscito qualcuno.',
    'Poi ti sei seduto dalla parte giusta della scrivania 7 — la sedia delle anime — e ti sei giudicato. Per Brenner. Ad alta voce, perché restasse a verbale. Nessuno ti ha tolto niente.',
    'Nasci un giovedì. Lo sai, perché lo ricordi. Ricordi un portone, sette scrivanie, uno scheletro che non ha fatto la settima tacca, un gufo che ti ha lasciato le luci accese.',
    'Hai tutta una vita per decidere che cosa farne. È la prima, in tutto il registro, che comincia sapendo.',
  ] },
};

/** Motivi per cui un tentativo ricade nel Ciclo Eterno (mostrati nella schermata finale). */
export const CYCLE_REASONS: Record<string, string> = {
  self_renewal: 'Sul tuo stesso fascicolo avevi scritto, per la settima volta, «rinnovo interno». L\'Ufficio ha eseguito.',
  waiting: 'Hai sospeso il giudizio sul Direttore. Tutto è rimasto com\'era — e ciò che resta com\'è, qui dentro, ricomincia.',
  perfect_no: 'Hai consegnato il Direttore al Collegio, ma il Collegio non affida la Direzione a uno scrivano di cui non si fida. Ha disposto, come prima ordinanza, il tuo rinnovo.',
  reform_no: 'Hai messo l\'Ufficio sotto processo, ma un processo ha bisogno di testimoni, di prove e di qualcuno che tenga aperte le porte. Eri solo, o non sapevi abbastanza. L\'istruttoria è stata archiviata. Tu con lei.',
  rebel_no: 'Hai provato a disfare l\'istituzione, ma non avevi né le mani né il seguito per farlo. I barattoli hanno tenuto. L\'Ispettore ha annotato il tuo nome un\'ultima volta.',
  renew_no: 'Hai fatto dimenticare il Direttore, ma nessuno, nell\'Ufficio, ricordava abbastanza da impedire che tutto venisse rifondato uguale. Qualcuno doveva pur sedersi a quella scrivania. Sei stato il primo a entrare nella stanza.',
};

/** Righe d'epilogo sulle anime e sulle persone, secondo le decisioni prese. */
export const EPILOGUE: { cond: Cond; text: string }[] = [
  { cond: { flag: 'promessa_mantenuta' }, text: 'Lorenz Hable: tre vite fa gli fu promesso che sarebbe andata diversamente. È andata diversamente.' },
  { cond: { flag: 'lorenz2_prova' }, text: 'Lorenz Hable: terza Prova consecutiva per aver detto no. Il «no» è ancora intatto. È l\'unica cosa che lo sia.' },
  { cond: { flag: 'hable_riuniti' }, text: 'Hanne e Lorenz Hable: in Sala d\'Attesa, sulla stessa panca. Parlano. Finché parlano, nessuno viene a prenderli.' },
  { cond: { flag: 'nn_custodia' }, text: 'Tea Albrecht: ha dieci dita. Sa contare fino a un numero che ha inventato lei.' },
  { cond: { flag: 'albrecht_riunite' }, text: 'Margit e Tea Albrecht: hanno attraversato insieme la porta del Rinnovatore. Una delle due cantava.' },
  { cond: { flag: 'nn_attesa' }, text: 'Tea Albrecht: in Archivio è arrivata una risma con una filigrana insolita. Cinque piccole linee, come le dita di una mano piccola.' },
  { cond: { flag: 'nn_rinnovo' }, text: 'Tea Albrecht: è nata una bambina che ha paura dei traghetti e sa a memoria il regolamento di un ufficio che nessuno ha mai sentito nominare.' },
  { cond: { flag: 'nn_forma' }, text: 'Tea Albrecht: sopra il porto di una città di mare, una rondine segue i traghetti fino al largo. Poi torna.' },
  { cond: { flag: 'sabina_ricongiunzione' }, text: 'Sabina Tadini: aspetta in Archivio, con una branda in più già pronta. Ruggero Corvin, dicono, ha fatto testamento e si è messo a letto, sereno.' },
  { cond: { flag: 'sabina_ascesa' }, text: 'Sabina Tadini: metà di un\'anima, in una parete. L\'altra metà apparecchia ancora per due.' },
  { cond: { flag: 'cornelia_accolto' }, text: 'Cornelia Asher: qualcuno, finalmente, ha guardato la pagina tre.' },
  { cond: { flag: 'cornelia_respinto' }, text: 'Cornelia Asher: terza vita di espiazione per un veleno che non versò.' },
  { cond: { flag: 'vos_segue_lorenz' }, text: 'Dragan Vos: ovunque vada l\'anima di Lorenz Hable, c\'è qualcuno con le mani fredde che le porta il carbone e non vuole essere pagato.' },
  { cond: { flag: 'ettore_asceso' }, text: 'Ettore Balducci: lo hai mandato in alto. Hai saputo dopo che cosa volesse dire.' },
  { cond: { flag: 'odile_rinnovo' }, text: 'Odile Halle: è nata. Non aspetta nessuno.' },
  { cond: { flag: 'odile_forma' }, text: 'Odile Halle: un tiglio, in un vaso, su una scrivania. Poi, quando il vaso non è bastato più, in un cortile.' },
  { cond: { flag: 'odile_macerata' }, text: 'Odile Halle: una risma di carta molto bianca, che nessuno ha mai avuto il coraggio di usare.' },
  { cond: { flag: 'odile_nicchia' }, text: 'Odile Halle: ancora nella nicchia. Le righe sulle unghie sono arrivate alle nocche.' },
  { cond: { flag: 'ilse_rinnovata' }, text: 'Ilse Marrow: una Consulente gentile, alle Sale Colloqui, cerca ogni mattina le sue penne. Sono dove le ha sempre tenute.' },
  { cond: { flag: 'ilse_arredo' }, text: 'Ilse Marrow: uno schedario di legno chiaro. I cassetti, quando li apri, sospirano.' },
  { cond: { flag: 'ilse_ascesa' }, text: 'Ilse Marrow: una delle voci del Collegio, dicono, ogni tanto chiede la temperatura.' },
  { cond: { flag: 'ilse_torchi' }, text: 'Ilse Marrow: scrive i nomi sui cartellini, prima. Qualcuno il nome se lo ricorda ancora.' },
  { cond: { flag: 'ilse_salva' }, text: 'Ilse Marrow: trentuno verbali alterati, e nemmeno uno di cui si penta.' },
  { cond: { flag: 'hoot_denunciato' }, text: 'Oswin Hoot: gli occhiali sono ancora piegati sul Modulario. La lampada verde non l\'ha spenta nessuno.' },
  { cond: { flag: 'hoot_perdonato' }, text: 'Oswin Hoot: ha consegnato una lettera di scuse lunga decenni di originali. È stata accettata.' },
  { cond: { flag: 'rientrato_stormo' }, text: 'Il Rientrato: uno stormo di storni, che a volte, in volo, prende per un momento la forma di tre persone.' },
  { cond: { flag: 'pim_promessa' }, text: 'La Signorina Pim: la prima riga del Registro è rimasta in bianco.' },
];
