# Task Manager PWA - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Installation Instructions](#installation-instructions)
   - [iOS (iPhone/iPad)](#ios-iphoneipad)
   - [Android](#android)
   - [Desktop (Chrome/Edge)](#desktop-chromeedge)
   - [Desktop (macOS Safari)](#desktop-macos-safari)
3. [Using the App](#using-the-app)
4. [Offline Mode](#offline-mode)
5. [Troubleshooting](#troubleshooting)

---

## Getting Started

### Accessing the App

**For Development/Learning:**
1. Navigate to your project directory:
   ```bash
   cd /Users/calvinwoo/Documents/pwa-learn
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Or using Python 2
   python -m SimpleHTTPServer 8000

   # Or using Node.js
   npx http-server -p 8000

   # Or using PHP
   php -S localhost:8000
   ```

3. Open your browser and visit:
   ```
   http://localhost:8000
   ```

**For Production:**
- Deploy to any static hosting service (GitHub Pages, Netlify, Vercel, etc.)
- Access via your custom domain (e.g., `https://tasks.example.com`)

**Important**: Service workers require either:
- `localhost` (for development)
- HTTPS connection (for production)

---

## Installation Instructions

### iOS (iPhone/iPad)

PWAs on iOS have some limitations but still provide a good experience. Here's how to install:

#### Step 1: Open in Safari

**⚠️ Important**: You MUST use Safari. Chrome/Firefox on iOS cannot install PWAs.

1. Open **Safari** browser on your iPhone/iPad
2. Navigate to your app URL (e.g., `http://localhost:8000` or your production URL)
3. Wait for the page to fully load

#### Step 2: Add to Home Screen

1. Tap the **Share** button (square with arrow pointing up)
   - Located at the bottom of the screen (iPhone)
   - Located at the top of the screen (iPad)

   ![Safari Share Button](https://developer.apple.com/design/human-interface-guidelines/images/share-button.png)

2. Scroll down and tap **"Add to Home Screen"**
   - You may need to scroll down in the share sheet to find this option

   ![Add to Home Screen option](https://support.apple.com/library/content/dam/edam/applecare/images/en_US/ios/ios15-iphone12-pro-safari-add-to-home-screen.png)

3. **Customize the name** (optional)
   - Default: "Task Manager PWA"
   - You can shorten to "Tasks" or keep as-is

4. Tap **"Add"** in the top-right corner

#### Step 3: Launch the App

1. Return to your home screen
2. Find the **Task Manager** icon (with the blue checkmark icon)
3. Tap to open

**What you'll see:**
- ✅ App opens in full-screen (no Safari UI)
- ✅ Custom splash screen with app icon
- ✅ App appears in multitasking view
- ✅ Works offline after first load

#### iOS Limitations to Know

**What works:**
- ✅ Install to home screen
- ✅ Standalone mode (no browser UI)
- ✅ Service workers (offline caching)
- ✅ App icon and splash screen
- ✅ Works offline

**What doesn't work (as of iOS 17):**
- ❌ Automatic install prompt (user must manually add)
- ❌ Background sync (Lesson 9 won't work)
- ⚠️ Push notifications (requires iOS 16.4+, limited functionality)
- ⚠️ App updates require manual reinstall

**Storage Limits:**
- iOS may clear app cache if device storage is low
- Data stored in LocalStorage is more persistent than cache

---

### Android

Android has the best PWA support with full features.

#### Step 1: Open in Chrome

1. Open **Chrome** browser on your Android device
2. Navigate to your app URL
3. Wait for the page to fully load

#### Step 2: Install (Automatic Prompt)

**Option A: Install Banner (Automatic)**

After visiting the site, Chrome may show an install prompt:

1. Tap **"Add Task Manager to Home screen"** banner
2. Confirm by tapping **"Install"**
3. The app installs immediately

**Option B: Manual Install**

If no prompt appears:

1. Tap the **⋮** (three dots) menu in Chrome
2. Tap **"Add to Home screen"** or **"Install app"**
3. Edit the name if desired
4. Tap **"Add"**

#### Step 3: Launch the App

1. Return to your home screen or app drawer
2. Find the **Task Manager** icon
3. Tap to open

**What you'll see:**
- ✅ App opens in standalone window
- ✅ Custom splash screen
- ✅ Appears in Recent Apps
- ✅ Can be found in Settings → Apps
- ✅ Full PWA features (offline, sync, notifications)

#### Android Features

**All features work:**
- ✅ Automatic install prompt
- ✅ App shortcuts
- ✅ Push notifications (Lesson 10)
- ✅ Background sync (Lesson 9)
- ✅ Badging API
- ✅ Full offline support
- ✅ Automatic updates

**Installation Criteria:**
Chrome will only show install prompt if:
- Site is served over HTTPS (or localhost)
- Has a valid web app manifest
- Has a registered service worker
- User has engaged with the site (at least 30 seconds)

---

### Desktop (Chrome/Edge)

Chrome and Edge on desktop have excellent PWA support.

#### Installation Methods

**Method 1: Address Bar Icon**

1. Visit the app in Chrome/Edge
2. Look for the **install icon** (⊕ or computer icon) in the address bar
3. Click the icon
4. Click **"Install"** in the popup

**Method 2: Menu**

1. Click the **⋮** (three dots) menu
2. Hover over **"Save and share"** or **"Apps"**
3. Click **"Install Task Manager..."**
4. Click **"Install"** in the confirmation dialog

#### Where the App Appears

**Windows:**
- Desktop shortcut (if selected)
- Start Menu → All Apps
- Taskbar (can be pinned)

**macOS:**
- Applications folder
- Launchpad
- Dock (can be pinned)

**Linux:**
- Application menu
- Desktop (can be added)

#### Desktop Features

**What works:**
- ✅ Install/uninstall like native apps
- ✅ Own window (not a browser tab)
- ✅ Keyboard shortcuts
- ✅ File system access (with permission)
- ✅ OS integrations (share, notifications)
- ✅ Automatic updates

---

### Desktop (macOS Safari)

Safari on macOS has limited PWA support but still works.

#### Add to Dock

1. Visit the app in Safari
2. Click **File** → **Add to Dock**
3. Customize name if desired
4. Click **Add**

**What you get:**
- ✅ App appears in Dock
- ✅ Separate window
- ⚠️ Still shows Safari UI (not true standalone)
- ✅ Offline functionality works

**Limitations:**
- Not a true PWA install
- More like a "pinned website"
- Push notifications limited

---

## Using the App

### Adding Tasks

1. Type your task in the input field at the top
2. Press **Enter** or click **"Add Task"** button
3. Task appears at the top of the list

**Tips:**
- Tasks save automatically (using LocalStorage)
- No account required - data stays on your device
- Works offline after first visit

### Managing Tasks

**Mark as Complete:**
- Click the checkbox next to any task
- Completed tasks show with strikethrough
- Stats update automatically

**Delete Tasks:**
- Click the **"Delete"** button on any task
- Task is removed immediately
- No undo (be careful!)

### Filtering Tasks

Use the filter buttons to view:
- **All**: Shows every task (default)
- **Active**: Only incomplete tasks
- **Completed**: Only finished tasks

### Task Statistics

The stats panel shows:
- **Total**: All tasks (active + completed)
- **Active**: Tasks not yet done
- **Done**: Completed tasks

Updates in real-time as you add/complete/delete tasks.

---

## Offline Mode

One of the best features of this PWA is offline capability!

### How Offline Works

**After your first visit:**
1. All app files (HTML, CSS, JS, icons) are cached
2. Your tasks are stored in LocalStorage
3. App continues working with no internet

**What works offline:**
- ✅ View all tasks
- ✅ Add new tasks
- ✅ Mark tasks complete
- ✅ Delete tasks
- ✅ Filter tasks
- ✅ All UI features

**What doesn't work offline (yet):**
- ❌ Syncing to cloud/server (we don't have a backend)
- ❌ Sharing tasks with others
- ❌ Multi-device sync

### Testing Offline Mode

**On Desktop:**
1. Open the app
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to **Network** tab
4. Check **"Offline"** checkbox
5. Reload the page
6. App still works! 🎉

**On Mobile:**
1. Open the app
2. Enable **Airplane Mode**
3. Return to the app
4. App still works!

**To verify:**
- Check console for "[SW] ✅ Serving from cache" messages
- Network tab shows resources from "(ServiceWorker)"

### When Updates Happen

**App updates automatically when:**
- You deploy a new version
- Service worker cache version changes
- Browser detects new service-worker.js

**User sees updates:**
- After closing all tabs/app instances
- Or immediately if `skipWaiting()` is used (current setup)

---

## Troubleshooting

### App Won't Install

**iOS:**
- ✅ Check: Using Safari (not Chrome/Firefox)
- ✅ Check: Page fully loaded
- ✅ Check: Not in Private Browsing mode
- ✅ Try: Force-quit Safari and retry

**Android:**
- ✅ Check: Using HTTPS or localhost
- ✅ Check: Valid manifest.json
- ✅ Check: Service worker registered
- ✅ Check: Spent 30+ seconds on site
- ✅ Try: Clear browser cache and revisit

**Desktop:**
- ✅ Check: Using Chrome/Edge (not Firefox)
- ✅ Check: Install icon appears in address bar
- ✅ Try: Open DevTools → Application → Manifest (check for errors)

### App Doesn't Work Offline

**Check service worker:**
1. Open DevTools → **Application** tab
2. Look at **Service Workers** section
3. Should show "activated and is running"

**If not registered:**
```bash
# Serve with HTTPS or use localhost
python -m http.server 8000
# Visit http://localhost:8000 (not http://127.0.0.1:8000)
```

**Check cache:**
1. DevTools → **Application** → **Cache Storage**
2. Should see `task-manager-v1`
3. Should contain: index.html, styles.css, app.js, etc.

**Clear and reinstall:**
1. DevTools → Application → **Clear storage**
2. Check "Unregister service workers"
3. Check "Cache Storage"
4. Click **"Clear site data"**
5. Reload page (Cmd+R or Ctrl+R)
6. Service worker reinstalls

### Tasks Disappear

**Possible causes:**

**1. LocalStorage cleared:**
- Browser cleared data (low storage)
- User cleared browsing data
- Private/Incognito mode (data not persisted)

**Prevention:**
- Don't use Private Browsing for important tasks
- Export tasks periodically (feature coming in future lessons)

**2. Different browser/device:**
- Tasks stored locally per-device
- Not synced across devices (yet)

**3. iOS storage eviction:**
- iOS may clear cache when storage is low
- LocalStorage is more persistent than cache

### App Doesn't Update

**Force update:**

**Method 1: Hard reload**
- Desktop: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Mobile: Clear browser cache

**Method 2: Unregister service worker**
1. DevTools → Application → Service Workers
2. Click **"Unregister"**
3. Reload page

**Method 3: Update cache version**
- Developer increments version in service-worker.js
- Old cache automatically deleted

### Performance Issues

**App loads slowly:**
- ✅ Check: After first visit, should be instant (cache)
- ✅ Check: Console for cache hit logs
- ✅ Try: Hard reload to clear cache

**Many tasks (100+):**
- App re-renders entire list on each change
- Consider pagination/virtual scrolling for optimization

### Install Icon Doesn't Show (Desktop)

**Requirements:**
- Valid manifest.json
- Service worker registered
- HTTPS or localhost
- User engagement (30 seconds)

**Check manifest:**
```bash
# Visit directly
http://localhost:8000/manifest.json

# Should return valid JSON
```

**Check DevTools:**
1. Application → Manifest
2. Look for errors in yellow/red
3. Check "Installability" section

---

## Advanced: Inspecting PWA Features

### Check What's Cached

**Desktop:**
1. DevTools (F12) → **Application** tab
2. Sidebar → **Cache Storage**
3. Expand `task-manager-v1`
4. See all cached files with previews

**iOS (Safari):**
1. Not directly inspectable on device
2. Use macOS Safari with device debugging
3. Develop → [Your iPhone] → localhost

### Monitor Network Requests

**Desktop:**
1. DevTools → **Network** tab
2. Reload page
3. **Size** column shows:
   - Numbers (e.g., "2.3 KB") = from network
   - "(ServiceWorker)" = from cache
   - "(disk cache)" = browser cache

### View Service Worker Status

**Desktop:**
1. DevTools → **Application** → **Service Workers**
2. See status: "activated and is running"
3. Click "Update" to force update check
4. Click "Unregister" to remove

**Special URLs:**
- `chrome://serviceworker-internals` (Chrome)
- `about:debugging#/runtime/this-firefox` (Firefox)

### Check Storage Usage

**Desktop:**
1. DevTools → **Application** → **Storage**
2. See breakdown:
   - LocalStorage (tasks data)
   - Cache Storage (app files)
   - Total usage

**Quota:**
```javascript
// Run in console
navigator.storage.estimate().then(estimate => {
    console.log(`Used: ${(estimate.usage / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Quota: ${(estimate.quota / 1024 / 1024).toFixed(2)} MB`);
});
```

---

## Tips for Best Experience

### iOS Users

1. **Add to Home Screen immediately** after first visit
2. **Don't use Private Browsing** (data won't persist)
3. **Keep app installed** (reinstalling clears data)
4. **Avoid low storage** (iOS may evict cache)

### Android Users

1. **Allow install prompt** when it appears
2. **Enable notifications** (for future lessons)
3. **Pin to home screen** for quick access
4. **Update when prompted** (future lessons)

### Desktop Users

1. **Install for faster access** (no browser chrome)
2. **Pin to Dock/Taskbar** for easy launch
3. **Use keyboard shortcuts** (future lessons)
4. **Open as window** vs tab for focused work

### All Platforms

1. **Visit once online** to cache everything
2. **Use offline freely** after caching
3. **Close/reopen occasionally** to get updates
4. **Check console** for cache status (DevTools)

---

## Uninstalling the App

### iOS

1. **Long-press** the app icon on home screen
2. Tap **"Remove App"**
3. Tap **"Delete App"**
4. Confirm deletion

**This removes:**
- App icon
- Cached files
- LocalStorage data (your tasks!)

### Android

**Method 1: From Home Screen**
1. Long-press app icon
2. Tap **"App info"** or drag to **"Uninstall"**
3. Tap **"Uninstall"**
4. Confirm

**Method 2: From Settings**
1. Settings → Apps
2. Find **Task Manager**
3. Tap **"Uninstall"**

### Desktop (Chrome/Edge)

**Windows/Mac:**
1. Right-click app icon (in Dock/Start Menu)
2. Click **"Uninstall"**

**Or:**
1. Open the installed app
2. Click **⋮** menu (top-right)
3. Click **"Uninstall Task Manager..."**

**Or:**
1. Chrome Settings → Apps → Manage apps
2. Find Task Manager
3. Click **"Uninstall"**

### Desktop (Safari)

1. Open Safari
2. File → Remove from Dock
3. Or: right-click Dock icon → Options → Remove from Dock

---

## Privacy & Data

### What Data is Stored

**LocalStorage (persistent):**
- Your tasks (text, completed status, timestamps)
- Stored locally on your device
- Never sent to a server
- Remains until you clear it

**Cache Storage (persistent):**
- App files (HTML, CSS, JS)
- App icons
- Stored locally on your device
- Auto-updates when app updates

### What's NOT Stored

- ❌ No user account data
- ❌ No personal information
- ❌ No usage analytics
- ❌ No tracking cookies
- ❌ No server-side data

### Data Persistence

**Your tasks are only on your device:**
- ✅ Private (never leaves your device)
- ❌ Not backed up
- ❌ Not synced across devices
- ❌ Lost if you clear browser data

**To backup:**
- Future lessons will add export/import
- For now: screenshot your tasks

---

## Next Steps

### Completed Features (Lessons 1-4)

- ✅ Full task management (add, complete, delete, filter)
- ✅ Offline functionality
- ✅ Installable as PWA
- ✅ Fast performance (cached)
- ✅ Works on all platforms

### Coming Soon (Lessons 5-10)

- 🔜 Multiple caching strategies (Lesson 5)
- 🔜 Offline fallback page (Lesson 6)
- 🔜 Update notifications (Lesson 7)
- 🔜 Custom install prompt (Lesson 8)
- 🔜 Background sync (Lesson 9)
- 🔜 Push notifications (Lesson 10)

---

## Resources

### For Users

- [What are Progressive Web Apps?](https://web.dev/what-are-pwas/)
- [PWA Install Guide (web.dev)](https://web.dev/install-criteria/)

### For Developers

- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [web.dev: Learn PWA](https://web.dev/learn/pwa/)
- Project README: `../README.md`

### Support

- **Issues**: Report at [GitHub Issues](https://github.com/calwoo/pwa-workshop/issues)
- **Questions**: Open a discussion
- **Feedback**: Create an issue

---

**Enjoy your offline-capable task manager!** 🎉

*Last updated: Lesson 4 - Cache API*
