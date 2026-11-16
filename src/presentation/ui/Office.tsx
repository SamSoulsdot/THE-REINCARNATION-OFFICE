// Gestione dell'ufficio: indicatori, personale, reparti, strumenti, direttive.
import { useState } from 'react';
import { useStore } from '../../store';
import { ui } from '../../i18n';
import { activeDirectives, deptCost, directiveMet, wages } from '../../engine/office';
import { check } from '../../engine/cond';
import { DEPARTMENTS, DIRECTIVES, ROLES, TOOLS } from '../../content';
import type { DeptId, StaffRole } from '../../engine/types';
import { Badge, Bar, Sheet, useGame } from './common';

export function OfficePanel() {
  const s = useStore();
  const tab = s.panelTab ?? 'indicatori';
  const tabs = (['indicatori', 'personale', 'reparti', 'strumenti', 'direttive'] as const).map((id) => ({ id, label: ui.office.tabs[id] }));
  const g = useGame();
  return (
    <Sheet wide title="Gestione dell'ufficio" subtitle={`⟡ ${g.credits} Crediti Eterni`} onClose={s.closePanel} tabs={tabs} tab={tab} onTab={(t) => s.openPanel('office', t)} testid="office">
      {tab === 'indicatori' && <Indicatori />}
      {tab === 'personale' && <Personale />}
      {tab === 'reparti' && <Reparti />}
      {tab === 'strumenti' && <Strumenti />}
      {tab === 'direttive' && <Direttive />}
    </Sheet>
  );
}

function Indicatori() {
  const g = useGame();
  const st = g.stats;
  const rep = g.reports[g.reports.length - 1];
  return (
    <div>
      <div className="stats-grid" data-testid="stats">
        <div><span>{ui.stats.efficienza}</span><Bar value={st.efficienza} tone="good" /><b>{st.efficienza}</b></div>
        <div><span>{ui.stats.morale}</span><Bar value={st.morale} tone="good" /><b>{st.morale}</b></div>
        <div><span>{ui.stats.reputazione}</span><Bar value={st.reputazione} tone="good" /><b>{st.reputazione}</b></div>
        <div><span>{ui.stats.sospetto}</span><Bar value={st.sospetto} tone="bad" /><b>{st.sospetto}</b></div>
      </div>
      <dl className="facts">
        <dt>{ui.stats.pendenti}</dt><dd>{st.pendenti}</dd>
        <dt>{ui.stats.irregolari}</dt><dd>{st.irregolari}</dd>
        <dt>{ui.stats.ricorsi}</dt><dd>{st.ricorsi}</dd>
        <dt>{ui.stats.anomalie}</dt><dd>{st.anomalie}</dd>
        <dt>Paghe del personale</dt><dd>{wages(g)} CE a turno</dd>
        <dt>Sentenze emesse</dt><dd>{g.decisions.length}</dd>
      </dl>
      <p className="muted small">Il sospetto cresce quando ometti irregolarità o falsifichi rapporti; oltre una certa soglia arrivano le ispezioni. La reputazione apre porte che il regolamento tiene chiuse.</p>
      {rep && <><h3>Ultimo rapporto di turno (T{rep.day})</h3><ul className="plain">{rep.lines.map((l, i) => <li key={i}>{l}</li>)}</ul></>}
    </div>
  );
}

const ROLE_IDS = Object.keys(ROLES) as StaffRole[];

function Personale() {
  const g = useGame();
  const s = useStore();
  const [roleFor, setRoleFor] = useState<Record<string, StaffRole>>({});
  return (
    <div>
      <h3>Organico ({g.staff.length}/8)</h3>
      {g.staff.length === 0 && <p className="muted">Lavori da solo. Il personale evade pratiche, smista gli arrivi, assiste ai colloqui.</p>}
      <ul className="staff">
        {g.staff.map((m) => (
          <li key={m.id} className="card">
            <div><strong>{m.name}</strong> <small className="muted">{m.temper} · {m.origin}</small></div>
            <div className="row">
              <span>Abilità</span><Bar value={m.skill} max={5} /><span className="muted small">liv. {m.level}</span>
            </div>
            <div className="row">
              <select className="input" value={m.role} onChange={(e) => s.assign(m.id, e.target.value as StaffRole)} aria-label="Mansione">
                {ROLE_IDS.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
              </select>
              <button className="btn" onClick={() => s.ask(`Licenziare ${m.name}?${m.soulId ? ' Tornerà in Sala d\'Attesa.' : ''}`, 'Licenzia', () => s.dismiss(m.id))}>Licenzia</button>
            </div>
            <p className="small muted">{ROLES[m.role].desc}</p>
          </li>
        ))}
      </ul>
      <h3>Candidati</h3>
      <ul className="staff">
        {g.candidates.map((c) => {
          const role = roleFor[c.id] ?? c.best;
          return (
            <li key={c.id} className="card" data-testid={`cand-${c.id}`}>
              <div><strong>{c.name}</strong> <small className="muted">{c.temper}</small></div>
              <p className="small">{c.origin}. Indicato come: {ROLES[c.best].label}.</p>
              <div className="row"><span>Abilità</span><Bar value={c.skill} max={5} /></div>
              <div className="row">
                <select className="input" value={role} onChange={(e) => setRoleFor((x) => ({ ...x, [c.id]: e.target.value as StaffRole }))} aria-label="Mansione">
                  {ROLE_IDS.map((r) => <option key={r} value={r}>{ROLES[r].label}</option>)}
                </select>
                <button className="btn primary" disabled={g.credits < c.cost || g.staff.length >= 8} onClick={() => s.hire(c.id, role)} data-testid={`hire-${c.id}`}>Assumi ({c.cost} CE)</button>
              </div>
            </li>
          );
        })}
      </ul>
      <h3>Mansioni</h3>
      <dl className="facts">{ROLE_IDS.map((r) => <div key={r} className="fact"><dt>{ROLES[r].label}</dt><dd>{ROLES[r].desc}</dd></div>)}</dl>
    </div>
  );
}

function Reparti() {
  const g = useGame();
  const s = useStore();
  return (
    <ul className="depts">
      {(Object.keys(DEPARTMENTS) as DeptId[]).map((d) => {
        const def = DEPARTMENTS[d];
        const lvl = g.departments[d] ?? 0;
        const cost = deptCost(g, d);
        const avail = check(g, def.cond);
        return (
          <li key={d} className="card" data-testid={`dept-${d}`}>
            <div className="row"><strong>{def.label}</strong><span className="muted small">livello {lvl}/{def.levels.length}</span></div>
            <p className="small">{def.desc}</p>
            <ul className="plain small">{def.levels.map((l, i) => <li key={i} className={i < lvl ? 'done' : ''}>{i < lvl ? '☑' : '☐'} {l.effect}</li>)}</ul>
            {!avail ? <p className="muted small">Reparto non ancora accessibile.</p> : cost === null ? <Badge kind="verificato">completo</Badge> : (
              <button className="btn primary" disabled={g.credits < cost} onClick={() => s.upgrade(d)} data-testid={`upgrade-${d}`}>Potenzia ({cost} CE)</button>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Strumenti() {
  const g = useGame();
  const s = useStore();
  return (
    <ul className="depts">
      {TOOLS.filter((t) => check(g, t.cond)).map((t) => (
        <li key={t.id} className="card">
          <strong>{t.label}</strong>
          <p className="small">{t.desc}</p>
          {g.tools.includes(t.id) ? <Badge kind="verificato">in dotazione</Badge> : <button className="btn primary" disabled={g.credits < t.cost} onClick={() => s.buy(t.id)} data-testid={`buy-${t.id}`}>Acquista ({t.cost} CE)</button>}
        </li>
      ))}
    </ul>
  );
}

function Direttive() {
  const g = useGame();
  const s = useStore();
  const act = activeDirectives(g);
  const past = g.directives.filter((d) => d.expiresDay < g.day);
  return (
    <div>
      {act.length === 0 && <p className="muted">Nessuna direttiva in vigore.</p>}
      {act.map((d) => {
        const def = DIRECTIVES.find((x) => x.id === d.id)!;
        return (
          <div key={d.id} className="card directive" data-testid={`directive-${d.id}`}>
            <div className="doc-kind">{def.from} · in vigore fino al turno {d.expiresDay}</div>
            <h3>{def.title}</h3>
            <p className="mono">{def.text}</p>
            <p><strong>Requisito:</strong> {def.requirement} {directiveMet(g, d.id) ? <Badge kind="verificato">rispettato finora</Badge> : <Badge kind="contraddizione">non rispettato</Badge>}</p>
            <div className="seg" role="radiogroup" aria-label="Condotta">
              {(['rispetta', 'ignora', 'manipola'] as const).map((st) => (
                <button key={st} role="radio" aria-checked={(d.stance ?? 'rispetta') === st} className={(d.stance ?? 'rispetta') === st ? 'on' : ''} onClick={() => s.stance(d.id, st)} data-testid={`stance-${d.id}-${st}`}>
                  {st === 'rispetta' ? 'Rispetta' : st === 'ignora' ? 'Ignora apertamente' : 'Falsifica il rapporto'}
                </button>
              ))}
            </div>
            <p className="small muted">
              {(d.stance ?? 'rispetta') === 'rispetta' && 'Se a fine turno il requisito non è soddisfatto, la violazione costa reputazione e alimenta il sospetto.'}
              {d.stance === 'ignora' && 'Se non rispetti il requisito, lo dichiari: costa reputazione, ma il personale apprezza. La Direzione prende nota.'}
              {d.stance === 'manipola' && 'Se non rispetti il requisito, il rapporto lo darà per rispettato. Costa crediti e c\'è il rischio che il falso venga scoperto.'}
            </p>
          </div>
        );
      })}
      {past.length > 0 && <><h3>Direttive scadute</h3><ul className="plain">{past.map((d, i) => <li key={i}>{DIRECTIVES.find((x) => x.id === d.id)?.title} — {d.outcome ?? '—'}</li>)}</ul></>}
    </div>
  );
}
