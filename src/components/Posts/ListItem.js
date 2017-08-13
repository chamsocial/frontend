import React from 'react'
import { Link } from 'react-router-dom'
import { dateToString } from '../../utils'

function PostListItem ({ post }) {
  const { title, slug, author, created_at, comments_count: commentsCount } = post
  let comments = null
  if (commentsCount) {
    comments = <span className='float-right meta'>
      <i className='icon-comment-empty' />{commentsCount}
    </span>
  }
  let authorInfo = null
  if (author) {
    authorInfo = <Link to={`/users/${author.slug}`} className='float-right'>{author.username}</Link>
  }

  return <div className='Post-item'>
    {comments}
    <h2>
      <Link to={`/posts/${slug}`}>{title}</Link>
    </h2>
    <div className='meta'>
      { dateToString(created_at) }
      {authorInfo}
    </div>
  </div>
}

export default PostListItem
