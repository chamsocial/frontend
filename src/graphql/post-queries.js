/* eslint-disable import/prefer-default-export */
import { gql } from '@apollo/client'


export const singlePostQuery = gql`query postSingleQuery ($slug: String!) {
  post(slug: $slug) {
    id
    title
    slug
    content
    createdAt
    commentsCount
    canEdit
    group {
      id
      slug
      title
    }
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
    slug
    username
  }
}
`
