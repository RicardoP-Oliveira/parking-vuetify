import Resposta from '../models/Resposta.mjs'
import Pedestre from '../models/pedestre.mjs'
import User from '../models/user.mjs'
import Orgao from '../models/orgao.mjs'
import Ubm from '../models/ubm.mjs'
import Documentos from '../models/documentos.mjs'
import Hierarquia from '../models/hierarcar.mjs'
import { Op, Sequelize } from 'sequelize'
import database from '../../database/index.mjs'

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
    let userWhere = {};

    const {
      pedestre,
      documento,
      dataInicio,
      dataFim,
      horaInicio,
      horaFim,
      dataSaidaInicio,
      dataSaidaFim, 
      horaSaidaInicio,
      horaSaidaFim,
    } = req.query;

        let whereCondition = {};
            let userRequired = false;

    const conditions = [];

    if (pedestre) {
      userWhere.nGuerra = { [Op.iLike]: `%${pedestre}%` };
      userRequired = true
    }

    if (documento) {
      // conditions.push({ documento: {[Op.iLike]: `%${documento}%`}});
      userWhere.documento = { [Op.iLike]: `%${documento}%` };
      userRequired = true
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
         attributes: [
            'id', 'entrada', 'hEntrada', 'saida', 'hSaida', 'destino',
            [Sequelize.col('user.id'), 'userId'],
            [Sequelize.col('user.documento'), 'doc'],
            [Sequelize.col('user.nGuerra'), 'nGuerra'],
            [Sequelize.col('user.graduaId'), 'graduaId'],
            [Sequelize.col('user.ubmId'), 'ubmId'],
            [Sequelize.col('user.orgaoId'), 'orgaoId'],
            [Sequelize.col('user.docId'), 'idDoc'],
            [Sequelize.col('user->hierarquia.abrev'), 'graduaAbrev'],
            [Sequelize.col('user->orgaoU.siglaCurta'), 'orgaoSigla'],
            [Sequelize.col('user->docUser.sigla'), 'docSigla']
          ],
          include: [
            {
              model: User,
              as: 'user',
              attributes: [],
              where: Object.keys(userWhere).length ? userWhere : undefined,
              required: userRequired,
              include: [
                { model: Hierarquia, as: 'hierarquia', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] },
                { model: Documentos, as: 'docUser', attributes: []}
              ]
            }
          ],
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
      const user = await User.findOne({
        where: { documento: doc },
        attributes: ['id']
      })

      if (!user) {
        resposta.erro = true
        resposta.msg = 'Usuário não encontrado!'
        return res.json(resposta)
      }

      const pedestre = await Pedestre.findOne({
        order: [['updatedAt', 'DESC']],
        where: {
          userId: user.id,
          saida: null
        },
        attributes: [
          'id', 'entrada', 'hEntrada', 'saida', 'hSaida', 'destino',
          [Sequelize.col('user.id'), 'userId'],
          [Sequelize.col('user.documento'), 'doc'],
          [Sequelize.col('user.nGuerra'), 'nGuerra'],
          [Sequelize.col('user.graduaId'), 'graduaId'],
          [Sequelize.col('user.ubmId'), 'ubmId'],
          [Sequelize.col('user.orgaoId'), 'orgaoId'],
          [Sequelize.col('user.docId'), 'idDoc'],
        ],
        include: [
          {
            model: User,
            as: 'user',
            attributes: [],
          }
        ],
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
  const t = await database.connection.transaction()

  try {
    const body = req.body

    // 1️⃣ Buscar ou criar USER
    let user = await User.findOne({
      where: { documento: body.documento }
    })

    if (!user) {
      user = await User.create({
        documento: body.documento,
        nGuerra: body.name,
        orgaoId: body.idOrgao,
        ubmId: body.idUbm,
        docId: body.idDoc,
        graduaId: body.idGradua
      
      }, { transaction: t })
    }
    
    //2️⃣ Verificar entrada aberta
    const entrada = await Pedestre.findOne({
      where: {
        userId: user.id,
        saida: null
      },
      order: [['updatedAt', 'DESC']],
      transaction: t
    })

    let pedestre

    const {userId, ...safeBody} = body

    if (!entrada) {
      console.log('entrada ', entrada)
      pedestre = await Pedestre.create({
        ...safeBody,
        userId: user.id,
        entrada: dateFormatter(new Date()),
        hEntrada: new Date().toLocaleTimeString()
      }, { transaction: t })
    } else {
      pedestre = await entrada.update({
        saida: dateFormatter(new Date()),
        hSaida: new Date().toLocaleTimeString()
      }, { transaction: t })
    }

    await t.commit()
    return res.json({ user, pedestre })

  } catch (e) {
    await t.rollback()
    console.error('🔥 ERRO:', e)
    return res.status(500).json({
      erro: true,
      msg: e.message,
      errors: e.errors
    })
  }
}

}

export default new PedestreController();
