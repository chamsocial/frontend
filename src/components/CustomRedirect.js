import { Component } from 'react'
import PropTypes from 'prop-types'

class CustomRedirect extends Component {
  constructor(props) {
    super(props)
    const { history, location } = props
    history.push('/login', { from: location })
  }

  render() {
    return null
  }
}
CustomRedirect.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.any,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
}

export default CustomRedirect
