// Contenuti gestionali: ruoli, reparti, strumenti, direttive.
import type { Cond, DeptId, StaffRole } from '../../engine/types';

export const ROLES: Record<StaffRole, { label: string; desc: string }> = {
  registratore: { label: 'Registratore', desc: 'Smista gli arrivi alla Reception: riduce l\'accumulo di pratiche pendenti e sostiene l\'efficienza.' },
  scrivano: { label: 'Scrivano d\'ufficio', desc: 'Evade da solo le pratiche pendenti con giudizi d\'ufficio. Rende crediti, ma i giudizi sbrigativi generano ricorsi.' },
  archivista: { label: 'Aiuto archivista', desc: 'Incrocia i fascicoli: nei casi ordinari segnala quale documento presenta incongruenze.' },
  consulente: { label: 'Consulente ai colloqui', desc: 'Assiste ai colloqui: rende riconoscibile il tono delle risposte e sostiene il morale.' },
  custode: { label: 'Custode aggiunto', desc: 'Sorveglia la Sala d\'Attesa: le anime sospese resistono più a lungo e le anomalie si diradano.' },
};

export interface DeptDef { label: string; desc: string; levels: { cost: number; effect: string }[]; cond?: Cond }

export const DEPARTMENTS: Record<DeptId, DeptDef> = {
  reception: { label: 'Reception', desc: 'Dove le anime arrivano e vengono contate.', levels: [
    { cost: 60, effect: 'Secondo sportello: −1 pratica pendente al giorno.' },
    { cost: 120, effect: 'Sala d\'ingresso ampliata: −2 pratiche pendenti al giorno.' },
    { cost: 200, effect: 'Protocollo pneumatico: −3 pratiche pendenti al giorno.' },
  ] },
  judgment: { label: 'Sala dei Giudizi', desc: 'Le scrivanie dove si emettono le sentenze.', levels: [
    { cost: 60, effect: 'Scrivanie restaurate: +3 crediti per sentenza, +5 efficienza.' },
    { cost: 120, effect: 'Lampade nuove: +6 crediti per sentenza, +10 efficienza.' },
    { cost: 200, effect: 'Timbri di precisione: +9 crediti per sentenza, +15 efficienza.' },
  ] },
  archive: { label: 'Archivio', desc: 'Tutto ciò che è stato deciso, e ciò che è stato corretto.', levels: [
    { cost: 80, effect: 'Indice incrociato: i casi di ritorno mostrano per esteso la vita precedente.' },
    { cost: 150, effect: 'Ufficio Revisioni: puoi richiamare un\'anima dalla Sala d\'Attesa e rivederne la sentenza (30 CE).' },
    { cost: 220, effect: 'Scaffali ciechi: dimezza il rischio che le manipolazioni vengano scoperte.' },
  ] },
  interview: { label: 'Sale Colloqui', desc: 'Due stanze, un apparecchio di registrazione.', levels: [
    { cost: 70, effect: 'Cilindri nuovi: il tono delle risposte diventa riconoscibile.' },
    { cost: 130, effect: 'Seconda poltrona: +2 morale al giorno.' },
  ] },
  employee: { label: 'Area Dipendenti', desc: 'Una stufa, un samovar, un orologio marcatempo.', levels: [
    { cost: 50, effect: 'Samovar sempre caldo: +2 morale al giorno.' },
    { cost: 100, effect: 'Brande per i turni lunghi: +4 morale al giorno.' },
    { cost: 180, effect: 'Bacheca del personale: +6 morale al giorno, il personale impara più in fretta.' },
  ] },
  management: { label: 'Direzione di Reparto', desc: 'La pedana di Madame Vesper.', levels: [
    { cost: 90, effect: 'Rapporti puntuali: +1 reputazione al giorno.' },
    { cost: 170, effect: 'Canale riservato: +2 reputazione al giorno; falsificare un rapporto costa la metà.' },
  ], cond: { area: 'management' } },
  restricted: { label: 'Reparto Riservato', desc: 'Non compare in pianta.', levels: [
    { cost: 150, effect: 'Sigilli rinnovati: le anomalie si diradano.' },
    { cost: 250, effect: 'Registro dei barattoli: il Residuo trattenuto compare per esteso in ogni rapporto.' },
  ], cond: { area: 'restricted' } },
};

export interface ToolDef { id: string; label: string; desc: string; cost: number; cond?: Cond }
export const TOOLS: ToolDef[] = [
  { id: 'lente', label: 'Lente del verificatore', desc: 'Nei documenti, i passaggi che contengono un indizio sono segnati a margine.', cost: 60 },
  { id: 'cilindro', label: 'Apparecchio a cilindri portatile', desc: 'Durante i colloqui indica il tono della risposta: sincera, evasiva, menzognera.', cost: 80 },
  { id: 'timbro', label: 'Timbro rapido', desc: '+5 crediti per ogni sentenza emessa.', cost: 50 },
  { id: 'lanterna', label: 'Lanterna di servizio', desc: 'Come quella del Custode. Rischiara gli angoli dell\'ufficio: alcuni dettagli nascosti diventano esaminabili.', cost: 40 },
  { id: 'carta_bianca', label: 'Risma di carta 9/A', desc: 'Carta vecchio lotto, per chi deve rifare un atto senza che si noti. Dimezza il rischio di scoperta quando manipoli una direttiva.', cost: 90, cond: { know: 'k_atti_sostituiti' } },
];

export interface DirectiveDef {
  id: string;
  title: string;
  from: string;
  text: string;
  /** Campagna: giorno d'emissione e durata in giorni. */
  day: number;
  duration: number;
  requirement: string;
}

export const DIRECTIVES: DirectiveDef[] = [
  { id: 'd_quota', title: 'Direttiva 1 — Quota minima', from: 'Direzione di Reparto', day: 2, duration: 2, requirement: 'Almeno 3 pratiche evase per turno.',
    text: 'Ogni scrivania evade non meno di tre pratiche per turno. Le pratiche non evase si considerano trattenute dallo scrivano a titolo personale.' },
  { id: 'd_ricorsi', title: 'Direttiva 2 — Sospensione dei ricorsi', from: 'Direzione di Reparto', day: 4, duration: 3, requirement: 'Nessun ricorso accolto.',
    text: 'In attesa di riordino, l\'esame dei ricorsi è sospeso. Le sentenze impugnate si intendono confermate. Lo scrivano che accoglie un ricorso ne risponde.' },
  { id: 'd_archivio', title: 'Direttiva 3 — Restrizione degli archivi', from: 'Direzione di Reparto', day: 6, duration: 3, requirement: 'Nessuna consultazione di schedari riservati.',
    text: 'La consultazione degli schedari non compresi in pianta è riservata alla Direzione. L\'Archivista è tenuto a segnalare ogni richiesta.' },
  { id: 'd_prove', title: 'Direttiva 4 — Obiettivo trimestrale', from: 'Livelli Superiori, per il tramite della Direzione', day: 8, duration: 2, requirement: 'Almeno una Prova per turno.',
    text: 'Il fabbisogno del trimestre richiede che ogni scrivania destini alla Prova non meno di un\'anima per turno. Le motivazioni saranno adeguate di conseguenza.' },
  { id: 'd_segnalazione', title: 'Direttiva 5 — Obbligo di segnalazione', from: 'Ispettore Quill', day: 10, duration: 3, requirement: 'Nessun giudizio irregolare omesso dal registro.',
    text: 'Ogni giudizio irregolare va segnalato a registro dallo scrivano che lo emette. L\'omissione equivale a concorso.' },
  { id: 'd_ascensioni', title: 'Direttiva 6 — Reintegro del Collegio', from: 'Ispettore Quill, per il Collegio', day: 11, duration: 2, requirement: 'Almeno una Ascensione per turno.',
    text: 'Per il reintegro delle voci mancanti, ogni scrivania dispone non meno di un\'Ascensione per turno. Si prediligano le anime più nitide.' },
];

/** Direttive periodiche della modalità Endless (ruotano). */
export const ENDLESS_DIRECTIVES = ['d_quota', 'd_prove', 'd_segnalazione', 'd_ascensioni', 'd_ricorsi'];

export const CANDIDATE_ORIGINS = [
  'trasferito dall\'Ufficio Smarrimenti', 'ex copista del Catasto delle Colpe', 'proveniente dalla Dogana dei Sogni', 'distaccato dal Registro delle Nascite',
  'già usciere alla Corte dei Rimpianti', 'ex contabile dell\'Economato', 'apprendista dal Deposito Oggetti Non Reclamati',
];
