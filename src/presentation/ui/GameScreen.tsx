// Schermata di gioco: vista isometrica + HUD + scene di dialogo + pannelli.
import { useEffect, useRef, useState } from 'react';
import { getView, setView, tension, useStore, viewExtra } from '../../store';
import { IsoView } from '../iso/view';
import { audio } from '../audio/audio';
import { ui } from '../../i18n';
import { NPCS, OBJ_LABEL, SPEAKERS, CHAPTERS } from '../../content';
import { npcTopics, STATE_LABEL, npcPlans } from '../../engine/scene';
import { beats } from '../../engine/campaign';
import { tileAt, SPOTS } from '../../world/map';
import { portraitURL } from '../iso/atlas';
import { Typewriter, useGame } from './common';
import { CasePanel, DeskPanel, ReportPanel } from './CasePanels';
import { JournalPanel } from './Journal';
import { OfficePanel } from './Office';
import { ArchivePanel } from './Archive';
import { DayEndPanel, DayStartPanel, PausePanel, PuzzlePanel, SavesPanel, SettingsPanel, StatsPanel } from './Panels';

export function GameScreen() {
  const host = useRef<HTMLDivElement>(null);
  const g = useGame();
  const s = useStore();
  const [viewReady, setViewReady] = useState(false);

  // Crea la vista una sola volta per partita.
  useEffect(() => {
    if (!host.current) return;
    const v = new IsoView(host.current, {
      canAct: () => {
        const st = useStore.getState();
        return !st.scene && !st.panel && !st.topicsFor && !st.doc && !st.confirm && st.screen === 'game';
      },
      onInteract: (t) => useStore.getState().interact(t),
      onArrive: (x, y) => useStore.getState().movePlayer(x, y),
      onRoom: (room) => useStore.getState().enterRoom(room),
      onLocked: (a) => useStore.getState().locked(a),
      onStep: (f) => audio.play(f === 'marble' || f === 'stone' || f === 'obsidian' ? 'step_stone' : f === 'carpet' || f === 'runner' ? 'step_carpet' : f === 'iron' ? 'step_iron' : 'step_wood', 0, 0.8),
      onNear: (t) => useStore.getState().setNear(t),
      onDoor: () => audio.play('door', 0, 0.6),
      onOverheard: (id) => { const gg = useStore.getState().game; if (gg) { gg.convSeen[id] = 1; useStore.getState().bump(); } },
    });
    setView(v);
    let alive = true;
    v.init().then(() => { if (alive) setViewReady(true); }).catch((e) => useStore.getState().toast('Impossibile avviare la grafica: ' + String(e), 'warn'));
    return () => { alive = false; setView(null); v.destroy(); };
  }, [g.seed, g.mode]);

  // Sincronizza la vista ad ogni cambiamento di stato.
  useEffect(() => {
    const v = getView();
    if (v && viewReady) v.sync(g, viewExtra(g, s.settings));
  }, [s.rev, viewReady, s.settings, g]);

  // Audio ambientale posizionale.
  useEffect(() => {
    const h = window.setInterval(() => {
      const gg = useStore.getState().game;
      if (!gg) return;
      const p = gg.player;
      audio.update([
        { id: 'clock', dx: 14 - p.x, dy: 9 - p.y, active: true },
        { id: 'press', dx: 38 - p.x, dy: 27 - p.y, active: gg.areas.includes('restricted') && !gg.flags['ally_grell_stop'] },
        { id: 'waiting', dx: 10.5 - p.x, dy: 9 - p.y, active: gg.chapter >= 2 || gg.mode === 'endless' },
        { id: 'drip', dx: 37 - p.x, dy: 30 - p.y, active: gg.areas.includes('restricted') },
      ]);
    }, 250);
    return () => window.clearInterval(h);
  }, []);

  useEffect(() => {
    const t = tileAt(Math.round(g.player.x), Math.round(g.player.y));
    if (t) audio.setZone(t.room, tension(g));
  }, [g.chapter, g.stats.anomalie, g]);

  // Esc: chiude o apre la pausa.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useStore.getState();
      if (e.key === 'Escape') {
        if (st.confirm) st.closeConfirm();
        else if (st.topicsFor) st.chooseTopic(null);
        else if (st.panel === 'pause') st.closePanel();
        else if (st.panel && st.panel !== 'case' && st.panel !== 'report' && st.panel !== 'dayStart' && st.panel !== 'dayEnd') st.closePanel();
        else if (!st.panel && !st.scene) st.openPanel('pause');
      }
      if (st.panel || st.scene || st.confirm) return;
      const k = e.key.toLowerCase();
      if (k === 'j') st.openPanel('journal', 'agenda');
      if (k === 'o') st.openPanel('office', 'indicatori');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="game" data-testid="game">
      <div ref={host} className="iso-host" data-testid="iso-host" />
      <Hud />
      {s.topicsFor && <TopicMenu npcId={s.topicsFor} />}
      {s.scene && !s.doc && <SceneBox />}
      {s.doc && <LoreDocView />}
      {s.panel === 'desk' && <DeskPanel />}
      {s.panel === 'case' && g.activeCase && <CasePanel />}
      {s.panel === 'report' && <ReportPanel />}
      {s.panel === 'journal' && <JournalPanel />}
      {s.panel === 'office' && <OfficePanel />}
      {s.panel === 'archive' && <ArchivePanel />}
      {s.panel === 'pause' && <PausePanel />}
      {s.panel === 'saves' && <SavesPanel inGame />}
      {s.panel === 'settings' && <SettingsPanel inGame />}
      {s.panel === 'stats' && <StatsPanel />}
      {s.panel === 'dayStart' && <DayStartPanel />}
      {s.panel === 'dayEnd' && <DayEndPanel />}
      {s.panel === 'puzzle' && <PuzzlePanel />}
    </div>
  );
}

function Hud() {
  const g = useGame();
  const s = useStore();
  const near = s.near;
  const bv = beats(g);
  const nextBeat = bv.find((b) => !b.done && !b.optional) ?? bv.find((b) => !b.done);
  const openCases = g.queue.filter((q) => q.state !== 'chiuso').length;
  const newK = Object.values(g.knowledge).filter((k) => k.isNew).length;
  const v = getView();
  const label = g.mode === 'endless' ? `Endless · ${ui.common.day} ${g.day}` : `${ui.chapters[g.chapter]} · ${ui.common.day} ${g.day}`;
  const hidden = !!(s.panel && s.panel !== 'puzzle') || !!s.scene;
  return (
    <div className={`hud ${hidden ? 'dim' : ''}`}>
      <div className="hud-top">
        <div className="hud-card where" data-testid="hud-where">
          <strong>{label}</strong>
          <span>{ui.phases[g.phase]} — {s.roomLabel || '…'}</span>
        </div>
        <div className="hud-card res">
          <span title="Crediti Eterni" data-testid="hud-credits">⟡ {g.credits} {ui.hud.credits}</span>
          <span title={ui.hud.pending}>▤ {g.stats.pendenti}</span>
        </div>
        <div className="hud-btns">
          <button className="btn" onClick={() => s.openPanel('journal', 'agenda')} data-testid="btn-journal">{ui.hud.journal}{newK > 0 && <span className="dot">{newK}</span>}</button>
          <button className="btn" onClick={() => s.openPanel('office', 'indicatori')} data-testid="btn-office">{ui.hud.office}</button>
          <button className="btn icon" onClick={() => s.openPanel('pause')} aria-label={ui.hud.menu} data-testid="btn-pause">☰</button>
        </div>
      </div>
      {nextBeat && g.dayStarted && (
        <div className="hud-goal" data-testid="hud-goal">
          <span className="seal-mini" />{nextBeat.text}
          {openCases > 0 && <em> · {openCases} pratic{openCases === 1 ? 'a' : 'he'} in coda</em>}
        </div>
      )}
      {g.activeCase && !s.panel && !s.scene && (
        <button className="btn primary hud-case" onClick={() => s.openPanel('case', 'fascicolo')} data-testid="btn-open-case">{ui.hud.dossier}</button>
      )}
      <div className="hud-bottom">
        <div className="cam-btns">
          <button className="btn icon" onClick={() => v?.zoomBy(-1)} aria-label={ui.hud.zoomOut}>−</button>
          <button className="btn icon" onClick={() => v?.recenter()} aria-label={ui.hud.recenter}>◎</button>
          <button className="btn icon" onClick={() => v?.zoomBy(1)} aria-label={ui.hud.zoomIn}>+</button>
        </div>
        {near && !hidden && (
          <button className="btn primary act" onClick={() => v?.interactNear()} data-testid="btn-act">
            {near.type === 'npc' ? ui.hud.talk : ui.hud.examine}: {near.label}
            {near.type === 'npc' && <NpcState id={near.id} />}
          </button>
        )}
      </div>
    </div>
  );
}

function NpcState({ id }: { id: string }) {
  const g = useGame();
  const p = npcPlans(g).find((x) => x.id === id);
  return p ? <small> — {STATE_LABEL[p.state]}</small> : null;
}

function TopicMenu({ npcId }: { npcId: string }) {
  const g = useGame();
  const choose = useStore((s) => s.chooseTopic);
  const npc = NPCS.find((n) => n.id === npcId)!;
  const topics = npcTopics(g, npcId);
  return (
    <div className="scene-wrap" data-testid="topics">
      <div className="scene-box">
        <img className="portrait" src={portraitURL(npc.sprite)} alt="" />
        <div className="scene-text">
          <div className="speaker">{npc.name} <small>{npc.role}</small></div>
          <div className="choices">
            {topics.map((t) => (
              <button key={t.id} className="choice" onClick={() => choose(t.id)} data-testid={`topic-${t.id}`}>
                {t.title ?? '…'}{g.convSeen[t.id] ? <small> (già chiesto)</small> : null}
              </button>
            ))}
            <button className="choice leave" onClick={() => choose(null)} data-testid="topic-leave">{ui.common.leave}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneBox() {
  const sc = useStore((s) => s.scene)!;
  const advance = useStore((s) => s.advance);
  const [done, setDone] = useState(false);
  const [skip, setSkip] = useState(false);
  const item = sc.item;
  useEffect(() => { setDone(false); setSkip(false); }, [sc.key]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (item.kind !== 'line') return;
      if (e.key === ' ' || e.key === 'Enter' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        e.stopPropagation();
        if (!done) setSkip(true); else advance();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [item, done, advance]);
  if (item.kind === 'line') {
    const npc = NPCS.find((n) => n.id === item.speakerId);
    const portrait = item.speakerId === 'you' ? portraitURL('player') : item.speakerId === 'soul' ? portraitURL('soul', 3) : npc ? portraitURL(npc.sprite) : null;
    const narr = item.speakerId === 'narr';
    return (
      <div className="scene-wrap" onClick={() => (done ? advance() : setSkip(true))} data-testid="scene">
        <div className={`scene-box ${narr ? 'narr' : ''}`}>
          {portrait && <img className="portrait" src={portrait} alt="" />}
          <div className="scene-text">
            {!narr && <div className="speaker">{item.speaker || SPEAKERS[item.speakerId]}</div>}
            <p><Typewriter text={item.text} id={sc.key} skip={skip} onDone={() => setDone(true)} /></p>
            <div className={`more ${done ? 'on' : ''}`} data-testid="scene-next">▼</div>
          </div>
        </div>
      </div>
    );
  }
  if (item.kind === 'choice') {
    return (
      <div className="scene-wrap" data-testid="scene">
        <div className="scene-box">
          <img className="portrait" src={portraitURL('player')} alt="" />
          <div className="scene-text">
            <div className="speaker">Tu</div>
            <div className="choices">
              {item.options.map((o, i) => <button key={i} className="choice" onClick={() => advance(i)} data-testid={`choice-${i}`}>{o}</button>)}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

function LoreDocView() {
  const d = useStore((s) => s.doc)!;
  const close = useStore((s) => s.closeDoc);
  return (
    <div className="sheet-wrap" data-testid="lore-doc">
      <div className={`paper-doc ${d.changed ? 'changed' : ''}`}>
        <div className="doc-kind">{d.kind}</div>
        <h2>{d.title}</h2>
        <div className="doc-src">{d.source}</div>
        {d.body.map((p, i) => <p key={i}>{p}</p>)}
        <div className="row end"><button className="btn primary" onClick={close} data-testid="doc-close">{ui.common.close}</button></div>
      </div>
    </div>
  );
}

export function chapterIntro(chapter: number) {
  return CHAPTERS[chapter];
}
export const objLabel = (id: string) => OBJ_LABEL[id] ?? id;
export const spotOf = (id: string) => SPOTS[id];
