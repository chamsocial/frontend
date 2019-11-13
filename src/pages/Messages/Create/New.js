import React from 'react'
import { Link } from 'react-router-dom'
import Form from './Form'


function FromPost() {
  return (
    <div className="box">
      <div className="space-between">
        <h1>New private message</h1>
        <span><Link to="/messages" className="btn">Back</Link></span>
      </div>
      <Form />
    </div>
  )
}


export default FromPost
