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
    canEdit
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
  createdAt
  content
  parentId
  author {
    id
    username
  }
}
`
