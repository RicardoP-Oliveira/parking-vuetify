import { mapToOptions } from "../../shared/option.mapper.mjs"

const createTipoDocService = repository => ({
  async index() {
    const items = await repository.findAll()

    return mapToOptions(items, item => item.tipo)
  }
})

export default createTipoDocService