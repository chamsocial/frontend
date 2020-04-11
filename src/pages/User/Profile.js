import React from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import { prettyDate } from 'utils'
import GraphLoader from '../../components/partials/GraphLoader'
import { useAuthState } from '../../components/Auth/context'
import PostListItem from '../../components/Posts/ListItem'


function Profile({ data }) {
  const auth = useAuthState()
  const { user } = data
  let buttons = null
  if (user.id === auth.user.id) {
    buttons = (
      <div>
        <br />
        <Link to="/messages">Private messages</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/users/edit">Edit</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/users/emails">Email settings</Link>
        {' '}&nbsp;|&nbsp;{' '}
        <Link to="/logout">Logout</Link>
      </div>
    )
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
        {buttons}
      </div>
      <div className="box">
        <h2>Latest posts:</h2>
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

const loadProfile = GraphLoader(Profile)
const graphProfile = graphql(profileQuery, {
  options: data => ({ variables: { slug: data.match.params.slug } }),
})(loadProfile)

export default graphProfile
