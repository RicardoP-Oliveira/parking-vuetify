import { hasValue, buildNomeCompleto } from '../../../shared/utils/mapperUtils.mjs'

export const mapUsuarioResumo = user => {
  const dados = user.get ({ plain: true })
  
  dados.nomeCompleto = buildNomeCompleto(
    dados.graduaAbrev,
    dados.orgaoSigla,
    dados.nome,
  )
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
  if (hasValue(body.n_guerra)) payload.nome = body.n_guerra
  if (hasValue(body.ubm_id)) payload.ubm_id = body.ubm_id
  if (hasValue(body.trato_id)) payload.tratamento_id = body.trato_id
  if (hasValue(body.orgao_id)) payload.orgao_id = body.orgao_id
  if (hasValue(body.documento)) payload.documento = body.documento

  return payload
}