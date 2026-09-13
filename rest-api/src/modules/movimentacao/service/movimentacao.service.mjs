import {
  mapMovimentacaoDetalhe,
  mapMovimentacaoResumo,
  mapMovimentacaoCreatePayload,
  mapMovimentacaoUpdatePayload,
  adaptMovimentacao,
} from '../mapper/index.mjs'

import { toNumber } from '../../../shared/utils/mapperUtils.mjs'

const validateMovimentacao = payload => {
 if (payload.entrada && payload.saida) {
  const entrada = new Date(payload.entrada)
  const saida = new Date(payload.saida)
    if (saida < entrada) {    
      throw new Error(
          'A saída deve ser igual ou posterior à entrada.'
        )
    }
  }
  if (
    payload.tipo === 'PEDESTRE' &&
    payload.veiculo_id
  ) {
    throw new Error(
      'Movimentação PEDESTRE não pode possuir veículo.'
    )
  }
  if (
    payload.tipo === 'VEICULO' &&
    !payload.veiculo_id
  ) {
    throw new Error(
      'Movimentação VEICULO deve possuir veículo.'
    )
  }
}

const createMovimentacaoService = repository => ({
  async index({ page = 1, perPage = 50, ...filters}) {
    const finalPage = toNumber(page, 1)
    let finalPerPage = toNumber(perPage, 50)

    if (finalPerPage <= 0) {
      finalPerPage = await repository.count(filters)
    }
    
    const result = await repository.findAndCountAll({
      page: finalPage,
      perPage: finalPerPage,
      ...filters
    })

    return {
      count: result.count,
      rows: result.rows
        .map(adaptMovimentacao)
        .map(mapMovimentacaoResumo)
    }
  },

  async show({ identificador, tab }) {
    const movimentacao = await repository.findResumoByIdentificador({
      identificador,
      tab
    })

    if (!movimentacao) {
      return null
    }

    return mapMovimentacaoDetalhe(movimentacao)
    
  },

  async store(body){
    const payload = mapMovimentacaoCreatePayload(body)

    payload.entrada ??= new Date()

    validateMovimentacao(payload)
   
    return repository.create(payload)
  },

  async registrarSaida(body) {
    if (!body.registro_id) {
      return {
        found: false,
        invalid: true
      }
    }

    const movimentacao = await repository.findByPk(body.registro_id)

    if (!movimentacao) {
      return {
        found: false,
        invalid: false
      }
    }

    const payload = mapMovimentacaoUpdatePayload({
      ...body,
      saida: body.saida ?? new Date()
    })

    validateMovimentacao({
      ...movimentacao,
      ...payload
    })

    const updatedMovimentacao = 
      await repository.updateById(
        body.registro_id,
        payload
      )

    return {
      found: true,
      invalid: false,
      movimentacao: updatedMovimentacao
    }
  },

  async gerarRelatorioPdf(filters) {
    const LIMITE_PDF = 5000
    const total = await repository.count(filters)

    if (total > LIMITE_PDF) {
      throw new Error(
        `Foram encontrados ${total.toLocaleString('pt-BR')} registros.\n` +
        `O limite para geração de PDF é ${LIMITE_PDF.toLocaleString('pt-BR')} registros.\n` +
        `Refine os filtros da consulta.`
      )
    }

    const rows = await repository.findAll(filters)

    return rows
      .map(adaptMovimentacao)
      .map(mapMovimentacaoResumo)
  }
})

export default createMovimentacaoService