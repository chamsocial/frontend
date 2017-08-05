/*
 |--------------------------------------------------------------------------
 | Button
 |--------------------------------------------------------------------------
 |
 | Create interactive buttons that interact with the parameters it's given
 | Disable and display loading icon and text while loading
 |
 */
import React, { Component } from 'react'
import './Button.css'

/**
 * <Button>Button text</Button>
 *
 * @param {function}    onClick           - What happens on click
 * @param {bool}        loading           - Is the button event loading (e.g. wating for ajax)
 * @param {string}      [type=success]    - What type of button (bootstrap:danger, info etc)
 * @param {string}      [loadingText=Saving...] - Change the button text while loading
 * @param {string}      [doneText=Everything saved!] - Display a success text next to the button
 * @param {bool|number} [showDone=false]  - If the done text should be displayed
 *                                          and if number is set for how long default: 2000
 * @param {string}      [wrapperClass]    - Add classes to the button wrapper
 * @param {string}      [className]       - Add classes to the button
 * @param {string}      [wrapperDisplay]  - What the parent object should be for display type
 * @param {object}      [attr]            - Other attributes for the <button>
 * @return {Component}
 */

class Button extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isDone: false
    }
  }

  /**
  * Update states depending of properties
  *
  * @param  {object} nextProps The new properties
  * @param  {object} nextState The new states
  * @return {void}
  */
  componentWillUpdate (nextProps, nextState) {
    const {
      showDone,
      loading
    } = this.props

    // If the done text should be shown
    if (!showDone) return

    // If the current state is loading and the new is done loading
    if (!(loading === true && nextProps.loading === false)) return

    this.setState({ isDone: 'success' })

    // Remove the is done status message after X seconds
    const time = (typeof showDone === 'number') ? showDone : 2000
    setTimeout(() => { this.setState({ isDone: false }) }, time)
  }

  /**
   * Render the button
   *
   * @return {jsx} The final button
   */
  render () {
    const { isDone } = this.state
    const {
      id,
      loading,
      loadingText = 'Saving...',
      doneText = 'Everything saved!',
      type = 'success',
      wrapperDisplay
    } = this.props

    let {
      done,
      children,
      className = '',
      wrapperClass = ''
    } = this.props

    // Set classes
    wrapperClass += ' action-btn-wrapper'
    className += ' action-btn btn btn-' + type

    // Update varaiables if is loading
    if (loading) {
      children = loadingText
      className += ' btn-loading'
    }

    // Display a done message if is done
    if (isDone) done = <span className='action-btn-is-done'>{doneText}</span>

    // Return the final button
    return (
      <span id={id} className={wrapperClass} style={{ display: wrapperDisplay }}>
        <button {...this.props.attr} className={className} onClick={this.props.onClick} disabled={this.props.loading}>
          {children}
        </button>
        {done}
      </span>
    )
  }
}

export default Button
