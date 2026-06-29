# WHOOP Dashboard

A single-file, zero-build dashboard for your own WHOOP data. Paste an OAuth access
token and it pulls your recovery, strain, sleep, body measurements, and recent
workouts straight from the WHOOP v2 API and renders them in the browser.

No backend, no database, no analytics. Your token lives in the browser tab and is
only ever sent to WHOOP's API (or your local proxy).

## Files

| File | What it is |
|------|------------|
| `whoop-dashboard.html` | The dashboard. Open it in a browser — that's the whole app. |
| `proxy.js` | Optional local CORS proxy (Node 18+, no dependencies). Use only if the browser blocks direct API calls. |
| `README.md` | This file. |

## Quick start

1. Get a WHOOP access token (see below).
2. Open `whoop-dashboard.html` in your browser.
3. Paste the token and click **Load my data**.

If the data loads, you're done — you don't need the proxy.

## Getting a token

The dashboard needs a WHOOP OAuth **access token**. WHOOP issues these through the
standard authorization-code flow:

1. Register an app at [developer.whoop.com](https://developer.whoop.com) and set a
   redirect URI.
2. Request these scopes so every card has data to show:
   `read:recovery read:cycles read:sleep read:workout read:profile read:body_measurement`
3. Run the authorization-code flow to exchange the returned code for an access token.

Access tokens are short-lived. When the dashboard stops loading, generate a fresh
one and paste it again. A missing scope doesn't error — the matching card just
stays blank.

## If the data won't load (CORS)

Browsers may block a direct call to the WHOOP API from a local file. If you've
pasted a valid token and nothing loads, that's almost always CORS. Route through
the included proxy instead:

1. Run it:
   ```
   node proxy.js
   ```
   It listens on `http://localhost:8787` and forwards to the WHOOP API.
2. In `whoop-dashboard.html`, set `USE_PROXY = true` (near the top of the `<script>`).
3. Reload the page and load your data again.

The proxy only adds CORS headers and forwards your request; it doesn't store the
token or log responses.

## Privacy

- The token is held in memory in the tab and cleared on logout.
- Direct mode talks only to `api.prod.whoop.com`.
- Proxy mode talks only to `localhost`, which forwards to the same WHOOP host.
- Nothing is persisted to disk.

## License

MIT — see [`LICENSE`](LICENSE).
