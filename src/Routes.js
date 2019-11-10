import React, { useEffect, lazy, Suspense } from 'react'
import {
  Route, Switch, withRouter, Redirect,
} from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Loading from './components/partials/Loading'
import { useAuthState, useAuthDispatch } from './components/Auth/context'

// Pages
const Home = lazy(() => import('./pages/Home'))

// Auth
const Login = lazy(() => import('./pages/Auth/Login'))
const Signup = lazy(() => import('./pages/Auth/Signup'))
const Activation = lazy(() => import('./pages/Auth/Activation'))
function Logout() {
  const authDispatch = useAuthDispatch()
  useEffect(() => {
    authDispatch({ type: 'logout' })
  }, [authDispatch])
  return <Loading />
}
const FourOhFour = lazy(() => import('./pages/Auth/FourOhFour'))

// Post routes
const Post = lazy(() => import('./pages/Posts/Post'))
const PostList = lazy(() => import('./pages/Posts/List/List'))
const GroupList = lazy(() => import('./pages/Posts/List/Group'))
const CreatePost = lazy(() => import('./pages/Posts/Create'))
// const CreatePost = () => <div className="box"><h1>Create posts coming soon!</h1></div>

// User routes
const UserProfile = lazy(() => import('./pages/User/Profile'))
const UserEdit = lazy(() => import('./pages/User/Edit'))
const UserEmailSettings = lazy(() => import('./pages/User/EmailSettings'))

// Private messages
const MessageList = lazy(() => import('./pages/Messages/List'))
const MessageView = lazy(() => import('./pages/Messages/View'))
const MessageCreateFromPost = lazy(() => import('./pages/Messages/Create/FromPost'))

// General routes
const About = lazy(() => import('./pages/General/About'))


function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuthState()
  if (!user) return <Redirect to={{ pathname: '/login', state: { from: rest.location } }} />
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
            <Route exact path="/about" component={About} />
            <Route exact path="/contact" component={About} />
            <Route exact path="/users/activate/:code" component={Activation} />
            <PrivateRoute exact path="/users/emails" component={UserEmailSettings} />
            <PrivateRoute exact path="/users/edit" component={UserEdit} />
            <PrivateRoute exact path="/users/:slug" component={UserProfile} />
            <PrivateRoute exact path="/posts/create" component={CreatePost} />
            <PrivateRoute exact path="/posts/:postId/edit" component={CreatePost} />
            <PrivateRoute exact path="/posts/:slug" component={Post} />
            <PrivateRoute exact path="/messages/:threadId" component={MessageView} />
            <PrivateRoute exact path="/messages/post/:slug" component={MessageCreateFromPost} />
            <PrivateRoute exact path="/messages" component={MessageList} />
            <Route exact path="/" component={Home} />
            <Route path="/posts" component={PostList} />
            <Route path="/groups/:groupSlug" component={GroupList} />
            <Route component={FourOhFour} />
          </Switch>
        </Suspense>
      </div>
    </CSSTransition>
  </TransitionGroup>
))


export default SomeComponent
