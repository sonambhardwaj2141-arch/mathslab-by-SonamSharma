const CACHE='mlab-trigno-gallery-v1';
const FILES=['./','./index.html','./style.css','./app.js','./manifest.json',
  './images/gallery_1.jpg','./images/gallery_2.jpg','./images/gallery_3.jpg','./images/gallery_4.jpg','./images/gallery_5.jpg',
  './icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))); self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
