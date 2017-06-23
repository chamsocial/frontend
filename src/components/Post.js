import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { dateToString, request } from '../utils'

export class Post extends Component {
  constructor (props) {
    super(props)

    this.state = {
      post: false
    }

    this.loadSinglePost = this.loadSinglePost.bind(this)
  }
  componentDidMount () {
    this.loadSinglePost()
  }

  loadSinglePost () {
    const { slug, token } = this.props
    request.get(`http://localhost:5000/v1/posts/${slug}/links/comments`, token)
      .then(json => {
        console.log(json)
        this.setState(() => ({ post: json.posts }))
      })
  }

  render () {
    if (!this.state.post) return <div>Loading</div>
    const { title, username, created_at, content } = this.state.post
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
}

function mapStateToProps(state) {
  return { token: state.token }
}
export default connect(mapStateToProps)(Post)
