self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('tasbih-cache-v1').then(cache => {
      return cache.addAll([
        'tasbih.html',
        'manifest.json',
        'icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});