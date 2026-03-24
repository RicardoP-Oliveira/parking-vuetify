import { mapToOptions } from "../../shared/option.mapper.mjs"

const createOrgaoService = repository => ({
    async index() {
    const items = await repository.findAll()

    return mapToOptions(items, item => item.sigla)
  }
})

export default createOrgaoService