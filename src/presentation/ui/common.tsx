import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useStore } from '../../store';
import { audio } from '../audio/audio';
import { ui } from '../../i18n';

/** Pannello «di carta» a tutto schermo su mobile, finestra centrata su desktop. */
export function Sheet(props: { title: string; subtitle?: string; onClose?: () => void; tabs?: { id: string; label: string; badge?: number }[]; tab?: string; onTab?: (id: string) => void; children: ReactNode; wide?: boolean; tone?: 'paper' | 'dark'; footer?: ReactNode; testid?: string }) {
  return (
    <div className="sheet-wrap" role="dialog" aria-label={props.title} data-testid={props.testid}>
      <div className={`sheet ${props.wide ? 'wide' : ''} ${props.tone === 'dark' ? 'dark' : ''}`}>
        <header className="sheet-head">
          <div className="sheet-titles">
            <h2>{props.title}</h2>
            {props.subtitle && <p>{props.subtitle}</p>}
          </div>
          {props.onClose && <button className="btn icon" onClick={props.onClose} aria-label={ui.common.close} data-testid="sheet-close">✕</button>}
        </header>
        {props.tabs && (
          <nav className="tabs" role="tablist">
            {props.tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={props.tab === t.id} className={props.tab === t.id ? 'tab on' : 'tab'} onClick={() => props.onTab?.(t.id)} data-testid={`tab-${t.id}`}>
                {t.label}{t.badge ? <span className="dot">{t.badge}</span> : null}
              </button>
            ))}
          </nav>
        )}
        <div className="sheet-body">{props.children}</div>
        {props.footer && <footer className="sheet-foot">{props.footer}</footer>}
      </div>
    </div>
  );
}

/** Testo che si scrive da solo. Un tocco lo completa. */
export function Typewriter(props: { text: string; onDone?: () => void; skip?: boolean; id?: string | number }) {
  const speed = useStore((s) => s.settings.textSpeed);
  const [n, setN] = useState(speed === 'immediata' ? props.text.length : 0);
  const done = useRef(false);
  useEffect(() => {
    done.current = false;
    if (speed === 'immediata') { setN(props.text.length); done.current = true; props.onDone?.(); return; }
    setN(0);
    const per = speed === 'lenta' ? 2 : 4;
    let i = 0;
    const h = window.setInterval(() => {
      i += per;
      if (i % 12 < per) audio.play('type', 0, 0.6);
      if (i >= props.text.length) {
        window.clearInterval(h);
        setN(props.text.length);
        if (!done.current) { done.current = true; props.onDone?.(); }
      } else setN(i);
    }, 24);
    return () => window.clearInterval(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.text, props.id, speed]);
  useEffect(() => {
    if (props.skip && !done.current) { done.current = true; setN(props.text.length); props.onDone?.(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.skip]);
  return <span>{props.text.slice(0, n)}<span className="tw-rest">{props.text.slice(n)}</span></span>;
}

export function Bar(props: { value: number; max?: number; tone?: 'good' | 'bad' | 'neutral' }) {
  const pct = Math.max(0, Math.min(100, (props.value / (props.max ?? 100)) * 100));
  const cells = 20;
  const on = Math.round((pct / 100) * cells);
  return (
    <div className={`bar ${props.tone ?? 'neutral'}`} role="meter" aria-valuenow={props.value}>
      {Array.from({ length: cells }, (_, i) => <i key={i} className={i < on ? 'on' : ''} />)}
    </div>
  );
}

export function Badge(props: { kind: string; children: ReactNode }) {
  return <span className={`badge b-${props.kind}`}>{props.children}</span>;
}

export function Confirm() {
  const c = useStore((s) => s.confirm);
  const close = useStore((s) => s.closeConfirm);
  if (!c) return null;
  return (
    <div className="confirm-wrap" role="alertdialog" data-testid="confirm">
      <div className="confirm">
        <p>{c.text}</p>
        <div className="row end">
          <button className="btn" onClick={close} data-testid="confirm-no">{ui.common.cancel}</button>
          <button className="btn primary" onClick={() => { close(); c.onYes(); }} data-testid="confirm-yes">{c.yes}</button>
        </div>
      </div>
    </div>
  );
}

export function Toasts() {
  const toasts = useStore((s) => s.toasts);
  const dismiss = useStore((s) => s.dismissToast);
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((t) => <button key={t.id} className={`toast t-${t.kind}`} onClick={() => dismiss(t.id)}>{t.text}</button>)}
    </div>
  );
}

export function fmtTime(sec: number): string {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h} h ${String(m).padStart(2, '0')} min` : `${m} min`;
}

export function useGame() {
  const game = useStore((s) => s.game);
  useStore((s) => s.rev);
  return game!;
}
