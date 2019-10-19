import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { authContext } from 'components/Auth/AuthContext'


function User({ user }) {
  return (
    <div>
      <h1>Hi {user.username}</h1>

      <ul>
        <li>
          <Link to={`/users/${user.slug}`}>Visit profile</Link>
        </li>
        <li>
          <a href="https://www.chamsocial.com/en/messages">
            Private messages{' '}
            <span className="desc">(Old site)</span>
          </a>
        </li>
        <li>
          <Link to="/users/emails">E-mail subscriptions settings</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>

      <p>
        <Link to="/posts/create" className="btn btn--block">Create a post</Link>
      </p>
    </div>
  )
}

function NotLoggedIn() {
  return (
    <>
      <h1>Hi, visitor!</h1>
      <p>
        <Link to="/login" className="btn">Login</Link> or <Link className="btn" to="/signup">Signup</Link>
      </p>
    </>
  )
}


function Sidebar() {
  const userContext = useContext(authContext)

  return (
    <div>
      {
        userContext.user
          ? <User user={userContext.user} />
          : <NotLoggedIn />
      }
    </div>
  )
}


export default Sidebar
