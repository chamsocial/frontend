import React from 'react'
import PropTypes from 'prop-types'
import { useMutation, gql } from '@apollo/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const TOOGLE_BOOKMARK = gql`mutation toggleBookmarkMutation( $postId: ID!, $bookmarked: Boolean! ) {
  toggleBookmark(postId: $postId, bookmarked: $bookmarked)
}`


function Bookmark({ postId, bookmarkedAt }) {
  const [toggleBookmarkMutation, { loading, data }] = useMutation(TOOGLE_BOOKMARK)
  const isBookmarked = data?.toggleBookmark ?? !!bookmarkedAt

  function toggleBookmark() {
    if (loading) return
    toggleBookmarkMutation({
      variables: { postId, bookmarked: !isBookmarked },
    })
  }

  return (
    <button
      type="button"
      className={`btn--link btn--bookmark ${isBookmarked ? 'is-bookmarked' : ''}`}
      title="Bookmark post"
      onClick={toggleBookmark}
    >
      <FontAwesomeIcon icon="bookmark" />
    </button>
  )
}
Bookmark.defaultProps = {
  bookmarkedAt: undefined,
}
Bookmark.propTypes = {
  postId: PropTypes.string.isRequired,
  bookmarkedAt: PropTypes.string,
}


export default Bookmark
