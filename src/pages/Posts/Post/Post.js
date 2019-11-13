import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { dateToString } from '../../../utils'
import Loading from '../../../components/partials/Loading'
import Comments from '../../../components/Comments'
import Media from '../../../components/Posts/Media'
import { singlePostQuery } from '../../../graphql/post-queries'
import DeletePost from './DeletePost'
import PostReply from './components/PostReply'

export function Post({ data }) {
  const { loading, error, post } = data
  if (error && error.message.includes('NO_POSTS_FOUND')) {
    return <div className="box text-center"><h1>No post found</h1></div>
  }
  if (loading || error) return <Loading error={error} />
  const {
    title, createdAt, content, author, comments, canEdit,
  } = post

  return (
    <>
      <div className="box box--padded box--row">
        <h1>{title}</h1>
        <hr />
        <div className="post-content">
          <ReactMarkdown source={content} />
        </div>
        <Media postId={post.id} />
        {canEdit && (
          <>
            <Link to={`/posts/${post.id}/edit`}>Edit</Link>
            {' '}|{' '}
            <DeletePost postId={post.id} />
          </>
        )}
        <div className="meta">
          {dateToString(createdAt)}
          <Link to={`/users/${author.slug}`} className="float-right">{author.username}</Link>
        </div>
      </div>
      <div className="box box--row">
        <PostReply post={post} />
      </div>
      <div className="box box--padded">
        <Comments postSlug={post.slug} comments={comments} />
      </div>
    </>
  )
}
Post.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
  }).isRequired,
}

export default graphql(singlePostQuery, {
  options: data => ({ variables: { slug: data.match.params.slug } }),
})(Post)
