import React from 'react'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { dateToString } from '../utils'
import Loading from './partials/Loading'
import Pagination from './partials/Pagination'
const { REACT_APP_ITEMS_PER_PAGE } = process.env

function Post ({ post }) {
  const { title, slug, author, created_at, comments_count: commentsCount } = post
  let comments = null
  if (commentsCount) {
    comments = <span className='float-right meta'>
      <i className='icon-comment-empty' />{commentsCount}
    </span>
  }

  return <div className='Post-item'>
    {comments}
    <h2>
      <Link to={`/posts/${slug}`}>{title}</Link>
    </h2>
    <div className='meta'>
      { dateToString(created_at) }
      <a href='#Hmm' className='float-right'>{author.username}</a>
    </div>
  </div>
}

export function Home (props) {
  const { page = 1 } = props
  const { loading, posts, postsInfo } = props.data
  if (loading) return <Loading />

  return <div>
    {posts.map((post, i) => <Post key={i} post={post} />)}
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
