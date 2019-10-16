import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withAuth } from './Auth/AuthContext'

export function HeaderComponent({ auth }) {
  const { user } = auth

  return (
    <div className="header">
      <div className="container">
        <h2 className="logo">
          <Link to="/">ChamSocial</Link>
        </h2>
        <div>
          {user
            ? <Link to={`/users/${user.slug}`}>{user.username}</Link>
            : <span><Link to="/signup">Signup</Link> / <Link to="/login">Login</Link></span>}
        </div>
      </div>
    </div>
  )
}
HeaderComponent.propTypes = {
  auth: PropTypes.shape({
    user: PropTypes.shape({
      username: PropTypes.string,
    }),
  }).isRequired,
}

export default withAuth(HeaderComponent)
