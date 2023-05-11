import React, { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { gql, useQuery } from '@apollo/client'

const apiUrl = process.env.REACT_APP_API_URL
const fileUrl = process.env.REACT_APP_FILE_URL
const portalDom = document.getElementById('portals')


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


function PostMedia({ postMedia }) {
  const [img, setImg] = useState(null)
  const lastIndex = postMedia.length - 1

  const getNextImage = useCallback(index => {
    const nextIndex = lastIndex === index ? 0 : index + 1
    const item = postMedia[nextIndex]
    if (item.type !== 'image') return getNextImage(nextIndex)
    return item
  }, [lastIndex, postMedia])

  const nextImage = useCallback(evt => {
    evt.stopPropagation()
    evt.preventDefault()
    const currentIndex = postMedia.findIndex(image => image.id === img.id)
    const nextItem = getNextImage(currentIndex)
    setImg(nextItem)
  }, [getNextImage, img?.id, postMedia])

  const getPrevImage = useCallback(index => {
    const nextIndex = index === 0 ? lastIndex : index - 1
    const item = postMedia[nextIndex]
    if (item.type !== 'image') return getPrevImage(nextIndex)
    return item
  }, [lastIndex, postMedia])
  const previousImage = useCallback(evt => {
    evt.preventDefault()
    evt.stopPropagation()
    const currentIndex = postMedia.findIndex(image => image.id === img.id)
    const nextItem = getPrevImage(currentIndex)
    setImg(nextItem)
  }, [getPrevImage, img?.id, postMedia])

  const openImgGallery = (isImage, image) => evt => {
    if (!isImage) return
    evt.preventDefault()
    setImg(image)
  }
  const closeImgGallery = evt => {
    evt.preventDefault()
    setImg(null)
  }

  useEffect(() => {
    if (!img) return undefined
    const keyPress = evt => {
      switch (evt.key) {
        case 'Left': // IE/Edge specific value
        case 'ArrowLeft':
          return nextImage(evt)
        case 'Right': // IE/Edge specific value
        case 'ArrowRight':
          return previousImage(evt)
        case 'Esc': // IE/Edge specific value
        case 'Escape':
          return closeImgGallery(evt) // eslint-disable-line no-use-before-define
        default:
          return null // Quit when this doesn't handle the key event.
      }
    }
    document.addEventListener('keydown', keyPress)
    return () => document.removeEventListener('keydown', keyPress)
  }, [img, nextImage, previousImage])

  return (
    <div className="post-media">
      {img && (
        ReactDOM.createPortal(
          (
          <div className="lightbox" onClick={closeImgGallery}>{/* eslint-disable-line */}
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
          ), portalDom,
        )
      )}
      {postMedia.map(media => {
        const isImage = media.type === 'image'
        return (
          <a
            key={media.id}
            className={`media ${!isImage ? 'media--link' : ''}`}
            href={`${fileUrl}${media.url}`}
            onClick={openImgGallery(isImage, media)}
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
  postMedia: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
  })).isRequired,
}


function PostMediaWrapper({ postId }) {
  const { loading, error, data } = useQuery(GET_POST_MEDIA, {
    variables: { postId }, fetchPolicy: 'cache-and-network',
  })
  if (loading || error || !data || !data.postMedia.length) return null

  return <PostMedia postMedia={data.postMedia} />
}
PostMediaWrapper.propTypes = {
  postId: PropTypes.string.isRequired,
}


export default PostMediaWrapper
