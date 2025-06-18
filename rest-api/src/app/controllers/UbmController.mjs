import Ubm from '../models/ubm.mjs';
import Resposta from '../models/Resposta.mjs';
import User from '../models/user.mjs';
import Carro from '../models/carro.mjs';
import Orgao from '../models/orgao.mjs';

class UbmController {
  async index(req, res) {
    const resposta = new Resposta();
    try {
      const ubms = await Ubm.findAll({ order: [['name', 'ASC']] });
      if(!ubms.length) {
        resposta.msg = 'Não existe(m) unidade(s) cadastrada(s).';
      } else {
        const dados = [];
        ubms.map((obm) => {
           return dados.push({
            obm
          });
        });
        resposta.dados = dados;
      }
    } catch(erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async show(req, res) {
    const resposta = new Resposta();
    try {
      const { id } = req.params;
      const ubmExists = await Ubm.findByPk(id,{
        // attributes: ['id','sigla', 'name'],
        include: {
          model: User,
          as:"users",
          // attributes:['id', 'rg', 'nGuerra', 'foto', 'fotoUri'],
          include: [
            {
              model: Carro,
              as: "carros",
              // attributes: ['id', 'placa', 'marca']
            }
          ]
        },
    });

      if (!ubmExists) {
        resposta.erro = true;
        resposta.msg = 'Unidade não encontrada.';
      } else {
        const { id, name, users } = ubmExists;
        const Militares = users.map(function(user) {
          return user
        });
        resposta.dados =
          {
            id,
            name,
            Militares,
          };
      }
    } catch (erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async store(req, res) {
    const resposta = new Resposta();
    try {
      const ubmExists = await Ubm.findOne({where: { name: req.body.name }});

      if (ubmExists) {
        resposta.erro = true;
        resposta.msg = 'Unidade já existe.';
      } else {
        if (await Ubm.create(req.body)){
          resposta.msg = 'UBM cadastrada com sucesso.';
        };
      }
    } catch(erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async update(req, res){
    const resposta = new Resposta();
    try {
      const { id } = req.params;
      const body = req.body;

      const obm = await Ubm.findByPk(id);

      if (!obm) {
        resposta.erro = true;
        resposta.msg = 'Unidade não encontrada.';
      } else {
        const updated = await obm.update(body);
        if(updated) {
          resposta.msg = 'Unidade atualizada com sucesso.';
        };
      }
    } catch (erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

  async destroy (req, res) {
    const resposta = new Resposta();
    try {
      const { id } = req.params;
      const ubm = await Ubm.findByPk(id);

      if(!ubm){
        resposta.erro = true;
        resposta.msg = 'Unidade não encontrada.';
      } else {
        if (await ubm.destroy()){
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

  async getOrgaos(req, res) {
    const resposta = new Resposta();
    try {
      const orgaos = await Orgao.findAll({ order: [['id', 'ASC']] });
      if(!orgaos.length) {
        resposta.msg = 'Não existe(m) unidade(s) cadastrada(s).';
      } else {
        const dados = [];
        orgaos.map((orgao) => {
           return dados.push({
            orgao
          });
        });
        resposta.dados = dados;
      }
    } catch(erro) {
      resposta.erro = true;
      resposta.msg = `Error: ${erro}`;
      resposta.dados = erro;
    }
    return res.json(resposta);
  }

}

export default new UbmController();
