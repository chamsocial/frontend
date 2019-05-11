import { ApolloClient } from 'apollo-client'
// import { createHttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createUploadLink } from 'apollo-upload-client'

const { REACT_APP_API_URL } = process.env

const apollo = {
  client: {},
  resetAll() {
    apollo.client.resetStore()
    apollo.client.cache.reset()
  },
}

/**
 * Create cache
 */
const cache = new InMemoryCache()


/**
 * Create Apollo HTTP Link
 */
const httpLink = createUploadLink({
  uri: `${REACT_APP_API_URL}/graphql`,
  credentials: 'include',
})

/**
 * Handle HTTP errors
 */
const errorLink = onError(({ networkError }) => {
  if (networkError && networkError.result) {
    console.log(networkError.result.errors[0])
    // if (networkError.result.errors.find(e => e.extensions.code === 'UNAUTHENTICATED')) {
    //   apollo.resetAll()
    // }
  }
})


/**
 * Create the Apollo client
 */
const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    httpLink,
  ]),
  cache,
})
apollo.client = client


/**
 * Default export
 */
export default apollo
