// v47 — no cache, force-reload all open clients on activate
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
    const all = await self.clients.matchAll({type:"window",includeUncontrolled:true});
    all.forEach(c => c.navigate(c.url));
  })());
});
self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request, {cache:"no-store"}).catch(() => fetch(e.request)));
});
