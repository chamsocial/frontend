import React from 'react'
import { Link } from 'react-router-dom'


const Footer = () => (
  <div className="container">
    <div className="footer">
      <span>
        &copy; ChamSocial 2019
      </span>
      <span>
        <Link to="/about">About</Link>
        {' '}|{' '}
        <Link to="/contact">Contact</Link>
      </span>
    </div>
  </div>
)


export default Footer
