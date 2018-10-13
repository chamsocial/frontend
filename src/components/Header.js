import React from 'react'
import { Link } from 'react-router-dom'
import { withAuth } from './Auth/AuthContext'

export function Header ({ auth }) {
  const { user } = auth
  console.log(auth.user)
  return <div className='App-header'>
    <div className='container header'>
      <h2 className='logo'>
        <Link to='/'>Chamsocial</Link>
      </h2>
      <div>
        {user
          ? <Link to='/logout'>Logout {user.username}</Link>
          : <span><Link to='/signup'>Signup</Link> / <Link to='/login'>Login</Link></span>
        }
      </div>
    </div>
  </div>
}

export default withAuth(Header)
