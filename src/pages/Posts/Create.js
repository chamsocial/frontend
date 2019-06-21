import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query, compose, graphql } from 'react-apollo'

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
  }

  onSubmit(evt) {
    evt.preventDefault()
    const {
      postId, title, content, group,
    } = this.state
    const { editPost, createPost } = this.props

    let submitFn = createPost
    const variables = {
      title,
      content,
      status: 'published',
    }
    if (postId) {
      submitFn = editPost
      variables.id = postId
      variables.groupId = group.id
    }

    submitFn({ variables })
      .then(resp => console.log('Edit publish:', resp))
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

  render() {
    const {
      title, content, group, postId,
    } = this.state

    console.log('Create props', this.props)

    return (
      <form onSubmit={this.onSubmit} className="narrow-form">
        {!postId && 1 === 0 && <Drafts />}
        <h1>
          {!postId ? 'Create post' : `Editing draft: ${postId}`}
        </h1>
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

        <div className="form-group">
          <Button type="submit">Publish</Button>
          {postId && <Button type="submit">Discard draft</Button>}
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
  postId: PropTypes.string,
  draft: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
}


const GET_DRAFT = gql`
  query getDraftQuery($postId: ID!) {
    draft(postId: $postId) {
      id
      title
      content
      group {
        id
        title,
        description
      }
    }
  }
`

const CREATE_POST = gql`
  mutation createPostMutation($title: String! $content: String! $status: PostStatus) {
    createPost(title: $title, content: $content, status: $status) {
      id
    }
  }
`

const EDIT_POST = gql`
  mutation editPostMutation($id: ID! $title: String! $content: String! $status: PostStatus! $groupId: ID!) {
    editPost(id: $id, title: $title, content: $content, status: $status, groupId: $groupId) {
      id
    }
  }
`

const CreatePostQuery = ({ postId, createPost, editPost }) => (
  <Query query={GET_DRAFT} skip={!postId} variables={{ postId }}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading -ish'
      if (error && error.graphQLErrors) return error.graphQLErrors[0].message
      if (error) return 'Nope'
      return (
        <CreatePostComponent
          createPost={createPost}
          editPost={editPost}
          postId={postId}
          draft={data && data.draft}
        />
      )
    }}
  </Query>
)
CreatePostQuery.defaultProps = {
  postId: null,
}
CreatePostQuery.propTypes = {
  postId: PropTypes.string,
  createPost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired,
}

const CreatePost = compose(
  graphql(CREATE_POST, { name: 'createPost' }),
  graphql(EDIT_POST, { name: 'editPost' }),
)(CreatePostQuery)

export default CreatePost
