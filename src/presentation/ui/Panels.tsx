// Pannelli di servizio: inizio e fine turno, pausa, salvataggi, impostazioni, statistiche, enigmi ambientali.
import { useRef } from 'react';
import { useStore } from '../../store';
import { ui } from '../../i18n';
import { CHAPTERS, DIRECTIVES, ENDLESS_EVENTS } from '../../content';
import { dayDef } from '../../engine/campaign';
import { endlessSummary, goalViews, longestSoul } from '../../engine/endless';
import { solvedMysteries } from '../../engine/knowledge';
import { worldPuzzle } from '../../engine/scene';
import { activeDirectives } from '../../engine/office';
import { DEST_LABEL } from '../../engine/text';
import { DESTINATIONS } from '../../engine/types';
import { AUTO_SLOT, ENDLESS_AUTO, MANUAL_SLOTS } from '../../persistence/db';
import { sealURL } from '../iso/atlas';
import { Sheet, fmtTime, useGame } from './common';
import { PuzzleBox } from './CasePanels';

export function DayStartPanel() {
  const g = useGame();
  const s = useStore();
  const def = dayDef(g);
  const introCh = Object.keys(g.flags).find((k) => k.startsWith('chapter_intro_'));
  const ch = introCh ? CHAPTERS[Number(introCh.slice(14))] : null;
  const ev = g.endless?.eventToday;
  return (
    <div className="day-wrap" data-testid="day-start">
      <div className="day-card">
        {ch && (
          <div className="chapter-intro">
            <img src={sealURL(64)} alt="" />
            <h1>{ch.title}</h1>
            <h2>{ch.subtitle}</h2>
            {ch.intro.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
        <div className="memo">
          <div className="doc-kind">{g.mode === 'endless' ? 'Ordine di servizio' : def?.memo.from}</div>
          <h3>{g.mode === 'endless' ? `Turno ${g.day}` : `${def?.title ?? ''} — ${ui.chapters[g.chapter]}`}</h3>
          {g.mode === 'campaign' ? def?.memo.text.map((p, i) => <p key={i}>{p}</p>) : (
            <>
              <p>La fila, stamattina, è di circa {Math.min(6, 3 + Math.floor((g.day - 1) / 4))} anime. Alcune potrebbero non essere nuove.</p>
              {ev && <p><strong>{ENDLESS_EVENTS.find((e) => e.id === ev)?.title}.</strong> {ENDLESS_EVENTS.find((e) => e.id === ev)?.text}</p>}
              <ul className="plain">{goalViews(g).map((x) => <li key={x.id}>Obiettivo: {x.text} ({x.progress}/{x.target})</li>)}</ul>
            </>
          )}
          {activeDirectives(g).length > 0 && <p className="small muted">In vigore: {activeDirectives(g).map((d) => DIRECTIVES.find((x) => x.id === d.id)?.title).join(' · ')}</p>}
        </div>
        <button className="btn primary big" onClick={s.beginDay} data-testid="begin-day">Timbra l'entrata</button>
      </div>
    </div>
  );
}

export function DayEndPanel() {
  const s = useStore();
  const r = s.dayReport;
  if (!r) return null;
  return (
    <div className="day-wrap" data-testid="day-end">
      <div className="day-card">
        <div className="memo">
          <div className="doc-kind">Rapporto di fine turno</div>
          <h3>Turno {r.day}</h3>
          <dl className="facts">
            <dt>Pratiche evase</dt><dd>{r.processed}</dd>
            <dt>Evase d'ufficio dal personale</dt><dd>{r.autoProcessed}</dd>
            <dt>Giudizi irregolari</dt><dd>{r.irregular}</dd>
            <dt>Saldo contabile</dt><dd>{r.credits >= 0 ? '+' : ''}{r.credits} CE</dd>
          </dl>
          <ul className="plain">{r.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
        </div>
        <button className="btn primary big" onClick={s.closeDayEnd} data-testid="next-day">Turno successivo</button>
      </div>
    </div>
  );
}

export function PausePanel() {
  const s = useStore();
  const g = useGame();
  return (
    <Sheet title={ui.pause.title} subtitle={`${g.playerName} · ${g.mode === 'endless' ? 'Endless' : ui.chapters[g.chapter]} · turno ${g.day} · ${fmtTime(g.playSeconds)}`} onClose={s.closePanel} testid="pause">
      <div className="menu-list">
        <button className="btn big" onClick={s.closePanel} data-testid="resume">{ui.pause.resume}</button>
        <button className="btn big" onClick={() => s.openPanel('desk')}>Scrivania e coda delle pratiche</button>
        <button className="btn big" onClick={() => s.openPanel('archive')}>Indice delle Reincarnazioni</button>
        <button className="btn big" onClick={() => s.openPanel('saves')} data-testid="open-saves">{ui.pause.save}</button>
        <button className="btn big" onClick={() => s.openPanel('stats')}>{ui.pause.stats}</button>
        <button className="btn big" onClick={() => s.openPanel('settings')}>{ui.menu.settings}</button>
        <button className="btn big" onClick={() => s.ask('Tornare al menu principale? La partita viene salvata automaticamente.', 'Torna al menu', s.toMenu)} data-testid="to-menu">{ui.pause.toMenu}</button>
      </div>
    </Sheet>
  );
}

function slotTitle(slot: string): string {
  return slot === AUTO_SLOT ? ui.saves.auto : slot === ENDLESS_AUTO ? ui.saves.endless : `${ui.saves.slot} ${slot.slice(4)}`;
}

export function SavesPanel({ inGame }: { inGame?: boolean }) {
  const s = useStore();
  const file = useRef<HTMLInputElement>(null);
  const target = useRef('slot1');
  const close = inGame ? () => s.openPanel('pause') : () => s.setMenuPanel(null);
  return (
    <Sheet title={ui.saves.title} subtitle="Archivio locale del browser (IndexedDB). Esporta i salvataggi per conservarli altrove." onClose={close} testid="saves">
      <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void s.importFile(f, target.current); e.target.value = ''; }} data-testid="import-input" />
      <ul className="slots">
        {[AUTO_SLOT, ENDLESS_AUTO, ...MANUAL_SLOTS].map((slot) => {
          const info = s.slots.find((x) => x.slot === slot);
          const manual = MANUAL_SLOTS.includes(slot);
          return (
            <li key={slot} className={`card slot ${info?.status ?? 'empty'}`} data-testid={`slot-${slot}`}>
              <div className="slot-head"><strong>{slotTitle(slot)}</strong>{info?.savedAt && <small className="muted">{new Date(info.savedAt).toLocaleString('it-IT')}</small>}</div>
              {info?.status === 'ok' && info.meta && (
                <p className="small">{info.meta.playerName} · {info.meta.mode === 'endless' ? 'Endless' : ui.chapters[info.meta.chapter]} · turno {info.meta.day} · {info.meta.cases} sentenze · {fmtTime(info.meta.playSeconds)}{info.meta.ending ? ' · campagna conclusa' : ''}</p>
              )}
              {info?.status === 'corrupt' && <p className="small warn">{ui.saves.corrupt}: {info.error}</p>}
              {(!info || info.status === 'empty') && <p className="small muted">{ui.saves.empty}</p>}
              <div className="row wrap">
                {inGame && manual && <button className="btn primary" onClick={() => (info?.status === 'empty' || !info ? s.saveSlot(slot) : s.ask(ui.saves.overwrite, ui.saves.save, () => s.saveSlot(slot)))} data-testid={`save-${slot}`}>{ui.saves.save}</button>}
                {info?.status === 'ok' && <button className="btn" onClick={() => (inGame ? s.ask(ui.saves.loadConfirm, ui.saves.load, () => void s.loadSlot(slot)) : void s.loadSlot(slot))} data-testid={`load-${slot}`}>{ui.saves.load}</button>}
                {info && info.status !== 'empty' && <button className="btn" onClick={() => void s.exportSlot(slot)} data-testid={`export-${slot}`}>{ui.saves.exp}</button>}
                {manual && <button className="btn" onClick={() => { target.current = slot; if (info?.status === 'ok') s.ask(ui.saves.overwrite, ui.saves.imp, () => file.current?.click()); else file.current?.click(); }} data-testid={`import-${slot}`}>{ui.saves.imp}</button>}
                {info && info.status !== 'empty' && <button className="btn danger" onClick={() => s.ask(ui.saves.delConfirm, ui.saves.del, () => void s.deleteSlot(slot))} data-testid={`delete-${slot}`}>{ui.saves.del}</button>}
              </div>
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}

export function SettingsPanel({ inGame }: { inGame?: boolean }) {
  const s = useStore();
  const st = s.settings;
  const close = inGame ? () => s.openPanel('pause') : () => s.setMenuPanel(null);
  const slider = (k: 'master' | 'music' | 'sfx', label: string) => (
    <label className="field">
      <span>{label}: {Math.round(st[k] * 100)}%</span>
      <input type="range" min={0} max={1} step={0.05} value={st[k]} onChange={(e) => s.setSettings({ [k]: Number(e.target.value) })} data-testid={`vol-${k}`} />
    </label>
  );
  return (
    <Sheet title={ui.settings.title} onClose={close} testid="settings">
      {slider('master', ui.settings.master)}
      {slider('music', ui.settings.music)}
      {slider('sfx', ui.settings.sfx)}
      <label className="field">
        <span>{ui.settings.textSpeed}</span>
        <div className="seg">
          {(['lenta', 'normale', 'immediata'] as const).map((v) => <button key={v} className={st.textSpeed === v ? 'on' : ''} onClick={() => s.setSettings({ textSpeed: v })} data-testid={`speed-${v}`}>{v}</button>)}
        </div>
      </label>
      <label className="check"><input type="checkbox" checked={st.reduceFlicker} onChange={(e) => s.setSettings({ reduceFlicker: e.target.checked })} /> {ui.settings.flicker}</label>
      <button className="btn" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())}>{ui.settings.fullscreen}</button>
      <p className="muted small">{ui.settings.language}: {ui.settings.languageNote}. Comandi: tocca o clicca per muoverti e interagire; trascina per spostare la visuale; rotellina o due dita per lo zoom. Tastiera: WASD/frecce, E per esaminare, J diario, O ufficio, Esc pausa.</p>
    </Sheet>
  );
}

export function StatsPanel() {
  const g = useGame();
  const s = useStore();
  const rows = g.mode === 'endless' ? endlessSummary(g) : [
    { label: 'Tempo di gioco', value: fmtTime(g.playSeconds) },
    { label: 'Sentenze emesse', value: String(g.decisions.length) },
    ...DESTINATIONS.map((d) => ({ label: DEST_LABEL[d], value: String(g.decisions.filter((x) => x.destination === d).length) })),
    { label: 'Verità accertate', value: String(g.decisions.filter((d) => d.truthFound).length) },
    { label: 'Giudizi irregolari', value: String(g.stats.irregolari) },
    { label: 'Misteri risolti', value: `${solvedMysteries(g)} / 6` },
    { label: 'Voci del diario', value: String(Object.keys(g.knowledge).length) },
    { label: 'Collegamenti confermati', value: String(g.links.length) },
  ];
  const longest = longestSoul(g);
  return (
    <Sheet title="Statistiche" onClose={() => s.openPanel('pause')} testid="stats-panel">
      <dl className="facts">{rows.map((r) => <div key={r.label} className="fact"><dt>{r.label}</dt><dd>{r.value}</dd></div>)}</dl>
      {longest && <p className="small">L'anima con più vite: {longest}</p>}
    </Sheet>
  );
}

export function PuzzlePanel() {
  const s = useStore();
  const g = useGame();
  const p = s.puzzleId ? worldPuzzle(s.puzzleId) : null;
  if (!p) return null;
  return (
    <Sheet title={p.title} onClose={() => { useStore.setState({ panel: null, puzzleId: null }); s.saveAuto(); }} testid="world-puzzle">
      <PuzzleBox p={p} done={!!g.flags['puzzle_' + p.id]} onTry={(a) => s.tryWorldPuzzle(a)} />
    </Sheet>
  );
}
