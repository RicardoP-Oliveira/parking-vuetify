import Target from '../models/target.mjs';

class DestinoController {
  async index(req, res) {
    const dest = await Target.findAll({
      order: [
        ['target', 'ASC']
      ]
    });
    return res.json(dest);
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

export default new DestinoController();
