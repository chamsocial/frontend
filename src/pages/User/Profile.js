import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import GraphLoader from '../../components/partials/GraphLoader'
import { useAuthState } from '../../components/Auth/context'
import PostListItem from '../../components/Posts/ListItem'

function Profile({ data }) {
  const auth = useAuthState()
  const { user } = data
  let buttons = null
  if (user.id === auth.user.id) {
    buttons = (
      <div className="block">
        <Link to="/messages">Private messages</Link>
        {' '}|{' '}
        <Link to="/users/edit">Edit</Link>
        {' '}|{' '}
        <Link to="/users/emails">Email settings</Link>
        {' '}|{' '}
        <Link to="/logout">Logout</Link>
      </div>
    )
  }
  return (
    <>
      <div className="box box--row">
        <img src={user.avatarUrl} className="profile__img float-right" alt="Profil" />
        <h1>{user.username}</h1>
        {!!user.firstName && !!user.lastName && (
          <div className="meta">{user.firstName} {user.lastName}</div>
        )}
        {buttons}
        {!!user.companyName && <div><strong>Company:</strong> {user.companyName}</div>}
        {!!user.interests && <div><strong>Interests:</strong> {user.interests}</div>}
        {!!user.aboutme && <div><strong>About:</strong> {user.aboutme}</div>}
        {!!user.jobtitle && <p><strong>Jobtitle:</strong> {user.jobtitle}</p>}
      </div>
      <div className="box">
        <h2>Posts:</h2>
        {user.posts.map(post => <PostListItem key={post.id} post={post} />)}
      </div>
    </>
  )
}
Profile.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.object,
  }).isRequired,
}

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
    posts(count: 5) {
      id
      title
      slug
      createdAt
      commentsCount
    }
  }
}`

const loadProfile = GraphLoader(Profile)
const graphProfile = graphql(profileQuery, {
  options: data => ({ variables: { slug: data.match.params.slug } }),
})(loadProfile)

export default graphProfile
