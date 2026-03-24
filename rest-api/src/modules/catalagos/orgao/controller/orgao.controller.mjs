import Resposta from "../../../../shared/utils/Resposta.mjs"

const createOrgaoController = service => ({
  async index(req, res) {
    const resposta = new Resposta()

    try {
      const dados = await service.index()
      return res.json(resposta.sucesso(dados))
    } catch (erro) {
      return res.json(resposta.falha(`Error: ${erro}`, erro))
    }
  }
})

export default createOrgaoController