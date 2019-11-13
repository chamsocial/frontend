import React from 'react'
import PropTypes from 'prop-types'
import Comment from './Comment'

function Comments({ comments, postSlug }) {
  const commentsList = !comments.length
    ? <div>No comments</div>
    : comments.map(comment => (
      <Comment key={comment.id} postSlug={postSlug} comment={comment} />
    ))

  return (
    <div>
      <h1>Comments</h1>
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
