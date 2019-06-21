import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { dateToString } from '../../utils'
import Loading from '../partials/Loading'
import Comments from '../Comments'
import Media from './Media'
import { singlePostQuery } from '../../graphql/post-queries'

export function Post({ data }) {
  const { loading, error, post } = data
  if (loading || error) return <Loading error={error} />
  const {
    title, createdAt, content, author, comments, canEdit,
  } = post

  return (
    <div>
      <div className="Post-item">
        <h1>{title}</h1>
        <div className="post-content">
          <ReactMarkdown source={content} />
        </div>
        <Media postId={post.id} />
        {canEdit && <Link to={`/posts/${post.id}/edit`}>Edit</Link>}
        <div className="meta">
          {dateToString(createdAt)}
          <Link to={`/users/${author.slug}`} className="float-right">{author.username}</Link>
        </div>
      </div>
      <Comments postSlug={post.slug} comments={comments} />
    </div>
  )
}
Post.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
  }).isRequired,
}

export default graphql(singlePostQuery, {
  options: data => ({ variables: { slug: data.slug } }),
})(Post)
