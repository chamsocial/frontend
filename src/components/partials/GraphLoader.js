import React from 'react'
import Loading from './Loading'

function GraphLoader(GraphComponent) {
  return function LoadGraphql(props) {
    const { data } = props
    const { loading, error } = data
    if (loading || error) return <Loading error={error} />
    return <GraphComponent {...props} />
  }
}

export default GraphLoader
