import Tipo_Documento from "../models/Tipo_Documento.mjs"
import Resposta from "../models/Resposta.mjs"

class TipoDocController {
  async index(req, res) {
    const resposta = new Resposta()
    const tipoDoc = await Tipo_Documento.findAll({
      order: [
        ['id', 'ASC']
      ]
    })
    if (!tipoDoc) {
      resposta.erro = true
      resposta.msg = 'Nenhum dado encontrado!'
      return res.json(resposta)
    }
    resposta.dados = tipoDoc
    return res.json(resposta)
  }
}

export default new TipoDocController()