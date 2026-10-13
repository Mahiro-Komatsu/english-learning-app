// LinguaFlow Service Worker for offline PWA support
const CACHE_NAME = 'linguaflow-cache-v15';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './css/app.css',
  './js/app.js',
  './js/services/storage.js',
  './js/services/speech.js',
  './js/services/ai.js',
  './js/data/flashcards.js',
  './js/data/grammar.js',
  './js/data/grammar_questions.json',
  './js/data/scenarios.js',
  './js/components/dashboard.js',
  './js/components/flashcards.js',
  './js/components/grammar.js',
  './js/components/conversation.js',
  './js/components/settings.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Pass-through for external AI APIs
  if (event.request.url.includes('generativelanguage.googleapis.com') || event.request.url.includes('api.openai.com')) {
    return;
  }

  const isLocalOrigin = event.request.url.startsWith(self.location.origin);

  // Network-First for all local assets and JSON datasets
  if (isLocalOrigin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const respClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Network error or resource not cached', { status: 503, statusText: 'Service Unavailable' });
        })
    );
    return;
  }

  // Cache-First for external CDN libraries (Tailwind, Confetti)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
        }
        return response;
      });
    })
  );
});
