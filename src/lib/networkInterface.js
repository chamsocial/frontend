import { networkInterface } from './apollo'
import store from './store'

networkInterface.use([{ applyMiddleware (req, next) {
  if (!req.options.headers) req.options.headers = {}
  const state = store.getState()
  const token = state.auth.token

  if (token) {
    req.options.headers.authorization = `Bearer ${token}`
  }
  next()
}}])

// Apollo invalid responses
networkInterface.useAfter([{
  applyAfterware ({ response }, next) {
    if (response.status === 401) {
      window.location = '/logout'
    }
    next()
  }
}])
