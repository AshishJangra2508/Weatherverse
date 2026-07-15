const CACHE_NAME = 'weather-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/js/app.js',
  '/js/api.js',
  '/js/config.js',
  '/js/maps.js',
  '/js/search.js',
  '/js/ui.js',
  '/js/utils.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // Try network first, then cache
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
