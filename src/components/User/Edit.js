import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import { Form, Text, Textarea, Select } from 'react-form'
import { editUserQuery, userFragment } from '../../graphql/user-queries'
import GraphLoader from '../partials/GraphLoader'
import Button from '../partials/Button'

class Edit extends Component {
  constructor (props) {
    super(props)

    this.submitUserEdits = this.submitUserEdits.bind(this)
  }

  submitUserEdits (values) {
    const variables = {
      first_name: values.first_name,
      last_name: values.last_name,
      jobtitle: values.jobtitle,
      interests: values.interests,
      aboutme: values.aboutme
    }
    this.props.updateUser(variables)
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
      onSubmit={this.submitUserEdits}
      validate={({ lang }) => ({
        lang: !lang ? 'Language is required' : undefined
      })}
    >
      {({ submitForm, getValue }) => {
        return (
          <form onSubmit={submitForm}>
            <h2>Edit your profile {user.username}</h2>
            <div className='row'>
              <div className='col'>
                <label htmlFor='first_name'>First name</label>
                <Text field='first_name' id='first_name' />
              </div>
              <div className='col'>
                <label htmlFor='last_name'>Last name</label>
                <Text field='last_name' id='last_name' />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <label htmlFor='jobtitle'>Jobtitle</label>
                <Text field='jobtitle' id='jobtitle' />
              </div>
              <div className='col'>
                <label htmlFor='lang'>Language</label>
                <Select field='lang' id='lang' options={[
                  { label: 'English', value: 'en' },
                  { label: 'Français', value: 'fr' }
                ]} />
              </div>
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
              <Button type='submit'>Update</Button>
            </div>
          </form>
        )
      }}
    </Form>
  }
}

const userProfileMutation = gql`
  mutation userProfileMutation(
    $slug: String!, $first_name: String, $last_name: String,
    $jobtitle: String, $lang: String, $interests: String, $aboutme: String
  ) {
    updateUser(
      slug: $slug, first_name: $first_name, last_name: $last_name,
      jobtitle: $jobtitle, lang: $lang, interests: $interests, aboutme: $aboutme
    ) {
      ...UserFields
    }
  }
  ${userFragment}
`

const loadEdit = GraphLoader(Edit)
const graphEdit = compose(
  graphql(editUserQuery, {
    options: (data) => ({ variables: { slug: data.slug } })
  }),
  graphql(userProfileMutation, {
    props: ({ mutate, ownProps }) => ({
      updateUser: (variables) => {
        variables.slug = ownProps.slug
        return mutate({ variables })
      }
    })
  })
)(loadEdit)
const mapStateToProps = (state) => ({ user: state.auth.user })
const connectedEdit = connect(mapStateToProps)(graphEdit)
export default connectedEdit
