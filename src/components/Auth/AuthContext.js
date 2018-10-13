import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const { Provider, Consumer } = React.createContext()

export class AuthContext extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: props.user,
    }
    this.setUser = this.setUser.bind(this)
    this.logout = this.logout.bind(this)
  }

  setUser(user) {
    this.setState(() => ({ user }))
  }

  logout() {
    this.setState(() => ({ user: null }))
  }

  render() {
    const { setUser, logout } = this
    const { children } = this.props
    const { user } = this.state

    return (
      <Provider value={{ setUser, user }}>
        {children}
      </Provider>
    )
  }
}
AuthContext.propTypes = {
  children: PropTypes.node.isRequired
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
