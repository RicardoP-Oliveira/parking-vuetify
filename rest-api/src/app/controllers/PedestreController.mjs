import Resposta from '../models/Resposta.mjs';
import Pedestre from '../models/pedestre.mjs';
import { Op } from 'sequelize';

function dateFormatter (data){
  const dd = data.getDate();
  const mm = data.getMonth() + 1;
  const aaaa = data.getFullYear();
  return `${aaaa}-${mm}-${dd}`;
}

class PedestreController {
  async index(req, res) {
    const resposta = new Resposta();
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 0;
    
    const {
      pedestre,
      documento,
      dataEntradaInicio,
      dataEntradaFim,
      horaEntradaInicio,
      horaEntradaFim,
      dataSaidaInicio,
      dataSaidaFim, 
      horaSaidaInicio,
      horaSaidaFim,
    } = req.query;

    let whereCondition = {};

    const conditions = [];

    if (pedestre) {
      conditions.push({ name: {[Op.iLike]: `%${pedestre}%`}});
    }

    if (documento) {
      conditions.push({ nDoc: {[Op.iLike]: `%${documento}%`}});
    }
    
    if (dataEntradaInicio || dataEntradaFim) {
      const entradaDataCondition = {};
      if (dataEntradaInicio) {
        const formattedDate = dataEntradaInicio;
        if (formattedDate) { // Garante que dateFormatter retornou algo válido
          entradaDataCondition[Op.gte] = formattedDate;
        }
      }
      if (dataEntradaFim) {
        const formattedDate = dataEntradaFim;
        if (formattedDate) { // Garante que dateFormatter retornou algo válido
          entradaDataCondition[Op.lte] = formattedDate;
        }
      }

      if (Reflect.ownKeys(entradaDataCondition).length > 0){
        conditions.push({ entrada: entradaDataCondition });
      }
    }

    if (dataSaidaInicio || dataSaidaFim) {
      const saidaDateCondition = {};
      if (dataSaidaInicio) {
        const formattedDate = dataSaidaInicio;
        if (formattedDate) {
          saidaDateCondition[Op.gte] = formattedDate;
        }
      }
      if (dataSaidaFim) {
        const formattedDate = dataSaidaFim;
        if (formattedDate) {
          saidaDateCondition[Op.lte] = formattedDate;
        }
      }
      if (Reflect.ownKeys(saidaDateCondition).length > 0) {
        conditions.push({ saida: saidaDateCondition});
      }
    }

    if (horaEntradaInicio || horaEntradaFim) {
      const entradaTimeCondition = {};
      if (horaEntradaInicio) {
        entradaTimeCondition[Op.gte] = horaEntradaInicio;
      }
      if (horaEntradaFim) {
        entradaTimeCondition[Op.lte] = horaEntradaFim;
      }
      if (Reflect.ownKeys(entradaTimeCondition).length > 0) {
        conditions.push({ hEntrada: entradaTimeCondition});
      }
    }

    if (horaSaidaInicio || horaSaidaFim) {
      const saidaTimeCondition = {};
      if (horaSaidaInicio) {
        saidaTimeCondition[Op.gte] = horaSaidaInicio;
      }
      if (horaSaidaFim) {
        saidaTimeCondition[Op.lte] = horaSaidaFim;
      }
      if (Reflect.ownKeys(saidaTimeCondition).length > 0) {
        conditions.push({ hSaida: saidaTimeCondition});
      }
    }

    if (conditions.length > 0) {
      whereCondition = {[Op.and]: conditions};
    } else {
      whereCondition = {};
    }

    try {
      if (perPage <= 0) {
        perPage = await Pedestre.count({ where: whereCondition});
      }
      const { count, rows } = await Pedestre.findAndCountAll({
        where: whereCondition,
        order: [['updatedAt', 'DESC']],
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
    const { doc } = req.params;    
    try {
      const pedestre = await Pedestre.findOne({
        order: [['updatedAt', 'DESC']],
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
}

export default new PedestreController();
