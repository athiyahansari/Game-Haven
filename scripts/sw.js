const CACHE_NAME = "my-pwa-cache-v1";
const urlsToCache = [
  "/",
  "../index.html",
  "../about.html",
  "../upcoming.html",  
  "../consoles.html",
  "../peripherals.html",
  "../games.html",
  "../checkout.html",
  "../order.html",
  "../faq.html",
  "../styles/layout.css",
  "../styles/style.css",
  "../styles/checkout.css",
  "../styles/order.css",
  "../scripts/script.js",
  "../scripts/checkout.js",
  "../scripts/order.js",
  "../favicon/android-icon-192x192.png",
  "../favicon/favicon-192x192.png",
  "../favicon/favicon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
script.js
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./scripts/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registered with scope: ", registration.scope);
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed: ", error);
        });
    });
  }