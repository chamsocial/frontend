import React, { useReducer, memo } from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
// import Dropzone from 'react-dropzone-uploader'
import request from 'superagent'

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FILE':
      return { files: [...state.files, action.file] }
    default:
      throw new Error()
  }
}

function Upload({ createDraft, postId, files }) {
  const [state, dispatch] = useReducer(reducer, { files })

  console.log(postId, state)
  async function onDrop(newFiles) {
    let id = postId
    if (!postId) id = await createDraft()
    console.log('Upload', id, postId)
    const upload = request
      .post(`${process.env.REACT_APP_API_URL}/upload/${id}`)
      .withCredentials()
    newFiles.forEach(file => {
      upload.attach('file', file)
      const preview = URL.createObjectURL(file)
      const item = {
        preview,
        id: preview.split('/').pop(),
        name: file.name,
      }
      dispatch({ type: 'ADD_FILE', file: item })
    })
    upload.on('progress', e => console.log('Percentage done: ', e.percent))
      .then(() => console.log('Doen?'))
    return upload
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
                  <img src={file.preview} width="100" alt="preview" />
                  {file.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </Dropzone>
  )
}
Upload.defaultProps = {
  postId: null,
  files: [],
}
Upload.propTypes = {
  createDraft: PropTypes.func.isRequired,
  postId: PropTypes.string,
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
}

export default memo(Upload)
