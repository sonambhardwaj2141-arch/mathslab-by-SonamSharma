// 🚀 Force immediate update
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Delete ALL old caches
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches
