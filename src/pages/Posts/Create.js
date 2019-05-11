import React, { Component } from 'react'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'

import Upload from './Upload'
import GroupSelect from './GroupSelect'
// import Drafts from './Drafts'
import Button from '../../components/partials/Button'


class CreatePostComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      postId: props.postId || null,
      title: props.draft.title || '',
      content: props.draft.content || '',
      group: null,
    }

    this.groupInput = React.createRef()

    this.update = this.update.bind(this)
    this.setGroup = this.setGroup.bind(this)
    this.unsetGroup = this.unsetGroup.bind(this)
    this.createDraft = this.createDraft.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(e) {
    e.preventDefault()
    console.log(this.state)
  }

  setGroup(group) {
    this.setState({ group })
  }

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
        {/* <Drafts /> */}
        <h1>Create post {postId}</h1>
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

const CreatePost = ({ postId }) => (
  <Query query={GET_DRAFT} skip={!postId} variables={{ postId }}>
    {({ loading, error, data }) => {
      if (loading || error) return 'Loading -ish'
      return (
        <Mutation mutation={CREATE_POST}>
          {(createPost, createData) => (
            <CreatePostComponent
              createPost={createPost}
              postId={postId}
              createData={createData}
              draft={data && data.draft}
            />
          )}
        </Mutation>
      )
    }}
  </Query>
)
CreatePost.defaultProps = {
  postId: null,
}
CreatePost.propTypes = {
  postId: PropTypes.string,
}

// const CreatePost = compose(
//   graphql(GET_DRAFT, {
//     name: 'getDraft',
//     skip: ({ postId }) => !postId,
//     options: ({ postId }) => ({ variables: { postId } }),
//   }),
//   graphql(CREATE_POST, {
//     props: ({ mutate }) => ({
//       createPost: variables => mutate({ variables }),
//     }),
//   }),
// )(Wrapper)

export default CreatePost
