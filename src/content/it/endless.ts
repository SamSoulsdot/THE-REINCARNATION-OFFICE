// Contenuti della modalità Endless: eventi periodici e obiettivi autonomi.
export interface EndlessEventDef { id: string; title: string; text: string }
export const ENDLESS_EVENTS: EndlessEventDef[] = [
  { id: 'ispezione', title: 'Ispezione del Collegio', text: 'Qualcuno, di sopra, rilegge i fascicoli di oggi. Ogni irregolarità omessa pesa il doppio; un turno senza irregolarità vale un encomio (+30 CE).' },
  { id: 'ondata', title: 'Ondata', text: 'Una sciagura, tra i vivi. Il portone non si chiude: tre pratiche in più, tutte dallo stesso luogo e dalla stessa ora.' },
  { id: 'buio', title: 'Lampade spente', text: 'Il Custode ha chiuso il gas per manutenzione. Lente e apparecchio a cilindri oggi non servono: si legge e si ascolta a occhio nudo.' },
  { id: 'ritorni', title: 'Giorno dei ritorni', text: 'L\'Indice ha agganciato più fascicoli del solito. Le anime che hai rimandato giù si presentano tutte insieme.' },
  { id: 'quiete', title: 'Turno quieto', text: 'Per una volta la fila è corta. Il personale tira il fiato (+6 morale).' },
];

export interface GoalDef { id: string; text: string; metric: string; step: number; reward: number }
export const ENDLESS_GOALS: GoalDef[] = [
  { id: 'g_casi', text: 'Evadi {n} pratiche', metric: 'casi', step: 8, reward: 50 },
  { id: 'g_verita', text: 'Accerta la verità in {n} casi', metric: 'verita', step: 5, reward: 60 },
  { id: 'g_ritorni', text: 'Giudica {n} anime di ritorno', metric: 'ritorni', step: 3, reward: 70 },
  { id: 'g_assunzioni', text: 'Assumi {n} dipendenti', metric: 'assunzioni', step: 2, reward: 40 },
  { id: 'g_potenziamenti', text: 'Completa {n} potenziamenti di reparto', metric: 'potenziamenti', step: 2, reward: 50 },
  { id: 'g_turni', text: 'Chiudi {n} turni', metric: 'turni', step: 5, reward: 45 },
  { id: 'g_collegati', text: 'Giudica {n} anime legate a fascicoli già chiusi', metric: 'collegati', step: 2, reward: 65 },
];

/** Battute dei personaggi in modalità Endless (la campagna non si applica). */
export const ENDLESS_BARKS: Record<string, string[]> = {
  pim: ['«Buongiorno! Oggi la fila gira l\'angolo.»', '«Li conto all\'ingresso. Lei li conti all\'uscita, e vediamo se tornano.»', '«Qualcuno di quelli di oggi l\'ho già contato. Aveva un\'altra faccia.»'],
  bones: ['«Ancora qui? Bene. Anch\'io.»', '«Timbra piano. Il timbro non si cancella. Loro sì.»', '«Li riconosci, quando tornano? Io sì. Dal modo in cui si siedono.»'],
  vesper: ['«Le quote sono in bacheca. Non sono un suggerimento.»', '«La Direzione osserva. La Direzione osserva sempre.»'],
  hoot: ['«L\'Indice è aggiornato. Le anime che tornano le trova con il cartiglio rosso.»', '«Se cerca una cosa che non c\'è, la chieda a voce bassa.»'],
  grell: ['«Panche piene.»', '«Quelli che parlano non sono miei.»'],
  ilse: ['«Confronti due cose che non possono essere vere insieme. Il resto viene da sé.»', '«Mentono per paura, per vergogna o per amore. Il terzo è il più difficile.»'],
  scrivano3: ['Lo Scrivano della 3 non alza la testa.'],
  scrivano6: ['«Sst. Ci guarda. Timbri qualcosa.»'],
};
