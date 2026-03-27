import { Sequelize } from 'sequelize'
import Usuario from "../../../app/models/Usuario.mjs"
import Unidade from "../../../app/models/Unidade.mjs"
import Orgao from "../../../app/models/Orgao.mjs"
import Tipo_Documento from "../../../app/models/Tipo_Documento.mjs"
import Tratamento from "../../../app/models/Tratamento.mjs"

const includeDefinitions = {
    unidade: { model: Unidade, as: 'unidade' },
    orgao: { model: Orgao, as: 'orgao' },
    tipoDoc: { model: Tipo_Documento, as: 'tipoDoc' },
    tratamento: { model: Tratamento, as: 'tratamento' }
}

const buildInclude = ({
  resumo = false,
  only = null,
  exclude = [],
  required = [],
  overrides = {},
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
      base.attributtes = []
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

class UsuarioRepository {

  async count() {
    return Usuario.count()
  }

  async findAndCountAll({ page, perPage }) {
    return Usuario.findAndCountAll({
      order: [['id', 'ASC']],
      offset: (page -1) * perPage,
      limit: perPage,
      include: buildInclude(),
    })
  }

  async findResumoByDocumento(documento) {
    return Usuario.findOne({
      where: { documento },
      attributes: [
        ['id', 'user_id'],
        ['documento', 'doc'],
        'nome',
        'tratamento_id',
        'unidade_id',
        'orgao_id',
        'tipo_doc_id',
        [Sequelize.col('tratamento.sigla'), 'graduaAbrev'],
        [Sequelize.col('orgao.sigla_curta'), 'orgaoSigla'],
        [Sequelize.col('unidade.sigla'), 'siglaUbm'],
        [Sequelize.col('tipoDoc.tipo'), 'tipo_doc']
      ],
      include: buildInclude({ resumo: true })
    })
  }

  async findByDocumento(documento) {
    return Usuario.findOne({
      where: {documento },
      include: buildInclude()
    })
  }

  async findByPk(id) {
    return Usuario.findByPk(id, {
      include: 
      buildInclude()
    })
  }

  async create(payload) {
    return Usuario.create(payload)
  }

  async updateById(id, payload) {
    await Usuario.update(payload, {
      where: { id }
    })
    return Usuario.findByPk(id, {
      include: buildInclude()
    })
  }

  async destroy(user) {
    return user.destroy()
  }
}
export default  UsuarioRepository