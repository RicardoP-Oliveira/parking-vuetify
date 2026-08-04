import Movimentacao from '../../../app/models/Movimentacao.mjs'
import {
  buildMovimentacaoWhere,
  buildMovimentacaoAttributes,
  buildMovimentacaoInclude
} from '../query/index.mjs'

class MovimentacaoRepository {
  async count(filters = {}) {
    const tab = filters.query || filters.tab
    
    return Movimentacao.count({
      where: buildMovimentacaoWhere(filters),
      include: buildMovimentacaoInclude({
        resume: true,
        exlude: tab === 'VEICULO' ? [] : ['veiculo']
      }),
      distinct: true
    })
  }

  async findAll(filters = {}) {
    const tab = filters.query || filters.tab

    return Movimentacao.findAll({
      order: [['updated_at', 'DESC']],
      where: buildMovimentacaoWhere(filters),
      attributes: buildMovimentacaoAttributes({ resumo: true, tab }),
      include: buildMovimentacaoInclude({
        resumo: true,
        exclude: tab === 'VEICULO' ? [] : ['veiculo'],
      }),
      subQuery: false
    })
  }

  async findAndCountAll({ page, perPage, ...filters }) {
    const tab = filters.query || filters.tab

    return Movimentacao.findAndCountAll({
      order: [['updated_at', 'DESC']],
      where: buildMovimentacaoWhere(filters),
      attributes: buildMovimentacaoAttributes({ resumo: true, tab }),
      include: buildMovimentacaoInclude({
        resume: true,
        exclude: tab === 'VEICULO' ? [] : ['veiculo']
      }),
      offset: (page -1) * perPage,
      limit: perPage,
      subQuery: false,
      distinct: true
    })
  }

  async findResumoByIdentificador({ identificador, tab }) {
    return Movimentacao.findOne({
      order: [['updated_at', 'DESC']],
      where: buildMovimentacaoWhere({
        identificador,
        tab,
        emAberto: true
      }),
      attributes: buildMovimentacaoAttributes({ show: true }),
      include: buildMovimentacaoInclude({
        resume: true,
        only: ['entradaUser', 'destino', 'veiculo']
      })
    })
  }

  async findByPk(id) {
    return Movimentacao.findByPk(id, {
      include: buildMovimentacaoInclude()
    })
  }

  async updateById(id, payload) {
    await Movimentacao.update(payload, {
      where: { id }
    })
    return Movimentacao.findByPk(id, {
      include: buildMovimentacaoInclude()
    })
  }

  async create(payload) {
    return Movimentacao.create(payload)
  }
}

export default MovimentacaoRepository