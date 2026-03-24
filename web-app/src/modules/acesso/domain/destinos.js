export const calcularDestino = ({
  data,
  isEntrada,
  mapaDestinos
}) => {
  if (!data || !isEntrada) return null

  const sigla = data.siglaUbm?.trim().toUpperCase()

  if (!sigla) return null

  const destino = mapaDestinos.value.find(
    d => d.title?.trim().toUpperCase() === sigla
  )
  
  return destino?.id ?? null
  
}
