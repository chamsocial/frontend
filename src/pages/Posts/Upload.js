import React, { useReducer, memo } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const apiPath = process.env.REACT_APP_API_URL


function preventAllEvents(e) {
  e.preventDefault()
  e.stopPropagation()
}


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
    case 'DELETED_FILE': {
      const files = state.files.filter(file => file.id !== action.fileId)
      return { ...state, files }
    }
    default:
      throw new Error()
  }
}


function UploadComponent(props) {
  const {
    createDraft, postId, files, uploadFile,
  } = props
  const [state, dispatch] = useReducer(reducer, { files })

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

  const deleteFile = fileId => evt => {
    evt.preventDefault()
    props.deleteFile({ variables: { fileId } })
      .then(() => dispatch({ type: 'DELETED_FILE', fileId }))
      .catch(err => console.log('delete err', err))
  }

  return (
    <Dropzone
      minSize={1024}
      maxSize={5242880}
      accept="image/png, image/gif, image/jpg, image/jpeg"
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps, isDragAccept }) => {
        let classes = ''
        if (state.files.length) classes += ' uploader--has-files'
        if (isDragAccept) classes += ' uploader--can-drop'
        return (
          <div {...getRootProps()} className={`uploader ${classes}`}>
            <input {...getInputProps()} />
            <div className="uploader__desc">
              Drop files or <span>browse</span> to upload.
            </div>
            {!!state.files.length && (
              <div className="uploader__files" onClick={preventAllEvents}>{/* eslint-disable-line */}
                {state.files.map(file => (
                  <div key={file.tmpId || file.id} className="uploader__file">
                    <div>
                      <img src={file.preview} alt="preview" />
                      {!file.id && <div className="uploader__file__loading" />}
                      {file.id && (
                        <button type="button" className="uploader__close" onClick={deleteFile(file.id)}>
                          <FontAwesomeIcon icon="times-circle" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      }}
    </Dropzone>
  )
}
UploadComponent.defaultProps = {
  postId: null,
}
UploadComponent.propTypes = {
  createDraft: PropTypes.func.isRequired,
  uploadFile: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  postId: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })).isRequired,
}


const MediaWrapper = ({ getMedia, ...props }) => {
  if (getMedia && (getMedia.loading || getMedia.error)) return 'Loading or error!'
  const files = getMedia
    ? getMedia.postMedia.map(f => ({ ...f, preview: `${apiPath}${f.url}` }))
    : []
  return (
    <UploadComponent files={files} {...props} />
  )
}
MediaWrapper.defaultProps = {
  getMedia: null,
}
MediaWrapper.propTypes = {
  getMedia: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
  }),
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
const DELETE_FILE = gql`
  mutation deleteFile($fileId: ID!) {
    deleteFile(id: $fileId)
  }
`


const Upload = compose(
  graphql(UPLOAD_FILE, { name: 'uploadFile' }),
  graphql(DELETE_FILE, { name: 'deleteFile' }),
  graphql(GET_POST_MEDIA, {
    name: 'getMedia',
    skip: ({ postId }) => !postId,
    options: ({ postId }) => ({ variables: { postId } }),
  }),
)(MediaWrapper)

export default memo(Upload)
