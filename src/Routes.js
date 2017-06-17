import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import Home from './components/Home'
import LazyLoad from './components/LazyLoad'

function Home ({ match }) {
  return <LazyLoad getComponent={() => import('./components/Home')} {...match.params} />
}

export default function Routes () {
  return <Switch>
    <Route exact path='/' render={Home} />
    <Route path='/page/:page' render={Home}/>
  </Switch>
}
