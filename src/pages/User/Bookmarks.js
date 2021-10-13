import React from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import PostListItem from 'components/Posts/ListItem'


const BOOKMARKS_QUERY = gql`query bookmarksQuery {
  bookmarks {
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


function Bookmarks() {
  const { data, loading, error } = useQuery(BOOKMARKS_QUERY, { fetchPolicy: 'network-only' })
  if (loading || error) return <Loading error={error} />

  return (
    <div className="box box--row clearfix">
      <h1>Bookmarks</h1>
      {
        data?.bookmarks?.length
          ? data.bookmarks.map(post => <PostListItem key={post.id} post={post} />)
          : <div className="alert">You have not bookmarked any posts yet.</div>
      }
    </div>
  )
}


export default Bookmarks
