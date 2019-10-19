import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import Loading from '../../components/partials/Loading'
import PostListItem from '../../components/Posts/ListItem'
import Sidebar from './Sidebar'

const LATEST_POSTS = gql`query postsQuery {
  posts(postsPerPage: 10) {
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


function Home({ page }) {
  const { error, loading, data } = useQuery(LATEST_POSTS, {
    variables: { page: parseInt(page, 10) },
    fetchPolicy: 'network-only',
  })

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
        <hr />
        {
          (loading || error)
            ? <Loading error={error} />
            : data.posts.list.map(post => <PostListItem key={post.id} post={post} />)
        }
        <div className="block">
          <Link to="/posts" className="btn">See all posts</Link>
        </div>
      </div>

      <div className="sidebar-top">
        <div className="box">
          <Sidebar />
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
