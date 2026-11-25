import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const BETA_URL = 'https://beta.chamsocial.com'
// Path of the announcement post, e.g. '/posts/the-new-chamsocial-beta'.
// Fill in once the post is up; the "Read more" link stays hidden until then.
const ANNOUNCEMENT_PATH = ''
const DISMISS_KEY = 'beta-bar-dismissed'

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

function BetaBar() {
  const [dismissed, setDismissed] = useState(readDismissed)
  if (dismissed) return null

  function close() {
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      // Storage blocked (private mode): hide for this page view only
    }
    setDismissed(true)
  }

  return (
    <div className="beta-bar" role="region" aria-label="New ChamSocial beta">
      <span className="beta-bar__icon" aria-hidden="true">
        <FontAwesomeIcon icon="map-signs" />
      </span>
      <div className="beta-bar__text">
        <strong className="beta-bar__title">Come and see the new ChamSocial</strong>
        <span className="beta-bar__sub">
          We&apos;ve rebuilt the site and would love you to try it. Same account, same posts.
          {ANNOUNCEMENT_PATH && (
            <>
              {' '}
              <Link to={ANNOUNCEMENT_PATH}>Read more</Link>
            </>
          )}
        </span>
      </div>
      <a href={BETA_URL} className="btn btn--secondary beta-bar__go">Take a look</a>
      <button type="button" className="beta-bar__close" onClick={close} aria-label="Hide the beta notice">×</button>
    </div>
  )
}

export default BetaBar
