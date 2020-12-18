import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import './allowed.scss'


function setTime(date, hours) {
  date.setHours(date.getHours() + hours)
}
function padZero(time) {
  return String(time).padStart(2, '0')
}


function getCurfew() {
  const date = new Date()
  const hour = date.getUTCHours() + 1
  const is = hour >= 20 || hour < 6
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  if (is && hour < 6) setTime(today, 6)
  else if (is && hour >= 20) setTime(today, 10)
  else setTime(today, 20)

  const timeLeft = today.getTime() - date.getTime()
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)
  const countdown = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`

  return { is, countdown }
}


function AllowedOutside() {
  const [isCurfew, setCurfew] = useState(getCurfew())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurfew(getCurfew())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`allowed-outside ${isCurfew.is ? 'no' : 'yes'}`}>
      <Link to="/" className="allowed-outside__close">
        <FontAwesomeIcon icon="times" />
      </Link>
      {isCurfew.is ? 'No' : 'Yes'}
      <div className="countdown">
        {isCurfew.countdown}
      </div>
    </div>
  )
}


export default AllowedOutside
