import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './github-icon.svg'


const Footer = () => (
  <div className="container">
    <div className="footer">
      <span>
        &copy; ChamSocial {(new Date()).getFullYear()}
      </span>
      <span>
        <a href="https://github.com/chamsocial" target="_blank" rel="noreferrer noopener">
          <img src={Logo} alt="Github.com" style={{ width: '16px' }} />
        </a>
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
