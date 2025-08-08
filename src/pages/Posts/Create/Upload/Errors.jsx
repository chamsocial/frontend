import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ONE_KB, TEN_MB, readableBytes } from './utils'


function InvalidFile({ files }) {
  return (
    <>
      <h4>Can&apos;t upload the file{files.length > 1 ? 's' : ''}:</h4>
      <hr />
      {files.map((file, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={i}>
          <p>
            <strong>Name:</strong> {file.name}<br />
            <strong>Size:</strong> {readableBytes(file.size)}<br />
            <strong>Type</strong> {file.type}
          </p>
          <hr />
        </div>
      ))}
      <h5>Requirements:</h5>
      <p>
        &bull; Only images are allowed. <small>(jpeg, jpg, gif, png)</small>
        <br />
        &bull; File size has to be between {readableBytes(ONE_KB)} and {readableBytes(TEN_MB)}
      </p>
    </>
  )
}
InvalidFile.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    size: PropTypes.number,
    type: PropTypes.string,
  })).isRequired,
}


function Errors({ error, setError }) {
  let content = 'Upload error'
  if (error.code === 'INVALID_FILE') content = <InvalidFile files={error.files} />
  return (
    <div className="alert alert--danger">
      <button type="button" className="alert__close" onClick={() => setError('')}>
        <FontAwesomeIcon icon="times" />
      </button>
      {content}
    </div>
  )
}
Errors.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.string,
  }).isRequired,
  setError: PropTypes.func.isRequired,
}


export default Errors
