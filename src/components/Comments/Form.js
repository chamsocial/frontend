import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { singlePostQuery } from '../../graphql/post-queries'

export class CommentsForm extends Component {
  constructor (props) {
    super(props)

    this.state = { comment: '', status: '' }
    this.updateMessage = this.updateMessage.bind(this)
    this.sendComment = this.sendComment.bind(this)
  }

  updateMessage (e) {
    const el = e.target
    if (el.scrollHeight > 98) {
      el.style.height = 0
      el.style.height = (el.scrollHeight) + 'px'
    }
    const val = el.value
    this.setState(() => ({ comment: val }))
  }

  sendComment (e) {
    e.preventDefault()
    this.setState(() => ({ status: 'loading' }))
    this.props.submitComment(this.state.comment)
      .then(res => {
        this.setState(() => ({ comment: '', status: 'sent' }))
        // @TODO scroll to comment
        setTimeout(() => {
          this.setState(() => ({ status: '' }))
        }, 1000)
      })
      .catch(e => window.alert(e.message))
  }

  render () {
    const { comment, status } = this.state
    let buttonText = 'Send comment'
    if (status === 'loading') buttonText = 'Saving..'
    if (status === 'sent') buttonText = 'Saved!'

    return <form onSubmit={this.sendComment}>
      <div className='form-group'>
        <textarea onChange={this.updateMessage} value={comment} />
      </div>
      <div className='form-group'>
        <button className='btn' disabled={(status === 'loading')}>{buttonText}</button>
      </div>
    </form>
  }
}

const commentMutation = gql`
  mutation commentMutation($comment: String!, $postSlug: String!) {
    createComment(comment: $comment, postSlug: $postSlug) {
      id
      created_at
      content
      author {
        id
        username
      }
    }
  }
`

const CommentsFormWrapped = graphql(commentMutation, {
  props: ({ mutate, ownProps }) => ({
    submitComment: (comment) => {
      const variables = {
        postSlug: ownProps.postSlug,
        comment
      }
      return mutate({ variables })
    }
  }),
  options: ({ postSlug }) => {
    return {
      update: (proxy, { data: { createComment } }) => {
        const data = proxy.readQuery({ query: singlePostQuery, variables: { slug: postSlug } })
        // @TODO reply to comment insert
        createComment.comments = null
        data.post.comments.push(createComment)
        proxy.writeQuery({ query: singlePostQuery, data, variables: { slug: postSlug } })
      }
    }
  }
})(CommentsForm)

export default CommentsFormWrapped
