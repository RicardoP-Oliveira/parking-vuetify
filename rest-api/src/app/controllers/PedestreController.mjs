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

  async show(req, res) {
    const resposta = new Resposta();
    const { doc } = req.params || '';
    
    try {
      const pedestre = await Pedestre.findOne({
        where: {
          nDoc: doc,
          saida: null
        }
      })

      if (pedestre) {
        resposta.dados = pedestre;
      } else {
        resposta.erro = true;
        resposta.msg = "Nenhum registro encontrado!"
      }

      
    } catch (error) {
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro na busca dos dados!"
    }

    return res.json(resposta);
  }

  async store(req, res) {
    const body = req.body;
    var pedestre;
    
    const data = {
      ...body,
      'entrada': dateFormatter(new Date()),
      'hEntrada': new Date().toLocaleTimeString(),
    }

    const entrada = await Pedestre.findOne({
      where: {
        nDoc: body.nDoc,
        saida: null
      },
      order: [['updatedAt', 'DESC']]
    })

    if (!entrada) {
      pedestre = await Pedestre.create(data);
    } else {
      const updatePedestre = {
        'saida': dateFormatter(new Date()),
        'hSaida': new Date().toLocaleTimeString(),
      }
      pedestre = await entrada.update(updatePedestre)
    }

    return res.json(pedestre)
  }
  

  async update(req, res) {}

  async destroy(req, res) {}
}

    export default new PedestreController();
