import React, { Component } from 'react'
import { dateToString } from '../utils'

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

    this.state = {
      posts: []
    }
  }
  componentDidMount () {

    fetch('http://localhost:5000/v1/posts')
      .then((res) => res.json())
      .then(json => {
        this.setState(() => ({ posts: json.posts }))
      })
  }

  render () {
    return <div>
      {this.state.posts.map((post, i) => <Post key={i} post={post}/>)}
    </div>
  }
}
