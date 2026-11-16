# ChamSocial frontend


## Development
* `npm install`
* `npm run dev`
* Visit <http://localhost:4074>


## Analytics (Umami)
Page views are reported to a self-hosted [Umami](https://umami.is), next to Google Analytics.
The tracker is only added when both of these are set at build time (`src/utils/umami.js`):

* `VITE_UMAMI_SRC` - where the tracker script is served. Production: `/u/script.js`,
  which Caddy proxies to Umami (together with `/u/api/send`).
* `VITE_UMAMI_WEBSITE_ID` - the website's id in Umami (Settings > Websites).

The values in `.env` are for local development, so in production they go in the server's
own env file (`.env.production` or `.env.local`, neither is in git), followed by a new
build (`sh build.sh`). To try it locally, point `VITE_UMAMI_SRC` in `.env.local` at a local
Umami, e.g. `http://localhost:3100/script.js`.

Paths that hold a secret or private content (password reset, account activation, private
messages) are reported as the route's shape, e.g. `/messages/:threadId`. A new route like
that needs a rule in `src/utils/umami-redact.js`.
