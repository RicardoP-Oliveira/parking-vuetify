import Tratamento from "../models/Tratamento.mjs";

class TratamentoController {
  async index(req, res) {
    const response = await Tratamento.findAll({
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

export default new TratamentoController();