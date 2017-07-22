import ApolloClient, { createNetworkInterface } from 'apollo-client'

export const networkInterface = createNetworkInterface({ uri: process.env.REACT_APP_API_URL + '/graphql' })

export const client = new ApolloClient({ networkInterface })
