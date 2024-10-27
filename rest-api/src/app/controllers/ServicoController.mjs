import Ceics from '../models/ceics.mjs';
import Servico from '../models/servico.mjs';
import Resposta from '../models/Resposta.mjs';

class ServicoController {
  async index(req, res) {
    const resposta = new Resposta();
    const listAll = await Servico.getData();
    if (listAll) {
      resposta.dados = listAll;
    }

    return res.json(resposta);
  }

  async store(req, res) {
    const resposta = new Resposta();
    res.json({"ServicoController.store": req.body})
  }

  async list(req, res) {
    const resposta = new Resposta();
    const serviceDay = await Ceics.serviceDay();
    resposta.dados = serviceDay;

    return res.json(resposta);
  }
}

export default new ServicoController()