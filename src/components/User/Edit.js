import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Formik, FastField, ErrorMessage,
} from 'formik'
import GraphLoader from '../partials/GraphLoader'
import Button from '../partials/Button'
import { withAuth } from '../Auth/AuthContext'

class Edit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
    }

    this.submitUserEdits = this.submitUserEdits.bind(this)
  }

  componentDidMount() {
    const { slug, auth, history } = this.props
    if (!auth.user || slug !== auth.user.slug) {
      const to = {
        pathname: `/users/${auth.user.slug}/edit`,
        state: { flashMessage: `You are not allowed to edit ${slug}'s profile but here is yours` },
      }
      history.push(to)
    }
  }

  submitUserEdits(values) {
    const { updateUser, history } = this.props
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
      .then(() => {
        history.push({
          pathname: `/users/${values.slug}/`,
          state: { flashMessage: 'Your profile has been updated.' },
        })
      })
      .catch(e => {
        if (e.graphQLErrors) {
          return this.setState({ error: e.graphQLErrors[0].message })
        }
        return this.setState({ error: 'Something unexpected went wrong.' })
      })
  }

  render() {
    const { error } = this.state
    const { data } = this.props
    const { user } = data

    return (
      <Formik
        initialValues={user}
        onSubmit={this.submitUserEdits}
        validate={({ lang }) => {
          const errors = {}
          if (!lang) errors.lang = 'Language is required'
          return errors
        }}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <h2>Edit your profile {user.username}</h2>
            <div className="row">
              <div className="col">
                <label htmlFor="firstName">First name</label>
                <FastField name="firstName" id="firstName" />
              </div>
              <div className="col">
                <label htmlFor="lastName">Last name</label>
                <FastField name="lastName" id="lastName" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="companyName">Company</label>
                <FastField name="companyName" id="companyName" />
              </div>
              <div className="col">
                <label htmlFor="jobtitle">Jobtitle</label>
                <FastField name="jobtitle" id="jobtitle" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="lang">Language</label>
                <FastField component="select" name="lang" id="lang">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </FastField>
                <ErrorMessage name="lang" id="lang" />
              </div>
              <div className="col">
                <label htmlFor="interests">Interests</label>
                <FastField component="textarea" name="interests" id="interests" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="aboutme">About me</label>
              <FastField component="textarea" name="aboutme" id="aboutme" />
            </div>
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}
            <div className="form-group">
              <Button type="submit">Update</Button>
            </div>
          </form>
        )}
      </Formik>
    )
  }
}
Edit.propTypes = {
  updateUser: PropTypes.func.isRequired,
  slug: PropTypes.string.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
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
    options: data => ({ variables: { slug: data.slug } }),
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
