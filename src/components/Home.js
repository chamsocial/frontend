import React from 'react'
// import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { dateToString } from '../utils'

function Post ({ post }) {
  const { title, slug, author, created_at } = post
  return <div className='Post-item'>
    <h2>
      <a href={`http://localhost:3000/posts/${slug}`}>{title}</a>
    </h2>
    <div className='meta'>
      { dateToString(created_at) }
      <a href='#Hmm' className='float-right'>{author.username}</a>
    </div>
  </div>
}

function Loading () {
  return <div className='loading'>Loading...</div>
}

export function Home (props) {
  const { loading, posts } = props.data
  if (loading) return <Loading />

  return <div>
    {posts.map((post, i) => <Post key={i} post={post} />)}
  </div>
}

const postsQuery = gql`query partnerWithTariffQuery {
  posts {
    title
    slug
    created_at
    author {
      username
    }
  }
}`

const MyComponentWithData = graphql(postsQuery)(Home)

export default MyComponentWithData
