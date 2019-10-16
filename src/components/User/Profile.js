import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import GraphLoader from '../partials/GraphLoader'
import { withAuth } from '../Auth/AuthContext'
import PostListItem from '../Posts/ListItem'

function Profile({ data, auth }) {
  const { user } = data
  let buttons = null
  if (user.id === auth.user.id) {
    buttons = (
      <div>
        <Link key="edit" to={`/users/${user.slug}/edit`}>Edit</Link>
        {' '}|{' '}
        <Link key="logout" to="/logout">Logout</Link>
        <br />
        <br />
      </div>
    )
  }
  return (
    <div>
      <img src={user.avatarUrl} className="profile__img float-right" alt="Profil" />
      <h1>{user.username}</h1>
      {!!user.firstName && !!user.lastName && (
        <div className="meta">{user.firstName} {user.lastName}</div>
      )}
      {buttons}
      {!!user.companyName && <div><strong>Company:</strong> {user.companyName}</div>}
      {!!user.interests && <div><strong>Interests:</strong> {user.interests}</div>}
      {!!user.aboutme && <div><strong>About:</strong> {user.aboutme}</div>}
      {!!user.jobtitle && <div><strong>Jobtitle:</strong> {user.jobtitle}</div>}
      <br />
      <h2>Posts:</h2>
      {user.posts.map(post => <PostListItem key={post.id} post={post} />)}
    </div>
  )
}
Profile.propTypes = {
  data: PropTypes.shape({
    user: PropTypes.object,
  }).isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
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
    posts {
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
  options: data => ({ variables: { slug: data.slug } }),
})(withAuth(loadProfile))

export default graphProfile
