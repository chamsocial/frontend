import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import Home from './components/Home'
import LazyLoad from './components/LazyLoad'


export default function Routes () {
  return <Switch>
    <Route exact path='/' render={() => {
      return <LazyLoad getComponent={() => import('./components/Home')} />
    }} />
  </Switch>
}
