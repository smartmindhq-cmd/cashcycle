// v48 — self-destruct: wipe all caches and unregister
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.registration.unregister();
    const all = await self.clients.matchAll({type:"window", includeUncontrolled:true});
    all.forEach(c => { try { c.postMessage("RELOAD"); } catch(err){} });
  })());
});
self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request, {cache:"no-store"}).catch(() => fetch(e.request)));
});
