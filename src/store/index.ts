// Stato dell'applicazione (Zustand). Collega i motori alla presentazione:
// nessuna regola di gioco vive qui, solo l'orchestrazione di schermate, scene, salvataggi e audio.
import { create } from 'zustand';
import type { Destination, DayReport, GameState, StaffRole, Stance } from '../engine/types';
import { newCampaign, newEndless, seedFrom } from '../engine/sim';
import { canEndDay, endDay, flushRequests, resolveEnding, rest, startDay, takePuzzleRequest, type EndingResult } from '../engine/campaign';
import { askTopic, attemptPuzzle, compareClues, currentIncarnation, getCaseDef, noteClue, openCase, readDoc, registerSoul, type AskResult } from '../engine/cases';
import { issueVerdict, reviseWaiting, type VerdictInput } from '../engine/judgment';
import { attemptWorldPuzzle, endlessBark, getConvo, npcAutoConvo, npcTopics, objectConvo, readLore, roomEvents, sceneNext, startScene, type LoreView, type SceneItem, type SceneState } from '../engine/scene';
import { assignRole, buyTool, dismiss, hire, setStance, upgradeDept } from '../engine/office';
import { markSeen, tryLink, type LinkResult } from '../engine/knowledge';
import { AREA_LABEL, AREA_LOCKED, KNOWLEDGE, NPCS } from '../content';
import { roomDef } from '../world/map';
import { autosave, deleteSave, exportSave, getMeta, importSave, listSaves, readSave, setMeta, unlockEnding, writeSave, AUTO_SLOT, ENDLESS_AUTO, type SlotInfo } from '../persistence/db';
import { audio, type Sfx } from '../presentation/audio/audio';
import type { IsoView, SyncExtra, ViewTarget } from '../presentation/iso/view';
import type { DeptId } from '../engine/types';

export type Panel = null | 'desk' | 'case' | 'report' | 'office' | 'journal' | 'archive' | 'pause' | 'saves' | 'settings' | 'dayStart' | 'dayEnd' | 'puzzle' | 'endings' | 'stats';
export interface Settings { master: number; music: number; sfx: number; textSpeed: 'lenta' | 'normale' | 'immediata'; reduceFlicker: boolean }
export interface Toast { id: number; text: string; kind: 'info' | 'clue' | 'warn' }
export interface SceneView { st: SceneState; item: SceneItem; key: number }

const DEFAULT_SETTINGS: Settings = { master: 0.8, music: 0.6, sfx: 0.8, textSpeed: 'normale', reduceFlicker: false };
let toastId = 0;
let sceneKey = 0;
let viewRef: IsoView | null = null;
export const setView = (v: IsoView | null) => { viewRef = v; };
export const getView = () => viewRef;

interface Store {
  screen: 'boot' | 'menu' | 'game' | 'ending';
  game: GameState | null;
  rev: number;
  panel: Panel;
  panelTab: string | null;
  menuPanel: 'saves' | 'settings' | 'endings' | 'new_campaign' | 'new_endless' | null;
  scene: SceneView | null;
  sceneQueue: string[];
  pendingUi: string | null;
  topicsFor: string | null;
  doc: LoreView | null;
  toasts: Toast[];
  near: ViewTarget | null;
  roomLabel: string;
  settings: Settings;
  dayReport: DayReport | null;
  puzzleId: string | null;
  ending: EndingResult | null;
  endingsUnlocked: string[];
  slots: SlotInfo[];
  confirm: { text: string; yes: string; onYes: () => void } | null;
  saveError: string | null;

  boot(): Promise<void>;
  bump(): void;
  toast(text: string, kind?: Toast['kind']): void;
  dismissToast(id: number): void;
  sfx(name: Sfx): void;
  setSettings(p: Partial<Settings>): void;
  setMenuPanel(p: Store['menuPanel']): void;
  refreshSlots(): Promise<void>;
  // partita
  newGame(mode: 'campaign' | 'endless', name: string): void;
  continueGame(mode: 'campaign' | 'endless'): Promise<boolean>;
  loadSlot(slot: string): Promise<boolean>;
  saveSlot(slot: string): Promise<void>;
  deleteSlot(slot: string): Promise<void>;
  exportSlot(slot: string): Promise<void>;
  importFile(file: File, slot: string): Promise<void>;
  saveAuto(): void;
  toMenu(): void;
  // turno
  beginDay(): void;
  tryEndDay(): void;
  closeDayEnd(): void;
  // pannelli
  openPanel(p: Panel, tab?: string | null): void;
  closePanel(): void;
  ask(text: string, yes: string, onYes: () => void): void;
  closeConfirm(): void;
  // mondo
  interact(t: ViewTarget): void;
  enterRoom(room: string): void;
  locked(area: string): void;
  setNear(t: ViewTarget | null): void;
  movePlayer(x: number, y: number): void;
  // scene
  playConvo(id: string): void;
  playLine(speaker: string, text: string): void;
  advance(choice?: number): void;
  closeDoc(): void;
  chooseTopic(convoId: string | null): void;
  // caso
  callSoul(caseId: string): void;
  register(): void;
  readDocument(id: string): void;
  note(clueId: string): boolean;
  askSoul(topicId: string): AskResult | null;
  compare(a: string, b: string): ReturnType<typeof compareClues>;
  tryPuzzle(id: string, answer: string): { ok: boolean; text: string };
  tryWorldPuzzle(answer: string): { ok: boolean; text: string };
  verdict(input: VerdictInput): void;
  closeReport(): void;
  // gestione
  hire(candidateId: string, role: StaffRole): void;
  assign(staffId: string, role: StaffRole): void;
  dismiss(staffId: string): void;
  upgrade(dept: DeptId): void;
  buy(toolId: string): void;
  stance(id: string, s: Stance): void;
  link(a: string, b: string): LinkResult;
  seen(id: string): void;
  revise(soulId: string, to: Destination): void;
}

export function soulSpriteFor(g: GameState): string | null {
  const ac = g.activeCase;
  if (!ac) return null;
  if (['c09', 'c12', 'c13'].includes(ac.caseId)) return null;
  if (ac.caseId === 'c05' || ac.caseId === 'c10') return 'soul_child';
  if (ac.caseId === 'c11') return 'soul_fused';
  const def = getCaseDef(g, ac.caseId);
  const inc = currentIncarnation(g.souls[def.soulId]);
  if (inc.form) return inc.form.includes('cane') ? 'soul_dog' : null;
  const female = inc.gender === 'f' || /^(Agnese|Sabina|Cornelia|Greta|Hanne|Ines)/.test(inc.name);
  return female ? 'soul_f' : 'soul';
}

export function viewExtra(g: GameState, s: Settings): SyncExtra {
  const amb = [0x6c6880, 0x7c768c, 0x6e6a84, 0x605c7a, 0x524e6c, 0x464262][Math.max(0, Math.min(5, g.chapter))];
  const dim = g.phase >= 4 ? 0.84 : g.phase === 3 ? 0.93 : 1;
  const r = Math.round(((amb >> 16) & 255) * dim), gr = Math.round(((amb >> 8) & 255) * dim), b = Math.round((amb & 255) * dim);
  const flicker = s.reduceFlicker ? 0.015 : Math.min(0.26, 0.05 + g.stats.anomalie * 0.012 + (g.chapter >= 4 ? 0.06 : 0));
  return { soulSprite: soulSpriteFor(g), waiting: g.dayStarted ? g.queue.filter((q) => q.state === 'attesa').length : 0, ambient: (r << 16) | (gr << 8) | b, flicker };
}

export function tension(g: GameState): number {
  return Math.min(1, Math.max(0, (g.chapter - 1) / 4) * 0.7 + g.stats.anomalie * 0.025);
}

export const useStore = create<Store>((set, get) => {
  const G = () => get().game!;
  const bump = () => set((s) => ({ rev: s.rev + 1 }));
  const afterScene = () => {
    const s = get();
    const g = s.game;
    if (!g) return;
    const open = flushRequests(g);
    const pz = takePuzzleRequest(g);
    const ui = s.pendingUi;
    set({ scene: null, pendingUi: null });
    bump();
    if (pz) { set({ puzzleId: pz, panel: 'puzzle' }); return; }
    if (open) { get().callSoul(open); return; }
    if (ui) {
      if (ui === 'desk') get().openPanel('desk');
      else if (ui === 'endday') get().tryEndDay();
      else if (ui === 'directives') get().openPanel('office', 'direttive');
      else if (ui === 'office') get().openPanel('office', 'indicatori');
      else if (ui === 'archive') get().openPanel('archive');
      else if (ui === 'rest') { get().toast(rest(g)); bump(); }
      return;
    }
    const q = get().sceneQueue;
    if (q.length) { set({ sceneQueue: q.slice(1) }); get().playConvo(q[0]); return; }
    get().saveAuto();
  };

  return {
    screen: 'boot', game: null, rev: 0, panel: null, panelTab: null, menuPanel: null, scene: null, sceneQueue: [], pendingUi: null, topicsFor: null,
    doc: null, toasts: [], near: null, roomLabel: '', settings: DEFAULT_SETTINGS, dayReport: null, puzzleId: null, ending: null, endingsUnlocked: [],
    slots: [], confirm: null, saveError: null,

    async boot() {
      let settings = DEFAULT_SETTINGS, endings: string[] = [];
      try {
        settings = { ...DEFAULT_SETTINGS, ...(await getMeta<Partial<Settings>>('settings', {})) };
        endings = await getMeta<string[]>('endings', []);
      } catch { /* archivio locale non disponibile: si gioca senza persistenza delle impostazioni */ }
      audio.setVolumes(settings);
      set({ settings, endingsUnlocked: endings, screen: 'menu' });
      await get().refreshSlots();
    },
    bump,
    toast(text, kind = 'info') {
      const id = ++toastId;
      set((s) => ({ toasts: [...s.toasts.slice(-3), { id, text, kind }] }));
      setTimeout(() => get().dismissToast(id), kind === 'warn' ? 6500 : 4200);
    },
    dismissToast(id) { set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })); },
    sfx(name) { audio.play(name); },
    setSettings(p) {
      const settings = { ...get().settings, ...p };
      set({ settings });
      audio.setVolumes(settings);
      void setMeta('settings', settings).catch(() => undefined);
      bump();
    },
    setMenuPanel(p) { set({ menuPanel: p }); if (p === 'saves') void get().refreshSlots(); },
    async refreshSlots() {
      try { set({ slots: await listSaves() }); } catch { set({ slots: [] }); }
    },

    newGame(mode, name) {
      const seed = seedFrom(name, Date.now());
      const g = mode === 'campaign' ? newCampaign(name, seed) : newEndless(name, seed);
      set({ game: g, screen: 'game', panel: 'dayStart', menuPanel: null, scene: null, sceneQueue: [], ending: null, dayReport: null, topicsFor: null, doc: null, rev: get().rev + 1, roomLabel: '' });
      get().saveAuto();
    },
    async continueGame(mode) {
      return get().loadSlot(mode === 'campaign' ? AUTO_SLOT : ENDLESS_AUTO);
    },
    async loadSlot(slot) {
      const r = await readSave(slot).catch((e) => ({ status: 'corrupt' as const, error: String(e) }));
      if (r.status !== 'ok') {
        get().toast(r.status === 'empty' ? 'Nessun salvataggio in questo slot.' : 'Salvataggio danneggiato: ' + r.error, 'warn');
        return false;
      }
      const g = r.state;
      const done = g.mode === 'campaign' && g.ending;
      set({ game: g, screen: done ? 'ending' : 'game', ending: done ? resolveEnding(g) : null, panel: done ? null : g.dayStarted ? (g.activeCase ? null : null) : 'dayStart', menuPanel: null, scene: null, sceneQueue: [], topicsFor: null, doc: null, rev: get().rev + 1, roomLabel: '' });
      if (r.recovered) get().toast('L\'ultimo salvataggio automatico era danneggiato: è stata ripristinata la copia di riserva.', 'warn');
      return true;
    },
    async saveSlot(slot) {
      const g = get().game;
      if (!g) return;
      try {
        await writeSave(slot, g);
        get().toast('Partita salvata.');
        get().sfx('paper');
      } catch (e) { get().toast('Salvataggio non riuscito: ' + (e instanceof Error ? e.message : String(e)), 'warn'); }
      await get().refreshSlots();
    },
    async deleteSlot(slot) {
      await deleteSave(slot).catch(() => undefined);
      await get().refreshSlots();
    },
    async exportSlot(slot) {
      const json = await exportSave(slot);
      if (!json) return;
      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `reincarnation-office-${slot}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    async importFile(file, slot) {
      try {
        const r = await importSave(await file.text(), slot);
        if (r.ok) get().toast(`Salvataggio importato: ${r.meta.playerName}, turno ${r.meta.day}.`);
        else get().toast(r.error, 'warn');
      } catch (e) { get().toast('Importazione non riuscita: ' + String(e), 'warn'); }
      await get().refreshSlots();
    },
    saveAuto() {
      const g = get().game;
      if (!g) return;
      autosave(g).then(() => { if (get().saveError) set({ saveError: null }); }).catch((e) => {
        const msg = 'Salvataggio automatico non riuscito: ' + (e instanceof Error ? e.message : String(e));
        if (get().saveError !== msg) { set({ saveError: msg }); get().toast(msg, 'warn'); }
      });
    },
    toMenu() {
      get().saveAuto();
      set({ screen: 'menu', panel: null, scene: null, sceneQueue: [], topicsFor: null, doc: null, menuPanel: null });
      void get().refreshSlots();
    },

    beginDay() {
      const g = G();
      if (!g.dayStarted) startDay(g);
      for (const k of Object.keys(g.flags)) if (k.startsWith('chapter_intro_')) delete g.flags[k];
      set({ panel: null });
      bump();
      get().sfx('bell');
      get().saveAuto();
    },
    tryEndDay() {
      const g = G();
      const c = canEndDay(g);
      if (!c.ok) { get().toast('Non puoi ancora timbrare l\'uscita. ' + c.missing[0], 'warn'); get().sfx('error'); return; }
      const left = g.queue.filter((q) => q.state !== 'chiuso').length;
      get().ask(left > 0 ? `Timbrare l'uscita? ${left} pratic${left === 1 ? 'a ordinaria resterà' : 'he ordinarie resteranno'} tra le pendenti.` : 'Timbrare l\'uscita e chiudere il turno?', 'Timbra l\'uscita', () => {
        get().sfx('stamp');
        const rep = endDay(g);
        set({ dayReport: rep, panel: 'dayEnd' });
        bump();
        get().saveAuto();
      });
    },
    closeDayEnd() { set({ panel: 'dayStart', dayReport: null }); bump(); },

    openPanel(p, tab = null) { set({ panel: p, panelTab: tab, topicsFor: null }); if (p) get().sfx('paper'); },
    closePanel() {
      const p = get().panel;
      if (p === 'dayStart' || p === 'dayEnd' || p === 'report') return;
      set({ panel: null, panelTab: null });
    },
    ask(text, yes, onYes) { set({ confirm: { text, yes, onYes } }); },
    closeConfirm() { set({ confirm: null }); },

    interact(t) {
      const g = G();
      if (get().scene || get().panel) return;
      if (t.type === 'npc') {
        if (g.mode === 'endless') { get().playLine(t.id, endlessBark(g, t.id)); return; }
        const auto = npcAutoConvo(g, t.id);
        if (auto) { get().playConvo(auto.id); return; }
        const topics = npcTopics(g, t.id);
        if (topics.length === 0) { get().playLine('narr', `${NPCS.find((n) => n.id === t.id)?.name ?? 'Il collega'} non ha altro da dirti, per ora.`); return; }
        set({ topicsFor: t.id });
        get().sfx('click');
        return;
      }
      const c = objectConvo(g, t.id);
      if (c) get().playConvo(c.id);
    },
    enterRoom(room) {
      const g = get().game;
      if (!g) return;
      const def = roomDef(room);
      if (def) set({ roomLabel: def.label });
      audio.setZone(room, tension(g));
      if (!g.dayStarted) return;
      const evs = roomEvents(g, room);
      if (evs.length) {
        if (evs.some((e) => e.id === 'ev_pendola' || e.id === 'ev_riservato' || e.id === 'ev_rientrato')) audio.silence(7);
        for (const e of evs) get().playConvo(e.id);
      }
    },
    locked(area) {
      if (get().scene) return;
      get().playLine('narr', AREA_LOCKED[area] ?? `${AREA_LABEL[area] ?? 'Quest\'area'}: non sei autorizzato.`);
    },
    setNear(t) { set({ near: t }); },
    movePlayer(x, y) {
      const g = get().game;
      if (g) g.player = { x, y };
    },

    playConvo(id) {
      const g = G();
      if (get().scene) { set((s) => ({ sceneQueue: [...s.sceneQueue, id] })); return; }
      if (!getConvo(id)) return;
      const st = startScene(id);
      const item = sceneNext(g, st);
      set({ scene: { st, item, key: ++sceneKey }, topicsFor: null });
      if (item.kind !== 'line' && item.kind !== 'choice') get().advance(-1);
      bump();
    },
    playLine(speaker, text) {
      const g = G();
      const st = startScene('@line', [{ s: speaker, t: text }]);
      const item = sceneNext(g, st);
      set({ scene: { st, item, key: ++sceneKey }, topicsFor: null });
    },
    advance(choice) {
      const sc = get().scene;
      const g = get().game;
      if (!sc || !g) return;
      let item = sc.item;
      // -1: l'elemento corrente non è ancora stato gestito (doc/ui/end appena prodotti)
      if (choice !== -1) item = sceneNext(g, sc.st, choice);
      for (let guard = 0; guard < 50; guard++) {
        if (item.kind === 'line' || item.kind === 'choice') { set({ scene: { st: sc.st, item, key: ++sceneKey } }); bump(); return; }
        if (item.kind === 'doc') {
          const view = readLore(g, item.id);
          set({ scene: { st: sc.st, item, key: ++sceneKey }, doc: view });
          get().sfx('paper');
          if (view?.changed) { audio.silence(5); audio.play('reveal'); }
          bump();
          return;
        }
        if (item.kind === 'ui') { set({ pendingUi: item.action }); item = sceneNext(g, sc.st); continue; }
        if (item.kind === 'end') { afterScene(); return; }
      }
    },
    closeDoc() { set({ doc: null }); get().advance(); },
    chooseTopic(convoId) {
      set({ topicsFor: null });
      if (convoId) get().playConvo(convoId);
    },

    callSoul(caseId) {
      const g = G();
      try {
        const fresh = !g.activeCase;
        openCase(g, caseId);
        set({ panel: 'case', panelTab: fresh ? 'fascicolo' : get().panelTab });
        if (fresh) get().sfx('bell');
        bump();
        get().saveAuto();
      } catch (e) { get().toast(e instanceof Error ? e.message : String(e), 'warn'); }
    },
    register() { registerSoul(G()); get().sfx('stamp'); bump(); },
    readDocument(id) { readDoc(G(), id); get().sfx('paper'); bump(); },
    note(clueId) {
      const g = G();
      const before = Object.keys(g.knowledge).length;
      const isNew = noteClue(g, clueId);
      if (isNew) {
        const def = getCaseDef(g, g.activeCase!.caseId);
        get().toast('Annotato: ' + (def.clues.find((c) => c.id === clueId)?.label ?? ''), 'clue');
        get().sfx('note');
        if (Object.keys(g.knowledge).length > before) get().toast('Nuova voce nel diario.', 'info');
        bump();
      }
      return isNew;
    },
    askSoul(topicId) {
      const g = G();
      const before = Object.keys(g.knowledge).length;
      const r = askTopic(g, topicId);
      if (r) {
        for (const c of r.newClues) get().toast('Annotato: ' + c.label, 'clue');
        if (r.newClues.length) get().sfx('note');
        if (Object.keys(g.knowledge).length > before) get().toast('Nuova voce nel diario.', 'info');
        bump();
      }
      return r;
    },
    compare(a, b) {
      const r = compareClues(G(), a, b);
      get().sfx(r ? 'chime' : 'click');
      bump();
      return r;
    },
    tryPuzzle(id, answer) {
      const r = attemptPuzzle(G(), id, answer);
      get().sfx(r.ok ? 'chime' : 'error');
      bump();
      return r;
    },
    tryWorldPuzzle(answer) {
      const id = get().puzzleId;
      if (!id) return { ok: false, text: '' };
      const r = attemptWorldPuzzle(G(), id, answer);
      get().sfx(r.ok ? 'chime' : 'error');
      bump();
      if (r.ok) get().saveAuto();
      return r;
    },
    verdict(input) {
      const g = G();
      const report = issueVerdict(g, input);
      get().sfx('stamp');
      if (report.destination === 'ascension') setTimeout(() => get().sfx('lift'), 500);
      else if (report.destination !== 'waitingRoom') setTimeout(() => get().sfx('door'), 500);
      set({ panel: 'report' });
      bump();
      get().saveAuto();
    },
    closeReport() {
      const g = G();
      g.lastReport = null;
      if (g.mode === 'campaign' && g.flags['closed_c13'] && !g.ending) {
        const res = resolveEnding(g);
        g.ending = res.id;
        set({ ending: res, screen: 'ending', panel: null });
        audio.silence(4);
        void unlockEnding(res.id).then((e) => set({ endingsUnlocked: e })).catch(() => undefined);
        bump();
        get().saveAuto();
        return;
      }
      set({ panel: null });
      bump();
      get().saveAuto();
    },

    hire(candidateId, role) { const r = hire(G(), candidateId, role); get().toast(r.text, r.ok ? 'info' : 'warn'); get().sfx(r.ok ? 'stamp' : 'error'); bump(); get().saveAuto(); },
    assign(staffId, role) { assignRole(G(), staffId, role); bump(); },
    dismiss(staffId) { dismiss(G(), staffId); bump(); get().saveAuto(); },
    upgrade(dept) { const r = upgradeDept(G(), dept); get().toast(r.text, r.ok ? 'info' : 'warn'); get().sfx(r.ok ? 'chime' : 'error'); bump(); get().saveAuto(); },
    buy(toolId) { const r = buyTool(G(), toolId); get().toast(r.text, r.ok ? 'info' : 'warn'); get().sfx(r.ok ? 'chime' : 'error'); bump(); get().saveAuto(); },
    stance(id, s) { setStance(G(), id, s); get().sfx('click'); bump(); },
    link(a, b) {
      const g = G();
      const r = tryLink(g, a, b);
      if (r.ok && !r.already) { get().sfx('reveal'); get().toast('Collegamento confermato: ' + r.link!.title, 'clue'); get().saveAuto(); }
      else get().sfx(r.ok ? 'click' : 'error');
      bump();
      return r;
    },
    seen(id) { if (KNOWLEDGE[id]) { markSeen(G(), id); bump(); } },
    revise(soulId, to) { const r = reviseWaiting(G(), soulId, to); get().toast(r.text, r.ok ? 'info' : 'warn'); get().sfx(r.ok ? 'stamp' : 'error'); bump(); get().saveAuto(); },
  };
});
