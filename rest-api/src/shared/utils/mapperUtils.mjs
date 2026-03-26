export const hasValue = value => value !== undefined

export const buildNomeCompleto = (...partes) => 
  partes.filter(Boolean).join(' ').trim()

export const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}