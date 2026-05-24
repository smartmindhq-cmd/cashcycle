// v49 — self-destruct: wipe all caches and unregister
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    // Get clients first, before unregistering
    const all = await self.clients.matchAll({type:"window", includeUncontrolled:true});
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    // Notify clients to reload before unregistering
    all.forEach(c => { try { c.postMessage("RELOAD"); } catch(err){} });
    await self.registration.unregister();
  })());
});
self.addEventListener("fetch", e => {
  e.respondWith(fetch(e.request, {cache:"no-store"}).catch(() => fetch(e.request)));
});
