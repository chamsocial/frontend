import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Modal = ({ children, activator }) => {
  const [isOpen, setOpen] = useState(false)
  function openModal() { setOpen(true) }
  function closeModal() { setOpen(false) }
  function overlayClick(e) {
    if (e.target.id === 'chamModalOverlay') closeModal()
  }
  useEffect(() => {
    if (!isOpen) return undefined
    function handleEsc(evt) {
      if (evt.keyCode === 27) closeModal()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  const content = (
    <div
      id="chamModalOverlay"
      className="overlay"
      onClick={overlayClick}
      onKeyPress={overlayClick}
      role="button"
      aria-label="Overlay"
      tabIndex="0"
    >
      <div className="modal">
        <button className="modal--close" type="button" onClick={closeModal}>
          <FontAwesomeIcon icon="times" />
        </button>
        <div className="modal--body">{children({ openModal })}</div>
      </div>
    </div>
  )

  return (
    <>
      {activator({ openModal })}
      {createPortal(
        <CSSTransition
          in={isOpen}
          timeout={120}
          classNames="modal-transition"
          unmountOnExit
        >
          {() => <div>{content}</div>}
        </CSSTransition>,
        document.body,
      )}
    </>
  )
}


export default Modal
