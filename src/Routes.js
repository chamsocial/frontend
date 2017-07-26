import React, { Component } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { connect } from 'react-redux'
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
function mapLogoutDispatch (dispatch) {
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

const Transition = ({ children, ...props }) => (
  <CSSTransition {...props} classNames='fade' timeout={300}>
    <div className='cham-route'>{children}</div>
  </CSSTransition>
)

const SomeComponent = withRouter(({ location }) => (
  <TransitionGroup className='transition-wrapper' exit={false}>
    <Transition key={`css-${location.key}`}>
      <Switch key={location.key} location={location}>
        <Route exact path='/login' component={Login} />
        <Route exact path='/logout' component={LogoutMapped} />
        <Route path='/posts/:slug' component={Post} />
        <Route exact path='/' component={Home} />
        <Route path='/page/:page' component={Home} />
      </Switch>
    </Transition>
  </TransitionGroup>
))

export default SomeComponent
