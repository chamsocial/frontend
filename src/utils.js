function toJson(res) { return res.json() }

export function dateToString(date) {
  if (!date) return '-'

  const d = new Date(date)
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
  const formated = d.toLocaleDateString(undefined, options)
  return `${formated}`
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
