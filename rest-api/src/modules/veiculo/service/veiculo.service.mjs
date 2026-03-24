import {
  mapVeiculoResumo,
  mapVeiculoCreatePayload,
  mapVeiculoUpdatePayload,
} from '../mapper/index.mjs'

const toNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

const normalizeIdentificador = valor => valor?.trim().toUpperCase()

const createVeiculoService = repository => ({
  async index({ page = 1, perPage = 25 }) {
    const finalPage = toNumber(page, 1)
    let finalPerPage = toNumber(perPage, 25)

    if (finalPerPage <= 0) {
      finalPerPage = await repository.count()
    }

    const { count, rows } = await repository.findAndCountAll({
      page: finalPage,
      perPage: finalPerPage,
    })

    return {
      total: count,
      rows,
    }
  },

  async show(identificador) {
    const veiculo = await repository.findResumoByIdentificador(
      normalizeIdentificador(identificador)
    )

    if (!veiculo) {
      return null
    }

    return mapVeiculoResumo(veiculo)
  },

  async store(body) {
    const placa = normalizeIdentificador(body.placa)
    const veiculoExists = await repository.findByPlaca(placa)

    if (veiculoExists) {
      return {
        created: false,
        veiculo: veiculoExists,
      }
    }

    const payload = mapVeiculoCreatePayload({
      ...body,
      placa,
    })

    const veiculo = await repository.create(payload)

    return {
      created: true,
      veiculo,
    }
  },

  async update(id, body) {
    const veiculo = await repository.findByPk(id)

    if (!veiculo) {
      return {
        found: false,
      }
    }

    const payload = mapVeiculoUpdatePayload(body)
    const updatedVeiculo = await repository.updateById(id, payload)

    return {
      found: true,
      veiculo: updatedVeiculo,
    }
  },

  async destroy(id) {
    const veiculo = await repository.findByPk(id)

    if (!veiculo) {
      return {
        found: false,
      }
    }

    await repository.destroy(veiculo)

    return {
      found: true,
    }
  },
})

export default createVeiculoService