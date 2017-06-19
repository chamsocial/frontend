import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import LazyLoad from './components/LazyLoad'

function Home ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Home')} {...match.params} />
}
function Login () {
  return <LazyLoad getComponent={() => import('./components/Login')} />
}

function Post ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Post')} {...match.params} />
}

// Map Redux actions to component props
function mapLogoutDispatch(dispatch) {
  return {
    logout: () => dispatch({ type: 'logout' })
  }
}

class Logout extends Component {
  componentDidMount () {
    const { logout, history } = this.props
    logout()
    history.push('/')
  }
  render () { return null }
}
const LogoutMapped = connect(null, mapLogoutDispatch)(withRouter(Logout))

export default function Routes () {
  return <Switch>
    <Route exact path='/login' component={Login} />
    <Route exact path='/logout' component={LogoutMapped} />
    <Route path='/posts/:slug' component={Post} />
    <Route exact path='/' component={Home} />
    <Route path='/page/:page' component={Home}/>
  </Switch>
}
