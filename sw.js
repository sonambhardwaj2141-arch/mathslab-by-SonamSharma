self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

const CACHE = "trigno-v10";  // 🔥 CHANGE THIS VERSION NUMBER

const FILES = [
  "./",
  "./index.html",
  "./refresh.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./images/gallery_1.jpeg",
  "./images/gallery_2.jpeg",
  "./images/gallery_3.jpeg",
  "./images/gallery_4.jpeg",
  "./images/gallery_5.jpeg",
  "./images/gallery_6.jpeg",
  "./images/gallery_7.jpeg",
  "./images/gallery_8.jpeg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c
