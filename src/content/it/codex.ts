// Codex: ciò che l'Ufficio dichiara ufficialmente di sé. Le voci si sbloccano con la progressione.
import type { Cond, Destination } from '../../engine/types';

export const DEST_INFO: Record<Destination, { name: string; official: string; door: string }> = {
  ascension: { name: 'L\'Ascensione', official: 'Per le anime il cui fascicolo non reca pendenze. L\'anima è conferita ai Livelli Superiori e cessa il ciclo.', door: 'Il montacarichi d\'ottone.' },
  renewal: { name: 'Il Rinnovo', official: 'La destinazione ordinaria. L\'anima rinasce in una nuova vita umana, alleggerita del Residuo.', door: 'La porta girevole.' },
  trial: { name: 'La Prova', official: 'Per le colpe accertate. L\'anima rinasce in una vita che le ripresenterà ciò che ha mancato.', door: 'La porta di ferro.' },
  otherForm: { name: 'L\'Altra Forma', official: 'L\'anima lascia la forma umana per una vita senza parola. Misura di riposo o di contenimento.', door: 'La porticina.' },
  waitingRoom: { name: 'La Sala d\'Attesa', official: 'Sospensione del giudizio a tempo indeterminato, in attesa di accertamenti.', door: 'La porta imbottita.' },
};

export interface CodexEntry { id: string; group: string; title: string; text: string[]; cond?: Cond }

export const CODEX: CodexEntry[] = [
  { id: 'cx_ufficio', group: 'L\'Ufficio', title: 'Ufficio Reincarnazioni, Sezione Occidentale', text: ['Riceve le anime dei defunti, ne esamina il fascicolo e ne dispone la destinazione.', 'Si lavora su turni. Ogni scrivano risponde delle proprie sentenze con la propria sigla.'] },
  { id: 'cx_turno', group: 'L\'Ufficio', title: 'Il turno', text: ['Si comincia alla propria scrivania, si finisce all\'orologio marcatempo.', 'Le pratiche assegnate vanno evase prima di timbrare l\'uscita. Le ordinarie non evase passano tra le pendenti.', 'Ogni pratica evasa fa avanzare il tempo: i colleghi cambiano posto, alcune cose accadono solo a certe ore.'] },
  { id: 'cx_caso', group: 'Procedura', title: 'L\'esame di un\'anima', text: ['1. Registrazione. 2. Lettura del fascicolo e dei documenti: i passaggi rilevanti vanno annotati toccandoli. 3. Colloquio. 4. Confronto delle evidenze: due elementi che non possono essere veri insieme sono una contraddizione, e una contraddizione si può contestare all\'anima. 5. Sentenza.', 'Nessun passaggio è obbligatorio, tranne l\'ultimo.'] },
  { id: 'cx_irregolare', group: 'Procedura', title: 'Giudizi irregolari', text: ['Ogni fascicolo reca una destinazione raccomandata dal regolamento.', 'Lo scrivano può discostarsene. La sentenza difforme è regolare solo se fondata su almeno un\'evidenza verificata.', 'Un\'irregolarità può essere segnalata a registro (costa reputazione) oppure omessa (alimenta il sospetto).'] },
  { id: 'cx_evidenze', group: 'Procedura', title: 'Gradi dell\'evidenza', text: ['DOCUMENTO: ciò che una carta afferma. Le carte possono essere incomplete, di parte, o rifatte.', 'TESTIMONIANZA: ciò che qualcuno dichiara.', 'VERIFICATO: ciò che è stato ammesso davanti a una contraddizione, o riscontrato su più fonti.', 'IPOTESI: una deduzione dello scrivano, annotata nel diario.'] },
  { id: 'cx_residuo', group: 'Procedura', title: 'Il Residuo', text: ['«A ogni giudizio lo scrivano dispone il prelievo del Residuo, nella misura strettamente necessaria a che l\'anima non rechi con sé, nella nuova esistenza, il peso della precedente.»', '— Regolamento Generale, art. 7.'] },
  { id: 'cx_direttive', group: 'Gestione', title: 'Le direttive', text: ['La Direzione emette direttive periodiche: quote, sospensioni, obblighi.', 'Lo scrivano può rispettarle; ignorarle apertamente; oppure violarle e far risultare il contrario nel rapporto, a proprio rischio.'] },
  { id: 'cx_personale', group: 'Gestione', title: 'Il personale', text: ['Lo scrivano può proporre assunzioni, assegnare mansioni e migliorare i reparti con i Crediti Eterni.', 'Il personale è composto di anime a giudizio sospeso. Anche le anime che hai mandato in Sala d\'Attesa possono essere assunte.'], cond: { dayMin: 2 } },
  { id: 'cx_attesa', group: 'Luoghi', title: 'La Sala d\'Attesa', text: ['Vi si attende. Non ha finestre né orologi.', 'Si raccomanda alle anime sospese di conversare tra loro: «giova al mantenimento».'], cond: { chapterMin: 2 } },
  { id: 'cx_torchi', group: 'Luoghi', title: 'I Torchi', text: ['Reparto di servizio per la produzione del supporto cartaceo dell\'Ufficio.', 'Non compare in pianta.'], cond: { know: 'k_torchi' } },
  { id: 'cx_collegio', group: 'Luoghi', title: 'Il Collegio', text: ['L\'organo deliberante dei Livelli Superiori. Decide per consenso.', 'I suoi atti possono recare date non ancora occorse: per il Collegio, la deliberazione è già avvenuta.'], cond: { chapterMin: 4 } },
  { id: 'cx_rinnovo_interno', group: 'Gestione', title: 'Rinnovo interno', text: ['Misura disciplinare e di tutela applicabile al personale.', 'Il dipendente viene svuotato e riassunto nella medesima qualifica.'], cond: { know: 'k_rinnovo_interno' } },
  { id: 'cx_comandi', group: 'Comandi', title: 'Muoversi e agire', text: ['Mouse o dito: tocca un punto per camminare, tocca un oggetto o una persona per avvicinarti e interagire. Trascina per spostare la visuale; rotellina o due dita per lo zoom.', 'Tastiera: W A S D o frecce per muoversi lungo le diagonali della stanza; E, Spazio o Invio per esaminare ciò che è vicino; Esc per chiudere un pannello.'] },
];
