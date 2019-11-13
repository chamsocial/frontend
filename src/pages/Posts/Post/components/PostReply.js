import React, { useState } from 'react'
import PropTypes from 'prop-types'
import CommentsForm from 'components/Comments/Form'
import PrivateMessageForm from './PrivateMessageForm'

function PostReply({ post }) {
  const [form, setForm] = useState('')

  let Form = () => null
  if (form === 'comment') Form = CommentsForm
  if (form === 'PM') Form = PrivateMessageForm

  return (
    <>
      <div className="block space-between">
        <button type="button" onClick={() => setForm('comment')} className="btn">
          Write a comment
        </button>
        {' '}
        <button type="button" onClick={() => setForm('PM')} className="btn btn--secondary">
          Send private message
        </button>
      </div>
      <Form post={post} postSlug={post.slug} />
    </>
  )
}
PostReply.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
}


export default PostReply
