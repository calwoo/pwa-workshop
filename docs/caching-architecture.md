# Caching Architecture - System Design & Decisions

## Overview

This document describes the caching architecture implemented in Lesson 4, including design decisions, tradeoffs, and the reasoning behind our implementation choices.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                       Browser                            │
│                                                          │
│  ┌──────────┐         ┌────────────────────────────┐   │
│  │   Page   │────────▶│   Service Worker           │   │
│  │          │  fetch  │                            │   │
│  │ app.js   │ events  │  ┌──────────────────────┐  │   │
│  └──────────┘         │  │  Fetch Handler       │  │   │
│                       │  │                      │  │   │
│                       │  │  1. Check Cache      │  │   │
│                       │  │  2. Return or Fetch  │  │   │
│                       │  │  3. Update Cache     │  │   │
│                       │  └──────────────────────┘  │   │
│                       │            │               │   │
│                       │            ▼               │   │
│                       │  ┌──────────────────────┐  │   │
│                       │  │  Cache Storage       │  │   │
│                       │  │                      │  │   │
│                       │  │  task-manager-v1     │  │   │
│                       │  │  ├── /               │  │   │
│                       │  │  ├── /index.html     │  │   │
│                       │  │  ├── /styles.css     │  │   │
│                       │  │  ├── /app.js         │  │   │
│                       │  │  └── /manifest.json  │  │   │
│                       │  └──────────────────────┘  │   │
│                       └────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                                 │
                                 ▼
                          Network (fallback)
```

---

## Component Responsibilities

### 1. Service Worker (`service-worker.js`)

**Role**: Network proxy and cache orchestrator

**Responsibilities**:
- Intercept all HTTP GET requests
- Implement cache-first strategy
- Manage cache lifecycle (install, activate, cleanup)
- Handle offline scenarios

**Key Interfaces**:
```javascript
// Event Handlers
addEventListener('install', handler)   // Cache setup
addEventListener('activate', handler)  // Cache cleanup
addEventListener('fetch', handler)     // Request interception
addEventListener('message', handler)   // Page communication
```

### 2. Cache Storage

**Role**: Persistent HTTP response storage

**Structure**:
```
Cache Storage
├── task-manager-v1 (current)
│   ├── Request: GET /
│   │   └── Response: 200 OK, text/html
│   ├── Request: GET /styles.css
│   │   └── Response: 200 OK, text/css
│   └── ...
└── task-manager-v2 (future versions)
```

**Characteristics**:
- Origin-scoped (separate per domain)
- Persists across sessions
- Not subject to same-origin restrictions
- Large storage quota (~50MB+)

### 3. Page (`app.js`)

**Role**: Service worker client

**Responsibilities**:
- Register service worker on load
- Listen for SW updates
- Communicate with SW via messages (future lessons)

---

## Caching Strategy: Cache-First

### Strategy Definition

```
Request → [Cache Hit?] ──YES──▶ Return Cached Response (0-10ms)
              │
              NO
              │
              ▼
          Network Request ───▶ Response (500-2000ms)
              │
              ▼
          Cache Response
              │
              ▼
          Return to Browser
```

### Algorithm (Pseudocode)

```python
def handle_fetch(request):
    # Step 1: Check cache
    cached = cache.match(request)

    if cached:
        # Step 2a: Cache hit - return immediately
        return cached

    # Step 2b: Cache miss - fetch from network
    try:
        response = network.fetch(request)

        # Step 3: Cache for next time (if successful)
        if response.status in [200, 299]:
            cache.put(request, response.clone())

        return response

    except NetworkError:
        # Step 4: Network failed, no cached version
        throw OfflineError
```

### Performance Characteristics

| Scenario | Latency | Success Rate |
|----------|---------|--------------|
| **First visit** | High (network) | Depends on network |
| **Cached visit** | Very low (~0-10ms) | 100% (offline-capable) |
| **Cache miss** | High (network) | Depends on network |
| **Offline (cached)** | Very low | 100% |
| **Offline (uncached)** | N/A | 0% (fails) |

---

## Design Decisions & Tradeoffs

### Decision 1: Cache Naming Strategy

**Approach**: Version-based cache names

```javascript
const CACHE_NAME = 'task-manager-v1';
```

**Alternatives Considered**:

| Approach | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Static name** | Simple | Hard to update | ❌ Rejected |
| **Timestamp** | Auto-updates | Hard to debug | ❌ Rejected |
| **Version string** | Clear versioning, easy debug | Manual increment | ✅ **Selected** |
| **Git commit hash** | Auto from CI/CD | Opaque to humans | ⚠️ Good for production |

**Reasoning**: Version strings provide the best balance of human-readability and update control. In production, consider using git commit hashes generated during build.

**Implementation**:
```javascript
// Development
const CACHE_NAME = 'task-manager-v1';

// Production (from build process)
const CACHE_NAME = `task-manager-${GIT_COMMIT_HASH}`;
```

### Decision 2: Pre-caching vs On-Demand Caching

**Approach**: Aggressive pre-caching during install

```javascript
event.waitUntil(
    caches.open(CACHE_NAME)
        .then(cache => cache.addAll(STATIC_ASSETS))
);
```

**Tradeoff Analysis**:

**Pre-caching (what we chose)**:
- ✅ Guaranteed offline capability on second visit
- ✅ Predictable behavior (all or nothing)
- ✅ Fast repeat visits (everything cached)
- ❌ Slower initial installation
- ❌ Caches files user might not need
- ❌ Fails installation if any file 404s

**On-demand caching**:
- ✅ Faster installation
- ✅ Only caches used resources
- ✅ Resilient to 404s
- ❌ Unpredictable offline capability
- ❌ Might not cache critical resources
- ❌ Complexity in determining "critical"

**Reasoning**: For an app shell architecture with small static assets (~100KB total), pre-caching is superior. The benefits of guaranteed offline access outweigh the minimal installation overhead.

**When to reconsider**: If your app shell exceeds 500KB, consider:
1. Code splitting (only cache critical route)
2. Lazy caching (cache routes on first visit)
3. Hybrid (pre-cache shell, lazy-cache features)

### Decision 3: skipWaiting() Activation

**Approach**: Immediate activation with `skipWaiting()` + `clients.claim()`

```javascript
// Install
self.skipWaiting();

// Activate
self.clients.claim();
```

**Tradeoff Analysis**:

| Scenario | Without skipWaiting | With skipWaiting |
|----------|-------------------|------------------|
| **Update deployed** | Waits for tabs to close | Activates immediately |
| **User sees update** | Hours/days later | Within 60s |
| **Version conflict risk** | None (all tabs on same version) | High (tabs on different versions) |
| **Development UX** | Slow (need to close tabs) | Fast (instant updates) |

**Our Choice**: Use `skipWaiting()` because:
1. **Development phase**: Fast iteration is critical
2. **Simple app**: Version conflicts unlikely (no shared state)
3. **Educational**: Students see changes immediately

**Production Recommendation**: Remove or combine with update notification:
```javascript
// Wait for user confirmation before updating
self.addEventListener('message', event => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
```

### Decision 4: GET-Only Caching

**Approach**: Only intercept GET requests

```javascript
if (method !== 'GET') {
    return; // Let POST/PUT/DELETE pass through
}
```

**Reasoning**:

**GET requests are**:
- Idempotent (safe to repeat)
- Read-only (no side effects)
- Cacheable per HTTP spec

**POST/PUT/DELETE are**:
- Non-idempotent (repeating causes issues)
- Have side effects (create/modify/delete data)
- Require careful queuing logic

**Example of why POST caching is dangerous**:
```javascript
// User creates task while offline
POST /api/tasks { text: "Buy milk" }

// If we naively cache and replay:
POST /api/tasks { text: "Buy milk" }  // Replay 1
POST /api/tasks { text: "Buy milk" }  // Replay 2
POST /api/tasks { text: "Buy milk" }  // Replay 3

// Result: 3 identical tasks! 😱
```

**Future**: Lesson 9 (Background Sync) will implement proper POST queueing with deduplication.

### Decision 5: Clone Before Caching

**Approach**: Clone responses before caching

```javascript
const responseToCache = networkResponse.clone();
cache.put(event.request, responseToCache);
return networkResponse;
```

**Technical Reason**:

HTTP responses are **ReadableStreams**:
- Stream can only be consumed once
- Reading the stream exhausts it

**What happens without cloning**:
```javascript
const response = fetch('/data');

// Browser consumes stream
return response;  // ✅ Works

// Try to cache (stream already consumed!)
cache.put(request, response);  // ❌ Error: body already used
```

**Solution**: Clone creates independent stream
```javascript
const original = fetch('/data');
const clone = original.clone();

// Two independent streams
return original;  // Browser consumes this
cache.put(clone); // Cache consumes this
```

### Decision 6: Cache Invalidation Strategy

**Approach**: Version-based cache busting

```javascript
// Old cache
const CACHE_NAME = 'task-manager-v1';

// New deployment
const CACHE_NAME = 'task-manager-v2';

// Activate event
cacheNames.filter(name => name !== CACHE_NAME)
          .forEach(name => caches.delete(name));
```

**Alternatives**:

**1. Time-based expiration**:
```javascript
// Not natively supported, requires custom headers
cache-control: max-age=3600
```
❌ Requires server configuration, complex to implement

**2. URL versioning**:
```javascript
<script src="/app.js?v=123"></script>
```
❌ Works but couples cache invalidation to HTML changes

**3. Service worker versioning** (our approach):
✅ Complete control, works for all resources, simple to implement

**Reasoning**: Version-based invalidation gives us explicit control over when caches update, works without server changes, and is easy to reason about.

---

## Cache Storage Internals

### Storage Structure

```javascript
// Simplified model
CacheStorage = {
    'task-manager-v1': Cache {
        entries: Map<Request, Response> {
            Request(GET /) => Response(200, text/html, ...),
            Request(GET /styles.css) => Response(200, text/css, ...),
            Request(GET /app.js) => Response(200, application/javascript, ...),
        }
    }
}
```

### Cache Key Matching

**Default behavior**: Exact URL match

```javascript
// These are DIFFERENT cache entries:
cache.match('/')              // ❌ Miss
cache.match('/index.html')    // ✅ Hit
```

**Why we cache both**:
```javascript
const STATIC_ASSETS = [
    '/',           // Matches: http://localhost:8000/
    '/index.html'  // Matches: http://localhost:8000/index.html
];
```

**Advanced**: Ignore URL search params
```javascript
cache.match(request, { ignoreSearch: true });

// Now these match:
// /styles.css
// /styles.css?v=123
```

### Storage Quotas

| Browser | Quota System | Typical Limit |
|---------|--------------|---------------|
| **Chrome** | Percentage of disk | ~60% of free space |
| **Firefox** | Group limit | ~10% of free space, max 2GB |
| **Safari** | Origin limit | 1GB |

**Checking quota** (future enhancement):
```javascript
if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    console.log(`Used: ${estimate.usage}B`);
    console.log(`Available: ${estimate.quota}B`);
}
```

---

## Error Handling & Resilience

### Installation Failure

**Scenario**: One file in `STATIC_ASSETS` returns 404

**Behavior**: Entire installation fails, old SW stays active

**Mitigation**:
```javascript
// Option 1: Validate assets before deploying
// Option 2: Graceful degradation (don't use addAll)
Promise.all(
    STATIC_ASSETS.map(url =>
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.warn(`Failed to cache: ${url}`);
                    return null;
                }
                return cache.put(url, response);
            })
            .catch(err => console.error(err))
    )
);
```

### Network Failure (Offline)

**Scenario**: User offline, resource not cached

**Current behavior**: Fetch fails, error propagates to page

**Future enhancement** (Lesson 6):
```javascript
.catch(error => {
    // Return custom offline page
    return caches.match('/offline.html');
});
```

### Cache Storage Full

**Scenario**: User runs out of storage quota

**Browser behavior**: Automatic LRU eviction (Least Recently Used)

**Mitigation**: Implement cache size limits
```javascript
async function cleanupOldCaches(maxAge) {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();

    for (const request of requests) {
        const response = await cache.match(request);
        const date = new Date(response.headers.get('date'));

        if (Date.now() - date > maxAge) {
            await cache.delete(request);
        }
    }
}
```

---

## Performance Considerations

### Cache Hit Performance

**Measurements** (typical):
- Cache hit: 5-20ms (includes SW overhead)
- Network (cached): 200-800ms (304 Not Modified)
- Network (fresh): 500-2000ms (200 OK)

**Overhead breakdown**:
- Service worker wake-up: ~5ms
- Cache lookup: ~2-5ms
- Response construction: ~1-3ms

**Total**: ~10-15ms for cached resource vs 500-2000ms from network

**Optimization**: Minimize SW wake-up by keeping SW simple

### Memory Usage

**Service worker**: ~5-10MB (Chrome V8 instance)
**Cache storage**: Size of cached resources (typically 50-200KB for app shell)

**Best practices**:
- Keep SW code small (< 100KB)
- Avoid large data structures in SW
- Don't hold references to cached responses

### CPU Usage

**Per-request overhead**: ~1-2ms CPU time

**At scale** (1000 requests/minute):
- CPU time: 1-2 seconds/minute (trivial)
- Battery impact: Negligible

---

## Testing & Debugging

### DevTools Inspection

**Chrome DevTools → Application → Cache Storage**:
- View all caches
- Inspect cached requests/responses
- Manually delete caches
- Refresh caches

### Common Issues

**Issue**: Cache doesn't update
**Cause**: Old SW still active
**Fix**: Increment `CACHE_NAME`, reload with "Update on reload"

**Issue**: 404 on cached resource
**Cause**: URL mismatch (e.g., `/` vs `/index.html`)
**Fix**: Cache both variations

**Issue**: Service worker not installing
**Cause**: Installation promise rejected (e.g., 404 on asset)
**Fix**: Check console for errors, verify all URLs

### Automated Testing

```javascript
// Test: Verify offline functionality
it('should serve cached resources offline', async () => {
    // Install SW
    const reg = await navigator.serviceWorker.register('/sw.js');
    await reg.installing.waitUntil('activated');

    // Go offline
    await page.setOfflineMode(true);

    // Verify app still loads
    const response = await fetch('/');
    expect(response.status).toBe(200);
});
```

---

## Future Enhancements

### Lesson 5: Multiple Caching Strategies
- Network-first for API data
- Stale-while-revalidate for HTML
- Cache-only for critical resources

### Lesson 6: Offline Fallback
- Custom offline page for uncached routes
- Graceful degradation UI

### Lesson 9: Background Sync
- POST request queuing
- Automatic retry on reconnect
- Deduplication logic

---

## References

### Specifications
- [Service Worker Spec](https://w3c.github.io/ServiceWorker/)
- [Cache API Spec](https://w3c.github.io/ServiceWorker/#cache-interface)

### Implementation Guides
- [MDN: Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)
- [web.dev: Service Worker Caching](https://web.dev/service-worker-caching-and-http-caching/)
- [Jake Archibald: Offline Cookbook](https://web.dev/offline-cookbook/)

### Tools
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - PWA auditing
- [Workbox](https://developers.google.com/web/tools/workbox) - Production-ready SW library
- [sw-precache](https://github.com/GoogleChromeLabs/sw-precache) - Build-time cache generation

---

**Last Updated**: Lesson 4 implementation
**Version**: 1.0.0
**Author**: PWA Workshop
