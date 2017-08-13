import gql from 'graphql-tag'

export const profileQuery = gql`query userQuery ($slug: String!) {
  user(slug: $slug) {
    id
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
