import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import Home from './components/Home'
import LazyLoad from './components/LazyLoad'

function Home ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Home')} {...match.params} />
}
function Login () {
  return <LazyLoad getComponent={() => import('./components/Login')} />
}

export default function Routes () {
  return <Switch>
    <Route exact path='/login' component={Login} />
    <Route exact path='/' component={Home} />
    <Route path='/page/:page' component={Home}/>
  </Switch>
}
