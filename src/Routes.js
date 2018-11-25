import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import LazyLoad from './components/LazyLoad'
import { withAuth } from './components/Auth/AuthContext'

function Home({ match }) {
  return <LazyLoad getComponent={() => import('./components/Home')} {...match.params} />
}
function Login({ location }) {
  return <LazyLoad getComponent={() => import('./components/Auth/Login')} location={location} />
}
Login.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.any,
  }).isRequired,
}

function Signup({ location }) {
  return <LazyLoad getComponent={() => import('./components/Auth/Signup')} location={location} />
}
Signup.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.any,
  }).isRequired,
}
function Post({ match }) {
  return <LazyLoad getComponent={() => import('./components/Posts/Post')} {...match.params} />
}

function Activation({ match }) {
  return <LazyLoad getComponent={() => import('./components/Auth/Activation')} code={match.params.code} />
}
Activation.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      code: PropTypes.string,
    }),
  }).isRequired,
}

function UserProfile({ match }) {
  return <LazyLoad getComponent={() => import('./components/User/Profile')} {...match.params} />
}

function UserEdit({ match, history }) {
  return <LazyLoad getComponent={() => import('./components/User/Edit')} history={history} {...match.params} />
}

class Logout extends Component {
  componentWillUnmount() {
    const { auth } = this.props
    auth.logout()
  }

  render() {
    return <Redirect to={{ pathname: '/', state: {} }} />
  }
}
Logout.propTypes = {
  auth: PropTypes.shape({
    logout: PropTypes.func.isRequired,
  }).isRequired,
}
const LogoutMapped = withAuth(Logout)

const PrivateRoute = withAuth(({ component: RouteComponent, auth, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      auth.user ? (
        <RouteComponent {...props} />
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )
    )}
  />
))

const SomeComponent = withRouter(({ location }) => (
  <TransitionGroup className="transition-wrapper" exit={false}>
    <CSSTransition key={`css-${location.key}`} classNames="fade" timeout={300}>
      <div className="cham-route">
        <Switch key={location.key} location={location}>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/logout" component={LogoutMapped} />
          <Route exact path="/user/activate/:code" component={Activation} />
          <PrivateRoute exact path="/users/:slug" component={UserProfile} />
          <PrivateRoute exact path="/users/:slug/edit" component={UserEdit} />
          <PrivateRoute path="/posts/:slug" component={Post} />
          <Route exact path="/" component={Home} />
          <Route path="/page/:page" component={Home} />
        </Switch>
      </div>
    </CSSTransition>
  </TransitionGroup>
))

export default SomeComponent
