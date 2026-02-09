# Task Manager PWA - Learning Project

A Progressive Web App (PWA) task manager built from scratch to learn PWA fundamentals.

## Project Overview

This project follows a **10-lesson incremental learning approach** to build a fully-featured PWA. Each lesson introduces new PWA concepts while building upon previous lessons.

## Current Progress

### ✅ Lesson 1: Foundation - Basic Web App
**Status**: Complete
**What was built**:
- Responsive task manager UI with mobile-first design
- LocalStorage for persistent data
- CRUD operations (Create, Read, Update, Delete tasks)
- Task filtering (All, Active, Completed)
- Real-time statistics
- Relative timestamps

**Key Files**:
- `index.html` - Main app structure
- `styles.css` - Responsive, mobile-first styling
- `app.js` - Application logic with localStorage
- `README.md` - This documentation

**How to verify**:
1. Open `index.html` in a browser
2. Add some tasks
3. Mark tasks as complete
4. Filter tasks by status
5. Reload the page → tasks persist (localStorage working!)

---

### ✅ Lesson 2: Web App Manifest - Installability
**Status**: Complete
**What was built**:
- `manifest.json` with app metadata (name, colors, icons, display mode)
- App icons: SVG source + PNG placeholders (192x192, 512x512)
- Linked manifest in `index.html` with proper meta tags
- Icon generation tools for future enhancement

**Key Files**:
- `manifest.json` - Web app manifest
- `icons/icon.svg` - Scalable vector icon (primary)
- `icons/icon-192x192.png` - Minimum size for PWA
- `icons/icon-512x512.png` - Recommended size for PWA
- `icons/generate-icons.html` - Browser-based icon generator
- `icons/generate-pngs.js` - Node.js icon generator

**How to verify**:
1. Serve with a local server: `python -m http.server 8000`
2. Open http://localhost:8000 in Chrome
3. Open DevTools → Application → Manifest
4. Check "Installable" section - should show install prompt available
5. For full test: Click install icon in address bar

**Key Manifest Properties Explained**:
- `display: "standalone"` - Opens without browser UI (like native app)
- `theme_color` - Colors the browser address bar on mobile
- `background_color` - Splash screen color while loading
- `start_url` - URL to open when app launches
- `icons` - App icons for home screen, task switcher, etc.

**Note**: PNG icons are minimal placeholders. For production, use icons/generate-icons.html or PWA Builder to create high-quality icons from the SVG.

---

### ✅ Lesson 3: Service Worker Basics - Registration & Lifecycle
**Status**: Complete
**What was built**:
- Created `service-worker.js` with lifecycle event handlers
- Registered service worker in `app.js` on page load
- Implemented INSTALL, ACTIVATE, FETCH, and MESSAGE event listeners
- Added comprehensive logging to observe lifecycle behavior
- Set up update detection and automatic update checking

**Key Files**:
- `service-worker.js` - Service worker with lifecycle events
- `app.js` (updated) - Service worker registration logic
- `docs/service-worker-basics.md` - Complete guide to service workers

**How to verify**:
1. Serve with local server: `python -m http.server 8000`
2. Open http://localhost:8000 in Chrome
3. Open DevTools → Application → Service Workers
4. Check status: should show "activated and is running"
5. Open Console and filter by "service-worker" or "[SW]"
6. Reload page and observe lifecycle events logged

**Service Worker Lifecycle Observed**:
- `install` → Fires when SW first discovered
- `activate` → Fires when SW takes control
- `fetch` → Fires for every network request (currently just logging)
- `message` → Allows communication between page and SW

**Next**: In Lesson 4, we'll add actual caching logic to these events!

---

### 🔜 Lesson 4: Cache API - Precaching (Next)
**Goal**: Cache static assets for offline access
**What to build**:
- Pre-cache app shell in install event
- Serve from cache in fetch event (cache-first strategy)
- Clean up old caches in activate event

**Verification checklist**:
- [ ] Cached files visible in DevTools → Cache Storage
- [ ] Go offline → app still works
- [ ] Resources served from service worker

---

### 📋 Upcoming Lessons
- **Lesson 4**: Cache API (precaching static assets)
- **Lesson 5**: Caching Strategies (cache-first, network-first)
- **Lesson 6**: Offline Fallback Page
- **Lesson 7**: Update Strategy (version management)
- **Lesson 8**: Add to Home Screen Prompt
- **Lesson 9**: Background Sync (queue offline actions)
- **Lesson 10**: Push Notifications (re-engagement)

## Features (Current)

### ✨ Implemented
- ✅ Add, delete, and complete tasks
- ✅ Filter tasks by status (All/Active/Completed)
- ✅ LocalStorage persistence
- ✅ Responsive design (mobile & desktop)
- ✅ Real-time task statistics
- ✅ Relative timestamps ("2h ago", "Just now")
- ✅ Smooth animations and transitions

### 🚀 Coming Soon (PWA Features)
- ⏳ Installable to home screen/desktop
- ⏳ Offline functionality
- ⏳ Service worker caching
- ⏳ Background sync
- ⏳ Push notifications
- ⏳ App updates with notifications

## Technology Stack

- **Vanilla JavaScript** - No frameworks (to understand fundamentals)
- **CSS Custom Properties** - Modern, maintainable styling
- **LocalStorage API** - Client-side persistence
- **Progressive Enhancement** - Works everywhere, enhanced where supported

## Development

### Running Locally
Simply open `index.html` in a modern browser. No build step required!

For PWA features (Lessons 2+), you'll need:
- **HTTPS** (service workers require secure context)
- Use `localhost` for local development, OR
- Use a local server with HTTPS, OR
- Deploy to HTTPS hosting (GitHub Pages, Netlify, Vercel)

### Quick local server (for Lesson 2+):
```bash
# Python 3
python -m http.server 8000

# Node.js (npx http-server)
npx http-server -p 8000

# Then visit: http://localhost:8000
```

## Browser Support

**Current features** (Lesson 1):
- ✅ All modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ IE11+ (with polyfills for modern JS)

**PWA features** (Lessons 2+):
- ✅ Chrome/Edge (full PWA support)
- ✅ Firefox (most features)
- ⚠️ Safari (limited PWA support)
  - Service workers: Yes
  - Install prompt: iOS/iPadOS only
  - Push notifications: iOS 16.4+
  - Background sync: Not supported

## Project Structure

```
/pwa-learn
├── index.html              # Main app entry
├── styles.css              # Responsive styles
├── app.js                  # Application logic
├── README.md               # This file
└── (more files coming in upcoming lessons...)
```

## Learning Resources

**Official Documentation**:
- [MDN Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev Learn PWA](https://web.dev/learn/pwa)
- [MDN LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

**Tools**:
- Chrome DevTools (Application panel for PWA inspection)
- Lighthouse (PWA auditing)

## Key Concepts Learned (Lesson 1)

### 1. **Mobile-First Design**
The app uses responsive CSS with mobile-first approach:
- Flexbox and CSS Grid for layouts
- Media queries for larger screens
- Touch-friendly hit targets (minimum 44px)

### 2. **LocalStorage for Persistence**
```javascript
// Save data
localStorage.setItem('key', JSON.stringify(data));

// Load data
const data = JSON.parse(localStorage.getItem('key'));
```

**Pros**: Simple, synchronous, ~5-10MB storage
**Cons**: Blocks main thread, string-only, per-origin limit

### 3. **State Management Pattern**
- Single source of truth (`tasks` array)
- CRUD functions modify state
- State changes trigger re-renders
- Separation of concerns (data → view)

### 4. **Progressive Enhancement**
Start with working baseline, add enhancements:
1. ✅ Core functionality (works everywhere)
2. ⏳ Offline support (PWA feature)
3. ⏳ Push notifications (optional enhancement)

## Next Steps

To continue to **Lesson 2**, we'll:
1. Create `manifest.json` with app metadata
2. Generate app icons (or use placeholder icons)
3. Link manifest to `index.html`
4. Test installation in Chrome DevTools

**Expected outcome**: A fully installable PWA that works in standalone mode!

---

**Built as part of**: PWA Learning Project
**Lesson**: 1 of 10
**Last Updated**: 2026-02-09
