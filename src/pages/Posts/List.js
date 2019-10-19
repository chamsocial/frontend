import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import Loading from '../components/partials/Loading'
import Pagination from '../components/partials/Pagination'
import PostListItem from '../components/Posts/ListItem'

const { REACT_APP_ITEMS_PER_PAGE } = process.env


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


function Home({ page }) {
  const { error, loading, data } = useQuery(postsQuery, {
    variables: { page: parseInt(page, 10) },
    fetchPolicy: 'network-only',
  })
  if (loading || error) return <Loading error={error} />
  const { posts, postsInfo } = data

  return (
    <div className="layout-1">
      <div className="intro box">
        <h1>Welcome to ChamSocial</h1>
        <p>
          <strong>Chamonix online.</strong>
          <br />
          Join us and get access to all the help you might need to make your holiday,{' '}
          season or stay in Chamonix worthwhile, on the web or by email.
        </p>
        <p>
          Find or post accommodation, jobs, climbing partners,{' '}
          buy & sell or post anything else you might need / want.
        </p>
      </div>
      <div className="content box">
        <h1 className="space-between">
          Recent posts
          <Link to="/posts" className="btn">See all posts</Link>
        </h1>
        {posts.map(post => <PostListItem key={post.id} post={post} />)}
        <div>
          <Pagination totalCount={postsInfo.count} page={page} itemsPerPage={REACT_APP_ITEMS_PER_PAGE} urlPrefix="/page/" />
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
Home.defaultProps = {
  page: '1',
}
Home.propTypes = {
  page: PropTypes.string,
}


export default Home
