import React from 'react'
// import { Link } from 'react-router-dom'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { dateToString } from '../utils'

function Post ({ post }) {
  const { title, slug, username, created_at } = post
  return <div className='Post-item'>
    <h2>
      <a href={`http://localhost:3000/posts/${slug}`}>{title}</a>
    </h2>
    <div className='meta'>
      { dateToString(created_at) }
      <a href='#Hmm' className='float-right'>{username}</a>
    </div>
  </div>
}

function Loading () {
  return <div className='loading'>Loading...</div>
}

export function Home (props) {
  const { loading, posts } = props.data

  if (loading) return <Loading />

  // const pageCount = Math.ceil(this.state.totalPostCount / this.limit)
  // const page = this.props.page || 1
  //
  // const pagination = []
  // for (let i = 1; i <= pageCount; i++) {
  //   pagination.push(<Link key={i} to={`/page/${i}`}> {i} </Link>)
  // }

  return <div>
    {/* <h5>Page {page} of {pageCount}</h5> */}
    {posts.map((post, i) => <Post key={i} post={post} />)}
    {/* <p>{pagination}</p> */}
  </div>
}

const postsQuery = gql`query partnerWithTariffQuery {
  posts {
    title
    slug
    created_at
  }
}`

const MyComponentWithData = graphql(postsQuery)(Home)

export default MyComponentWithData
