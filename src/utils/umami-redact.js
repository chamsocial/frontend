// What Umami must never be told. The tracker reports each page's URL, its title and the
// page the visitor came from. On a few routes the path itself is a secret or private:
//
//   /reset-password/<token>          the token is a credential until it is used or expires
//   /users/activate/<code>           same, for a new account
//   /messages/<threadId>             a private conversation
//   /messages/to/<slug>              who a member is about to write to
//   /unsubscribe/<user>/<time>/<id>  the one-click unsubscribe link from the emails. It
//                                    points at the API, not at this app, but pasted onto
//                                    this site it lands on the 404 page, which is tracked
//
// For those the real path is replaced with the route's shape (`/reset-password/:token`)
// and the title is dropped, so the visit is still counted but says nothing more.
// `data-exclude-search` on the tracker covers query strings (search terms); this covers
// the path.
//
// The tracker finds the function by name (`data-before-send`) on `window` and calls it
// with every payload, so it has to be there before the tracker's script runs
// (src/utils/umami.js).
//
// A new route with a secret in its path (src/Routes.jsx) needs a rule here.

/** The name the tracker looks up on `window`; goes in `data-before-send`. */
export const UMAMI_BEFORE_SEND = 'umamiBeforeSend'

// Matched the way React Router v6 matches a path: ignoring case, on the decoded path.
// Repeated slashes are accepted too; hiding too much costs nothing. In the fourth rule
// `new` and `to` are real pages, not thread ids.
const RULES = [
  [/^\/+reset-password\/+[^/]+/i, '/reset-password/:token'],
  [/^\/+users\/+activate\/+[^/]+/i, '/users/activate/:code'],
  [/^\/+messages\/+to\/+[^/]+/i, '/messages/to/:slug'],
  [/^\/+messages\/+(?!(?:new|to)(?=\/|$))[^/]+/i, '/messages/:threadId'],
  [/^\/+unsubscribe\/+.+/i, '/unsubscribe/:user/:time/:group'],
]

// The tracker sends absolute URLs for the page and origin-less paths for a same-site
// referrer: an optional origin, the path, then whatever follows (query string, hash).
const URL_PARTS = /^(https?:\/\/[^/?#]*)?([^?#]*)([\s\S]*)$/i

// `/reset%2Dpassword/abc` reaches the reset page as well: the router decodes each
// segment before matching, so the rules have to see the decoded path too.
function decodePath(path) {
  try {
    return path.split('/').map(segment => decodeURIComponent(segment).replace(/\//g, '%2F')).join('/')
  } catch {
    return path // malformed escape: match it as it is
  }
}

function redact(value) {
  if (typeof value !== 'string') return value
  const parts = URL_PARTS.exec(value)
  if (!parts) return value
  const [, origin = '', path, rest] = parts
  const decoded = decodePath(path)
  for (const [pattern, shape] of RULES) {
    const next = decoded.replace(pattern, shape)
    if (next !== decoded) return origin + next + rest
  }
  return value
}

/**
 * Umami's `beforeSend` hook: gets every payload before it is sent and returns what may
 * be sent. Used for page views here, but it hides the same paths on any payload.
 */
export function umamiBeforeSend(type, payload) {
  if (!payload) return payload
  const next = { ...payload }
  const url = redact(payload.url)
  if (url !== payload.url) {
    next.url = url
    delete next.title
  }
  if ('referrer' in payload) next.referrer = redact(payload.referrer)
  return next
}
