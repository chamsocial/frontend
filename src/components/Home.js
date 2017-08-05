import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Loading from './partials/Loading'
import Pagination from './partials/Pagination'
import PostListItem from './Posts/ListItem'
const { REACT_APP_ITEMS_PER_PAGE } = process.env

export function Home (props) {
  const { page = 1 } = props
  const { loading, posts, postsInfo } = props.data
  if (loading) return <Loading />

  return <div>
    {posts.map((post, i) => <PostListItem key={i} post={post} />)}
    <div>
      <Pagination totalCount={postsInfo.count} page={page} itemsPerPage={REACT_APP_ITEMS_PER_PAGE} urlPrefix='/page/' />
    </div>
  </div>
}

const postsQuery = gql`query postsQuery($offset: Int!) {
  posts(limit: ${REACT_APP_ITEMS_PER_PAGE}, order: "reverse:created_at", offset: $offset) {
    id
    title
    slug
    created_at
    comments_count
    author {
      id
      username
    }
  }
  postsInfo {
    count
  }
}`

export default graphql(postsQuery, {
  options: (data) => {
    const { page = 1 } = data
    const offset = REACT_APP_ITEMS_PER_PAGE * (page - 1)
    return {
      variables: {
        offset
      }
    }
  }
})(Home)
