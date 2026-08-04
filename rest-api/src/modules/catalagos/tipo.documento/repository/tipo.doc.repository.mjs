import Tipo_Documento from "../../../../app/models/Tipo_Documento.mjs"

class TipoDocRepository {
  async findAll() {
    return Tipo_Documento.findAll({
      order: [['id', 'ASC']]
    })
  }
}

export default TipoDocRepository