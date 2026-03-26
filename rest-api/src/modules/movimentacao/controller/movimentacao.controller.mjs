import Resposta from '../../../shared/utils/Resposta.mjs'

const createMovimentacaoController = service => ({
  async index(req, res) {
    const resposta = new Resposta()

    const { page = 1, perPage = 50, ...filters} = req.query
    const result = await service.index({ page, perPage, ...filters })

    resposta.dados = result.rows
    return res.json([
      resposta, result.count
    ]
    )
  },

  async show(req, res) {
    const resposta = new Resposta()

    const { identificador } = req.params
    const { tab } = req.headers

    const movimentacao = await service.show({
      identificador,
      tab
    })

    if (!movimentacao) {
      return res.json(
        resposta.falha('Nenhum registro encontrado.')
      )
    }

    return res.json(
      resposta.sucesso(movimentacao)
    )
  },

  async store(req, res) {
    const resposta = new Resposta()

    const result = await service.store({
      tab: req.headers.tab,
      body: req.body
    })

    return res.status(201).json(
      resposta.sucesso(service.movimentacao, 'Movimentação criada com sucesso.')
    )
  },

  async resgistrarSaida(req, res){
    const resposta = new Resposta()

    const result = await service.registrarSaida(req.body)

    if (result.ivalid) {
      return res.json(
        resposta.falha('Registro não encontrado.')
      )
    }

    return res.json(
      resposta.sucesso(result.movimentacao, 'Saída registrada com sucesso.')
    )
  }
})

export default createMovimentacaoController