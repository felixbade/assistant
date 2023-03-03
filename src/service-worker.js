const CACHE_NAME = 'assistant-pwa-cache-1'
const urlsToCache = ['./index.html', './index.js', './style.css', './icon.png']

// Install the service worker and cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
    )
})

// Serve cached assets when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
        .then(response => response || fetch(event.request))
    )
})

// Delete old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        ))
    )
})
