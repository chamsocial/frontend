import React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { editUserQuery } from '../../graphql/user-queries'
import GraphLoader from '../partials/GraphLoader'

function Edit (props) {
  const { user } = props.data
  if (!user || props.user.id !== user.id) {
    const to = {
      pathname: `/users/${props.user.slug}/`,
      state: { flashMessage: `You are not allowed to edit ${props.slug}'s' profile but here is yours` }
    }
    return <Redirect to={to} />
  }
  return <div>
    <h2>{user.username}</h2>
    <br />{user.first_name}
    <br />{user.last_name}
    <br />{user.company_name}
    <br />{user.interests}
    <br />{user.aboutme}
    <br />{user.jobtitle}
    <br />{user.avatarpath}
  </div>
}

const loadEdit = GraphLoader(Edit)
const graphEdit = graphql(editUserQuery, {
  options: (data) => ({ variables: { slug: data.slug } })
})(loadEdit)
const mapStateToProps = (state) => ({ user: state.auth.user })
const connectedEdit = connect(mapStateToProps)(graphEdit)
export default connectedEdit
