import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { dateToString } from '../utils'
import Loading from './Loading'
import CommentsForm from './Comments/Form'
import { singlePostQuery } from '../graphql/post-queries'

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = { reply: false }
    this.setReply = this.setReply.bind(this)
  }

  setReply (e) {
    e.preventDefault()
    const reply = !this.state.reply
    this.setState(() => ({ reply }))
  }

  render () {
    const { comment, index = 0, postSlug } = this.props
    const { created_at, content, author, comments } = comment
    let subComments = null
    if (comments && comments.length) {
      const oddEven = (index % 2 === 0) ? 'even' : 'odd'
      const className = `subcomments subcomments-${oddEven}`
      subComments = <div className={className}>
        {comments.map(c => <Comment index={(index + 1)} key={c.id} postSlug={postSlug} comment={c} />)}
      </div>
    }

    let form = null
    if (this.state.reply) {
      form = <CommentsForm postSlug={postSlug} commentId={comment.id} />
    }

    return <div>
      <div className='comment'>
        <div className='meta'>{ dateToString(created_at) } - {author.username}</div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <a href='#reply' onClick={this.setReply}>Reply</a>
        {form}
      </div>
      {subComments}
    </div>
  }
}

function Comments ({ comments, postSlug }) {
  let commentsList = comments.map(comment => <Comment key={comment.id} postSlug={postSlug} comment={comment} />)
  if (!comments.length) commentsList = <div>No comments</div>

  return <div>
    <h3>Comments</h3>
    <CommentsForm postSlug={postSlug} />
    {commentsList}
  </div>
}

export function Post (props) {
  const { loading, post } = props.data
  if (loading) return <Loading />
  const { title, created_at, content, author, comments } = post
  return <div>
    <div className='Post-item'>
      <h1>{title}</h1>
      <div className='post-content' dangerouslySetInnerHTML={{ __html: content }} />
      <div className='meta'>
        { dateToString(created_at) }
        <a href='#Hmm' className='float-right'>{author.username}</a>
      </div>
    </div>
    <Comments postSlug={post.slug} comments={comments} />
  </div>
}

export default graphql(singlePostQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(Post)
