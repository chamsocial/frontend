/* eslint-disable no-param-reassign */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from '@apollo/client/react/hoc'
import { gql } from '@apollo/client'
import { singlePostQuery } from '../../graphql/post-queries'


export class CommentsFormComponent extends Component {
  constructor(props) {
    super(props)

    this.state = { comment: '', status: '' }
    this.timeoutStatus = null
    this.updateMessage = this.updateMessage.bind(this)
    this.sendComment = this.sendComment.bind(this)
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutStatus)
  }

  updateMessage(e) {
    const el = e.target
    if (el.scrollHeight > 98) {
      el.style.height = 0
      el.style.height = `${el.scrollHeight}px`
    }
    const val = el.value
    this.setState(() => ({ comment: val }))
  }

  sendComment(e) {
    e.preventDefault()
    const { comment } = this.state
    const { submitComment, closeMe } = this.props

    this.setState(() => ({ status: 'loading' }))
    submitComment(comment)
      .then(() => {
        this.setState(() => ({ comment: '', status: 'sent' }))
        // @TODO scroll to comment
        this.timeoutStatus = setTimeout(() => closeMe(), 1500)
      })
      .catch(() => {
        this.setState(() => ({ status: '' }))
        window.alert('Could not save comment!') // eslint-disable-line no-alert
      })
  }

  render() {
    const { comment, status } = this.state
    let buttonText = 'Send comment'
    if (status === 'loading') buttonText = 'Saving..'
    if (status === 'sent') {
      return <div className="alert alert--success">The comment has been added!</div>
    }

    return (
      <form onSubmit={this.sendComment}>
        <div className="form-group">
          <textarea onChange={this.updateMessage} value={comment} className="textarea--small" />
        </div>
        <div>
          <button type="submit" className="btn" disabled={(status === 'loading' || comment.length < 3)}>
            {buttonText}
          </button>
        </div>
      </form>
    )
  }
}
CommentsFormComponent.defaultProps = {
  closeMe: () => {},
}
CommentsFormComponent.propTypes = {
  submitComment: PropTypes.func.isRequired,
  closeMe: PropTypes.func,
}


const commentMutation = gql`
  mutation commentMutation($comment: String!, $postSlug: String!, $parentId: ID) {
    createComment(comment: $comment, postSlug: $postSlug, parentId: $parentId) {
      id
      createdAt
      content
      parentId
      author {
        id
        username
      }
    }
  }
`


const CommentsForm = graphql(commentMutation, {
  props: ({ mutate, ownProps }) => ({
    submitComment: comment => {
      const variables = {
        postSlug: ownProps.postSlug,
        comment,
        parentId: ownProps.parentId,
      }
      return mutate({ variables })
    },
  }),
  options: ({ postSlug }) => (
    {
      refetchQueries: [{
        query: singlePostQuery,
        variables: { slug: postSlug },
      }],
    }
  ),
})(CommentsFormComponent)

export default CommentsForm
