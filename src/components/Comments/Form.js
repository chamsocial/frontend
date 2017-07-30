import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

export class CommentsForm extends Component {
  constructor (props) {
    super(props)

    this.state = { comment: '' }
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
    this.props.submitComment(this.state.comment)
  }

  render () {
    return <form onSubmit={this.sendComment}>
      <div className='form-group'>
        <textarea onChange={this.updateMessage} defaultValue='' />
      </div>
      <div className='form-group'>
        <button className='btn'>Send comment</button>
      </div>
    </form>
  }
}

const commentMutation = gql`
  mutation commentMutation($comment: String!, $postId: Int!) {
    createComment(comment: $comment, postId: $postId) {
      id
    }
  }
`

const CommentsFormWrapped = graphql(commentMutation, {
  props: ({ mutate, ownProps }) => ({
    submitComment: (comment) => {
      const variables = {
        postId: ownProps.postId,
        comment
      }
      return mutate({ variables }).then((res) => {
        console.log(res)
      })
      .catch(e => window.alert(e.message))
    }
  })
})(CommentsForm)

export default CommentsFormWrapped
