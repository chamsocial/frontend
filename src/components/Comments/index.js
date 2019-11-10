import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import CommentsForm from './Form'
import Comment from './Comment'

function Comments({ comments, postSlug }) {
  const commentsList = !comments.length
    ? <div>No comments</div>
    : comments.map(comment => (
      <Comment key={comment.id} postSlug={postSlug} comment={comment} />
    ))

  return (
    <div>
      <div className="space-between">
        <h1>Comments</h1>
        <span>
          <Link to={`/messages/post/${postSlug}`} className="btn">
            Private message
          </Link>
        </span>
      </div>
      <CommentsForm postSlug={postSlug} />
      {commentsList}
    </div>
  )
}
Comments.propTypes = {
  postSlug: PropTypes.string.isRequired,
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
}

export default Comments
