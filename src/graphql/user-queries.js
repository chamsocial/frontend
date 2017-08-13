import gql from 'graphql-tag'

export const profileQuery = gql`query userQuery ($slug: String!) {
  user(slug: $slug) {
    id
    slug
    username
    first_name
    last_name
    company_name
    interests
    aboutme
    jobtitle
    avatarpath
    posts {
      id
      title
      slug
      created_at
      comments_count
    }
  }
}`

export const editUserQuery = gql`query editUserQuery ($slug: String!) {
  user(slug: $slug) {
    id
    slug
    username
    first_name
    last_name
    company_name
    interests
    aboutme
    jobtitle
    avatarpath
  }
}`
