import React from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import Loading from 'components/partials/Loading'
import Pagination from 'components/partials/Pagination'
import PostListItem from 'components/Posts/ListItem'

const POSTS_PER_PAGE = 20

const postsQuery = gql`query postsQuery($postsPerPage: Int, $page: Int!, $groupId: ID) {
  posts(postsPerPage: $postsPerPage, page: $page, groupId: $groupId) {
    totalCount
    list {
      id
      title
      slug
      createdAt
      commentsCount
      hasMedia
      author {
        id
        slug
        username
      }
    }
  }
}`


function PostList({ groupId, search }) {
  const params = new URLSearchParams(search)
  const page = parseInt(params.get('p'), 10) || 1
  const { error, loading, data } = useQuery(postsQuery, {
    variables: {
      page,
      postsPerPage: POSTS_PER_PAGE,
      groupId,
    },
    fetchPolicy: 'network-only',
  })
  if (loading || error) return <Loading error={error} />
  const { posts } = data

  return (
    <>
      {posts.list.map(post => <PostListItem key={post.id} post={post} />)}
      <div>
        <Pagination totalCount={posts.totalCount} page={page} itemsPerPage={POSTS_PER_PAGE} />
      </div>
    </>
  )
}


export default PostList
