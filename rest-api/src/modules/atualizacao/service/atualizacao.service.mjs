const createAtualizacaoService = repository => ({
  async index() {
    return await repository.testFunctionaly();

  },

  async configurarTable(dados) {
    return repository.configurar(dados)
  }
})

export default createAtualizacaoService;