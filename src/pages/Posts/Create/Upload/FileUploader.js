import React, { useReducer } from 'react'
import PropTypes from 'prop-types'
import { useMutation } from 'react-apollo'
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
    case 'UPLOAD_FAILED': {
      const files = state.files.filter(file => file.tmpId !== action.file.tmpId)
      return { ...state, files }
    }
    case 'DELETED_FILE': {
      const files = state.files.filter(file => file.id !== action.fileId)
      return { ...state, files }
    }
    default:
      throw new Error()
  }
}


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

function FileUploader({ files, createDraft, postId }) {
  const [state, dispatch] = useReducer(reducer, { files })
  const [uploadFile] = useMutation(UPLOAD_FILE)
  const [deleteFileMutation] = useMutation(DELETE_FILE)

  function deleteFile(fileId) {
    return () => (
      deleteFileMutation({ variables: { fileId } })
        .then(() => dispatch({ type: 'DELETED_FILE', fileId }))
        .catch(err => console.log('delete err', err))
    )
  }

  async function onDrop(newFiles) {
    let id = postId
    if (!id) id = await createDraft()
    if (!id) return null

    const uploads = newFiles.map(async file => {
      const preview = URL.createObjectURL(file)
      const item = {
        preview,
        tmpId: preview.split('/').pop(),
      }
      dispatch({ type: 'ADD_FILE', file: item })

      try {
        const resp = await uploadFile({ variables: { file, postId: id } })
        const uploadedFile = resp.data.uploadFile
        uploadedFile.preview = `${apiPath}${uploadedFile.url}`
        uploadedFile.tmpId = item.tmpId
        dispatch({ type: 'FILE_UPLOADED', file: uploadedFile })
      } catch (err) {
        console.log('ERROR', err)
        dispatch({ type: 'UPLOAD_FAILED', file: item })
      }
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
FileUploader.defaultProps = {
  postId: null,
}
FileUploader.propTypes = {
  createDraft: PropTypes.func.isRequired,
  postId: PropTypes.string,
}


export default FileUploader
