import Carro from '../models/carro.mjs';
import Ceics from '../models/ceics.mjs';
import Resposta from '../models/Resposta.mjs';
import { Op } from 'sequelize';


function dateFormatter (data){
  const dd = data.getDate();
  const mm = data.getMonth() + 1;
  const aaaa = data.getFullYear();
  return `${mm}-${dd}-${aaaa}`;
}

class CeicsController {
  async index(req, res) {
    const resposta = new Resposta();
    const { query } = req.query;
    const page = req.query.page || 1;
    let perPage = req.query.perPage || 0;
   
    try {
      if(perPage <=0 ){
        perPage = await Ceics.count();
      }

      const whereCondition = query
        ? {
          [Op.or]: [
            {placa : { [Op.iLike]: `%${query}%`}},
            {eRg: { [Op.iLike]: `${query}`}},
            {eCondutor: { [Op.iLike]: `%${query}%`}},
            {sRg: { [Op.iLike]: `${query}`}},
            {sCondutor: { [Op.iLike]: `%${query}%`}},
            {marcaModelo: { [Op.iLike]: `%${query}%`}}
          ]
        }
        : {};

      const { count, rows } = await Ceics.findAndCountAll({
        order: [['updatedAt', 'DESC']],
        where: whereCondition,
        offset: (page - 1) * perPage,
        limit: perPage,
        });
      
      resposta.dados = rows;
      var total = count;  
      

    } catch(erro) {
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro na busca dos dados!"
      resposta.dados = erro;
    }

      return res.json([resposta, total]);
  }

  async show(req, res) {
    const resposta = new Resposta();
    const { placa } = req.params;

    try {
       const buscaCar = await Carro.findCar(placa);
       const { veiculo, searchCriteria } = buscaCar;

      if (!veiculo && (searchCriteria.id || searchCriteria.marcaModelo)) {
        resposta.erro = true;
        resposta.msg = 'Veículo não cadastrado!\nContate o Administrador.';
      } else if (!veiculo && searchCriteria.placa){
        resposta.msg = 'Veículo visitante.';
        resposta.visitor = true;
      }  else {
        resposta.dados = buscaCar.veiculo;
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
       const buscaCar = await Ceics.findCar(placa);

      if (buscaCar) {
        resposta.dados = buscaCar;
      } else {
        resposta.erro = true;
        resposta.msg = 'Não contas saída em aberto para este veículo!';
      }

    } catch (error) {
      console.log('Aqui')
      resposta.erro = true;
      resposta.msg = `Error: ${error}`;
    }

    return res.json(resposta);
  }

  async store (req, res) {
   const { placa, condutor, destino, documento, marcaModelo } = req.body;

  const dataParking = {
    placa: placa,
    marcaModelo: marcaModelo,
    eCondutor: condutor,
    eRg: documento,
    destino,
    entrada: dateFormatter(new Date()),
    hEntrada: new Date().toLocaleTimeString(),
  }

  const vaga = await Ceics.findOne({where: [{ placa: placa }, {saida: null}]});

  if(!vaga){
      var saida = await Ceics.create(dataParking);
  } else {
    var dados = {
      sCondutor: condutor,
      sRg: documento,
      saida: dateFormatter(new Date()),
      hSaida: new Date().toLocaleTimeString(),
    }
    var saida = await vaga.update(dados);
  }

   return res.json(saida);
  }

  async storePedestre (req, res) {
    const { placa, condutor, destino, documento } = req.body;

  const dataParking = {
    placa: placa,
    eCondutor: condutor,
    eRg: documento,
    destino,
    entrada: dateFormatter(new Date()),
    hEntrada: new Date().toLocaleTimeString(),
  }

  const vaga = await Ceics.findOne({where: [{ eRg: documento, placa: 'PEDESTRE' , saida: null}]});

  if(!vaga){
      var saida = await Ceics.create(dataParking);
  } else {
    var dados = {
      sCondutor: condutor,
      sRg: documento,
      saida: dateFormatter(new Date()),
      hSaida: new Date().toLocaleTimeString(),
    }
    var saida = await vaga.update(dados);
  }

   return res.json(saida);
  }
}

export default new CeicsController();
