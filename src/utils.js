export function dateToString (date) {
  if (!date) return '-'

  const d = new Date(date)
  const options = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
  const formated = d.toLocaleDateString(undefined, options)
  return `${formated}`
}
