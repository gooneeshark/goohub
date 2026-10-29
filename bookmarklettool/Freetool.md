# SharkTool Loader — quick user guide

The SharkTool Loader opens a small panel on the current page. You can choose a page theme, search the tool list, select scripts, and load them into the page.

## Use the hosted bookmarklet

Create a browser bookmark and set its URL to this code (replace the URL if you deploy the loader elsewhere):

```javascript
javascript:(function(){var s=document.createElement('script');s.src='https://sharkkadaw.netlify.app/sharktool/loader.js';(document.head||document.documentElement).appendChild(s)})()
```

Open a page where you have permission to run scripts, then activate the bookmark. The loader fetches `manifest.json` and the selected script files from the same directory as `loader.js`. If the manifest cannot be loaded, it uses its built-in tool list.

## Use a local copy

From the repository root, start a static server:

```sh
python -m http.server 8000
```

Create a temporary bookmark using this URL:

```javascript
javascript:(function(){var s=document.createElement('script');s.src='http://localhost:8000/bookmarklettool/loader.js';(document.head||document.documentElement).appendChild(s)})()
```

The local loader reads the local `bookmarklettool/manifest.json` and styles from `bookmarklettool/`. Do not use the `localhost` bookmark on a public site unless your local server is running.

## Operate the panel

- Search by tool name, ID, or description.
- Select one or more tools, then choose **Load**. The status area reports each script's load result.
- Select a page theme to preview it. The choice is saved in that site's local storage.
- Use the minimize control to collapse the panel or **ปิด** to remove it from the page.

The tool list is maintained in [`manifest.json`](./manifest.json). For the precise development and deployment workflow, see [`DEV_GUIDE.md`](./DEV_GUIDE.md).

## Try the Page Clarity demo

From the repository root, start the static server and open `http://localhost:8000/bookmarklettool/demo.html`. The page loads the local tool panel and includes predictable examples of a skipped heading level, a link without a name, and an image without alt text. In the panel, search for **Page Clarity**, select it, and choose **Load**. The report stays in the browser; selecting a result scrolls to and highlights that element. Choose **ล้างไฮไลต์** to clear markers, or close Page Clarity to remove its panel and styles.

The checker is a short review aid, not a complete accessibility audit. Its findings require human review; for example, an image without `alt` may be decorative and should use an empty alt value rather than a description.

## Troubleshooting and safety

- A site's Content Security Policy (CSP), browser settings, or network policy can block the loader, stylesheet, manifest, or scripts.
- If no tools appear, check that the deployed `manifest.json` is valid JSON and that each relative script URL exists with matching letter case.
- If the panel opens but a tool fails, check the status area and browser console.
- Bookmarklet scripts run in the context of the current page. Review the code first and use it only on pages you own or are authorized to test.
- Avoid placing API keys, passwords, or other secrets in scripts or shared bookmarks.
