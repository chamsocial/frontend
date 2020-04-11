import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from 'react-apollo'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { dateToString } from '../../../utils'
import Loading from '../../../components/partials/Loading'
import Comments from '../../../components/Comments'
import Media from '../../../components/Posts/Media'
import { singlePostQuery } from '../../../graphql/post-queries'
import DeletePost from './DeletePost'
import PostReply from './components/PostReply'


export function Post({ match }) {
  const { loading, error, data } = useQuery(singlePostQuery, {
    variables: { slug: match.params.slug },
    fetchPolicy: 'network-only',
  })
  if (error && error.message.includes('NO_POSTS_FOUND')) {
    return <div className="box text-center"><h1>No post found</h1></div>
  }
  if (loading || error) return <Loading error={error} />
  const { post } = data

  return (
    <>
      <div className="box box--padded box--row">
        <h1>{post.title}</h1>
        <hr />
        <div className="post-content">
          <ReactMarkdown source={post.content} />
        </div>
        <Media postId={post.id} />
        {post.canEdit && (
          <>
            <Link to={`/posts/${post.id}/edit`}>Edit</Link>
            {' '}|{' '}
            <DeletePost postId={post.id} />
          </>
        )}
        <div className="meta">
          {dateToString(post.createdAt)}
          <Link to={`/users/${post.author.slug}`} className="float-right">{post.author.username}</Link>
        </div>
      </div>
      <div className="box box--row">
        <PostReply post={post} />
      </div>
      <div className="box box--padded">
        <Comments postSlug={post.slug} comments={post.comments} />
      </div>
    </>
  )
}
Post.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
}


export default Post
