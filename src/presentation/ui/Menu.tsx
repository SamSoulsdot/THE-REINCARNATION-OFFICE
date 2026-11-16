// Menu principale, nuova partita, galleria dei finali, schermata finale.
import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import { ui } from '../../i18n';
import { ENDINGS, EPILOGUE } from '../../content';
import { check } from '../../engine/cond';
import { AUTO_SLOT, ENDLESS_AUTO } from '../../persistence/db';
import { sealURL, portraitURL } from '../iso/atlas';
import { Sheet, fmtTime } from './common';
import { SavesPanel, SettingsPanel } from './Panels';
import { audio } from '../audio/audio';

const ENDING_ORDER = ['perfect', 'reformer', 'rebel', 'cycle', 'newbeginning'];

export function MainMenu() {
  const s = useStore();
  const auto = s.slots.find((x) => x.slot === AUTO_SLOT);
  const endless = s.slots.find((x) => x.slot === ENDLESS_AUTO);
  useEffect(() => { audio.setZone('menu', 0.2); }, []);
  return (
    <div className="menu-screen" data-testid="main-menu">
      <div className="menu-bg" aria-hidden>
        {['bones', 'vesper', 'hoot', 'pim', 'grell', 'ilse'].map((id, i) => <img key={id} src={portraitURL(id)} className={`ghost-portrait p${i}`} alt="" />)}
      </div>
      <div className="menu-panel">
        <img src={sealURL(96)} alt="" className="menu-seal" />
        <h1 className="game-title">The Reincarnation<br />Office</h1>
        <p className="tagline">{ui.tagline}</p>
        <nav className="menu-list">
          {auto?.status === 'ok' && !auto.meta?.ending && (
            <button className="btn big primary" onClick={() => void s.continueGame('campaign')} data-testid="menu-continue">
              {ui.menu.continueCampaign}<small>{auto.meta?.playerName} · {ui.chapters[auto.meta?.chapter ?? 1]} · turno {auto.meta?.day}</small>
            </button>
          )}
          <button className="btn big" onClick={() => s.setMenuPanel('new_campaign')} data-testid="menu-new">{ui.menu.newCampaign}</button>
          {endless?.status === 'ok' && (
            <button className="btn big" onClick={() => void s.continueGame('endless')} data-testid="menu-continue-endless">
              {ui.menu.continueEndless}<small>{endless.meta?.playerName} · turno {endless.meta?.day}</small>
            </button>
          )}
          <button className="btn big" onClick={() => s.setMenuPanel('new_endless')} data-testid="menu-endless">{endless?.status === 'ok' ? ui.menu.newEndless : ui.menu.endless}</button>
          <button className="btn big" onClick={() => s.setMenuPanel('saves')} data-testid="menu-saves">{ui.menu.saves}</button>
          <button className="btn big" onClick={() => s.setMenuPanel('settings')} data-testid="menu-settings">{ui.menu.settings}</button>
          <button className="btn big" onClick={() => s.setMenuPanel('endings')} data-testid="menu-endings">{ui.menu.endings} ({s.endingsUnlocked.length}/5)</button>
        </nav>
        <p className="muted small credits-line">Un gioco narrativo. Grafica, suoni e testi originali, generati e scritti per questo progetto. Funziona offline.</p>
      </div>
      {(s.menuPanel === 'new_campaign' || s.menuPanel === 'new_endless') && <NewGame mode={s.menuPanel === 'new_campaign' ? 'campaign' : 'endless'} />}
      {s.menuPanel === 'saves' && <SavesPanel />}
      {s.menuPanel === 'settings' && <SettingsPanel />}
      {s.menuPanel === 'endings' && <EndingsGallery />}
    </div>
  );
}

function NewGame({ mode }: { mode: 'campaign' | 'endless' }) {
  const s = useStore();
  const [name, setName] = useState('');
  const existing = s.slots.find((x) => x.slot === (mode === 'campaign' ? AUTO_SLOT : ENDLESS_AUTO));
  const go = () => {
    const n = name.trim() || 'Ada Loris';
    if (existing?.status === 'ok') s.ask(ui.newGame.overwrite, ui.newGame.start, () => s.newGame(mode, n));
    else s.newGame(mode, n);
  };
  return (
    <Sheet title={mode === 'campaign' ? ui.newGame.title : ui.menu.endless} onClose={() => s.setMenuPanel(null)} testid="new-game">
      <div className="contract">
        <p className="mono small">UFFICIO REINCARNAZIONI — SEZIONE OCCIDENTALE<br />Contratto di assunzione a tempo indeterminato.</p>
        <p>{mode === 'campaign' ? ui.newGame.campaignNote : ui.newGame.endlessNote}</p>
        <label className="field">
          <span>{ui.newGame.name}</span>
          <input className="input sign" autoFocus maxLength={28} value={name} placeholder={ui.newGame.placeholder} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') go(); }} data-testid="player-name" />
        </label>
        <p className="muted small">Le iniziali del nome compariranno sui documenti.</p>
        <button className="btn primary big" onClick={go} data-testid="start-game">{ui.newGame.start}</button>
      </div>
    </Sheet>
  );
}

function EndingsGallery() {
  const s = useStore();
  return (
    <Sheet title={ui.menu.endings} subtitle={`${s.endingsUnlocked.length} di 5 raggiunti`} onClose={() => s.setMenuPanel(null)} testid="endings">
      <ul className="plain">
        {ENDING_ORDER.map((id) => {
          const e = ENDINGS[id];
          const got = s.endingsUnlocked.includes(id);
          return (
            <li key={id} className={`card ${got ? '' : 'locked'}`}>
              <strong>{got ? e.title : '· · ·'}</strong> <span className="muted">{got ? e.subtitle : 'Non ancora raggiunto'}</span>
              {got && <p className="small">{e.text[0]}</p>}
            </li>
          );
        })}
      </ul>
      <p className="muted small">I finali dipendono da ciò che hai scoperto, da chi ti è rimasto accanto, dallo stato dell'ufficio e dalle scelte sugli ultimi due fascicoli. Nessuno dipende da una sola decisione.</p>
    </Sheet>
  );
}

export function EndingScreen() {
  const s = useStore();
  const g = s.game!;
  const res = s.ending!;
  const e = ENDINGS[res.id];
  const [n, setN] = useState(1);
  const epi = EPILOGUE.filter((x) => check(g, x.cond));
  useEffect(() => {
    if (n >= e.text.length) return;
    const h = window.setTimeout(() => setN((x) => x + 1), 2600);
    return () => window.clearTimeout(h);
  }, [n, e.text.length]);
  return (
    <div className={`ending-screen e-${res.id}`} data-testid="ending" onClick={() => setN(e.text.length)}>
      <div className="ending-inner">
        <img src={sealURL(80, undefined, res.id !== 'newbeginning')} alt="" />
        <h1 data-testid="ending-title">{e.title}</h1>
        <h2>{e.subtitle}</h2>
        {res.reason && <p className="reason">{res.reason}</p>}
        {e.text.slice(0, n).map((p, i) => <p key={i} className="fade-in">{p}</p>)}
        {n >= e.text.length && (
          <>
            <h3>Ciò che resta</h3>
            <ul className="plain">{epi.map((x, i) => <li key={i}>{x.text}</li>)}</ul>
            <dl className="facts">
              <dt>Sentenze emesse</dt><dd>{g.decisions.length}</dd>
              <dt>Misteri risolti</dt><dd>{res.secrets} / 6</dd>
              <dt>Chi ti è rimasto accanto</dt><dd>{res.allies.length ? res.allies.map((a) => ({ hoot: 'Mr. Hoot', bones: 'Mr. Bones', vesper: 'Madame Vesper', ilse: 'Ilse Marrow', pim: 'la Signorina Pim', grell: 'il Custode' } as Record<string, string>)[a]).join(', ') : 'nessuno'}</dd>
              <dt>Tempo di gioco</dt><dd>{fmtTime(g.playSeconds)}</dd>
            </dl>
            <div className="row center">
              <button className="btn primary big" onClick={(ev) => { ev.stopPropagation(); s.toMenu(); }} data-testid="ending-menu">Torna al menu</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
