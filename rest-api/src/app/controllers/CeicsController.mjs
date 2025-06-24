import Carro from '../models/carro.mjs';
import Ceics from '../models/ceics.mjs';
import vtrAdd from '../models/vtradd.mjs';
import Resposta from '../models/Resposta.mjs';
import { Op } from 'sequelize';

class CeicsController {
  async index(req, res) {
    const resposta = new Resposta();
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 0;

    const {
      placa,
      documento,
      modelo,
      condutor,
      dataEntradaInicio,
      dataEntradaFim,
      dataSaidaInicio,
      dataSaidaFim,
      horaEntradaInicio,
      horaEntradaFim,
      horaSaidaInicio,
      horaSaidaFim
    } = req.query;

    let whereCondition = {};

    const conditions = [];

    if(placa) {
      conditions.push({ placa: {[Op.iLike]: `%${placa}%`}});
    }
    
    if (documento) {
      conditions.push({
        [Op.or]: [
          { eRg: { [Op.iLike]: `%${documento}%`}},
          { sRg: { [Op.iLike]: `%${documento}%`}}
        ]
      });
    }
    
    if (modelo) {
      conditions.push({ marcaModelo: { [Op.iLike]: `%${modelo}%`}});
    }

    if (condutor) {
      console.log(condutor)
      conditions.push({
        [Op.or]: [
          { eCondutor: { [Op.iLike]: `%${condutor}%`}},
          { sCondutor: { [Op.iLike]: `%${condutor}%`}}  
        ]
      });
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
        console.log("data:", saidaTimeCondition)
        conditions.push({ hSaida: saidaTimeCondition});
      }
    }

    if (conditions.length > 0) {
      whereCondition = {[Op.and]: conditions};
    } else {
      whereCondition = {};
    }

    try {
      if(perPage <=0 ){
        perPage = await Ceics.count({ where: whereCondition });
      }

      const { count, rows } = await Ceics.findAndCountAll({
        order: [['updatedAt', 'DESC']],
        where: whereCondition,
        offset: (page - 1) * perPage,
        limit: perPage,
      });

      resposta.dados = rows;
      var total = count;  
      
    } catch(erro) {
      console.error("Erro na busca dos dados: ", erro);
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro na busca dos dados!"
      resposta.dados = erro.message;
    }
    return res.json([resposta, total]);
  }

  async show(req, res) {
    const resposta = new Resposta();
    const { placa } = req.params;
    const defaultRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;

    try {
      const veiculo = await Carro.findCar(placa);
      
      if (veiculo) {
        // Se o veículo for encontrado
        resposta.dados = veiculo;
        resposta.msg = 'Veículo encontrado com sucesso!';
      } else {
        // Caso o veículo não encontrado
        resposta.erro = true;
        if (defaultRegex.test(placa)) {
          resposta.msg = 'Visitante';
          resposta.visitor = true
        } else {
          resposta.msg = 'Viatura não cadastrada!\nContate o Administrator do sistema.'
        }    
      }

    } catch (error) {
      resposta.erro = true;
      resposta.msg = `Error: ${error}`;
      resposta.dados = error;
    }

    return res.json(resposta);
   
  }

  async parking(req, res) {
    const resposta = new Resposta();
    const { placa } = req.params;
    try {
       const veiculo = await Ceics.findCar(placa);
       
      if (veiculo) {
        resposta.dados = veiculo;
      } else {
        resposta.erro = true;
        resposta.msg = 'Não contas saída em aberto para este veículo!';
      }

    } catch (error) {
      resposta.erro = true;
      resposta.msg = `Error: ${error}`;
    }

    return res.json(resposta);
  }

  async store (req, res) {
   const { placa, condutor, destino, documento, marcaModelo, owner } = req.body;

  const dataParking = {
    placa: placa,
    marcaModelo: marcaModelo,
    eCondutor: condutor,
    eRg: documento,
    destino,
    entrada: new Date(),
    hEntrada: new Date().toLocaleTimeString(),
  }

  const vaga = await Ceics.findOne({
    where: [
      {
        placa: placa
      },
      {
        saida: null
      }
    ],
    order: [['updatedAt', 'DESC']],
  });

  if(!vaga){
    try {
      var saida = await Ceics.create(dataParking);
    } catch (error) {
      console.warn(`[erro] Ocorreu o erro: ${error}`);
    }
    
    const vtrPattern = /^([A-Z][A-Z0-9]{1,5}-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$)/;

    if (vtrPattern.test(marcaModelo) || vtrPattern.test(placa)) {
      const addVtr = {
        placa,
        prefix: marcaModelo,
        owner,
        documento
      }
      try {
        const exist = await vtrAdd.findOne({
          where: {
           placa: { [Op.iLike]: `%${placa}%`},
          }});
        if (!exist) {
          await vtrAdd.create(addVtr);
        }
        
      } catch (error) {
        console.warn(`[erro] Ocorreu o erro: ${error}`);
      } 
    }
  } else {
    var dados = {
      sCondutor: condutor,
      sRg: documento,
      saida: new Date(),
      hSaida: new Date().toLocaleTimeString(),
    }
    var saida = await vaga.update(dados);
  }

   return res.json(saida);
  }
}

export default new CeicsController();
