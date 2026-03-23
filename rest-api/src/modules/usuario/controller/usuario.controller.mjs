import Resposta from "../../../shared/utils/Resposta.mjs"

const createUsuarioController = service => ({
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
    
    const { documento } = req.params

    const user = await service.show(documento)

    if (!user) {
      return res.status(404).json(
        resposta.falha('Usuário não encontrado.')
      )
    }

    return res.json(
      resposta.sucesso((user))
  )
  },

  async store(req, res) {
    const resposta = new Resposta()
    
    const { body } = req

    const result = await service.store(body)

    if (!result.created) {
      return res.status(409).json(
        resposta.falha('Usuário já cadastrado.', result.user)
      )
    }

    return res.status(201).json(
      resposta.sucesso(result.user, 'Usuário criado com sucesso.')
    )
  },

  async update(req, res) {
    const resposta = new Resposta()
    
    const { id } = req.params
    const { body, file } = req

    const result = await service.update(id, body)

    if (!result.found) {
      return res.status(404).json(
        resposta.falha('Usuário não encontrado.')
      )
    }

    return res.json(
      resposta.sucesso(result.user, 'Usuário atualizado com sucesso.')
    )
  },

  async destroy(req, res) {
    const resposta = new Resposta()
    
    const { id } = req.params

    const result = await service.destroy(id)

    if (!result.found) {
      return res.status(404).json(
        resposta.falha('Usuário não encontrado.')
      )
    }

    return res.json(
      resposta.sucesso(null, 'Usuário removido com sucesso')
    )
  },
})

export default createUsuarioController