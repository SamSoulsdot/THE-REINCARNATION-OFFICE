// Template dei casi procedurali. Ogni template definisce una DINAMICA (non un nome):
// una versione ufficiale, una testimonianza che la complica e due verità canoniche alternative.
// La variante scelta dal seed decide quale documento è inattendibile, e perché.
// Segnaposto: {nome} {cognome} {altro} {teste} {luogo} · {o} desinenza di genere dell'anima.
import type { Destination } from '../../engine/types';

export interface TemplateVariant {
  truth: string;
  flawed: 'ufficiale' | 'teste';
  why: string;
  tone: 'menzogna' | 'evasiva';
  confess: string;
  weigh: string;
}

export interface CaseTemplate {
  id: string;
  title: string;
  occ: string; // "maschile/femminile"
  age: [number, number];
  causes: string[];
  tags: string[];
  rel: { role: string; note: string };
  wit: string; // ruolo del teste
  official: { title: string; source: string; text: string };
  witness: string;
  claim: string;
  recommended: Destination;
  rule: string;
  conflict: string;
  memory: string;
  variants: [TemplateVariant, TemplateVariant];
}

export const TEMPLATES: CaseTemplate[] = [
  {
    id: 't01', title: 'L\'ammanco di cassa', occ: 'cassiere di banca/cassiera di banca', age: [38, 64], causes: ['un colpo apoplettico allo sportello', 'febbre polmonare'], tags: ['lavoro', 'colpa', 'famiglia'],
    rel: { role: 'direttore di filiale', note: 'Firmò la denuncia per l\'ammanco.' }, wit: 'coniuge',
    official: { title: 'Verbale ispettivo sull\'ammanco', source: 'Banca Agricola di {luogo}', text: 'Dalla cassa affidata a {nome} {cognome} risultano mancanti undicimila lire. L\'interessat{o} ha firmato una piena confessione e scontato quattro anni.' },
    witness: '«Undicimila lire? In casa nostra non è mai entrato un soldo in più. Abbiamo mangiato polenta anche in quegli anni. Però, dopo la condanna, qualcuno ci ha pagato l\'affitto finché è tornat{o}.»',
    claim: '«Ho firmato la confessione. È agli atti. Non ho altro da aggiungere.»',
    recommended: 'trial', rule: 'Art. 21: appropriazione confessata → La Prova.', conflict: 'una firma messa sotto una colpa', memory: 'il rumore della cassaforte che si chiude',
    variants: [
      { truth: '{nome} sottrasse davvero il denaro, a piccole somme, per pagare le cure di una sorella di cui il coniuge non sapeva nulla.', flawed: 'teste', why: 'Il coniuge dice il vero su ciò che vide: il denaro non entrò mai in casa. Ignora la sorella e il sanatorio.', tone: 'evasiva', confess: '«Li ho presi io. Non per noi: per mia sorella, al sanatorio. A casa non l\'ho mai detto: l\'avevano cacciata, per loro era già morta. L\'affitto? Quello non so chi l\'abbia pagato. Forse qualcuno che sapeva.»', weigh: 'Rubò per curare qualcuno che tutti avevano abbandonato.' },
      { truth: 'L\'ammanco era di {altro}, il direttore. {nome} firmò la confessione in cambio del mantenimento della famiglia durante la detenzione.', flawed: 'ufficiale', why: 'Il verbale si fonda su una confessione comprata: il direttore pagò l\'affitto alla famiglia perché {nome} tacesse.', tone: 'menzogna', confess: '«Non ho preso una lira. Il direttore giocava. Mi disse: tu hai quattro bocche, io ho un nome. Ha mantenuto la parola: l\'affitto è arrivato ogni mese. Ho venduto quattro anni. Erano miei, potevo.»', weigh: 'Si addossò una colpa altrui per sfamare i suoi: vendette la propria innocenza.' },
    ],
  },
  {
    id: 't02', title: 'La ricetta del dottore', occ: 'medico condotto/medichessa condotta', age: [45, 72], causes: ['arresto cardiaco, in ambulatorio', 'vecchiaia'], tags: ['lavoro', 'colpa', 'lutto'],
    rel: { role: 'paziente', note: 'Morì dopo una dose eccessiva di laudano prescritta da {nome}.' }, wit: 'infermiera di {luogo}',
    official: { title: 'Inchiesta dell\'Ordine dei medici', source: 'Ordine provinciale', text: 'La morte di {altro} è attribuita a un errore di dosaggio del dott. {cognome}: dieci volte la dose prescrivibile. Sanzione: ammonimento. Caso chiuso come errore materiale.' },
    witness: '«Un errore? Il dottore non ha mai sbagliato uno zero in trent\'anni. E quella sera ha scritto la ricetta lentamente, e me l\'ha fatta rileggere ad alta voce.»',
    claim: '«L\'Ordine ha parlato di errore materiale. Ero stanc{o}. Capita.»',
    recommended: 'renewal', rule: 'Art. 12: errore professionale già sanzionato in vita → Rinnovo.', conflict: 'una dose scritta con mano ferma', memory: 'una ricetta riletta ad alta voce',
    variants: [
      { truth: 'Non fu un errore: {altro}, in agonia da mesi, chiese a {nome} di morire. {nome} acconsentì e accettò di passare per incompetente.', flawed: 'ufficiale', why: 'L\'Ordine preferì l\'errore all\'omicidio pietoso: uno zero di troppo non richiedeva un processo.', tone: 'menzogna', confess: '«Me l\'ha chiesto per undici sere. La dodicesima ho detto sì. Ho fatto rileggere la ricetta perché non restasse un dubbio: lo sapevo, cosa scrivevo. L\'Ordine mi ha fatto il favore di darmi dell\'asino.»', weigh: 'Diede la morte a chi la chiedeva, e ne portò il peso da solo.' },
      { truth: 'Fu davvero un errore: {nome} aveva cominciato a perdere la vista e lo nascondeva. Fece rileggere la ricetta proprio perché non riusciva più a controllarla.', flawed: 'teste', why: 'L\'infermiera interpreta come intenzione ciò che era paura: {nome} non vedeva più le cifre.', tone: 'evasiva', confess: '«Non ci vedevo più. Da un anno. Facevo rileggere tutto, e quella sera lei ha letto “dieci” e io ho sentito “uno”. Non ho detto a nessuno degli occhi: un medico cieco non lo vuole nessuno, e a {luogo} c\'ero solo io.»', weigh: 'Nascose una menomazione per orgoglio e per necessità, e qualcuno ne morì.' },
    ],
  },
  {
    id: 't03', title: 'L\'allievo cancellato', occ: 'maestro elementare/maestra elementare', age: [40, 75], causes: ['bronchite invernale', 'vecchiaia'], tags: ['lavoro', 'guerra', 'colpa'],
    rel: { role: 'ex allievo', note: 'Cancellato dal registro di classe durante l\'Occupazione.' }, wit: 'bidello della scuola',
    official: { title: 'Registro di classe, anno dell\'Occupazione', source: 'Scuola comunale di {luogo}', text: 'Alla data del 3 marzo, il nome di {altro} è cancellato con una riga. Annotazione di {nome} {cognome}: «Trasferito. Famiglia non più reperibile». Nessun nulla osta di trasferimento risulta emesso.' },
    witness: '«Trasferito un corno. Il giorno dopo sono venuti quelli del Comando con l\'elenco della classe in mano. Chi gliel\'ha dato, l\'elenco? Lo teneva solo {nome}.»',
    claim: '«La famiglia si era trasferita. Ho aggiornato il registro come prevede il regolamento scolastico.»',
    recommended: 'trial', rule: 'Art. 19: delazione in tempo d\'occupazione → La Prova.', conflict: 'un nome cancellato con una riga', memory: 'un banco vuoto in terza fila',
    variants: [
      { truth: '{nome} cancellò il nome la sera prima della retata proprio perché l\'elenco consegnato al Comando non lo contenesse. La famiglia fuggì quella notte.', flawed: 'teste', why: 'Il bidello vide il Comando con l\'elenco e trasse la conclusione sbagliata: l\'elenco era stato requisito, e il nome non c\'era più.', tone: 'evasiva', confess: '«L\'elenco me l\'hanno preso, non l\'ho dato. Ma la sera prima avevo cancellato il bambino e avvertito il padre. Ho scritto “trasferito” perché un registro non ammette “nascosto”. Gli altri nomi… gli altri non ho fatto in tempo.»', weigh: 'Salvò un allievo falsificando un registro; non riuscì a salvare gli altri.' },
      { truth: '{nome} consegnò l\'elenco al Comando in cambio della conferma in ruolo. Cancellò il nome dopo, per non dover vedere il banco vuoto a registro.', flawed: 'ufficiale', why: 'L\'annotazione «trasferito» fu scritta a posteriori per coprire la delazione.', tone: 'menzogna', confess: '«Mi avevano detto: o l\'elenco o la cattedra. Avevo tre figli. Ho dato l\'elenco. Poi ho tirato una riga, perché tutte le mattine facevo l\'appello e a quel nome non rispondeva nessuno.»', weigh: 'Consegnò un bambino per conservare il posto.' },
    ],
  },
  {
    id: 't04', title: 'Il faro spento', occ: 'guardiano del faro/guardiana del faro', age: [35, 70], causes: ['annegamento', 'caduta dalla scala del faro'], tags: ['lavoro', 'colpa', 'viaggio'],
    rel: { role: 'capitano del brigantino naufragato', note: 'Morì con undici uomini sugli scogli sotto il faro.' }, wit: 'pescatore di {luogo}',
    official: { title: 'Inchiesta della Capitaneria', source: 'Capitaneria di porto', text: 'La notte del naufragio il faro risultava spento per due ore. Il guardiano {cognome} dichiarò di essersi addormentat{o}. Rimoss{o} dall\'incarico.' },
    witness: '«Addormentat{o}? Io quella notte ero fuori con le reti. La lanterna non era spenta: era coperta. C\'era un telo, lo giuro, si vedeva il chiarore dai bordi. E sugli scogli c\'erano già uomini con i ganci, prima che la nave toccasse.»',
    claim: '«Mi sono addormentat{o}. L\'ho dichiarato alla Capitaneria e lo ripeto.»',
    recommended: 'trial', rule: 'Art. 22: negligenza con esito mortale plurimo → La Prova.', conflict: 'due ore di buio', memory: 'un chiarore dai bordi di un telo',
    variants: [
      { truth: 'I predoni di relitti coprirono la lanterna minacciando la famiglia di {nome}. {nome} non si oppose e poi si addossò la colpa del sonno per non nominarli.', flawed: 'ufficiale', why: 'La Capitaneria accolse la versione del sonno: era più semplice che indagare su mezzo paese.', tone: 'menzogna', confess: '«Sono saliti in quattro. Uno aveva in braccio la mia piccola. Mi hanno detto: stanotte dormi. Ho guardato il telo coprire la lampada. Dodici morti. La bambina è viva. Lo rifarei, ed è questo che non mi perdono.»', weigh: 'Lasciò morire dodici uomini per salvare la propria figlia.' },
      { truth: 'Fu {nome} a coprire la lanterna, d\'accordo con i predoni, per una parte del carico. Gli uomini con i ganci erano i suoi soci.', flawed: 'teste', why: 'Il pescatore dice il vero su tutto ciò che vide; non poteva vedere chi avesse steso il telo.', tone: 'evasiva', confess: '«Il telo l\'ho messo io. Doveva essere un carico di rame senza nessuno a bordo, mi avevano detto: una chiatta al traino. Quando ho sentito gridare era tardi. Ho detto “sonno” perché “avidità” non c\'era, tra le caselle.»', weigh: 'Spense il faro per denaro, credendo che non ci fosse nessuno a bordo.' },
    ],
  },
  {
    id: 't05', title: 'La sentenza del giudice di pace', occ: 'giudice di pace/giudice di pace', age: [50, 80], causes: ['vecchiaia', 'un colpo apoplettico in udienza'], tags: ['lavoro', 'colpa'],
    rel: { role: 'mezzadro', note: 'Perse il podere per una sentenza di {nome}.' }, wit: 'cancelliere',
    official: { title: 'Sentenza nella causa del podere', source: 'Giudicatura di {luogo}', text: 'Il giudice {cognome} assegna il podere conteso al conte, respingendo le ragioni del mezzadro {altro}. Motivazione di sei righe.' },
    witness: '«La sera prima il fattore del conte è venuto in cancelleria con una busta. È uscito senza. Il giudice, quella notte, ha tenuto il lume acceso fino all\'alba, e la sentenza del mattino non era quella che mi aveva dettato il giorno prima.»',
    claim: '«Ho giudicato secondo le carte. Il titolo del conte era più antico.»',
    recommended: 'trial', rule: 'Art. 24: giudizio venduto → La Prova.', conflict: 'una sentenza riscritta di notte', memory: 'una busta sul tavolo della cancelleria',
    variants: [
      { truth: 'Nella busta non c\'era denaro: c\'era una fotografia del figlio di {nome}, studente in città, con un indirizzo. {nome} cambiò la sentenza per paura.', flawed: 'teste', why: 'Il cancelliere vide la busta e pensò al denaro, come avrebbe pensato chiunque.', tone: 'evasiva', confess: '«Una fotografia. Mio figlio che esce dal collegio, presa da lontano. Sul retro, l\'indirizzo e un orario. Ho riscritto la sentenza con la mano che tremava. Non ho preso un soldo. Sarebbe stato più onesto prenderlo.»', weigh: 'Piegò la giustizia sotto minaccia, per proteggere un figlio.' },
      { truth: 'Nella busta c\'era denaro: quanto bastava a saldare i debiti di gioco di {nome}. La sentenza fu venduta.', flawed: 'ufficiale', why: 'La motivazione di sei righe copre una decisione comprata la notte prima.', tone: 'menzogna', confess: '«Quattromila lire. Sapevo esattamente quanto valeva il podere per quell\'uomo: l\'avevo scritto io stesso nella prima sentenza. L\'ho bruciata nel camino e ho scritto l\'altra. Il mezzadro si è impiccato a ottobre.»', weigh: 'Vendette una sentenza, e un uomo si tolse la vita.' },
    ],
  },
  {
    id: 't06', title: 'Il pozzo dei vicini', occ: 'contadino/contadina', age: [30, 78], causes: ['tifo', 'vecchiaia'], tags: ['colpa', 'famiglia'],
    rel: { role: 'vicino di podere', note: 'Perse due figli bevendo dal pozzo conteso.' }, wit: 'parroco',
    official: { title: 'Rapporto dei carabinieri sul pozzo', source: 'Stazione di {luogo}', text: 'Nel pozzo dei {altro} fu rinvenuta una carogna di pecora. I {altro} accusarono {nome} {cognome}, con cui erano in lite per il confine. Nessuna prova. Archiviato.' },
    witness: '«In confessione non posso entrare. Ma posso dire questo: {nome} è venut{o} da me la mattina dopo, prima che si sapesse dei bambini, bianc{o} come un cencio, a chiedere se un peccato fatto per sbaglio pesa come uno fatto apposta.»',
    claim: '«Non ho mai toccato quel pozzo. La pecora ci sarà caduta da sola.»',
    recommended: 'renewal', rule: 'Art. 12: nessun atto accertato → Rinnovo.', conflict: 'acqua che non si poteva più bere', memory: 'una corda di pozzo bagnata',
    variants: [
      { truth: '{nome} gettò la pecora nel pozzo per ripicca, credendo che i vicini attingessero ormai dall\'acquedotto. Non sapeva che i bambini bevevano ancora lì.', flawed: 'ufficiale', why: 'I carabinieri archiviarono per mancanza di prove; la verità era passata solo dal confessionale.', tone: 'menzogna', confess: '«Era già morta, la pecora. L\'ho buttata giù di notte per fargli dispetto: avevano il tubo nuovo, dicevano tutti. I bambini andavano ancora al pozzo perché l\'acqua era più fresca. Due. Li sentivo giocare dal mio cortile.»', weigh: 'Un dispetto tra vicini uccise due bambini.' },
      { truth: 'La pecora cadde da sola. {nome} la vide nel pozzo, la sera, e non avvertì i vicini per rancore. Corse dal parroco quando seppe dei bambini.', flawed: 'teste', why: 'Il parroco riferisce un turbamento reale: ma il peccato non era un gesto, era un silenzio.', tone: 'evasiva', confess: '«Non l\'ho buttata io. L\'ho vista. Galleggiava, al tramonto. Ho pensato: che se la bevano. Potevo gridarlo oltre la siepe. Ci ho messo meno a non farlo.»', weigh: 'Vide il pericolo e tacque per rancore.' },
    ],
  },
  {
    id: 't07', title: 'Lo scambio del capostazione', occ: 'capostazione/capostazione', age: [35, 68], causes: ['investimento da un treno merci', 'arresto cardiaco'], tags: ['lavoro', 'colpa'],
    rel: { role: 'macchinista del merci', note: 'Morì con il fuochista nel deragliamento.' }, wit: 'telegrafista',
    official: { title: 'Inchiesta ferroviaria sul deragliamento', source: 'Direzione Compartimentale', text: 'Il capostazione {cognome} azionò lo scambio errato, instradando il merci sul binario morto. Due vittime. Errore umano. Licenziamento.' },
    witness: '«Errore? Io avevo appena ricevuto il dispaccio: il diretto era in ritardo e veniva giù sullo stesso binario del merci, con i freni andati. Gliel\'ho portato di corsa. {nome} l\'ha letto, ha guardato l\'orologio, ed è andat{o} alla leva camminando.»',
    claim: '«Ho sbagliato leva. Nel buio sono tutte uguali.»',
    recommended: 'trial', rule: 'Art. 22: negligenza con esito mortale → La Prova.', conflict: 'una leva tirata camminando', memory: 'un dispaccio stretto in pugno',
    variants: [
      { truth: '{nome} deviò deliberatamente il merci sul binario morto per sgombrare la linea al diretto senza freni: due uomini al posto di duecento.', flawed: 'ufficiale', why: 'La Direzione preferì l\'errore umano alla verità sui freni del diretto, che erano di sua responsabilità.', tone: 'menzogna', confess: '«Duecentoquattordici sul diretto. Due sul merci. Ho fatto la sottrazione andando alla leva. Li conoscevo, quei due: il fuochista aveva avuto una bambina a marzo. Ho detto “errore” perché la Direzione me l\'ha chiesto, e perché “scelta” non riuscivo a dirlo.»', weigh: 'Scelse chi doveva morire perché altri vivessero.' },
      { truth: 'Il dispaccio arrivò, ma {nome} lo lesse male per la fretta e azionò lo scambio sbagliato: il diretto si fermò da solo, in salita. I due morirono per niente.', flawed: 'teste', why: 'Il telegrafista ricorda la calma di {nome} e la scambia per decisione: era paralisi.', tone: 'evasiva', confess: '«Ho letto il dispaccio e non ho capito più niente. Sono andat{o} alla leva piano perché le gambe non andavano. Ho tirato quella che avevo davanti. Il diretto si è fermato da solo sulla rampa. Se fossi rimast{o} fermo, sarebbero vivi tutti.»', weigh: 'Il panico gli fece compiere un gesto inutile e mortale.' },
    ],
  },
  {
    id: 't08', title: 'Le polveri allungate', occ: 'farmacista/farmacista', age: [40, 76], causes: ['febbre spagnola', 'vecchiaia'], tags: ['lavoro', 'colpa', 'guerra'],
    rel: { role: 'cliente', note: 'Morì di febbre malgrado il chinino acquistato da {nome}.' }, wit: 'garzone di farmacia',
    official: { title: 'Perizia sul chinino sequestrato', source: 'Ufficio d\'Igiene', text: 'Il chinino venduto dalla farmacia {cognome} durante l\'epidemia conteneva un terzo del principio attivo. Frode in commercio. Multa e chiusura per sei mesi.' },
    witness: '«Lo tagliava, sì, l\'ho visto io. Ma non ha alzato il prezzo: lo dava a metà. E la cassa, in quei mesi, era più vuota di prima. Che frode è, una frode in perdita?»',
    claim: '«L\'Ufficio d\'Igiene ha fatto la sua perizia. Ho pagato la multa.»',
    recommended: 'trial', rule: 'Art. 21: frode con esito mortale → La Prova.', conflict: 'una dose divisa per tre', memory: 'una fila di persone sotto la pioggia',
    variants: [
      { truth: 'Le scorte bastavano per un terzo del paese. {nome} divise ogni dose in tre perché tutti ne avessero un po\', sapendo che così poteva non bastare a nessuno.', flawed: 'ufficiale', why: 'La perizia misurò le polveri, non le scorte: chiamò frode un razionamento disperato.', tone: 'evasiva', confess: '«Avevo chinino per quattrocento e la fila era di milleduecento. O un terzo viveva di sicuro, o tutti avevano una possibilità su tre. Ho scelto la seconda senza dirlo a nessuno. Non so ancora se ho sbagliato i conti o la morale.»', weigh: 'Divise il rimedio perché nessuno restasse senza, a rischio di tutti.' },
      { truth: '{nome} tagliò il chinino per rivendere la parte buona al mercato nero del capoluogo. Il mezzo prezzo serviva a non destare sospetti.', flawed: 'teste', why: 'Il garzone vedeva la cassa del negozio, non la valigia che partiva ogni giovedì per il capoluogo.', tone: 'menzogna', confess: '«In città lo pagavano dieci volte. Ogni giovedì una valigia. Al banco lo davo a metà perché nessuno si lamentasse. Il garzone ha ragione: la cassa era vuota. Quella del negozio.»', weigh: 'Speculò sul rimedio durante un\'epidemia.' },
    ],
  },
  {
    id: 't09', title: 'Il sigillo della confessione', occ: 'parroco/priora', age: [45, 82], causes: ['vecchiaia', 'polmonite'], tags: ['fede', 'colpa'],
    rel: { role: 'parrocchiano', note: 'Fu trovato morto il giorno dopo una confessione.' }, wit: 'sacrestano',
    official: { title: 'Relazione della Curia', source: 'Curia vescovile', text: 'Il rev. {cognome} è accusato di aver violato il sigillo sacramentale, rivelando ai carabinieri il contenuto di una confessione. Sospensione a divinis.' },
    witness: '«Ai carabinieri non ha detto una parola. È andat{o} soltanto a suonare la campana a martello, di notte, senza motivo. Tutto il paese è corso in piazza. Anche quelli che stavano andando a casa di {altro}.»',
    claim: '«Ho violato il sigillo. La Curia mi ha giudicat{o}. Non intendo discuterne.»',
    recommended: 'trial', rule: 'Art. 26: violazione di voto solenne → La Prova.', conflict: 'una campana suonata di notte', memory: 'la corda della campana che scotta le mani',
    variants: [
      { truth: 'In confessione {nome} seppe che {altro} sarebbe stato ucciso quella notte. Non parlò: suonò la campana per riempire la piazza. Non bastò, e si accusò da sé di aver violato il sigillo.', flawed: 'ufficiale', why: 'La Curia sanzionò ciò che {nome} stess{o} dichiarò: preferì confessare una violazione mai avvenuta piuttosto che un fallimento.', tone: 'menzogna', confess: '«Non ho detto niente a nessuno. Ho suonato. Pensavo: con la piazza piena non oseranno. Hanno aspettato che la gente tornasse a letto. Alla Curia ho detto di aver parlato, perché almeno risultasse che qualcuno ci aveva provato.»', weigh: 'Tentò di salvare una vita senza tradire il voto, e fallì.' },
      { truth: '{nome} rivelò davvero la confessione, ma non ai carabinieri: ai parenti della futura vittima, che si fecero giustizia per primi. Morì il penitente.', flawed: 'teste', why: 'Il sacrestano vide la campana e non il biglietto fatto arrivare alla famiglia.', tone: 'evasiva', confess: '«Ho scritto un biglietto ai fratelli di {altro}. Tre parole. Poi ho suonato la campana, per avere un motivo d\'essere sveglio. Loro non hanno aspettato: sono andati dal mio penitente. Ho salvato un uomo ammazzandone un altro con tre parole.»', weigh: 'Violò il segreto per salvare una vita e ne costò un\'altra.' },
    ],
  },
  {
    id: 't10', title: 'Il viandante dell\'osteria', occ: 'oste/ostessa', age: [35, 74], causes: ['cirrosi', 'vecchiaia'], tags: ['lavoro', 'colpa', 'guerra'],
    rel: { role: 'viandante', note: 'Entrò all\'osteria una sera di neve e non ne uscì mai, a detta di tutti.' }, wit: 'carrettiere',
    official: { title: 'Fascicolo «Scomparsa di un forestiero»', source: 'Pretura di {luogo}', text: 'Un forestiero con una borsa di cuoio fu visto entrare all\'osteria {cognome}. Mai più rivisto. La borsa fu trovata, vuota, nel fienile. {nome} fu sospettat{o} di rapina e omicidio; mai rinviat{o} a giudizio.' },
    witness: '«Tre notti dopo ho caricato all\'osteria una botte per il passo. Pesava come un cristiano e, a metà salita, ha starnutito. {nome} mi ha dato dieci lire per non aver sentito.»',
    claim: '«È ripartito all\'alba, a piedi. La borsa l\'avrà persa. Io non so niente.»',
    recommended: 'trial', rule: 'Art. 20: sospetto omicidio non smentito → La Prova.', conflict: 'una borsa vuota nel fienile', memory: 'una botte che starnutisce',
    variants: [
      { truth: 'Il forestiero era un ricercato politico. {nome} lo nascose in cantina tre giorni e lo fece passare oltre confine in una botte. Tenne per sé il sospetto di omicidio per coprirne la fuga.', flawed: 'ufficiale', why: 'La Pretura costruì l\'ipotesi sulla borsa vuota: {nome} lasciò che credessero al peggio.', tone: 'menzogna', confess: '«Lo cercavano in sei province. Gli ho svuotato la borsa perché sembrasse una rapina e l\'ho messo in una botte da duecento litri. Per trent\'anni in paese mi hanno chiamat{o} “l\'assassin{o}”. Ho lasciato dire: un assassino non lo cerca nessuno, un complice sì.»', weigh: 'Accettò la fama di assassino per salvare un fuggiasco.' },
      { truth: '{nome} derubò il forestiero mentre dormiva; scoperto, lo fece fuggire in una botte pagandone il silenzio con metà del suo stesso denaro.', flawed: 'teste', why: 'Il carrettiere crede di aver trasportato un uomo salvato: era un uomo comprato.', tone: 'evasiva', confess: '«Gli ho preso la borsa mentre dormiva. Si è svegliato. Era ricercato, non poteva gridare. Gli ho detto: metà te la rendo e ti porto al passo, o chiamo i carabinieri. Ha scelto la botte. Un affare tra due disgraziati.»', weigh: 'Derubò un uomo che non poteva chiedere aiuto.' },
    ],
  },
  {
    id: 't11', title: 'Il dispaccio non consegnato', occ: 'staffetta militare/staffetta militare', age: [19, 34], causes: ['fucilazione', 'una scheggia di granata'], tags: ['guerra', 'colpa'],
    rel: { role: 'comandante di batteria', note: 'Non ricevette mai l\'ordine affidato a {nome}.' }, wit: 'commilitone',
    official: { title: 'Sentenza del tribunale di guerra', source: 'Tribunale militare di campo', text: 'La staffetta {cognome} non consegnò alla batteria l\'ordine affidatole e fu rinvenuta sei ore dopo in un fienile. Codardia davanti al nemico.' },
    witness: '«Codard{o}? {nome} è passat{o} due volte sotto il tiro per portare la posta. Quella volta ha aperto il plico, l\'ho vist{o} io. L\'ha letto in piedi, in mezzo alla strada. Poi l\'ha mangiato.»',
    claim: '«Mi sono pers{o}. Avevo paura. Il tribunale ha deciso.»',
    recommended: 'trial', rule: 'Art. 19: codardia davanti al nemico → La Prova.', conflict: 'un ordine inghiottito', memory: 'il sapore della carta da dispaccio',
    variants: [
      { truth: 'L\'ordine comandava di aprire il fuoco su un paese ancora pieno di civili. {nome} lo lesse, lo distrusse e si lasciò condannare per codardia.', flawed: 'ufficiale', why: 'Il tribunale non seppe mai che cosa dicesse l\'ordine: l\'unica copia era stata mangiata.', tone: 'menzogna', confess: '«C\'erano le coordinate di un paese. Lo conoscevo: ci avevamo dormito. C\'era ancora il mercato. Ho pensato che un ordine non arrivato è un ordine che nessuno ha disobbedito. L\'ho masticato per bene. Sapeva di ceralacca.»', weigh: 'Distrusse un ordine atroce e pagò come codardo.' },
      { truth: 'L\'ordine comandava alla batteria di ripiegare. {nome}, credendolo un ordine d\'attacco, lo distrusse per paura di doverci tornare; la batteria, non avvertita, fu annientata.', flawed: 'teste', why: 'Il commilitone vide il gesto e gli attribuì il coraggio che {nome} aveva avuto altre volte.', tone: 'evasiva', confess: '«Non l\'ho letto fino in fondo. Ho visto “batteria” e “immediatamente” e ho pensato: si attacca, e dovrò tornarci in mezzo. L\'ho distrutto. Diceva di ritirarsi. Quarantuno uomini hanno aspettato un ordine che avevo nello stomaco.»', weigh: 'La paura gli fece distruggere l\'ordine che avrebbe salvato i compagni.' },
    ],
  },
  {
    id: 't12', title: 'Il bambino sulla scala', occ: 'bambinaio/balia', age: [22, 70], causes: ['vecchiaia', 'febbre'], tags: ['famiglia', 'colpa', 'lavoro'],
    rel: { role: 'padrona di casa', note: 'Madre del bambino caduto dalle scale.' }, wit: 'cuoca di casa',
    official: { title: 'Verbale del pretore sull\'infortunio', source: 'Pretura di {luogo}', text: 'Il bambino affidato a {nome} {cognome} cadde dalla scala padronale riportando una lesione permanente. {nome} ammise la propria disattenzione e fu licenziat{o} senza benservito.' },
    witness: '«Disattenzione? {nome} era in cucina con me a scaldare il latte. Il piccolo era di sopra con la signora. La signora quel giorno aveva bevuto: io le bottiglie le conto.»',
    claim: '«Mi sono distratt{o} un momento. È stata colpa mia, l\'ho firmato.»',
    recommended: 'renewal', rule: 'Art. 12: colpa lieve ammessa → Rinnovo.', conflict: 'una colpa firmata al posto di un altro', memory: 'un pentolino di latte lasciato sul fuoco',
    variants: [
      { truth: 'Il bambino cadde mentre era con la madre ubriaca. {nome} si addossò la colpa perché un pretore non togliesse il figlio alla madre.', flawed: 'ufficiale', why: 'Il verbale registra una confessione volontaria e falsa.', tone: 'menzogna', confess: '«Se dicevo la verità glielo portavano via, e lui aveva solo lei. Ho firmato io. Lei non mi ha mai ringraziat{o}: mi ha licenziat{o} il giorno dopo, perché non sopportava di guardarmi. La capisco.»', weigh: 'Si prese una colpa non sua per non separare una madre dal figlio.' },
      { truth: '{nome} era in cucina perché aveva lasciato il bambino solo sulle scale per andare dalla cuoca. La madre, di sopra, dormiva. La colpa era davvero sua.', flawed: 'teste', why: 'La cuoca, per affetto, sposta il bambino «di sopra con la signora»: lei non lo vide, era ai fornelli.', tone: 'evasiva', confess: '«La cuoca mi vuole bene e si ricorda male. Il piccolo l\'ho lasciato io sul pianerottolo: “sta\' fermo un minuto”. Aveva due anni. Che ne sa un bambino di due anni, di un minuto.»', weigh: 'Lasciò solo un bambino per un momento, e quel momento durò tutta la vita.' },
    ],
  },
  {
    id: 't13', title: 'Il testamento del notaio', occ: 'notaio/notaia', age: [45, 80], causes: ['vecchiaia', 'arresto cardiaco'], tags: ['lavoro', 'colpa', 'famiglia'],
    rel: { role: 'erede escluso', note: 'Figlio naturale del testatore, mai riconosciuto.' }, wit: 'scrivano di studio',
    official: { title: 'Sentenza per falso in atto pubblico', source: 'Tribunale di {luogo}', text: 'Il notaio {cognome} inserì nel testamento del cav. Ferrero un legato in favore di {altro}, non voluto dal testatore. Radiazione dall\'albo.' },
    witness: '«Io c\'ero, al capezzale. Il cavaliere non parlava più. Ha stretto la mano del notaio tre volte guardando la porta, dove c\'era quel ragazzo. Poi il notaio ha scritto.»',
    claim: '«Ho alterato un atto. Sono stat{o} radiat{o}. Che altro volete sapere.»',
    recommended: 'trial', rule: 'Art. 24: falso in atto pubblico → La Prova.', conflict: 'una riga aggiunta a un testamento', memory: 'tre strette di mano',
    variants: [
      { truth: 'Il testatore, ormai muto, volle davvero riconoscere il figlio naturale. {nome} tradusse in parole un gesto, sapendo che in tribunale non avrebbe retto.', flawed: 'ufficiale', why: 'Il tribunale giudicò la forma: un moribondo muto non detta legati.', tone: 'evasiva', confess: '«Tre strette. Io gliel\'ho chiesto: “al ragazzo?”. Ha chiuso gli occhi per dire sì. Un gesto non è una volontà, dice la legge. Ho scritto lo stesso. Sapevo che mi sarebbe costato l\'albo: l\'ho messo nel conto.»', weigh: 'Falsificò la forma per rispettare una volontà vera.' },
      { truth: 'Il moribondo non volle nulla: {nome} inserì il legato perché {altro} era suo figlio, non del testatore.', flawed: 'teste', why: 'Lo scrivano interpreta le strette di mano: erano spasmi. E non sapeva di chi fosse figlio il ragazzo.', tone: 'menzogna', confess: '«Il cavaliere non capiva più niente. Il ragazzo alla porta era mio. Vent\'anni senza potergli dare il nome. Ho pensato: almeno un campo. Con la mano di un altro.»', weigh: 'Usò la morte di un cliente per provvedere a un figlio segreto.' },
    ],
  },
  {
    id: 't14', title: 'Il crollo della galleria', occ: 'caposquadra di miniera/caposquadra di miniera', age: [30, 62], causes: ['silicosi', 'crollo in galleria'], tags: ['lavoro', 'colpa'],
    rel: { role: 'ingegnere della Società', note: 'Dirigeva lo scavo della galleria crollata.' }, wit: 'minatore superstite',
    official: { title: 'Relazione della Società Mineraria', source: 'Società Mineraria di {luogo}', text: 'Il crollo della galleria 4 (nove morti) è imputato al caposquadra {cognome}, che fece avanzare lo scavo ignorando i segni di cedimento. {nome} ha sottoscritto la relazione.' },
    witness: '«{nome} quella mattina non voleva farci entrare. L\'ho sentit{o} gridare con l\'ingegnere davanti alla bocca della galleria: “i puntelli cantano”. Poi è venut{o} da noi e ha detto: si entra. Aveva la faccia di un morto.»',
    claim: '«Ho sottoscritto la relazione. Ero io il responsabile della squadra.»',
    recommended: 'trial', rule: 'Art. 22: negligenza con esito mortale plurimo → La Prova.', conflict: 'puntelli che cantavano', memory: 'nove lampade che entrano in fila',
    variants: [
      { truth: 'L\'ingegnere ordinò di entrare minacciando il licenziamento della squadra intera. {nome} obbedì, e poi firmò la relazione in cambio di una pensione per le nove vedove.', flawed: 'ufficiale', why: 'La Società comprò la firma di {nome} con le pensioni: la relazione scagiona l\'ingegnere.', tone: 'menzogna', confess: '«Mi ha detto: o entrano, o da domani non entra più nessuno di voi. Li ho fatti entrare. Dopo, la Società voleva una firma e le vedove non avevano niente. Ho venduto la mia per nove pensioni. È l\'unico buon prezzo che ho fatto in vita mia.»', weigh: 'Obbedì a un ordine mortale; poi vendette la propria colpa a beneficio delle vedove.' },
      { truth: 'L\'ingegnere, dopo la lite, lasciò a {nome} la decisione. Fu {nome} a far entrare la squadra, per non perdere il premio di avanzamento.', flawed: 'teste', why: 'Il superstite sentì la lite, non la fine: l\'ingegnere se ne andò dicendo «faccia lei».', tone: 'evasiva', confess: '«Ha detto: “faccia lei, {cognome}”. E se n\'è andato. Mancavano quattro metri al premio. Ho pensato: i puntelli cantano sempre. Li ho fatti entrare io. Nessuno me l\'ha ordinato.»', weigh: 'Rischiò nove vite per un premio di produzione.' },
    ],
  },
  {
    id: 't15', title: 'La cima del fratello', occ: 'pescatore/pescatrice', age: [25, 75], causes: ['annegamento', 'vecchiaia'], tags: ['famiglia', 'colpa', 'lutto'],
    rel: { role: 'fratello', note: 'Annegò durante una burrasca, legato alla stessa cima di {nome}.' }, wit: 'vedova del fratello',
    official: { title: 'Verbale della Delegazione di spiaggia', source: 'Delegazione di {luogo}', text: 'Durante la burrasca la barca dei fratelli {cognome} si rovesciò. {nome} fu tratt{o} in salvo aggrappat{o} alla chiglia. La cima che l{o} legava al fratello risultò recisa di netto, da lama.' },
    witness: '«Recisa da lama. E il coltello ce l\'aveva {nome} alla cintura, quando l\'hanno tirat{o} su. Mio marito il suo l\'aveva lasciato a casa: è ancora sul camino.»',
    claim: '«La cima si è spezzata sugli scogli. Io non ho tagliato niente.»',
    recommended: 'trial', rule: 'Art. 20: abbandono di congiunto in pericolo → La Prova.', conflict: 'una cima tagliata di netto', memory: 'il peso improvviso di una corda che si allenta',
    variants: [
      { truth: 'Fu il fratello a tagliare la cima, con il coltello di {nome}, strappandoglielo dalla cintura: sapeva che in due sarebbero andati a fondo.', flawed: 'teste', why: 'La vedova ragiona bene sugli oggetti e male sulle persone: non poteva sapere chi avesse impugnato la lama.', tone: 'evasiva', confess: '«Me l\'ha sfilato lui, il coltello. Mi ha guardat{o} e ha detto: “i tuoi sono più piccoli dei miei”. Ha tagliato dalla sua parte. Poi me l\'ha rimesso alla cintura. A sua moglie non l\'ho detto: preferisce odiarmi che sapere che lui ha scelto di lasciarla.»', weigh: 'Tacque il sacrificio del fratello per risparmiarne la vedova.' },
      { truth: 'Fu {nome} a tagliare la cima: il fratello, ferito, l{o} stava trascinando sotto.', flawed: 'ufficiale', why: 'Il verbale non attribuisce il taglio: la Delegazione preferì non scrivere ciò che tutti pensavano.', tone: 'menzogna', confess: '«Aveva la gamba rotta e tirava giù. Io avevo tre figli a riva. Ho tagliato. Lui ha visto la lama e non ha detto niente: ha lasciato andare la cima prima ancora che finissi. Quello è il momento che non passa.»', weigh: 'Tagliò la cima del fratello per sopravvivere.' },
    ],
  },
  {
    id: 't16', title: 'Lo sfregio in camerino', occ: 'attore di compagnia/attrice di compagnia', age: [28, 70], causes: ['tisi', 'vecchiaia'], tags: ['lavoro', 'amore', 'colpa'],
    rel: { role: 'prima attrice rivale', note: 'Sfregiata con il vetriolo la sera di una prima.' }, wit: 'trovarobe della compagnia',
    official: { title: 'Sentenza per lesioni', source: 'Tribunale di {luogo}', text: '{nome} {cognome} confessò di aver gettato vetriolo sul volto di {altro} per gelosia di ruolo. Tre anni di reclusione.' },
    witness: '«La boccetta l\'ho comprata io, su ordine del capocomico, “per smacchiare un costume”. E quella sera {nome} è arrivat{o} in camerino dopo le grida, non prima. Aveva ancora il cappotto.»',
    claim: '«Ho confessato in tribunale. Ero gelos{o}. È tutto.»',
    recommended: 'trial', rule: 'Art. 20: lesione deturpante confessata → La Prova.', conflict: 'una confessione recitata bene', memory: 'odore di vetriolo e cerone',
    variants: [
      { truth: 'Fu il capocomico, amante respinto della vittima. {nome}, che lo amava, confessò al suo posto.', flawed: 'ufficiale', why: 'La sentenza poggia su una confessione resa per amore: nessuno verificò gli orari.', tone: 'menzogna', confess: '«Sono entrat{o} e lui aveva ancora la boccetta in mano. Piangeva. Ho detto: dammela. È stata la mia interpretazione migliore, quella in tribunale. Tre anni. Non è mai venuto a trovarmi.»', weigh: 'Si accusò di un crimine per amore di chi l\'aveva commesso.' },
      { truth: 'Fu {nome}. Tolse il cappotto, gettò il vetriolo, uscì, rimise il cappotto e rientrò «dopo le grida».', flawed: 'teste', why: 'Il trovarobe vide ciò che {nome} volle fargli vedere: un\'entrata in scena.', tone: 'evasiva', confess: '«Il trovarobe ha visto quello che dovevano vedere tutti. So entrare in scena. Ho confessato dopo, quando ho visto la faccia di lei, perché una cosa è farlo e un\'altra è guardarlo.»', weigh: 'Deturpò una rivale e costruì il proprio alibi come una scena.' },
    ],
  },
  {
    id: 't17', title: 'Le quietanze dell\'esattore', occ: 'esattore delle imposte/esattrice delle imposte', age: [35, 72], causes: ['vecchiaia', 'polmonite'], tags: ['lavoro', 'colpa'],
    rel: { role: 'capofamiglia sfrattato', note: 'Perse la casa per morosità fiscale.' }, wit: 'messo comunale',
    official: { title: 'Procedimento disciplinare', source: 'Intendenza di Finanza', text: 'L\'esattore {cognome} è destituit{o} per aver emesso quarantasei quietanze false. Le famiglie beneficiarie furono chiamate a pagare il dovuto con le more; sette furono sfrattate, tra cui quella di {altro}.' },
    witness: '«Le quietanze false le dava ai più poveri, e la differenza la metteva di tasca sua finché ne ha avuta. Poi non ne ha avuta più, e ha continuato a firmare.»',
    claim: '«Ho emesso quietanze non dovute. Mi hanno destituit{o}. Giustamente.»',
    recommended: 'trial', rule: 'Art. 24: falso continuato in atti → La Prova.', conflict: 'quarantasei firme per pietà', memory: 'una porta chiusa da un ufficiale giudiziario',
    variants: [
      { truth: '{nome} coprì di tasca propria le imposte dei più poveri; finiti i risparmi, continuò a firmare a vuoto. Quando fu scoperto, le more rovinarono proprio coloro che voleva aiutare.', flawed: 'ufficiale', why: 'Il procedimento descrive correttamente i fatti e tace del tutto il movente e l\'esborso personale.', tone: 'evasiva', confess: '«Finché ho avuto del mio, ho pagato io. Poi ho firmato lo stesso, pensando: troverò. Non ho trovato. Con le more gli hanno preso la casa. Li avessi lasciati pagare a rate, ce l\'avrebbero ancora. Ho fatto il bene come uno che non sa fare i conti.»', weigh: 'La sua pietà mal calcolata rovinò chi voleva proteggere.' },
      { truth: '{nome} vendeva le quietanze false a metà dell\'imposta e intascava. Il messo comunale riceveva una parte.', flawed: 'teste', why: 'Il messo abbellisce: era complice, e difendere {nome} significa difendere se stesso.', tone: 'menzogna', confess: '«Metà dell\'imposta, in mano a me, e la quietanza era loro. Il messo prendeva un quinto. Dicevamo che era un servizio ai poveri. I poveri pagavano due volte, alla fine. Noi una sola: adesso.»', weigh: 'Vendette quietanze false ai poveri, che pagarono due volte.' },
    ],
  },
  {
    id: 't18', title: 'Il fuoco dell\'apicoltore', occ: 'apicoltore/apicoltrice', age: [30, 78], causes: ['vecchiaia', 'ustioni'], tags: ['colpa', 'lavoro'],
    rel: { role: 'proprietario della cascina bruciata', note: 'Perse casa e raccolto nell\'incendio del bosco.' }, wit: 'guardia forestale',
    official: { title: 'Verbale forestale sull\'incendio', source: 'Milizia Forestale', text: 'L\'incendio ebbe origine dall\'affumicatore di {nome} {cognome}, lasciato incustodito. Distrutti trenta ettari e la cascina di {altro}. Incendio colposo.' },
    witness: '«L\'origine era l\'affumicatore, sì. Ma i punti d\'innesco erano tre, in linea, a cento passi l\'uno dall\'altro, sopravvento al paese. Un affumicatore dimenticato non cammina.»',
    claim: '«Ho lasciato l\'affumicatore acceso. Una distrazione.»',
    recommended: 'renewal', rule: 'Art. 12: colpa senza esito mortale → Rinnovo.', conflict: 'tre fuochi in fila', memory: 'api che escono dal fumo',
    variants: [
      { truth: 'Un incendio più grande scendeva dal crinale verso il paese. {nome} appiccò un controfuoco su tre punti per fermarlo: salvò {luogo}, sacrificando la cascina che stava in mezzo.', flawed: 'ufficiale', why: 'Il verbale vide un solo incendio; il controfuoco e il fronte principale si erano già fusi.', tone: 'evasiva', confess: '«Il fuoco veniva giù dal crinale con il vento. Ho fatto la linea con quello che avevo. In mezzo c\'era la cascina. Ho bussato: non c\'era nessuno, e ho acceso. Il paese non ha saputo di essere stato salvato, e lui ha saputo benissimo chi gli ha bruciato la casa.»', weigh: 'Bruciò la casa di un uomo per salvare un paese.' },
      { truth: '{nome} appiccò i tre fuochi per bruciare il castagneto conteso con {altro}; il vento girò.', flawed: 'teste', why: 'La guardia nota giustamente i tre inneschi, e gli attribuisce un senso nobile che non avevano.', tone: 'menzogna', confess: '«Il castagneto era di mio nonno, e un giudice l\'aveva dato a lui. Ho pensato: né mio né tuo. Tre fuochi, col vento a monte. Poi il vento ha girato.»', weigh: 'Incendiò un bosco per rancore e perse il controllo del fuoco.' },
    ],
  },
  {
    id: 't19', title: 'Il libro del copista', occ: 'copista di tipografia/copista di tipografia', age: [26, 70], causes: ['tisi', 'vecchiaia'], tags: ['lavoro', 'guerra', 'colpa'],
    rel: { role: 'autore', note: 'Arrestato dopo il sequestro del manoscritto.' }, wit: 'legatore',
    official: { title: 'Verbale di sequestro', source: 'Commissariato di {luogo}', text: 'Su segnalazione del copista {cognome}, è sequestrato presso la tipografia il manoscritto sedizioso di {altro}. L\'autore è tradotto al confino.' },
    witness: '«Il manoscritto sequestrato era di sessanta fogli. Io ne avevo cuciti duecento. Qualcuno, prima della perquisizione, ne ha portati via centoquaranta. E la segnalazione è arrivata quando in tipografia c\'era già un agente in borghese, da una settimana.»',
    claim: '«Ho fatto il mio dovere di cittadin{o}. C\'è la mia firma sulla segnalazione.»',
    recommended: 'trial', rule: 'Art. 19: delazione → La Prova.', conflict: 'centoquaranta fogli mancanti', memory: 'pagine nascoste sotto il pavimento',
    variants: [
      { truth: 'La tipografia era già sorvegliata. {nome} consegnò una parte innocua del manoscritto per far cessare la perquisizione e nascose il resto, che pubblicò anni dopo.', flawed: 'ufficiale', why: 'Il verbale registra la segnalazione, non che il Commissariato sapesse già tutto.', tone: 'evasiva', confess: '«L\'agente era lì da sette giorni. Lo avrebbero preso comunque, con tutti i duecento fogli, ed erano fogli da fucilazione. Ho dato i sessanta da confino. Gli altri li ho stampati dopo, senza il mio nome. Lui è morto credendo che l\'avessi venduto. Non era del tutto falso.»', weigh: 'Denunciò un uomo per salvargli la vita e l\'opera.' },
      { truth: '{nome} denunciò l\'autore per la taglia; i centoquaranta fogli li vendette a un collezionista.', flawed: 'teste', why: 'Il legatore immagina un salvataggio: i fogli furono sottratti, sì, ma per venderli.', tone: 'menzogna', confess: '«C\'era una taglia. E un signore di città che pagava bene gli autografi proibiti. Ho preso da tutte e due le parti. I fogli sono in una biblioteca privata, rilegati in marocchino. Sono conservati meglio dell\'autore.»', weigh: 'Vendette un uomo alla polizia e la sua opera a un collezionista.' },
    ],
  },
  {
    id: 't20', title: 'Gli anelli dei morti', occ: 'becchino/becchina', age: [35, 80], causes: ['vecchiaia', 'polmonite'], tags: ['lavoro', 'colpa', 'lutto'],
    rel: { role: 'famiglia benestante', note: 'Denunciò la sparizione dell\'anello dalla salma del congiunto.' }, wit: 'fornaia di {luogo}',
    official: { title: 'Denuncia per vilipendio e furto', source: 'Carabinieri di {luogo}', text: 'Il becchino {cognome} sottrasse per anni anelli e catenine alle salme. Refurtiva mai ritrovata. Reo confesso.' },
    witness: '«Mai ritrovata, dicono. Io so che in paese, in quegli anni, tre vedove senza un soldo hanno pagato il funerale del marito con un anello che non avevano mai avuto al dito.»',
    claim: '«Ho rubato ai morti. Ho confessato. I morti non reclamano.»',
    recommended: 'trial', rule: 'Art. 23: vilipendio continuato → La Prova.', conflict: 'oro tolto a dita fredde', memory: 'un anello che non si sfilava',
    variants: [
      { truth: '{nome} toglieva l\'oro ai morti ricchi per pagare la sepoltura dei poveri, che altrimenti finivano nella fossa comune.', flawed: 'ufficiale', why: 'La denuncia è esatta nei fatti e cieca nella destinazione: la refurtiva era sottoterra, nelle tombe degli altri.', tone: 'evasiva', confess: '«A {luogo} chi non paga va nella fossa grande, con la calce. Ho pensato: quello sotto ha tre anelli e non gli servono. Uno bastava per una cassa e una croce con il nome. Ho rubato, sì. A chi non poteva più avere bisogno, per chi non poteva più chiedere.»', weigh: 'Rubò ai morti ricchi per dare un nome sulla tomba ai morti poveri.' },
      { truth: '{nome} rubava per sé. Tre volte, colto dal rimorso, lasciò un anello a una vedova; il resto lo fuse.', flawed: 'teste', why: 'La fornaia ricorda le tre eccezioni e ne fa la regola.', tone: 'menzogna', confess: '«Tre volte. Su duecento. Le altre le ho fuse da un orafo del capoluogo. Con tre anelli ci si compra una buona fama, ho scoperto. Non l\'avevo fatto apposta, ma poi l\'ho lasciata crescere.»', weigh: 'Rubò ai morti per sé, e lasciò credere di averlo fatto per carità.' },
    ],
  },
  {
    id: 't21', title: 'L\'ora dell\'orologiaio', occ: 'orologiaio/orologiaia', age: [40, 82], causes: ['vecchiaia', 'arresto cardiaco'], tags: ['lavoro', 'colpa'],
    rel: { role: 'amico d\'infanzia', note: 'Assolto da un\'accusa di omicidio grazie alla perizia di {nome}.' }, wit: 'campanaro',
    official: { title: 'Perizia giurata sull\'orologio della vittima', source: 'Corte d\'Assise', text: 'Il perito {cognome} attesta che l\'orologio da tasca della vittima, fermatosi nella colluttazione, segnava le 9 e 40: ora in cui l\'imputato {altro} era visto all\'osteria. Assoluzione.' },
    witness: '«Io le nove le ho suonate che il morto era già per terra: l\'ho visto dal campanile. E un orologio che si ferma per un colpo non ha le lancette così pulite sul quadrante, senza un graffio.»',
    claim: '«La mia perizia era giurata. L\'orologio segnava le nove e quaranta.»',
    recommended: 'trial', rule: 'Art. 24: falsa perizia → La Prova.', conflict: 'lancette spostate di quaranta minuti', memory: 'il ticchettio di cento orologi in una stanza',
    variants: [
      { truth: '{nome} spostò le lancette per dare un alibi all\'amico, convint{o} della sua innocenza. L\'amico era innocente: il vero colpevole confessò dieci anni dopo.', flawed: 'ufficiale', why: 'La perizia è falsa nel dato e giusta nell\'esito: {nome} mentì per salvare un innocente.', tone: 'evasiva', confess: '«Le ho spostate io. Lo conoscevo da quando avevamo sei anni: non era capace. Ma senza alibi lo impiccavano. Ho giurato il falso su un Vangelo. Dieci anni dopo ha confessato un altro. Avevo ragione. Non mi consola quanto dovrebbe.»', weigh: 'Giurò il falso per salvare un innocente.' },
      { truth: '{nome} spostò le lancette per l\'amico, che era colpevole e glielo aveva confessato.', flawed: 'teste', why: 'Il campanaro ha ragione su tutto; ciò che non sa è che {nome} conosceva la verità.', tone: 'menzogna', confess: '«Me l\'ha detto la sera stessa, nel retrobottega: “l\'ho ammazzato io”. E io ho preso l\'orologio del morto e ho girato la corona. Quaranta minuti. Tanto vale un\'amicizia: quaranta minuti e una vedova senza giustizia.»', weigh: 'Falsificò una perizia per salvare un assassino che era suo amico.' },
    ],
  },
  {
    id: 't22', title: 'I gioielli della signora', occ: 'domestico/domestica', age: [25, 74], causes: ['vecchiaia', 'febbre'], tags: ['lavoro', 'colpa'],
    rel: { role: 'padrona di casa', note: 'Denunciò il furto dei gioielli di famiglia.' }, wit: 'agente dell\'assicurazione',
    official: { title: 'Sentenza per furto domestico', source: 'Tribunale di {luogo}', text: '{nome} {cognome}, in servizio presso la famiglia di {altro}, è condannat{o} a due anni per il furto dei gioielli padronali. I gioielli non furono ritrovati.' },
    witness: '«La Compagnia ha pagato un indennizzo pari al doppio del valore stimato. Sei mesi dopo, un gioielliere di Trieste ha comprato una parure identica da una signora velata. E {nome}, uscit{o} di prigione, ha aperto una merceria. Con quali soldi?»',
    claim: '«Ho scontato la mia pena. Non parlo dei miei padroni.»',
    recommended: 'renewal', rule: 'Art. 12: reato comune già espiato in vita → Rinnovo.', conflict: 'due anni per una parure', memory: 'un astuccio di velluto vuoto',
    variants: [
      { truth: 'Il furto fu simulato dalla padrona per frodare l\'assicurazione. {nome} accettò la condanna in cambio del denaro per la merceria.', flawed: 'ufficiale', why: 'La sentenza si fonda su una denuncia falsa e su un imputato che non si difese.', tone: 'evasiva', confess: '«La signora mi ha chiamat{o} in salotto e mi ha fatto il conto: due anni, una merceria. Ho detto sì prima che finisse. Ero a servizio da quando avevo dodici anni: due anni di prigione erano i primi che qualcuno mi pagava bene.»', weigh: 'Vendette due anni di libertà e il proprio nome.' },
      { truth: '{nome} rubò davvero i gioielli; la padrona, scoperto il ladro, ne approfittò per gonfiare la denuncia. La merceria fu comprata con la parure.', flawed: 'teste', why: 'L\'agente sospetta della padrona, a ragione, ma non del servo: la «signora velata» era {nome}.', tone: 'menzogna', confess: '«La signora velata a Trieste ero io. La parure l\'avevo presa davvero. Lei ha denunciato il doppio e si è tenuta la differenza: ci siamo derubati a vicenda e abbiamo taciuto tutt\'e due. È stato il rapporto più onesto che abbia avuto con una padrona.»', weigh: 'Rubò, e lasciò che la padrona rubasse sul suo furto.' },
    ],
  },
  {
    id: 't23', title: 'La battuta di caccia', occ: 'cacciatore/cacciatrice', age: [28, 76], causes: ['vecchiaia', 'caduta in un burrone'], tags: ['colpa', 'amore'],
    rel: { role: 'compagno di caccia', note: 'Ucciso da una fucilata di {nome}.' }, wit: 'battitore',
    official: { title: 'Verbale del pretore sulla morte in battuta', source: 'Pretura di {luogo}', text: '{altro} fu ucciso da un colpo partito dal fucile di {nome} {cognome} durante la battuta al cinghiale. Disgrazia. Non luogo a procedere.' },
    witness: '«Disgrazia. Io li ho visti da sopra: erano fermi, uno davanti all\'altro, a venti passi, in una radura. Senza cani. Nessuno dei due guardava il bosco.»',
    claim: '«È stato un incidente. Ho creduto di vedere il cinghiale.»',
    recommended: 'renewal', rule: 'Art. 12: disgrazia accertata dal pretore → Rinnovo.', conflict: 'venti passi in una radura', memory: 'il rinculo contro la spalla',
    variants: [
      { truth: 'Fu un duello, concordato tra i due per una donna e mascherato da battuta. Spararono entrambi; {altro} mirò in aria.', flawed: 'ufficiale', why: 'Il pretore accettò la disgrazia: il duello era reato, e i padrini tacquero.', tone: 'menzogna', confess: '«L\'avevamo deciso davanti a un notaio, quasi. Venti passi, un colpo. Lui ha alzato la canna e ha sparato alle foglie. Io l\'ho visto alzarla. Ho avuto tutto il tempo. Ho sparato dritto.»', weigh: 'Uccise in duello un uomo che aveva scelto di non colpirlo.' },
      { truth: 'I due si erano fermati a litigare. Il colpo partì davvero per sbaglio, quando {nome} inciampò; ma {nome} aveva tolto la sicura, pochi istanti prima, per minacciarlo.', flawed: 'teste', why: 'Il battitore vide due uomini fermi e pensò al duello: era una lite, e un piede in fallo.', tone: 'evasiva', confess: '«Non volevo sparare. Volevo che avesse paura. Ho tolto la sicura perché lo sentisse. Poi ho messo il piede su una radice. Il pretore ha detto disgrazia. Una disgrazia con la sicura tolta ha un altro nome, ma non lo conosco.»', weigh: 'Un colpo partito per sbaglio, da un\'arma preparata per minacciare.' },
    ],
  },
  {
    id: 't24', title: 'La morfina del reparto', occ: 'infermiere d\'ospedale/suora infermiera', age: [30, 78], causes: ['vecchiaia', 'setticemia'], tags: ['lavoro', 'fede', 'colpa'],
    rel: { role: 'primario', note: 'Denunciò gli ammanchi di morfina.' }, wit: 'malato di lunga degenza',
    official: { title: 'Inchiesta interna sugli stupefacenti', source: 'Ospedale di {luogo}', text: 'Dall\'armadio del reparto mancarono in due anni quattrocento fiale di morfina. {nome} {cognome}, che ne teneva la chiave, ammise la sottrazione «per uso personale».' },
    witness: '«Uso personale? Io ho passato undici mesi in quella corsia. La notte passava letto per letto, da quelli che il primario aveva scritto “nulla da fare, non sprecare”. Dopo che passava, dormivano.»',
    claim: '«Le prendevo per me. È una debolezza. L\'ho ammesso.»',
    recommended: 'trial', rule: 'Art. 21: sottrazione continuata → La Prova.', conflict: 'quattrocento fiale contate una per una', memory: 'una corsia che finalmente dorme',
    variants: [
      { truth: '{nome} sottraeva la morfina per darla ai moribondi a cui il primario la negava. Confessò l\'uso personale per non far riaprire le cartelle.', flawed: 'ufficiale', why: 'L\'inchiesta si fermò alla confessione: indagare oltre avrebbe messo sotto accusa le disposizioni del primario.', tone: 'menzogna', confess: '«“Nulla da fare, non sprecare.” Lo scriveva in fondo alla cartella. Io non so se una fiala a chi muore sia sprecata. So che urlavano. Ho detto che erano per me perché, se guardavano le cartelle, la colpa passava ai morti.»', weigh: 'Rubò il sollievo per darlo a chi era stato scritto come perduto.' },
      { truth: '{nome} era davvero dipendente dalla morfina. Ne dava ai moribondi una parte, per sentirsi meno colpevole di ciò che teneva per sé.', flawed: 'teste', why: 'Il malato vide la carità e non la mano che tremava: metà di ogni fiala restava a {nome}.', tone: 'evasiva', confess: '«Metà a loro, metà a me. Mi dicevo che era giusto: io li capivo meglio del primario. La verità è che senza di loro non avrei avuto una scusa per aprire l\'armadio.»', weigh: 'Usò la pietà come copertura del proprio vizio — e fu comunque pietà.' },
    ],
  },
  {
    id: 't25', title: 'I manifesti del tipografo', occ: 'tipografo/tipografa', age: [30, 72], causes: ['avvelenamento da piombo', 'vecchiaia'], tags: ['lavoro', 'colpa'],
    rel: { role: 'sindaco diffamato', note: 'Si dimise e lasciò il paese dopo i manifesti.' }, wit: 'attacchino',
    official: { title: 'Sentenza per diffamazione a mezzo stampa', source: 'Tribunale di {luogo}', text: 'Il tipografo {cognome} stampò e fece affiggere manifesti anonimi che accusavano il sindaco {altro} di aver venduto il grano dell\'ammasso. Accuse giudicate infondate. Condanna e ammenda.' },
    witness: '«Infondate, ha detto il tribunale. Il grano dell\'ammasso però quell\'inverno non c\'era. E i carri li ho visti io partire di notte, dalla parte del mulino del cognato del sindaco.»',
    claim: '«Ho stampato quello che mi hanno ordinato. Un tipografo non legge: compone.»',
    recommended: 'renewal', rule: 'Art. 12: reato d\'opinione già sanzionato → Rinnovo.', conflict: 'parole stampate senza firma', memory: 'manifesti freschi di colla sotto la pioggia',
    variants: [
      { truth: 'Le accuse erano vere. {nome} le stampò di propria iniziativa, e senza firma, perché nessun altro osava. In tribunale non poté provarle.', flawed: 'ufficiale', why: 'Il tribunale giudicò le prove portate in aula, e non ce n\'erano: i testimoni avevano paura.', tone: 'evasiva', confess: '«Nessuno me li ha ordinati. Ho visto i carri anch\'io. Ho composto il testo di notte, una lettera alla volta, e non ci ho messo il nome. È questo che mi rimprovero: la verità detta senza firma somiglia troppo a una calunnia. E infatti.»', weigh: 'Disse la verità in forma anonima, e la verità fu condannata come calunnia.' },
      { truth: 'I manifesti furono commissionati e pagati dal rivale politico del sindaco. {nome} sapeva che le accuse erano inventate; che il grano mancasse davvero fu una coincidenza.', flawed: 'teste', why: 'L\'attacchino collega due fatti veri — i carri e i manifesti — che non avevano nulla in comune.', tone: 'menzogna', confess: '«Cinquecento lire per trecento manifesti. Il testo me l\'hanno portato già scritto. Sapevo che era inventato: il grano l\'avevano preso i militari. Il sindaco è morto a Genova, da solo. Aveva ragione lui e i manifesti ce li ho ancora in soffitta.»', weigh: 'Stampò a pagamento una calunnia che distrusse un uomo.' },
    ],
  },
  {
    id: 't26', title: 'La barca dei fuggiaschi', occ: 'barcaiolo/barcaiola', age: [28, 70], causes: ['annegamento', 'vecchiaia'], tags: ['guerra', 'colpa', 'lavoro'],
    rel: { role: 'fuggiasco rimasto a riva', note: 'Fu catturato sulla sponda la notte del traghettamento.' }, wit: 'fuggiasca traghettata',
    official: { title: 'Memoria del Comitato dei Profughi', source: 'Comitato di {luogo}', text: 'Il barcaiolo {cognome} traghettò oltre il fiume, a pagamento, gruppi di fuggiaschi. L\'ultima notte lasciò a riva sei persone che avevano già pagato, tra cui {altro}. Furono prese all\'alba.' },
    witness: '«Io ero su quella barca. Eravamo già in quattordici, con l\'acqua a un palmo dal bordo. {nome} ha contato, ha guardato il fiume e ha detto: sei restano, o restiamo tutti sul fondo. Ha reso i soldi a quelli che lasciava. Glieli ha messi in mano.»',
    claim: '«Mi pagavano per un posto. Quella notte i posti erano finiti.»',
    recommended: 'trial', rule: 'Art. 20: abbandono di persone in pericolo → La Prova.', conflict: 'sei persone contate a riva', memory: 'l\'acqua a un palmo dal bordo',
    variants: [
      { truth: 'La barca non reggeva più di quattordici persone. {nome} scelse chi lasciare, rese il denaro e promise un secondo viaggio che la pattuglia rese impossibile.', flawed: 'ufficiale', why: 'Il Comitato raccolse la voce dei parenti di chi restò: la portata della barca non interessava a nessuno.', tone: 'evasiva', confess: '«Quattordici. L\'avevo misurata con i sacchi di sabbia. Ho lasciato i sei più giovani, quelli che potevano correre. Ho detto: torno. Sono tornat{o}. C\'erano le lanterne della pattuglia e sei paia di scarpe in fila sulla ghiaia.»', weigh: 'Dovette scegliere chi salvare, e scelse.' },
      { truth: 'La barca avrebbe retto. {nome} lasciò a riva i sei che non potevano pagare il supplemento chiesto all\'ultimo momento.', flawed: 'teste', why: 'La testimone è grata a chi l\'ha salvata e ricorda una barca più piena e un gesto più nobile.', tone: 'menzogna', confess: '«Ho chiesto il doppio sulla riva, quando non potevano più dire di no. Otto hanno pagato. Sei no. La barca ne portava venti. I soldi resi? A una sola, perché piangeva. Si ricorda quello.»', weigh: 'Lasciò a riva chi non poteva pagare di più.' },
    ],
  },
  {
    id: 't27', title: 'L\'evasione dal mandamentale', occ: 'guardia carceraria/guardiana carceraria', age: [30, 70], causes: ['vecchiaia', 'coltellata'], tags: ['lavoro', 'colpa'],
    rel: { role: 'detenuto evaso', note: 'Condannato per incendio doloso; evase durante il turno di {nome}.' }, wit: 'cappellano del carcere',
    official: { title: 'Rapporto sull\'evasione', source: 'Direzione delle Carceri', text: 'Durante il turno della guardia {cognome} il detenuto {altro} evase dalla porta di servizio, trovata aperta con la chiave d\'ordinanza. {nome} fu destituit{o} per corruzione presunta.' },
    witness: '«Corruzione? {nome} ha venduto l\'orologio del padre, la settimana dopo, per mangiare. E la sera prima era venut{o} da me a chiedere che cosa pesa di più: un regolamento, o una cosa che uno sa.»',
    claim: '«Ho dimenticato la porta aperta. Non ho preso denaro da nessuno.»',
    recommended: 'trial', rule: 'Art. 24: violazione di consegna → La Prova.', conflict: 'una chiave girata dalla parte sbagliata', memory: 'un corridoio con una porta socchiusa',
    variants: [
      { truth: '{nome} sapeva che il detenuto era innocente: aveva sentito il vero incendiario vantarsi all\'osteria. Non potendo provarlo, aprì la porta.', flawed: 'ufficiale', why: 'La Direzione presunse il denaro perché non concepiva altro movente.', tone: 'evasiva', confess: '«L\'ho sentito con queste orecchie, quell\'altro, raccontare del fienile ridendo. Sono andat{o} dal direttore: “voci d\'osteria”. Allora ho lasciato la porta com\'era giusto che fosse. Un innocente fuori e una guardia a spasso: il conto mi tornava.»', weigh: 'Liberò un innocente contro la legge che serviva.' },
      { truth: '{nome} aprì la porta per pietà verso il detenuto, convint{o} della sua innocenza senza alcuna prova. Il detenuto era colpevole, e appiccò un secondo incendio.', flawed: 'teste', why: 'Il cappellano riferisce un dubbio sincero di {nome}, e presume che «una cosa che uno sa» fosse vera.', tone: 'menzogna', confess: '«Piangeva tutte le notti e diceva: non sono stato io. Gli ho creduto. Non sapevo niente: sentivo. Tre mesi dopo è bruciata una stalla a venti chilometri, con dentro un garzone. Quella porta l\'ho aperta io.»', weigh: 'Credette a un colpevole e, liberandolo, causò un\'altra morte.' },
    ],
  },
  {
    id: 't28', title: 'Lo spartito dell\'amico', occ: 'maestro di musica/maestra di musica', age: [35, 80], causes: ['vecchiaia', 'tisi'], tags: ['lavoro', 'colpa', 'lutto'],
    rel: { role: 'compagno di conservatorio', note: 'Morto giovane, lasciando spartiti inediti.' }, wit: 'sorella dell\'amico',
    official: { title: 'Nota biografica dell\'Accademia', source: 'Accademia Filarmonica', text: 'Il maestro {cognome} deve la fama a una sola opera, la «Messa di {luogo}», composta l\'anno successivo alla morte del collega {altro}. Non scrisse più nulla di paragonabile.' },
    witness: '«La Messa è di mio fratello. Riconosco la sua scrittura in ogni battuta. Però… i diritti, tutti, per quarant\'anni, sono arrivati a nostra madre, da un conto senza nome. E sulla tomba di mio fratello qualcuno ha fatto incidere otto battute.»',
    claim: '«La Messa porta il mio nome. È depositata all\'Accademia dal giorno della prima.»',
    recommended: 'renewal', rule: 'Art. 12: nessun atto accertato → Rinnovo.', conflict: 'un nome scritto su un frontespizio', memory: 'otto battute incise su una lapide',
    variants: [
      { truth: 'La Messa è dell\'amico morto. Fu lui, in punto di morte, a chiedere a {nome} di firmarla: l\'Accademia non avrebbe mai eseguito l\'opera di un espulso. {nome} versò tutti i proventi alla famiglia.', flawed: 'ufficiale', why: 'L\'Accademia scrive ciò che risulta dal deposito; l\'accordo tra i due non fu mai messo per iscritto.', tone: 'evasiva', confess: '«L\'avevano espulso per una questione di debiti. Mi disse: “Con il mio nome resta in un cassetto. Con il tuo la cantano”. Ho firmato. Ho applaudito alla prima seduto in platea, sapendo che ogni “bravo” era per un morto. Non ho più scritto: non avevo più il diritto di essere mediocre con il mio nome.»', weigh: 'Prestò il proprio nome all\'opera di un amico, e ne visse l\'impostura.' },
      { truth: '{nome} trovò lo spartito tra le carte dell\'amico e lo firmò. I versamenti alla madre e la lapide vennero dopo, quando il successo divenne insopportabile.', flawed: 'teste', why: 'La sorella vede nella generosità postuma la prova di un patto: era rimorso.', tone: 'menzogna', confess: '«L\'ho trovato riordinando la sua stanza. Era finito, perfetto. Ho ricopiato il frontespizio. Dopo la prima non ho dormito per un mese; ho aperto il conto per sua madre. Non mi ha mai chiesto niente nessuno. È questo, il furto perfetto: non finisce mai.»', weigh: 'Rubò l\'opera di un amico morto e passò la vita a risarcirla in segreto.' },
    ],
  },
  {
    id: 't29', title: 'La farina del mugnaio', occ: 'mugnaio/mugnaia', age: [32, 76], causes: ['vecchiaia', 'schiacciamento sotto la macina'], tags: ['lavoro', 'colpa', 'guerra'],
    rel: { role: 'padrone del mulino', note: 'Proprietario terriero; fece arrestare {nome}.' }, wit: 'lavorante del mulino',
    official: { title: 'Verbale dell\'Annona', source: 'Ufficio Annonario', text: 'Nella farina del mulino condotto da {nome} {cognome} fu trovato gesso in misura di un decimo. Frode alimentare in tempo di carestia. Il padrone, {altro}, denunciò il conduttore.' },
    witness: '«Il gesso arrivava con i carri del padrone, di notte, nei sacchi con il suo marchio. {nome} una volta ne ha rovesciato uno nel fiume. Il giorno dopo il fattore è venuto a misurare la casa dove stavamo, per lo sfratto.»',
    claim: '«Il mulino era affidato a me. Rispondo io di quello che esce dalla tramoggia.»',
    recommended: 'trial', rule: 'Art. 21: frode alimentare in carestia → La Prova.', conflict: 'farina che pesava troppo', memory: 'un sacco rovesciato nel fiume',
    variants: [
      { truth: 'Il gesso era imposto dal padrone sotto minaccia di sfratto. {nome} obbedì, e quando l\'Annona arrivò il padrone lo denunciò per primo.', flawed: 'ufficiale', why: 'L\'Annona prese per buona la denuncia del proprietario: il conduttore non aveva carte da opporre.', tone: 'menzogna', confess: '«Ho rovesciato un sacco, una volta sola. Il giorno dopo misuravano la mia cucina. Avevo la suocera a letto e l\'inverno addosso. Ho macinato il gesso. La gente di {luogo} ha mangiato pietra per un anno perché io non dormissi in un fosso.»', weigh: 'Avvelenò il pane del paese per non perdere la casa.' },
      { truth: 'Il padrone forniva il gesso; ma {nome} ne aggiungeva dell\'altro per conto proprio, rivendendo la farina risparmiata.', flawed: 'teste', why: 'Il lavorante dice il vero sui carri del padrone e ignora i sacchi che uscivano dal retro.', tone: 'evasiva', confess: '«Un decimo era del padrone. L\'altro mezzo decimo era mio. Ho pensato: se la colpa è già sua, un po\' di più non si vede. La farina buona la vendevo a un fornaio di città. Sono stato denunciato per la sua parte. La mia non l\'ha mai contata nessuno.»', weigh: 'Si nascose dietro la colpa di un altro per commetterne una propria.' },
    ],
  },
  {
    id: 't30', title: 'Il disertore nel fienile', occ: 'padre di famiglia/madre di famiglia', age: [40, 80], causes: ['vecchiaia', 'crepacuore'], tags: ['famiglia', 'guerra', 'colpa'],
    rel: { role: 'vicino di casa', note: 'Fucilato per aver dato asilo a un disertore.' }, wit: 'figlio di {nome}',
    official: { title: 'Sentenza del tribunale di guerra', source: 'Tribunale militare territoriale', text: 'Il disertore {cognome} figlio fu rinvenuto nel fienile del vicino {altro}, che venne passato per le armi per favoreggiamento. La famiglia {cognome} risultò estranea.' },
    witness: '«Estranea. Io ero nel nostro fienile fino alla sera prima. Mi hanno spostato di notte, mio padre e mia madre, in quello del vicino. Lui non era in casa. Non l\'ha mai saputo, finché non sono venuti.»',
    claim: '«Non sapevamo dove fosse nostro figlio. L\'abbiamo detto anche al tribunale.»',
    recommended: 'trial', rule: 'Art. 20: esposizione di terzi a pericolo mortale → La Prova.', conflict: 'un figlio spostato di notte', memory: 'paglia sui vestiti della festa',
    variants: [
      { truth: 'Avvertit{o} della perquisizione, {nome} spostò il figlio nel fienile del vicino, a sua insaputa. Il vicino fu fucilato senza capire perché.', flawed: 'ufficiale', why: 'Il tribunale giudicò il luogo del ritrovamento. Nessuno chiese come ci fosse arrivato.', tone: 'menzogna', confess: '«Avevo un\'ora. Il nostro fienile lo avrebbero aperto per primo. Quello di {altro} era a trenta passi e lui era alla fiera. Ho pensato: lo riprendo domani notte. Sono venuti all\'alba. Mio figlio è vivo. Ogni volta che lo guardo vedo anche l\'altro.»', weigh: 'Salvò il figlio mettendolo nella casa di un innocente.' },
      { truth: 'Il vicino sapeva, e si era offerto lui: il suo fienile non era nell\'elenco. Chiese solo che, se andava male, {nome} non dicesse mai che era d\'accordo, per non coinvolgere la moglie.', flawed: 'teste', why: 'Il figlio era nascosto sotto la paglia: non sentì l\'accordo tra i due uomini al cancello.', tone: 'evasiva', confess: '«Me l\'ha proposto lui, sul cancello. “Da me non vengono.” E poi: “Se vengono, tu non sai niente e io non ho moglie”. Ho mantenuto. Mio figlio crede che io l\'abbia fatto ammazzare per salvarlo. Glielo lascio credere: è la parola che ho dato.»', weigh: 'Mantenne un patto di silenzio che lo fa passare per colpevole agli occhi del figlio.' },
    ],
  },
  {
    id: 't31', title: 'La carta sbagliata', occ: 'cartografo di spedizione/cartografa di spedizione', age: [30, 70], causes: ['febbre malarica', 'vecchiaia'], tags: ['viaggio', 'lavoro', 'colpa'],
    rel: { role: 'capo della spedizione', note: 'Perse undici uomini seguendo la carta di {nome}.' }, wit: 'portatore',
    official: { title: 'Relazione della Società Geografica', source: 'Società Geografica', text: 'La carta redatta da {nome} {cognome} collocava il valico sessanta chilometri a nord del vero. La spedizione di {altro} si perse negli acquitrini. Errore imputato a imperizia.' },
    witness: '«Imperizia? {nome} il valico vero lo conosceva: ci eravamo passati insieme l\'anno prima. Di là c\'è una valle con dei villaggi. La spedizione aveva i picconi, i fucili e un contratto minerario.»',
    claim: '«Ho sbagliato i rilievi. Lo strumento era starato.»',
    recommended: 'trial', rule: 'Art. 22: imperizia con esito mortale plurimo → La Prova.', conflict: 'sessanta chilometri sulla carta', memory: 'una valle vista una volta dall\'alto',
    variants: [
      { truth: '{nome} falsificò la carta per tenere la spedizione mineraria lontana dai villaggi della valle. Non previde gli acquitrini.', flawed: 'ufficiale', why: 'La Società attribuì all\'imperizia ciò che era un sabotaggio: {nome} non corresse mai la versione.', tone: 'evasiva', confess: '«Ho visto cosa avevano fatto nell\'altra valle, quelli della Compagnia. Ho spostato il valico con la matita. Pensavo: gireranno a vuoto e torneranno. Non conoscevo il nord. Undici uomini. Li ho ammazzati con una gomma e una matita, per gente che non ha mai saputo il mio nome.»', weigh: 'Falsificò una carta per proteggere dei villaggi, e mandò a morire undici uomini.' },
      { truth: 'Fu davvero imperizia: {nome} aveva perso i taccuini e ridisegnò il valico a memoria per non ammetterlo.', flawed: 'teste', why: 'Il portatore conosce il valico e non concepisce che un cartografo possa averlo dimenticato.', tone: 'menzogna', confess: '«I taccuini mi erano caduti nel fiume al ritorno. Non l\'ho detto: mi avrebbero tolto l\'incarico. Ho disegnato a memoria. La memoria, a tavolino, è molto sicura di sé.»', weigh: 'Nascose una perdita per orgoglio, e undici uomini seguirono la sua memoria.' },
    ],
  },
  {
    id: 't32', title: 'Due in acqua', occ: 'bagnino/maestra di nuoto', age: [22, 68], causes: ['vecchiaia', 'annegamento'], tags: ['lavoro', 'colpa', 'lutto'],
    rel: { role: 'genitore del ragazzo annegato', note: 'Non ha mai accettato l\'esito dell\'inchiesta.' }, wit: 'villeggiante',
    official: { title: 'Inchiesta sull\'annegamento allo stabilimento', source: 'Capitaneria di porto', text: 'Due ragazzi furono trascinati dalla corrente. {nome} {cognome} ne trasse in salvo uno; l\'altro, figlio di {altro}, annegò. Condotta giudicata conforme.' },
    witness: '«Conforme, sì. Ma io ho visto: il figlio di {altro} era più vicino a riva. {nome} gli è passat{o} accanto, a due bracciate, ed è andat{o} oltre, verso l\'altro. Quello più lontano era il figlio del proprietario dei bagni.»',
    claim: '«Ne ho preso uno. Non potevo prenderli tutti e due.»',
    recommended: 'renewal', rule: 'Art. 12: condotta conforme accertata → Rinnovo.', conflict: 'due bracciate di distanza', memory: 'una mano che esce dall\'acqua e poi no',
    variants: [
      { truth: '{nome} oltrepassò il ragazzo più vicino perché nuotava ancora, mentre l\'altro era già sotto. Fece la scelta tecnicamente giusta; il primo cedette prima del previsto.', flawed: 'teste', why: 'Il villeggiante vide le distanze e non lo stato dei due ragazzi; il resto lo aggiunse la malignità del paese.', tone: 'evasiva', confess: '«Quello vicino teneva la testa fuori e mi ha guardat{o}. L\'altro non si vedeva più. Si va da chi è sotto: è la regola. Gli ho gridato “tieni duro”. Ha tenuto duro venti secondi. Me ne servivano quaranta. Che fosse il figlio del padrone l\'ho saputo a riva.»', weigh: 'Applicò la regola giusta, e un ragazzo morì guardandolo passare.' },
      { truth: '{nome} riconobbe il figlio del padrone e andò da lui, pensando al posto. Il ragazzo più vicino poteva essere salvato per primo.', flawed: 'ufficiale', why: 'L\'inchiesta valutò il salvataggio riuscito, non l\'ordine delle scelte.', tone: 'menzogna', confess: '«L\'ho riconosciuto dal costume rosso. Ho pensato al contratto dell\'anno dopo. È durato quanto una bracciata, quel pensiero. Abbastanza per passare oltre.»', weigh: 'Scelse chi salvare pensando al proprio impiego.' },
    ],
  },
  {
    id: 't33', title: 'Le lettere dello scrivano', occ: 'scrivano pubblico/scrivana pubblica', age: [35, 82], causes: ['vecchiaia', 'bronchite'], tags: ['lavoro', 'colpa', 'lutto'],
    rel: { role: 'madre analfabeta', note: 'Ricevette per nove anni lettere dal figlio emigrato.' }, wit: 'ufficiale postale',
    official: { title: 'Esposto dei nipoti', source: 'Pretura di {luogo}', text: 'Lo scrivano {cognome} si fece pagare per nove anni la lettura e la risposta a lettere del figlio emigrato di {altro}. Il figlio era morto in miniera il primo anno. Le lettere erano scritte dallo scrivano stess{o}. Truffa continuata.' },
    witness: '«Dall\'estero, per quel nome, in nove anni è arrivata una busta sola: listata a lutto. L\'ha ritirata {nome}, con la delega. E la vecchia, fino all\'ultimo, veniva allo sportello tutta contenta a chiedere se c\'era posta dal suo ragazzo.»',
    claim: '«Leggevo e scrivevo a tariffa. È il mio mestiere.»',
    recommended: 'trial', rule: 'Art. 21: truffa continuata ai danni di persona incapace → La Prova.', conflict: 'nove anni di lettere inventate', memory: 'una busta listata a lutto mai consegnata',
    variants: [
      { truth: '{nome} nascose la morte del figlio e inventò le lettere perché la madre non morisse di dolore. La tariffa la riscuoteva perché lei non sospettasse; la metteva da parte e pagò con quella il suo funerale.', flawed: 'ufficiale', why: 'L\'esposto dei nipoti, che si aspettavano i risparmi della vecchia, chiama truffa ciò che non capisce.', tone: 'evasiva', confess: '«Ho aperto la busta nera e lei era lì fuori che aspettava. Ho letto: “Cara madre, sto bene, qui nevica”. Poi non ho più potuto smettere. Due soldi a lettera li prendevo, se no capiva. Sono tutti in una scatola: ci ho pagato la sua cassa. Aveva un figlio che scriveva benissimo.»', weigh: 'Mentì per nove anni a una madre per risparmiarle un lutto.' },
      { truth: '{nome} cominciò per pietà e continuò per denaro: la vecchia, grata, gli lasciò la casa.', flawed: 'teste', why: 'L\'ufficiale postale ricorda la gioia della vecchia, non il testamento.', tone: 'menzogna', confess: '«Il primo anno era pietà. Poi lei ha cominciato a dire: “Lei è come un figlio”. E io ho cominciato a far scrivere al figlio vero: “Fidati dello scrivano, mamma”. La casa è intestata a me. L\'ho scritta io, quella volontà. Con la voce di un morto.»', weigh: 'Usò la voce di un figlio morto per farsi lasciare un\'eredità.' },
    ],
  },
  {
    id: 't34', title: 'L\'abbattimento', occ: 'veterinario provinciale/veterinaria provinciale', age: [35, 74], causes: ['vecchiaia', 'calcio di un cavallo'], tags: ['lavoro', 'colpa'],
    rel: { role: 'allevatore', note: 'Perse l\'intera mandria per ordine di {nome}.' }, wit: 'macellaio di {luogo}',
    official: { title: 'Ricorso degli allevatori', source: 'Prefettura', text: 'Il veterinario {cognome} ordinò l\'abbattimento di quattrocento capi per un\'epizoozia mai confermata dal laboratorio. Gli allevatori, tra cui {altro}, furono rovinati. Sospett{o} di favorire i grossisti forestieri.' },
    witness: '«Io le bestie le apro. Quelle che ho visto dopo l\'abbattimento avevano i polmoni marci, tutte. Il laboratorio ha detto di no? Il laboratorio è del Consorzio, e il Consorzio aveva i contratti con l\'esercito da onorare.»',
    claim: '«Ho applicato il regolamento di polizia veterinaria.»',
    recommended: 'renewal', rule: 'Art. 12: atto d\'ufficio non provato come doloso → Rinnovo.', conflict: 'quattrocento capi in una fossa', memory: 'odore di calce viva',
    variants: [
      { truth: 'L\'epizoozia era reale e il laboratorio del Consorzio la negò per non perdere le forniture militari. {nome} ordinò l\'abbattimento da sol{o}, sapendo di rovinare gli allevatori e se stess{o}.', flawed: 'ufficiale', why: 'Il ricorso si fonda sul referto del laboratorio, che era interessato a negare.', tone: 'evasiva', confess: '«Se quella carne arrivava ai reggimenti, erano migliaia. Il laboratorio ha scritto “negativo” e mi ha fatto capire di firmare. Ho firmato l\'abbattimento invece. {altro} mi ha sputato in faccia sul sagrato. Aveva ragione dal suo punto. Io dal mio. I punti non si sono mai incontrati.»', weigh: 'Rovinò degli innocenti per impedire un contagio che nessuno voleva ammettere.' },
      { truth: 'Le bestie erano malate solo in parte. {nome} estese l\'abbattimento a tutte le stalle in cambio di denaro dai grossisti, che ricomprarono le terre a un terzo.', flawed: 'teste', why: 'Il macellaio vide davvero polmoni marci: quelli della prima stalla. Le altre trecento bestie non le aprì nessuno.', tone: 'menzogna', confess: '«La prima stalla era malata davvero: è questo che mi ha dato l\'idea. Le altre undici erano sane. I grossisti pagavano un tanto a capo abbattuto. Ho firmato quattrocento volte. Il macellaio ha visto le quaranta giuste.»', weigh: 'Usò un\'epidemia vera per coprirne una inventata, a pagamento.' },
    ],
  },
  {
    id: 't35', title: 'I bambini dell\'ospizio', occ: 'economo dell\'orfanotrofio/direttrice dell\'orfanotrofio', age: [40, 80], causes: ['vecchiaia', 'polmonite'], tags: ['lavoro', 'colpa', 'famiglia'],
    rel: { role: 'ispettore della Provincia', note: 'Scoprì le adozioni irregolari.' }, wit: 'ex ospite dell\'orfanotrofio',
    official: { title: 'Relazione ispettiva', source: 'Deputazione Provinciale', text: 'Dall\'orfanotrofio retto da {nome} {cognome} ventitré minori furono «collocati» presso famiglie senza alcun atto, dietro versamento di somme non registrate. Tratta di minori.' },
    witness: '«A dodici anni ci mandavano all\'opificio della Provincia, dodici ore al giorno ai telai. Di quelli partiti con me ne sono tornati la metà. Io l\'anno prima fui dat{o} a un fabbro di montagna senza figli. Mi ha lasciato la fucina. I soldi che ha versato li ho rivisti: erano nella mia dote.»',
    claim: '«Ho collocato i bambini dove c\'era posto. Le carte non le ho fatte.»',
    recommended: 'trial', rule: 'Art. 20: tratta di minori → La Prova.', conflict: 'ventitré nomi senza atto', memory: 'un bambino con una valigia di cartone',
    variants: [
      { truth: '{nome} collocava i bambini di nascosto per sottrarli all\'opificio provinciale, sceglieva le famiglie una per una e restituiva il denaro versato come dote.', flawed: 'ufficiale', why: 'L\'ispezione contò gli atti mancanti e le somme non registrate, e non seguì nessuno dei ventitré.', tone: 'evasiva', confess: '«A dodici anni la Provincia se li prendeva per i telai. Io li facevo sparire a undici. Ho guardato in faccia ogni famiglia. I soldi li chiedevo per vedere se ci tenevano; poi li cucivo nell\'orlo del cappotto del bambino. Ventitré. Ne ho sbagliato uno. Uno solo, ma lo so.»', weigh: 'Violò la legge per sottrarre dei bambini a un destino peggiore.' },
      { truth: '{nome} vendeva i bambini al miglior offerente. Qualcuno finì bene, per caso; la dote del teste veniva dal fabbro, non da {nome}.', flawed: 'teste', why: 'Il teste fu fortunato, e attribuisce a {nome} la bontà del fabbro che lo crebbe.', tone: 'menzogna', confess: '«Chi pagava di più. Il fabbro era un brav\'uomo: è stato un caso. La dote gliel\'ha cucita lui nel cappotto, non io. Degli altri ventidue non ho mai chiesto. Era la condizione: chi compra non vuole visite.»', weigh: 'Vendette dei bambini e non volle mai sapere che ne fosse stato.' },
    ],
  },
  {
    id: 't36', title: 'Il nodo del boia', occ: 'esecutore di giustizia/esecutrice di giustizia', age: [40, 78], causes: ['vecchiaia', 'impiccagione — per mano propria'], tags: ['lavoro', 'colpa', 'fede'],
    rel: { role: 'condannato', note: 'L\'esecuzione fallì due volte prima di riuscire.' }, wit: 'cappellano delle carceri',
    official: { title: 'Verbale dell\'esecuzione', source: 'Procura del Re', text: 'L\'esecuzione di {altro} fallì due volte per rottura della corda, preparata dall\'esecutore {cognome}. Alla terza ebbe corso. L\'esecutore fu richiamato per grave imperizia.' },
    witness: '«Imperizia. In ventidue anni non aveva sbagliato un nodo. La notte prima mi ha chiesto se è vero che, quando la corda si rompe tre volte, il re fa grazia. Gli ho detto di sì: è un\'usanza. Ne ha preparate tre.»',
    claim: '«La canapa era fradicia. Ho eseguito, alla fine.»',
    recommended: 'renewal', rule: 'Art. 12: atto d\'ufficio eseguito → Rinnovo.', conflict: 'una corda preparata per rompersi', memory: 'la botola che si apre tre volte',
    variants: [
      { truth: '{nome} era convint{o} dell\'innocenza del condannato e indebolì due corde sperando nella grazia d\'uso. La terza gliela fornì il procuratore in persona.', flawed: 'ufficiale', why: 'Il verbale chiama imperizia un sabotaggio che non si poteva nominare senza ammettere il dubbio sulla condanna.', tone: 'evasiva', confess: '«Aveva fatto il nome di un altro per tutto il processo, e io quell\'altro l\'avevo visto ridere in aula. Ne ho tagliate due a metà trefolo. Alla seconda il procuratore è sceso con una corda sua. Ho fatto il nodo. Bene, come sempre: almeno quello glielo dovevo.»', weigh: 'Tentò di salvare un condannato sabotando la propria opera, e poi lo impiccò.' },
      { truth: '{nome} indebolì le corde non per salvarlo ma per farlo soffrire: il condannato aveva ucciso un suo parente.', flawed: 'teste', why: 'Il cappellano sentì una domanda sulla grazia e ne dedusse la pietà. {nome} voleva sapere quante volte poteva ripetere.', tone: 'menzogna', confess: '«Gli ho chiesto della grazia per sapere dove fermarmi. Due volte è caduto vivo. Due volte l\'ho rimesso su. Aveva ammazzato mio cognato per un debito. La giustizia gli doveva una morte. Io gliene ho date tre.»', weigh: 'Usò l\'ufficio per infliggere una vendetta.' },
    ],
  },
];
