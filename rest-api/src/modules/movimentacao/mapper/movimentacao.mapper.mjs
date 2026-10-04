import { hasValue } from "../../../shared/utils/mapperUtils.mjs"

const formatHora = data =>
  data
    ? data.toLocaleTimeString('pt-BR', {
      hour12: false,
      timeZone: 'America/Sao_Paulo',
    })
    : null

export const mapMovimentacaoDetalhe = movimentacao => ({
  id: movimentacao.id,
  tipo: movimentacao.tipo,
  entrada: movimentacao.entrada,
  saida: movimentacao.saida,
  destino: movimentacao.destino,

  entradaUser: movimentacao.entradaUser
    ? {
      id: movimentacao.entradaUser.id,
      documento: movimentacao.entradaUser.documento,
      nome: movimentacao.entradaUser.nome,
      nomeCompleto: movimentacao.entradaUser.nomeCompleto,
      graduaAbrev: movimentacao.entradaUser.tratamentos?.sigla ?? null,
      orgaoSigla: movimentacao.entradaUser.orgaos?.sigla_curta ?? null,
      tipoDoc: movimentacao.entradaUser.tipo_documentos?.tipo ?? null,
    }
    : null,

  saidaUser: movimentacao.saidaUser
    ? {
      id: movimentacao.saidaUser.id,
      documento: movimentacao.saidaUser.documento,
      nome: movimentacao.saidaUser.nome,
      nomeCompleto: movimentacao.saidaUser.nomeCompleto,
      graduaAbrev: movimentacao.saidaUser.tratamentos?.sigla ?? null,
      orgaoSigla: movimentacao.saidaUser.orgaos?.sigla_curta ?? null,
      tipoDoc: movimentacao.saidaUser.tipo_documentos?.tipo ?? null,
    }
    : null,

  destino: movimentacao.destino
    ? {
      id: movimentacao.destino.id,
      sigla: movimentacao.destino ?? null,
    }
    : null,

  veiculo: movimentacao.veiculos
    ? {
      id: movimentacao.veiculos.id,
      placa: movimentacao.veiculos.placa,
      marca: movimentacao.veiculos.marca,
      prefixo: movimentacao.veiculos.prefixo,
    }
    : null,
})

export const mapMovimentacaoResumo = movimentacao => ({
  id: movimentacao.id,
  tipo: movimentacao.tipo,
  entrada: movimentacao.entrada,
  hEntrada: formatHora(movimentacao.entrada),
  saida: movimentacao.saida,
  hSaida: formatHora(movimentacao.saida),
  destino: movimentacao.destino ?? null,
  user_entrada: movimentacao.user_entrada ?? null,
  documento_entrada: movimentacao.documento_entrada ?? null,
  nome: movimentacao.user_entrada ?? null,
  user_saida: movimentacao.user_saida ?? null,
  documento_saida: movimentacao.documento_saida ?? null,
  // e_nomeCompleto: movimentacao.entradaUser?.nomeCompleto || null,
  // documento_entrada: movimentacao.entradaUser?.documento || null,
  e_tipoDoc: movimentacao.entradaUser?.tipo_documentos?.tipo || null,
  // e_graduaAbrev: movimentacao.entradaUser?.tratamentos?.sigla || null,
  // e_siglaCurta: movimentacao.entradaUser?.orgaos?.sigla_curta || null,
  // s_nomeCompleto: movimentacao.saidaUser?.nomeCompleto ?? null,
  // s_condutor: movimentacao.saidaUser?.nome ?? null,
  // documento_saida: movimentacao.saidaUser?.documento || null,
  // s_graduaAbrev: movimentacao.saidaUser?.tratamentos?.sigla || null,
  // s_siglaCurta: movimentacao.saidaUser?.orgaos?.sigla_curta || null,
  placa: movimentacao.veiculos?.placa ?? null,
  marca: movimentacao.veiculos?.marca ?? null,
  prefixo: movimentacao.veiculos?.prefixo ?? null,

})

export const mapMovimentacaoCreatePayload = body => {
  const payload = {}

  if (hasValue(body.tab)) payload.tipo = body.tab
  if (hasValue(body.placa)) payload.placa = body.placa
  if (hasValue(body.nome)) payload.user_entrada = body.nome
  if (hasValue(body.documento)) payload.documento_entrada = body.documento
  if (hasValue(body.destino)) payload.destino = body.destino

  console.log('mapMovimentacaoCreatePayload', { body, payload })

  return payload
}

export const mapMovimentacaoSaidaPayload = body => {
  const payload = {}

  if (hasValue(body.saida)) payload.saida = body.saida
  if (hasValue(body.nome)) payload.user_saida = body.nome
  if (hasValue(body.documento)) payload.documento_saida = body.documento

  return payload
}