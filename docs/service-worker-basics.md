# Service Worker Basics (Lesson 3)

## What is a Service Worker?

A **Service Worker** is a JavaScript file that runs in the background, separate from your web page. It acts as a programmable network proxy, allowing you to control how network requests from your page are handled.

### Key Characteristics

- **Runs in a separate thread** - Doesn't block the main UI thread
- **No DOM access** - Cannot directly manipulate the page (use `postMessage` to communicate)
- **Event-driven** - Responds to lifecycle and functional events
- **HTTPS required** - Must be served over HTTPS (except localhost for development)
- **Can't use synchronous APIs** - No `localStorage`, `XMLHttpRequest`, etc.

## Service Worker Lifecycle

```
INSTALL → WAITING → ACTIVATE → IDLE → FETCH/MESSAGE → TERMINATED
```

### 1. INSTALL Event

Fired **once** when the service worker is first discovered or a new version is detected.

**When it happens:**
- User visits the PWA for the first time
- A new version of `service-worker.js` is deployed (even 1 byte difference)

**What to do here:**
- Pre-cache static assets (HTML, CSS, JS, images)
- Set up databases
- One-time initialization

**Code example:**
```javascript
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    // Skip waiting to activate immediately (optional)
    self.skipWaiting();
});
```

### 2. ACTIVATE Event

Fired when the service worker is **activated** and ready to take control.

**When it happens:**
- After install, when no other service worker is controlling the page
- When all tabs controlled by the old service worker are closed
- When `skipWaiting()` is called

**What to do here:**
- Clean up old caches
- Claim clients to take control immediately
- Database migrations

**Code example:**
```javascript
self.addEventListener('activate', (event) => {
    console.log('Service Worker activated!');

    // Take control of all pages immediately
    event.waitUntil(clients.claim());
});
```

### 3. FETCH Event

Fired for **every network request** made by pages controlled by this service worker.

**When it happens:**
- Every HTTP request (HTML, CSS, JS, images, API calls, etc.)
- Even requests to different origins (if not blocked by CORS)

**What to do here:**
- Intercept requests and serve from cache
- Implement caching strategies
- Handle offline scenarios

**Code example:**
```javascript
self.addEventListener('fetch', (event) => {
    console.log('Fetching:', event.request.url);

    // Let the browser handle it (default behavior)
    // Or intercept with event.respondWith(...)
});
```

## Service Worker Registration

To use a service worker, you must **register** it from your main app:

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered!', registration);
        })
        .catch(error => {
            console.error('Registration failed:', error);
        });
}
```

### Registration Best Practices

1. **Register on 'load' event** - Prevents competing with initial page load
2. **Use absolute path** - `/service-worker.js` not `./service-worker.js`
3. **Scope matters** - Service worker at `/app/sw.js` only controls `/app/*`
4. **Check for support** - Always feature-detect before registering

## Communication Between Page and Service Worker

Since service workers can't access the DOM, use **messaging**:

### From Page to Service Worker:
```javascript
navigator.serviceWorker.controller.postMessage({
    type: 'SKIP_WAITING'
});
```

### From Service Worker to Page:
```javascript
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
```

## Debugging Service Workers

### Chrome DevTools

1. Open DevTools → **Application** tab
2. Sidebar → **Service Workers**

**You can:**
- ✅ See registration status
- ✅ Update/unregister service workers
- ✅ Simulate offline mode
- ✅ View console logs (filter by "Service Worker")
- ✅ Inspect Cache Storage

### Common Issues

**Problem**: Service worker not updating
**Solution**:
- Check "Update on reload" in DevTools
- Increment cache version
- Clear browser cache

**Problem**: Service worker not registering
**Solution**:
- Check HTTPS (or use localhost)
- Check browser console for errors
- Verify file path is correct

**Problem**: Can't debug service worker code
**Solution**:
- Service worker logs appear in DevTools Console
- Filter by source: "service-worker.js"
- Use `chrome://serviceworker-internals` for advanced debugging

## Service Worker Update Flow

When you deploy a new version:

1. Browser detects change in `service-worker.js`
2. New service worker enters **INSTALL** phase
3. New service worker enters **WAITING** phase
4. **Old service worker still controls the page**
5. User closes all tabs
6. New service worker enters **ACTIVATE** phase

To force immediate update:
```javascript
// In service worker (install event)
self.skipWaiting();

// In service worker (activate event)
self.clients.claim();
```

## Service Worker Scope

The **scope** determines which pages a service worker controls.

Default scope = directory of the service worker file

```
/service-worker.js       → Controls all pages (/)
/app/service-worker.js   → Controls only /app/* pages
```

**To set custom scope:**
```javascript
navigator.serviceWorker.register('/sw.js', {
    scope: '/custom-path/'
});
```

**Important**: A service worker can only control pages within its scope!

## Key Takeaways

1. ✅ Service workers run in the background, separate from your page
2. ✅ Lifecycle: INSTALL → ACTIVATE → FETCH (repeat)
3. ✅ Use `install` for caching, `activate` for cleanup
4. ✅ `fetch` event intercepts ALL network requests
5. ✅ HTTPS required (except localhost)
6. ✅ Debug in DevTools → Application → Service Workers
7. ✅ Service workers enable offline functionality and caching

## Next Steps

In **Lesson 4 (Cache API)**, we'll:
- Pre-cache static assets during install
- Serve cached content in fetch event
- Implement cache-first strategy
- Handle cache cleanup in activate event

## Further Reading

- [MDN: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [web.dev: Service Workers](https://web.dev/learn/pwa/service-workers)
- [Service Worker Cookbook](https://serviceworke.rs/)
