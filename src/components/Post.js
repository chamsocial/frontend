import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { dateToString } from '../utils'
import Loading from './Loading'

function Comment ({ comment }) {
  const { created_at, content, author, comments } = comment
  let subComments = null
  if (comments && comments.length) {
    subComments = <div className='subcomments'>
      {comments.map(c => <Comment key={c.id} comment={c} />)}
    </div>
  }

  return <div>
    <div className='comment'>
      <div className='meta'>{ dateToString(created_at) } - {author.username}</div>
      {content}
    </div>
    {subComments}
  </div>
}

function Comments ({ comments }) {
  if (!comments.length) return <div>No comments</div>

  return <div>
    <h3>Comments</h3>
    {comments.map(comment => <Comment key={comment.id} comment={comment} />)}
  </div>
}

export function Post (props) {
  const { loading, post } = props.data
  if (loading) return <Loading />
  const { title, created_at, content, author, comments } = post
  return <div>
    <div className='Post-item'>
      <h1>{title}</h1>
      <div className='post-content' dangerouslySetInnerHTML={{ __html: content }} />
      <div className='meta'>
        { dateToString(created_at) }
        <a href='#Hmm' className='float-right'>{author.username}</a>
      </div>
    </div>
    <Comments comments={comments} />
  </div>
}

const postsQuery = gql`query postSingleQuery ($slug: String!) {
  post(slug: $slug) {
    title
    slug
    content
    created_at
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

export default graphql(postsQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(Post)
