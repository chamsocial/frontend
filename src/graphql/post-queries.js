/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag'


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
