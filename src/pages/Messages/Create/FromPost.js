import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from 'react-apollo'
import Loading from 'components/partials/Loading'
import Form from './Form'


const GET_POST = gql`query postMessageQuery($slug: String!) {
  post(slug: $slug) {
    id
    title
    author {
      id
      username
    }
  }
}`

function FromPost({ match }) {
  const { slug } = match.params
  const { loading, error, data } = useQuery(GET_POST, { variables: { slug } })
  if (loading || error) return <Loading error={error} />

  const { post } = data

  return (
    <div className="box">
      <Link to={`/posts/${slug}`} className="btn">Back</Link>
      <Form subject={`Reply to: ${post.title}`} users={[post.author]} />
    </div>
  )
}
FromPost.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string,
    }),
  }).isRequired,
}

export default FromPost
