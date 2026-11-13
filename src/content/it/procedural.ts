// Materiale per la generazione procedurale: nomi, luoghi, pattern di eventi di vita,
// frasi di ereditarietà. I template dei casi sono in templates.ts.
import type { TraitKey, Traits } from '../../engine/types';

export const NAMES_F = [
  'Adele', 'Brigida', 'Clara', 'Dora', 'Elvira', 'Fosca', 'Gilda', 'Irma', 'Lisetta', 'Marta', 'Nives', 'Ofelia',
  'Petra', 'Rina', 'Selma', 'Tecla', 'Ursula', 'Vanda', 'Zita', 'Amalia', 'Berta', 'Corinna', 'Edvige', 'Greta',
  'Ilde', 'Leda', 'Mina', 'Norma', 'Olimpia', 'Rachele',
];
export const NAMES_M = [
  'Aldo', 'Bruno', 'Corrado', 'Dario', 'Emil', 'Fausto', 'Gaspare', 'Ivo', 'Leone', 'Marco', 'Nando', 'Oreste',
  'Piero', 'Rocco', 'Silvano', 'Tullio', 'Ugo', 'Valerio', 'Zeno', 'Anselmo', 'Berto', 'Cesco', 'Elio', 'Guido',
  'Ilario', 'Lando', 'Matteo', 'Nereo', 'Osvaldo', 'Remo',
];
export const SURNAMES = [
  'Abbondio', 'Bellarmino', 'Carraro', 'Dalmasso', 'Erbetta', 'Farinetti', 'Galvan', 'Imbriani', 'Lorandi', 'Mazzacurati',
  'Nardon', 'Ottolenghi', 'Pavan', 'Quaglia', 'Rostagno', 'Salvadori', 'Tornabuoni', 'Ugolini', 'Venier', 'Zanetti',
  'Albrizzi', 'Brambilla', 'Cossutta', 'Donadoni', 'Eccher', 'Fumagalli', 'Ghezzi', 'Laghi', 'Morosin', 'Pezzè',
  'Reuss', 'Sterni', 'Toller', 'Valt', 'Zorzi', 'Krenn', 'Molnar', 'Dornig', 'Hauser', 'Brandt',
];
export const TOWNS = [
  'Mareschiara', 'Sorgiva', 'Altenmark', 'Kessel', 'Brannholm', 'Fontanelle', 'Sant\'Orso', 'Pietralata', 'Vallombrina',
  'Roccafosca', 'Porto Cenere', 'Tre Ponti', 'Malgrate', 'Costa dei Venti', 'Borgo Salice', 'Nebbiolo di Sotto',
  'Campo Rame', 'Lagoscuro', 'Monte Grigio', 'Ca\' del Sale',
];
export const ERAS = ['secolo delle ciminiere', 'secolo dei fili', 'secolo delle lanterne', 'secolo dei campanili'];

export const OTHER_FORMS = [
  'un corvo di campanile', 'un salice sull\'argine', 'un cane randagio', 'una falena', 'una volpe di città', 'un cavallo da tiro',
  'una civetta', 'un gatto di bottega', 'un\'ape operaia', 'un pioppo di confine', 'una rondine', 'un rospo d\'orto',
  'un mulo di montagna', 'una trota di torrente', 'un riccio', 'una gazza',
];

export const PREDISPOSITION: Record<TraitKey, [string, string]> = {
  empatia: ['una sensibilità pronta al dolore altrui', 'una distanza fredda dagli altri'],
  altruismo: ['l\'impulso a dare senza contare', 'l\'abitudine di tenere per sé'],
  onesta: ['il disagio fisico davanti alla menzogna', 'una facilità naturale nel tacere le cose'],
  coraggio: ['una calma strana nel pericolo', 'una prudenza che somiglia alla paura'],
  responsabilita: ['il bisogno di rispondere di tutto', 'la tendenza a lasciare ad altri le conseguenze'],
  ambizione: ['una fame di salire', 'un\'indifferenza quieta per i gradi'],
};

export const TRAIT_LABEL: Record<TraitKey, string> = {
  empatia: 'Empatia', altruismo: 'Altruismo', onesta: 'Onestà', coraggio: 'Coraggio', responsabilita: 'Responsabilità', ambizione: 'Ambizione',
};

/** Paure ereditate, dedotte dalla causa della morte (prima corrispondenza). */
export const FEAR_BY_CAUSE: [string, string][] = [
  ['fuoco', 'il fuoco e l\'odore di bruciato'], ['incendio', 'il fuoco e l\'odore di bruciato'], ['asfissia', 'le stanze senza finestre'],
  ['annega', 'l\'acqua profonda'], ['naufrag', 'l\'acqua profonda'], ['fiume', 'l\'acqua che corre'],
  ['caduta', 'le scale e i parapetti'], ['crollo', 'i soffitti bassi'], ['frana', 'i rumori sordi sottoterra'],
  ['colpo', 'i rumori secchi alle spalle'], ['fucil', 'i rumori secchi alle spalle'], ['coltell', 'le lame'],
  ['veleno', 'i sapori amari'], ['arsenico', 'i sapori amari'], ['febbre', 'il caldo delle coperte'], ['tifo', 'l\'acqua ferma'],
  ['polmon', 'la nebbia e il fumo'], ['fame', 'le dispense vuote'], ['freddo', 'la neve'], ['assider', 'la neve'],
  ['cuore', 'gli sforzi improvvisi'], ['treno', 'i fischi di locomotiva'], ['carro', 'le strade in discesa'],
  ['impicc', 'i colletti stretti'], ['vecchiaia', 'il silenzio delle case vuote'],
];
export const FEAR_DEFAULT = 'le porte chiuse a chiave';

export interface EventPattern {
  id: string;
  tags: string[];
  age: [number, number];
  text: string;
  mem?: string;
  fear?: string;
  talent?: string;
  conflict?: string;
  trait?: Partial<Traits>;
}

// {luogo} luogo d'origine · {altro} persona chiave del caso · {occ} occupazione
export const EVENTS: EventPattern[] = [
  { id: 'e01', tags: ['infanzia'], age: [5, 9], text: 'Perde un genitore e viene cresciuto dai nonni a {luogo}.', mem: 'una mano grande che lo teneva per il colletto', trait: { responsabilita: 2 } },
  { id: 'e02', tags: ['infanzia'], age: [6, 10], text: 'Sopravvive a una febbre che svuota mezza classe.', fear: 'le campane a morto', trait: { empatia: 1 } },
  { id: 'e03', tags: ['infanzia'], age: [7, 11], text: 'Impara a leggere di nascosto, sui registri del parroco.', talent: 'leggere le calligrafie difficili', trait: { ambizione: 1 } },
  { id: 'e04', tags: ['infanzia', 'colpa'], age: [8, 12], text: 'Lascia che un compagno sia punito al suo posto. Non lo dirà mai.', conflict: 'una punizione subita da un altro', trait: { onesta: -2 } },
  { id: 'e05', tags: ['infanzia'], age: [9, 13], text: 'Viene mandato a servizio lontano da casa.', mem: 'un fagotto legato con lo spago', trait: { coraggio: 1 } },
  { id: 'e06', tags: ['gioventu', 'lavoro'], age: [13, 17], text: 'Entra a bottega e impara il mestiere più in fretta del previsto.', talent: 'le mani svelte', trait: { ambizione: 1 } },
  { id: 'e07', tags: ['gioventu'], age: [15, 19], text: 'Assiste a un incendio a {luogo} e porta fuori qualcuno.', mem: 'il peso di un corpo sulle spalle', trait: { coraggio: 2 } },
  { id: 'e08', tags: ['gioventu', 'colpa'], age: [15, 20], text: 'Ruba una somma piccola e la restituisce anni dopo, con gli interessi.', conflict: 'un furto mai confessato', trait: { onesta: -1, responsabilita: 1 } },
  { id: 'e09', tags: ['gioventu', 'amore'], age: [17, 22], text: 'Si innamora di una persona promessa a un altro.', mem: 'un nome detto sottovoce in chiesa', trait: { empatia: 1 } },
  { id: 'e10', tags: ['gioventu'], age: [18, 22], text: 'Parte per il servizio di leva e torna diverso.', fear: 'gli ordini gridati', trait: { coraggio: 1, empatia: -1 } },
  { id: 'e11', tags: ['gioventu', 'viaggio'], age: [18, 24], text: 'Emigra per tre stagioni e torna senza un soldo.', mem: 'un porto in cui nessuno parlava la sua lingua', trait: { ambizione: -1 } },
  { id: 'e12', tags: ['adulto', 'famiglia'], age: [22, 30], text: 'Si sposa. Il matrimonio è descritto da tutti come «tranquillo».', mem: 'due sedie accostate alla stufa' },
  { id: 'e13', tags: ['adulto', 'famiglia', 'lutto'], age: [24, 34], text: 'Seppellisce un figlio piccolo.', mem: 'una cassa che pesava troppo poco', fear: 'le culle vuote', trait: { empatia: 2 } },
  { id: 'e14', tags: ['adulto', 'lavoro'], age: [25, 35], text: 'Apre un\'attività in proprio a {luogo} indebitandosi.', conflict: 'un debito che decide per lui', trait: { ambizione: 2 } },
  { id: 'e15', tags: ['adulto', 'colpa'], age: [25, 40], text: 'Testimonia il falso in una causa di confine tra vicini.', conflict: 'una falsa testimonianza', trait: { onesta: -2 } },
  { id: 'e16', tags: ['adulto'], age: [26, 40], text: 'Accoglie in casa un parente rovinato e lo mantiene per anni.', trait: { altruismo: 2 }, mem: 'un piatto in più, sempre' },
  { id: 'e17', tags: ['adulto', 'lavoro'], age: [28, 42], text: 'Rifiuta una promozione che avrebbe richiesto di licenziare altri.', trait: { altruismo: 1, ambizione: -2 } },
  { id: 'e18', tags: ['adulto', 'lavoro'], age: [28, 42], text: 'Ottiene un avanzamento ai danni di un collega più meritevole.', conflict: 'un posto che non era suo', trait: { ambizione: 2, onesta: -1 } },
  { id: 'e19', tags: ['adulto', 'guerra'], age: [20, 40], text: 'Attraversa gli anni dell\'Occupazione tenendo la testa bassa.', fear: 'i passi cadenzati', trait: { coraggio: -1 } },
  { id: 'e20', tags: ['adulto', 'guerra'], age: [20, 40], text: 'Durante l\'Occupazione nasconde qualcuno in soffitta per un inverno.', mem: 'tre colpi leggeri sul soffitto', trait: { coraggio: 2, altruismo: 1 } },
  { id: 'e21', tags: ['adulto', 'colpa', 'guerra'], age: [20, 40], text: 'Durante l\'Occupazione fa un nome per salvarne un altro.', conflict: 'un nome detto a chi non doveva saperlo', trait: { onesta: -1, responsabilita: 1 } },
  { id: 'e22', tags: ['adulto'], age: [30, 45], text: 'Sopravvive alla piena del fiume salendo sul tetto con i vicini.', fear: 'l\'acqua che sale', mem: 'un tetto pieno di gente che cantava' },
  { id: 'e23', tags: ['adulto', 'colpa'], age: [30, 50], text: 'Lascia morire una lite di famiglia senza mai fare il primo passo.', conflict: 'un fratello a cui non ha più parlato' },
  { id: 'e24', tags: ['adulto'], age: [30, 50], text: 'Comincia a bere la sera. Smette dieci anni dopo, da un giorno all\'altro.', trait: { responsabilita: 1 }, mem: 'una bottiglia murata in cantina' },
  { id: 'e25', tags: ['adulto', 'fede'], age: [30, 55], text: 'Fa un voto e lo mantiene a costo di rimetterci la bottega.', trait: { responsabilita: 2 } },
  { id: 'e26', tags: ['adulto', 'fede'], age: [30, 55], text: 'Smette di andare in chiesa dopo una sepoltura negata.', trait: { coraggio: 1 }, conflict: 'un conto aperto con il cielo' },
  { id: 'e27', tags: ['adulto', 'lavoro'], age: [32, 50], text: 'Insegna il mestiere a un ragazzo che non era suo figlio.', talent: 'la pazienza con chi impara', trait: { altruismo: 1 } },
  { id: 'e28', tags: ['adulto'], age: [35, 55], text: 'Vince una causa che sapeva di meritare di perdere.', conflict: 'una vittoria ingiusta', trait: { onesta: -1 } },
  { id: 'e29', tags: ['adulto', 'viaggio'], age: [35, 55], text: 'Fa un solo viaggio in tutta la vita: fino al mare, e ritorno.', mem: 'la prima volta che ha visto il mare' },
  { id: 'e30', tags: ['adulto', 'colpa'], age: [35, 55], text: 'Tace su un torto visto fare a {altro}.', conflict: 'un silenzio che è costato a un altro', trait: { coraggio: -2 } },
  { id: 'e31', tags: ['maturo'], age: [45, 60], text: 'Perde il coniuge e non cambia più la disposizione dei mobili.', mem: 'una sedia che nessuno doveva spostare', fear: 'le case in cui si sposta qualcosa' },
  { id: 'e32', tags: ['maturo', 'lavoro'], age: [45, 62], text: 'Viene messo da parte per uno più giovane.', trait: { ambizione: -1 }, conflict: 'un mestiere tolto di mano' },
  { id: 'e33', tags: ['maturo'], age: [45, 65], text: 'Paga di nascosto gli studi di un nipote.', trait: { altruismo: 2 } },
  { id: 'e34', tags: ['maturo', 'colpa'], age: [45, 65], text: 'Brucia una lettera che avrebbe dovuto consegnare.', conflict: 'una lettera mai arrivata', trait: { onesta: -1 } },
  { id: 'e35', tags: ['maturo'], age: [50, 68], text: 'Si riconcilia con un nemico di trent\'anni davanti a un bicchiere.', trait: { empatia: 1 }, mem: 'una stretta di mano durata troppo' },
  { id: 'e36', tags: ['maturo', 'fede'], age: [50, 70], text: 'Comincia a tenere un quaderno dove segna i propri torti, in colonna.', trait: { responsabilita: 2, onesta: 1 }, talent: 'tenere i conti' },
  { id: 'e37', tags: ['maturo'], age: [50, 70], text: 'Pianta un noce sapendo che non ne mangerà i frutti.', mem: 'la terra sotto le unghie', trait: { altruismo: 1 } },
  { id: 'e38', tags: ['vecchio'], age: [60, 80], text: 'Resta l\'ultimo a {luogo} a ricordare com\'era prima della ferrovia.', mem: 'una strada bianca senza binari' },
  { id: 'e39', tags: ['vecchio', 'colpa'], age: [60, 80], text: 'Cambia testamento tre volte in un anno.', conflict: 'un\'eredità usata come un guinzaglio', trait: { empatia: -1 } },
  { id: 'e40', tags: ['vecchio'], age: [60, 85], text: 'Insegna ai bambini del cortile un gioco che nessun altro conosce più.', talent: 'farsi ascoltare dai bambini', trait: { empatia: 1 } },
  { id: 'e41', tags: ['vecchio'], age: [62, 85], text: 'Regala gli attrezzi del mestiere a chi glieli chiede per primo.', trait: { altruismo: 1 } },
  { id: 'e42', tags: ['gioventu', 'lavoro'], age: [14, 20], text: 'Si ferisce sul lavoro e porta la cicatrice per tutta la vita.', fear: 'le macchine in movimento', mem: 'un fazzoletto che non bastava' },
  { id: 'e43', tags: ['adulto', 'amore'], age: [25, 45], text: 'Ama per vent\'anni qualcuno a cui non lo dice.', mem: 'una finestra guardata ogni sera', conflict: 'una cosa mai detta' },
  { id: 'e44', tags: ['adulto', 'colpa', 'lavoro'], age: [25, 50], text: 'Chiude un occhio su un peso falso, una volta, e poi sempre.', conflict: 'una bilancia che non tornava', trait: { onesta: -2 } },
];

export const TEMPERS = [
  'meticoloso fino all\'ossessione', 'gentile e lentissimo', 'brusco ma giusto', 'silenzioso', 'chiacchierone instancabile',
  'superstizioso', 'ambizioso senza cattiveria', 'malinconico', 'allegro senza motivo', 'diffidente dei superiori',
];

export const VERDICT_REACTIONS = {
  ascension: [
    '{nome} guarda in alto, poi te. «Non credevo di meritarlo.» Il montacarichi si chiude senza rumore.',
    '«Così presto?» {nome} si alza, si aggiusta il colletto e sale. Non si volta.',
    '{nome} annuisce, come davanti a un conto che torna. Il montacarichi lo prende.',
  ],
  renewal: [
    '«Da capo, allora.» {nome} firma dove indichi. La penna gratta appena.',
    '{nome} legge la parola due volte. «Speriamo in una vita più corta di rimpianti.» Firma.',
    '«Di nuovo» dice {nome}, e non capisci se è una domanda. Timbri.',
  ],
  trial: [
    '{nome} abbassa la testa. «Me l\'aspettavo.» Il timbro fa un rumore più pieno del solito.',
    '«Una prova. Di cosa, lo sapete voi.» {nome} si alza prima che tu finisca di scrivere.',
    '{nome} non protesta. Chiede soltanto se farà male. Il regolamento non lo dice.',
  ],
  otherForm: [
    '{nome} resta a guardarsi le mani mentre smettono di essere mani.',
    '«Una bestia. O una pianta.» {nome} ci pensa. «C\'è di peggio. Ero una persona.»',
    '{nome} chiede se ricorderà di essere stato qualcuno. Non rispondi. È una risposta.',
  ],
  waitingRoom: [
    '{nome} si siede sulla panca indicata, le mani sulle ginocchia. «Quanto?» Nessuno lo sa.',
    '«Aspettare.» {nome} guarda la porta della sala. Dall\'interno non viene alcun suono.',
    '{nome} prende posto senza una parola. Dalla panca, continua a guardarti finché la porta non si chiude.',
  ],
} as const;
