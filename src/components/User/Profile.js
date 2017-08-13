import React from 'react'
import { graphql } from 'react-apollo'
import { profileQuery } from '../../graphql/user-queries'
import Loading from '../partials/Loading'
import PostListItem from '../Posts/ListItem'

function GraphLoader (GraphComponent) {
  return function (props) {
    const { loading, error } = props.data
    if (loading || error) return <Loading error={error} />
    return <GraphComponent {...props} />
  }
}

function Profile ({ data }) {
  const { user } = data
  return <div>
    <h2>{user.username}</h2>
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

export default graphql(profileQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(GraphLoader(Profile))
