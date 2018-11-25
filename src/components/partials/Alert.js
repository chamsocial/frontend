import React from 'react'
import PropTypes from 'prop-types'
import './Alert.css'

function Alert({ type = '', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>
}
Alert.defaultProps = {
  type: '',
}
Alert.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export default Alert
