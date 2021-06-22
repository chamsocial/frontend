/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'


export const authFields = gql`
  fragment AuthFields on User {
    id
    slug
    bouncing
    username
  }
`
