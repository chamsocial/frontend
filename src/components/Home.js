import React from 'react'
import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { dateToString } from '../utils'
import Loading from './Loading'

function Post ({ post }) {
  const { title, slug, author, created_at } = post
  return <div className='Post-item'>
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
  const { loading, posts } = props.data
  if (loading) return <Loading />

  return <div>
    {posts.map((post, i) => <Post key={i} post={post} />)}
  </div>
}

const postsQuery = gql`query postsQuery {
  posts {
    title
    slug
    created_at
    author {
      username
    }
  }
}`

export default graphql(postsQuery)(Home)
