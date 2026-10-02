const CACHE_NAME = 'spotify-pwa-v1';
const ASSETS = [
  './',
  'index.html',
  'img/logo.png'
];

// Instala o Service Worker e guarda os arquivos essenciais no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Força o SW novo a assumir o controle imediatamente
  );
});

// Ativa o Service Worker e limpa caches antigos se houver mudanca de versao
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Serve os arquivos do cache quando o usuário estiver offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
