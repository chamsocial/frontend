import React from 'react'
import PropTypes from 'prop-types'
import { gql, useQuery, useMutation } from '@apollo/client'
import Loading from 'components/partials/Loading'
import Form from './Form'
import Drafts from './Drafts'


const GET_POST_EDIT = gql`
  query getPostEditQuery($postId: ID!) {
    draft(postId: $postId) {
      id
      title
      content
      slug
      status
      group {
        id
        title,
        description
      }
    }
  }
`
const DELETE_DRAFT = gql`
  mutation deteleDraftMutation($id: ID!) {
    deletePost(id: $id)
  }
`


function CreatePost({ match }) {
  const { postId } = match.params
  const [deleteDraft] = useMutation(DELETE_DRAFT)
  const { loading, error, data } = useQuery(GET_POST_EDIT, {
    skip: !postId,
    variables: { postId },
  })
  if (loading || error) return <Loading error={error} />
  const isDraft = !!(data && data.draft && data.draft.status === 'draft')
  const isEdit = !!(!isDraft && data && data.draft)

  return (
    <div className="box layout--narrow">
      <h1>{!postId ? 'Create Post' : `Edit ${isDraft ? 'draft' : 'post'}`}</h1>
      {!postId && <Drafts deleteDraft={deleteDraft} />}
      <Form
        draft={data && data.draft}
        isDraft={isDraft}
        isEdit={isEdit}
        deleteDraft={deleteDraft}
      />
    </div>
  )
}
CreatePost.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      postId: PropTypes.string,
    }),
  }).isRequired,
}


export default CreatePost
