import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { Form, Text, Textarea, Select } from 'react-form'
import { editUserQuery } from '../../graphql/user-queries'
import GraphLoader from '../partials/GraphLoader'
import Button from '../partials/Button'

class Edit extends Component {
  constructor (props) {
    super(props)

    this.submitUser = this.submitUser.bind(this)
  }

  submitUser (values) {
    console.log(values)
  }

  render () {
    const { props } = this
    const { user } = props.data
    if (!user || props.user.id !== user.id) {
      const to = {
        pathname: `/users/${props.user.slug}/`,
        state: { flashMessage: `You are not allowed to edit ${props.slug}'s' profile but here is yours` }
      }
      return <Redirect to={to} />
    }

    return <Form
      defaultValues={user}
      onSubmit={this.submitUser}
      validate={({ username, email, password }) => ({
        email: !email ? 'Email is required' : undefined
      })}
    >
      {({ submitForm, getValue }) => {
        return (
          <form onSubmit={submitForm}>
            <h2>Edit your profile {user.username}</h2>
            <div className='form-group'>
              <label htmlFor='first_name'>First name</label>
              <Text field='first_name' id='first_name' />
            </div>
            <div className='form-group'>
              <label htmlFor='last_name'>Last name</label>
              <Text field='last_name' id='last_name' />
            </div>
            <div className='form-group'>
              <label htmlFor='jobtitle'>Jobtitle</label>
              <Text field='jobtitle' id='jobtitle' />
            </div>
            <div className='form-group'>
              <label htmlFor='interests'>Interests</label>
              <Textarea field='interests' id='interests' />
            </div>
            <div className='form-group'>
              <label htmlFor='aboutme'>About me</label>
              <Textarea field='aboutme' id='aboutme' />
            </div>
            <div className='form-group'>
              <label htmlFor='lang'>Lang</label>
              <Select field='lang' id='lang' options={[
                { label: 'English', value: 'en' },
                { label: 'Français', value: 'fr' }
              ]} />
            </div>
            <div className='form-group'>
              <Button type='submit'>Update.</Button>
            </div>
          </form>
        )
      }}
    </Form>
  }
}

const loadEdit = GraphLoader(Edit)
const graphEdit = graphql(editUserQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(loadEdit)
const mapStateToProps = (state) => ({ user: state.auth.user })
const connectedEdit = connect(mapStateToProps)(graphEdit)
export default connectedEdit
