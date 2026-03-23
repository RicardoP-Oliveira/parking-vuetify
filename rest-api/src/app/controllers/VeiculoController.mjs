import Veiculo from '../models/Veiculo.mjs'
import Resposta from '../models/Resposta.mjs'
import Unidade from '../models/Unidade.mjs'
import Usuario from '../models/Usuario.mjs'
import Orgao from '../models/Orgao.mjs'
import Tipo_Documento from '../models/Tipo_Documento.mjs'
import Tratamento from '../models/Tratamento.mjs'
import { Op, Sequelize } from 'sequelize'

class VeiculoController {
  async index(req, res) {

        const resposta = new Resposta();
        try {
          const page = req.query.page || 1;
          let perPage = req.query.perPage || 25;
          if(perPage <=0 ){
            perPage = await Veiculo.count();
          }

          const { count, rows } = await Veiculo.findAndCountAll({
            order: [["id", "ASC"]],
            offset: (page - 1) * perPage,
            limit: perPage,
            include: [{
              model: Usuario,
              as:'user',
              attributes:[],
              include: [
                {
                  required: true,
                  model: Unidade,
                  as: 'unidade',
                  attributes:[]
                },
                {
                  model: Tipo_Documento,
                  as: 'tipoDoc'
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
        const veiculoExists = await Veiculo.findOne({where: { placa: placa }});
        if (veiculoExists) {
          resposta.erro = true;
          resposta.msg = 'Veículo já cadastrado';
        } else {
          const veiculo = await Veiculo.create(req.body);
          if(veiculo){
            resposta.msg = 'Registro cadastrado com sucesso.';
            resposta.dados = veiculo;
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
        const veiculoExists = await Veiculo.findOne({
          where: {
            [Op.or]: [
              { placa: { [Op.iLike]: `%${placa}%` } },
              { marca: { [Op.iLike]: `%${placa}%` } },
              { prefixo: { [Op.iLike]: `%${placa}%` }}
            ]
          }, 
          attributes: [
            'id', 'placa', 'marca', 'prefixo', 'usuario_id', 'orgao_id',
            [Sequelize.col('user.ubm_id'), 'ubm_id'],
            [Sequelize.col('user.documento'), 'documento'],
            [Sequelize.col('user.nome'), 'condutor'],
            [Sequelize.col('user.tipo_doc_id'), 'doc_id'],
            [Sequelize.col('user.tratamento_id'), 'guadua_id'],
            [Sequelize.col('user->tipoDoc.tipo'), 'docSigla'],
            [Sequelize.col('user->unidade.unidade'), 'nomeUbm'],
            [Sequelize.col('user->tratamento.sigla'), 'graduaAbrev'],
            [Sequelize.col('user->orgao.sigla_curta'), 'orgaoSigla'],

          ],
          include: [
            {
              model: Usuario,
              as:'user',
              attributes: [],
              include: [
                { model: Tratamento, as: 'tratamento', attributes: [] },
                { model: Tipo_Documento, as: 'tipoDoc', attributes: [] },
                { model: Unidade, as: 'unidade', attributes: [] },
                { model: Orgao, as: 'orgao', attributes: [] }
              ]
            },
          ]
      });
        if (!veiculoExists) {
          resposta.erro = true;
          resposta.visitor = true;
          resposta.msg = 'Veículo não encontrado.';
        } else {

          resposta.dados = veiculoExists;
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
      const carro = await Veiculo.findByPk(id, {
        include: {
          model: Usuario,
          as: 'user'
        }
      });

      if (!carro) {
        resposta.erro = true;
        resposta.msg = 'Veículo não encontrado.';
      } else {
        const { placa, marcaModelo, orgao_id, renavam } = req.body;
        const dados = {
          placa,
          marca: marcaModelo ,
          orgao_id,
          renavam
        }
        const updated = await Veiculo.update(dados);
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
      const carro = await Veiculo.findByPk(id);

      if(!carro){
        resposta.erro = true;
        resposta.msg = 'Veículo não encontrado.';
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

export default new VeiculoController();
