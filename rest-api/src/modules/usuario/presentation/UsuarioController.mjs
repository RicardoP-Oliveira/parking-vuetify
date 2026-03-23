import Usuario from '../../../app/models/Usuario.mjs'
import Resposta from '../../../app/models/Resposta.mjs';
import uploadConfig from '../../../config/upload.mjs';
import Unidade from '../../../app/models/Unidade.mjs'
import Orgao from '../../../app/models/Orgao.mjs';
import Tipo_Documento from '../../../app/models/Tipo_Documento.mjs'
import Tratamento from '../../../app/models/Tratamento.mjs'
import { Sequelize } from 'sequelize'

const upload = uploadConfig;
class UserController {
  async index(req, res) {
    const resposta = new Resposta();
    try {
      const page = req.query.page || 1;
      let perPage = req.query.perPage || 25;
      if (perPage <= 0) {
        perPage = await Usuario.count();
      }

      const { count, rows } = await Usuario.findAndCountAll({
        order: [['id', 'ASC']],
        offset: (page - 1) * perPage,
        limit: perPage,
        include: [
          {
            model: Unidade,
            as: 'unidade',
          },
          {
            model: Orgao,
            as: 'orgao',
          },
          {
            model: Tipo_Documento,
            as: 'tipoDoc',
          },
          {
            model: Tratamento,
            as: 'tratamento'
          }
        ],
      });

      if (!rows.length) {
        resposta.msg = 'Não existe(m) usuários(as) cadastrados(as).';
      } else {
        resposta.dados = rows;
        var total = count;
      }
    } catch (err) {
      resposta.erro = true;
      resposta.msg = `Error: ${err}`;
      resposta.dados = err;
    }
    return res.json([resposta, total]);
  }

  async show(req, res) {
    const resposta = new Resposta();
    const { id } = req.params;

    try {
      let user = await Usuario.findOne({
        where: { documento: id},
        attributes: [
          ['id', 'user_id'],
          ['documento', 'doc'],
          'nome',
          'tratamento_id',
          'ubm_id',
          'orgao_id',
          'tipo_doc_id',
          [Sequelize.col('tratamento.sigla'), 'graduaAbrev'],
          [Sequelize.col('orgao.sigla_curta'), 'orgaoSigla'],
          [Sequelize.col('unidade.sigla'), 'siglaUbm'],
          [Sequelize.col('tipoDoc.tipo'), 'tipo_doc']
         ],
         include: [
          { model: Tratamento, as: 'tratamento', attributes: [] },
          { model: Orgao, as: 'orgao', attributes: [] },
          { model: Unidade, as: 'unidade', attributes: [] },
          { model: Tipo_Documento, as: 'tipoDoc', attributes: []}
         ],
      });

      if (!user) {
        resposta.erro = true
        resposta.msg = 'Usuário não cadastrado!'
        return res.json(resposta)
      }

      const dados = user.get({ plain: true })

      dados.nomeCompleto = [
        dados.graduaAbrev,
        dados.orgaoSigla,
        dados.nome
      ].filter(Boolean).join(' ').trim()
      
      resposta.dados = dados
    } catch (erro) {
      resposta.erro = true
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta)
  }

  async store(req, res) {
    const resposta = new Resposta();
    const foto = req.file;
    const { documento } = req.body

    console.log("Recebendo dados para criar usuário:", req.body)

    try {
      const userExists = await Usuario.findOne({
        where: { documento: documento }
      });
      if (userExists) {
        if (req.file) {
          upload.delete(req, foto.filename);
        }
        resposta.dados = userExists;
        return res.json(resposta);
      }
      const newUser = await Usuario.create(req.body);

      if (newUser) {
        resposta.msg = 'Usuário cadastrado com sucesso.';
        resposta.dados = newUser;
      }
    } catch (erro) {
      (resposta.erro = true), (resposta.msg = `Error: ${erro}`);
      resposta.dados = erro;
      if (req.file) {
        upload.delete(req, foto.filename);
      }
    }
    return res.json(resposta);
  }

  async update(req, res) {
    const resposta = new Resposta();
    const { id } = req.params;
    const foto = req.file;

    try {
      const user = await Usuario.findByPk(id);
      if (!user) {
        if (req.file) upload.delete(req, foto.filename);
        
        resposta.erro = true;
        resposta.msg = 'Usuário(a) não encontrado(a).';
        return res.json(resposta);
      }

      const body = {
        ...(req.body.gradua && { gradua: req.body.gradua }),
        ...(req.body.tipo_doc && { tipo_doc: req.body.tipo_doc }),
        ...(req.body.nGuerra && { nGuerra: req.body.nGuerra }),
        ...(req.body.ubm_id && { ubm_id: req.body.ubm_id }),
        ...(req.body.orgao_id && { orgao_id: req.body.orgao_id }),
        ...(req.body.email && { email: req.body.email }),
        ...(req.body.cnh && { cnh: req.body.cnh }),
        ...(req.body.password && { password: req.body.password }),
        ...(foto && { foto: foto.filename }),
      };

        const oldPicture = user.foto;

        const updated = await Usuario.update(body);

        if (updated) {
          resposta.erro = false;
          resposta.msg = 'Arquivo alterado com sucesso.';
          if (foto && oldPicture) {
            upload.delete(req, oldPicture);
          }
        }
    } catch (erro) {
      if (req.file) {
        upload.delete(req, foto.filename);
      }
      (resposta.erro = true), (resposta.msg = `Error: ${erro}`);
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async destroy(req, res) {
    const resposta = new Resposta();
    try {
      const { id } = req.params;
      const user = await Usuario.findByPk(id);

      if (!user) {
        resposta.erro = true;
        resposta.msg = 'Usuário(a) não encontrado(a).';
      } else {
        if (await user.destroy()) {
          upload.delete(req, user.foto);
          resposta.erro = false;
          resposta.msg = 'Arquivo deletado com sucesso.';
        }
      }
    } catch (erro) {
      (resposta.erro = true), (resposta.msg = `Error: ${erro}`);
      resposta.dados = erro;
    }
    return res.json(resposta);
  }
}

export default new UserController();
