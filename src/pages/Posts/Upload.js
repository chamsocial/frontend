import React, { useReducer, memo } from 'react'
import PropTypes from 'prop-types'
import { compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Dropzone from 'react-dropzone'
// import Dropzone from 'react-dropzone-uploader'
import request from 'superagent'

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_UPLOAD':
      return { ...state, uploads: [...state.uploads, action.file] }
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.files] }
    case 'UPDATE_FILE':
      return { ...state, uploads: [...state.uploads] }
    case 'FILE_UPLOADED': {
      const uploads = state.uploads.filter(file => file.id !== action.id)
      return { ...state, files: [...state.files, action.file], uploads }
    }
    default:
      throw new Error()
  }
}
const apiPath = process.env.REACT_APP_API_URL

function UploadComponent(props) {
  const { createDraft, postId, files } = props
  const [state, dispatch] = useReducer(reducer, { files, uploads: [] })

  console.log(postId, state)
  async function onDrop(newFiles) {
    let id = postId
    if (!postId) id = await createDraft()
    // console.log('Upload', id, postId)

    const uploads = newFiles.map(file => {
      const preview = URL.createObjectURL(file)
      const item = {
        preview,
        id: preview.split('/').pop(),
        name: file.name,
        progress: 0,
      }
      dispatch({ type: 'ADD_UPLOAD', file: item })

      return request
        .post(`${process.env.REACT_APP_API_URL}/upload/${id}`)
        .withCredentials()
        .attach('file', file)
        .on('progress', e => {
          console.log('Percentage done: ', e.percent)
          item.progress = e.percent
          dispatch({ type: 'UPDATE_FILE', file: item })
        })
        .then(({ body }) => {
          const file = body
          file.url = `${apiPath}${file.url}`
          dispatch({ type: 'FILE_UPLOADED', file, id: item.id })
          console.log('Resp', body)
        })
    })

    return Promise.all(uploads)
  }

  return (
    <Dropzone
      minSize={1024}
      maxSize={5242880}
      accept="image/png, image/gif"
      onDrop={onDrop}
    >
      {({ getRootProps, getInputProps, ...other }) => (
        <section>
          {/* {console.log(other)} */}
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag & drop some files here, or click to select files</p>
            <div>
              {state.files.map(file => (
                <div key={file.id}>
                  <img src={file.url} width="30" alt="preview" />
                </div>
              ))}
              {state.uploads.map(file => (
                <div key={file.id}>
                  <img src={file.preview} width="100" alt="preview" />
                  {file.progress}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
UploadComponent.defaultProps = {
  postId: null,
  files: [],
}
UploadComponent.propTypes = {
  createDraft: PropTypes.func.isRequired,
  postId: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
}

const GET_POST_MEDIA = gql`
  query getPostMediaQuery($postId: ID!) {
    postMedia(postId: $postId) {
      id
      url
    }
  }
`

const MediaWrapper = ({ getMedia, ...props }) => {
  if (getMedia.loading || getMedia.error) return 'Loading or error!'
  const files = getMedia.postMedia.map(f => ({ ...f, url: `${apiPath}${f.url}` }))
  return <UploadComponent files={files} {...props} />
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
