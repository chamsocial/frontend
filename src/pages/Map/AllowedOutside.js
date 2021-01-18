import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import './allowed.scss'


function setTime(date, hours) {
  date.setTime(date.getTime() + (hours * 60 * 60 * 1000))
}
function padZero(time) {
  return String(time).padStart(2, '0')
}

const MORNING = 6
const NIGHT = 18

function getCurfew() {
  const currentTime = new Date()
  const hour = currentTime.getUTCHours() + 1
  const month = currentTime.getMonth()
  const day = currentTime.getDate()
  const is = hour >= NIGHT || hour < MORNING
  const today = new Date(currentTime.getFullYear(), month, day)

  if (is && hour < MORNING) setTime(today, MORNING)
  else if (is) setTime(today, 30)
  else setTime(today, NIGHT)

  const timeLeft = today.getTime() - currentTime.getTime()
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
        {isCurfew.is ? 'Freedom in:' : 'Curfew starts in:'}
        <br />
        <strong>{isCurfew.countdown}</strong>
      </div>
    </div>
  )
}


export default AllowedOutside
