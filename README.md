# The Reincarnation Office

Avventura investigativa narrativa con gestione d'ufficio, in pixel art isometrica, ambientata nella burocrazia dell'aldilà.
Interpreti lo scrivano della **scrivania 7** dell'Ufficio Reincarnazioni: esamini le anime dei defunti, ricostruisci le loro vite da documenti inattendibili e colloqui, decidi la loro prossima esistenza — e scopri, a poco a poco, che cosa l'istituzione trattiene da ogni anima che giudica.

Gioco completamente client-side: nessun backend, nessun account, nessuna API esterna, nessun LLM. Funziona offline dopo il primo caricamento. Tutta la grafica, il sonoro e i testi sono originali e generati o scritti per questo progetto.

## Avvio rapido

Requisiti: Node.js 20 o superiore.

```bash
npm install
```

```bash
npm run dev
```

Apri l'indirizzo indicato dal terminale (di norma http://localhost:5173).

## Build e distribuzione

```bash
npm run build
```

Produce la cartella `dist/`: un sito statico autonomo (HTML, JS, CSS, font). I percorsi sono relativi (`base: './'`), quindi `dist/` può essere pubblicata così com'è su qualsiasi hosting statico gratuito — GitHub Pages, Netlify, Cloudflare Pages, Vercel, un bucket — anche in una sottocartella.

Anteprima locale della build:

```bash
npm run preview
```

Esempio di pubblicazione su GitHub Pages: esegui la build e pubblica il contenuto di `dist/` sul ramo o sulla sorgente configurata per Pages (Impostazioni del repository → Pages). Non servono variabili d'ambiente né segreti.

## Test

```bash
npm run typecheck
```

```bash
npm test
```

```bash
npm run test:e2e
```

- `npm test` esegue i test unitari e d'integrazione (Vitest, in Node, con IndexedDB simulato da `fake-indexeddb`).
- `npm run test:e2e` esegue la build, la serve con `npm run preview` (avviato da Playwright) ed esegue la suite end-to-end su due profili: **desktop** (1366×768) e **mobile** (Pixel 7, touch). Il browser usato è Chromium di Playwright; se non è installato: `npx playwright install chromium`.
- `npm run content:stats` stampa il conteggio dei contenuti narrativi presenti.

## Come si gioca

- **Muoversi**: tocca o clicca un punto del pavimento; tastiera WASD/frecce.
- **Interagire**: tocca o clicca una persona o un oggetto (il rombo dorato segnala ciò che si può esaminare), oppure il pulsante «Esamina/Parla» in basso; tastiera E, Spazio o Invio.
- **Visuale**: trascina per spostarla; rotellina, due dita o i pulsanti − / + per lo zoom; ◎ per ricentrare.
- **Diario** (J), **Ufficio** (O), **Pausa** (Esc).

Il turno comincia timbrando l'entrata e finisce all'orologio marcatempo in Area Dipendenti. Alla scrivania 7 si chiamano le anime in coda. Un caso si esamina in sei schede: **Fascicolo**, **Documenti** (tocca i passaggi per annotarli come evidenze), **Colloquio**, **Evidenze** (confronta due evidenze: se non possono essere vere insieme è una contraddizione, che si può contestare all'anima), **Ricostruzione** (enigmi, quando presenti) e **Sentenza**. Nessuna destinazione è mai bloccata: puoi sempre scegliere liberamente, anche contro il regolamento.

## Architettura

```
src/
  engine/          Logica di gioco pura, deterministica, senza dipendenze dal browser
    types.ts         Modello dati (GameState è interamente serializzabile in JSON)
    rng.ts           Generatore seeded (mulberry32) e hash
    cond.ts          Condizioni ed effetti narrativi (unico punto che legge/scrive lo stato narrativo)
    generator.ts     Narrative Engine procedurale: vita → verità canonica → documenti → colloquio
    cases.ts         Registro dei casi e operazioni sul caso attivo
    judgment.ts      Judgment Engine: sentenze, irregolarità, reincarnazione, revisioni
    office.ts        Office Management: personale, reparti, strumenti, direttive, contabilità del turno
    knowledge.ts     Diario, collegamenti investigativi, misteri
    scene.ts         Esecutore di dialoghi/scene, routine dei personaggi, documenti d'ambiente
    campaign.ts      Simulation Engine: turni, capitoli, coda, finali
    endless.ts       Modalità Endless: eventi, obiettivi, anime collegate, statistiche
    sim.ts           Creazione di una nuova partita
  content/         Contenuti (italiano in content/it, punto d'accesso unico in content/index.ts)
    it/cases/        13 casi curati, scritti a mano
    it/templates.ts  36 template procedurali, ciascuno con due verità canoniche alternative
    it/procedural.ts Nomi, luoghi, 44 pattern di eventi di vita, ereditarietà
    it/world.ts      Personaggi, routine, oggetti, dialoghi, documenti d'ambiente
    it/knowledge.ts  Voci del diario, collegamenti, misteri
    it/campaign.ts   Capitoli, turni, finali, epilogo
  world/map.ts     Geometria dell'ufficio, porte, oggetti, percorsi (BFS) — usata anche dai test
  persistence/     Persistence Layer
    save.ts          Schema versionato, checksum, validazione, migrazioni (puro, testabile)
    db.ts            IndexedDB via Dexie: slot, autosave con copia di riserva, import/export
  presentation/    Presentation Layer
    iso/             Pixel art procedurale (px, art_tiles, art_objects, art_chars), atlante, vista PixiJS
    audio/audio.ts   Audio interamente sintetizzato con Web Audio API
    ui/              Schermate React
  store/index.ts   Zustand: collega motori e presentazione (nessuna regola di gioco qui)
  i18n/index.ts    Stringhe dell'interfaccia, predisposte per una seconda lingua
tests/             Vitest (unit + integrazione, incluso un «bot» che gioca l'intera campagna)
e2e/               Playwright
```

Principi:

- **La logica non vive nei componenti.** Le schermate leggono lo stato e chiamano azioni dello store, che delega ai motori.
- **Prima la verità, poi le prove.** Ogni caso (curato o procedurale) parte da una verità canonica; documenti e testimonianze ne derivano, e quando sono inattendibili dichiarano internamente il perché (`why`). Il test `tests/unit/content.test.ts` verifica che ogni indizio sia ottenibile e che ogni inattendibilità sia spiegata.
- **Determinismo.** Ogni anima ha un seed; lo stesso seed e le stesse scelte producono la stessa partita (verificato dai test).
- **Grafica senza asset esterni.** Pavimenti, pareti, porte, ~40 tipi di arredi, 13 personaggi animati e ritratti sono disegnati a pixel da codice (`presentation/iso/art_*.ts`), impacchettati in un atlante e renderizzati da PixiJS con un unico batch. L'illuminazione è un buffer di luce a bande moltiplicato sulla scena.
- **Salvataggi.** Autosave a ogni sentenza, a ogni cambio di turno, ogni 30 secondi e alla chiusura della pagina, con copia di riserva; 4 slot manuali; esportazione e importazione JSON validate (formato, versione di schema, checksum, coerenza interna); migrazioni per schema.

## Aggiungere l'inglese

1. Duplicare `src/i18n/index.ts` → dizionario `en` con le stesse chiavi e registrarlo in `PACKS`.
2. Creare `src/content/en/` con gli stessi moduli di `src/content/it/` e scegliere il pacchetto in `src/content/index.ts`.

Il resoconto dettagliato delle funzionalità, dei test e dei limiti è in [docs/RESOCONTO.md](docs/RESOCONTO.md).
