import Resposta from '../../../shared/utils/Resposta.mjs'

const createVeiculoController = service => ({
  async index(req, res) {
    const resposta = new Resposta()
    
    const { page = 1, perPage = 50 } = req.query
    const result = await service.index({ page, perPage })
    
    return res.json(
      resposta.sucesso(result)
    )
  },

  async show(req, res) {
    const resposta = new Resposta()
    const { placa } = req.params

    const veiculo = await service.show(placa)

    if (!veiculo) {
      return res.json(
        resposta.falha('Veículo não encontrado.')
      )
    } 

    return res.json(
      resposta.sucesso(veiculo)
    )
  },

  async store(req, res) {
    const resposta = new Resposta()

    const result = await service.store(req.body)

    if (!result.created) {
      return res.status(409).json(
        resposta.falha('Veículo já cadastrado', result.veiculo)
      )
    } 

    return res.status(201).json(
      resposta.sucesso(result.veiculo, 'Veículo criado com sucesso.')
    )
  },

  async update(req, res) {
    const resposta = new Resposta()
    const { id } = req.params

    const result = await service.update(id, req.body)

    if (!result.found) {
      return res.status(404).json(
        resposta.falha('Veículo não encontrado.')
      )
    } 

    return res.json(
      resposta.sucesso(result.veiculo, 'Veículo atualizado com sucesso.')
    )
  },

  async destroy(req, res) {
    const resposta = new Resposta()
    const { id } = req.params

    const result = await service.destroy(id)

    if (!result.found) {
      return res.status(404).json(
        resposta.falha('Veículo não encontrado.')
      )
    }

    return res.json(
      resposta.sucesso('Veículo removido com sucesso.')
    )
  },
})

export default createVeiculoController