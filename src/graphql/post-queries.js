import gql from 'graphql-tag'

export const singlePostQuery = gql`query postSingleQuery ($slug: String!) {
  post(slug: $slug) {
    id
    title
    slug
    content
    created_at
    comments_count
    author {
      id
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
  author {
    id
    username
  }
}
`
