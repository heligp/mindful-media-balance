const CACHE_NAME = 'timeguardian-cache-v1';
const ASSETS = [
  '/', 
  '/index.html',
  '/manifest.json',
  '/timeguardian-192.png',
  '/timeguardian-512.png',
  '/assets/logo.svg',
  // añade aquí más rutas de tus bundles, CSS, JS...
];

// Al instalar, cacheamos los assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Al activar, limpiamos caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// En fetch usamos cache primero, luego red de fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request))
  );
});
