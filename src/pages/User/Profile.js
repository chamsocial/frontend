import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { prettyDate } from 'utils'
import Loading from 'components/partials/Loading'
import { useAuthState } from 'components/Auth/context'
import PostListItem from 'components/Posts/ListItem'


const profileQuery = gql`query userQuery ($slug: String!) {
  user(slug: $slug) {
    id
    slug
    username
    firstName
    lastName
    companyName
    interests
    aboutme
    jobtitle
    avatarUrl
    createdAt
    posts(count: 10) {
      id
      title
      slug
      createdAt
      commentsCount
    }
  }
}`


function Profile() {
  const { slug } = useParams()
  const { data: { user } = {}, loading, error } = useQuery(profileQuery, {
    variables: { slug },
  })
  const auth = useAuthState()
  if (loading || error) return <Loading error={error} />
  let buttons = null
  if (!user?.id) return <div className="alert">No user found.</div>
  if (user.id === auth.user.id) {
    buttons = (
      <>
        <Link to="/messages">Private messages</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/users/edit">Edit</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/users/emails">Email settings</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/users/bookmarks">Bookmarks</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/logout">Logout</Link>
      </>
    )
  } else {
    buttons = <Link to={`/messages/to/${user.slug}`}>Send {user.username} a private message</Link>
  }
  const longUsername = user.username.length > 20

  return (
    <>
      <div className="box box--padded box--row clearfix">
        {/* <img src={user.avatarUrl} className="profile__img float-right" alt="Profil" /> */}
        <h1 className={`${longUsername && 'h1--long'}`}>{user.username}</h1>
        {!!user.firstName && !!user.lastName && (
          <div className="subtitle">{user.firstName} {user.lastName}</div>
        )}
        <div><strong>Member since:</strong> {prettyDate(user.createdAt)}</div>
        {!!user.companyName && <div><strong>Company:</strong> {user.companyName}</div>}
        {!!user.jobtitle && <div><strong>Jobtitle:</strong> {user.jobtitle}</div>}
        {!!user.aboutme && <div><strong>About:</strong> {user.aboutme}</div>}
        {!!user.interests && <div><strong>Interests:</strong> {user.interests}</div>}
        <br />
        {buttons}
      </div>
      <div className="box">
        <h2>Latest posts:</h2>
        {user.posts.map(post => <PostListItem key={post.id} post={post} />)}
      </div>
    </>
  )
}


export default Profile
