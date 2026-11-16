# Resoconto di consegna — The Reincarnation Office

Questo documento distingue ciò che è **implementato e verificato**, ciò che è **parziale** e ciò che **manca**. Dove un dato non è stato misurato, lo dice.

## 1. Funzionalità implementate

### Ciclo del caso (priorità 1) — completo
Arrivo dell'anima → registrazione → fascicolo → documenti (passaggi annotabili come evidenze) → colloquio (domande sbloccate da evidenze e contraddizioni) → confronto delle evidenze → enigmi di ricostruzione (dove previsti) → sentenza → rapporto di reincarnazione → registrazione delle conseguenze. Verificato end-to-end nel browser su desktop e mobile.

- **Cinque destinazioni sempre selezionabili** (Ascensione, Rinnovo, Prova, Altra Forma, Sala d'Attesa) più **9 sentenze speciali** nei casi curati. Nessun blocco morale.
- **Giudizi irregolari**: una sentenza difforme è irregolare se non poggia su evidenze verificate, se viola una disposizione vincolante o una direttiva; l'irregolarità si può segnalare (costa reputazione) o omettere (alimenta il sospetto).
- **Registro delle decisioni** con anima, caso, turno e capitolo, destinazione, motivazione, evidenze, irregolarità, conseguenze, effetti sulla reincarnazione, Residuo trattenuto, verità accertata sì/no, eventuale revisione. Consultabile nell'Archivio.

### Anime e reincarnazione — completo
- Identità persistente con ID, seed, storia di tutte le incarnazioni, stato.
- **Ereditarietà selettiva**: predisposizioni (dai tratti più marcati), paure (dalla causa di morte), inclinazioni, talenti (dagli eventi di vita), conflitti irrisolti, frammenti di memoria, legami. Mai una copia: la nuova vita è generata da capo con il proprio template. La Prova eredita più memoria e il conflitto; l'Altra Forma quasi nulla.
- **Ritorni**: le anime rinate tornano allo sportello dopo alcuni turni, con un caso che cita la vita precedente e il tuo giudizio, e un colloquio sui frammenti di memoria. Anche le anime dei casi curati possono tornare come casi procedurali.
- **Ritorno curato di Lorenz Hable** (Capitolo III) in tre versioni a seconda della sentenza del Capitolo I: una donna che ha ereditato il suo «no», un cane di caserma, oppure — se era asceso o sospeso — la madre che lo cerca.
- Revisione delle sospensioni (Ufficio Revisioni), anime che sbiadiscono in Sala d'Attesa, anime sospese assumibili come personale.

### Motore narrativo e coerenza — completo
- **Prima la verità, poi le prove**: ogni caso ha una verità canonica; ogni documento inattendibile (incompleto, distorto, falsificato, menzognero, contraddittorio) dichiara internamente il perché. Un test verifica che ogni indizio sia ottenibile, ogni riferimento esista e ogni inattendibilità sia motivata.
- **Generazione procedurale deterministica**: 36 template, ciascuno con **due verità canoniche alternative** che smentiscono documenti diversi (72 dinamiche), 44 pattern di eventi di vita, nomi/luoghi/epoche. Documenti, dichiarazioni e confessione sono derivati dalla variante. Stesso seed, stesso caso.
- Nessuna API esterna, nessun LLM.

### Ufficio esplorabile (priorità 3) — completo
- 9 ambienti isometrici su 4 quote (Reception, Sala dei Giudizi, Area Dipendenti, due Sale Colloqui, Archivio un piano sotto, Reparto Riservato più in basso, Direzione su una pedana, Ufficio del Direttore), collegati da porte e scale; aree sbloccate da progressione, personaggi o reputazione.
- 52 elementi interattivi (oggetti e porte) con contenuto proprio; documenti d'ambiente, uno dei quali **cambia alla seconda lettura**; 1 enigma ambientale (combinazione dello schedario, risolvibile dagli indizi).
- 11 personaggi con routine deterministiche per fase del turno (al lavoro, in movimento, in pausa, non disponibile…), che cambiano con eventi e progressione; conversazioni colte a distanza che si interrompono quando ti avvicini.
- Anomalie con funzione narrativa: la pendola che batte tredici, il Regolamento che cambia, lo specchio con una sedia in più, la scrivania vuota da undici anni, la tua sigla su un giudizio anteriore alla tua assunzione, un atto datato nel futuro e già eseguito, un'anima che ti riconosce.

### Personaggi — completo
Signorina Pim, Mr. Bones, Madame Vesper, Mr. Hoot, il Custode, la Consulente Marrow, l'Ispettore Quill, il Direttore (+ Tea Albrecht e Sabina Tadini in custodia, due scrivani comparsa). Ognuno ha ruolo, storia, segreto, opinioni che cambiano (relazioni numeriche), dialoghi condizionati e un arco. Possono scomparire definitivamente (Hoot se lo denunci; Marrow secondo la sentenza dell'indagine interna) senza bloccare la campagna.

### Conoscenza e archivio — completo
Diario con 90 voci in 10 categorie e 4 stati (verificato, testimonianza, ipotesi, non confermato); **lavagna dei collegamenti** (24 nessi canonici: solo le deduzioni corrette vengono confermate e producono nuove ipotesi); 6 misteri che mostrano gli indizi raccolti ma non la soluzione finché non è dedotta o rivelata; cronologia; Codex. Le conoscenze sbloccano domande in casi successivi (es. aver accertato la verità su Kessel apre un dialogo nel caso Vos).

### Gestione (priorità 4) — completo
Eterni Crediti; indicatori (efficienza, morale, pendenti, reputazione, irregolari, ricorsi, anomalie, sospetto); assunzioni (anche di anime sospese), 5 mansioni con effetti reali (gli scrivani evadono pratiche d'ufficio e generano ricorsi, l'aiuto archivista segnala documenti inattendibili, ecc.); 7 reparti con 18 livelli di potenziamento; 5 strumenti; 6 direttive di campagna (rotanti in Endless) che si possono **rispettare, ignorare apertamente o falsificare nel rapporto**, con rischio di scoperta e ispezioni a sorpresa.

### Campagna (priorità 5) — completa nella struttura
5 capitoli, 14 turni, 13 casi curati, ~21 casi procedurali più i ritorni. **5 finali** determinati da una combinazione di sentenza sul Direttore, sentenza su te stesso, alleati conquistati nei dialoghi finali, misteri risolti, reputazione/sospetto/morale e stato del Collegio. Il bot di test raggiunge tutti e cinque i finali con stili di gioco diversi e verifica che la stessa scelta finale porti a finali diversi.

### Endless (priorità 6) — completo
Turni infiniti, pratiche crescenti (da 3 a 6 per turno), anime ricorrenti con più vite, **anime collegate** (la persona citata nel fascicolo di un'anima giudicata può arrivare a sua volta), 5 eventi periodici, direttive rotanti, progressione del personale, obiettivi autonomi a livelli crescenti, statistiche di lungo periodo, salvataggio dedicato.

### Salvataggi — completo
IndexedDB (Dexie). Autosave a ogni sentenza, a ogni turno, ogni 30 s e all'uscita dalla pagina, con **copia di riserva** ripristinata automaticamente se l'autosave è danneggiato; 4 slot manuali; caricamento, eliminazione con conferma, **esportazione e importazione JSON** con validazione (formato, versione di schema, checksum, coerenza interna) e migrazioni versionate. Slot corrotti segnalati, non caricati, ma esportabili per un recupero manuale.

### Presentazione
- **Pixel art** interamente generata da codice: 9 materiali di pavimento, 4 tipi di parete con 9 decorazioni murali, 10 tipi di porta, ~40 arredi, 14 set di personaggi animati (camminata a 4 fotogrammi, fronte/retro), il cane e il Rientrato a tre volti, ritratti 48×48, sigillo. Illuminazione a bande con luci tremolanti, ombre, pareti che si diradano davanti al giocatore.
- **Audio** sintetizzato (Web Audio): ambiente per stanza e tensione, note sparse e rare, passi per materiale, porte, carta, timbri, campanello, montacarichi; sorgenti posizionali (pendola, torchi, voci dalla Sala d'Attesa, gocce) con volume e stereo per distanza; silenzi improvvisi agli eventi. Volumi separati generale/ambiente/effetti.
- **UI** in italiano, architettura predisposta per l'inglese; tastiera, mouse e touch; nessun comando solo-hover; layout distinti per desktop, telefono verticale e telefono orizzontale; nessun overflow orizzontale (verificato nei test).
- **Offline**: service worker che precarica tutta la build; verificato con un test che ricarica e avvia una partita senza rete.

## 2. Funzionalità parziali

- **Durata**: vedi §6. La quantità di contenuti non giustifica 10–12 ore.
- **Horror visivo esplicito**: l'orrore è soprattutto scritto (corpi saldati, dita di carta, torchi, barattoli). Nella pixel art ci sono il Rientrato a tre volti, le dita di carta, l'impronta sul feltro del torchio, i barattoli che si muovono; mancano scene illustrate dedicate ai momenti più disturbanti.
- **Enigmi**: 3 meccaniche (ordinamento cronologico, cifrario a scorrimento, combinazione) più la deduzione per contraddizioni e collegamenti, che è il cuore investigativo. Pochi enigmi «puri».
- **Casi procedurali**: variano davvero dinamica, colpevole e documento inattendibile (72 verità), ma la struttura investigativa è sempre la stessa (versione ufficiale contro testimonianza, contestazione, confessione).
- **Effetti visivi della gestione**: i potenziamenti dei reparti e il personale assunto hanno effetti di gioco ma non cambiano l'aspetto dell'ufficio; il personale assunto non compare come sprite.
- **Animazioni**: camminata a 4 fotogrammi e vista posteriore/anteriore specchiata (non 8 direzioni); animazioni ambientali limitate a luci, pendola, stufa, barattoli, anime che fluttuano.

## 3. Non implementato

- Lingua inglese (solo l'architettura e il punto di aggancio).
- Doppiaggio o brani musicali composti: l'audio è ambiente sintetizzato.
- Una pipeline di CI e un deploy automatico (le istruzioni di build e pubblicazione sono nel README).

## 4. Test

| Suite | Comando | Esito |
|---|---|---|
| Coerenza dei contenuti | `npm test` | 17 test superati |
| Motori (RNG, generazione, ereditarietà, sentenze, irregolarità, dialoghi, routine, gestione, direttive, conoscenza) | `npm test` | 30 superati |
| Integrazione campagna (bot: 5 finali, ritorni, perdite definitive, determinismo) | `npm test` | 10 superati |
| Integrazione Endless, salvataggi (IndexedDB simulato), mappa e percorsi | `npm test` | 20 superati |
| Statistiche contenuti | `npm run content:stats` | 1 superato |
| End-to-end Playwright, desktop 1366×768 e Pixel 7 touch | `npm run test:e2e` | 16 superati, 2 saltati per scelta (touch solo su mobile, offline solo su desktop), 0 falliti |
| Typecheck | `npm run typecheck` | nessun errore |

Gli end-to-end coprono: avvio, menu, nuova campagna, rendering dell'ufficio, ricezione dell'anima, dossier, documenti, contraddizione, interrogatorio, sentenza, rapporto di reincarnazione, salvataggio manuale, ricaricamento reale della pagina e caricamento, esportazione/importazione JSON, Endless con chiusura del turno, diario e gestione, interazioni touch, assenza di overflow orizzontale, funzionamento offline.

Verifiche visive: screenshot a dimensione reale su 1280×760, 412×915 (verticale) e 915×412 (orizzontale) di menu, ufficio in tutte le aree, dialoghi, fascicolo, documenti, colloquio, sentenza, rapporto, diario, gestione, archivio, enigmi, finale. Hanno portato a correggere: pannelli che uscivano dallo schermo sul telefono, avvisi che coprivano le intestazioni, il giocatore che si sedeva sulla sedia dell'anima, un riquadro di dialogo troppo alto in orizzontale.

Bug bloccanti trovati e corretti durante i test: il dialogo si bloccava con la velocità del testo «immediata»; un evento di stanza durante il cammino faceva perdere l'interazione richiesta; i moduli caricati in differita e i font non erano disponibili offline.

**Non verificato**: l'audio (sintetizzato, non c'è un test automatico che lo ascolti); le prestazioni su dispositivi reali (i test usano un renderer software, più lento di qualsiasi GPU); Safari e Firefox (testato solo Chromium).

## 5. Contenuti narrativi presenti (conteggio automatico)

- 13 casi curati (1 con 3 varianti), 53 documenti nei casi + 6 documenti d'ambiente, 74 domande di colloquio, 9 sentenze speciali, circa 9.900 parole.
- 36 template procedurali × 2 verità canoniche, circa 7.800 parole; 44 pattern di eventi di vita.
- 116 conversazioni ed esami d'ambiente, circa 6.400 parole.
- 90 voci di diario, 24 collegamenti, 6 misteri, 5 finali con epilogo condizionato (27 righe sulle sorti di anime e personaggi).
- 11 personaggi nel mondo, di cui 8 ricorrenti principali.

## 6. Durata

**Non misurata con un playtest umano.** Stima: circa 24.000 parole di testo scritto a mano; un caso curato richiede lettura di 4–5 documenti, un colloquio, confronti e una decisione (15–25 minuti), un caso procedurale 5–8 minuti; a questo si aggiungono esplorazione, dialoghi e gestione. Una prima partita alla campagna è stimata in **circa 5–7 ore**, non 10–12. La modalità Endless non ha fine. Per raggiungere davvero 10–12 ore servirebbero indicativamente altri 8–10 casi curati e una seconda struttura investigativa per i casi procedurali.

## 7. Stato per piattaforma

- **Desktop**: giocabile con mouse e tastiera; layout a finestre; verificato in Chromium.
- **Mobile**: giocabile con il tocco (tocco per camminare e interagire, trascinamento per la visuale, pizzico per lo zoom, pulsante «Esamina/Parla»); pannelli a tutto schermo; layout specifici per verticale e orizzontale; verificato in emulazione Pixel 7, non su un telefono fisico.

## 8. Problemi noti

- Il bundle JavaScript è di circa 1,4 MB (circa 380 KB compressi), soprattutto PixiJS: il primo caricamento su rete lenta richiede qualche secondo.
- All'avvio di una partita la generazione della pixel art richiede un breve istante (tutto è disegnato da codice e caricato in un unico atlante).
- I salvataggi vivono nel browser: cancellando i dati del sito si perdono, per questo esiste l'esportazione JSON.
