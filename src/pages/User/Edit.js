import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useQuery, useMutation } from 'react-apollo'
import { Redirect, Link } from 'react-router-dom'
import gql from 'graphql-tag'
import Button from 'components/partials/Button'
import Loading from 'components/partials/Loading'
import Alert from 'components/partials/Alert'


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


function Edit({ profile }) {
  const [state, setState] = useState({
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    companyName: profile.companyName || '',
    jobtitle: profile.jobtitle || '',
    interests: profile.interests || '',
    aboutme: profile.aboutme || '',
    lang: profile.lang || 'en',
  })
  const [updateProfile, { loading, error, data }] = useMutation(userProfileMutation)

  function submitProfileChange(evt) {
    evt.preventDefault()
    if (loading) return
    updateProfile({ variables: state }).catch(() => {})
  }

  function onChange(evt) {
    const { value, id } = evt.target
    setState(currState => ({ ...currState, [id]: value }))
  }

  if (data?.updateUser?.id) {
    return (
      <Redirect to={{
        pathname: `/users/${profile.slug}/`,
        state: { flashMessage: 'Your profile has been updated.' },
      }}
      />
    )
  }

  return (
    <form onSubmit={submitProfileChange} className="box">
      <h1>Edit your profile {profile.username}</h1>
      <div className="row">
        <div className="col">
          <label htmlFor="firstName">First name</label>
          <input className="input" id="firstName" value={state.firstName} onChange={onChange} />
        </div>
        <div className="col">
          <label htmlFor="lastName">Last name</label>
          <input className="input" id="lastName" value={state.lastName} onChange={onChange} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label htmlFor="companyName">Company</label>
          <input className="input" id="companyName" value={state.companyName} onChange={onChange} />
        </div>
        <div className="col">
          <label htmlFor="jobtitle">Jobtitle</label>
          <input className="input" id="jobtitle" value={state.jobtitle} onChange={onChange} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <label htmlFor="aboutme">About me</label>
          <textarea id="aboutme" value={state.aboutme} onChange={onChange} />
        </div>
        <div className="col">
          <label htmlFor="interests">Interests</label>
          <textarea id="interests" value={state.interests} onChange={onChange} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="lang">Language</label>
        <select component="select" id="lang" value={state.lang} onChange={onChange}>
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {error && <Alert type="danger">Failed to save profile. Please reload and try again.</Alert>}
      <div className="form-group space-between">
        <Button type="submit" loading={loading}>Update</Button>
        <Link to={`/users/${profile.slug}`}>Cancel</Link>
      </div>
    </form>
  )
}
Edit.propTypes = {
  profile: PropTypes.shape({
    id: PropTypes.any.isRequired,
    firstName: PropTypes.string,
  }).isRequired,
}


function LoadProfileData() {
  const { data, loading, error } = useQuery(editUserQuery, { fetchPolicy: 'network-only' })
  if (loading || error) return <Loading error={error} />
  return <Edit profile={data.me} />
}


export default LoadProfileData
