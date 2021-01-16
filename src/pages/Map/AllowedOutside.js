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


function getCurfew() {
  const currentTime = new Date()
  const hour = currentTime.getUTCHours() + 1
  const month = currentTime.getMonth()
  const day = currentTime.getDate()
  const isChristmas = day === 24 && month === 11
  const is = (hour >= 20 && !isChristmas) || hour < 6
  const today = new Date(currentTime.getFullYear(), month, day)

  if (is && hour < 6) setTime(today, 6)
  else if ((is && hour >= 18) || isChristmas) setTime(today, 30)
  else setTime(today, 18)

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
