import React from 'react'
import { gql, useQuery } from '@apollo/client'
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
      hasMedia
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


function Home() {
  const { error, loading, data } = useQuery(LATEST_POSTS, { fetchPolicy: 'network-only' })
  const today = Date.now()
  const endNews = 1626044400000 // July 12th 2021

  return (
    <div className="layout-1">
      <div className="intro box">
        <h1>Welcome to the all new ChamSocial</h1>
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
        {today < endNews && (
          <p>
            <strong style={{ color: '#0086DB' }}>News:</strong> We have now added search to the site.
          </p>
        )}
      </div>
      <div className="content box">
        <h1 className="space-between">
          Recent posts
          <Link to="/posts" className="btn btn--secondary">See all posts</Link>
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

export default Home
