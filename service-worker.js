/**
 * Task Manager PWA - Service Worker
 * Lesson 4: Cache API - Precaching Static Assets
 *
 * This service worker implements a cache-first strategy for static assets.
 * The app shell (HTML, CSS, JS, icons) is cached during installation and
 * served instantly from cache on subsequent visits.
 *
 * Architecture:
 * - Install: Pre-cache all static assets (app shell)
 * - Activate: Clean up old cache versions
 * - Fetch: Serve from cache first, fallback to network
 */

// ===================================
// Configuration
// ===================================
const CACHE_NAME = 'task-manager-v1';
const SW_VERSION = '1.1.0';

// Static assets to pre-cache (the "app shell")
// These files rarely change and are needed for the app to work offline
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icons/icon.svg',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

console.log(`[SW] Service Worker ${SW_VERSION} loaded`);
console.log(`[SW] Cache name: ${CACHE_NAME}`);

// ===================================
// INSTALL Event - Pre-cache Static Assets
// ===================================
// This is where we download and cache all the files needed for offline use
self.addEventListener('install', (event) => {
    console.log('[SW] Install event triggered');
    console.log('[SW] Pre-caching static assets...');

    // event.waitUntil() keeps the service worker in the installing phase
    // until the promise resolves. If the promise rejects, installation fails.
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cache opened:', CACHE_NAME);
                console.log('[SW] Caching static assets:', STATIC_ASSETS);

                // cache.addAll() fetches all URLs and adds them to cache
                // If ANY request fails, the entire installation fails
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[SW] ✅ All static assets cached successfully!');
                // Skip waiting so new service worker activates immediately
                // (Good for development, be careful in production)
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] ❌ Failed to cache static assets:', error);
                // Installation will fail, old service worker stays active
            })
    );
});

// ===================================
// ACTIVATE Event - Clean Up Old Caches
// ===================================
// This runs when the service worker takes control
// Perfect time to delete old cache versions
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event triggered');
    console.log('[SW] Cleaning up old caches...');

    event.waitUntil(
        // Get all cache names
        caches.keys()
            .then((cacheNames) => {
                console.log('[SW] Existing caches:', cacheNames);

                // Return array of promises to delete old caches
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Keep current cache, delete everything else
                            return cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[SW] ✅ Old caches cleaned up');
                // Take control of all pages immediately
                return self.clients.claim();
            })
            .then(() => {
                console.log('[SW] ✅ Service worker now controlling all clients');
            })
    );
});

// ===================================
// FETCH Event - Serve from Cache (Cache-First Strategy)
// ===================================
// This intercepts every network request and serves from cache when possible
self.addEventListener('fetch', (event) => {
    const { method, url } = event.request;

    // Only handle GET requests (caching POST/PUT/DELETE is complex)
    if (method !== 'GET') {
        console.log(`[SW] Ignoring non-GET request: ${method} ${url}`);
        return;
    }

    // Log fetch for debugging (disable in production for performance)
    console.log(`[SW] Fetch: ${url}`);

    // event.respondWith() intercepts the request and provides a custom response
    event.respondWith(
        // Cache-First Strategy:
        // 1. Check cache first
        // 2. If found, return cached version (instant!)
        // 3. If not found, fetch from network and cache it
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Cache hit! Return immediately
                    console.log(`[SW] ✅ Serving from cache: ${url}`);
                    return cachedResponse;
                }

                // Cache miss - fetch from network
                console.log(`[SW] ⬇️ Cache miss, fetching from network: ${url}`);

                return fetch(event.request)
                    .then((networkResponse) => {
                        // Clone the response because it can only be consumed once
                        const responseToCache = networkResponse.clone();

                        // Only cache successful responses (200-299 status codes)
                        if (networkResponse.ok) {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    console.log(`[SW] 💾 Caching new resource: ${url}`);
                                    cache.put(event.request, responseToCache);
                                });
                        }

                        return networkResponse;
                    })
                    .catch((error) => {
                        // Network request failed (offline or server error)
                        console.error(`[SW] ❌ Fetch failed: ${url}`, error);

                        // Here we could return a custom offline page
                        // For now, just let the error propagate
                        throw error;
                    });
            })
    );
});

// ===================================
// MESSAGE Event - Communication from Page
// ===================================
// Allows the page to send messages to the service worker
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Received SKIP_WAITING command');
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CACHE_STATUS') {
        // Return cache status info
        caches.open(CACHE_NAME).then((cache) => {
            return cache.keys();
        }).then((keys) => {
            event.ports[0].postMessage({
                type: 'CACHE_STATUS_RESPONSE',
                cacheCount: keys.length,
                cacheName: CACHE_NAME
            });
        });
    }
});

// ===================================
// ERROR Handlers
// ===================================
self.addEventListener('error', (event) => {
    console.error('[SW] Error:', event.error || event.message);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] All event listeners registered');
console.log('[SW] Cache-first strategy active for:', STATIC_ASSETS);
