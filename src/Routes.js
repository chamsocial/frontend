import React, { Component, lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import LazyLoad from './components/LazyLoad'
import { withAuth } from './components/Auth/AuthContext'

const Home = lazy(() => import('./components/Home'))
const Login = lazy(() => import('./components/Auth/Login'))

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
  return <LazyLoad getComponent={() => import('./components/Auth/Activation')} {...match.params} />
}

function UserProfile({ match }) {
  return <LazyLoad getComponent={() => import('./components/User/Profile')} {...match.params} />
}

function UserEdit({ match }) {
  return <LazyLoad getComponent={() => import('./components/User/Edit')} {...match.params} />
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
        <Suspense fallback={<div>Loading...</div>}>
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
        </Suspense>
      </div>
    </CSSTransition>
  </TransitionGroup>
))

export default SomeComponent
