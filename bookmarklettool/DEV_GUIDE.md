# SharkTool Loader — development guide

## Source layout

- `loader.js` builds the floating UI, fetches the tool manifest, applies page themes, and loads selected scripts.
- `manifest.json` is the tool catalog. Each record has an `id`, `name`, relative `url`, and optional `description`.
- The individual JavaScript tools live next to the loader.
- `panel-theme.css` styles the floating panel. The loader resolves it beside its own script.

The loader uses the URL of its current script as the base path. Keep the loader, manifest, stylesheet and every referenced script in the same deployed directory. In the current hosted bookmarklet example that directory is `/sharktool/`; in this repository the source directory is `bookmarklettool/`.

## Add or change a tool

1. Add or update the JavaScript file in `bookmarklettool/`.
2. Add a unique manifest entry, for example:

   ```json
   {
     "id": "example",
     "name": "Example",
     "url": "example.js",
     "description": "Short explanation of the tool"
   }
   ```

3. Keep the matching entry in `loader.js`'s `FALLBACK_TOOLS` list so the tool remains available if the hosted manifest is unavailable.
4. Run the repository checks from the root:

   ```sh
   node --test tests/project-quality.test.js
   ```

The loader renders manifest-provided names and descriptions as text. Keep IDs stable because users' selected tool IDs are stored in the destination page's local storage.

## Test locally

From the repository root, run:

```sh
python -m http.server 8000
```

Use the local bookmarklet shown in [`Freetool.md`](./Freetool.md), or open the HTML page that includes the loader. Verify that:

- The panel renders, collapses, closes, and can be moved with mouse or touch.
- Search and selection work, and the status area reports success or failure.
- Relative URLs load the expected scripts and stylesheet.
- The loader still shows its fallback list when the local manifest is unavailable.
- A reduced-motion preference disables panel transitions.

## Deploy

Publish the contents of `bookmarklettool/` together, preserving filenames and letter case. If the deployment maps this folder to another URL (for example `/sharktool/`), point the bookmarklet to that deployed `loader.js`; the loader discovers the rest of the files relative to it.

The target page may block third-party script or stylesheet requests through CSP. This is a property of the target site; do not advise users to bypass its policy.

## Maintenance notes

- Update this guide and the user guide when tool IDs, the manifest format, or deployment paths change.
- Do not add a tool to the catalog unless its source file is included in the deployed directory.
- Bookmarklet tools execute in the target page. Restrict demonstrations and tests to systems where use is authorized.
