import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthState } from 'components/Auth/context'
import Groups from 'components/Groups'
import Search from 'components/Search'


function User({ user }) {
  return (
    <div>
      <h1>Hi {user.username}</h1>

      <ul className="list list--lined">
        <li>
          <Link to={`/users/${user.slug}`}>Visit profile</Link>
        </li>
        <li>
          <Link to="/messages">Private messages</Link>
        </li>
        <li>
          <Link to="/users/emails">E-mail subscriptions settings</Link>
        </li>
        <li>
          <Link to="/users/bookmarks">Bookmarks</Link>
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
        <Link to="/login">Login</Link>
        {' / '}
        <Link to="/signup">Signup</Link>
      </p>
    </>
  )
}


function Sidebar() {
  const { user } = useAuthState()

  return (
    <div>
      {user ? <User user={user} /> : <NotLoggedIn />}
      <hr />
      <Search />
      <hr />
      <Groups />
    </div>
  )
}


export default Sidebar
