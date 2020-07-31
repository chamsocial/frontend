import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'

function FourOhFour() {
  return (
    <div className="text-center box">
      <div style={{ fontSize: '70px', marginBottom: '20px', color: '#999' }}>
        <FontAwesomeIcon icon="map-signs" />
      </div>
      <h1>404 - Not found</h1>
      <p>
        You must have taken a wrong turn or hit an abandoned path.
      </p>
      <p>
        <Link to="/">Home</Link> | <Link to="/posts">Posts</Link> | <Link to="/signup">Signup</Link>
      </p>
    </div>
  )
}

export default FourOhFour
