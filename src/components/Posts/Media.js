import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const apiUrl = process.env.REACT_APP_API_URL
const fileUrl = process.env.REACT_APP_FILE_URL
const portalDom = document.getElementById('portals')


export function PostMedia({ data }) {
  const [img, setImg] = useState(null)
  const { loading, error, postMedia } = data
  if (loading || error || !postMedia.length) return null
  const lastIndex = postMedia.length - 1

  const onClick = (isImage, image) => evt => {
    if (!isImage) return
    evt.preventDefault()
    setImg(image)
  }

  function getNextImage(index) {
    const nextIndex = lastIndex === index ? 0 : index + 1
    const item = postMedia[nextIndex]
    if (item.type !== 'image') return getNextImage(nextIndex)
    return item
  }

  function nextImage(evt) {
    evt.stopPropagation()
    const currentIndex = postMedia.findIndex(image => image.id === img.id)
    const nextItem = getNextImage(currentIndex)
    setImg(nextItem)
  }

  function getPrevImage(index) {
    const nextIndex = index === 0 ? lastIndex : index - 1
    const item = postMedia[nextIndex]
    if (item.type !== 'image') return getPrevImage(nextIndex)
    return item
  }

  function previousImage(evt) {
    evt.stopPropagation()
    const currentIndex = postMedia.findIndex(image => image.id === img.id)
    const nextItem = getPrevImage(currentIndex)
    setImg(nextItem)
  }

  return (
    <div className="post-media">
      {img && (
        ReactDOM.createPortal((
          <div className="lightbox" onClick={() => setImg(null)}>{/* eslint-disable-line */}
            <img src={`${fileUrl}${img.url}`} alt="Big version" />
            {postMedia.length > 1 && (
              <>
                <button type="button" className="lightbox--nav lightbox--prev" onClick={previousImage}>
                  <FontAwesomeIcon icon="angle-left" />
                </button>
                <button type="button" className="lightbox--nav lightbox--next" onClick={nextImage}>
                  <FontAwesomeIcon icon="angle-right" />
                </button>
              </>
            )}
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
            onClick={onClick(isImage, media)}
          >
            {isImage && <img src={`${apiUrl}/thumb/${media.userId}/200/200/${media.filename}`} alt="Media" />}
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
      filename
      userId
      type
    }
  }
`

export default graphql(GET_POST_MEDIA, {
  options: data => ({ variables: { postId: data.postId }, fetchPolicy: 'cache-and-network' }),
})(PostMedia)
