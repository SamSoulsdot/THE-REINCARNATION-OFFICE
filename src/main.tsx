import { createRoot } from 'react-dom/client';
import '@fontsource/im-fell-english/400.css';
import '@fontsource/im-fell-english/400-italic.css';
import '@fontsource/special-elite/400.css';
import '@fontsource/pixelify-sans/400.css';
import '@fontsource/pixelify-sans/600.css';
import './styles.css';
import { App } from './App';
import { useStore, getView } from './store';

createRoot(document.getElementById('root')!).render(<App />);

// Accesso per i test end-to-end (solo lettura dello stato e della vista).
(window as unknown as { __office: unknown }).__office = { store: useStore, view: getView };

// Funzionamento offline dopo il primo caricamento (solo nella build di produzione).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => undefined); });
}
