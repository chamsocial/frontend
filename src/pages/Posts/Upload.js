import React, { useReducer, memo } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FILE':
      return { ...state, files: [...state.files, action.file] }
    case 'UPDATE_FILE':
      return { ...state, files: [...state.files] }
    case 'FILE_UPLOADED': {
      const files = state.files.filter(file => file.tmpId !== action.file.tmpId)
      return { ...state, files: [...files, action.file] }
    }
    default:
      throw new Error()
  }
}
const apiPath = process.env.REACT_APP_API_URL

function UploadComponent(props) {
  const {
    createDraft, postId, files, uploadFile
  } = props
  const [state, dispatch] = useReducer(reducer, { files })

  console.log('Upload', postId, state)
  async function onDrop(newFiles) {
    let id = postId
    if (!postId) id = await createDraft()

    const uploads = newFiles.map(file => {
      const preview = URL.createObjectURL(file)
      const item = {
        preview,
        tmpId: preview.split('/').pop(),
      }
      dispatch({ type: 'ADD_FILE', file: item })

      return uploadFile({ variables: { file, postId: id } })
        .then(({ data }) => {
          const uploadedFile = data.uploadFile
          uploadedFile.preview = `${apiPath}${uploadedFile.url}`
          uploadedFile.tmpId = item.tmpId
          dispatch({ type: 'FILE_UPLOADED', file: uploadedFile })
        })
        .catch(e => console.log('E up', e))
    })

    return Promise.all(uploads)
  }

  return (
    <Dropzone
      minSize={1024}
      maxSize={5242880}
      accept="image/png, image/gif, image/jpg, image/jpeg"
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps }) => (
        <div className="uploader">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="uploader__desc">
              Drop files or <span>browse</span> to upload.
            </div>
          </div>
          {!!state.files.length && (
            <div className="uploader__files">
              {state.files.map(file => (
                <div key={file.tmpId || file.id} className="uploader__file">
                  <img src={file.preview} alt="preview" />
                  {!file.id && <div className="uploader__file__loading" />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Dropzone>
  )
}
UploadComponent.defaultProps = {
  postId: null,
}
UploadComponent.propTypes = {
  createDraft: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  postId: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
}

const GET_POST_MEDIA = gql`
  query getPostMediaQuery($postId: ID!) {
    postMedia(postId: $postId) {
      id
      url
    }
  }
`

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!, $postId: ID!) {
    uploadFile(file: $file, postId: $postId) {
      id
      url
    }
  }
`

const MediaWrapper = ({ getMedia, ...props }) => {
  if (getMedia.loading || getMedia.error) return 'Loading or error!'
  const files = getMedia.postMedia.map(f => ({ ...f, preview: `${apiPath}${f.url}` }))
  return (
    <Mutation mutation={UPLOAD_FILE}>
      {uploadFile => (
        <UploadComponent uploadFile={uploadFile} files={files} {...props} />
      )}
    </Mutation>
  )
}
MediaWrapper.propTypes = {
  getMedia: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }).isRequired,
}


const Upload = compose(
  graphql(GET_POST_MEDIA, {
    name: 'getMedia',
    options: () => ({ variables: { postId: '75797' } }),
  }),
)(MediaWrapper)

export default memo(Upload)
