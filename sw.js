const CACHE = 'mate-v31';
const ASSETS = ['./','index.html','styles.css','script.js','img/mate.jpg','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('fetch', event => event.respondWith(caches.match(event.request).then(res => res || fetch(event.request))));
