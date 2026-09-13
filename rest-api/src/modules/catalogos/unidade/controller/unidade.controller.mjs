import Resposta from "../../../../shared/utils/Resposta.mjs"

const createUnidadeController = service => ({
  async index(req, res) {
    const resposta = new Resposta()

    try {
      const dados = await service.index()
      return res.json(resposta.sucesso(dados))
    } catch (erro) {
      return res.json(resposta.falha(`Error: ${erro}`, erro))
    }
  },

  async show(req, res) {
      const resposta = new Resposta()
      const dados = await service.show(req.params.sigla)
      
      return res.json(resposta.sucesso(dados))
  }
})

export default createUnidadeController