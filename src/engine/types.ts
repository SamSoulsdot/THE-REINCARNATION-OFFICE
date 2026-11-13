// Tipi condivisi da tutti i motori. Tutto lo stato di gioco è JSON-serializzabile.

export const SCHEMA_VERSION = 1;

export type Destination = 'ascension' | 'renewal' | 'trial' | 'otherForm' | 'waitingRoom';
export const DESTINATIONS: Destination[] = ['ascension', 'renewal', 'trial', 'otherForm', 'waitingRoom'];

export type TraitKey = 'empatia' | 'altruismo' | 'onesta' | 'coraggio' | 'responsabilita' | 'ambizione';
export const TRAIT_KEYS: TraitKey[] = ['empatia', 'altruismo', 'onesta', 'coraggio', 'responsabilita', 'ambizione'];
export type Traits = Record<TraitKey, number>; // 0..10 — descrittivi, mai sommati in un punteggio morale

export interface Relation { name: string; role: string; note: string }
export interface LifeEvent { age: number; text: string; tag?: string }

export interface Inheritance {
  predisposizioni: string[];
  paure: string[];
  inclinazioni: string[];
  talenti: string[];
  conflitti: string[];
  memorie: string[];
  legami: string[];
}

export interface Incarnation {
  index: number;
  name: string;
  ageAtDeath: number;
  origin: string;
  era: string;
  occupation: string;
  cause: string;
  traits: Traits;
  bio: string;
  relations: Relation[];
  events: LifeEvent[];
  motivations: string[];
  conflicts: string[];
  memories: string[];
  inherited?: Inheritance;
  form?: string; // forma non umana (L'Altra Forma)
  gender?: 'm' | 'f';
  tpl?: string; // template procedurale della vita
  variant?: number; // variante di verità canonica
  linked?: string; // nome dell'anima a cui questa vita è legata (casi collegati)
  caseId?: string;
  decisionId?: string;
  bornDay?: number;
}

export type SoulStatus =
  | 'in_arrivo' | 'in_esame' | 'reincarnata' | 'ascesa' | 'in_attesa'
  | 'sbiadita' | 'dissolta' | 'assunta' | 'liberata';

export interface Soul {
  id: string;
  seed: number;
  curated: boolean;
  incarnations: Incarnation[];
  status: SoulStatus;
  waitingSince?: number;
  returnDay?: number; // giorno in cui l'incarnazione successiva tornerà allo sportello
  notes: string[];
}

export type CaseType =
  | 'ordinario' | 'morte_sospetta' | 'ricorso' | 'vite_precedenti' | 'senza_identita'
  | 'indagine_interna' | 'anomalia_amministrativa' | 'piu_anime' | 'verita_pericolosa' | 'ritorno';

export type Reliability = 'attendibile' | 'incompleto' | 'distorto' | 'falsificato' | 'menzognero' | 'contraddittorio';
export type ClueStatus = 'documento' | 'testimonianza' | 'verificato' | 'ipotesi';

export interface Cond {
  all?: Cond[];
  any?: Cond[];
  not?: Cond;
  flag?: string;
  know?: string;
  link?: string;
  dayMin?: number;
  dayMax?: number;
  chapterMin?: number;
  chapterMax?: number;
  phaseMin?: number;
  phaseMax?: number;
  relMin?: [string, number];
  relMax?: [string, number];
  statMin?: [StatKey, number];
  statMax?: [StatKey, number];
  verdict?: [string, Destination | 'any']; // [caseId, destinazione]
  clue?: [string, string]; // [caseId, clueId] — indizio raccolto in un caso (anche chiuso)
  npc?: [string, NpcStatus];
  tool?: string;
  area?: string;
  mode?: 'campaign' | 'endless';
  staffRole?: string;
  creditsMin?: number;
  /** Conversazione già avvenuta. */
  seen?: string;
}

export type StatKey = 'efficienza' | 'morale' | 'pendenti' | 'reputazione' | 'irregolari' | 'ricorsi' | 'anomalie' | 'sospetto';
export type OfficeStats = Record<StatKey, number>;
export type NpcStatus = 'attivo' | 'assente' | 'scomparso' | 'morto';

export interface Effects {
  flags?: string[];
  unflag?: string[];
  know?: string[];
  rel?: Record<string, number>;
  credits?: number;
  stats?: Partial<Record<StatKey, number>>;
  areas?: string[];
  vars?: Record<string, number>;
  npcStatus?: Record<string, NpcStatus>;
  soulStatus?: Record<string, SoulStatus>;
  queue?: string[];
  tools?: string[];
  ending?: string;
  /** Apre subito un caso (lo mette in coda se serve). Consumato dalla UI a fine scena. */
  openCase?: string;
  /** Apre un enigma ambientale. */
  puzzle?: string;
}

export type Para = string | { t: string; clue: string };

export interface DocDef {
  id: string;
  title: string;
  kind: 'scheda' | 'rapporto' | 'lettera' | 'testimonianza' | 'verbale' | 'registro' | 'referto' | 'nota' | 'oggetto' | 'direttiva';
  source: string;
  reliability: Reliability;
  /** Spiegazione interna (verità canonica) del perché il documento è com'è. Mai mostrata prima della chiusura del caso. */
  why: string;
  body: Para[];
  cond?: Cond;
  /** Se presente, il documento non è nel fascicolo: va recuperato (flag impostato dall'esplorazione). */
  needFlag?: string;
  needHint?: string;
}

export interface ClueDef {
  id: string;
  label: string;
  text: string;
  status: ClueStatus;
  /** Conoscenze globali sbloccate nel diario quando l'indizio viene raccolto. */
  know?: string[];
}

export interface TopicDef {
  id: string;
  q: string;
  a: string;
  tone: 'sincera' | 'evasiva' | 'menzogna' | 'silenzio' | 'confusa';
  cond?: Cond;
  needClues?: string[];
  needContra?: string;
  needTopic?: string;
  gives?: string[];
  fx?: Effects;
}

export interface ContradictionDef {
  id: string;
  a: string;
  b: string;
  label: string;
  note: string;
}

export interface MotivationDef {
  id: string;
  text: string;
  needClues?: string[];
  dest?: Destination[];
}

export interface ReincHook {
  /** Giorni dopo i quali l'anima torna (solo campagna/endless procedurale). */
  returnIn?: number;
  form?: string;
  note?: string;
  noReturn?: boolean;
}

export interface OutcomeDef {
  text: string;
  consequences: string[];
  fx?: Effects;
  /** Motivo per cui la sentenza è irregolare a prescindere dalle evidenze. */
  irregular?: string;
  reinc?: ReincHook;
  cond?: Cond;
}

export interface SpecialVerdictDef {
  id: string;
  label: string;
  desc: string;
  cond?: Cond;
  needClues?: string[];
  /** Destinazione registrata a protocollo. */
  dest: Destination;
  outcome: OutcomeDef;
}

export interface PuzzleDef {
  id: string;
  kind: 'ordine' | 'cifra' | 'codice';
  title: string;
  intro: string;
  /** ordine: elementi da disporre; cifra: testo cifrato in items[0].text */
  items?: { id: string; text: string }[];
  /** ordine: id separati da virgola; cifra: scorrimento; codice: stringa normalizzata */
  solution: string;
  needClues?: string[];
  cond?: Cond;
  gives?: string[];
  success: string;
  failure: string;
  fx?: Effects;
}

export interface CaseDef {
  id: string;
  title: string;
  type: CaseType;
  procedural?: boolean;
  soulId: string;
  /** Per i casi curati: l'incarnazione da iscrivere al registro quando il caso entra in coda. */
  incarnation?: Omit<Incarnation, 'index'>;
  /** Vite precedenti note d'ufficio (solo testo, per anime curate con passato). */
  pastLives?: string[];
  arrival: string;
  registration: string;
  summary: string;
  recommended: Destination;
  recommendedWhy: string;
  /** Se true, l'Autorità considera vincolante la raccomandazione. */
  binding?: boolean;
  noInterview?: string;
  docs: DocDef[];
  clues: ClueDef[];
  topics: TopicDef[];
  contradictions: ContradictionDef[];
  motivations: MotivationDef[];
  outcomes: Record<Destination, OutcomeDef>;
  specials?: SpecialVerdictDef[];
  puzzles?: PuzzleDef[];
  /** Verità canonica del caso (per test di coerenza e riepilogo d'archivio a caso risolto). */
  truth: string[];
  /** Indizio che attesta la scoperta della verità centrale. */
  truthClue?: string;
  residuo?: string;
  onOpen?: Effects;
  onClose?: Effects;
}

export interface Decision {
  id: string;
  soulId: string;
  soulName: string;
  caseId: string;
  caseTitle: string;
  day: number;
  chapter: number;
  mode: 'campaign' | 'endless';
  destination: Destination;
  special?: string;
  motivation: string;
  evidence: string[];
  irregularities: string[];
  consequences: string[];
  reincEffects: string[];
  residuo: string;
  truthFound: boolean;
  reported: boolean;
  concealed: boolean;
  revised?: { day: number; to: Destination };
}

export interface ReincarnationReport {
  decisionId: string;
  destination: Destination;
  headline: string;
  text: string;
  consequences: string[];
  inherited?: Inheritance;
  next?: Incarnation;
  residuo: string;
  irregularities: string[];
  creditsDelta: number;
}

export interface QueueItem {
  caseId: string;
  kind: 'curato' | 'procedurale' | 'ritorno';
  soulId: string;
  seed?: number;
  templateId?: string;
  state: 'attesa' | 'attivo' | 'chiuso';
  label: string;
  mandatory: boolean;
}

export interface ActiveCase {
  caseId: string;
  registered: boolean;
  docsRead: string[];
  clues: string[];
  asked: string[];
  contradictions: string[];
  puzzles: string[];
}

export interface ClosedCase {
  caseId: string;
  title: string;
  soulId: string;
  clues: string[];
  contradictions: string[];
  decisionId: string;
  day: number;
}

export type KCat =
  | 'personaggi' | 'anime' | 'documenti' | 'simboli' | 'indizi' | 'eventi'
  | 'luoghi' | 'cronologie' | 'collegamenti' | 'misteri';
export type KStatus = 'verificato' | 'testimonianza' | 'ipotesi' | 'contraddizione' | 'non_confermato';

export interface KnowledgeDef {
  id: string;
  cat: KCat;
  title: string;
  text: string;
  status: KStatus;
  /** Può essere usata nella lavagna dei collegamenti. */
  linkable?: boolean;
  /** Anno/ordine per le cronologie. */
  when?: string;
}

export interface LinkDef {
  id: string;
  a: string;
  b: string;
  title: string;
  text: string;
  fx?: Effects;
}

export interface MysteryStage { cond: Cond; text: string }
export interface MysteryDef {
  id: string;
  title: string;
  question: string;
  intro: Cond;
  stages: MysteryStage[];
  solved: Cond;
  solution: string;
}

export interface KnowledgeState { day: number; isNew: boolean }

export type StaffRole = 'registratore' | 'scrivano' | 'archivista' | 'consulente' | 'custode';
export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  skill: number; // 1..5
  temper: string;
  origin: string; // da dove viene (candidato esterno o anima dalla Sala d'Attesa)
  soulId?: string;
  hiredDay: number;
  level: number;
  xp: number;
}
export interface Candidate {
  id: string;
  name: string;
  skill: number;
  temper: string;
  origin: string;
  best: StaffRole;
  cost: number;
  soulId?: string;
}

export type DeptId = 'reception' | 'judgment' | 'archive' | 'interview' | 'employee' | 'management' | 'restricted';
export type Stance = 'rispetta' | 'ignora' | 'manipola';

export interface DirectiveState {
  id: string;
  issuedDay: number;
  stance: Stance | null;
  expiresDay: number;
  outcome?: string;
}

export interface DayReport {
  day: number;
  chapter: number;
  processed: number;
  autoProcessed: number;
  irregular: number;
  credits: number;
  lines: string[];
}

export interface EndlessState {
  cycle: number;
  goals: { id: string; base: number; tier: number }[];
  goalsDone: number;
  totals: Record<string, number>;
  eventToday?: string;
  eventLog: { day: number; id: string }[];
}

export interface GameState {
  schema: number;
  mode: 'campaign' | 'endless';
  seed: number;
  playerName: string;
  day: number;
  chapter: number;
  phase: number; // 0..4
  dayStarted: boolean;
  flags: Record<string, true>;
  vars: Record<string, number>;
  credits: number;
  stats: OfficeStats;
  rel: Record<string, number>;
  npc: Record<string, NpcStatus>;
  souls: Record<string, Soul>;
  decisions: Decision[];
  queue: QueueItem[];
  activeCase: ActiveCase | null;
  lastReport: ReincarnationReport | null;
  closed: Record<string, ClosedCase>;
  knowledge: Record<string, KnowledgeState>;
  links: string[];
  linkAttempts: number;
  convSeen: Record<string, number>;
  docsSeen: Record<string, number>;
  staff: StaffMember[];
  candidates: Candidate[];
  departments: Record<DeptId, number>;
  tools: string[];
  directives: DirectiveState[];
  areas: string[];
  player: { x: number; y: number };
  reports: DayReport[];
  endless: EndlessState | null;
  ending: string | null;
  playSeconds: number;
  counter: number; // contatore monotono per ID deterministici
}

// --- Dialoghi / scene ---
export type Line =
  | { s: string; t: string }
  | { choice: ChoiceOpt[] }
  | { fx: Effects }
  | { doc: string }
  | { ui: string }
  | { if: Cond; then: Line[]; else?: Line[] };

export interface ChoiceOpt { t: string; cond?: Cond; fx?: Effects; lines?: Line[] }

export interface Convo {
  id: string;
  npc?: string;
  obj?: string;
  title?: string;
  cond?: Cond;
  once?: boolean;
  prio?: number;
  lines: Line[];
}

export interface LoreDoc {
  id: string;
  title: string;
  source: string;
  kind: DocDef['kind'];
  body: string[];
  /** Testo alternativo mostrato dalla seconda consultazione (documento che cambia). */
  altBody?: string[];
  altCond?: Cond;
  fx?: Effects;
  altFx?: Effects;
}
