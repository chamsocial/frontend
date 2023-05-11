import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import Groups from 'components/Groups'
import Search from 'components/Search'
import PostList from './PostList'


const GROUP = gql`query groupItemQuery($slug: String!) {
  group(slug: $slug) {
    id
    title
  }
}`


function GroupList() {
  const { groupSlug } = useParams()
  const { error, loading, data } = useQuery(GROUP, {
    variables: { slug: groupSlug },
    fetchPolicy: 'network-only',
  })
  if (loading || error) return <Loading error={error} />
  const { group } = data

  return (
    <div className="layout-posts">
      <div className="content box">
        <h1 className="space-between">
          {group.title}
        </h1>
        <PostList groupId={group.id} />
      </div>

      <div className="sidebar-top">
        <div className="box">
          <p>
            <Link to="/posts/create" className="btn btn--block">Create a post</Link>
          </p>
          <hr />
          <Search urlPath={`/groups/${groupSlug}`} label={group.title} />
          <hr />
          <Groups activeId={group.id} />
        </div>
      </div>
    </div>
  )
}


export default GroupList
