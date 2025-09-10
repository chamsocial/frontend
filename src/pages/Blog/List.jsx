import { gql, useQuery } from '@apollo/client'
import Loading from 'components/partials/Loading'
import React from 'react'
import { Link } from 'react-router-dom'
import { dateToString } from 'utils'

const BLOG_LIST = gql`query blogQuery {
  blog {
    id
    title
    slug
    createdAt
    author {
      id
      username
      slug
    }
  }
}`

export default function BlogList() {
  const { loading, error, data } = useQuery(BLOG_LIST)
  if (loading || error) return <Loading error={error} />

  return (
    <>
      <h1>Blog List</h1>
      {data.blog.map(blog => (
        <div className="post-list__item" key={blog.id}>
          <h2>
            <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h2>
          <div className="meta post-meta space-between">
            <div>
              {Boolean(blog.author?.username) && (
                <>By <Link to={`/users/${blog.author.slug}`}>{blog.author.username}</Link>{' '}</>
              )}
            </div>
            <div className="center-items">
              {dateToString(blog.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </>
  )
}


