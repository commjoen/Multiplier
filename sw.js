const CACHE_NAME = 'multiplication-practice-v3';
const TRUSTED_ORIGIN = 'https://www.example.com'; // <-- Set this to your app's origin
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  './styles.css',
  './translations.json',
  './manifest.json',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  // Origin verification
  if (!event.source || !event.source.id) {
    // Unable to verify sender, do nothing
    return;
  }
  self.clients.get(event.source.id).then(client => {
    if (!client || !client.url) {
      // Not from a trusted origin
      return;
    }
    // Compare the origins strictly using the URL API
    let clientOrigin;
    try {
      clientOrigin = new URL(client.url).origin;
    } catch (e) {
      // Malformed URL, do not proceed
      return;
    }
    if (clientOrigin !== TRUSTED_ORIGIN) {
      // Not from a trusted origin
      return;
    }
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
});