const hasValue = value => value !== undefined

export const mapUsuarioResumo = user => {
  const dados = user.get ({ plain: true })
  
  dados.nomeCompleto = [
    user.graduaAbrev,
    user.orgaoSigla,
    user.nome,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()

  return dados
}

export const mapUsuarioCreatePayload = (body) => {
  const payload = {
    ...body,
  }
  
  return payload
}

export const mapUsuarioUpdatePayload = (body) => {
  const payload = {}

  if (hasValue(body.gradua_id)) payload.gradua_id = body.gradua_id
  if (hasValue(body.doc_id)) payload.tipo_doc_id = body.doc_id
  if (hasValue(body.nGuerra)) payload.nome = body.n_guerra
  if (hasValue(body.ubm_id)) payload.ubm_id = body.ubm_id
  if (hasValue(body.orgao_id)) payload.orgao_id = body.orgao_id
  if (hasValue(body.documento)) payload.documento = body.documento

  return payload
}