import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Loading from 'components/partials/Loading'
import { dateToString } from 'utils'

const BLOG_POST = gql`query blogPostQuery($slug: String!) {
  blogPost(slug: $slug) {
    id
    title
    markdown
    createdAt
    author {
      id
      username
      slug
    }
  }
}`

export default function BlogList() {
  const { slug } = useParams()
  const { loading, error, data } = useQuery(BLOG_POST, { variables: { slug } })
  if (loading || error) return <Loading error={error} />
  const blog = data.blogPost

  return (
    <div className="blog-post">
      <h1>{blog.title}</h1>
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
      <br />
      <div className="post-content markdown-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.markdown}</ReactMarkdown>
      </div>
    </div>
  )
}


