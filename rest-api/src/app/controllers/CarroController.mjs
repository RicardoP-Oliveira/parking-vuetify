import Carro from '../models/carro.mjs'
import Resposta from '../models/Resposta.mjs'
import Ubm from '../models/ubm.mjs'
import User from '../models/user.mjs'
import Orgao from '../models/orgao.mjs'
import Doc from '../models/documentos.mjs'
import Order from '../models/hierarcar.mjs'
import { Sequelize } from 'sequelize'

class CarroController {
  async index(req, res) {

        const resposta = new Resposta();
        try {
          const page = req.query.page || 1;
          let perPage = req.query.perPage || 25;
          if(perPage <=0 ){
            perPage = await Carro.count();
          }

          const { count, rows } = await Carro.findAndCountAll({
            order: [["id", "ASC"]],
            offset: (page - 1) * perPage,
            limit: perPage,

            // attributes: ['id', 'placa', 'marca'],
            include: [{
              model: User,
              as:'user',
              // attributes:['id', 'rg', 'nGuerra', 'foto', 'fotoUri'],
              include: [
                {
                  required: true,
                  model: Ubm,
                  as: 'ubm',
                  // attributes:['id', 'sigla']
                },
                {
                  model: Doc,
                  as: 'docUser'
                }
              ]
              },
              {
                model: Orgao,
                as: 'orgao'
              }
            ]
        });

          if(!rows.length) {
            resposta.msg = 'Não existe(m) carro(s) cadastrado(s).';
          } else {
            resposta.dados = rows;
            var total = count;
          }
        } catch(erro) {
          resposta.erro = true;
          resposta.msg = `Error: ${erro}`;
          resposta.dados = erro;
        }
        return res.json([resposta, total]);
      }

  async store(req, res) {
    const resposta = new Resposta();
    try {
        const { placa } = req.body;
        const carroExists = await Carro.findOne({where: { placa: placa }});
        if (carroExists) {
          resposta.erro = true;
          resposta.msg = 'Carro já cadastrado';
        } else {
          const carro = await Carro.create(req.body);
          if(carro){
            resposta.msg = 'Registro cadastrado com sucesso.';
            resposta.dados = carro;
          }
        }
    } catch (erro) {
      resposta.erro = true,
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async show(req, res) {
      const { id } = req.params;
      const resposta = new Resposta();
      try {

        const carroExists = await Carro.findOne(
          {
          where: {id: id}, 
          attributes: [
            'id', 'placa', 'marca', 'userId',
            [Sequelize.col('user.ubmId'), 'ubmId'],
            [Sequelize.col('user.documento'), 'documento'],
            [Sequelize.col('user.nGuerra'), 'condutor'],
            [Sequelize.col('user.orgaoId'), 'orgaoId'],
            [Sequelize.col('user.docId'), 'docId'],
            [Sequelize.col('user.graduaId'), 'guaduaId'],
            [Sequelize.col('user->docUser.sigla'), 'docSigla'],
            [Sequelize.col('user->ubm.name'), 'nomeUbm'],
            [Sequelize.col('user->hierarquia.abrev'), 'graduaAbrev'],
            [Sequelize.col('user->orgaoU.siglaCurta'), 'orgaoSigla'],

          ],
          include: [
            {
              model: User,
              as:'user',
              attributes: [],
              include: [
                { model: Order, as: 'hierarquia', attributes: [] },
                { model: Doc, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            { model: Orgao, as: 'orgao', attributes: [] }
          ]
      });
        if (!carroExists) {
          resposta.erro = true;
          resposta.msg = 'Carro não encontrado.';
        } else {

          resposta.dados = carroExists;
        }
      } catch (erro) {
        resposta.erro = true;
        resposta.msg = `Error: ${erro}`;
        resposta.dados = erro;
      }
      return res.json(resposta);
    }

    async showPlaca(req, res) {
      const { placa } = req.params;
      const resposta = new Resposta();
      try {

        const carroExists = await Carro.findOne(
          {
            where: {placa: placa},
          attributes: [
            'id', 'placa', 'marca', 'userId',
            [Sequelize.col('user.ubmId'), 'ubmId'],
            [Sequelize.col('user.documento'), 'documento'],
            [Sequelize.col('user.nGuerra'), 'condutor'],
            [Sequelize.col('user.orgaoId'), 'orgaoId'],
            [Sequelize.col('user.docId'), 'docId'],
            [Sequelize.col('user.graduaId'), 'guaduaId'],
            [Sequelize.col('user->docUser.sigla'), 'docSigla'],
            [Sequelize.col('user->ubm.name'), 'nomeUbm'],
            [Sequelize.col('user->hierarquia.abrev'), 'graduaAbrev'],
            [Sequelize.col('user->orgaoU.siglaCurta'), 'orgaoSigla'],

          ],
          include: [
            {
              model: User,
              as:'user',
              attributes: [],
              include: [
                { model: Order, as: 'hierarquia', attributes: [] },
                { model: Doc, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            { model: Orgao, as: 'orgao', attributes: [] }
          ]
      });
        if (!carroExists) {
          resposta.erro = true;
          resposta.msg = 'Carro não encontrado.';
        } else {
          resposta.dados = carroExists;
        }
      } catch (erro) {
        resposta.erro = true;
        resposta.msg = `Error: ${erro}`;
        resposta.dados = erro;
      }
      return res.json(resposta);
    }

  async update( req, res) {
    const resposta = new Resposta();
    try {
      const { id } = req.params;
      const carro = await Carro.findByPk(id, {
        include: {
          model: User,
          as: 'user'
        }
      });

      if (!carro) {
        resposta.erro = true;
        resposta.msg = 'Carro não encontrado.';
      } else {
        const { placa, marcaModelo, userId, orgaoId, renavam } = req.body;
        const dados = {
          placa,
          marcaModelo ,
          userId ,
          orgaoId,
          renavam
        }
        const updated = await carro.update(dados);
        if(updated) {
          resposta.msg = 'Registro atualizado com sucesso.';
        };
      }
    } catch (erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async destroy(req, res) {
    const resposta = new Resposta();
    try {
      const { id } = req.params;
      const carro = await Carro.findByPk(id);

      if(!carro){
        resposta.erro = true;
        resposta.msg = 'Carro não encontrado.';
      } else {
        if (await carro.destroy()){
          resposta.msg = 'Arquivo deletado com sucesso.';
        }
      }
    } catch (erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

}

export default new CarroController();
