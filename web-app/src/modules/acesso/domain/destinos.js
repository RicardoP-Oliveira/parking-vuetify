// src/utils/constants.js


export const calcularDestino = ({
  data,
  isEntrada,
  mapaUnidades,
  mapaDestinos
}) => {
  if (!data || !isEntrada) return null

  const ubmIdBusca = data.ubm_id || data.user?.ubm_id

  if (!ubmIdBusca) return null
  if (! mapaUnidades?.size || !mapaDestinos?.size) return null
  
  const nomeUbm = mapaUnidades.get(ubmIdBusca)
  if (!nomeUbm) return null

  const idDestino = mapaDestinos.get(nomeUbm)
  return idDestino || null
}
