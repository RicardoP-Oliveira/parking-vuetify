import Veiculo from '../models/Veiculo.mjs'
import Movimentacao from '../models/Movimentacao.mjs'
import Resposta from '../models/Resposta.mjs'
import Usuario from '../models/Usuario.mjs'
import Tipo_Documento from '../models/Tipo_Documento.mjs'
import Unidade from '../models/Unidade.mjs'
import Orgao from '../models/Orgao.mjs'
import Destino from '../models/Destino.mjs'
import Tratamento from '../models/Tratamento.mjs'
import { Op, Sequelize } from 'sequelize'

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

class MovimentacaoController {
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
      horaInicio,
      horaFim,
      query,
    } = req.query;

    const tab = query

    let whereCondition = {};

    const conditions = [];

    if (query) {
      conditions.push({ tipo: query })
    }


    if (placa) {
      conditions.push({ '$veiculo.placa$': { [Op.iLike]: `%${placa}%` } });
    }

    if (documento) {
      conditions.push({
        [Op.or]: [
          { '$entradaUser.documento$': { [Op.iLike]: `%${documento}%` } },
          { '$saidaUser.documento$': { [Op.iLike]: `%${documento}%` } }
        ]
      });
    }

    if (modelo) {
      conditions.push({
        [Op.or] : [
          { '$veiculo.marca$': { [Op.iLike]: `%${modelo}%` }},
          { '$veiculo.prefixo$': { [Op.iLike]: `%${modelo}%` }}
        ]
      })
    }

    if (condutor) {
      conditions.push({
        [Op.or]: [
          { '$entradaUser.nome$': { [Op.iLike]: `%${condutor}%` } },
          { '$saidaUser.nome$': { [Op.iLike]: `%${condutor}%` } }
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
      [Sequelize.col('destino->unidade.unidade'), 'destino'],

      // Campos do condutor/pedestre de entrada
      [Sequelize.col('entradaUser.nome'), 'e_condutor'],
      [Sequelize.col('entradaUser.documento'), 'e_documento'],
      [Sequelize.col('entradaUser->tipoDoc.tipo'), 'e_tipoDoc'],
      [Sequelize.col('entradaUser->tratamento.sigla'), 'e_graduaAbrev'],
      [Sequelize.col('entradaUser->orgao.sigla_curta'), 'e_siglaCurta'],
      // Campos do condutor/pedestre de saída
      [Sequelize.col('saidaUser.nome'), 's_condutor'],
      [Sequelize.col('saidaUser.documento'), 's_documento'],
      [Sequelize.col('saidaUser->tratamento.sigla'), 's_graduaAbrev'],
      [Sequelize.col('saidaUser->orgao.sigla_curta'), 's_siglaCurta'],
    ]

    const include = [
      {
        model: Usuario,
        as: 'entradaUser',
        attributes: [],
        required: false,
        include: [
          { model: Orgao, as: 'orgao', attributes: [] },
          { model: Tratamento, as: 'tratamento', attributes: [] },
          { model: Tipo_Documento, as: 'tipoDoc', attributes: [] },
        ]
      },
      {
        model: Usuario,
        as: 'saidaUser',
        attributes: [],
        required: false,
        include: [
          { model: Orgao, as: 'orgao', attributes: [] },
          { model: Tratamento, as: 'tratamento', attributes: [] },
        ]
      },
      { 
        model: Destino,
        as: 'destino',
        attributes: [],
        include: [
          {
            model:Unidade,
            as: 'unidade',
            attributes: []
          }
        ]
      },
    ]

    if (tab === 'VEICULO') {
      attributes.push(
        [Sequelize.col('veiculo.placa'), 'placa'],
        [Sequelize.col('veiculo.marca'), 'marca'],
        [Sequelize.col('veiculo.prefixo'), 'prefixo']
      )

      include.push(
        {
          model: Veiculo,
          as: 'veiculo',
          attributes: [],
        }
      )
    }

    try {
      if (perPage <= 0) {
        perPage = await Movimentacao.count({ where: whereCondition });
      }

      const { count, rows } = await Movimentacao.findAndCountAll({
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
      const result = await Movimentacao.findOne({
        order: [['updated_at', 'DESC']],
        where: {
          tipo: tab,
          saida: null,
          [Op.or]:[
            { '$entradaUser.documento$': busca },
            { '$veiculo.placa$': { [Op.iLike]: `%${busca}%` }},
            { '$veiculo.marca$': { [Op.iLike]: `%${busca}%` }},
            { '$veiculo.prefixo$': { [Op.iLike]: `%${busca}%` }}
          ]
        },
        attributes: [
          'id', 'tipo', 'destino_id', 'user_entrada_id', 'veiculo_id',
          [Sequelize.col('entradaUser.documento'), 'documento'],
          [Sequelize.col('entradaUser.nome'), 'nome'],
          [Sequelize.col('entradaUser->orgao.sigla_curta'), 'orgaoSigla'],
          [Sequelize.col('entradaUser->tratamento.sigla'), 'graduaAbrev'],
          [Sequelize.col('veiculo.placa'), 'placa'],
          [Sequelize.col('veiculo.marca'), 'modelo']
        ],
        include: [
          {
            model: Usuario,
            as: 'entradaUser',
            attributes: [],
            include: [
              { model: Tratamento, as: 'tratamento', attributes: [] },
              { model: Tipo_Documento, as: 'tipoDoc', attributes: [] },
              { model: Unidade, as: 'unidade', attributes: [] },
              { model: Orgao, as: 'orgao', attributes: [] }
            ]
          },
          { model: Destino, as: 'destino', attributes: [] },
          { model: Veiculo, as: 'veiculo', attributes: [] }
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
    const { registro_id, user_id, veiculo_id } = req.body

    if (!registro_id) {
      return res.status(400).json({ erro: true, msg: 'ID do registro não informado!'})
    }
    const payload = { saida: new Date().toISOString() }
    if (veiculo_id) {
      payload.user_saida_id = req.body.user_id
    }

    try {
      const [rowsUpdate] = await Movimentacao.update(payload, {
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
      const movimentacao = await Movimentacao.create({
        user_entrada_id: body.user_id,
        veiculo_id: body.veiculo_id || null,
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

export default new MovimentacaoController();
