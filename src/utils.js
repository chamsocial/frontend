function toJson(res) { return res.json() }


export function dateToString(date) {
  if (!date) return '-'

  const d = new Date(date)
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }
  const formated = d.toLocaleDateString(undefined, options)
  return `${formated}`
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
