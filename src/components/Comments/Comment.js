import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import { dateToString } from 'utils'
import CommentsForm from './Form'


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

    return (
      <div>
        <div className="comment">
          <div className="meta space-between comment__meta">
            <Link to={`/users/${author.slug}`}>{author.username}</Link>
            <span>{dateToString(createdAt)}</span>
          </div>
          <div className="comment__content">
            {index < 4 && (
              <div className="comment__reply">
                <a href="#reply" className="meta" onClick={this.setReply}>
                  {reply ? 'Close' : 'Reply'}
                </a>
              </div>
            )}
            <ReactMarkdown source={content} />
          </div>
          {reply && (
            <CommentsForm postSlug={postSlug} parentId={comment.id} closeMe={this.closeForm} />
          )}
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
