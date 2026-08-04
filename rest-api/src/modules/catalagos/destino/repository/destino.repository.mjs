import Destino from '../../../../app/models/Destino.mjs'
import Unidade from '../../../../app/models/Unidade.mjs'

class DestinoRepository {
  async findAll() {
    return Destino.findAll({
      where: { ativo: true },
      include: [
        {
          model: Unidade,
          as: 'unidade',
          attributes: ['sigla']
        }
      ],
      order: [['id', 'ASC']]
    })
  }
}

export default DestinoRepository