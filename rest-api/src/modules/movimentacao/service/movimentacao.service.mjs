import {
  mapMovimentacaoResumoLista,
  mapMovimentacaoResumoAberto,
  mapMovimentacaoCreatePayload,
  mapMovimentacaoSaidaPayload
} from '../mapper/index.mjs'

import { toNumber } from '../../../shared/utils/mapperUtils.mjs'


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
      rows: result.rows.map(mapMovimentacaoResumoLista)
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
    return mapMovimentacaoResumoAberto(movimentacao)
  },

  async store({ tab, body }){
    const payload = mapMovimentacaoCreatePayload({ tab, body })
    const createMovimentacao = await repository.create(payload)

    return {
      created: true,
      movimentacao: createMovimentacao
    }
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

    const payload = mapMovimentacaoSaidaPayload(body)
    const updatedMovimentacao = await repository.updateById(body.registro_id, payload)

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

    return rows.map(mapMovimentacaoResumoLista)
  }
})

export default createMovimentacaoService