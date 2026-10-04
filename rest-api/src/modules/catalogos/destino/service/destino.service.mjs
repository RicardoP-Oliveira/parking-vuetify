import { mapToOptions } from "../../shared/option.mapper.mjs"

const createDestinoService = repository => ({
  async index() {
    const item = await repository.findAll()
    return mapToOptions(item, item => item.destino)
  }
})

export default createDestinoService