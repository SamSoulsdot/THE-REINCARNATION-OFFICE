import { useEffect } from 'react';
import { useStore } from './store';
import { MainMenu, EndingScreen } from './presentation/ui/Menu';
import { GameScreen } from './presentation/ui/GameScreen';
import { Confirm, Toasts } from './presentation/ui/common';
import { audio } from './presentation/audio/audio';

export function App() {
  const screen = useStore((s) => s.screen);
  const boot = useStore((s) => s.boot);
  useEffect(() => { void boot(); }, [boot]);
  // L'audio parte al primo gesto dell'utente (politica dei browser).
  useEffect(() => {
    const go = () => audio.start();
    window.addEventListener('pointerdown', go);
    window.addEventListener('keydown', go);
    return () => { window.removeEventListener('pointerdown', go); window.removeEventListener('keydown', go); };
  }, []);
  // Tempo di gioco e salvataggio automatico periodico.
  useEffect(() => {
    let n = 0;
    const h = window.setInterval(() => {
      const s = useStore.getState();
      if (s.screen !== 'game' || !s.game || document.hidden) return;
      s.game.playSeconds += 1;
      if (++n % 30 === 0) s.saveAuto();
    }, 1000);
    const onHide = () => { if (document.hidden) useStore.getState().saveAuto(); };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onHide);
    return () => { window.clearInterval(h); document.removeEventListener('visibilitychange', onHide); window.removeEventListener('pagehide', onHide); };
  }, []);
  return (
    <div className="app">
      {screen === 'boot' && <div className="boot" data-testid="boot">Apertura degli sportelli…</div>}
      {screen === 'menu' && <MainMenu />}
      {screen === 'game' && <GameScreen />}
      {screen === 'ending' && <EndingScreen />}
      <Confirm />
      <Toasts />
    </div>
  );
}
