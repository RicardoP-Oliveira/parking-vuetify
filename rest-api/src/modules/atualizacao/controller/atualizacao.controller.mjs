const createAtualizacaoController = service => ({
  async index(req, res) {
    const result = await service.index()
    return res.json(result);
  },

  async configure(req, res) {
    const arquivos = req.files ?? [];

    const dados = {};

    for (const arquivo of arquivos) {
      const nome = arquivo.originalname.toLowerCase()
      const conteudo = arquivo.buffer.toString('utf8')


      if (nome.match(/dicionario/)) {
        dados.dicionario_dados = conteudo
      } else {
        dados.dgp_dados = conteudo
      }
    }
    const result = await service.configurarTable(dados)
    return res.json(result)
  }
})

export default createAtualizacaoController;