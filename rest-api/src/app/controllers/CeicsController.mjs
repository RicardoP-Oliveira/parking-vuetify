import Carro from '../models/carro.mjs'
import Ceics from '../models/ceics.mjs'
import vtrAdd from '../models/vtradd.mjs'
import Resposta from '../models/Resposta.mjs'
import User from '../models/user.mjs'
import Documento from '../models/documentos.mjs'
import Ubm from '../models/ubm.mjs'
import Orgao from '../models/orgao.mjs'
import Hierarquia from '../models/hierarcar.mjs'
import Target from '../models/target.mjs'
import { json, Op, Sequelize } from 'sequelize'
import { userInfo } from 'os'

const buildDateTimeFilter = (columnName, start, end, castType = 'DATE') => {
  const conditions = []

  const columnWtihTz = Sequelize.literal(`("${columnName}" AT TIME ZONE 'America/Sao_Paulo')`)

  if (start) {
    conditions.push(
      Sequelize.where(
        Sequelize.cast(columnWtihTz, castType),
        Op.gte,
        start
      )
    )

  }

  if (end) {
    conditions.push(
      Sequelize.where(
        Sequelize.cast(columnWtihTz, castType),
        Op.lte,
        end
      )
    )
  }

  return conditions.length > 0 ? { [Op.and]: conditions } : null
}

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
      horaSaidaFim,
      query,
    } = req.query;

    const tab = query

    let whereCondition = {};

    const conditions = [];

    if (query) {
      conditions.push({ tipo: query })
    }


    if (placa) {
      conditions.push({ '$carro.placa$': { [Op.iLike]: `%${placa}%` } });
    }

    if (documento) {
      conditions.push({
        [Op.or]: [
          { '$entrada_id.documento$': { [Op.iLike]: `%${documento}%` } },
          { '$saida_id.documento$': { [Op.iLike]: `%${documento}%` } }
        ]
      });
    }

    if (modelo) {
      conditions.push({ '$carro.marca$': { [Op.iLike]: `%${modelo}%` } });
    }

    if (condutor) {
      conditions.push({
        [Op.or]: [
          { '$entrada_id.n_guerra$': { [Op.iLike]: `%${condutor}%` } },
          { '$saida_id.n_guerra$': { [Op.iLike]: `%${condutor}%` } }
        ]
      });
    }

    if (dataInicio || dataFim) {
      const filtroData = buildDateTimeFilter('entrada', dataInicio, dataFim, 'DATE')

      if (filtroData) conditions.push(filtroData)
    }

    if (horaInicio || horaFim) {
      const filtroHora = buildDateTimeFilter('entrada', horaInicio, horaFim, 'TIME')

      if (filtroHora) conditions.push(filtroHora)
    }

    if (conditions.length > 0) {
      whereCondition = { [Op.and]: conditions };
    } else {
      whereCondition = {};
    }

    const attributes = [
      'id', 'tipo', 'destino_id',
      // Campos data/hora
      [Sequelize.literal(`(entrada AT TIME ZONE 'America/Sao_Paulo')`), 'entrada'],
      [Sequelize.literal(`TO_CHAR(entrada AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS')`), 'hEntrada'],
      [Sequelize.literal(`(saida AT TIME ZONE 'America/Sao_Paulo')`), 'saida'],
      [Sequelize.literal(`TO_CHAR(saida AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS')`), 'hSaida'],

      // Campo comum destino
      [Sequelize.col('destinos.target'), 'destino'],

      // Campos do condutor/pedestre de entrada
      [Sequelize.col('entrada_id.n_guerra'), 'e_condutor'],
      [Sequelize.col('entrada_id.documento'), 'e_documento'],
      [Sequelize.col('entrada_id->docUser.sigla'), 'e_tipoDoc'],
      [Sequelize.col('entrada_id->hierarquia.abrev'), 'e_graduaAbrev'],
      [Sequelize.col('entrada_id->orgaoU.sigla_curta'), 'e_siglaCurta'],
      // Campos do condutor/pedestre de saída
      [Sequelize.col('saida_id.n_guerra'), 's_condutor'],
      [Sequelize.col('saida_id.documento'), 's_documento'],
      [Sequelize.col('saida_id->hierarquia.abrev'), 's_graduaAbrev'],
      [Sequelize.col('saida_id->orgaoU.sigla_curta'), 's_siglaCurta'],
    ]

    const include = [
      {
        model: User,
        as: 'entrada_id',
        attributes: [],
        required: false,
        include: [
          { model: Orgao, as: 'orgaoU', attributes: [] },
          { model: Hierarquia, as: 'hierarquia', attributes: [] },
          { model: Documento, as: 'docUser', attributes: [] },
        ]
      },
      {
        model: User,
        as: 'saida_id',
        attributes: [],
        required: false,
        include: [
          { model: Orgao, as: 'orgaoU', attributes: [] },
          { model: Hierarquia, as: 'hierarquia', attributes: [] },
        ]
      },
      { model: Target, as: 'destinos', attributes: [] },
    ]

    if (tab === 'carro') {
      attributes.push(
        [Sequelize.col('carro.placa'), 'placa'],
        [Sequelize.col('carro.marca'), 'marcaModelo'],
      )

      include.push(
        {
          model: Carro,
          as: 'carro',
          attributes: [],
        }
      )
    }

    try {
      if (perPage <= 0) {
        perPage = await Ceics.count({ where: whereCondition });
      }

      const { count, rows } = await Ceics.findAndCountAll({
        order: [['updated_at', 'DESC']],
        where: whereCondition,
        attributes: attributes,
        include: include,
        offset: (page - 1) * perPage,
        limit: perPage,
        subQuery: false
      });

      const dados = rows.map(row => {
        const plain = row.get({ plain: true })

        plain.e_nomeCompleto = [
          plain.e_graduaAbrev,
          plain.e_siglaCurta,
          plain.e_condutor
        ].filter(Boolean).join(' ')

        plain.s_nomeCompleto = [
          plain.s_graduaAbrev,
          plain.s_siglaCurta,
          plain.s_condutor
        ].filter(Boolean).join(' ')

        return plain
      })

      resposta.dados = dados;
      var total = count;

    } catch (erro) {
      console.error("Erro na busca dos dados: ", erro);
      resposta.erro = true;
      resposta.msg = "Ocorreu um erro na busca dos dados!"
      resposta.dados = erro.message;
    }
    return res.json([resposta, total]);
  }

  async show(req, res) {
    const resposta = new Resposta();
    const { identificador } = req.params;
    const { 'tab': tab } = req.headers;
    const defaultRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;

    const busca = identificador ? identificador.trim() : '';

    try {
      const result = await Ceics.findOne({
        order: [['updated_at', 'DESC']],
        where: {
          tipo: tab,
          saida: null,
          [Op.or]:[
            { '$entrada_id.documento$': busca },
            { '$carro.placa$': { [Op.iLike]: `%${busca}%` }},
            { '$carro.marca$': { [Op.iLike]: `%${busca}%` }}
          ]
        },
        attributes: [
          'id', 'tipo', 'destino_id', 'e_user_id', 'carro_id',
          [Sequelize.col('entrada_id.documento'), 'documento'],
          [Sequelize.col('entrada_id.n_guerra'), 'nome'],
          [Sequelize.col('entrada_id->orgaoU.sigla_curta'), 'orgaoSigla'],
          [Sequelize.col('entrada_id->hierarquia.abrev'), 'graduaAbrev'],
          [Sequelize.col('carro.placa'), 'placa'],
          [Sequelize.col('carro.marca'), 'modelo']
        ],
        include: [
          {
            model: User,
            as: 'entrada_id',
            attributes: [],
            include: [
              { model: Hierarquia, as: 'hierarquia', attributes: [] },
              { model: Documento, as: 'docUser', attributes: [] },
              { model: Ubm, as: 'ubm', attributes: [] },
              { model: Orgao, as: 'orgaoU', attributes: [] }
            ]
          },
          { model: Target, as: 'destinos', attributes: [] },
          { model: Carro, as: 'carro', attributes: [] }
        ]
      })

      if (!result) {
        resposta.erro = true
        resposta.visitor = true
        resposta.msg = 'Nenhum registro encontrado'
        return res.json(resposta)
      }

      const dados = result.get({ plain: true })
      dados.nomeCompleto = [
        dados.graduaAbrev,
        dados.orgaoSigla,
        dados.nome
      ].filter(Boolean).join(' ')

      resposta.dados = dados
      return res.json(resposta)
      
    } catch (e) {
      resposta.erro = true
      resposta.msg = 'Surgiu um erro'
    }
  }

  async cadastarSaida(req, res) {
    const { registro_id, user_id, carro_id } = req.body

    if (!registro_id) {
      return res.status(400).json({ erro: true, msg: 'ID do registro não informado!'})
    }
    const payload = { saida: new Date().toISOString() }
    if (carro_id) {
      payload.s_user_id = req.body.user_id
    }

    try {
      const [rowsUpdate] = await Ceics.update(payload, {
        where: { id: registro_id }
        })
      if (rowsUpdate > 0) {
        return res.json({ sucesso: true, msg: 'Saída registrada' })
      } else { 
        return res.status(400).json({ erro: true, msg: 'Registro não encontrado' })
      }
      
    } catch (e) {
      console.error({ erro: true, msg: e.msg})
    }
    

  }

  async cadastrarEntrada(req, res) {
    const { 'tab': tab } = req.headers
    const body = req.body

    try {
      const movimentacao = await Ceics.create({
        e_user_id: body.user_id,
        carro_id: body.carro_id || null,
        tipo: tab,
        destino_id: body.destino_id,
        entrada: new Date().toISOString()
      })

      return res.json(movimentacao)

    } catch (e) {
      console.error('ERRO: ', e)
      return res.status(500).json({
        erro: true,
        msg: e.message,
        errors: e.erros
      })
    }}
}

export default new CeicsController();
