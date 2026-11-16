// Service worker: rende il gioco giocabile offline dopo il primo caricamento.
// Pagina: prima la rete (per ricevere gli aggiornamenti), poi la cache. Risorse con hash: prima la cache.
const CACHE = 'reincarnation-office-v3';

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    const base = ['./', './index.html', './favicon.svg', './manifest.webmanifest'];
    let files = [];
    try { files = await (await fetch('./precache.json', { cache: 'no-store' })).json(); } catch { /* sviluppo: nessun elenco */ }
    await c.addAll([...base, ...files.filter((f) => f !== 'index.html').map((f) => './' + f)]);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const isPage = req.mode === 'navigate';
  if (isPage) {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; }).catch(() => caches.match('./index.html', { ignoreVary: true })));
    return;
  }
  e.respondWith(caches.match(req, { ignoreVary: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
