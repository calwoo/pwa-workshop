/**
 * Task Manager PWA - Service Worker
 * Lesson 3: Service Worker Basics - Understanding the Lifecycle
 *
 * Service Worker Lifecycle:
 * 1. INSTALL - Fires when SW is first installed (cache static assets here)
 * 2. ACTIVATE - Fires when SW takes control (cleanup old caches here)
 * 3. FETCH - Intercepts all network requests (serve from cache here)
 */

const CACHE_VERSION = 'v1';
const SW_VERSION = '1.0.0';

console.log(`[SW] Service Worker ${SW_VERSION} loaded`);

// ===================================
// INSTALL Event
// ===================================
// Fired when the service worker is first installed
// This happens when:
// - User visits the site for the first time
// - A new version of service-worker.js is detected
self.addEventListener('install', (event) => {
    console.log('[SW] Install event triggered');
    console.log('[SW] Service worker version:', SW_VERSION);
    console.log('[SW] Cache version:', CACHE_VERSION);

    // For now, we're just observing the lifecycle
    // In Lesson 4, we'll add caching logic here

    // Skip waiting to activate immediately (we'll use this later)
    // self.skipWaiting();

    console.log('[SW] Install event completed');
});

// ===================================
// ACTIVATE Event
// ===================================
// Fired when the service worker is activated
// This happens when:
// - No other service worker is controlling the page
// - User closes all tabs and reopens
// - We call skipWaiting() in install event
self.addEventListener('activate', (event) => {
    console.log('[SW] Activate event triggered');
    console.log('[SW] Service worker is now active and ready to handle fetches');

    // Claim all clients immediately (we'll use this later)
    // This makes the SW control the page without requiring a reload
    event.waitUntil(
        clients.claim().then(() => {
            console.log('[SW] Now controlling all clients');
        })
    );

    console.log('[SW] Activate event completed');
});

// ===================================
// FETCH Event
// ===================================
// Fired for every network request made by the page
// This is where we can intercept requests and serve from cache
self.addEventListener('fetch', (event) => {
    const { method, url } = event.request;

    // Log every request to see what's happening
    // In production, you'd remove this or make it conditional
    console.log(`[SW] Fetch event: ${method} ${url}`);

    // For now, we're not intercepting anything
    // Just let the network handle it (default behavior)
    // In Lesson 4, we'll add caching logic here

    // Note: Uncommenting this would serve from network with fallback
    // event.respondWith(fetch(event.request));
});

// ===================================
// MESSAGE Event
// ===================================
// Allows communication between the page and service worker
self.addEventListener('message', (event) => {
    console.log('[SW] Message received:', event.data);

    // Handle different message types
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[SW] Skipping waiting and activating immediately');
        self.skipWaiting();
    }

    // Respond back to the page
    if (event.ports && event.ports[0]) {
        event.ports[0].postMessage({
            type: 'ACK',
            version: SW_VERSION
        });
    }
});

// ===================================
// ERROR Event
// ===================================
// Catches any errors in the service worker
self.addEventListener('error', (event) => {
    console.error('[SW] Error:', event.error || event.message);
});

// ===================================
// UNHANDLED REJECTION Event
// ===================================
// Catches unhandled promise rejections
self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] All event listeners registered');
