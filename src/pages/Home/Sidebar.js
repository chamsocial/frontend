import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import { useAuthState } from 'components/Auth/context'


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


const GROUPS_LIST = gql`query groupsListQuery {
  groups {
    id
    slug
    title
  }
}`


function Groups() {
  const { loading, error, data } = useQuery(GROUPS_LIST)
  if (loading || error) return null

  return (
    <div className="block">
      <h1>Groups</h1>
      {data.groups.map(group => (
        <div key={group.id}>
          <Link to={`/groups/${group.slug}`}>{group.title}</Link>
        </div>
      ))}
    </div>
  )
}


function Sidebar() {
  const { user } = useAuthState()

  return (
    <div>
      {user ? <User user={user} /> : <NotLoggedIn />}
      <hr />
      <Groups />
    </div>
  )
}


export default Sidebar
