import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { gql, useMutation } from '@apollo/client'


const DELETE_POST = gql`mutation deletePostMutation( $id: ID! ) {
  deletePost(id: $id)
}`


function DeletePost({ postId }) {
  const [deletePost, { loading, data }] = useMutation(DELETE_POST)
  function onClick() {
    const deleteIt = window.confirm('Are you sure?') // eslint-disable-line no-alert
    if (!deleteIt) return
    deletePost({ variables: { id: postId } })
      .catch(() => window.alert('Somthing went wrong.')) // eslint-disable-line no-alert
  }

  if (data && data.deletePost) {
    return <Redirect to={{ pathname: '/', state: { flashMessage: 'Post deleted.' } }} />
  }

  return (
    <button type="button" disabled={loading} className="btn--link" onClick={onClick}>Delete</button>
  )
}
DeletePost.propTypes = {
  postId: PropTypes.string.isRequired,
}


export default DeletePost
