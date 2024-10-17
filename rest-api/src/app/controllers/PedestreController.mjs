import Resposta from '../models/Resposta.mjs';
import Pedestre from '../models/pedestre.mjs';
import { Op } from 'sequelize';

function dateFormatter (data){
  const dd = data.getDate();
  const mm = data.getMonth() + 1;
  const aaaa = data.getFullYear();
  return `${mm}-${dd}-${aaaa}`;
}

class PedestreController {
  async index(req, res) {
    const resposta = new Resposta();
    const { query } = req.query;
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 0;

    try {
      if (perPage <= 0) {
        perPage = await Pedestre.count();
      }
      const { count, rows } = await Pedestre.findAndCountAll({
        order: [['updatedAt', 'DESC']],
        where:{
          nDoc: {
            [Op.ne]: null,
            [Op.ne]: '',
          }
        },
        offset: (page - 1) * perPage,
        limit: perPage,
      });

      resposta.dados = rows;
      var total = count; 

    } catch (erro) {
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro na busca dos dados!"
      resposta.dados = erro;
    }
    return res.json([resposta, total]);
  }
}

    export default new PedestreController();
