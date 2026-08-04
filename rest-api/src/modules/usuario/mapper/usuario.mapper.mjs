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

  if (hasValue(body.tratamento_id)) payload.tratamento_id = body.tratamento_id
  if (hasValue(body.tipo_doc_id)) payload.tipo_doc_id = body.tipo_doc_id
  if (hasValue(body.nome)) payload.nome = body.nome
  if (hasValue(body.unidade_id)) payload.unidade_id = body.unidade_id
  if (hasValue(body.orgao_id)) payload.orgao_id = body.orgao_id
  if (hasValue(body.documento)) payload.documento = body.documento

  return payload
}