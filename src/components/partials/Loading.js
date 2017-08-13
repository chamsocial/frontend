import React from 'react'
import './Loading.css'

function LoadingError () {
  return <div className='loading'>
    <div className='loading-error-icon'>⚠︎</div>
    <div className='loading-error-text'>An error occured while loading, please reload.</div>
  </div>
}

export default function Loading ({ error }) {
  if (error) return <LoadingError />
  return <div className='loading'>
    <div className='loading-icon' />
    <div className='loading-text'>Loading...</div>
  </div>
}
