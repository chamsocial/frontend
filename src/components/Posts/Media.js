import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const apiUrl = process.env.REACT_APP_API_URL

export function PostMedia({ data }) {
  const { loading, error, postMedia } = data
  if (loading || error || !postMedia.length) return null

  return (
    <div>
      {postMedia.map(media => (
        <span key={media.id}>
          <img src={`${apiUrl}${media.url}`} alt="Media" width="200" />
        </span>
      ))}
    </div>
  )
}
PostMedia.propTypes = {
  data: PropTypes.shape({
    loading: PropTypes.bool,
  }).isRequired,
}


const GET_POST_MEDIA = gql`
  query postMediaQuery($postId: ID!) {
    postMedia(postId: $postId) {
      id
      url
    }
  }
`

export default graphql(GET_POST_MEDIA, {
  options: data => ({ variables: { postId: data.postId } }),
})(PostMedia)
