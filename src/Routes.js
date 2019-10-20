import React, { useContext, lazy, Suspense } from 'react'
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Loading from './components/partials/Loading'
import { authContext } from './components/Auth/AuthContext'

// Pages
const Home = lazy(() => import('./pages/Home'))

// Auth
const Login = lazy(() => import('./pages/Auth/Login'))
const Signup = lazy(() => import('./pages/Auth/Signup'))
const Activation = lazy(() => import('./pages/Auth/Activation'))
function Logout() {
  const auth = useContext(authContext)
  auth.logout()
  return <Loading />
}

// Post routes
const Post = lazy(() => import('./pages/Posts/Post'))
// const CreatePost = lazy(() => import('./pages/Posts/Create'))
const CreatePost = () => <div className="box"><h1>Create posts coming soon!</h1></div>

// User routes
const UserProfile = lazy(() => import('./pages/User/Profile'))
const UserEdit = lazy(() => import('./pages/User/Edit'))
const UserEmailSettings = lazy(() => import('./pages/User/EmailSettings'))


function PrivateRoute({ component: Component, ...rest }) {
  const auth = useContext(authContext)
  if (!auth.user) return <Redirect to={{ pathname: '/login', state: { from: rest.location } }} />
  return <Route {...rest} component={Component} />
}


const SomeComponent = withRouter(({ location }) => (
  <TransitionGroup className="transition-wrapper" exit={false}>
    <CSSTransition key={`css-${location.key}`} classNames="fade" timeout={300}>
      <div className="cham-route">
        <Suspense fallback={<Loading />}>
          <Switch key={location.key} location={location}>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/user/activate/:code" component={Activation} />
            <PrivateRoute exact path="/users/emails" component={UserEmailSettings} />
            <PrivateRoute exact path="/users/edit" component={UserEdit} />
            <PrivateRoute exact path="/users/:slug" component={UserProfile} />
            <PrivateRoute exact path="/posts/create" component={CreatePost} />
            <PrivateRoute exact path="/posts/:postId/edit" component={CreatePost} />
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
