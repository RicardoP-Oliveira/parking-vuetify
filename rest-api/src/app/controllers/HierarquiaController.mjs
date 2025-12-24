import Hierarquia from '../models/hierarcar.mjs'

class HierarquiaController {
  async index(req, res) {
    const response = await Hierarquia.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    return res.json(response);
  }

  async show(req, res) {
    // ToDo lógica
  }

  async update(req, res) {
   // ToDo lógica
  }

  async store (req, res) {
   // ToDo lógica
  }

  async delete (req, res) {
    // ToDo lógica
  }
}

export default new HierarquiaController();