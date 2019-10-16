import React, { Component } from 'react'

class LazyLoad extends Component {
  constructor(props) {
    super(props)
    this.state = {
      AsyncModule: null,
    }
  }

  componentDidMount() {
    const { getComponent } = this.props
    getComponent()
      .then(module => module.default)
      .then(AsyncModule => this.setState({ AsyncModule }))
  }

  render() {
    const { Loader, ...childProps } = this.props
    const { AsyncModule } = this.state

    if (AsyncModule) {
      return <AsyncModule {...childProps} />
    }

    if (Loader) {
      return <Loader />
    }

    return <div>Hmmm ...</div>
  }
}

export default LazyLoad
