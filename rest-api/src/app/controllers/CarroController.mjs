import Carro from '../models/carro.mjs'
import Resposta from '../models/Resposta.mjs'
import Ubm from '../models/ubm.mjs'
import User from '../models/user.mjs'
import Orgao from '../models/orgao.mjs'
import Doc from '../models/documentos.mjs'
import Order from '../models/hierarcar.mjs'
import { Op, Sequelize } from 'sequelize'

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
              as:'userCar',
              // attributes:['id', 'rg', 'n_guerra', 'foto', 'fotoUri'],
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
        console.log(JSON.stringify(resposta,null,2))
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
      const { placa } = req.params;
      const resposta = new Resposta();
      try {
        const carroExists = await Carro.findOne({
          where: {placa: placa}, 
          attributes: [
            'id', 'placa', 'marca', 'user_id',
            [Sequelize.col('userCar.ubm_id'), 'ubm_id'],
            [Sequelize.col('userCar.documento'), 'documento'],
            [Sequelize.col('userCar.n_guerra'), 'condutor'],
            [Sequelize.col('userCar.orgao_id'), 'orgao_id'],
            [Sequelize.col('userCar.doc_id'), 'doc_id'],
            [Sequelize.col('userCar.gradua_id'), 'guadua_id'],
            [Sequelize.col('userCar->docUser.sigla'), 'docSigla'],
            [Sequelize.col('userCar->ubm.name'), 'nomeUbm'],
            [Sequelize.col('userCar->hierarquia.abrev'), 'graduaAbrev'],
            [Sequelize.col('userCar->orgaoU.sigla_curta'), 'orgaoSigla'],

          ],
          include: [
            {
              model: User,
              as:'userCar',
              attributes: [],
              include: [
                { model: Order, as: 'hierarquia', attributes: [] },
                { model: Doc, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
          ]
      });
        if (!carroExists) {
          resposta.erro = true;
          resposta.visitor = true;
          resposta.msg = 'Carro não encontrado.';
        } else {

          resposta.dados = carroExists;
          console.log(resposta)
        }
      } catch (erro) {
        resposta.erro = true;
        resposta.msg = `Error: ${erro}`;
        resposta.dados = erro;
      }
      return res.json(resposta);
    }

    // async showPlaca(req, res) {
    //   const { placa } = req.params;
    //   const resposta = new Resposta();

    //   console.log('CHEGUEI AQUI - showPlaca')
    //   try {

    //     const carroExists = await Carro.findOne(
    //       {
    //         where: {placa: placa},
    //       attributes: [
    //         'id', 'placa', 'marca', 'user_id',
    //         [Sequelize.col('user.ubm_id'), 'ubm_id'],
    //         [Sequelize.col('user.documento'), 'documento'],
    //         [Sequelize.col('user.n_guerra'), 'condutor'],
    //         [Sequelize.col('user.orgao_id'), 'orgao_id'],
    //         [Sequelize.col('user.doc_id'), 'doc_id'],
    //         [Sequelize.col('user.gradua_id'), 'guadua_id'],
    //         [Sequelize.col('user->docUser.sigla'), 'docSigla'],
    //         [Sequelize.col('user->ubm.name'), 'nomeUbm'],
    //         [Sequelize.col('user->hierarquia.abrev'), 'graduaAbrev'],
    //         [Sequelize.col('user->orgaoU.sigla_curta'), 'orgaoSigla'],

    //       ],
    //       include: [
    //         {
    //           model: User,
    //           as:'userCar',
    //           attributes: [],
    //           include: [
    //             { model: Order, as: 'hierarquia', attributes: [] },
    //             { model: Doc, as: 'docUser', attributes: [] },
    //             { model: Ubm, as: 'ubm', attributes: [] },
    //             { model: Orgao, as: 'orgaoU', attributes: [] }
    //           ]
    //         },
    //         { model: Orgao, as: 'orgao', attributes: [] }
    //       ]
    //   });
    //     if (!carroExists) {
    //       resposta.erro = true;
    //       resposta.msg = 'Carro não encontrado.';
    //     } else {
    //       resposta.dados = carroExists;
    //     }
    //   } catch (erro) {
    //     resposta.erro = true;
    //     resposta.msg = `Error: ${erro}`;
    //     resposta.dados = erro;
    //   }
    //   return res.json(resposta);
    // }

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
        const { placa, marcaModelo, user_id, orgao_id, renavam } = req.body;
        const dados = {
          placa,
          marcaModelo ,
          user_id ,
          orgao_id,
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
