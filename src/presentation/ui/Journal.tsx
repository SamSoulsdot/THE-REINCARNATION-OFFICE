// Diario: agenda, conoscenze, misteri, lavagna dei collegamenti, cronologia, codex.
import { useState } from 'react';
import { useStore } from '../../store';
import { ui } from '../../i18n';
import { beats } from '../../engine/campaign';
import { knowledgeList, mysteryViews } from '../../engine/knowledge';
import { activeDirectives, directiveMet } from '../../engine/office';
import { check } from '../../engine/cond';
import { DEST_LABEL, fmt } from '../../engine/text';
import { CODEX, DEST_INFO, DIRECTIVES, KNOWLEDGE, LINKS, ENDLESS_EVENTS } from '../../content';
import { goalViews } from '../../engine/endless';
import type { KCat } from '../../engine/types';
import { Badge, Bar, Sheet, useGame } from './common';

export function JournalPanel() {
  const s = useStore();
  const g = useGame();
  const tab = s.panelTab ?? 'agenda';
  const newCount = Object.values(g.knowledge).filter((k) => k.isNew).length;
  const tabs = (['agenda', 'diario', 'misteri', 'collegamenti', 'cronologia', 'codex'] as const).map((id) => ({ id, label: ui.journal.tabs[id], badge: id === 'diario' ? newCount : undefined }));
  return (
    <Sheet wide title={ui.hud.journal} subtitle={g.playerName} onClose={s.closePanel} tabs={tabs} tab={tab} onTab={(t) => s.openPanel('journal', t)} testid="journal">
      {tab === 'agenda' && <Agenda />}
      {tab === 'diario' && <Diario />}
      {tab === 'misteri' && <Misteri />}
      {tab === 'collegamenti' && <Collegamenti />}
      {tab === 'cronologia' && <Cronologia />}
      {tab === 'codex' && <Codex />}
    </Sheet>
  );
}

function Agenda() {
  const g = useGame();
  const b = beats(g);
  const dirs = activeDirectives(g);
  return (
    <div>
      <h3>{g.mode === 'endless' ? `Turno ${g.day}` : `${ui.chapters[g.chapter]} · Turno ${g.day} · ${ui.phases[g.phase]}`}</h3>
      <ul className="beats" data-testid="beats">
        {b.map((x) => <li key={x.id} className={x.done ? 'done' : ''}>{x.done ? '☑' : '☐'} {x.text}{x.optional ? <small> (facoltativo)</small> : null}</li>)}
      </ul>
      <p className="muted small">A fine turno: orologio marcatempo, in Area Dipendenti.</p>
      {g.endless && (
        <>
          <h3>Obiettivi dell'ufficio</h3>
          <ul className="plain">{goalViews(g).map((x) => <li key={x.id}>{x.text} — {x.progress}/{x.target} <small>(+{x.reward} CE)</small></li>)}</ul>
          {g.endless.eventToday && <div className="card"><strong>{ENDLESS_EVENTS.find((e) => e.id === g.endless!.eventToday)?.title}</strong><p>{ENDLESS_EVENTS.find((e) => e.id === g.endless!.eventToday)?.text}</p></div>}
        </>
      )}
      {dirs.length > 0 && (
        <>
          <h3>Direttive in vigore</h3>
          <ul className="plain">{dirs.map((d) => { const def = DIRECTIVES.find((x) => x.id === d.id); return <li key={d.id}><strong>{def?.title}</strong> — {def?.requirement} {directiveMet(g, d.id) ? <Badge kind="verificato">rispettata finora</Badge> : <Badge kind="contraddizione">non ancora rispettata</Badge>}</li>; })}</ul>
        </>
      )}
    </div>
  );
}

const CATS: KCat[] = ['personaggi', 'anime', 'luoghi', 'documenti', 'simboli', 'indizi', 'eventi', 'collegamenti'];

function Diario() {
  const g = useGame();
  const s = useStore();
  const list = knowledgeList(g);
  const [cat, setCat] = useState<KCat | 'tutte'>('tutte');
  const shown = list.filter((k) => cat === 'tutte' || k.cat === cat);
  return (
    <div>
      <div className="chips">
        <button className={cat === 'tutte' ? 'chip on' : 'chip'} onClick={() => setCat('tutte')}>Tutte ({list.length})</button>
        {CATS.map((c) => { const n = list.filter((k) => k.cat === c).length; return n ? <button key={c} className={cat === c ? 'chip on' : 'chip'} onClick={() => setCat(c)}>{ui.cats[c]} ({n})</button> : null; })}
      </div>
      {shown.length === 0 && <p className="muted">Ancora nessuna annotazione.</p>}
      <ul className="kn-list" data-testid="knowledge">
        {[...shown].reverse().map((k) => (
          <li key={k.id} className={k.isNew ? 'new' : ''} onClick={() => k.isNew && s.seen(k.id)}>
            <div className="row"><Badge kind={k.status}>{ui.status[k.status]}</Badge><small className="muted">{ui.cats[k.cat]} · turno {k.day}</small>{k.isNew && <i className="dot">nuovo</i>}</div>
            <strong>{fmt(g, k.title)}</strong>
            <p>{fmt(g, k.text)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Misteri() {
  const g = useGame();
  const ms = mysteryViews(g).filter((m) => m.open);
  if (!ms.length) return <p className="muted">Nessuna domanda, per ora. L'ufficio sembra un ufficio.</p>;
  return (
    <div>
      {ms.map((m) => (
        <div key={m.def.id} className={`card mystery ${m.solved ? 'solved' : ''}`} data-testid={`mystery-${m.def.id}`}>
          <h3>{m.def.title} {m.solved && <Badge kind="verificato">risolto</Badge>}</h3>
          <p className="q"><em>{m.def.question}</em></p>
          <ul className="plain">{m.notes.map((n, i) => <li key={i}>· {n}</li>)}</ul>
          {m.solved ? <p className="solution">{m.def.solution}</p> : <p className="muted small">Il diario non trae conclusioni al posto tuo.</p>}
        </div>
      ))}
    </div>
  );
}

function Collegamenti() {
  const g = useGame();
  const s = useStore();
  const [a, setA] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [res, setRes] = useState<string | null>(null);
  const linkable = knowledgeList(g).filter((k) => KNOWLEDGE[k.id]?.linkable);
  const done = LINKS.filter((l) => g.links.includes(l.id));
  const pick = (id: string) => {
    setRes(null);
    if (a === id) setA(null);
    else if (b === id) setB(null);
    else if (!a) setA(id);
    else setB(id);
  };
  return (
    <div className="board">
      <p className="muted small">La lavagna dello scrivano. Scegli due annotazioni che secondo te sono legate e proponi il collegamento. Solo i nessi reali vengono confermati; le ipotesi sbagliate non costano nulla, se non tempo.</p>
      <div className="pins">
        {linkable.map((k) => (
          <button key={k.id} className={`pin ${a === k.id || b === k.id ? 'sel' : ''}`} onClick={() => pick(k.id)} data-testid={`pin-${k.id}`} aria-pressed={a === k.id || b === k.id}>
            <small>{ui.cats[k.cat]}</small>{fmt(g, k.title)}
          </button>
        ))}
      </div>
      {linkable.length < 2 && <p className="muted">Servono almeno due annotazioni collegabili.</p>}
      <div className="row">
        <button className="btn primary" disabled={!a || !b} onClick={() => {
          const r = s.link(a!, b!);
          setRes(r.ok ? (r.already ? 'Collegamento già annotato.' : `${r.link!.title}: ${r.link!.text}`) : 'Non vedi un nesso che regga, tra queste due. Forse manca un elemento.');
          setA(null); setB(null);
        }} data-testid="link-try">Proponi il collegamento</button>
        {res && <p className="result" data-testid="link-result">{res}</p>}
      </div>
      {done.length > 0 && (
        <>
          <h3>Collegamenti confermati</h3>
          <ul className="plain">{done.map((l) => <li key={l.id}><strong>{l.title}</strong> — {l.text}</li>)}</ul>
        </>
      )}
      <p className="muted small">Tentativi: {g.linkAttempts}</p>
    </div>
  );
}

function Cronologia() {
  const g = useGame();
  const eras = knowledgeList(g).filter((k) => k.when);
  return (
    <div>
      {eras.length > 0 && (
        <>
          <h3>Fatti ricostruiti</h3>
          <ol className="timeline">{eras.map((k) => <li key={k.id}><b>{k.when}</b> {fmt(g, k.title)} — {fmt(g, k.text)}</li>)}</ol>
        </>
      )}
      <h3>Registro delle sentenze</h3>
      {g.decisions.length === 0 && <p className="muted">Nessuna sentenza emessa.</p>}
      <ol className="timeline">
        {[...g.decisions].reverse().slice(0, 60).map((d) => (
          <li key={d.id}><b>T{d.day}</b> {d.soulName} — {DEST_LABEL[d.revised?.to ?? d.destination]}{d.special ? ` (${d.special})` : ''}{d.irregularities.length ? ' · irregolare' : ''}</li>
        ))}
      </ol>
    </div>
  );
}

function Codex() {
  const g = useGame();
  const entries = CODEX.filter((c) => check(g, c.cond));
  const groups = [...new Set(entries.map((e) => e.group))];
  return (
    <div className="codex">
      <h3>Le cinque destinazioni</h3>
      <dl className="facts">
        {Object.entries(DEST_INFO).map(([k, d]) => <div key={k} className="fact"><dt>{d.name}</dt><dd>{d.official} <em className="muted">{d.door}</em></dd></div>)}
      </dl>
      {groups.map((gr) => (
        <section key={gr}>
          <h3>{gr}</h3>
          {entries.filter((e) => e.group === gr).map((e) => <div key={e.id} className="card"><strong>{e.title}</strong>{e.text.map((t, i) => <p key={i}>{t}</p>)}</div>)}
        </section>
      ))}
      <h3>Indicatori</h3>
      <div className="stats-grid">{(['efficienza', 'morale', 'reputazione', 'sospetto'] as const).map((k) => <div key={k}><span>{ui.stats[k]}</span><Bar value={g.stats[k]} /></div>)}</div>
    </div>
  );
}
