import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery } from '@apollo/client'
import FileUploader from './FileUploader'


const apiPath = process.env.REACT_APP_UPLOAD_URL
const GET_POST_MEDIA = gql`
  query getPostMediaQuery($postId: ID!) {
    postMedia(postId: $postId) {
      id
      url
    }
  }
`


function Upload({ createDraft, postId }) {
  const { loading, error, data } = useQuery(GET_POST_MEDIA, {
    skip: !postId,
    variables: { postId },
  })
  if (loading || error) return null
  const files = data && data.postMedia
    ? data.postMedia.map(f => ({ ...f, preview: `${apiPath}${f.url}` }))
    : []

  return <FileUploader files={files} createDraft={createDraft} postId={postId} />
}
Upload.defaultProps = {
  postId: null,
}
Upload.propTypes = {
  createDraft: PropTypes.func.isRequired,
  postId: PropTypes.string,
}


export default Upload
