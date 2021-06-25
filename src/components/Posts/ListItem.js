import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { dateToString } from '../../utils'

function PostListItem({ post }) {
  const {
    title, slug, author, group, createdAt, commentsCount, hasMedia,
  } = post

  return (
    <div className="post-list__item">
      <h2>
        <Link to={`/posts/${slug}`}>{title}</Link>
      </h2>
      <div className="meta post-meta space-between">
        <span>
          {Boolean(author?.username) && (
            <>By <Link to={`/users/${author.slug}`}>{author.username}</Link>{' '}</>
          )}
          {Boolean(group?.title) && (
            <>in <Link to={`/groups/${group.slug}`}>{group.title}</Link></>
          )}
          {' '}
          {hasMedia && <FontAwesomeIcon style={{ color: '#5BC8AF' }} icon="image" />}
          {' '}
          {!!commentsCount && <><FontAwesomeIcon style={{ color: '#5BC8AF' }} icon="comment" /> {commentsCount}</>}
        </span>
        <span>
          {dateToString(createdAt)}
        </span>
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
