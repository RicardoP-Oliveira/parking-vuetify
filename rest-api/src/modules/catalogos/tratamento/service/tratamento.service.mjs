import { mapToOptions } from "../../shared/option.mapper.mjs"

const createTratamentoService = repository => ({
  async index() {
    const items = await repository.findAll()

    return mapToOptions(items, item => item.posto_grad)
  }
})

export default createTratamentoService