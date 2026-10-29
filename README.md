# Goohub

Goohub is a collection of static web experiences, JavaScript utilities, browser extensions, cybersecurity learning labs, and an Android browser. The repository is a monorepo: each area has its own entry point and workflow rather than one shared application build.

## Quick start

From the repository root, start a local static server:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`. To run the repository smoke tests (Node.js 20+; no npm install required):

```sh
node --test tests/project-quality.test.js
```

Browser extensions must be loaded from their unpacked source folders through the browser's extension management page. Android development uses Android Studio and the Gradle wrapper in `GooneeBrowser/`.

## Project map

| Area | Purpose | Start here |
|---|---|---|
| Website and Playground | Main static landing page, demos, script marketplace and browser utilities | [`index.html`](./index.html), [`playground/index.html`](./playground/index.html) |
| Bookmarklet tools | SharkTool loader and individual scripts loaded into the current page | [`bookmarklettool/manifest.json`](./bookmarklettool/manifest.json) |
| Browser extensions | X/Twitter themes, Shark Tools, Gooscript snapshot and Eruda DevTools | [`gooextension/`](./gooextension/), [`Gooscript/`](./Gooscript/), [`GooneeXeruda/`](./GooneeXeruda/) |
| Cybersecurity LAB | Interactive lessons and simulated exercises | [`LAB/index.html`](./LAB/index.html) |
| Android browser | Kotlin browser app with WebView and AI tooling | [`GooneeBrowser/README.md`](./GooneeBrowser/README.md) |

For component relationships, local workflows, extension build details, and known limitations, see [`ARCHITECTURE.md`](./ARCHITECTURE.md). For the tool catalog, see [`TOOLS_GUIDE.md`](./TOOLS_GUIDE.md).

## Important

- Tools that run scripts in a browser page can affect that page. Use them only on pages and systems you own or are authorized to test.
- Some demos depend on remote services, browser APIs, or a local web server; opening HTML directly with `file://` may not work.
- Extension folders are separate products. Do not treat files in `build/`, `.crx`, `.xpi`, or `.apk` as editable source unless the relevant guide identifies them as such.
