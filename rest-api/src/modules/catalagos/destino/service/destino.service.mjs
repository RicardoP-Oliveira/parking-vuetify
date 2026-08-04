import { mapToOptions } from "../../shared/option.mapper.mjs"

const createDestinoService = repository => ({
  async index() {
    const items = await repository.findAll()
    
    return mapToOptions(
      items,
      item => item.unidade?.sigla
    )
  }
})

export default createDestinoService