const CACHE_NAME = 'tasbih-cache-v1';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png'
];

// ✅ التثبيت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// ✅ الجلب (Cache + Network Update)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
