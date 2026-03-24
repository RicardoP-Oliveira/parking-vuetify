import Tratamento from "../../../../app/models/Tratamento.mjs"

class TratamentoRepository {
  async findAll() {
    return Tratamento.findAll({
      order: [['id', 'ASC']]
    })
  }
}

export default TratamentoRepository