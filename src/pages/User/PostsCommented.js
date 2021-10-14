import React from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import PostListItem from 'components/Posts/ListItem'


const POSTS_COMMENTED_QUERY = gql`query postsCommentedQuery {
  postsCommented {
    id
    title
    slug
    createdAt
    commentsCount
    hasMedia
    bookmarkedAt
    group {
      id
      title
      slug
    }
    author {
      id
      slug
      username
    }
  }
}`


function PostsCommented() {
  const { data, loading, error } = useQuery(POSTS_COMMENTED_QUERY, { fetchPolicy: 'network-only' })
  if (loading || error) return <Loading error={error} />

  return (
    <div className="box box--row clearfix">
      <h1>Posts you have commented on</h1>
      {
        data?.postsCommented?.length
          ? data.postsCommented.map(post => <PostListItem key={post.id} post={post} />)
          : <div className="alert">You have no commented on any posts yet.</div>
      }
    </div>
  )
}


export default PostsCommented
