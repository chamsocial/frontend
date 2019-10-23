import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as compose from 'lodash.flowright'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import {
  Formik, FastField, ErrorMessage,
} from 'formik'
import GraphLoader from '../../components/partials/GraphLoader'
import Button from '../../components/partials/Button'


class Edit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: false,
    }

    this.submitUserEdits = this.submitUserEdits.bind(this)
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
    console.log(this.props)
    const { error } = this.state
    const { data } = this.props
    const user = data.me

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
          <form onSubmit={handleSubmit} className="box">
            <h2>Edit your profile {user.username}</h2>
            <div className="row">
              <div className="col">
                <label htmlFor="firstName">First name</label>
                <FastField className="input" name="firstName" id="firstName" />
              </div>
              <div className="col">
                <label htmlFor="lastName">Last name</label>
                <FastField className="input" name="lastName" id="lastName" />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <label htmlFor="companyName">Company</label>
                <FastField className="input" name="companyName" id="companyName" />
              </div>
              <div className="col">
                <label htmlFor="jobtitle">Jobtitle</label>
                <FastField className="input" name="jobtitle" id="jobtitle" />
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
              <div className="alert alert--danger">{error}</div>
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
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  data: PropTypes.shape({
    me: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      jobtitle: PropTypes.string,
      interests: PropTypes.string,
      aboutme: PropTypes.string,
      lang: PropTypes.string,
    }).isRequired,
  }).isRequired,
}


const editUserQuery = gql`query editUserQuery {
  me {
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
    $firstName: String, $lastName: String, $companyName: String
    $jobtitle: String, $lang: Lang, $interests: String, $aboutme: String
  ) {
    updateUser(
      firstName: $firstName, lastName: $lastName, companyName: $companyName
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
  graphql(editUserQuery, { options: { fetchPolicy: 'network-only' } }),
  graphql(userProfileMutation, {
    props: ({ mutate }) => ({
      updateUser: data => {
        const variables = { ...data }
        return mutate({ variables })
      },
    }),
  }),
)(loadEdit)
export default graphEdit