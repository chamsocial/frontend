import React, { Component } from 'react'
import CommentsForm from './Form'
import { dateToString } from '../../utils'

class Comment extends Component {
  constructor (props) {
    super(props)
    this.state = { reply: false }
    this.setReply = this.setReply.bind(this)
    this.closeForm = this.closeForm.bind(this)
  }

  setReply (e) {
    if (e) e.preventDefault()
    const reply = !this.state.reply
    this.setState(() => ({ reply }))
  }

  closeForm () {
    this.setReply()
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
    let replyButton = null
    if (this.state.reply) {
      form = <CommentsForm postSlug={postSlug} parentId={comment.id} closeMe={this.closeForm} />
    }
    if (index < 4) {
      replyButton = <a href='#reply' className='float-right' onClick={this.setReply}>Reply</a>
    }

    return <div>
      <div className='comment'>
        <div className='meta'>
          {replyButton}
          { dateToString(created_at) } - {author.username}
        </div>
        <div dangerouslySetInnerHTML={{ __html: content }} />
        {form}
      </div>
      {subComments}
    </div>
  }
}

export default Comment
