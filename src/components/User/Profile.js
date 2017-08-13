import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { profileQuery } from '../../graphql/user-queries'
import GraphLoader from '../partials/GraphLoader'
import PostListItem from '../Posts/ListItem'

function Profile (props) {
  const { user } = props.data
  let editButton = null
  if (props.user.id === user.id) {
    editButton = <Link to={`/users/${user.slug}/edit`}>Edit</Link>
  }
  return <div>
    <h2>{user.username}</h2>
    {editButton}
    <br />{user.first_name}
    <br />{user.last_name}
    <br />{user.company_name}
    <br />{user.interests}
    <br />{user.aboutme}
    <br />{user.jobtitle}
    <br />{user.avatarpath}
    {user.posts.map((post, i) => <PostListItem key={i} post={post} />)}
  </div>
}

const loadProfile = GraphLoader(Profile)
const graphProfile = graphql(profileQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(loadProfile)
const mapStateToProps = (state) => ({ user: state.auth.user })
export default connect(mapStateToProps)(graphProfile)
