import React from 'react'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import Loading from 'components/partials/Loading'
import Pagination from 'components/partials/Pagination'
import PostListItem from 'components/Posts/ListItem'

const POSTS_PER_PAGE = 20

const postsQuery = gql`query postsQuery($postsPerPage: Int, $page: Int!) {
  posts(postsPerPage: $postsPerPage, page: $page) {
    totalCount
    list {
      id
      title
      slug
      createdAt
      commentsCount
      author {
        id
        slug
        username
      }
    }
  }
}`


function PostsList({ location }) {
  const params = new URLSearchParams(location.search)
  const page = parseInt(params.get('p'), 10) || 1
  const { error, loading, data } = useQuery(postsQuery, {
    variables: {
      page,
      postsPerPage: POSTS_PER_PAGE,
    },
    fetchPolicy: 'network-only',
  })
  if (loading || error) return <Loading error={error} />
  const { posts } = data

  return (
    <div className="layout-posts">
      <div className="content box">
        <h1 className="space-between">
          Recent posts
          <Link to="/posts" className="btn">See all posts</Link>
        </h1>
        {posts.list.map(post => <PostListItem key={post.id} post={post} />)}
        <div>
          <Pagination totalCount={posts.totalCount} page={page} itemsPerPage={POSTS_PER_PAGE} />
        </div>
      </div>

      <div className="sidebar-top">
        <div className="box">
          <p>
            <Link to="/posts/create" className="btn btn--block">Create a post</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


export default PostsList
