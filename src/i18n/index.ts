// Stringhe dell'interfaccia. Per aggiungere l'inglese: creare un dizionario `en` con le stesse
// chiavi, registrarlo in PACKS e fornire i contenuti in src/content/en (vedi src/content/index.ts).
const it = {
  title: 'The Reincarnation Office',
  tagline: 'Ufficio Reincarnazioni · Sezione Occidentale',
  menu: { newCampaign: 'Nuova campagna', continueCampaign: 'Continua la campagna', endless: 'Modalità Endless', continueEndless: 'Continua Endless', newEndless: 'Nuovo Endless', saves: 'Salvataggi', settings: 'Impostazioni', endings: 'Finali', back: 'Indietro' },
  newGame: { title: 'Assunzione', name: 'Nome dello scrivano', placeholder: 'Nome e cognome', start: 'Firma e prendi servizio', campaignNote: 'Una campagna in cinque capitoli. Il salvataggio automatico occupa uno slot dedicato: una nuova campagna sostituisce quella in corso.', endlessNote: 'Turni senza fine: casi sempre nuovi, anime che ritornano, direttive ed eventi periodici, obiettivi autonomi. Indipendente dalla campagna.', overwrite: 'Esiste già una partita in corso in questa modalità. Cominciandone una nuova, il suo salvataggio automatico verrà sostituito.' },
  hud: { journal: 'Diario', office: 'Ufficio', menu: 'Menu', dossier: 'Fascicolo aperto', credits: 'CE', pending: 'Pendenti', examine: 'Esamina', talk: 'Parla', zoomIn: 'Ingrandisci', zoomOut: 'Riduci', recenter: 'Centra' },
  phases: ['Apertura', 'Mattina', 'Mezzogiorno', 'Pomeriggio', 'Sera'],
  chapters: ['', 'Capitolo I', 'Capitolo II', 'Capitolo III', 'Capitolo IV', 'Capitolo V'],
  common: { close: 'Chiudi', continue: 'Continua', cancel: 'Annulla', confirm: 'Conferma', leave: 'Congedati', day: 'Turno', yes: 'Sì', no: 'No' },
  case: {
    tabs: { fascicolo: 'Fascicolo', documenti: 'Documenti', colloquio: 'Colloquio', evidenze: 'Evidenze', ricostruzione: 'Ricostruzione', sentenza: 'Sentenza' },
    register: 'Registra l\'anima', registered: 'Registrata a protocollo', suspend: 'Sospendi l\'esame', issue: 'Emetti la sentenza', compare: 'Confronta', verify: 'Verifica',
    noNote: 'Niente da annotare in questo passaggio.', recommended: 'Destinazione raccomandata', motivation: 'Motivazione', evidence: 'Evidenze a sostegno', conceal: 'Ometti l\'irregolarità dal registro',
    irregular: 'Questa sentenza sarà IRREGOLARE', regular: 'Sentenza regolare', special: 'Sentenze speciali', closeFile: 'Chiudi il fascicolo',
  },
  status: { documento: 'Documento', testimonianza: 'Testimonianza', verificato: 'Verificato', ipotesi: 'Ipotesi', contraddizione: 'Contraddizione', non_confermato: 'Non confermato' },
  tone: { sincera: 'tono: sincero', evasiva: 'tono: evasivo', menzogna: 'tono: menzognero', silenzio: 'tono: reticente', confusa: 'tono: confuso' },
  journal: { tabs: { agenda: 'Agenda', diario: 'Diario', misteri: 'Misteri', collegamenti: 'Collegamenti', cronologia: 'Cronologia', codex: 'Codex' } },
  office: { tabs: { indicatori: 'Indicatori', personale: 'Personale', reparti: 'Reparti', strumenti: 'Strumenti', direttive: 'Direttive' } },
  stats: { efficienza: 'Efficienza', morale: 'Morale del personale', pendenti: 'Pratiche pendenti', reputazione: 'Reputazione', irregolari: 'Giudizi irregolari', ricorsi: 'Ricorsi', anomalie: 'Anomalie', sospetto: 'Sospetto' },
  cats: { personaggi: 'Personaggi', anime: 'Anime', documenti: 'Documenti', simboli: 'Simboli', indizi: 'Indizi', eventi: 'Eventi', luoghi: 'Luoghi', cronologie: 'Cronologie', collegamenti: 'Collegamenti', misteri: 'Misteri' },
  saves: { title: 'Salvataggi', auto: 'Salvataggio automatico — Campagna', endless: 'Salvataggio automatico — Endless', slot: 'Slot', empty: 'Vuoto', corrupt: 'Dati danneggiati', save: 'Salva qui', load: 'Carica', del: 'Elimina', exp: 'Esporta JSON', imp: 'Importa JSON', overwrite: 'Sovrascrivere questo salvataggio?', delConfirm: 'Eliminare definitivamente questo salvataggio?', loadConfirm: 'Caricare questo salvataggio? I progressi non salvati della partita in corso andranno perduti.' },
  settings: { title: 'Impostazioni', master: 'Volume generale', music: 'Ambiente e musica', sfx: 'Effetti', textSpeed: 'Velocità del testo', flicker: 'Riduci lo sfarfallio delle luci', fullscreen: 'Schermo intero', language: 'Lingua', languageNote: 'Italiano' },
  pause: { title: 'Pausa', resume: 'Riprendi', save: 'Salva / Carica', stats: 'Statistiche', toMenu: 'Torna al menu principale' },
};

export type Dict = typeof it;
const PACKS: Record<string, Dict> = { it };
export let ui: Dict = PACKS.it;
export function setLanguage(code: string): void {
  ui = PACKS[code] ?? PACKS.it;
  document.documentElement.lang = code in PACKS ? code : 'it';
}
export const LANGUAGES = Object.keys(PACKS);
