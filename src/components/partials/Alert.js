import React from 'react'
import './Alert.css'

function Alert ({ type = '', children }) {
  return <div className={`alert alert-${type}`}>{children}</div>
}

export default Alert
