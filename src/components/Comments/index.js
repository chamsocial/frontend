import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Comment from './Comment'
import CommentsForm from './Form'

function Comments({ comments, postSlug }) {
  const [isOpen, setOpen] = useState(false)
  const commentsList = !comments.length
    ? <div>No comments</div>
    : comments.map(comment => (
      <Comment key={comment.id} postSlug={postSlug} comment={comment} />
    ))

  return (
    <div>
      <div className="space-between">
        <h1>Comments</h1>
        <div>
          <button type="button" onClick={() => setOpen(!isOpen)} className="btn btn--secondary">
            {isOpen ? 'Close' : 'Write comment'}
          </button>
        </div>
      </div>
      {isOpen && (<CommentsForm postSlug={postSlug} />)}
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
