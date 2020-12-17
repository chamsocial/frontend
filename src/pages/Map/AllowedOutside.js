import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Link } from 'react-router-dom'
import './allowed.scss'


function AllowedOutside() {
  const date = new Date()
  const hour = date.getUTCHours() + 1
  const isCurfew = hour >= 20 || hour < 6
  return (
    <div className={`allowed-outside ${isCurfew ? 'no' : 'yes'}`}>
      <Link to="/" className="allowed-outside__close">
        <FontAwesomeIcon icon="times" />
      </Link>
      {isCurfew ? 'No' : 'Yes'}
    </div>
  )
}


export default AllowedOutside
