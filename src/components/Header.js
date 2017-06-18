import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

export function Header ({ user }) {
  return <div className='App-header'>
    <div className='container header'>
      <h2 className='logo'>
      <Link to='/'>Chamsocial</Link>
      </h2>
      <div>
        {user
          ? <Link to='/logout'>Logout</Link>
          : <Link to='/login'>Login</Link>
        }
      </div>
    </div>
  </div>
}

// Map Redux state to component props
function mapStateToProps(state) {
  return { user: state.user }
}

// Connected Component
export default connect(mapStateToProps)(Header)
