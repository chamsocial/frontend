import React from 'react'
import PropTypes from 'prop-types'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import Modal from 'components/Modal'
import { dateToString } from '../../../utils'
import Loading from '../../../components/partials/Loading'
import Comments from '../../../components/Comments'
import Media from '../../../components/Posts/Media'
import { singlePostQuery } from '../../../graphql/post-queries'
import DeletePost from './DeletePost'
import PrivateMessageForm from './components/PrivateMessageForm'
// import PostReply from './components/PostReply'


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
    <div className="layout--narrow">
      <div className="box box--padded box--row">
        <h1>{post.title}</h1>
        <div className="meta">
          {dateToString(post.createdAt)}
        </div>
        <hr />
        <div className="post-content markdown-content">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
        <Media postId={post.id} />
        {post.canEdit && (
          <>
            <Link to={`/posts/${post.id}/edit`}>Edit</Link>
            {' '}|{' '}
            <DeletePost postId={post.id} />
          </>
        )}
        <div className="space-between flex-end">
          <div className="meta">
            By <Link to={`/users/${post.author.slug}`}>{post.author.username}</Link>
            {' '}in <Link to={`/groups/${post.group.slug}`}>{post.group.title}</Link>
          </div>
          <Modal
            activator={({ openModal }) => (
              <button type="button" onClick={openModal} className="btn btn--secondary">
                Private message
              </button>
            )}
          >
            {({ closeModal }) => (
              <PrivateMessageForm post={post} postSlug={post.slug} closeFn={closeModal} />
            )}
          </Modal>
        </div>
      </div>
      {/* <div className="box box--row">
        <PostReply post={post} />
      </div> */}
      <div className="box box--padded">
        <Comments postSlug={post.slug} comments={post.comments} />
      </div>
    </div>
  )
}
Post.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
}


export default Post
