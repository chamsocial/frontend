import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { dateToString, request } from '../utils'

function Post ({ post }) {
  const { title, slug, username, created_at } = post
  return <div className='Post-item'>
    <h2>
      <a href={`http://localhost:5000/en/posts/${slug}`}>{title}</a>
    </h2>
    <div className='meta'>
       { dateToString(created_at) }
      <a href='#Hmm' className='float-right'>{username}</a>
    </div>
  </div>
}

export default class Home extends Component {
  constructor (props) {
    super(props)

    this.limit = 5
    this.state = {
      posts: [],
      totalPostCount: 0
    }

    this.loadPosts = this.loadPosts.bind(this)
  }
  componentDidMount () {
    this.loadPosts()
  }

  componentDidUpdate(prevProps) {
    if (this.props.page !== prevProps.page) {
      this.loadPosts()
    }
  }

  loadPosts (props) {
    const { page = 1 } = this.props

    request.get(`http://localhost:5000/v1/posts?limit=${this.limit}&page=${page}`)
      .then(json => {
        this.setState(() => ({ posts: json.posts, totalPostCount: json.meta.total }))
      })
  }

  render () {
    const pageCount = Math.ceil(this.state.totalPostCount / this.limit)
    const page = this.props.page || 1

    const pagination = []
    for(let i = 1; i <= pageCount; i++) {
      pagination.push(<Link key={i} to={`/page/${i}`}> {i} </Link>)
    }

    return <div>
      <h5>Page {page} of {pageCount}</h5>
      {this.state.posts.map((post, i) => <Post key={i} post={post}/>)}
      <p>{pagination}</p>
    </div>
  }
}
