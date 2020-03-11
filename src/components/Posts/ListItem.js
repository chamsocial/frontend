import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { dateToString } from '../../utils'

function PostListItem({ post }) {
  const {
    title, slug, author, createdAt, commentsCount, hasMedia,
  } = post
  let authorInfo = null
  if (author) {
    authorInfo = <Link to={`/users/${author.slug}`} className="float-right">{author.username}</Link>
  }

  return (
    <div className="post-list__item">
      <h2>
        <Link to={`/posts/${slug}`}>{title}</Link>
      </h2>
      <div className="meta">
        {dateToString(createdAt)}
        {' '}
        {hasMedia && <FontAwesomeIcon style={{ color: '#5BC8AF' }} icon="image" />}
        {' '}
        {!!commentsCount && <><FontAwesomeIcon style={{ color: '#5BC8AF' }} icon="comment" /> {commentsCount}</>}
        {authorInfo}
      </div>
    </div>
  )
}
PostListItem.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    slug: PropTypes.string,
  }).isRequired,
}

export default PostListItem
