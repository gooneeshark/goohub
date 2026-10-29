# Goohub tools guide

This guide is the quick catalog for the tools in the repository. For runtime flows and development workflows, see [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 1. SharkTool bookmarklets

**Source:** [`bookmarklettool/`](./bookmarklettool/)

- `loader.js` opens a floating tool picker on the current page.
- `manifest.json` lists local tools and descriptions; selected JavaScript files are loaded in sequence.
- `panel-theme.css` styles the panel and its interaction states.
- The tool files include Monitor, Theme, Snipers, BurpShark, SharkScan, Encryption, PostShark and Dev Panel.
- Deployment requires the loader, manifest, stylesheet and referenced scripts to be published together. See [`bookmarklettool/Freetool.md`](./bookmarklettool/Freetool.md) and [`bookmarklettool/DEV_GUIDE.md`](./bookmarklettool/DEV_GUIDE.md).
- The proposed competition-demo UX and new-tool catalog are documented in [`bookmarklettool/UX_DEMO_PLAN.md`](./bookmarklettool/UX_DEMO_PLAN.md); proposed tools are not implemented yet.

## 2. Browser extensions

These are separate packages; install only the folder for the product you intend to use.

### X/Twitter Multi-Theme

**Source:** [`gooextension/extension/`](./gooextension/extension/)
Chromium Manifest V3 extension. The popup selects a theme, and its service worker applies local CSS only to `x.com` and `twitter.com`.

### Shark Tools Floating Menu

**Source:** [`gooextension/final/`](./gooextension/final/)
Floating menu with custom scripts and settings. The current build script produces Chromium and Firefox packages. Review permissions and only run custom scripts on pages you are authorized to modify.

### Gooscript snapshot

**Source:** [`Gooscript/Gooscript/`](./Gooscript/Gooscript/)
Older packaged snapshot of the Shark Tools extension. It differs from `gooextension/final/`; the maintained build flow does not update it automatically.

### Eruda DevTools

**Source:** [`GooneeXeruda/GooneeXeruda/`](./GooneeXeruda/GooneeXeruda/)
Injects the locally bundled Eruda mobile debugging interface. The extension requests the browser's `debugger` permission.

### X/Twitter theme prototype

**Source:** [`playground/twittercss/`](./playground/twittercss/)
Standalone prototype with its own popup and service worker. It is not the maintained extension package.

## 3. Playground

**Source:** [`playground/`](./playground/)

The static Playground contains UI demos, theme controls, script examples, metadata utilities, a script collection and an experimental marketplace. The standalone page is `playground/index.html`; the root `index.html` uses shared scripts and styles from this folder.

Some older browser-test prototypes are in `playground/tests/`. They require a browser page and are not currently automated in CI. The repository-level Node smoke checks are documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).

## 4. Goonee Labs

**Source:** [`LAB/`](./LAB/)

`LAB/index.html` is the current landing page. `LAB/modules/` contains standalone learning pages for ciphers, SQL injection, XSS, CSRF, network forensics, firewall configuration, wireless security, traffic analysis, simulated MITM/DDoS, and port-scanning concepts. The Gambling API exercise under `LAB/docs/` simulates an API for local training.

Use the labs only as isolated educational exercises. See the [LAB deployment guide](./LAB/README_DEPLOY.md) and [Gambling API lab guide](./LAB/README_GamblingLAB.md).

## 5. GooneeBrowser for Android

**Source:** [`GooneeBrowser/`](./GooneeBrowser/)

Kotlin Android browser with WebView-based browsing, saved tools, split-screen and AI-assisted tool creation. Build and test using Android Studio or the Gradle wrapper; details are in [`GooneeBrowser/README.md`](./GooneeBrowser/README.md).

## 6. Working safely

- Check each extension's `manifest.json` and requested permissions before installation.
- Script tools execute in or interact with the current page. Use them only on sites and systems you own or have explicit permission to test.
- Avoid committing API keys, browser profiles, or generated secrets. The Android app's AI key is configured locally.
