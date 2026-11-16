// Scrivania, caso attivo (fascicolo, documenti, colloquio, evidenze, ricostruzione, sentenza) e rapporto di reincarnazione.
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useStore } from '../../store';
import { ui } from '../../i18n';
import { DESTINATIONS, TRAIT_KEYS, type CaseDef, type Destination, type DocDef, type PuzzleDef } from '../../engine/types';
import { availableTopics, caesar, currentIncarnation, docAvailable, getCaseDef, puzzleAvailable, visibleDocs } from '../../engine/cases';
import { availableMotivations, availableSpecials, computeIrregularities } from '../../engine/judgment';
import { DEST_LABEL, fmt } from '../../engine/text';
import { DEST_INFO, TRAIT_LABEL } from '../../content';
import { portraitURL, sealURL } from '../iso/atlas';
import { Badge, Bar, Sheet, Typewriter, useGame } from './common';

const KIND_LABEL: Record<string, string> = { curato: 'Pratica assegnata', procedurale: 'Pratica ordinaria', ritorno: 'Ritorno' };

export function DeskPanel() {
  const g = useGame();
  const s = useStore();
  const open = g.queue.filter((q) => q.state !== 'chiuso');
  const closedToday = g.decisions.filter((d) => d.day === g.day);
  return (
    <Sheet title="Scrivania 7" subtitle={`${ui.common.day} ${g.day} · pratiche in coda: ${open.length}`} onClose={s.closePanel} testid="desk">
      {g.activeCase && (
        <div className="card warn-card">
          <p>Sulla scrivania c'è un fascicolo aperto.</p>
          <button className="btn primary" onClick={() => s.openPanel('case', 'fascicolo')} data-testid="desk-resume">Riprendi l'esame</button>
        </div>
      )}
      {!g.dayStarted && <p className="muted">Il turno non è ancora cominciato.</p>}
      {g.dayStarted && open.length === 0 && <p className="muted">Nessuna anima in attesa. Puoi esplorare l'ufficio, occuparti della gestione, o timbrare l'uscita all'orologio marcatempo.</p>}
      <ul className="queue">
        {open.map((q) => {
          const soul = g.souls[q.soulId];
          const inc = soul ? currentIncarnation(soul) : null;
          const active = q.state === 'attivo';
          return (
            <li key={q.caseId} className={`q-item ${q.kind} ${active ? 'active' : ''}`}>
              <img src={portraitURL(q.kind === 'ritorno' ? 'soul_f' : 'soul', (soul?.seed ?? 1) % 97)} alt="" className="portrait sm" />
              <div className="q-text">
                <strong>{q.label}</strong>
                <span>{KIND_LABEL[q.kind]}{q.mandatory ? ' · obbligatoria per chiudere il turno' : ''}{inc && !inc.form ? ` · ${inc.occupation}` : ''}</span>
              </div>
              <button className="btn primary" disabled={!!g.activeCase && !active} onClick={() => s.callSoul(q.caseId)} data-testid={`call-${q.caseId}`}>
                {active ? 'Riprendi' : 'Chiama allo sportello'}
              </button>
            </li>
          );
        })}
      </ul>
      {closedToday.length > 0 && (
        <>
          <h3>Evase in questo turno</h3>
          <ul className="plain">
            {closedToday.map((d) => <li key={d.id}>{d.soulName} — {DEST_LABEL[d.destination]}{d.irregularities.length ? ' · irregolare' : ''}</li>)}
          </ul>
        </>
      )}
    </Sheet>
  );
}

export function CasePanel() {
  const g = useGame();
  const s = useStore();
  const ac = g.activeCase!;
  const def = useMemo(() => getCaseDef(g, ac.caseId), [g, ac.caseId, s.rev]);
  const tab = s.panelTab ?? 'fascicolo';
  const unread = visibleDocs(g, def).filter((d) => docAvailable(g, d) && !ac.docsRead.includes(d.id)).length;
  const newTopics = availableTopics(g, def).filter((t) => !ac.asked.includes(t.id)).length;
  const puzzles = (def.puzzles ?? []).filter((p) => puzzleAvailable(g, p));
  const tabs = [
    { id: 'fascicolo', label: ui.case.tabs.fascicolo },
    { id: 'documenti', label: ui.case.tabs.documenti, badge: unread },
    { id: 'colloquio', label: ui.case.tabs.colloquio, badge: def.noInterview ? 0 : newTopics },
    { id: 'evidenze', label: ui.case.tabs.evidenze, badge: ac.clues.length ? undefined : 0 },
    ...((def.puzzles ?? []).length ? [{ id: 'ricostruzione', label: ui.case.tabs.ricostruzione, badge: puzzles.filter((p) => !ac.puzzles.includes(p.id)).length }] : []),
    { id: 'sentenza', label: ui.case.tabs.sentenza },
  ];
  return (
    <Sheet wide title={fmt(g, def.title)} subtitle={`Pratica ${def.procedural ? 'ordinaria' : 'n. ' + def.id.toUpperCase()} · ${caseTypeLabel(def.type)}`} onClose={s.closePanel} tabs={tabs} tab={tab} onTab={(t) => s.openPanel('case', t)} testid="case">
      {tab === 'fascicolo' && <Fascicolo def={def} />}
      {tab === 'documenti' && <Documenti def={def} />}
      {tab === 'colloquio' && <Colloquio def={def} />}
      {tab === 'evidenze' && <Evidenze def={def} />}
      {tab === 'ricostruzione' && <Ricostruzione def={def} />}
      {tab === 'sentenza' && <Sentenza def={def} />}
    </Sheet>
  );
}

function caseTypeLabel(t: CaseDef['type']): string {
  return ({ ordinario: 'ingresso ordinario', morte_sospetta: 'morte sospetta', ricorso: 'ricorso', vite_precedenti: 'vite precedenti', senza_identita: 'anima senza identità', indagine_interna: 'indagine interna', anomalia_amministrativa: 'anomalia amministrativa', piu_anime: 'più anime', verita_pericolosa: 'verità pericolosa', ritorno: 'ritorno' } as const)[t];
}

const SPOILER_CASES = ['c12', 'c13', 'c11'];

function Fascicolo({ def }: { def: CaseDef }) {
  const g = useGame();
  const s = useStore();
  const ac = g.activeCase!;
  const soul = g.souls[def.soulId];
  const inc = currentIncarnation(soul);
  const prev = inc.index > 1 ? soul.incarnations[inc.index - 2] : null;
  const showEvents = !SPOILER_CASES.includes(def.id);
  const portrait = def.soulId === 'S-PLAYER' ? portraitURL('player') : def.soulId === 'S-ILSE' ? portraitURL('ilse') : def.soulId === 'S-DIRETTORE' ? sealURL(48, 0x2f4468, false) : portraitURL(inc.gender === 'f' || /^(Agnese|Sabina|Cornelia|Greta|Hanne|Ines|Odile|N\.N)/.test(inc.name) ? 'soul_f' : 'soul', soul.seed % 97);
  return (
    <div className="dossier">
      <div className="dossier-head">
        <img src={portrait} alt="" className="portrait lg" />
        <div>
          <p className="arrival"><Typewriter text={fmt(g, def.arrival)} id={def.id} /></p>
        </div>
      </div>
      <div className="card">
        <p className="mono">{fmt(g, def.registration)}</p>
        {ac.registered ? <Badge kind="verificato">{ui.case.registered}</Badge> : <button className="btn primary" onClick={s.register} data-testid="register">{ui.case.register}</button>}
      </div>
      <h3>Scheda dell'anima</h3>
      <dl className="facts">
        <dt>Nome</dt><dd data-testid="soul-name">{fmt(g, inc.name)}</dd>
        {!inc.form && <><dt>Età alla morte</dt><dd>{inc.ageAtDeath || '—'}</dd></>}
        <dt>Origine</dt><dd>{inc.origin} · {inc.era}</dd>
        <dt>Occupazione</dt><dd>{inc.occupation}</dd>
        <dt>Causa della morte</dt><dd>{inc.cause}</dd>
        <dt>Incarnazioni a registro</dt><dd>{soul.incarnations.length}{soul.curated && def.pastLives?.length ? ' (più vite anteriori al registro corrente)' : ''}</dd>
      </dl>
      <p>{fmt(g, inc.bio)}</p>
      {!inc.form && (
        <div className="traits">
          {TRAIT_KEYS.map((k) => <div key={k} className="trait"><span>{TRAIT_LABEL[k]}</span><Bar value={inc.traits[k]} max={10} /></div>)}
          <p className="muted small">Tratti comportamentali descrittivi. Il regolamento non li somma: non esiste un punteggio morale.</p>
        </div>
      )}
      {inc.relations.length > 0 && <><h3>Persone citate</h3><ul className="plain">{inc.relations.map((r, i) => <li key={i}><strong>{fmt(g, r.name)}</strong> — {r.role}</li>)}</ul></>}
      {showEvents && inc.events.length > 0 && <><h3>Eventi a registro</h3><ol className="timeline">{inc.events.map((e, i) => <li key={i}><b>{e.age ? e.age + ' anni' : '—'}</b> {fmt(g, e.text)}</li>)}</ol></>}
      {(def.pastLives?.length || prev) && (
        <>
          <h3>Vite precedenti</h3>
          <ul className="plain">{(def.pastLives ?? []).map((p, i) => <li key={i}>{fmt(g, p)}</li>)}</ul>
          {prev && (g.departments.archive ?? 0) >= 1 && (
            <div className="card">
              <p className="small muted">Indice incrociato (Archivio liv. 1)</p>
              <p><strong>{prev.name}</strong>, {prev.occupation}, {prev.origin}. {prev.bio}</p>
            </div>
          )}
          {inc.inherited && !SPOILER_CASES.includes(def.id) && (
            <p className="small">Ereditato a registro: {[...inc.inherited.predisposizioni, ...inc.inherited.paure.map((p) => 'paura di ' + p), ...inc.inherited.talenti].join('; ') || '—'}.</p>
          )}
        </>
      )}
      <h3>Sintesi d'ufficio</h3>
      <p>{fmt(g, def.summary)}</p>
      <p className="rec"><Badge kind="ipotesi">{ui.case.recommended}</Badge> <strong>{DEST_LABEL[def.recommended]}</strong> — {def.recommendedWhy}</p>
      <div className="row end">
        <button className="btn" onClick={s.closePanel} data-testid="suspend-case">{ui.case.suspend}</button>
        <button className="btn primary" onClick={() => s.openPanel('case', 'documenti')}>{ui.case.tabs.documenti} →</button>
      </div>
    </div>
  );
}

function Documenti({ def }: { def: CaseDef }) {
  const g = useGame();
  const s = useStore();
  const ac = g.activeCase!;
  const docs = visibleDocs(g, def);
  const [sel, setSel] = useState<string>(docs.find((d) => docAvailable(g, d))?.id ?? docs[0]?.id);
  const [msg, setMsg] = useState<string | null>(null);
  const doc = docs.find((d) => d.id === sel);
  useEffect(() => { if (doc && docAvailable(g, doc)) s.readDocument(doc.id); setMsg(null); }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  const lens = g.tools.includes('lente');
  const archivist = g.staff.some((x) => x.role === 'archivista') && def.procedural;
  return (
    <div className="docs">
      <ul className="doc-list">
        {docs.map((d) => {
          const avail = docAvailable(g, d);
          return (
            <li key={d.id}>
              <button className={`doc-tab ${sel === d.id ? 'on' : ''} ${avail ? '' : 'missing'}`} onClick={() => setSel(d.id)} data-testid={`doc-${d.id}`}>
                <span className="doc-kind">{d.kind}</span>
                <span>{avail ? d.title : 'Documento da recuperare'}</span>
                {avail && !ac.docsRead.includes(d.id) && <i className="dot">nuovo</i>}
                {archivist && avail && d.reliability !== 'attendibile' && <i className="flag" title="L'aiuto archivista segnala un'incongruenza">!</i>}
              </button>
            </li>
          );
        })}
      </ul>
      {doc && (docAvailable(g, doc) ? <DocPaper doc={doc} lens={lens} onPara={(clue) => {
        if (!clue) { setMsg(ui.case.noNote); return; }
        const isNew = s.note(clue);
        setMsg(isNew ? null : 'Già annotato.');
      }} noted={ac.clues} /> : (
        <div className="paper-doc missing-doc">
          <h2>{doc.title}</h2>
          <p>Questo documento non è nel fascicolo. Va recuperato altrove, nell'ufficio.</p>
          <p className="hint">{doc.needHint}</p>
          <button className="btn" onClick={s.closePanel}>{ui.case.suspend} e vai a cercarlo</button>
        </div>
      ))}
      {msg && <p className="muted small" data-testid="doc-msg">{msg}</p>}
      <p className="muted small">Tocca un passaggio per annotarlo tra le evidenze.{lens ? ' La lente segnala a margine i passaggi rilevanti.' : ''}</p>
    </div>
  );
}

function DocPaper({ doc, lens, onPara, noted }: { doc: DocDef; lens: boolean; onPara: (clue: string | null) => void; noted: string[] }) {
  const g = useGame();
  return (
    <article className={`paper-doc k-${doc.kind}`} data-testid="doc-paper">
      <div className="doc-kind">{doc.kind} · {doc.source}</div>
      <h2>{doc.title}</h2>
      {doc.body.map((p, i) => {
        const clue = typeof p === 'string' ? null : p.clue;
        const text = fmt(g, typeof p === 'string' ? p : p.t);
        const isNoted = !!clue && noted.includes(clue);
        return (
          <p key={i} className={`para ${isNoted ? 'noted' : ''} ${lens && clue && !isNoted ? 'lens' : ''}`} onClick={() => onPara(clue)} data-testid={clue ? `para-${clue}` : undefined} role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onPara(clue); }}>
            {text}{isNoted && <span className="margin-mark">✎</span>}
          </p>
        );
      })}
    </article>
  );
}

function Colloquio({ def }: { def: CaseDef }) {
  const g = useGame();
  const s = useStore();
  const ac = g.activeCase!;
  const [last, setLast] = useState<string | null>(null);
  const tone = g.tools.includes('cilindro') || (g.departments.interview ?? 0) >= 1;
  if (def.noInterview) return <div className="card"><p>{fmt(g, def.noInterview)}</p></div>;
  const topics = availableTopics(g, def);
  const asked = ac.asked.map((id) => def.topics.find((t) => t.id === id)!).filter(Boolean);
  const fresh = topics.filter((t) => !ac.asked.includes(t.id));
  return (
    <div className="interview">
      <div className="transcript" data-testid="transcript">
        {asked.length === 0 && <p className="muted">Nessuna domanda ancora. Il registratore a cilindri gira a vuoto.</p>}
        {asked.map((t) => (
          <div key={t.id} className={`qa ${last === t.id ? 'fresh' : ''}`}>
            <p className="q">— {fmt(g, t.q)}</p>
            <p className="a">{last === t.id ? <Typewriter text={fmt(g, t.a)} id={t.id} /> : fmt(g, t.a)}</p>
            {tone && <Badge kind={t.tone === 'sincera' ? 'verificato' : t.tone === 'menzogna' ? 'contraddizione' : 'ipotesi'}>{ui.tone[t.tone]}</Badge>}
          </div>
        ))}
      </div>
      <h3>Domande</h3>
      <div className="choices">
        {fresh.map((t) => <button key={t.id} className={`choice ${t.needContra ? 'contest' : ''}`} onClick={() => { s.askSoul(t.id); setLast(t.id); }} data-testid={`ask-${t.id}`}>{t.needContra ? '⚖ ' : ''}{fmt(g, t.q)}</button>)}
        {fresh.length === 0 && <p className="muted">Non hai altre domande da porre. Nuove evidenze o contraddizioni possono aprirne altre.</p>}
      </div>
    </div>
  );
}

function Evidenze({ def }: { def: CaseDef }) {
  const g = useGame();
  const s = useStore();
  const ac = g.activeCase!;
  const [pick, setPick] = useState<string[]>([]);
  const [res, setRes] = useState<string | null>(null);
  const clues = ac.clues.map((id) => def.clues.find((c) => c.id === id)!).filter(Boolean);
  const toggle = (id: string) => setPick((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p.slice(-1), id]));
  const found = def.contradictions.filter((x) => ac.contradictions.includes(x.id));
  return (
    <div className="evidence">
      <p className="muted small">Seleziona due evidenze e confrontale. Se non possono essere vere insieme, la contraddizione potrà essere contestata all'anima durante il colloquio.</p>
      {clues.length === 0 && <p className="muted">Nessuna evidenza annotata. Leggi i documenti e tocca i passaggi rilevanti.</p>}
      <ul className="clue-list">
        {clues.map((c) => (
          <li key={c.id}>
            <button className={`clue ${pick.includes(c.id) ? 'sel' : ''}`} onClick={() => toggle(c.id)} data-testid={`clue-${c.id}`} aria-pressed={pick.includes(c.id)}>
              <Badge kind={c.status}>{ui.status[c.status]}</Badge>
              <strong>{fmt(g, c.label)}</strong>
              <span>{fmt(g, c.text)}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="row">
        <button className="btn primary" disabled={pick.length !== 2} onClick={() => {
          const r = s.compare(pick[0], pick[1]);
          setRes(r ? `Contraddizione: ${r.label}. ${r.note}` : 'Le due evidenze possono stare insieme: nessuna contraddizione.');
          setPick([]);
        }} data-testid="compare">{ui.case.compare}</button>
        {res && <p className="result" data-testid="compare-result">{res}</p>}
      </div>
      {found.length > 0 && (
        <>
          <h3>Contraddizioni rilevate</h3>
          <ul className="plain">{found.map((x) => <li key={x.id}><Badge kind="contraddizione">{ui.status.contraddizione}</Badge> <strong>{x.label}</strong> — {x.note}</li>)}</ul>
        </>
      )}
    </div>
  );
}

function Ricostruzione({ def }: { def: CaseDef }) {
  const g = useGame();
  const ac = g.activeCase!;
  return (
    <div>
      {(def.puzzles ?? []).map((p) => puzzleAvailable(g, p)
        ? <PuzzleBox key={p.id} p={p} done={ac.puzzles.includes(p.id)} />
        : <div key={p.id} className="card"><h3>{p.title}</h3><p className="muted">Servono altre evidenze per tentare la ricostruzione.</p></div>)}
    </div>
  );
}

export function PuzzleBox({ p, done, onTry }: { p: PuzzleDef; done: boolean; onTry?: (answer: string) => { ok: boolean; text: string } }) {
  const s = useStore();
  const [order, setOrder] = useState<string[]>(() => (p.items ?? []).map((i) => i.id));
  const [shift, setShift] = useState(0);
  const [code, setCode] = useState('');
  const [res, setRes] = useState<{ ok: boolean; text: string } | null>(done ? { ok: true, text: p.success } : null);
  const attempt = (a: string) => setRes(onTry ? onTry(a) : s.tryPuzzle(p.id, a));
  const move = (i: number, d: number) => setOrder((o) => { const n = [...o]; const j = i + d; if (j < 0 || j >= n.length) return n; [n[i], n[j]] = [n[j], n[i]]; return n; });
  return (
    <div className="card puzzle" data-testid={`puzzle-${p.id}`}>
      <h3>{p.title}</h3>
      <p>{p.intro}</p>
      {p.kind === 'ordine' && (
        <ol className="order">
          {order.map((id, i) => (
            <li key={id}>
              <span>{p.items!.find((x) => x.id === id)!.text}</span>
              <span className="order-btns">
                <button className="btn icon" onClick={() => move(i, -1)} disabled={i === 0 || res?.ok} aria-label="Su" data-testid={`up-${id}`}>▲</button>
                <button className="btn icon" onClick={() => move(i, 1)} disabled={i === order.length - 1 || res?.ok} aria-label="Giù" data-testid={`down-${id}`}>▼</button>
              </span>
            </li>
          ))}
        </ol>
      )}
      {p.kind === 'cifra' && (
        <div className="cipher">
          <p className="mono big">{p.items![0].text}</p>
          <div className="row">
            <button className="btn icon" onClick={() => setShift((x) => (x + 25) % 26)} aria-label="Meno">−</button>
            <span className="mono" data-testid="shift">scorrimento {shift}</span>
            <button className="btn icon" onClick={() => setShift((x) => (x + 1) % 26)} aria-label="Più" data-testid="shift-up">+</button>
          </div>
          <p className="mono big decoded" data-testid="decoded">{caesar(p.items![0].text, shift)}</p>
        </div>
      )}
      {p.kind === 'codice' && (
        <div className="row">
          <input className="input mono" inputMode="numeric" maxLength={8} value={code} onChange={(e) => setCode(e.target.value)} placeholder="····" data-testid="code-input" aria-label="Combinazione" />
        </div>
      )}
      {!res?.ok && <button className="btn primary" onClick={() => attempt(p.kind === 'ordine' ? order.join(',') : p.kind === 'cifra' ? String(shift) : code)} data-testid="puzzle-try">{ui.case.verify}</button>}
      {res && <p className={res.ok ? 'result ok' : 'result'} data-testid="puzzle-result">{res.text}</p>}
    </div>
  );
}

function Sentenza({ def }: { def: CaseDef }) {
  const g = useGame();
  const s = useStore();
  const ac = g.activeCase!;
  const specials = availableSpecials(g, def);
  const [dest, setDest] = useState<Destination>(def.recommended);
  const [special, setSpecial] = useState<string | null>(null);
  const realDest = special ? specials.find((x) => x.id === special)!.dest : dest;
  const mots = availableMotivations(g, def, realDest);
  const [mot, setMot] = useState<string>(mots[0]?.id ?? 'g_regola');
  const verified = ac.clues.filter((c) => def.clues.find((x) => x.id === c)?.status === 'verificato');
  const [ev, setEv] = useState<string[]>(verified);
  const [conceal, setConceal] = useState(false);
  useEffect(() => { if (!mots.some((m) => m.id === mot)) setMot(mots[0]?.id ?? 'g_regola'); }, [realDest]); // eslint-disable-line react-hooks/exhaustive-deps
  const input = { dest, specialId: special ?? undefined, motivationId: mot, evidence: ev, conceal };
  const irr = computeIrregularities(g, def, input);
  return (
    <div className="verdict">
      <p className="rec"><Badge kind="ipotesi">{ui.case.recommended}</Badge> <strong>{DEST_LABEL[def.recommended]}</strong> — {def.recommendedWhy}{def.binding ? ' (vincolante)' : ''}</p>
      <div className="dest-grid" role="radiogroup">
        {DESTINATIONS.map((d) => (
          <button key={d} role="radio" aria-checked={!special && dest === d} className={`dest d-${d} ${!special && dest === d ? 'on' : ''}`} onClick={() => { setDest(d); setSpecial(null); }} data-testid={`dest-${d}`}>
            <strong>{DEST_INFO[d].name}</strong>
            <span>{DEST_INFO[d].official}</span>
          </button>
        ))}
      </div>
      {specials.length > 0 && (
        <>
          <h3>{ui.case.special}</h3>
          <div className="dest-grid">
            {specials.map((sp) => (
              <button key={sp.id} className={`dest special ${special === sp.id ? 'on' : ''}`} onClick={() => setSpecial(sp.id)} data-testid={`special-${sp.id}`} aria-pressed={special === sp.id}>
                <strong>{sp.label}</strong><span>{fmt(g, sp.desc)}</span>
              </button>
            ))}
          </div>
        </>
      )}
      <label className="field">
        <span>{ui.case.motivation}</span>
        <select className="input" value={mot} onChange={(e) => setMot(e.target.value)} data-testid="motivation">
          {mots.map((m) => <option key={m.id} value={m.id}>{fmt(g, m.text)}</option>)}
        </select>
      </label>
      <fieldset className="field">
        <legend>{ui.case.evidence}</legend>
        {ac.clues.length === 0 && <p className="muted small">Nessuna evidenza annotata.</p>}
        {ac.clues.map((c) => {
          const cd = def.clues.find((x) => x.id === c)!;
          return (
            <label key={c} className="check">
              <input type="checkbox" checked={ev.includes(c)} onChange={(e) => setEv((x) => (e.target.checked ? [...x, c] : x.filter((y) => y !== c)))} />
              <Badge kind={cd.status}>{ui.status[cd.status]}</Badge> {fmt(g, cd.label)}
            </label>
          );
        })}
      </fieldset>
      <div className={`card ${irr.length ? 'warn-card' : ''}`} data-testid="irregularities">
        <strong>{irr.length ? ui.case.irregular : ui.case.regular}</strong>
        {irr.length > 0 && <ul className="plain">{irr.map((x, i) => <li key={i}>{x}</li>)}</ul>}
        {irr.length > 0 && (
          <label className="check"><input type="checkbox" checked={conceal} onChange={(e) => setConceal(e.target.checked)} data-testid="conceal" /> {ui.case.conceal} <span className="muted small">(nessuna perdita di reputazione, ma il sospetto cresce)</span></label>
        )}
      </div>
      <div className="row end">
        <button className="btn" onClick={s.closePanel}>{ui.case.suspend}</button>
        <button className="btn primary stamp-btn" onClick={() => s.ask(`Emettere la sentenza: ${special ? specials.find((x) => x.id === special)!.label : DEST_LABEL[dest]}? La decisione è definitiva.`, 'Timbra', () => s.verdict(input))} data-testid="issue-verdict">
          <img src={sealURL(24)} alt="" /> {ui.case.issue}
        </button>
      </div>
    </div>
  );
}

export function ReportPanel() {
  const g = useGame();
  const s = useStore();
  const r = g.lastReport;
  if (!r) return null;
  const d = g.decisions.find((x) => x.id === r.decisionId)!;
  return (
    <Sheet title="Rapporto di reincarnazione" subtitle={`Protocollo ${r.decisionId} · ${d.soulName}`} testid="report"
      footer={<button className="btn primary" onClick={s.closeReport} data-testid="close-report">{ui.case.closeFile}</button>}>
      <div className={`stamp-head d-${r.destination}`}>
        <img src={sealURL(56)} alt="" className="stamp-anim" />
        <h3 data-testid="report-dest">{r.headline}</h3>
      </div>
      <p className="verdict-text"><Typewriter text={r.text} id={r.decisionId} /></p>
      <h3>Conseguenze registrate</h3>
      <ul className="plain">{r.consequences.map((c, i) => <li key={i}>{c}</li>)}</ul>
      {r.next && (
        <div className="card next-life" data-testid="next-life">
          <h3>{r.next.form ? 'Nuova forma' : 'Nuova incarnazione'}</h3>
          <p><strong>{r.next.name}</strong>{r.next.form ? '' : `, ${r.next.origin} · ${r.next.era}`}</p>
          {!r.next.form && <p className="small">{r.next.bio}</p>}
        </div>
      )}
      {r.inherited && (
        <>
          <h3>Ereditarietà selettiva</h3>
          <dl className="facts">
            {(['predisposizioni', 'paure', 'inclinazioni', 'talenti', 'conflitti', 'memorie', 'legami'] as const).filter((k) => r.inherited![k].length).map((k) => (
              <Fragment key={k}><dt>{k[0].toUpperCase() + k.slice(1)}</dt><dd>{r.inherited![k].join('; ')}</dd></Fragment>
            ))}
          </dl>
        </>
      )}
      <p className="residuo"><Badge kind="ipotesi">Residuo trattenuto</Badge> {r.residuo}</p>
      {r.irregularities.length > 0 && <div className="card warn-card"><strong>Irregolarità {d.concealed ? '(omesse dal registro)' : '(segnalate)'}</strong><ul className="plain">{r.irregularities.map((x, i) => <li key={i}>{x}</li>)}</ul></div>}
      <p className="muted small">+{r.creditsDelta} Crediti Eterni.{d.truthFound ? ' Verità del caso accertata.' : ''}</p>
    </Sheet>
  );
}
