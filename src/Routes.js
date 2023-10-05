import React, { useEffect, lazy, Suspense } from 'react'
import {
  Route, Routes, Navigate, useLocation,
} from 'react-router-dom'
import CSSTransition from 'react-transition-group/CSSTransition'
import TransitionGroup from 'react-transition-group/TransitionGroup'
import Loading from './components/partials/Loading'
import { useAuthState, useAuthDispatch } from './components/Auth/context'

// Pages
const Home = lazy(() => import('./pages/Home'))

// Auth
const Login = lazy(() => import('./pages/Auth/Login'))
const ForgotPassword = lazy(() => import('./pages/Auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/Auth/ResetPassword'))
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
const Bookmarks = lazy(() => import('./pages/User/Bookmarks'))
const PostsCommented = lazy(() => import('./pages/User/PostsCommented'))


// Private messages
const MessageList = lazy(() => import('./pages/Messages/List'))
const MessageView = lazy(() => import('./pages/Messages/View'))
const MessageCreate = lazy(() => import('./pages/Messages/Create/New'))
const MessageSendTo = lazy(() => import('./pages/Messages/Create/SendTo'))

// General routes
const About = lazy(() => import('./pages/General/About'))
const Blog = lazy(() => import('./pages/Blog/List'))
const BlogPost = lazy(() => import('./pages/Blog/Single'))

const MapQuarantine = lazy(() => import('./pages/Map/Quarantine'))
const AllowedOutside = lazy(() => import('./pages/Map/AllowedOutside'))


function PrivateRoute({ component: Component, ...rest }) {
  const { user } = useAuthState()
  if (!user) return <Navigate to={{ pathname: '/login', state: { from: rest.location } }} />
  return <Component {...rest} />
}


function ChamRoutes() {
  const location = useLocation()
  return (
    <TransitionGroup className="transition-wrapper" exit={false}>
      <CSSTransition key={`css-${location.key}`} classNames="fade" timeout={300}>
        <div className="cham-route">
          <Suspense fallback={<Loading />}>
            <Routes key={location.key} location={location}>
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/forgot-password" element={<ForgotPassword />} />
              <Route exact path="/reset-password/:token" element={<ResetPassword />} />
              <Route exact path="/signup" element={<Signup />} />
              <Route exact path="/logout" element={<Logout />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/contact" element={<About />} />
              <Route exact path="/map/quarantine" element={<MapQuarantine />} />
              <Route exact path="/curfew/am-i-allowed-outside" element={<AllowedOutside />} />
              <Route exact path="/users/activate/:code" element={<Activation />} />

              <Route exact path="/users/emails" element={<PrivateRoute component={UserEmailSettings} />} />
              <Route exact path="/users/edit" element={<PrivateRoute component={UserEdit} />} />
              <Route exact path="/users/bookmarks" element={<PrivateRoute component={Bookmarks} />} />
              <Route exact path="/users/posts-comments" element={<PrivateRoute component={PostsCommented} />} />
              <Route exact path="/users/:slug" element={<PrivateRoute component={UserProfile} />} />

              <Route exact path="/posts/create" element={<PrivateRoute component={CreatePost} />} />
              <Route exact path="/posts/:postId/edit" element={<PrivateRoute component={CreatePost} />} />
              <Route exact path="/posts/:slug" element={<PrivateRoute component={Post} />} />

              <Route exact path="/messages/new" element={<PrivateRoute component={MessageCreate} />} />
              <Route exact path="/messages/to/:slug" element={<PrivateRoute component={MessageSendTo} />} />
              <Route exact path="/messages/:threadId" element={<PrivateRoute component={MessageView} />} />
              <Route exact path="/messages" element={<PrivateRoute component={MessageList} />} />

              {/* Blog */}
              <Route exact path="/blog" element={<Blog />} />
              <Route exact path="/blog/:slug" element={<BlogPost />} />

              <Route exact path="/" element={<Home />} />
              <Route path="/posts" element={<PostList />} />
              <Route path="/groups/:groupSlug" element={<GroupList />} />
              <Route element={<FourOhFour />} />
            </Routes>
          </Suspense>
        </div>
      </CSSTransition>
    </TransitionGroup>
  )
}


export default ChamRoutes
