// Archivio: registro delle anime, storia delle incarnazioni, registro delle decisioni, revisioni.
import { useState } from 'react';
import { useStore } from '../../store';
import { DESTINATIONS, type Destination, type SoulStatus } from '../../engine/types';
import { DEST_LABEL, fmt } from '../../engine/text';
import { Badge, Sheet, useGame } from './common';
import { portraitURL } from '../iso/atlas';

const STATUS: Record<SoulStatus, string> = {
  in_arrivo: 'in arrivo', in_esame: 'in esame', reincarnata: 'reincarnata, in vita', ascesa: 'ascesa', in_attesa: 'in Sala d\'Attesa',
  sbiadita: 'sbiadita', dissolta: 'dissolta', assunta: 'assunta in servizio', liberata: 'liberata',
};

export function ArchivePanel() {
  const g = useGame();
  const s = useStore();
  const [tab, setTab] = useState<'anime' | 'decisioni' | 'attesa'>('anime');
  const [sel, setSel] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const souls = Object.values(g.souls).filter((x) => x.incarnations.some((i) => i.decisionId || i.caseId))
    .filter((x) => !q || x.incarnations.some((i) => fmt(g, i.name).toLowerCase().includes(q.toLowerCase())))
    .sort((a, b) => b.incarnations.length - a.incarnations.length);
  const waiting = Object.values(g.souls).filter((x) => x.status === 'in_attesa');
  const soul = sel ? g.souls[sel] : null;
  return (
    <Sheet wide title="Indice delle Reincarnazioni" subtitle={`${Object.keys(g.souls).length} anime a registro · ${g.decisions.length} sentenze`} onClose={s.closePanel}
      tabs={[{ id: 'anime', label: 'Anime' }, { id: 'decisioni', label: 'Registro delle sentenze' }, { id: 'attesa', label: 'Sala d\'Attesa', badge: waiting.length }]} tab={tab} onTab={(t) => { setTab(t as typeof tab); setSel(null); }} testid="archive">
      {tab === 'anime' && !soul && (
        <>
          <input className="input" placeholder="Cerca per nome" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cerca" />
          <ul className="queue">
            {souls.map((x) => {
              const last = x.incarnations[x.incarnations.length - 1];
              return (
                <li key={x.id} className="q-item">
                  <img src={portraitURL(last.gender === 'f' ? 'soul_f' : 'soul', x.seed % 97)} className="portrait sm" alt="" />
                  <div className="q-text"><strong>{x.incarnations.map((i) => fmt(g, i.name)).join(' → ')}</strong><span>{STATUS[x.status]} · {x.incarnations.length} vit{x.incarnations.length === 1 ? 'a' : 'e'}</span></div>
                  <button className="btn" onClick={() => setSel(x.id)} data-testid={`soul-${x.id}`}>Apri</button>
                </li>
              );
            })}
            {souls.length === 0 && <p className="muted">Nessuna anima giudicata.</p>}
          </ul>
        </>
      )}
      {tab === 'anime' && soul && (
        <div data-testid="soul-detail">
          <button className="btn" onClick={() => setSel(null)}>← Indice</button>
          <h3>Anima {soul.id} — {STATUS[soul.status]}</h3>
          <ol className="lives">
            {soul.incarnations.map((inc) => {
              const d = g.decisions.find((x) => x.id === inc.decisionId);
              return (
                <li key={inc.index} className="card">
                  <strong>{inc.index}. {fmt(g, inc.name)}</strong> <small className="muted">{inc.form ? 'forma non umana' : `${inc.occupation}, ${inc.origin}, ${inc.ageAtDeath} anni`}</small>
                  <p className="small">{fmt(g, inc.bio)}</p>
                  {inc.inherited && <p className="small">Ereditato: {[...inc.inherited.predisposizioni, ...inc.inherited.paure.map((p) => 'paura di ' + p), ...inc.inherited.memorie.map((m) => 'frammento: ' + m)].join('; ')}</p>}
                  {d ? <DecisionView id={d.id} /> : <p className="muted small">{soul.status === 'reincarnata' && inc.index === soul.incarnations.length ? 'In vita. Tornerà a questo sportello.' : 'Nessun giudizio a registro per questa vita.'}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      )}
      {tab === 'decisioni' && (
        <ul className="plain">
          {[...g.decisions].reverse().map((d) => <li key={d.id} className="card"><DecisionView id={d.id} full /></li>)}
          {g.decisions.length === 0 && <p className="muted">Nessuna sentenza.</p>}
        </ul>
      )}
      {tab === 'attesa' && <Waiting />}
    </Sheet>
  );
}

export function DecisionView({ id, full }: { id: string; full?: boolean }) {
  const g = useGame();
  const d = g.decisions.find((x) => x.id === id)!;
  return (
    <div className="decision" data-testid={`decision-${d.id}`}>
      <div className="row"><Badge kind={d.irregularities.length ? 'contraddizione' : 'verificato'}>{d.id}</Badge><strong>{full ? d.soulName + ' — ' : ''}{DEST_LABEL[d.destination]}</strong>{d.special && <em> · {d.special}</em>}{d.revised && <em> · rivista il T{d.revised.day}: {DEST_LABEL[d.revised.to]}</em>}</div>
      <dl className="facts small">
        <dt>Caso</dt><dd>{d.caseTitle}</dd>
        <dt>Data</dt><dd>Turno {d.day}{d.mode === 'campaign' ? `, capitolo ${d.chapter}` : ' (Endless)'}</dd>
        <dt>Motivazione</dt><dd>{fmt(g, d.motivation)}</dd>
        <dt>Evidenze</dt><dd>{d.evidence.length ? d.evidence.map((e) => fmt(g, e)).join('; ') : 'nessuna'}</dd>
        <dt>Irregolarità</dt><dd>{d.irregularities.length ? d.irregularities.join('; ') + (d.concealed ? ' (omesse)' : ' (segnalate)') : 'nessuna'}</dd>
        <dt>Conseguenze</dt><dd>{d.consequences.join(' ')}</dd>
        <dt>Reincarnazione</dt><dd>{d.reincEffects.join(' ')}</dd>
        <dt>Residuo</dt><dd>{d.residuo}</dd>
        <dt>Verità accertata</dt><dd>{d.truthFound ? 'sì' : 'no'}</dd>
      </dl>
    </div>
  );
}

function Waiting() {
  const g = useGame();
  const s = useStore();
  const [to, setTo] = useState<Destination>('renewal');
  const souls = Object.values(g.souls).filter((x) => x.status === 'in_attesa');
  const canRevise = (g.departments.archive ?? 0) >= 2;
  return (
    <div>
      <p className="muted small">Le anime sospese attendono. Chi smette di parlare viene portato via dal Custode.{canRevise ? '' : ' Per rivedere una sospensione serve l\'Ufficio Revisioni (Archivio, livello 2).'}</p>
      {canRevise && (
        <div className="row">
          <span>Nuova destinazione:</span>
          <select className="input" value={to} onChange={(e) => setTo(e.target.value as Destination)} aria-label="Destinazione">
            {DESTINATIONS.filter((d) => d !== 'waitingRoom').map((d) => <option key={d} value={d}>{DEST_LABEL[d]}</option>)}
          </select>
        </div>
      )}
      <ul className="queue">
        {souls.map((x) => {
          const inc = x.incarnations[x.incarnations.length - 1];
          const days = x.waitingSince !== undefined ? g.day - x.waitingSince : null;
          return (
            <li key={x.id} className="q-item">
              <div className="q-text"><strong>{fmt(g, inc.name)}</strong><span>{days !== null ? `in attesa da ${days} turni` : 'in attesa'}</span></div>
              {canRevise && !x.curated && <button className="btn" disabled={g.credits < 30} onClick={() => s.revise(x.id, to)} data-testid={`revise-${x.id}`}>Rivedi (30 CE)</button>}
            </li>
          );
        })}
        {souls.length === 0 && <p className="muted">Le panche sono vuote. O sembrano vuote.</p>}
      </ul>
    </div>
  );
}
