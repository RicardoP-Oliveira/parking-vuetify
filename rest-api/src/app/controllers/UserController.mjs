import User from '../models/user.mjs';
import Resposta from '../models/Resposta.mjs';
import uploadConfig from '../../config/upload.mjs';
import Ubm from '../models/ubm.mjs';
import Carro from '../models/carro.mjs';
import Orgao from '../models/orgao.mjs';

const upload = uploadConfig;
class UserController {
  async index(req, res) {
    const resposta = new Resposta();
    try {
      const page = req.query.page || 1;
      let perPage = req.query.perPage || 25;
      if (perPage <= 0) {
        perPage = await User.count();
      }

      const { count, rows } = await User.findAndCountAll({
        order: [['id', 'ASC']],
        offset: (page - 1) * perPage,
        limit: perPage,
        include: [
          {
            model: Ubm,
            as: 'ubm',
          },
          {
            model: Orgao,
            as: 'orgaoU',
          },
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
    try {
      const param = req.params.id.substring(0, 2) === 'rg' ? 'rg' : 'id';

      if (param === 'rg') {
        const id = req.params.id.substring(2);
        var user = await User.findOne({
          where: { documento: id },
          include: [
            {
              model: Ubm,
              as: 'ubm',
            },
            {
              model: Orgao,
              as: 'orgaoU',
            },
          ],
        });
      }

      if (param === 'id') {
        const id = req.params.id;
        var user = await User.findOne({
          where: { id: id },
          include: [
            {
              model: Ubm,
              as: 'ubm',
            },
            {
              model: Orgao,
              as: 'orgaoU',
            },
          ],
        });
      }

      if (!user) {
        resposta.erro = true;
        resposta.msg = 'Usuário(a) não encontrado(a).';
      } else {
        resposta.dados = user;
      }
    } catch (erro) {
      (resposta.erro = true), (resposta.msg = `Error: ${erro}`);
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async store(req, res) {
    const resposta = new Resposta();
    const foto = req.file;
    try {
      const userExists = await User.findOne({
        where: { documento: req.body.documento },
      });
      if (userExists) {
        if (req.file) {
          upload.delete(req, foto.filename);
        }
        resposta.dados = userExists;
        return res.json(resposta);
      }
      const newUser = await User.create(req.body);

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
    const {
      gradua,
      tipo_doc,
      documento,
      nGuerra,
      ubmId,
      orgaoId,
      password_hash,
      email,
      cnh,
    } = req.body;
    let body = {};
    try {
      const user = await User.findByPk(id);
      if (!user) {
        if (req.file) {
          upload.delete(req, foto.filename);
        }
        resposta.erro = true;
        resposta.msg = 'Usuário(a) não encontrado(a).';
      } else {
        if (!req.file) {
          body = {
            gradua,
            tipo_doc,
            documento,
            nGuerra,
            ubmId,
            orgaoId,
            email,
            cnh,
            password_hash,
          };
        } else {
          body = {
            gradua,
            tipo_doc,
            documento,
            nGuerra,
            ubmId,
            orgaoId,
            email,
            cnh,
            foto: foto.filename,
            password_hash,
          };
        }
        if (user.foto) {
          var oldPicture = user.foto;
        }

        const updated = await (await user).update(body);

        if (updated) {
          resposta.erro = false;
          resposta.msg = 'Arquivo alterado com sucesso.';
          if (foto && oldPicture) {
            upload.delete(req, oldPicture);
          }
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
      const user = await User.findByPk(id);

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
