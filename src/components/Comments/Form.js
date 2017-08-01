import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { singlePostQuery } from '../../graphql/post-queries'

export class CommentsForm extends Component {
  constructor (props) {
    super(props)

    this.state = { comment: '', status: '' }
    this.timeoutStatus = null
    this.updateMessage = this.updateMessage.bind(this)
    this.sendComment = this.sendComment.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutStatus)
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
    const { closeMe = () => {} } = this.props

    this.setState(() => ({ status: 'loading' }))
    this.props.submitComment(this.state.comment)
      .then(res => {
        this.setState(() => ({ comment: '', status: 'sent' }))
        // @TODO scroll to comment
        this.timeoutStatus = setTimeout(() => {
          this.setState(() => ({ status: '' }))
          closeMe()
        }, 2000)
      })
      .catch(e => {
        this.setState(() => ({ status: '' }))
        window.alert('Could not save comment!')
      })
  }

  render () {
    const { comment, status } = this.state
    let buttonText = 'Send comment'
    if (status === 'loading') buttonText = 'Saving..'
    if (status === 'sent') buttonText = 'Comment added!'

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
  mutation commentMutation($comment: String!, $postSlug: String!, $parentId: Int) {
    createComment(comment: $comment, postSlug: $postSlug, parentId: $parentId) {
      id
      created_at
      content
      parent_id
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
        postSlug: 'asdfsadfasdfashfasvdjfasvfjasvfjsav',
        comment,
        parentId: ownProps.parentId
      }
      return mutate({ variables })
    }
  }),
  options: ({ postSlug, parentId }) => {
    return {
      update: (proxy, { data: { createComment } }) => {
        const data = proxy.readQuery({ query: singlePostQuery, variables: { slug: postSlug, parentId } })
        createComment.comments = null
        data.post.comments_count++
        if (createComment.parent_id) {
          loopComments(data.post.comments, createComment)
        } else {
          data.post.comments.push(createComment)
        }

        proxy.writeQuery({ query: singlePostQuery, data, variables: { slug: postSlug } })
      }
    }
  }
})(CommentsForm)

function loopComments (comments, newComment) {
  for (const comment of comments) {
    if (comment.id === newComment.parent_id) {
      if (!comment.comments) comment.comments = []
      comment.comments.push(newComment)
      break
    } else if (comment.comments && comment.comments.length) {
      loopComments(comment.comments, newComment)
    }
  }
}

export default CommentsFormWrapped
