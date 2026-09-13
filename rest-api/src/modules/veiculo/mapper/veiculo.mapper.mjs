const hasValue = value => value !== undefined

const mapVeiculoBase = veiculo => ({
  id: veiculo.id,
  placa: veiculo.placa,
  marca: veiculo.marca,
  modelo: veiculo.modelo,
  prefixo: veiculo.prefixo,
  renavam: veiculo.renavam,
  usuario_id: veiculo.usuario_id,
  orgao_id: veiculo.orgao_id,
})

export const mapVeiculoResumo = veiculo => { 
  if (!veiculo) {
    return null
  }

  return {
    ...mapVeiculoBase(veiculo),
    
    ubm_id: veiculo.usuarios?.unidade_id,
    documento: veiculo.usuarios?.documento,
    condutor: veiculo.usuarios?.nome,
    doc_id: veiculo.usuarios?.tipo_doc_id,
    gradua_id: veiculo.usuarios?.tratamento_id,

    docSigla: veiculo.usuarios?.tipo_documentos?.tipo,
    nomeUbm: veiculo.usuarios?.unidades?.unidade,
    graduaAbrev: veiculo.usuarios?.tratamentos?.sigla,
    orgaoSigla: veiculo.usuarios?.orgaos?.sigla_curta,
  }
}

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