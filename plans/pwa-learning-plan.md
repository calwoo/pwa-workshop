# PWA Learning Plan: From Zero to PWA Developer

## Context

Calvin wants to learn how to build Progressive Web Apps (PWAs) from scratch. The `/Users/calvinwoo/Documents/pwa-learn` directory is currently an empty git repository - a perfect starting point for an incremental, hands-on learning approach.

**Why PWAs?**
- Work offline with service workers
- Installable like native apps (no app store needed)
- Fast performance through caching
- Cross-platform with single codebase
- Discoverable via URLs and search engines

## Learning Approach

This plan uses a **learn-by-building** approach with 10 incremental lessons. Each lesson introduces new concepts through practical implementation, building upon previous lessons. By the end, you'll have a fully functional, installable, offline-capable PWA.

---

## Lesson Structure (10 Lessons)

### Lesson 1: Foundation - Basic Web App
**Goal**: Build a simple task manager with HTML/CSS/JS

**What to Build**:
- Responsive task manager UI
- LocalStorage for data persistence
- Basic CRUD operations

**Files to Create**:
- `index.html` - Main app structure
- `styles.css` - Mobile-first styling
- `app.js` - Application logic
- `README.md` - Project documentation

**Verification**: App loads, works, data persists on reload

---

### Lesson 2: Web App Manifest - Installability
**Goal**: Make the app installable with a manifest file

**What to Build**:
- `manifest.json` with app metadata
- App icons (192x192, 512x512 PNG)
- Theme colors and display mode

**Key Properties**:
```json
{
  "name": "Task Manager PWA",
  "short_name": "TaskMgr",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2196F3",
  "icons": [...]
}
```

**Verification**:
- Install prompt appears in browser
- App installs to desktop/home screen
- Opens in standalone window (no browser UI)
- Lighthouse shows valid manifest

---

### Lesson 3: Service Worker Basics - Registration & Lifecycle
**Goal**: Understand service worker fundamentals

**What to Build**:
- `service-worker.js` with lifecycle events
- Registration code in `app.js`
- Console logging to observe behavior

**Lifecycle Events**:
- `install` - Fires when SW first installed
- `activate` - Fires when SW takes control
- `fetch` - Intercepts network requests

**Verification**:
- SW appears in DevTools → Application → Service Workers
- Status shows "activated and is running"
- Lifecycle events logged in console

---

### Lesson 4: Cache API - Precaching Static Assets
**Goal**: Cache app shell for offline access

**Implementation**:
- Define cache name with version: `task-manager-v1`
- Precache static assets in `install` event
- Serve from cache in `fetch` event (cache-first strategy)
- Clean up old caches in `activate` event

**Verification**:
- Cached files visible in DevTools → Cache Storage
- Go offline → app still works!
- Resources served from service worker

---

### Lesson 5: Caching Strategies
**Goal**: Implement different strategies for different resources

**Three Core Strategies**:

1. **Cache First** (static assets: CSS, JS, images)
   - Fast, serves from cache immediately

2. **Network First** (dynamic content: API data)
   - Fresh data with offline fallback

3. **Stale While Revalidate** (HTML pages)
   - Serve from cache, update in background

**Implementation**:
- Route requests by type in `fetch` handler
- Implement strategy functions
- Handle failures gracefully

**Verification**:
- Static assets load from cache
- Dynamic content tries network first
- Offline fallback works for cached data

---

### Lesson 6: Offline Fallback Page
**Goal**: Show custom offline page when content unavailable

**What to Build**:
- `offline.html` - User-friendly offline page
- Precache offline page
- Return offline page for failed navigations

**Verification**:
- Go offline
- Navigate to non-cached URL → see custom offline page
- Return to cached URL → see cached app

---

### Lesson 7: Update Strategy - Version Management
**Goal**: Notify users when updates are available

**The Problem**:
- Service workers cache aggressively
- New versions wait until all tabs closed
- Users may never see updates

**Solution**:
- Detect `updatefound` event
- Show update notification UI
- Handle `SKIP_WAITING` message
- Reload on controller change

**Verification**:
- Make visible change, increment cache version
- Reload → update notification appears
- Click "Update Now" → new version loads

---

### Lesson 8: Add to Home Screen Prompt
**Goal**: Customize the installation experience

**Implementation**:
- Capture `beforeinstallprompt` event
- Show custom install button
- Trigger install on user action
- Detect `appinstalled` event
- Hide button if already installed

**Verification**:
- Custom install button appears
- Click → browser prompt shows
- Accept → app installs
- Reopen → button hidden (already installed)

---

### Lesson 9: Background Sync (Advanced)
**Goal**: Queue actions offline, sync when connected

**Use Cases**:
- Send messages when offline
- Submit forms without connection
- Upload photos on poor networks

**Implementation**:
- Register sync event from app
- Queue data in IndexedDB
- Handle `sync` event in service worker
- Process queue when online

**Verification**:
- Go offline
- Create task → saved to IndexedDB
- Go online → sync event fires
- Task synced to server, queue cleared

**Note**: Chromium-only feature, requires fallback

---

### Lesson 10: Push Notifications (Optional/Advanced)
**Goal**: Send notifications to re-engage users

**Architecture**:
1. Request notification permission
2. Subscribe to push service
3. Send subscription to server
4. Server sends push via push service
5. Service worker displays notification

**Implementation**:
- Request permission with `Notification.requestPermission()`
- Subscribe with `pushManager.subscribe()`
- Handle `push` event in service worker
- Handle `notificationclick` event
- Backend: VAPID keys + web-push library

**Verification**:
- Permission granted → subscription created
- Server sends test push → notification appears
- Click notification → app opens

**Note**: Requires backend server and HTTPS

---

## Testing & Verification

### Chrome DevTools Checklist:
- ✓ **Manifest**: Verify properties in Application panel
- ✓ **Service Workers**: Check registration, test update
- ✓ **Cache Storage**: Inspect cached resources
- ✓ **Network**: Verify resources from service worker, test offline
- ✓ **Lighthouse**: Run PWA audit → target 100/100

### Key Metrics:
- Installable: Yes
- Works offline: Yes
- Fast and reliable: Yes
- PWA optimized: Yes

---

## Critical Files to Create

1. **service-worker.js** - Core service worker with caching, offline support, sync
2. **manifest.json** - Web app manifest for installability
3. **index.html** - Main app with manifest link and SW registration
4. **app.js** - Application logic, SW registration, update handling
5. **offline.html** - Offline fallback page
6. **styles.css** - Responsive, mobile-first styles
7. **/icons/** - App icons (192x192, 512x512 minimum)

---

## Final Project Structure

```
/pwa-learn
├── index.html              # Main app entry
├── offline.html            # Offline fallback
├── manifest.json           # Web app manifest
├── service-worker.js       # Service worker
├── app.js                  # App logic
├── styles.css              # Styles
├── /icons                  # App icons (various sizes)
├── /js
│   ├── db.js               # IndexedDB utilities
│   └── sync.js             # Background sync logic
└── README.md               # Documentation
```

---

## Common Pitfalls to Avoid

1. **Service Worker Won't Update**
   - Solution: Increment cache version, use "Update on reload" in DevTools

2. **HTTPS Requirements**
   - Service workers require HTTPS (except localhost)
   - Use localhost for local dev, deploy to HTTPS hosting

3. **iOS Safari Limitations**
   - Some PWA features unsupported on iOS
   - Always provide fallbacks, use feature detection

4. **Cache Versioning**
   - Use semantic versioning for cache names
   - Clean up old caches in activate event

5. **Quota Exceeded**
   - Implement cache size limits
   - Delete old caches regularly

---

## Success Criteria

You'll know you've mastered PWAs when:

- ✓ App scores 100/100 on Lighthouse PWA audit
- ✓ Works completely offline
- ✓ Installable on desktop and mobile
- ✓ Service worker updates gracefully
- ✓ Fast performance (instant repeat visits)
- ✓ You understand when to use each caching strategy
- ✓ You can debug PWAs confidently using DevTools

---

## Recommended Learning Resources

**Official Documentation**:
- [MDN Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev Learn PWA](https://web.dev/learn/pwa)
- [MDN Best Practices for PWAs](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Best_practices)

**Caching Guides**:
- [MDN Caching Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- [web.dev Caching Strategies](https://web.dev/learn/pwa/caching)

**Tools**:
- Lighthouse (Chrome DevTools)
- Workbox (Google's PWA toolkit)
- PWA Builder (Microsoft's tool)

---

## Time Estimate

- **Lessons 1-2** (Foundation + Manifest): 2-4 hours
- **Lessons 3-6** (Service Workers + Caching): 6-10 hours
- **Lessons 7-8** (Updates + Install UX): 3-5 hours
- **Lessons 9-10** (Advanced features): 5-8 hours

**Total**: 20-30 hours for complete mastery of fundamentals

---

## Next Steps After Basics

1. **Advanced Patterns**: App Shell architecture, streaming, Web Share API
2. **Performance**: Code splitting, image optimization, prefetching
3. **Frameworks**: Workbox, Next.js PWA, Vue PWA, Angular PWA
4. **Deployment**: HTTPS hosting, app store submission (TWA for Android)
5. **Monitoring**: Analytics, error tracking, cache hit rates

---

## Implementation Notes

- Start with Lesson 1 (basic web app) and progress incrementally
- Verify each lesson before moving to next
- Use Chrome DevTools extensively for debugging
- Test on multiple devices and browsers
- Commit after each lesson for version control
- Don't skip lessons - each builds on previous concepts
- Focus on understanding "why", not just "how"

**Philosophy**: PWAs are progressive by nature. Start simple, enhance gradually, always provide fallbacks. Your app should work for everyone but provide enhanced experiences for capable browsers.
