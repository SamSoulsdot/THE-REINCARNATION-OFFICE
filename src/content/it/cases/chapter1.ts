// CAPITOLO I — The New Employee. Tre casi curati.
// Ogni caso parte da una verità canonica (truth) da cui discendono documenti, testimonianze e colloquio.
import type { CaseDef } from '../../../engine/types';

const T = (e: number, a: number, o: number, c: number, r: number, am: number) => ({
  empatia: e, altruismo: a, onesta: o, coraggio: c, responsabilita: r, ambizione: am,
});

export const C01: CaseDef = {
  id: 'c01',
  title: 'Il fornaio di Vico Storto',
  type: 'ordinario',
  soulId: 'S-ETTORE',
  incarnation: {
    name: 'Ettore Balducci', ageAtDeath: 71, origin: 'Mareschiara, quartiere di Vico Storto', era: 'secolo delle ciminiere',
    occupation: 'fornaio', cause: 'arresto cardiaco, davanti alla bocca del forno',
    traits: T(6, 7, 4, 3, 7, 3),
    bio: 'Figlio e nipote di fornai. Ha impastato nello stesso locale per cinquantasei anni. Vedovo, senza figli. Il quartiere lo ricorda come «quello del pane a credito».',
    relations: [
      { name: 'Nino Ferrante', role: 'garzone', note: 'Assunto a quattordici anni. Denunciato da Ettore a sedici.' },
      { name: 'Vedova Ferrante', role: 'madre del garzone', note: 'Ha ricevuto per vent\'anni un affitto pagato da «un amico».' },
      { name: 'Olga Balducci', role: 'moglie', note: 'Morta di tifo. Teneva lei i conti.' },
    ],
    events: [
      { age: 15, text: 'Eredita il forno alla morte del padre.' },
      { age: 34, text: 'Inverno della Serrata: i mulini chiudono, il quartiere sciopera. Ettore segna il pane su un quaderno e non riscuote.' },
      { age: 49, text: 'Durante l\'Occupazione denuncia il garzone Nino Ferrante per furto continuato di farina.' },
      { age: 51, text: 'Comincia a pagare, in forma anonima, l\'affitto della vedova Ferrante.' },
      { age: 71, text: 'Muore all\'alba, con le mani ancora infarinate.' },
    ],
    motivations: ['Tenere acceso il forno, a qualunque costo.', 'Pareggiare un conto che non ha mai osato nominare.'],
    conflicts: ['Ha scelto la propria sicurezza contro la vita di un ragazzo, e lo sa.'],
    memories: ['l\'odore del lievito alle quattro del mattino', 'il quaderno nero dei crediti', 'gli occhi di Nino sulla soglia, il giorno dell\'arresto'],
  },
  arrival: 'Un uomo piccolo, con gli avambracci grossi e bianchi di farina che non va più via. Si toglie un berretto che non ha e resta in piedi davanti alla scrivania, come davanti a un bancone.',
  registration: 'Modulo 1/A — Ingresso ordinario. Il fascicolo è sottile, in ordine. In un angolo della scheda c\'è un timbro che il modulario non prevede.',
  summary: 'Vita lunga e operosa. Nessuna pendenza verso l\'Ufficio. L\'unico atto pubblico a suo nome, oltre al pane, è una denuncia.',
  recommended: 'renewal',
  recommendedWhy: 'Regolamento, art. 12: vita ordinaria, meriti e colpe in equilibrio documentale → Rinnovo.',
  docs: [
    {
      id: 'scheda', title: 'Scheda d\'ingresso 1/A', kind: 'scheda', source: 'Sportello Accettazione', reliability: 'attendibile',
      why: 'Compilata d\'ufficio all\'arrivo. Il timbro a spirale è stato apposto dal Deposito: all\'anima è stato applicato un prelievo straordinario di Residuo.',
      body: [
        'BALDUCCI Ettore, anni 71. Fornaio. Provenienza: Mareschiara, Vico Storto.',
        'Causa del decesso: arresto cardiaco. Ora presunta: prima dell\'alba. Rinvenuto dal garzone del lattaio.',
        'Reincarnazioni precedenti a registro: 2. Pendenze: nessuna.',
        { t: 'Nell\'angolo in basso, impresso a secco e poi ripassato a inchiostro: una spirale interrotta da un taglio netto. Non compare nel Modulario Generale dei Timbri.', clue: 'timbro' },
      ],
    },
    {
      id: 'quaderno', title: 'Quaderno nero dei crediti', kind: 'registro', source: 'Effetti personali del defunto', reliability: 'attendibile',
      why: 'È il vero registro del forno: Olga lo teneva con rigore, Ettore ha continuato a scriverci senza mai riscuotere.',
      body: [
        'Copertina di tela cerata. Calligrafia di donna fino a metà, poi una mano più pesante.',
        { t: '«Inverno della Serrata. Fam. Pruneri, pani 41. Fam. Aldobrandi, pani 63. Fam. Ferrante, pani 88…» Duecentoquattordici famiglie. Nessuna riga è barrata come pagata.', clue: 'credito' },
        'In fondo, a matita: «Olga dice: o li segni o li regali, ma non fare finta di venderli». Sotto, più tardi: «Li segno».',
      ],
    },
    {
      id: 'denuncia', title: 'Verbale di denuncia n. 318', kind: 'verbale', source: 'Comando di Piazza, periodo dell\'Occupazione', reliability: 'incompleto',
      why: 'Il verbale riporta solo ciò che Ettore dichiarò: tace che sapeva dove andava la farina. L\'omissione è sua, non del verbalizzante.',
      body: [
        'Il sottoscritto Balducci Ettore, esercente, denuncia il proprio garzone FERRANTE Nino, anni 16, per sottrazione continuata di farina razionata.',
        { t: '«Il dichiarante afferma di ignorare la destinazione della merce sottratta.» Firma: E. Balducci. Esito: arresto del denunciato, due anni di lavoro coatto.', clue: 'denuncia' },
        'Annotazione a margine, altra mano: «Il forno Balducci è confermato fornitore del Comando».',
      ],
    },
    {
      id: 'lettera', title: 'Lettera mai spedita di Nino Ferrante', kind: 'lettera', source: 'Allegata dal Servizio Testimonianze', reliability: 'attendibile',
      why: 'Nino scrive dal campo di lavoro. Non mente: Ettore lo vide davvero nella cantina del conciatore.',
      body: [
        '«Mamma, non ti arrabbiare col signor Ettore. La farina non la vendevo. La portavo giù dal conciatore, in cantina, dove stavano i sette che cercavano.»',
        { t: '«Lui lo sapeva. Una sera mi è venuto dietro e mi ha visto. Non ha detto niente, ha solo guardato la botola. La settimana dopo sono venuti a prendere me.»', clue: 'sapeva' },
        '«I sette non li hanno trovati. Questo te lo scrivo perché tu lo sappia: non li hanno trovati.»',
      ],
    },
    {
      id: 'ricevute', title: 'Ricevute d\'affitto, mazzo legato con spago', kind: 'registro', source: 'Effetti personali del defunto', reliability: 'attendibile',
      why: 'Ettore ha pagato l\'affitto della madre di Nino per vent\'anni, senza mai farsi riconoscere.',
      body: [
        'Duecentoquaranta ricevute, una al mese. Intestataria: vedova Ferrante, Vico Storto 9.',
        { t: 'Alla voce «versante» il padrone di casa ha scritto ogni volta: «un amico». Le prime sono datate due anni dopo la denuncia.', clue: 'affitto' },
      ],
    },
  ],
  clues: [
    { id: 'timbro', label: 'Timbro a spirale spezzata', text: 'Sulla scheda d\'ingresso c\'è un timbro non previsto dal modulario: una spirale interrotta da un taglio.', status: 'documento', know: ['sym_spirale'] },
    { id: 'credito', label: 'Pane a credito mai riscosso', text: 'Durante la Serrata Ettore ha sfamato 214 famiglie senza mai chiedere il dovuto.', status: 'documento' },
    { id: 'denuncia', label: 'Denunciò Nino «ignorando» dove andasse la farina', text: 'Nel verbale Ettore dichiara di non sapere a chi fosse destinata la farina rubata dal garzone.', status: 'documento' },
    { id: 'sapeva', label: 'Nino: «Lui lo sapeva»', text: 'Secondo la lettera di Nino, Ettore lo vide portare la farina a sette persone nascoste.', status: 'testimonianza' },
    { id: 'affitto', label: 'Vent\'anni di affitto pagato da «un amico»', text: 'Qualcuno ha pagato l\'affitto alla madre di Nino a partire da due anni dopo l\'arresto.', status: 'documento' },
    { id: 'verita', label: 'Ettore sapeva e denunciò per paura', text: 'Ettore ammette: sapeva dei sette nascosti. Denunciò il ragazzo perché il Comando non arrivasse a lui e al forno.', status: 'verificato' },
    { id: 'rata', label: 'L\'affitto era «una rata»', text: 'Ettore ammette di essere «l\'amico». Non la considera carità: è un debito che non ha mai finito di pagare.', status: 'verificato' },
  ],
  topics: [
    { id: 'forno', q: 'Mi parli del forno.', tone: 'sincera', a: '«Tre generazioni. Mio nonno diceva che un forno spento è un quartiere che ha freddo. Non l\'ho mai spento. Neanche quando avrei dovuto.»' },
    { id: 'serrata', q: 'Il quaderno dei crediti. Perché non ha mai riscosso?', tone: 'sincera', needClues: ['credito'], a: '«Olga li segnava per rispetto. Chi ha fame non vuole l\'elemosina, vuole un debito. Io ho solo continuato a segnare. Riscuotere era un altro mestiere.»' },
    { id: 'nino', q: 'Ha denunciato il suo garzone.', tone: 'evasiva', needClues: ['denuncia'], a: '«Rubava. Farina razionata. C\'era la legge del Comando e io avevo la licenza del Comando. Che dovevo fare.» Non è una domanda. Si guarda le mani.' },
    { id: 'confronto', q: 'Il verbale dice che lei ignorava. Nino scrive che lei lo vide.', tone: 'sincera', needContra: 'x_sapeva', gives: ['verita'], a: 'Resta zitto a lungo. «L\'ho visto, sì. La botola, i sette, il ragazzo con il sacco. Ho pensato: se li trovano, trovano la mia farina. Ho pensato al forno. Sono andato al Comando prima che ci arrivasse qualcun altro. Ho scelto io chi dovevano prendere.»' },
    { id: 'amico', q: 'Chi pagava l\'affitto alla vedova Ferrante?', tone: 'sincera', needClues: ['affitto'], gives: ['rata'], a: '«Non lo scriva come un merito. Non era carità. Era una rata. Duecentoquaranta, e il conto non è sceso di un soldo.»' },
    { id: 'timbro', q: 'Sa cos\'è questo timbro sulla sua scheda?', tone: 'confusa', needClues: ['timbro'], a: '«Me l\'hanno messo all\'ingresso. Dopo mi sono accorto che non ricordavo più il nome di mia madre. Ce l\'ho qui, sulla punta… No. Non c\'è più.»', fx: { know: ['k_ettore_madre'] } },
    { id: 'attesa', q: 'Che cosa si aspetta da questo Ufficio?', tone: 'sincera', a: '«Che qualcuno faccia i conti al posto mio. Io ci ho provato per vent\'anni e mi è sempre rimasto il resto.»' },
  ],
  contradictions: [
    { id: 'x_sapeva', a: 'denuncia', b: 'sapeva', label: 'Ignorava o sapeva?', note: 'Il verbale dice che Ettore ignorava la destinazione della farina; Nino scrive che Ettore lo vide. Una delle due versioni è falsa.' },
  ],
  motivations: [
    { id: 'm_pane', text: 'Duecento famiglie sfamate valgono più di un verbale.', needClues: ['credito'] },
    { id: 'm_rata', text: 'Ha riconosciuto il debito e lo ha pagato per vent\'anni: il conto è suo, non nostro.', needClues: ['rata'] },
    { id: 'm_scelta', text: 'Ha scelto chi consegnare per salvare se stesso: è questo che va pesato.', needClues: ['verita'] },
  ],
  outcomes: {
    ascension: {
      text: 'Ettore guarda in alto come si guarda un forno troppo caldo. «Lassù si fa il pane?» Nessuno gli risponde. Il montacarichi dell\'Ascensione lo prende senza rumore.',
      consequences: ['Ettore Balducci è asceso. Il suo fascicolo sale ai Livelli Superiori e non è più consultabile.', 'La rata non verrà mai saldata da un\'altra vita.'],
      fx: { flags: ['ettore_asceso'], stats: { reputazione: 1 } },
    },
    renewal: {
      text: '«Di nuovo, allora.» Annuisce come chi riapre bottega. Firma dove gli indichi, con una croce infarinata.',
      consequences: ['Ettore Balducci è avviato al Rinnovo.', 'Porterà con sé un\'inquietudine verso i debiti non scritti.'],
      reinc: { returnIn: 9, note: 'predisposizione a tenere conti minuziosi; disagio davanti alle divise' },
    },
    trial: {
      text: '«Giusto» dice, prima ancora che tu finisca di leggere. Sembra quasi sollevato. «Che sia uno a cui tocca scegliere, stavolta. Voglio vedere se sono capace.»',
      consequences: ['Ettore Balducci è destinato alla Prova: rinascerà dove la sua paura verrà messa alla porta.', 'Il legame con Nino Ferrante resta aperto a registro.'],
      reinc: { returnIn: 9, note: 'Prova: una vita in cui qualcuno dipenderà dal suo silenzio' },
    },
    otherForm: {
      text: 'Non capisce subito. Poi chiede soltanto: «Una cosa che sta al caldo?» Timbri l\'Altra Forma. Le sue mani smettono per prime di essere mani.',
      consequences: ['Ettore Balducci lascia la forma umana.', 'Nessun conto può essere pareggiato da ciò che non sa contare.'],
      reinc: { form: 'un gatto di forno, di quelli che dormono sui sacchi', returnIn: 12 },
    },
    waitingRoom: {
      text: '«Aspettare cosa?» Glielo spieghi con le parole del regolamento. Si siede sulla panca indicata, il berretto invisibile sulle ginocchia, come in una sala di municipio.',
      consequences: ['Ettore Balducci è trattenuto in Sala d\'Attesa a tempo indeterminato.', 'La pratica resta pendente.'],
      fx: { stats: { pendenti: 1 } },
    },
  },
  truth: [
    'Ettore sfamò il quartiere a credito durante la Serrata senza mai riscuotere.',
    'Ettore sapeva che Nino portava la farina a sette persone nascoste.',
    'Denunciò Nino per paura che il Comando risalisse a lui e al forno.',
    'Pagò in segreto per vent\'anni l\'affitto della madre di Nino, considerandolo un debito.',
    'All\'ingresso gli è stato applicato un prelievo straordinario di Residuo (timbro a spirale): ha perso il nome della madre.',
  ],
  truthClue: 'verita',
  residuo: 'il nome della madre; il peso esatto di una pagnotta ben riuscita',
};

export const C02: CaseDef = {
  id: 'c02',
  title: 'La levatrice di Sorgiva',
  type: 'ordinario',
  soulId: 'S-AGNESE',
  incarnation: {
    name: 'Agnese Morvillo', ageAtDeath: 64, origin: 'Valle di Sorgiva', era: 'secolo delle ciminiere',
    occupation: 'levatrice', cause: 'asfissia nell\'incendio della propria casa',
    traits: T(8, 6, 3, 7, 6, 4),
    bio: 'Quarant\'anni di parti nella valle, dal palazzo dei Corvin alle baracche della lavanderia. Nubile. Viveva in una casa di pietra con orto, troppo buona per una levatrice.',
    relations: [
      { name: 'Rosa Tadini', role: 'lavandaia, partoriente', note: 'Partorì due gemelli. Le fu detto che uno solo era vivo.' },
      { name: 'Contessa Elvira Corvin', role: 'partoriente', note: 'Partorì un maschio morto la stessa notte.' },
      { name: 'Conte Aurelio Corvin', role: 'benefattore', note: 'Un anno dopo le intestò la casa con l\'orto.' },
    ],
    events: [
      { age: 24, text: 'Prende il diploma di levatrice condotta.' },
      { age: 31, text: 'Notte della piena: assiste due parti a un\'ora di distanza, a palazzo Corvin e alla lavanderia.' },
      { age: 32, text: 'Riceve in dono dal conte Corvin una casa con orto.' },
      { age: 64, text: 'Muore nell\'incendio di quella casa. Sul tavolo vengono trovate due tazze.' },
    ],
    motivations: ['Che nessun bambino nato tra le sue mani morisse di fame.', 'Non dover mai spiegare la notte della piena.'],
    conflicts: ['Ha deciso lei a chi dovesse appartenere un figlio.', 'Ha accettato una casa per un gesto che chiama misericordia.'],
    memories: ['il fiume in piena sotto il ponte dei Corvin', 'due vagiti identici', 'una tazza che non era la sua'],
  },
  arrival: 'Entra con il passo di chi è abituata a essere chiamata di notte. Ha le maniche rimboccate. Odora di fumo freddo. Prima di sedersi controlla, per abitudine, dove sono l\'acqua e la porta.',
  registration: 'Modulo 1/A — Ingresso ordinario. Allegati quattro documenti. La Consulente dei Colloqui ha annotato a matita: «parla volentieri di tutto tranne che di una notte».',
  summary: 'Quarant\'anni di servizio senza un reclamo. Morta in un incendio classificato accidentale. Un atto di donazione a suo favore non ha causale.',
  recommended: 'ascension',
  recommendedWhy: 'Regolamento, art. 4: vita di servizio documentata, nessuna colpa a registro → Ascensione raccomandata.',
  docs: [
    {
      id: 'servizio', title: 'Stato di servizio della levatrice condotta', kind: 'registro', source: 'Municipio di Sorgiva', reliability: 'attendibile',
      why: 'Il registro municipale è esatto, ma conta solo ciò che fu dichiarato: i nati vivi e i nati morti, non di chi fossero.',
      body: [
        'Parti assistiti: 1.912. Decessi materni: 11. Nessun provvedimento disciplinare.',
        { t: 'Notte della piena: «Palazzo Corvin: un maschio, vivo. Lavanderia, Tadini Rosa: una femmina viva, un maschio nato morto.»', clue: 'registro_notte' },
        'Encomio del sindaco per «instancabile dedizione alle classi meno fortunate».',
      ],
    },
    {
      id: 'donazione', title: 'Atto di donazione Corvin–Morvillo', kind: 'verbale', source: 'Notaio Belmondo', reliability: 'incompleto',
      why: 'Il conte volle un atto senza causale: la casa era gratitudine per un figlio che sapeva non essere suo.',
      body: [
        'Il conte Aurelio Corvin dona alla signorina Morvillo Agnese un fabbricato rurale con orto in località Fontanelle.',
        { t: 'Causale: «per i servigi resi alla Casa». La data è di undici mesi successiva alla notte della piena. Nessun altro dipendente dei Corvin ha mai ricevuto immobili.', clue: 'casa' },
      ],
    },
    {
      id: 'vetturino', title: 'Dichiarazione del vetturino dei Corvin', kind: 'testimonianza', source: 'Servizio Testimonianze — raccolta post mortem', reliability: 'attendibile',
      why: 'Il vetturino vide davvero il fagotto. Non seppe mai cosa conteneva, ma ricordava che piangeva.',
      body: [
        '«Quella notte portai la levatrice dalla lavanderia a palazzo, non il contrario. Lei dice sempre il contrario, ma io i cavalli li conosco: andammo in salita.»',
        { t: '«Aveva un fagotto sotto il mantello. Io ho pensato: biancheria. Poi il fagotto ha pianto. A palazzo il signorino era nato muto, dicevano le cameriere. Quando ripartimmo, il fagotto non c\'era più e a palazzo piangevano di gioia.»', clue: 'fagotto' },
      ],
    },
    {
      id: 'incendio', title: 'Rapporto dei pompieri di Sorgiva', kind: 'rapporto', source: 'Corpo dei Pompieri volontari', reliability: 'incompleto',
      why: 'I pompieri annotarono ciò che videro. Nessuno cercò la seconda persona: Sabina Tadini era fuggita dall\'orto, ustionata.',
      body: [
        'Incendio originato da un lume a petrolio rovesciato in cucina. Classificazione: accidentale.',
        { t: 'Sul tavolo, parzialmente combuste: due tazze, due cucchiaini. La porta sull\'orto è stata trovata spalancata.', clue: 'tazze' },
        'La vittima è stata rinvenuta presso l\'uscio principale, chiuso a chiave dall\'interno. Non ha tentato di uscire dall\'orto.',
      ],
    },
  ],
  clues: [
    { id: 'registro_notte', label: 'Registro: ai Corvin un vivo, a Rosa un nato morto', text: 'Lo stato di servizio attribuisce il maschio vivo ai Corvin e un maschio nato morto a Rosa Tadini.', status: 'documento' },
    { id: 'casa', label: 'Una casa in dono, senza causale', text: 'Undici mesi dopo la notte della piena, il conte Corvin intesta ad Agnese una casa con orto.', status: 'documento' },
    { id: 'fagotto', label: 'Il fagotto che piangeva', text: 'Il vetturino portò Agnese dalla lavanderia al palazzo con un fagotto che piangeva. Al ritorno il fagotto non c\'era.', status: 'testimonianza' },
    { id: 'tazze', label: 'Due tazze sul tavolo', text: 'La notte dell\'incendio qualcuno era con Agnese. La porta sull\'orto era spalancata.', status: 'documento', know: ['k_due_tazze'] },
    { id: 'sola', label: 'Agnese: «Ero sola»', text: 'Agnese dichiara che la sera dell\'incendio non c\'era nessuno con lei.', status: 'testimonianza' },
    { id: 'verita', label: 'Scambiò il gemello vivo con il nato morto', text: 'Agnese ammette: portò ai Corvin il gemello maschio di Rosa Tadini e disse a Rosa che era nato morto.', status: 'verificato', know: ['k_gemelli_sorgiva'] },
    { id: 'visita', label: 'Protegge chi era con lei', text: 'Agnese ammette che qualcuno venne a chiederle conto. Rifiuta di dirne il nome: «ha già avuto metà di tutto».', status: 'verificato' },
  ],
  topics: [
    { id: 'mestiere', q: 'Quarant\'anni di parti. Cosa ha imparato?', tone: 'sincera', a: '«Che nascono tutti allo stesso modo e che dopo dieci minuti non è già più vero. Dipende da che letto è.»' },
    { id: 'notte', q: 'La notte della piena.', tone: 'menzogna', a: '«Due parti. Prima il palazzo, poi la lavanderia. Alla Tadini andò male per metà, capita. Ho compilato il registro la mattina dopo, è tutto lì.»', gives: [] },
    { id: 'casa', q: 'Il conte le ha regalato una casa.', tone: 'evasiva', needClues: ['casa'], a: '«I signori sono fatti così, quando sono contenti. Io non ho chiesto niente.» Una pausa. «Non ho chiesto niente» ripete, più piano, ed è diverso.' },
    { id: 'confronto', q: 'Il vetturino dice che andaste in salita. Con un fagotto che piangeva.', tone: 'sincera', needContra: 'x_fagotto', gives: ['verita'], a: 'Chiude gli occhi. «La Rosa ne aveva già seppelliti due, di fame. Quella notte ne fece due vivi e svenne. Su al palazzo la contessa stringeva una cosa blu e il conte aveva già il fucile sul tavolo, per sé o per lei non so. Ho fatto il conto che fanno le levatrici: quanti ne salvo. Il conto tornava. Torna ancora. È solo che non era mio da fare.»' },
    { id: 'sola', q: 'La sera dell\'incendio era sola in casa?', tone: 'menzogna', gives: ['sola'], a: '«Sola. Chi vuole che venga a trovare una vecchia levatrice.»' },
    { id: 'tazze', q: 'I pompieri hanno trovato due tazze.', tone: 'sincera', needContra: 'x_tazze', gives: ['visita'], a: '«Allora scriva che ne ho usate due.» Ti guarda dritto. «Qualcuno è venuto a chiedermi conto, sì. Aveva ragione. Il lume è caduto, e io ho chiuso l\'uscio davanti perché uscisse dall\'orto e nessuno la vedesse. Il nome non glielo do. Ha già avuto metà di tutto, nella vita. Non le tolgo anche questo.»' },
    { id: 'rosa', q: 'Che ne è stato di Rosa Tadini?', tone: 'sincera', needClues: ['verita'], a: '«È morta credendo di averne perso uno. Le ho tenuto la mano. Sono stata brava anche in quello.»' },
  ],
  contradictions: [
    { id: 'x_fagotto', a: 'registro_notte', b: 'fagotto', label: 'Chi nacque vivo, e dove?', note: 'Il registro dice che il maschio vivo nacque a palazzo. Il vetturino portò a palazzo un fagotto che piangeva.' },
    { id: 'x_tazze', a: 'tazze', b: 'sola', label: 'Sola, con due tazze', note: 'Agnese dichiara di essere stata sola. Il rapporto elenca due tazze e una porta spalancata.' },
  ],
  motivations: [
    { id: 'm_servizio', text: 'Millenovecento nati vivi: il servizio reso prevale.', needClues: [] },
    { id: 'm_conto', text: 'Ha salvato un bambino dalla fame decidendo al posto della madre: va pesato come arbitrio.', needClues: ['verita'] },
    { id: 'm_uscio', text: 'Il suo ultimo atto è stato proteggere chi la accusava.', needClues: ['visita'] },
  ],
  outcomes: {
    ascension: {
      text: 'Si alza, si liscia il grembiule. «Così in alto non ho mai lavorato.» Sulla soglia del montacarichi si volta: «Se passa di qui una che cerca la sua metà, non le dica dove sono».',
      consequences: ['Agnese Morvillo è ascesa, come da raccomandazione.', 'La verità sulla notte della piena sale con lei, fuori registro.'],
      fx: { flags: ['agnese_ascesa'], stats: { reputazione: 2 } },
    },
    renewal: {
      text: '«Ricomincio da capo, dunque. Speriamo in mani meno svelte.» Firma senza leggere.',
      consequences: ['Agnese Morvillo è avviata al Rinnovo.', 'Erediterà mani sicure e un disagio inspiegabile davanti ai gemelli.'],
      reinc: { returnIn: 10, note: 'talento per la cura; diffidenza verso i propri conti' },
    },
    trial: {
      text: 'Annuisce lentamente. «Mi farete madre, immagino. Di quelle a cui portano via.» Non c\'è protesta nella voce. C\'è una specie di curiosità professionale.',
      consequences: ['Agnese Morvillo è destinata alla Prova.', 'La sua prossima vita conoscerà la parte di Rosa Tadini.'],
      reinc: { returnIn: 10, note: 'Prova: una vita in cui altri decideranno per lei ciò che è suo' },
    },
    otherForm: {
      text: '«Una bestia?» Sorride per la prima volta. «Le bestie i figli se li tengono. Va bene.»',
      consequences: ['Agnese Morvillo lascia la forma umana.', 'Nessuno saprà più chi piangeva nel fagotto, tranne te.'],
      reinc: { form: 'una cagna da pastore, feroce solo vicino alla cucciolata', returnIn: 12 },
    },
    waitingRoom: {
      text: '«Aspetto volentieri. Ho una persona da aspettare.» Si accomoda sulla panca vicino alla porta, dove si vede chi entra.',
      consequences: ['Agnese Morvillo è trattenuta in Sala d\'Attesa.', 'Ha chiesto il posto vicino all\'ingresso.'],
      fx: { flags: ['agnese_attesa'], stats: { pendenti: 1 } },
    },
  },
  truth: [
    'La notte della piena Rosa Tadini partorì due gemelli vivi; la contessa Corvin un maschio morto.',
    'Agnese portò il gemello maschio ai Corvin e registrò a Rosa un nato morto.',
    'La casa donata dal conte fu la ricompensa, mai chiesta ma accettata.',
    'La sera dell\'incendio la gemella, Sabina Tadini, venne a chiederle conto; il lume cadde durante la lite.',
    'Agnese chiuse l\'uscio principale e morì per lasciare che Sabina fuggisse dall\'orto senza essere vista.',
  ],
  truthClue: 'verita',
  residuo: 'il numero esatto dei nati tra le sue mani; il viso di Rosa Tadini da giovane',
};

export const C03: CaseDef = {
  id: 'c03',
  title: 'Il soldato che non sparò',
  type: 'morte_sospetta',
  soulId: 'S-LORENZ',
  incarnation: {
    name: 'Lorenz Hable', ageAtDeath: 23, origin: 'Altopiano di Kessel', era: 'secolo delle ciminiere',
    occupation: 'fuciliere, III compagnia', cause: 'colpo d\'arma da fuoco alla schiena',
    traits: T(7, 5, 6, 8, 6, 2),
    bio: 'Figlio unico di una sarta vedova. Apprendista tipografo prima della leva. Sul foglio matricolare risulta «disertore, caduto in fuga davanti al nemico».',
    relations: [
      { name: 'Hanne Hable', role: 'madre', note: 'Riceve una pensione «per caduto con onore» che il foglio matricolare non giustifica.' },
      { name: 'Serg. Dragan Vos', role: 'superiore', note: 'Ha firmato il rapporto sulla notte di Kessel.' },
      { name: 'Cap. Idris Molnar', role: 'commilitone', note: 'Era di sentinella alla cascina.' },
    ],
    events: [
      { age: 17, text: 'Entra come apprendista alla tipografia Reuss.' },
      { age: 21, text: 'Chiamato alle armi, assegnato alla III compagnia.' },
      { age: 23, text: 'Notte di Kessel: la compagnia riceve l\'ordine di incendiare una cascina.' },
      { age: 23, text: 'Muore la stessa notte. Il rapporto dice: disertore.' },
    ],
    motivations: ['Tornare alla tipografia.', 'Non diventare ciò che gli veniva ordinato.'],
    conflicts: ['Ha disobbedito, e non ha salvato nessuno.'],
    memories: ['l\'odore dell\'inchiostro da stampa', 'nove voci dietro una porta sprangata', 'una mano che lo conosce, dall\'altra parte di una scrivania'],
  },
  pastLives: ['Tre giudizi precedenti a registro. L\'ultimo reca la sigla dello scrivano: «{iniziali} — Scriv. 7».'],
  arrival: 'È giovane, ha ancora il cappotto militare e un foro bruciato tra le scapole che non sanguina. Si ferma a metà della sala. Ti guarda come si guarda qualcuno alla stazione. «Ah» dice. «È ancora lei.»',
  registration: 'Modulo 1/C — Morte violenta, classificazione contestata. In coda alla scheda, la casella «Giudizi precedenti» riporta tre righe. La terza è siglata con le tue iniziali, in una calligrafia che conosci.',
  summary: 'Classificato disertore dal proprio comando. Colpito alla schiena. La madre percepisce una pensione d\'onore incompatibile con la classificazione.',
  recommended: 'trial',
  recommendedWhy: 'Regolamento, art. 19: diserzione davanti al nemico, atto documentato → La Prova.',
  docs: [
    {
      id: 'rapporto', title: 'Rapporto del serg. Vos sulla notte di Kessel', kind: 'rapporto', source: 'Comando III compagnia', reliability: 'menzognero',
      why: 'Vos scrisse il rapporto per coprire l\'ordine sulla cascina e il proprio colpo. Classificare Lorenz disertore rendeva tutto regolare.',
      body: [
        '«Alle ore 2 circa il fuciliere Hable abbandonava l\'arma e si dava alla fuga in direzione delle linee nemiche.»',
        { t: '«Veniva colpito da fuoco nemico durante la fuga. La compagnia proseguiva l\'azione sulla cascina, trovata deserta, e ne completava la distruzione.»', clue: 'rapporto_fuga' },
        'Firmato: serg. D. Vos. Vistato dal comando senza osservazioni.',
      ],
    },
    {
      id: 'referto', title: 'Referto dell\'infermiere di compagnia', kind: 'referto', source: 'Posto di medicazione', reliability: 'attendibile',
      why: 'L\'infermiere descrisse ciò che vide. Non gli fu mai chiesto di confrontarlo con il rapporto.',
      body: [
        'Ferita d\'ingresso tra le scapole, foro netto, alone di polvere combusta sul panno del cappotto.',
        { t: '«Colpo esploso a non più di tre passi, da arma corta d\'ordinanza. Le linee nemiche distavano oltre quattrocento metri.»', clue: 'tre_passi' },
        'Il corpo è stato rinvenuto a dodici passi dalla porta della cascina, rivolto verso di essa.',
      ],
    },
    {
      id: 'molnar', title: 'Dichiarazione del cap. Molnar (resa in punto di morte)', kind: 'testimonianza', source: 'Servizio Testimonianze', reliability: 'attendibile',
      why: 'Molnar tacque per tutta la vita e parlò solo morendo. Non aveva più nulla da proteggere.',
      body: [
        '«La cascina non era deserta. Li avevamo contati entrare al tramonto: nove. Una porta sprangata da fuori, con la nostra stanga.»',
        { t: '«Il sergente diede la torcia a Hable. Hable la posò per terra e disse soltanto: no. Poi andò verso la porta, per aprirla. Il sergente gli sparò con la pistola. Dopo, la torcia la prese lui.»', clue: 'molnar_no' },
      ],
    },
    {
      id: 'pensione', title: 'Libretto di pensione di Hanne Hable', kind: 'registro', source: 'Cassa Militare', reliability: 'falsificato',
      why: 'Vos, anni dopo e divenuto influente, fece riclassificare la pratica della madre come «caduto con onore» senza toccare il foglio matricolare. Un rimorso amministrativo.',
      body: [
        'Pensione di guerra, categoria «caduto con onore». Decorrenza: quattro anni dopo il decesso.',
        { t: 'Domanda presentata non dalla madre ma da un «comm. D. Vos, presidente dell\'Opera Orfani di Guerra». Il foglio matricolare non è mai stato corretto.', clue: 'pensione_vos' },
      ],
    },
    {
      id: 'precedenti', title: 'Estratto dei giudizi precedenti', kind: 'registro', source: 'Archivio — Indice delle Reincarnazioni', reliability: 'contraddittorio',
      why: 'L\'estratto è autentico: lo scrivano della scrivania 7 era davvero la stessa persona che lo legge ora, in un\'assunzione precedente.',
      body: [
        'I. Giudicato: Rinnovo. Scrivano: illeggibile.',
        'II. Giudicato: Rinnovo. Scrivano: O. H.',
        { t: 'III. Giudicato: La Prova, «da scontarsi in luogo di guerra». Scrivano: {iniziali}, scrivania 7. La data precede di undici anni la tua assunzione.', clue: 'sigla' },
      ],
    },
  ],
  clues: [
    { id: 'rapporto_fuga', label: 'Rapporto: fuga, fuoco nemico, cascina deserta', text: 'Secondo il serg. Vos, Lorenz fu colpito dal nemico mentre disertava e la cascina era vuota.', status: 'documento' },
    { id: 'tre_passi', label: 'Colpo a tre passi, arma d\'ordinanza', text: 'Il referto descrive un colpo ravvicinato alla schiena, da pistola d\'ordinanza. Il corpo era rivolto verso la cascina.', status: 'documento' },
    { id: 'molnar_no', label: 'Molnar: nove nella cascina, Lorenz disse no', text: 'Il caporale Molnar dichiara che nella cascina c\'erano nove persone e che Vos sparò a Lorenz quando rifiutò la torcia.', status: 'testimonianza' },
    { id: 'pensione_vos', label: 'La pensione d\'onore chiesta da Vos', text: 'Fu Dragan Vos, anni dopo, a far ottenere alla madre di Lorenz una pensione «per caduto con onore».', status: 'documento', know: ['k_vos_pensione'] },
    { id: 'sigla', label: 'Le tue iniziali su un giudizio di undici anni fa', text: 'Il terzo giudizio precedente di Lorenz è siglato con le tue iniziali, scrivania 7, undici anni prima della tua assunzione.', status: 'documento', know: ['k_sigla_precedente', 'k_scrivania7'] },
    { id: 'verita', label: 'Fu ucciso da Vos per aver rifiutato l\'ordine', text: 'Lorenz non disertò: rifiutò di bruciare una cascina con nove persone dentro e fu ucciso alle spalle dal suo sergente.', status: 'verificato', know: ['k_kessel'] },
    { id: 'riconosce', label: '«L\'altra volta ha detto che sarebbe andata diversamente»', text: 'Lorenz sostiene di averti già incontrato a questa scrivania, in un giudizio precedente.', status: 'testimonianza', know: ['k_lorenz_riconosce'] },
    { id: 'sequenza', label: 'La notte di Kessel, in ordine', text: 'Ricostruzione verificata: i nove entrano al tramonto; la porta viene sprangata; l\'ordine; il rifiuto; lo sparo; l\'incendio.', status: 'verificato' },
  ],
  topics: [
    { id: 'ancora', q: '«Ancora lei»? Noi non ci conosciamo.', tone: 'sincera', gives: ['riconosce'], a: '«Lei no. Io sì. La scrivania era quella vicino alla colonna, la sette. Mi ha dato la Prova e ha detto: “Stavolta andrà diversamente, glielo prometto”. È andata così.» Si tocca la schiena senza astio. «Non ce l\'ho con lei. Volevo solo dirle che me la ricordo.»' },
    { id: 'kessel', q: 'Cosa accadde alla cascina di Kessel?', tone: 'evasiva', a: '«C\'è il rapporto. Dice che sono scappato. Se lo scrivo io diverso, è la parola di un morto contro quella di un sergente.»' },
    { id: 'confronto', q: 'Il rapporto dice fuoco nemico. Il referto dice tre passi, arma d\'ordinanza.', tone: 'sincera', needContra: 'x_colpo', gives: ['verita'], a: '«Tre passi, sì. Lo sentivo respirare.» Parla piano. «Ho posato la torcia. Ho pensato: apro la porta e poi succeda quel che deve. Non ci sono arrivato. Dodici passi. Li ho contati dopo, da qui. Dentro cantavano per far stare zitti i bambini. Quello non me l\'ha tolto nessuno, da nessun modulo.»' },
    { id: 'vos', q: 'Che uomo era il sergente Vos?', tone: 'sincera', a: '«Uno che aveva sempre freddo. Divideva il tabacco. Quella notte gli tremava la mano e ha sparato lo stesso. Credo sia peggio, no? Se non ti trema è più facile.»' },
    { id: 'madre', q: 'Sua madre riceve una pensione d\'onore.', tone: 'confusa', needClues: ['pensione_vos'], a: '«Mia madre?» Per la prima volta sembra un ragazzo. «Chi gliel\'ha…» Legge il nome. Resta in silenzio. «Allora lo sa anche lui, cos\'ha fatto.»' },
    { id: 'promessa', q: 'Che cosa si aspetta da me, questa volta?', tone: 'sincera', needClues: ['riconosce'], a: '«Niente. È questo il bello. L\'altra volta mi aspettavo qualcosa.» Sorride appena. «Però se trova il modo di ricordarsi di me, la prossima, mi farebbe piacere. È brutto essere l\'unico dei due che ricorda.»' },
  ],
  contradictions: [
    { id: 'x_colpo', a: 'rapporto_fuga', b: 'tre_passi', label: 'Fuoco nemico o colpo a tre passi?', note: 'Il rapporto attribuisce la morte al fuoco nemico durante la fuga. Il referto descrive un colpo ravvicinato d\'ordinanza, con il corpo rivolto alla cascina.' },
    { id: 'x_deserta', a: 'rapporto_fuga', b: 'molnar_no', label: 'Cascina deserta o nove persone?', note: 'Il rapporto dice che la cascina era deserta. Molnar ne contò nove entrare.' },
  ],
  motivations: [
    { id: 'm_atto', text: 'La diserzione è atto documentato: si applica l\'art. 19.', needClues: ['rapporto_fuga'], dest: ['trial'] },
    { id: 'm_rifiuto', text: 'Non disertò: rifiutò un ordine atroce e fu ucciso per questo.', needClues: ['verita'] },
    { id: 'm_debito', text: 'Questo Ufficio gli deve una promessa non mantenuta.', needClues: ['riconosce'] },
  ],
  outcomes: {
    ascension: {
      text: '«In alto?» Guarda il montacarichi. «Non credo di aver finito, ma se lo dice lei.» Prima che le porte si chiudano, alza due dita alla tempia: un saluto da tipografo, non da soldato.',
      consequences: ['Lorenz Hable è asceso, in difformità dalla raccomandazione.', 'Non tornerà a questo sportello. La promessa non potrà più essere né mantenuta né infranta.'],
      fx: { flags: ['lorenz_asceso'] },
    },
    renewal: {
      text: 'Firma con attenzione, controllando l\'interlinea come un tipografo. «Senza guerra, questa volta?» Non puoi prometterlo. Non lo prometti.',
      consequences: ['Lorenz Hable è avviato al Rinnovo.', 'Porterà con sé il rifiuto degli ordini gridati e un fastidio per l\'odore di petrolio.'],
      fx: { flags: ['lorenz_rinnovo'] },
      reinc: { noReturn: true, note: 'tornerà nel Capitolo III' },
    },
    trial: {
      text: '«Di nuovo la Prova.» Non è sorpreso. «Lo sa che cosa dimostra, vero? Che ho detto no. L\'ho già dimostrato.» Timbri. Il timbro fa lo stesso rumore dell\'altra volta: lo sai senza ricordarlo.',
      consequences: ['Lorenz Hable è destinato alla Prova, come da raccomandazione.', 'Il rapporto del serg. Vos resta la versione ufficiale.'],
      fx: { flags: ['lorenz_prova'] },
      reinc: { noReturn: true, note: 'tornerà nel Capitolo III' },
    },
    otherForm: {
      text: '«Qualcosa che non capisce gli ordini» dice. «Non è una cattiva idea.» Il cappotto militare resta sulla sedia, vuoto, con il foro tra le scapole.',
      consequences: ['Lorenz Hable lascia la forma umana.', 'Il cappotto è stato consegnato all\'Archivio come effetto non reclamato.'],
      fx: { flags: ['lorenz_forma'] },
      reinc: { noReturn: true, form: 'un cane di caserma', note: 'tornerà nel Capitolo III' },
    },
    waitingRoom: {
      text: '«Aspetto. Ho aspettato dodici passi, posso aspettare ancora.» Va verso la Sala d\'Attesa senza che nessuno lo accompagni. Conosce la strada.',
      consequences: ['Lorenz Hable è trattenuto in Sala d\'Attesa.', 'Conosceva la strada per la Sala d\'Attesa.'],
      fx: { flags: ['lorenz_attesa'], stats: { pendenti: 1 } },
    },
  },
  specials: [
    {
      id: 'rettifica', label: 'Rettifica del foglio matricolare', desc: 'Sentenza speciale: Rinnovo con annullamento della classificazione «disertore» e rinvio degli atti contro Dragan Vos.',
      needClues: ['verita'], dest: 'renewal',
      outcome: {
        text: 'Cancelli «disertore» con due righe e sigli. Lorenz guarda la penna. «Questo non l\'aveva fatto, l\'altra volta.» Firma. «Diversamente» dice piano, come una parola nuova.',
        consequences: ['Lorenz Hable è avviato al Rinnovo con foglio rettificato.', 'Gli atti sulla notte di Kessel sono rinviati: quando Dragan Vos arriverà, il suo fascicolo conterrà già la verità.'],
        irregular: 'Rettifica di atto militare senza nulla osta della Direzione.',
        fx: { flags: ['lorenz_rinnovo', 'kessel_rettificato'], rel: { bones: 1 } },
        reinc: { noReturn: true, note: 'tornerà nel Capitolo III' },
      },
    },
  ],
  puzzles: [
    {
      id: 'notte', kind: 'ordine', title: 'La notte di Kessel',
      intro: 'Rapporto, referto e testimonianza raccontano la stessa notte in ordine sparso. Disponi i fatti nella sequenza in cui accaddero.',
      needClues: ['molnar_no', 'tre_passi'],
      items: [
        { id: 'd', text: 'Hable posa la torcia per terra e va verso la porta.' },
        { id: 'a', text: 'Al tramonto, nove persone vengono contate entrare nella cascina.' },
        { id: 'f', text: 'La cascina brucia.' },
        { id: 'c', text: 'Il sergente consegna la torcia a Hable.' },
        { id: 'b', text: 'La porta viene sprangata dall\'esterno con la stanga della compagnia.' },
        { id: 'e', text: 'Un colpo d\'ordinanza, a tre passi, alla schiena.' },
      ],
      solution: 'a,b,c,d,e,f',
      gives: ['sequenza'],
      success: 'La sequenza regge: ogni fatto rende possibile il successivo. Il rapporto del sergente non trova posto in nessun punto.',
      failure: 'Così non regge: un fatto dovrebbe accadere prima di ciò che lo rende possibile. Rileggi il referto e la dichiarazione di Molnar.',
    },
  ],
  truth: [
    'La cascina di Kessel conteneva nove civili, chiusi dentro dalla compagnia.',
    'Lorenz rifiutò di appiccare il fuoco e andò ad aprire la porta.',
    'Il serg. Vos gli sparò alla schiena con la pistola d\'ordinanza e scrisse un rapporto falso di diserzione.',
    'Anni dopo Vos fece ottenere alla madre una pensione d\'onore senza correggere il rapporto.',
    'Il precedente giudizio di Lorenz (La Prova) fu emesso dallo stesso scrivano che lo esamina ora, in un\'assunzione precedente.',
  ],
  truthClue: 'verita',
  residuo: 'il motivo che cantavano nella cascina; il viso di chi lo giudicò la volta precedente',
};
