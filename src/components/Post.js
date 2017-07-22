import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { dateToString } from '../utils'
import Loading from './Loading'

export function Post (props) {
  const { loading, post } = props.data
  if (loading) return <Loading />
  const { title, username, created_at, content } = post
  return <div className='Post-item'>
    <h1>{title}</h1>
    <div className='post-content' dangerouslySetInnerHTML={{ __html: content }} />
    <div className='meta'>
      { dateToString(created_at) }
      <a href='#Hmm' className='float-right'>{username}</a>
    </div>
    <Link to='/'>Home</Link>
  </div>
}

const postsQuery = gql`query postSingleQuery ($slug: String!) {
  post(slug: $slug) {
    title
    slug
    content
    created_at
    author {
      username
    }
  }
}`

export default graphql(postsQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(Post)
