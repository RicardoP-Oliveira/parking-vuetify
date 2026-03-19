// src/utils/constants.js

export const ACTIONS = {
  ENTRADA: 'Entrada',
  SAIDA: 'Saída'
}

export const calcularDestino = ({
  data,
  isEntrada,
  mapaUnidades,
  mapaDestinos
}) => {
  if (!data || !isEntrada) return

  const ubmIdBusca = data.ubm_id || data.user?.ubm_id

  if (!ubmIdBusca) return
  if (! mapaUnidades?.size || !mapaDestinos?.size) return
  
  const nomeUbm = mapaUnidades.get(ubmIdBusca)
  if (!nomeUbm) return 

  const idDestino = mapaDestinos.get(nomeUbm)
  return idDestino || null
}
