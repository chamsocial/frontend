/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'


export const authFields = gql`
  fragment AuthFields on User {
    id
    slug
    bouncing
    username
  }
`
