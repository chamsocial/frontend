import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CommentsForm from './Form'
import { dateToString } from '../../utils'

class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = { reply: false }
    this.setReply = this.setReply.bind(this)
    this.closeForm = this.closeForm.bind(this)
  }

  setReply(e) {
    if (e) e.preventDefault()
    this.setState(prevState => ({ reply: !prevState.reply }))
  }

  closeForm() {
    this.setReply()
  }

  render() {
    const { reply } = this.state
    const { comment, index, postSlug } = this.props
    const {
      createdAt, content, author, comments,
    } = comment
    let subComments = null
    if (comments && comments.length) {
      const oddEven = (index % 2 === 0) ? 'even' : 'odd'
      const className = `subcomments subcomments-${oddEven}`
      subComments = (
        <div className={className}>
          {comments.map(c => (
            <Comment index={(index + 1)} key={c.id} postSlug={postSlug} comment={c} />
          ))}
        </div>
      )
    }

    let form = null
    let replyButton = null
    if (reply) {
      form = <CommentsForm postSlug={postSlug} parentId={comment.id} closeMe={this.closeForm} />
    }
    if (index < 4) {
      replyButton = <a href="#reply" className="float-right" onClick={this.setReply}>Reply</a>
    }

    return (
      <div>
        <div className="comment">
          <div className="meta">
            {replyButton}
            { dateToString(createdAt) } - {author.username}
          </div>
          <div dangerouslySetInnerHTML={{ __html: content }} />
          {form}
        </div>
        {subComments}
      </div>
    )
  }
}
Comment.defaultProps = {
  index: 0,
}
Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  index: PropTypes.number,
  postSlug: PropTypes.string.isRequired,
}

export default Comment
