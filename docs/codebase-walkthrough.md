# Codebase Walkthrough: Anatomy of a Progressive Web App

A guided tour of this project's source code, explaining how each piece contributes to
the architecture of a Progressive Web App. If you are new to PWAs, read this document
from top to bottom -- it follows the order in which the browser encounters each file and
concept at runtime.

---

## Table of Contents

1. [The Big Picture](#1-the-big-picture)
2. [index.html -- The Entry Point](#2-indexhtml----the-entry-point)
3. [manifest.json -- The Install Contract](#3-manifestjson----the-install-contract)
4. [styles.css -- Mobile-First Design](#4-stylescss----mobile-first-design)
5. [app.js -- Application Logic and Service Worker Registration](#5-appjs----application-logic-and-service-worker-registration)
6. [service-worker.js -- The Offline Engine](#6-service-workerjs----the-offline-engine)
7. [icons/ -- Visual Identity](#7-icons----visual-identity)
8. [How It All Fits Together](#8-how-it-all-fits-together)
9. [What Makes This a PWA (and Not Just a Website)](#9-what-makes-this-a-pwa-and-not-just-a-website)
10. [Where the Codebase Goes Next](#10-where-the-codebase-goes-next)

---

## 1. The Big Picture

This project is a task manager built with plain HTML, CSS, and JavaScript -- no
frameworks, no build tools, no npm dependencies. That simplicity is deliberate. A
Progressive Web App is not a framework; it is a set of browser capabilities layered on
top of a normal website. By keeping the code vanilla you can see exactly where the
"normal website" ends and the "progressive" enhancements begin.

The project follows a 10-lesson curriculum (documented in `plans/pwa-learning-plan.md`).
Lessons 1 through 4 are implemented so far:

| Lesson | Concept               | Key File(s)                        |
|--------|-----------------------|------------------------------------|
| 1      | Foundation            | `index.html`, `app.js`, `styles.css` |
| 2      | Installability        | `manifest.json`, `icons/`          |
| 3      | Service Worker Basics | `app.js` (registration section)    |
| 4      | Cache API             | `service-worker.js`                |

Every file in the repository exists to serve one of these lessons. There is no dead code
and no scaffolding waiting for future use.

### File map

```
pwa-workshop/
├── index.html              ← what the browser loads first
├── manifest.json           ← metadata that makes the app installable
├── styles.css              ← all visual styling (mobile-first)
├── app.js                  ← application logic + service worker registration
├── service-worker.js       ← offline caching engine (runs in its own thread)
├── icons/
│   ├── icon.svg            ← vector source icon
│   ├── icon-192x192.png    ← minimum PWA icon size
│   └── icon-512x512.png    ← recommended high-DPI icon
├── docs/                   ← educational documentation (you are here)
└── plans/
    └── pwa-learning-plan.md← the 10-lesson curriculum
```

---

## 2. index.html -- The Entry Point

**File**: `index.html` (87 lines)

When a user visits the app, the browser fetches this file first. Everything else
cascades from the references it contains.

### Head section: wiring up PWA infrastructure

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#2196F3">
<link rel="manifest" href="manifest.json">
<link rel="icon" type="image/svg+xml" href="icons/icon.svg">
<link rel="apple-touch-icon" href="icons/icon.svg">
<link rel="stylesheet" href="styles.css">
```

Three of these lines are "just a website" (`viewport`, `icon`, `stylesheet`). The other
three are what start turning it into a PWA:

- **`theme-color`** tells the browser what color to paint the address bar and status bar
  when the app is open. On Android this means the toolbar blends visually with the app
  header.
- **`manifest`** links to the Web App Manifest (covered next). Without this link, the
  browser cannot offer the "Add to Home Screen" / "Install App" prompt.
- **`apple-touch-icon`** is a fallback for iOS Safari, which reads this instead of the
  manifest's icon array.

### Body section: semantic structure

The body contains four logical regions:

1. **Header** (`<header>`) -- app title and subtitle.
2. **Add Task form** (`<form id="task-form">`) -- a text input and submit button.
3. **Statistics panel** (`<section class="stats">`) -- three counters (Total, Active,
   Done) updated by JavaScript.
4. **Task list** (`<section class="task-list-section">`) -- filter tabs (All / Active /
   Completed), a `<ul>` that JavaScript populates, and an empty-state message.

The `<script src="app.js">` tag at the bottom of `<body>` loads the application logic
after the DOM is ready. This placement avoids render-blocking -- the user sees the
page structure immediately while the script loads.

### PWA relevance

In PWA architecture this file is part of the **app shell** -- the minimal HTML, CSS, and
JavaScript required to render the application's UI chrome. The app shell is what gets
cached by the service worker so the app loads instantly on repeat visits, even offline.
Content (the task list) comes from `localStorage`, not from the network.

---

## 3. manifest.json -- The Install Contract

**File**: `manifest.json` (32 lines)

The Web App Manifest is a JSON file that tells the browser how to present the app when
installed. Without it, the browser treats the page as a regular website. With it, the
browser can offer a native-like installation experience.

### Key fields and what they control

```
name / short_name    →  "Task Manager PWA" / "TaskMgr"
```
`name` appears on the splash screen. `short_name` appears beneath the home screen icon
where space is limited.

```
display: "standalone"
```
This is the most consequential line. It tells the browser to open the installed app
**without any browser chrome** -- no address bar, no tabs, no navigation buttons. The
app looks and feels like a native application. Other options include `fullscreen`,
`minimal-ui`, and `browser`.

```
start_url: "/"
scope: "/"
```
`start_url` is what opens when the user taps the home screen icon. `scope` limits which
URLs the service worker can control. Navigating outside the scope opens the system
browser instead.

```
theme_color / background_color
```
`theme_color` sets the OS-level color (toolbar, task switcher). `background_color` is
shown on the splash screen while the app loads, before CSS takes over.

```
icons: [ ... ]
```
Three icons are provided:
- An SVG at `any` size for browsers that support vector icons.
- A 192x192 PNG -- the minimum size required by the PWA installability check.
- A 512x512 PNG -- used for splash screens on high-DPI devices.

Both PNGs use `"purpose": "any maskable"`, which tells Android that the icon has a safe
zone around the center and can be clipped into a circle, squircle, or other adaptive
shape without cutting off meaningful content.

### PWA relevance

The manifest is one of three requirements for a browser to consider a site installable
(the others are HTTPS and a registered service worker). Together these three
requirements form the **installability contract** that distinguishes a PWA from a
bookmark.

---

## 4. styles.css -- Mobile-First Design

**File**: `styles.css` (361 lines)

The stylesheet uses a mobile-first approach: the default styles target small screens,
and a single `@media (max-width: 640px)` breakpoint adjusts layout for narrow
viewports.

### Design system via CSS custom properties

Lines 10-38 define a centralized set of variables:

```css
:root {
    --primary-color: #2196F3;
    --spacing-sm: 1rem;
    --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
    --radius-md: 8px;
    /* ... */
}
```

Every color, spacing value, shadow, and border radius used throughout the file
references these variables. This is a lightweight design token system -- changing
`--primary-color` in one place repaints every button, heading, and stat counter.

### Layout highlights

- **Flexbox** for the input group, task items, and filter tabs.
- **CSS Grid** for the three-column stats panel (`grid-template-columns: repeat(3, 1fr)`).
- **Animations** for new task items (`@keyframes slideIn` -- a subtle fade-and-slide
  that gives tactile feedback when a task is added).
- **Transition effects** on buttons (`transform: translateY(-2px)` on hover) and task
  rows (`transform: translateX(4px)` on hover) to convey interactivity.

### The responsive breakpoint

At 640px and below:

- The input group stacks vertically (the button moves below the text field).
- Task items wrap, with the date dropping to a second line.
- Stat values shrink from 2rem to 1.5rem.

This ensures touch targets remain large enough for fingers (buttons become full-width)
and text remains readable on small screens.

### PWA relevance

Mobile-first responsive design is a core PWA principle. PWAs must provide a good
experience on any device since they can be installed on phones, tablets, and desktops.
The `standalone` display mode means there is no browser chrome to provide a back button
or URL bar, so the app's own UI must be self-sufficient -- this stylesheet ensures that.

---

## 5. app.js -- Application Logic and Service Worker Registration

**File**: `app.js` (289 lines)

This is the largest file and handles two distinct responsibilities: running the task
manager and bootstrapping the PWA infrastructure. The code is organized into clearly
labeled sections.

### 5.1 Service Worker Registration (lines 10-46)

```js
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => { /* ... */ })
            .catch((error) => { /* ... */ });
    });
}
```

Three things to notice:

1. **Feature detection** (`'serviceWorker' in navigator`). Older browsers that do not
   support service workers simply skip this block. The task manager still works -- it
   just will not work offline. This is **progressive enhancement** in action.

2. **Registration happens on `load`**. Registering a service worker triggers downloads
   (the service worker script and every asset it precaches). Waiting for `load` ensures
   this does not compete with the page's own resources for bandwidth.

3. **Periodic update checks**. After registration, a `setInterval` calls
   `registration.update()` every hour. The browser also checks for updates on its own
   schedule, but this provides a tighter feedback loop during development.

The `updatefound` listener watches for new versions of the service worker. When one is
detected, it logs state changes (`installing` → `activated`) so you can follow the
lifecycle in the console.

### 5.2 State Management (lines 48-68)

```js
const STORAGE_KEY = 'pwa-tasks';
let tasks = [];
let currentFilter = 'all';
```

The entire application state lives in two variables: an array of task objects and the
current filter setting. This is a deliberately simple architecture -- there is no state
management library, no event bus, no store. State changes flow through a consistent
pattern:

```
user action → mutate `tasks` → saveTasks() → renderTasks() → updateStats()
```

Every CRUD function follows this exact sequence (see `addTask`, `deleteTask`,
`toggleTask`). This predictability makes the code easy to reason about.

### 5.3 The Task Model (lines 72-79)

```js
class Task {
    constructor(text) {
        this.id = Date.now().toString();
        this.text = text;
        this.completed = false;
        this.createdAt = new Date().toISOString();
    }
}
```

Each task gets a unique ID from `Date.now()`, a completion flag, and a creation
timestamp. The ID strategy is simple but sufficient for a single-user local app --
collisions would require two tasks created in the same millisecond.

### 5.4 Persistence with localStorage (lines 84-102)

```js
function loadTasks() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
```

`localStorage` is synchronous, stores strings only, and is limited to roughly 5-10 MB
depending on the browser. It is wrapped in try-catch because `localStorage` can throw
in private browsing modes or when the quota is exceeded.

### PWA relevance: client-side storage

In a traditional web app, data lives on a server. In a PWA, you need data to be
available offline, which means client-side storage. `localStorage` is the simplest
option. Later lessons could migrate to IndexedDB for structured queries and larger
storage limits -- but `localStorage` demonstrates the principle with zero boilerplate.

### 5.5 Rendering (lines 150-216)

The rendering approach is full-replacement: on every change, `taskList.innerHTML` is
cleared and rebuilt from scratch. Each task is assembled as a DOM tree:

```
<li class="task-item">
  ├── <input type="checkbox">    (toggles completion)
  ├── <span class="task-text">   (the task description)
  ├── <span class="task-date">   (relative time, e.g. "3h ago")
  └── <button class="delete-btn"> (removes the task)
</li>
```

Event listeners are attached during creation (`checkbox.addEventListener('change', ...)`
and `deleteBtn.addEventListener('click', ...)`). This avoids the complexity of event
delegation while remaining straightforward for a small list.

### 5.6 Initialization (lines 264-288)

```js
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
```

This guard handles the case where the script loads after the DOM is already parsed (for
example, when served from cache). The `init` function loads tasks, renders the initial
view, and attaches event listeners.

---

## 6. service-worker.js -- The Offline Engine

**File**: `service-worker.js` (209 lines)

This is where the PWA magic happens. A service worker is a JavaScript file that the
browser runs in a **separate thread** from the page. It acts as a programmable network
proxy -- it can intercept every HTTP request the page makes and decide how to respond.

### 6.1 Conceptual model

Think of the service worker as a layer that sits between your app and the network:

```
┌─────────┐      ┌──────────────────┐      ┌──────────┐
│  app.js │ ───► │  service-worker  │ ───► │  network  │
│  (page) │ ◄─── │  (proxy thread)  │ ◄─── │ (server)  │
└─────────┘      └──────────────────┘      └──────────┘
                        │    ▲
                        ▼    │
                   ┌──────────────┐
                   │  Cache API   │
                   │  (on disk)   │
                   └──────────────┘
```

When the page requests a file (an image, a CSS file, a fetch call), the request passes
through the service worker's `fetch` event handler. The handler can:

- Return a cached copy immediately (fast, works offline).
- Forward the request to the network (fresh data, requires connectivity).
- Do both (return cached, then update the cache in the background).

The strategy this codebase uses is **cache-first**: check the cache, and only go to the
network on a cache miss.

### 6.2 Configuration (lines 17-32)

```js
const CACHE_NAME = 'task-manager-v1';
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
```

`CACHE_NAME` is versioned. When you change the app's code and bump this to `v2`, the
old cache is deleted during activation. This is how cache invalidation works -- you do
not expire individual files, you replace the entire cache.

`STATIC_ASSETS` is the **app shell**: every file needed for the app to render its UI.
Note that both `/` and `/index.html` are listed. Some servers serve `index.html` at `/`
via URL rewriting, so caching both ensures a cache hit regardless of how the request
arrives.

### 6.3 The Install Event (lines 41-68)

```js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});
```

This runs once when the browser first downloads the service worker (or detects a new
version). `cache.addAll()` fetches every URL in the list and stores the responses. If
**any** fetch fails, the entire installation fails and the old service worker stays in
control. This is an intentional all-or-nothing design -- a partially cached app shell
would be broken.

`skipWaiting()` tells the browser to activate this service worker immediately instead of
waiting for all tabs to close. This is convenient during development but can cause issues
in production if the new service worker is incompatible with pages already open.

### 6.4 The Activate Event (lines 75-107)

```js
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});
```

Activation is the cleanup phase. The handler iterates over every cache the origin has
created and deletes any that do not match the current `CACHE_NAME`. This is how you
prevent disk usage from growing unboundedly across deployments.

`clients.claim()` makes the newly activated service worker take control of **all open
tabs** immediately, not just future navigations. Combined with `skipWaiting()`, this
means a new version takes full effect without the user needing to close and reopen the
tab.

### 6.5 The Fetch Event -- Cache-First Strategy (lines 113-168)

This is the heart of the offline capability:

```js
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request).then(networkResponse => {
                    const clone = networkResponse.clone();
                    if (networkResponse.ok) {
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, clone));
                    }
                    return networkResponse;
                });
            })
    );
});
```

Key design decisions:

- **GET-only**: POST, PUT, and DELETE requests are not intercepted. Caching a POST
  response would be incorrect -- these methods have side effects and the response
  depends on the request body.

- **Response cloning**: `networkResponse.clone()` is necessary because a Response body
  is a stream and can only be consumed once. One copy goes to the cache; the other goes
  to the page.

- **Dynamic caching on miss**: When a request is not precached (perhaps a new resource
  added after the service worker was installed), the network response is cached for
  future use. This makes the cache self-healing.

- **Error propagation**: If the network fetch fails (offline, server down), the error
  propagates to the page. A future lesson will add a custom offline fallback page here.

### 6.6 The Message Event (lines 174-194)

The page and the service worker run in separate threads and cannot share variables. They
communicate via `postMessage`. Two message types are handled:

- `SKIP_WAITING` -- the page asks the service worker to activate immediately (used by
  update prompts).
- `CACHE_STATUS` -- the page asks the service worker how many items are cached (used for
  debugging / UI indicators).

### PWA relevance: the service worker lifecycle

Understanding the lifecycle is critical to working with PWAs:

```
1. REGISTER  →  browser downloads the SW script
2. INSTALL   →  SW caches assets; if caching fails, installation fails
3. WAIT      →  SW waits for existing tabs to close (unless skipWaiting)
4. ACTIVATE  →  SW takes control; old caches are cleaned up
5. IDLE      →  SW sleeps to save resources
6. FETCH     →  SW wakes on every network request, decides how to respond
7. TERMINATE →  browser can kill the SW at any time to reclaim memory
```

The service worker is **event-driven** and **ephemeral**. It does not stay running in
the background. The browser starts it when an event fires and terminates it when idle.
This means you cannot store state in variables between events -- anything that must
persist needs to go into the Cache API or IndexedDB.

---

## 7. icons/ -- Visual Identity

The `icons/` directory contains the app icons at three resolutions:

| File               | Size      | Use                                        |
|--------------------|-----------|--------------------------------------------|
| `icon.svg`         | scalable  | Favicon, source artwork                    |
| `icon-192x192.png` | 192x192   | Home screen icon, minimum for installability |
| `icon-512x512.png` | 512x512   | Splash screen, high-DPI displays           |

The directory also includes helper tools (`generate-icons.html` for browsers,
`generate-pngs.js` for Node) that convert the SVG source to PNGs. These are development
utilities, not part of the production app.

### PWA relevance

Icons are required for installability. Chrome will not offer an install prompt unless the
manifest references at least a 192x192 icon. The 512x512 icon is used for the splash
screen that appears while the app loads after being launched from the home screen. The
`maskable` purpose flag in `manifest.json` tells Android the icon can be adaptively
shaped without clipping important content.

---

## 8. How It All Fits Together

Here is the full lifecycle of a user's interaction, from first visit to offline use:

### First visit (online)

```
1. Browser fetches index.html from the server
2. index.html triggers fetches for styles.css, app.js, manifest.json, icons
3. app.js runs:
   a. Registers service-worker.js
   b. Loads tasks from localStorage (empty on first visit)
   c. Renders the empty state UI
   d. Attaches event listeners
4. Service worker installs:
   a. Opens a cache named "task-manager-v1"
   b. Fetches and caches all STATIC_ASSETS
   c. Calls skipWaiting() → activates immediately
5. Service worker activates:
   a. Deletes any old caches (none on first visit)
   b. Calls clients.claim() → controls this page
6. Browser reads manifest.json:
   a. Recognizes the page as installable
   b. May offer an install banner (criteria vary by browser)
```

### Repeat visit (online)

```
1. Browser fetches index.html → service worker intercepts
2. Service worker finds index.html in cache → returns instantly (~10ms)
3. Same for styles.css, app.js, icons → all from cache
4. app.js runs, loads tasks from localStorage
5. User sees their tasks immediately, no network wait
```

### Offline visit

```
1. Browser tries to fetch index.html → no network
2. Service worker intercepts → finds it in cache → returns it
3. All other assets also served from cache
4. app.js loads tasks from localStorage
5. User can add, complete, and delete tasks normally
6. Changes are saved to localStorage
7. When the user comes back online, nothing special happens yet
   (background sync is a future lesson)
```

### Data flow diagram

```
┌────────────────────────────────────────────────────────┐
│                      Browser                           │
│                                                        │
│  ┌──────────────┐    ┌────────────────────────────┐    │
│  │  index.html  │───►│  app.js                    │    │
│  │  styles.css  │    │                            │    │
│  └──────────────┘    │  ┌──────────────────────┐  │    │
│                      │  │  Task State (array)  │  │    │
│                      │  └──────┬───────────────┘  │    │
│                      │         │                  │    │
│                      │    save │ load             │    │
│                      │         ▼                  │    │
│                      │  ┌──────────────────────┐  │    │
│                      │  │    localStorage      │  │    │
│                      │  │    (pwa-tasks)        │  │    │
│                      │  └──────────────────────┘  │    │
│                      └────────────────────────────┘    │
│                                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  service-worker.js (separate thread)            │   │
│  │                                                 │   │
│  │  fetch event ──► cache hit? ──► return cached   │   │
│  │                      │                          │   │
│  │                    miss                         │   │
│  │                      │                          │   │
│  │                      ▼                          │   │
│  │                  fetch from network             │   │
│  │                      │                          │   │
│  │                  cache the response             │   │
│  │                      │                          │   │
│  │                  return to page                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                        │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Cache API (on disk)                            │   │
│  │  "task-manager-v1":                             │   │
│  │    /  /index.html  /styles.css  /app.js         │   │
│  │    /manifest.json  /icons/icon.svg  ...         │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

## 9. What Makes This a PWA (and Not Just a Website)

A regular website and this codebase share most of the same technology. The difference is
three specific additions:

| Requirement        | File(s)                          | What it enables                        |
|--------------------|----------------------------------|----------------------------------------|
| Web App Manifest   | `manifest.json`, `index.html:11` | Installability, standalone display     |
| Service Worker     | `service-worker.js`, `app.js:10-46` | Offline access, caching, background tasks |
| HTTPS              | (deployment concern)             | Security, required by browser for SW   |

Remove any one of these and the browser no longer treats the app as a PWA. This is why
the architecture is described as **progressive** -- each layer adds capability without
breaking the layer beneath it:

```
Layer 0:  HTML + CSS + JS           →  works in any browser
Layer 1:  + manifest.json           →  installable (with SW + HTTPS)
Layer 2:  + service-worker.js       →  offline-capable, fast repeat loads
Layer 3:  + push/sync (future)      →  re-engagement, background processing
```

A user on an old browser gets Layer 0 -- a functioning task manager. A user on a modern
browser gets all layers. Nobody is excluded; capable browsers get more.

This layered approach is the central architectural principle of Progressive Web Apps.

---

## 10. Where the Codebase Goes Next

The remaining lessons in the curriculum build on this foundation:

| Lesson | Topic                | Builds on                                    |
|--------|----------------------|----------------------------------------------|
| 5      | Caching Strategies   | Adds network-first and stale-while-revalidate alongside cache-first |
| 6      | Offline Fallback     | Returns a custom page when an uncached resource is requested offline |
| 7      | Update Strategy      | Adds UI to notify users when a new version is available |
| 8      | Install Prompt       | Customizes the timing and presentation of the install experience |
| 9      | Background Sync      | Queues actions made offline and replays them when connectivity returns |
| 10     | Push Notifications   | Sends notifications from a server to re-engage users |

Each lesson adds a new file or extends an existing one. The architecture does not need
to be redesigned -- it was built to accommodate these additions from the start.

---

## Summary

Reading order for understanding the runtime flow:

1. **`index.html`** -- the shell the browser renders.
2. **`manifest.json`** -- the metadata the browser reads to offer installation.
3. **`styles.css`** -- the visual layer, mobile-first.
4. **`app.js`** -- the logic that registers the service worker and runs the task manager.
5. **`service-worker.js`** -- the proxy that intercepts requests and serves from cache.

Reading order for understanding the concepts:

1. Start with the [pedagogical guide](pedagogical-guide.md) for the "why" behind each
   lesson.
2. Read [service worker basics](service-worker-basics.md) for the lifecycle model.
3. Read [caching architecture](caching-architecture.md) for the caching strategy
   tradeoffs.
4. Use [javascript fundamentals](javascript-fundamentals.md) as a reference for any
   language features you encounter.
5. Consult the [user guide](user-guide.md) for end-user documentation of the app's
   features.
