const CACHE_NAME = 'catatduit-v1';
const assets = [
  './',
  './index.html',
  './CSS/style.css',
  './JS/script.js'
];

// Menginstal Service Worker dan menyimpan aset ke cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Menjalankan aplikasi secara offline memanfaatkan cache
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});