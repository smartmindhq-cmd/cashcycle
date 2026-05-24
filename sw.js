const CACHE = "forecast-v44";
const ASSETS = ["/", "/index.html", "/icon-180.png", "/icon-192.png", "/icon-512.png", "/manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.url.includes("index.html") || e.request.mode === "navigate") {
    e.respondWith(fetch(e.request, {cache: "no-store"}));
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
