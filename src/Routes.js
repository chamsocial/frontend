import React, { Component } from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import { connect } from 'react-redux'
import { withApollo } from 'react-apollo'
import LazyLoad from './components/LazyLoad'

function Home ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Home')} {...match.params} />
}
function Login ({ location }) {
  return <LazyLoad getComponent={() => import('./components/Auth/Login')} location={location} />
}
function Signup ({ location }) {
  return <LazyLoad getComponent={() => import('./components/Auth/Signup')} location={location} />
}
function Post ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Posts/Post')} {...match.params} />
}

function Activation ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Auth/Activation')} {...match.params} />
}

// Map Redux actions to component props
function mapLogoutDispatch (dispatch) {
  return {
    logout: () => dispatch({ type: 'USER_LOGOUT' })
  }
}

class Logout extends Component {
  componentWillUnmount () {
    const { logout } = this.props
    this.props.client.resetStore()
    logout()
  }
  render () { return <Redirect to={{ pathname: '/', state: {} }} /> }
}
const LogoutMapped = connect(null, mapLogoutDispatch)(withApollo(Logout))

const Transition = ({ children, ...props }) => (
  <CSSTransition {...props} classNames='fade' timeout={300}>
    <div className='cham-route'>{children}</div>
  </CSSTransition>
)

function mapStateToProps (state) {
  return {
    isLoggedIn: !!state.auth.user
  }
}

const PrivateRoute = connect(mapStateToProps)(({ component: Component, isLoggedIn, ...rest }) => (
  <Route {...rest} render={props => (
    isLoggedIn ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }} />
    )
  )} />
))

const SomeComponent = withRouter(({ location }) => (
  <TransitionGroup className='transition-wrapper' exit={false}>
    <Transition key={`css-${location.key}`}>
      <Switch key={location.key} location={location}>
        <Route exact path='/login' component={Login} />
        <Route exact path='/signup' component={Signup} />
        <Route exact path='/logout' component={LogoutMapped} />
        <Route exact path='/user/activate/:code' component={Activation} />
        <PrivateRoute path='/posts/:slug' component={Post} />
        <Route exact path='/' component={Home} />
        <Route path='/page/:page' component={Home} />
      </Switch>
    </Transition>
  </TransitionGroup>
))

export default SomeComponent
