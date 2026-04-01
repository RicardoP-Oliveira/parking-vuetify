import { Op, Sequelize } from 'sequelize'
import Veiculo from '../../../app/models/Veiculo.mjs'
import Usuario from '../../../app/models/Usuario.mjs'
import Unidade from '../../../app/models/Unidade.mjs'
import Orgao from '../../../app/models/Orgao.mjs'
import Tipo_Documento from '../../../app/models/Tipo_Documento.mjs'
import Tratamento from '../../../app/models/Tratamento.mjs'

const buildIncludeIndex = () => ([
  {
    model: Usuario,
    as: 'user',
    attributes: [],
    include: [
      {
        required: true,
        model: Unidade,
        as: 'unidade',
        attributes: [],
      },
      {
        model: Tipo_Documento,
        as: 'tipoDoc',
      },
    ],
  },
  {
    model: Orgao,
    as: 'orgao',
  },
])

const buildIncludeShow = () => ([
  {
    model: Usuario,
    as: 'user',
    attributes: [],
    include: [
      { model: Tratamento, as: 'tratamento', attributes: [] },
      { model: Tipo_Documento, as: 'tipoDoc', attributes: [] },
      { model: Unidade, as: 'unidade', attributes: [] },
      { model: Orgao, as: 'orgao', attributes: [] },
    ],
  },
])

const buildIncludeBase = () => ([
  {
    model: Usuario,
    as: 'user',
  },
  {
    model: Orgao,
    as: 'orgao',
  },
])

class VeiculoRepository {
  async count() {
    return Veiculo.count()
  }

  async findAndCountAll({ page, perPage }) {
    return Veiculo.findAndCountAll({
      order: [['id', 'ASC']],
      offset: (page - 1) * perPage,
      limit: perPage,
      include: buildIncludeIndex(),
    })
  }

  async findByPlaca(placa) {
    return Veiculo.findOne({
      where: { placa },
      include: buildIncludeBase(),
    })
  }

  async findResumoByIdentificador(identificador) {
    return Veiculo.findOne({
      where: {
        [Op.or]: [
          { placa: { [Op.iLike]: `%${identificador}%` } },
          { marca: { [Op.iLike]: `%${identificador}%` } },
          { prefixo: { [Op.iLike]: `%${identificador}%` } },
        ],
      },
      attributes: [
        'id',
        'placa',
        'marca',
        'modelo',
        'prefixo',
        'renavam',
        'usuario_id',
        'orgao_id',
        [Sequelize.col('user.unidade_id'), 'ubm_id'],
        [Sequelize.col('user.documento'), 'documento'],
        [Sequelize.col('user.nome'), 'condutor'],
        [Sequelize.col('user.tipo_doc_id'), 'doc_id'],
        [Sequelize.col('user.tratamento_id'), 'gradua_id'],
        [Sequelize.col('user->tipoDoc.tipo'), 'docSigla'],
        [Sequelize.col('user->unidade.unidade'), 'nomeUbm'],
        [Sequelize.col('user->tratamento.sigla'), 'graduaAbrev'],
        [Sequelize.col('user->orgao.sigla_curta'), 'orgaoSigla'],
      ],
      include: buildIncludeShow(),
    })
  }

  async findByPk(id) {
    return Veiculo.findByPk(id, {
      include: buildIncludeBase(),
    })
  }

  async create(payload) {
    return Veiculo.create(payload)
  }

  async updateById(id, payload) {
    await Veiculo.update(payload, {
      where: { id },
    })

    return Veiculo.findByPk(id, {
      include: buildIncludeBase(),
    })
  }

  async destroy(veiculo) {
    return veiculo.destroy()
  }
}

export default VeiculoRepository