import Document from '../models/documentos.mjs'

class DocumentController {
  async index(req, res) {
    const doc = await Document.findAll({
      order: [
        ['id', 'ASC']
      ]
    });
    return res.json(doc);
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

export default new DocumentController();