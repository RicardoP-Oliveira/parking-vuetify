import Carro from '../models/carro.mjs'
import Ceics from '../models/ceics.mjs'
import vtrAdd from '../models/vtradd.mjs'
import Resposta from '../models/Resposta.mjs'
import User from '../models/user.mjs'
import Document from '../models/documentos.mjs'
import Ubm from '../models/ubm.mjs'
import Orgao from '../models/orgao.mjs'
import Hierarquia from '../models/hierarcar.mjs'
import { Op, Sequelize } from 'sequelize'

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
      dataInicio,
      dataFim,
      dataSaidaInicio,
      dataSaidaFim,
      horaInicio,
      horaFim,
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
      conditions.push({
        [Op.or]: [
          { eCondutor: { [Op.iLike]: `%${condutor}%`}},
          { sCondutor: { [Op.iLike]: `%${condutor}%`}}  
        ]
      });
    }

    if (dataInicio || dataFim) {
      const entradaDataCondition = {};
      if (dataInicio) {
        const formattedDate = dataInicio;
        if (formattedDate) { // Garante que dateFormatter retornou algo válido
          entradaDataCondition[Op.gte] = formattedDate;
        }
      }
      if (dataFim) {
        const formattedDate = dataFim;
        if (formattedDate) { // Garante que dateFormatter retornou algo válido
          entradaDataCondition[Op.lte] = formattedDate;
        }
      }

      if (Reflect.ownKeys(entradaDataCondition).length > 0){
        conditions.push({ entrada: entradaDataCondition });
      }
    }

    if (horaInicio || horaFim) {
      const entradaTimeCondition = {};
      if (horaInicio) {
        entradaTimeCondition[Op.gte] = horaInicio;
      }
      if (horaFim) {
        entradaTimeCondition[Op.lte] = horaFim;
      }
      if (Reflect.ownKeys(entradaTimeCondition).length > 0) {
        conditions.push({ hEntrada: entradaTimeCondition});
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
        attributes: [
          'id', 'destino', 'entrada', 'hEntrada', 'saida', 'hSaida', 'placa', 'marcaModelo',
          [Sequelize.col('entradaId.orgaoId'), 'e_orgaoId'],
          [Sequelize.col('entradaId.ubmId'), 'e_ubmdId'],
          [Sequelize.col('entradaId.graduaId'), 'e_graduaId'],
          [Sequelize.col('entradaId.docId'), 'e_docId'],
          [Sequelize.col('entradaId.nGuerra'), 'e_condutor'],
          [Sequelize.col('entradaId->docUser.sigla'), 'e_siglaDoc'],
          [Sequelize.col('entradaId->hierarquia.abrev'), 'e_graduaAbrev'],
          [Sequelize.col('entradaId->orgaoU.siglaCurta'), 'e_siglaCurta'],
          [Sequelize.col('entradaId.documento'), 'e_documento'],
          [Sequelize.col('saidaId.orgaoId'), 's_orgaoId'],
          [Sequelize.col('saidaId.ubmId'), 's_ubmdId'],
          [Sequelize.col('saidaId.graduaId'), 's_graduaId'],
          [Sequelize.col('saidaId.docId'), 's_docId'],
          [Sequelize.col('saidaId.nGuerra'), 's_condutor'],
          [Sequelize.col('saidaId->docUser.sigla'), 's_siglaDoc'],
          [Sequelize.col('saidaId->hierarquia.abrev'), 's_graduaAbrev'],
          [Sequelize.col('saidaId->orgaoU.siglaCurta'), 's_siglaCurta'],
          [Sequelize.col('saidaId.documento'), 's_documento'],
        ],
        include: [
          {
            model: User,
            as: 'entradaId',
            attributes: [],
            include: [
              { model: Orgao, as: 'orgaoU', attributes: [] },
              { model: Document, as: 'docUser', attributes: [] },
              { model: Hierarquia, as: 'hierarquia', attributes: [] },
              { model: Ubm, as: 'ubm', attributes: [] },
            ]
          },
          {
            model: User,
            as: 'saidaId',
            attributes: [],
            include: [
              { model: Orgao, as: 'orgaoU', attributes: [] },
              { model: Document, as: 'docUser', attributes: [] },
              { model: Hierarquia, as: 'hierarquia', attributes: [] },
              { model: Ubm, as: 'ubm', attributes: [] },
            ]
          }
        ],
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
   const { placa, condutor, destino, documento, marcaModelo, gradua, orgao } = req.body;

  const dataParking = {
    placa: placa,
    marcaModelo: marcaModelo,
    eCondutor: condutor,
    eRg: documento,
    destino,
    eGradua: gradua,
    eOrgao: orgao,
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
           [Op.or]: [
            {placa: { [Op.iLike]: `%${placa}%`}},
            {prefix: { [Op.iLike]: `%${marcaModelo}%`}}
           ]
           
          }});
        if (!exist) {
          await vtrAdd.create(addVtr);
        } else {
          await vtrAdd.update(addVtr, {where: { id: exist.id}});
        }
        
      } catch (error) {
        console.warn(`[erro] Ocorreu o erro: ${error}`);
      } 
    }
  } else {
    var dados = {
      sCondutor: condutor,
      sRg: documento,
      sGradua: gradua,
      sOrgao: orgao,
      saida: new Date(),
      hSaida: new Date().toLocaleTimeString(),
    }
    var saida = await vaga.update(dados);
  }

   return res.json(saida);
  }
}

export default new CeicsController();
