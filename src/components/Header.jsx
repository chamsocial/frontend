import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthState } from './Auth/context'
import Notifications from './Notifications'


function Header() {
  const { user } = useAuthState()

  return (
    <div className="header">
      <div className="container">
        <h2 className="logo">
          <Link to="/">ChamSocial</Link>
        </h2>
        <div>
          {user
            ? (
              <div className="flex" style={{ display: 'flex' }}>
                <Notifications />
                <span>&nbsp;&nbsp;</span>
                <Link className="btn btn--header" to={`/users/${user.slug}`}>{user.username}</Link>
              </div>
            ) : (
              <>
                <Link className="btn btn--header" to="/login">Login</Link>
                {' '}
                <Link className="btn btn--header" to="/signup">Signup</Link>
              </>
            )}
        </div>
      </div>
    </div>
  )
}


export default Header
