const CACHE = 'mlab-trigno-gallery-v4'
const FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './images/gallery_1.jpg',
  './images/gallery_2.jpg',
  './images/gallery_3.jpg',
  './images/gallery_4.jpg',
  './images/gallery_5.jpg',
  './icons/icon-192.png',
  './icons/icon-512.png'
]

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)))
  self.skipWaiting()
})
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  const wantsImage =
    req.destination === 'image' || url.pathname.includes('/images/')

  if (wantsImage) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req)
        if (cached) return cached
        try {
          const resp = await fetch(req)
          if (resp && resp.ok) cache.put(req, resp.clone())
          return resp
        } catch (err) {
          return caches.match(req) // last resort
        }
      })
    )
    return
  }

  e.respondWith(caches.match(req).then((r) => r || fetch(req)))
})
