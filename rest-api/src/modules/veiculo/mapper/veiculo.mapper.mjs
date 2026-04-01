const hasValue = value => value !== undefined

export const mapVeiculoResumo = veiculo => veiculo.get({ plain: true })

export const mapVeiculoCreatePayload = body => {
  const payload = {}

  if (hasValue(body.placa)) payload.placa = body.placa?.trim().toUpperCase()
  if (hasValue(body.marca)) payload.marca = body.marca
  if (hasValue(body.modelo)) payload.modelo = body.modelo
  if (hasValue(body.renavam)) payload.renavam = body.renavam
  if (hasValue(body.prefixo)) payload.prefixo = body.prefixo
  if (hasValue(body.usuario_id)) payload.usuario_id = body.usuario_id
  if (hasValue(body.orgao_id)) payload.orgao_id = body.orgao_id

  return payload
}

export const mapVeiculoUpdatePayload = body => {
  const payload = {}

  if (hasValue(body.placa)) payload.placa = body.placa?.trim().toUpperCase()
  if (hasValue(body.marca)) payload.marca = body.marca
  if (hasValue(body.marcaModelo) && !hasValue(body.marca)) payload.marca = body.marcaModelo
  if (hasValue(body.modelo)) payload.modelo = body.modelo
  if (hasValue(body.renavam)) payload.renavam = body.renavam
  if (hasValue(body.prefixo)) payload.prefixo = body.prefixo
  if (hasValue(body.usuario_id)) payload.usuario_id = body.usuario_id
  if (hasValue(body.orgao_id)) payload.orgao_id = body.orgao_id

  return payload
}