import { mapToOptions } from "../../shared/option.mapper.mjs"

const createUnidadeService = repository => ({
  async index() {
    const items = await repository.findAll()

    return mapToOptions(items, item => item.sigla)
  }
})

export default createUnidadeService