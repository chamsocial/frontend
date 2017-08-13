import React from 'react'
import Loading from './Loading'

function GraphLoader (GraphComponent) {
  return function (props) {
    const { loading, error } = props.data
    if (loading || error) return <Loading error={error} />
    return <GraphComponent {...props} />
  }
}

export default GraphLoader
