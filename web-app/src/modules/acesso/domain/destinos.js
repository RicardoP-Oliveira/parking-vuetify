// src/utils/constants.js


export const calcularDestino = ({
  data,
  isEntrada,
  mapaDestinos
}) => {
  if (!data || !isEntrada) return null

  const sigla = data.siglaUbm?.trim().toUpperCase()

  if (!sigla) return null
  
  return mapaDestinos.get(sigla) ?? null
}
