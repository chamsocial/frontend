import React from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import Pagination from 'components/partials/Pagination'
import PostListItem from 'components/Posts/ListItem'

const POSTS_PER_PAGE = 20

const postsQuery = gql`query postsQuery($postsPerPage: Int, $page: Int!, $groupId: ID, $search: String) {
  posts(postsPerPage: $postsPerPage, page: $page, groupId: $groupId, search: $search) {
    totalCount
    list {
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
  }
}`


function PostList({ groupId, queryParams }) {
  const params = new URLSearchParams(queryParams)
  const page = parseInt(params.get('p'), 10) || 1
  const search = params.get('q')
  const { error, loading, data } = useQuery(postsQuery, {
    variables: {
      page,
      postsPerPage: POSTS_PER_PAGE,
      groupId,
      search,
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
