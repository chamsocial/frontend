import React, { Component } from 'react'
import PropTypes from 'prop-types'
import apollo from 'utils/apollo'

const { REACT_APP_API_URL } = process.env
export const authContext = React.createContext()
export const { Provider, Consumer } = authContext

function logout() {
  fetch(`${REACT_APP_API_URL}/logout`, { credentials: 'include' })
    .then(() => {
      apollo.resetAll()
      window.location = '/'
    })
    .catch(err => {
      console.log('Logout error:', err) // eslint-disable-line
      apollo.resetAll()
      window.location = '/'
    })
}

export class AuthContext extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
    }
    this.setUser = this.setUser.bind(this)
  }

  setUser(user) {
    this.setState(() => ({ user }))
  }

  render() {
    const { setUser } = this
    const { children } = this.props
    const { user } = this.state

    return (
      <Provider value={{ setUser, user, logout }}>
        {children}
      </Provider>
    )
  }
}
AuthContext.defaultProps = {
  user: {},
}
AuthContext.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
  children: PropTypes.node.isRequired,
}

export function withAuth(WrappedComponent) {
  return function WithComponent(props) {
    return (
      <Consumer>
        {values => <WrappedComponent {...props} auth={values} />}
      </Consumer>
    )
  }
}
