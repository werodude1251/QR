const CACHE = 'mate-v40-video-gallery';
const ASSETS = [
  './',
  'index.html',
  'styles.css',
  'script.js',
  'manifest.json',
  'img/mate.jpg',
  'img/mate1.jpg',
  'img/mate2.jpg',
  'img/mate3.jpg',
  'img/mate4.jpg',
  'img/mate5.jpg',
  'img/mate6.jpg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if(event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
