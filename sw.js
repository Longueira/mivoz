// Mi Voz: guarda la app en la tablet para que abra sin internet
const CACHE = 'mivoz-v1.5.0';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || e.request.method !== 'GET') return;
  // Red primero; SOLO se guarda si la respuesta es correcta (nunca páginas de error del hosting)
  e.respondWith(fetch(e.request).then(r => {
    if (r && r.ok && r.type === 'basic') { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }
    return caches.match(e.request).then(m => m || caches.match('./index.html') || r);
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
