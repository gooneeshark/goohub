# LAB: Gambling API simulation

This local exercise introduces JavaScript `fetch`, request/response inspection, headers, timeout handling, retries, and rate-limit responses. It simulates an API; it is not connected to a real gambling service.

## Files and runtime

The page and its service worker are in `LAB/docs/`. Both the root and docs copies of the page load the shared front-end source in `LAB/gambling-lab.js`; `LAB/docs/gambling-lab.js` is a small loader for the docs page.

- `GamblingAPI_lab.html` — exercise interface
- `../gambling-lab.js` — browser-side requests and sample scripts
- `sw-gamble.js` — service worker that simulates `/api/*`
- `README_GamblingLAB.md` and `WORKSHEET_GamblingLAB.md` — docs-folder guide and worksheet

Service workers require a secure context (`https://` or `localhost`), so serve the files rather than opening the page directly with `file://`.

## Run locally

From `LAB/`, start the local server using PowerShell:

```powershell
.\serve-lab.ps1 -Port 8000
```

Open `http://localhost:8000/docs/GamblingAPI_lab.html`. If serving from the repository root instead, use `http://localhost:8000/LAB/docs/GamblingAPI_lab.html`.

Open DevTools → Network and Console to observe requests and responses. The exercise includes a simulated console and Scripts Library for inspecting and adapting sample code.

## Exercise ideas

- Adjust `apiFetch` timeout and retry behavior in `LAB/gambling-lab.js`.
- Add loading state and duplicate-submit protection to the Spin control.
- Improve request/response logging in the simulator.
- Add a simulated endpoint in `LAB/docs/sw-gamble.js`.

For slides and the worksheet, use `LAB/LAB_SLIDES.html` and `LAB/WORKSHEET_GamblingLAB.md` when serving from `LAB/`.

## Safety and credentials

- Keep the exercise local and use it only for education.
- The front-end demo uses a placeholder key and does not load `LAB/.env` automatically. Do not put real API keys in browser JavaScript or commit secrets.
