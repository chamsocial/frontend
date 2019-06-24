import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withRouter } from 'react-router-dom'

import Upload from './Upload'
import GroupSelect from './GroupSelect'
import Drafts from './Drafts'
import Button from '../../components/partials/Button'


class CreatePostComponent extends Component {
  constructor(props) {
    super(props)
    const draft = props.draft || {}
    this.state = {
      postId: props.postId || null,
      title: draft.title || '',
      content: draft.content || '',
      group: draft.group || null,
    }

    this.groupInput = React.createRef()

    this.update = this.update.bind(this)
    this.setGroup = this.setGroup.bind(this)
    this.unsetGroup = this.unsetGroup.bind(this)
    this.createDraft = this.createDraft.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.deleteCurrentDraft = this.deleteCurrentDraft.bind(this)
  }

  onSubmit(evt) {
    evt.preventDefault()
    const {
      postId, title, content, group,
    } = this.state
    const { editPost, createPost, history } = this.props

    let submitFn = createPost
    const variables = {
      title,
      content,
      status: 'published',
      groupId: group ? group.id : null,
    }
    if (postId) {
      submitFn = editPost
      variables.id = postId
    }

    submitFn({ variables })
      .then(({ data }) => history.push(`/posts/${data.editPost ? data.editPost.slug : data.createPost.slug}`))
      .catch(err => console.log('Edit error:', err))
  }

  setGroup(group) { this.setState({ group }) }

  createDraft() {
    const { title, content, postId } = this.state
    const { createPost } = this.props
    if (postId) return postId

    return createPost({ variables: { title, content, status: 'draft' } })
      .then(result => {
        this.setState({ postId: result.data.createPost.id })
        return result.data.createPost.id
      })
  }

  update(evt) {
    const { id, value } = evt.target
    this.setState({ [id]: value })
  }

  unsetGroup() {
    this.setState({ group: null }, () => {
      this.groupInput.current.focus()
    })
  }

  deleteCurrentDraft() {
    const { postId } = this.state
    const { deleteDraft, history } = this.props
    deleteDraft(postId)
      .then(() => history.push('/', { flashMessage: 'Draft deleted' }))
  }


  render() {
    const {
      title, content, group, postId,
    } = this.state
    const { draft, deleteDraft } = this.props
    const isPublised = draft.status === 'published'

    return (
      <form onSubmit={this.onSubmit} className="narrow-form">
        <h1>
          {!postId ? 'Create post' : `Edit ${isPublised ? 'post' : 'draft'}`}
        </h1>
        {!postId && <Drafts deleteDraft={deleteDraft} />}
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input value={title} id="title" onChange={this.update} required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea id="content" onChange={this.update} value={content} />
        </div>

        <h4>Add images</h4>
        <Upload
          createDraft={this.createDraft}
          postId={postId}
        />

        <div className="form-group">
          <GroupSelect
            group={group}
            setGroup={this.setGroup}
            unsetGroup={this.unsetGroup}
            groupInput={this.groupInput}
          />
        </div>

        <div className="form-group space-between">
          <Button type="submit">{ isPublised ? 'Update' : 'Publish' }</Button>
          {postId && !isPublised && (
            <button type="button" className="btn btn--warn" onClick={this.deleteCurrentDraft}>Delete draft</button>
          )}
        </div>
      </form>
    )
  }
}
CreatePostComponent.defaultProps = {
  postId: null,
  draft: {},
}
CreatePostComponent.propTypes = {
  createPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
  deleteDraft: PropTypes.func.isRequired,
  postId: PropTypes.string,
  draft: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}


/**
 * Loading wrapper
 */

const CreatePostQuery = ({ draftQuery, ...props }) => {
  if (draftQuery) {
    if (draftQuery.loading) return 'Loading -ish'
    if (draftQuery.error && draftQuery.error.graphQLErrors) {
      return draftQuery.error.graphQLErrors[0].message
    }
    if (draftQuery.error) return 'Nope'
  }
  return (
    <CreatePostComponent
      draft={draftQuery && draftQuery.draft}
      {...props}
    />
  )
}
CreatePostQuery.defaultProps = { draftQuery: undefined }
CreatePostQuery.propTypes = {
  draftQuery: PropTypes.shape({ loading: PropTypes.bool }),
}


/**
 * GraphQL queries and mutations
 */

const GET_DRAFT = gql`
  query getDraftQuery($postId: ID!) {
    draft(postId: $postId) {
      id
      title
      content
      status
      group {
        id
        title,
        description
      }
    }
  }
`

const CREATE_POST = gql`
  mutation createPostMutation($title: String! $content: String! $status: PostStatus $groupId: ID) {
    createPost(title: $title, content: $content, status: $status, groupId: $groupId) {
      id
      slug
    }
  }
`

const EDIT_POST = gql`
  mutation editPostMutation($id: ID! $title: String! $content: String! $status: PostStatus! $groupId: ID!) {
    editPost(id: $id, title: $title, content: $content, status: $status, groupId: $groupId) {
      id
      slug
    }
  }
`

const DELETE_DRAFT = gql`
  mutation deteleDraftMutation($id: ID!) {
    deleteDraft(id: $id)
  }
`


const CreatePost = compose(
  graphql(GET_DRAFT, { skip: ({ postId }) => !postId, name: 'draftQuery' }),
  graphql(CREATE_POST, { name: 'createPost' }),
  graphql(EDIT_POST, { name: 'editPost' }),
  graphql(DELETE_DRAFT, {
    props: ({ mutate }) => ({
      deleteDraft: id => mutate({ variables: { id }, refetchQueries: ['getDraftsQuery'] }),
    }),
  }),
)(withRouter(CreatePostQuery))

export default CreatePost
