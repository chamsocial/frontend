import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import Loading from './partials/Loading'
import Pagination from './partials/Pagination'
import PostListItem from './Posts/ListItem'

const { REACT_APP_ITEMS_PER_PAGE } = process.env

export function Home(props) {
  const { page, data } = props
  const {
    error, loading, posts, postsInfo,
  } = data
  if (loading || error) return <Loading error={error} />

  return (
    <div className="page">
      <div className="sidebar">
        <Link to="/posts/create" className="btn btn--block">Create a post</Link>
      </div>
      <div className="main post-list">
        {posts.map(post => <PostListItem key={post.id} post={post} />)}
        <div>
          <Pagination totalCount={postsInfo.count} page={page} itemsPerPage={REACT_APP_ITEMS_PER_PAGE} urlPrefix="/page/" />
        </div>
      </div>
    </div>
  )
}
Home.defaultProps = {
  page: '1',
}
Home.propTypes = {
  page: PropTypes.string,
  data: PropTypes.shape({
    error: PropTypes.any,
    loading: PropTypes.bool,
  }).isRequired,
}

const postsQuery = gql`query postsQuery($page: Int!) {
  posts(limit: ${REACT_APP_ITEMS_PER_PAGE}, page: $page) {
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
  postsInfo {
    count
  }
}`

export default graphql(postsQuery, {
  options: data => {
    const { page = 1 } = data
    return {
      variables: { page: parseInt(page, 10) },
      fetchPolicy: 'network-only',
    }
  },
})(Home)
