import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'

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
  headers: {
    'Apollo-Require-Preflight': true,
  },
})

/**
 * Handle HTTP errors
 */
const errorLink = onError(({ networkError }) => {
  if (networkError && networkError.result) {
    console.log(networkError.result.errors[0]) // eslint-disable-line no-console
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
