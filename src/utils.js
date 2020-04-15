import React from 'react'


function toJson(res) { return res.json() }


export function dateToString(date) {
  if (!date) return '-'

  const d = new Date(date)
  const formatedDate = d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const formatedTime = `${hours}:${minutes}`
  return (
    <span className="d">
      <span className="d--date">{formatedDate},</span>
      {' '}<span className="d--time">{formatedTime}</span>
    </span>
  )
}


export function prettyDate(date) {
  if (!date) return '-'

  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Date(date).toLocaleDateString(undefined, options)
}

export const request = {
  post(url, body, opt = {}) {
    const options = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      ...opt,
    }

    return fetch(url, options).then(toJson)
  },
  get(url, token) {
    return fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(toJson)
  },
}
