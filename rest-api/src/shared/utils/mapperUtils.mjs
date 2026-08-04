export const hasValue = value => value !== undefined

export const buildNomeCompleto = (...partes) => 
  partes.filter(Boolean).join(' ').trim()

export const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

export const getTimestamp = () => {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() +1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')

  return `${year}${month}${day}${hour}${minute}`
}