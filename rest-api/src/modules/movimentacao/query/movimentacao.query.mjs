import { Op, Sequelize } from 'sequelize'
import Veiculo from '../../../app/models/Veiculo.mjs'
import Usuario from '../../../app/models/Usuario.mjs'
import Tipo_Documento from '../../../app/models/Tipo_Documento.mjs'
import Unidade from '../../../app/models/Unidade.mjs'
import Orgao from '../../../app/models/Orgao.mjs'
import Destino from '../../../app/models/Destino.mjs'
import Tratamento from '../../../app/models/Tratamento.mjs'

const includeDefinitions = {
  entradaUser: {
    model: Usuario,
    as: 'entradaUser',
    include: [
      { model: Orgao, as: 'orgao' },
      { model: Tratamento, as: 'tratamento' },
      { model: Tipo_Documento, as: 'tipoDoc' }
    ]
  },

  saidaUser: {
    model: Usuario,
    as: 'saidaUser',
    include: [
      { model: Orgao, as: 'orgao' },
      { model: Tratamento, as: 'tratamento' }
    ]
  },

  destino: {
    model: Destino,
    as: 'destino',
    include: [
      { model: Unidade, as: 'unidade' }
    ]
  },

  veiculo: {
    model: Veiculo,
    as: 'veiculo'
  }
}

export const buildMovimentacaoInclude = ({
  resumo = false,
  only = null,
  exclude = [],
  required = [],
  overrides = {}
} = {}) => {
  let keys = Object.keys(includeDefinitions)

  if (Array.isArray(only) && only.length) {
    keys = keys.filter(key => only.includes(key))
  }

  if (Array.isArray(exclude) && exclude.length) {
    keys = keys.filter(key => !exclude.includes(key))
  }

  return keys.map(key => {
    const base = { ...includeDefinitions[key] }

    if (resumo) {
      base.attributes = []

      if (Array.isArray(base.include)) {
        base.include = base.include.map(item => ({
          ...item,
          attributes: []
        }))
      }
    }

    if (required.includes(key)) {
      base.required = true
    }

    if (overrides[key]) {
      Object.assign(base, overrides[key])
    }

    return base
  })
}

const normalizeDate = value => {
  if (!value) return null

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const normalizeTime = value => {
  if (!value) return null

  const time = String(value).trim()
  if (!time) return null

  return time.length === 5 ? `${time}:00` : time.slice(0, 8)
}

const buildDateTimeFilter = (columnName, start, end, castType = 'DATE') => {
  const conditions = []

  const columnWithTz = Sequelize.literal(
    `("${columnName}" AT TIME ZONE 'America/Sao_Paulo')`
  )

  const normalizedStart =
    castType === 'DATE' ? normalizeDate(start) : normalizeTime(start)

  const normalizedEnd =
    castType === 'DATE' ? normalizeDate(end) : normalizeTime(end)

  if (normalizedStart) {
    conditions.push(
      Sequelize.where(
        Sequelize.cast(columnWithTz, castType),
        Op.gte,
        normalizedStart
      )
    )
  }

  if (normalizedEnd) {
    conditions.push(
      Sequelize.where(
        Sequelize.cast(columnWithTz, castType),
        Op.lte,
        normalizedEnd
      )
    )
  }

  return conditions.length > 0 ? { [Op.and]: conditions } : null
}

export const buildMovimentacaoWhere = ({
  placa,
  documento,
  prefixo,
  condutor,
  dataInicio,
  dataFim,
  horaInicio,
  horaFim,
  query,
  tab,
  identificador,
  emAberto = false
} = {}) => {
  const conditions = []

  const tipo = query || tab
  const busca = identificador?.trim()

  if (tipo) {
    conditions.push({ tipo })
  }

  if (emAberto) {
    conditions.push({ saida: null })
  }

  if (placa) {
    conditions.push({
      '$veiculo.placa$': { [Op.iLike]: `%${placa}%`}
    })
  }

  if (documento) {
    conditions.push({
      [Op.or]: [
        { '$entradaUser.documento$': { [Op.iLike]: `%${documento}%`} },
        { '$saidaUser.documento$': { [Op.iLike]: `%${documento}%`} }
      ]
    })
  }

  if (prefixo) {
    conditions.push({
     '$veiculo.prefixo$': { [Op.iLike]: `%${prefixo}%` }
    })
  }

  if (condutor) {
    conditions.push({
      [Op.or]: [
        { '$entradaUser.nome$': { [Op.iLike]: `%${condutor}%`} },
        { '$saidaUser.nome$': { [Op.iLike]: `%${condutor}%`} }
      ]
    })
  }

  if (busca) {
    conditions.push({
      [Op.or]: [
        { '$entradaUser.documento$': busca },
        {'$veiculo.placa$': { [Op.iLike]: `%${busca}%` } },
        { '$veiculo.marca$': { [Op.iLike]: `%${busca}%`} },
        { '$veiculo.prefixo$': { [Op.iLike]: `%${busca}%`} }
      ]
    })
  }

  if (dataInicio || dataFim) {
    const filtroData = buildDateTimeFilter('entrada', dataInicio, dataFim, 'DATE')
    if (filtroData) conditions.push(filtroData)
  }

  if (horaInicio || horaFim) {
    const filtroHora = buildDateTimeFilter('entrada', horaInicio, horaFim, 'TIME')
    if (filtroHora) conditions.push(filtroHora)
  }

  return conditions.length > 0 ? { [Op.and]: conditions } : {}
}

export const buildMovimentacaoAttributes = ({ resumo = false, tab = null, show = false } = {}) => {
  if (show) {
    return [
      'id',
      'tipo',
      'destino_id',
      'user_entrada_id',
      'veiculo_id',
      [Sequelize.col('entradaUser.documento'), 'documento'],
      [Sequelize.col('entradaUser.nome'), 'nome'],
      [Sequelize.col('entradaUser->orgao.sigla_curta'), 'orgaoSigla'],
      [Sequelize.col('entradaUser->tratamento.sigla'), 'graduaAbrev'],
      [Sequelize.col('veiculo.placa'), 'placa'],
      [Sequelize.col('veiculo.marca'), 'modelo']
    ]
  }

  if (resumo) {
    const attributes = [
      'id',
      'tipo',
      'destino_id',

      [Sequelize.literal(`(entrada AT TIME ZONE 'America/Sao_Paulo')`), 'entrada'],
      [Sequelize.literal(`TO_CHAR(entrada AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS')`), 'hEntrada'],
      [Sequelize.literal(`(saida AT TIME ZONE 'America/Sao_Paulo')`), 'saida'],
      [Sequelize.literal(`TO_CHAR(saida AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS')`), 'hSaida'],

      [Sequelize.col('destino->unidade.sigla'), 'destino_sigla'],

      [Sequelize.col('entradaUser.nome'), 'e_condutor'],
      [Sequelize.col('entradaUser.documento'), 'e_documento'],
      [Sequelize.col('entradaUser->tipoDoc.tipo'), 'e_tipoDoc'],
      [Sequelize.col('entradaUser->tratamento.sigla'), 'e_graduaAbrev'],
      [Sequelize.col('entradaUser->orgao.sigla_curta'), 'e_siglaCurta'],

      [Sequelize.col('saidaUser.nome'), 's_condutor'],
      [Sequelize.col('saidaUser.documento'), 's_documento'],
      [Sequelize.col('saidaUser->tratamento.sigla'), 's_graduaAbrev'],
      [Sequelize.col('saidaUser->orgao.sigla_curta'), 's_siglaCurta']
    ]

    if (tab === 'VEICULO') {
      attributes.push(
        [Sequelize.col('veiculo.placa'), 'placa'],
        [Sequelize.col('veiculo.marca'), 'marca'],
        [Sequelize.col('veiculo.prefixo'), 'prefixo']
      )
    }
    return attributes
  }
  return undefined
}
