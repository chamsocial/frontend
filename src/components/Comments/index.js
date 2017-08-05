import React from 'react'
import CommentsForm from './Form'
import Comment from './Comment'

function Comments ({ comments, postSlug }) {
  let commentsList = comments.map(comment => <Comment key={comment.id} postSlug={postSlug} comment={comment} />)
  if (!comments.length) commentsList = <div>No comments</div>

  return <div>
    <h3>Comments</h3>
    <CommentsForm postSlug={postSlug} />
    {commentsList}
  </div>
}

export default Comments
