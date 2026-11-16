// Umami analytics: self-hosted, no cookie, page views only. It runs next to the Google
// Analytics snippet in index.html, which is untouched.
//
// Two `VITE_*` vars turn it on (baked in at build time, see README). Neither is a
// secret: both end up in the page for every visitor.
//
//   VITE_UMAMI_SRC         where the tracker script is served. The tracker posts its
//                          events to the folder it was loaded from, so `/u/script.js`
//                          reports to `/u/api/send` on our own origin.
//   VITE_UMAMI_WEBSITE_ID  the website's id in Umami (Settings > Websites).
//
// The tracker follows client-side navigation by itself (it wraps history.pushState and
// replaceState), so nothing here listens to the router. Never call `umami.identify()` or
// set `data-distinct-id`: no user id, username or email may reach Umami.
import { UMAMI_BEFORE_SEND, umamiBeforeSend } from './umami-redact'

const read = value => (typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined)

/**
 * `undefined` = no tracker on the page. It is off when:
 *  - either value is missing or blank (a fresh checkout);
 *  - running under Vitest, which loads `.env` too: a test run must never report visits.
 */
export function resolveUmamiEnv({ src, websiteId, mode }) {
  const trackerSrc = read(src)
  const id = read(websiteId)
  if (trackerSrc === undefined || id === undefined || mode === 'test') return undefined
  return { src: trackerSrc, websiteId: id }
}

export const umamiEnv = resolveUmamiEnv({
  src: import.meta.env.VITE_UMAMI_SRC,
  websiteId: import.meta.env.VITE_UMAMI_WEBSITE_ID,
  mode: import.meta.env.MODE,
})

/**
 * Adds the tracker's script tag to the page, or does nothing when `env` is undefined.
 *
 * The order matters: the tracker reports the first page view as soon as it loads, and
 * looks up the `data-before-send` name on `window` each time it sends. A name that is
 * not there yet means the payload goes out as it is. So the function that hides secrets
 * in the path (umami-redact.js) is put there first.
 */
export function installUmami(env, win) {
  if (env === undefined) return
  win[UMAMI_BEFORE_SEND] = umamiBeforeSend

  const script = win.document.createElement('script')
  script.defer = true
  script.src = env.src
  script.setAttribute('data-website-id', env.websiteId)
  // No query strings: they hold search terms.
  script.setAttribute('data-exclude-search', 'true')
  script.setAttribute('data-before-send', UMAMI_BEFORE_SEND)
  // Which app served the page. tanSocial reports to the same Umami website as
  // "tansocial", so the two can be told apart after the cutover, when both have been
  // www.chamsocial.com.
  script.setAttribute('data-tag', 'legacy')
  win.document.head.appendChild(script)
}
