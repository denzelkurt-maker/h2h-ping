/* Service worker H2H ping : page en « réseau d'abord » (dernière version dès qu'il y a du réseau), copie en secours hors ligne.
   Les appels au script Google ne passent pas par ici (l'appli gère sa copie locale). */
var NOM = 'h2h-ping-v1';
self.addEventListener('install', function (e) { e.waitUntil(caches.open(NOM).then(function (c) { return c.addAll(['./', 'index.html', 'manifest.webmanifest', 'icone-192.png']); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== NOM; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function (r) { var c = r.clone(); caches.open(NOM).then(function (ca) { ca.put(e.request, c); }); return r; }).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match('index.html'); }); }));
});
