import gql from 'graphql-tag'

export const x = 'y'
export const singlePostQuery = gql`query postSingleQuery ($slug: String!) {
  post(slug: $slug) {
    id
    title
    slug
    content
    createdAt
    commentsCount
    author {
      id
      slug
      username
    }
    comments {
      ...CommentParts
      comments {
        ...CommentParts
        comments {
          ...CommentParts
          comments {
            ...CommentParts
            comments {
              ...CommentParts
              comments {
                ...CommentParts
                comments {
                  ...CommentParts
                  comments {
                    ...CommentParts
                    comments {
                      ...CommentParts
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
fragment CommentParts on Comment {
  id
  created_at
  content
  parent_id
  author {
    id
    username
  }
}
`
