import {
  mapUsuarioResumo,
  mapUsuarioUpdatePayload,
  mapUsuarioCreatePayload
} from '../mapper/index.mjs'

const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const createUsuarioService = (repository) => ({
  async index({ page = 1, perPage = 50 }) {
    const finalPage = toNumber(page, 1)
    let finalPerPage = toNumber(perPage, 50)

    if (finalPerPage <= 0) {
      finalPerPage = await repository.count()
    }

    return repository.findAndCountAll({
      page: finalPage,
      perPage: finalPerPage,
    })
  },

  async show(documento) {
    const user = await repository.findResumoByDocumento(documento)

    if (!user) {
      return null
    }

    return mapUsuarioResumo(user)
  },

  async store(body) {
    const userExists = await repository.findByDocumento(body.documento)

    if (userExists) {
      return {
        created: false,
        user: userExists,
      }
    }

    const payload = mapUsuarioCreatePayload(body)
    const user = await repository.create(payload)

    return {
      created: true,
      user,
    }
  },

  async update(id, body) {
    const user = await repository.findByPk(id)

    if (!user) {
      return {
        found: false,
      }
    }

    const payload = mapUsuarioUpdatePayload(body)
    const updatedUser = await repository.updateById(id, payload)

    return {
      found: true,
      user: updatedUser,
    }
  },

  async destroy(id) {
    const user = await repository.findByPk(id)

    if (!user) {
      return {
        found: false,
      }
    }

    await repository.destroy(user)

    return {
      found: true,
    }
  },
})

export default createUsuarioService