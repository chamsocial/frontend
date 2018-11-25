import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Form, Text, Textarea, Select,
} from 'react-form'
import GraphLoader from '../partials/GraphLoader'
import Button from '../partials/Button'
import { withAuth } from '../Auth/AuthContext'

class Edit extends Component {
  constructor(props) {
    super(props)

    this.submitUserEdits = this.submitUserEdits.bind(this)
  }

  submitUserEdits(values) {
    const { updateUser } = this.props
    const variables = {
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
      jobtitle: values.jobtitle,
      interests: values.interests,
      aboutme: values.aboutme,
      lang: values.lang,
    }
    updateUser(variables)
  }

  render() {
    const { data, auth } = this.props
    const { user } = data
    if (!user || user.id !== auth.user.id) {
      const to = {
        pathname: `/users/${user.slug}/`,
        state: { flashMessage: `You are not allowed to edit ${auth.user.slug}'s' profile but here is yours` }
      }
      return <Redirect to={to} />
    }

    return (
      <Form
        defaultValues={user}
        onSubmit={this.submitUserEdits}
        validate={({ lang }) => ({
          lang: !lang ? 'Language is required' : undefined,
        })}
      >
        {({ submitForm }) => (
          <form onSubmit={submitForm}>
            <h2>Edit your profile {user.username}</h2>
            <div className="row">
              <div className="col">
                <label htmlFor="firstName">First name</label>
                <Text field="firstName" id="firstName" />
              </div>
              <div className="col">
                <label htmlFor="lastName">Last name</label>
                <Text field="lastName" id="lastName" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="companyName">Company</label>
                <Text field="companyName" id="companyName" />
              </div>
              <div className="col">
                <label htmlFor="jobtitle">Jobtitle</label>
                <Text field="jobtitle" id="jobtitle" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="lang">Language</label>
                <Select
                  field="lang"
                  id="lang"
                  options={[
                    { label: 'English', value: 'en' },
                    { label: 'Français', value: 'fr' },
                  ]}
                />
              </div>
              <div className="col">
                <label htmlFor="interests">Interests</label>
                <Textarea field="interests" id="interests" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="aboutme">About me</label>
              <Textarea field="aboutme" id="aboutme" />
            </div>
            <div className="form-group">
              <Button type="submit">Update</Button>
            </div>
          </form>
        )}
      </Form>
    )
  }
}
Edit.propTypes = {
  updateUser: PropTypes.func.isRequired,
  data: PropTypes.shape({
    user: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      jobtitle: PropTypes.string,
      interests: PropTypes.string,
      aboutme: PropTypes.string,
      lang: PropTypes.string,
    }).isRequired,
  }).isRequired,
  auth: PropTypes.shape({
    user: PropTypes.object.isRequired,
  }).isRequired,
}


const editUserQuery = gql`query editUserQuery ($slug: String!) {
  user(slug: $slug) {
    id
    slug
    username
    firstName
    lastName
    companyName
    interests
    aboutme
    jobtitle
    lang
  }
}
`


const userProfileMutation = gql`
  mutation userProfileMutation(
    $slug: String!, $firstName: String, $lastName: String, $companyName: String
    $jobtitle: String, $lang: Lang, $interests: String, $aboutme: String
  ) {
    updateUser(
      slug: $slug, firstName: $firstName, lastName: $lastName, companyName: $companyName
      jobtitle: $jobtitle, lang: $lang, interests: $interests, aboutme: $aboutme
    ) {
      id
      slug
      username
      firstName
      lastName
      companyName
      interests
      aboutme
      jobtitle
      lang
    }
  }
`

const loadEdit = GraphLoader(Edit)
const graphEdit = compose(
  graphql(editUserQuery, {
    options: data => ({ variables: { slug: data.slug } })
  }),
  graphql(userProfileMutation, {
    props: ({ mutate, ownProps }) => ({
      updateUser: data => {
        const variables = { ...data }
        variables.slug = ownProps.slug
        return mutate({ variables })
      },
    }),
  }),
)(loadEdit)
const connectedEdit = withAuth(graphEdit)
export default connectedEdit
