import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Link, Redirect } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import gql from 'graphql-tag'
import Button from '../../../components/partials/Button'
import GroupSelect from './GroupSelect'
import Upload from './Upload'


const CREATE_POST = gql`
  mutation createPostMutation($title: String! $content: String! $status: PostStatus $groupId: ID) {
    createPost(title: $title, content: $content, status: $status, groupId: $groupId) {
      id
      slug
      title
      content
    }
  }
`

const EDIT_POST = gql`
  mutation editPostMutation($id: ID! $title: String! $content: String! $status: PostStatus! $groupId: ID!) {
    editPost(id: $id, title: $title, content: $content, status: $status, groupId: $groupId) {
      id
      slug
      title
      content
    }
  }
`


function Form({
  draft, isDraft, deleteDraft, isEdit,
}) {
  const [redirect, setRedirect] = useState(null)
  const [state, setState] = useState(draft)
  const [createPost] = useMutation(CREATE_POST)
  const [editPost] = useMutation(EDIT_POST)

  function submitPost(status) {
    const variables = {
      title: state.title,
      content: state.content,
      status,
      groupId: state.group ? state.group.id : null,
    }
    if (state.id) {
      variables.id = state.id
      return editPost({ variables })
    }
    return createPost({ variables })
  }

  function submit(evt) {
    evt.preventDefault()
    submitPost('published')
      .then(({ data }) => {
        const slug = data.editPost ? data.editPost.slug : data.createPost.slug
        const message = isEdit ? 'The post has been updated' : 'The post has been published'
        setRedirect({ url: `/posts/${slug}`, message })
      })
  }

  const createDraft = async () => (
    submitPost('draft')
      .then(({ data }) => {
        const post = data.createPost
        setState(prevState => ({ ...prevState, id: post.id }))
        return post.id
      })
      .catch(err => {
        window.alert(`Error: ${err.toString()}`) // eslint-disable-line no-alert
        return null
      })
  )

  function onChange(evt) {
    setState({ ...state, [evt.target.id]: evt.target.value })
  }
  function setGroup(group) { setState({ ...state, group }) }
  function onDelete() {
    deleteDraft({ variables: { id: state.id } })
      .then(() => setState({ ...state, redirect: { pathname: '/', state: { flashMessage: 'Draft deleted!' } } }))
  }

  if (redirect) {
    return <Redirect to={{ pathname: redirect.url, state: { flashMessage: redirect.message } }} />
  }

  return (
    <form onSubmit={submit} className="narrow-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input className="input" value={state.title} id="title" onChange={onChange} required />
      </div>
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea id="content" onChange={onChange} value={state.content} required />
      </div>

      <div className="form-group">
        <GroupSelect group={state.group} setGroup={setGroup} />
      </div>

      <h4>Add images</h4>
      <Upload
        createDraft={createDraft}
        postId={draft.id}
      />

      <div className="form-group space-between">
        <Button type="submit">{ isDraft ? 'Publish' : 'Update' }</Button>
        {isDraft && (
          <button type="button" className="btn btn--warn" onClick={onDelete}>Delete draft</button>
        )}
        {!isDraft && draft.id && (
          <Link to={`/posts/${draft.slug}`} className="btn btn--warn">Cancel</Link>
        )}
      </div>
    </form>
  )
}
Form.defaultProps = {
  draft: { title: '', content: '' },
}
Form.propTypes = {
  isDraft: PropTypes.bool.isRequired,
  isEdit: PropTypes.bool.isRequired,
  deleteDraft: PropTypes.func.isRequired,
  draft: PropTypes.shape({
    title: PropTypes.string,
  }),
}

export default Form
