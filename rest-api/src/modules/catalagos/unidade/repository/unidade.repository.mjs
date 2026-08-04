import Unidade from "../../../../app/models/Unidade.mjs"

class UnidadeRepository {
  async findAll() {
    return Unidade.findAll({
      order: [['id', 'ASC']]
    })
  }
}

export default UnidadeRepository