import Orgao from "../../../../app/models/Orgao.mjs"

class OrgaoRepository {
  async findAll() {
    return Orgao.findAll({
      order: [['id', 'ASC']]
    })
  }
}

export default OrgaoRepository