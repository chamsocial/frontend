import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const apiUrl = process.env.REACT_APP_API_URL
const fileUrl = process.env.REACT_APP_FILE_URL
const portalDom = document.getElementById('portals')


export function PostMedia({ data }) {
  const [img, setImg] = useState()
  const { loading, error, postMedia } = data
  if (loading || error || !postMedia.length) return null

  const onClick = isImage => evt => {
    if (!isImage) return
    evt.preventDefault()
    setImg(evt.currentTarget.href)
  }

  return (
    <div className="post-media">
      {img && (
        ReactDOM.createPortal((
          <div className="lightbox" onClick={() => setImg('')}>{/* eslint-disable-line */}
            <img src={img} alt="Big version" />
          </div>
        ), portalDom)
      )}
      {postMedia.map(media => {
        const isImage = media.type === 'image'
        return (
          <a
            key={media.id}
            className={`media ${!isImage ? 'media--link' : ''}`}
            href={`${fileUrl}${media.url}`}
            onClick={onClick(isImage)}
          >
            {isImage && <img src={`${apiUrl}/img/200/200${media.url}`} alt="Media" />}
            {!isImage && 'View file'}
          </a>
        )
      })}
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
      type
    }
  }
`

export default graphql(GET_POST_MEDIA, {
  options: data => ({ variables: { postId: data.postId } }),
})(PostMedia)
