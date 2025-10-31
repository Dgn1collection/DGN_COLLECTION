// Service Worker pour la mise en cache et les performances
const CACHE_NAME = 'ndg-collection-v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    // Ne pas mettre /data/*.json ici – on veut toujours les versions récentes
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache');
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    const isData = url.pathname.startsWith('/data/') || url.pathname.endsWith('.json');

    if (isData) {
        // Network-first for JSON/data – jamais mis en cache
        event.respondWith(
            fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache-first pour le reste
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200) return networkResponse;
                const copy = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                return networkResponse;
            });
        })
    );
});
