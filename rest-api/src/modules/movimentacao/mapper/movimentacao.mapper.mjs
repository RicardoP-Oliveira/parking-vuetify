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
    destino_id: movimentacao.destino_id,
    
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
          sigla: movimentacao.destino.unidades?.sigla ?? null,
        }
      : null,

    veiculo: movimentacao.veiculos
      ? {
          id: movimentacao.veiculos.id,
          usuario_id: movimentacao.veiculos.usuario_id,
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
    destino_id: movimentacao.destino_id,
    destino_sigla: movimentacao.destino?.unidades?.sigla ?? null,
    e_nomeCompleto: movimentacao.entradaUser?.nomeCompleto ?? null,
    e_condutor: movimentacao.entradaUser?.nome ?? null,
    e_documento: movimentacao.entradaUser?.documento || null,
    e_tipoDoc: movimentacao.entradaUser?.tipo_documentos?.tipo || null,
    e_graduaAbrev: movimentacao.entradaUser?.tratamentos?.sigla || null,
    e_siglaCurta: movimentacao.entradaUser?.orgaos?.sigla_curta || null,
    s_nomeCompleto: movimentacao.saidaUser?.nomeCompleto ?? null,
    s_condutor: movimentacao.saidaUser?.nome ?? null,
    s_documento: movimentacao.saidaUser?.documento || null,
    s_graduaAbrev: movimentacao.saidaUser?.tratamentos?.sigla || null,
    s_siglaCurta: movimentacao.saidaUser?.orgaos?.sigla_curta || null,
    placa: movimentacao.veiculos?.placa ?? null,
    marca: movimentacao.veiculos?.marca ?? null,
    prefixo: movimentacao.veiculos?.prefixo ?? null,
})

export const mapMovimentacaoCreatePayload = body => {
  const payload = {}

  if (hasValue(body.tipo)) payload.tipo = body.tipo
  if (hasValue(body.entrada)) payload.entrada = body.entrada
  if (hasValue(body.saida)) payload.saida = body.saida

  if (hasValue(body.user_entrada_id)) payload.user_entrada_id = body.user_entrada_id

  if (hasValue(body.user_saida_id)) payload.user_saida_id = body.user_saida_id

  if (hasValue(body.veiculo_id)) payload.veiculo_id = body.veiculo_id

  if (hasValue(body.destino_id)) payload.destino_id = body.destino_id

  return payload
}

export const mapMovimentacaoUpdatePayload = mapMovimentacaoCreatePayload