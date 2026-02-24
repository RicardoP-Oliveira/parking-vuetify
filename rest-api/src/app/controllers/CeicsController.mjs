import Carro from '../models/carro.mjs'
import Ceics from '../models/ceics.mjs'
import vtrAdd from '../models/vtradd.mjs'
import Resposta from '../models/Resposta.mjs'
import User from '../models/user.mjs'
import Documento from '../models/documentos.mjs'
import Ubm from '../models/ubm.mjs'
import Orgao from '../models/orgao.mjs'
import Hierarquia from '../models/hierarcar.mjs'
import { Op, Sequelize } from 'sequelize'
import util from 'util'

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

  if(end) {
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

    if(query) {
      conditions.push({ tipo: query })
    }
    

    if(placa) {
      conditions.push({ '$carro.placa$': {[Op.iLike]: `%${placa}%`}});
    }
    
    if (documento) {
      conditions.push({
        [Op.or]: [ 
          { '$entradaId.documento$': { [Op.iLike]: `%${documento}%`}},
          { '$saidaId.documento$': { [Op.iLike]: `%${documento}%`}}
        ]
      });
    }
    
    if (modelo) {
      conditions.push({'$carro.marca$': { [Op.iLike]: `%${modelo}%`}});
    }

    if (condutor) {
      conditions.push({
        [Op.or]: [
          { '$entradaId.nGuerra$': { [Op.iLike]: `%${condutor}%`}},
          { '$saidaId.nGuerra$': { [Op.iLike]: `%${condutor}%`}}  
        ]
      });
    }
     
    if (dataInicio || dataFim) {
      const filtroData = buildDateTimeFilter('entrada', dataInicio, dataFim, 'DATE')

      if(filtroData) conditions.push(filtroData)
    }

    if (horaInicio || horaFim) {
      const filtroHora = buildDateTimeFilter('entrada', horaInicio, horaFim, 'TIME')
    
      if (filtroHora) conditions.push(filtroHora)
    }

    if (conditions.length > 0) {
      whereCondition = {[Op.and]: conditions};
    } else {
      whereCondition = {};
    }

    const attributes = [
      'id', 'destino', 'tipo',
      // Campos data/hora
      [Sequelize.literal(`(entrada AT TIME ZONE 'America/Sao_Paulo')`), 'entrada'],
      [Sequelize.literal(`TO_CHAR(entrada AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS')`), 'hEntrada'],
      [Sequelize.literal(`(saida AT TIME ZONE 'America/Sao_Paulo')`), 'saida'],
      [Sequelize.literal(`TO_CHAR(saida AT TIME ZONE 'America/Sao_Paulo', 'HH24:MI:SS')`), 'hSaida'],
      // Campos do condutor/pedestre de entrada
      [Sequelize.col('entradaId.nGuerra'), 'e_condutor'],
      [Sequelize.col('entradaId.documento'), 'e_documento'],
      [Sequelize.col('entradaId->docUser.sigla'), 'e_tipoDoc'],
      [Sequelize.col('entradaId->hierarquia.abrev'), 'e_graduaAbrev'], 
      [Sequelize.col('entradaId->orgaoU.siglaCurta'), 'e_siglaCurta'],
      // Campos do condutor/pedestre de saída
      [Sequelize.col('saidaId.nGuerra'), 's_condutor'],
      [Sequelize.col('saidaId.documento'), 's_documento'],
      [Sequelize.col('saidaId->hierarquia.abrev'), 's_graduaAbrev'],
      [Sequelize.col('saidaId->orgaoU.siglaCurta'), 's_siglaCurta'],
    ]

    const include = [
      {
        model: User,
        as: 'entradaId',
        attributes: [],
        required: false,
        include: [
          { model: Orgao, as: 'orgaoU', attributes: [] },
          { model: Hierarquia, as: 'hierarquia', attributes: [] },
          { model: Documento, as: 'docUser', attributes: [] },
        ]
      },      {
        model: User,
        as: 'saidaId',
        attributes: [],
        required: false,
        include: [
          { model: Orgao, as: 'orgaoU', attributes: [] },
          { model: Hierarquia, as: 'hierarquia', attributes: [] },
        ]
      },
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
      if(perPage <=0 ){
        perPage = await Ceics.count({ where: whereCondition });
      }

      const { count, rows } = await Ceics.findAndCountAll({
        order: [['updatedAt', 'DESC']],
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
    const { identificador } = req.params;
    const { 'tab': tab } = req.headers;
    const defaultRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;

    const busca = identificador ? identificador.trim() : '';

    const criteria = {
        [Op.or]: [
            
            { '$userCar.documento$': { [Op.iLike]: `%${busca}%` } },
        ]
    };

    try { 
      const teste = await Ceics.findOne({
        order: [['updatedAt', 'DESC']],
        where: {
          tipo: tab,
          '$entradaId.documento$': { [Op.iLike]: `%${identificador}%` },
          saida: null
        },
        attributes: [
          'id', 'tipo', 'destino',
          [Sequelize.col('entradaId.documento'), 'documento'],
          [Sequelize.col('entradaId.ubmId'), 'ubmId'],
          [Sequelize.col('entradaId.orgaoId'), 'orgaoId'],
          [Sequelize.col('entradaId.docId'), 'docId'],
          [Sequelize.col('entradaId.graduaId'), 'graduaId'],
          [Sequelize.col('entradaId.nGuerra'), 'nome']
        ],
        include: [
          {
            model: User,
            as: 'entradaId',
            attributes: [],
            include: [
              { model: Hierarquia, as: 'hierarquia', attributes: [] },
              { model: Documento, as: 'docUser', attributes: [] },
              { model: Ubm, as: 'ubm', attributes: [] },
              { model: Orgao, as: 'orgaoU', attributes: [] }
            ]
          }
        ]
      })

      if (teste) {
        resposta.dados = teste
      } else {
        resposta.erro = true
        resposta.msg = 'Nenhum registro encontrado'
      }
      

      return res.json(resposta)
    } catch (e) {
      resposta.erro = true
      resposta.msg = 'Surgiu um erro'
    }

    // try {
    //     const veiculo = await Carro.findOne({
    //         where: criteria,
    //         subQuery: false, // ESSENCIAL para funcionar filtros em associações
    //         attributes: [
    //             'id', 'placa', 'marca',
    //             [Sequelize.col('userCar.ubmId'), 'ubmId'],
    //             [Sequelize.col('userCar.documento'), 'documento'],
    //             [Sequelize.col('userCar.nGuerra'), 'nome'],
    //             [Sequelize.col('userCar.orgaoId'), 'orgaoId'],
    //             [Sequelize.col('userCar.docId'), 'docId'],
    //             [Sequelize.col('userCar.graduaId'), 'graduaId'],
    //             [Sequelize.col('userCar->docUser.sigla'), 'docSigla'],
    //             [Sequelize.col('userCar->ubm.name'), 'nomeUbm'],
    //             [Sequelize.col('userCar->hierarquia.abrev'), 'graduaAbrev'],
    //             [Sequelize.col('userCar->orgaoU.siglaCurta'), 'orgaoSigla'],
    //         ],
    //         include: [
    //             {
    //                 model: User,
    //                 as: 'userCar',
    //                 required: false, // Permite encontrar o carro mesmo que o documento buscado não seja dele
    //                 attributes: [],
    //                 include: [
    //                     { model: Hierarquia, as: 'hierarquia', attributes: [] },
    //                     { model: Documento, as: 'docUser', attributes: [] },
    //                     { model: Ubm, as: 'ubm', attributes: [] },
    //                     { model: Orgao, as: 'orgaoU', attributes: [] }
    //                 ]
    //             },
    //             { model: Orgao, as: 'orgao', attributes: [] }
    //         ]
    //     });

    //     if (veiculo) {
    //         const dados = veiculo.get({ plain: true });

    //         // Monta o nome completo para o frontend
    //         dados.nomeCompleto = [
    //             dados.graduaAbrev, 
    //             dados.orgaoSigla, 
    //             dados.nome
    //         ].filter(Boolean).join(' ');
            
    //         resposta.dados = dados;
    //         resposta.msg = 'Veículo encontrado com sucesso!';
    //     } else {
    //         resposta.erro = true;
    //         // Verifica se o que foi digitado segue o padrão de placa
    //         if (defaultRegex.test(busca.toUpperCase())) {
    //             resposta.msg = 'Visitante';
    //             resposta.visitor = true;
    //         } else {
    //             resposta.msg = 'Viatura não cadastrada!\nContate o Administrador.';
    //         }
    //     }

    // } catch (error) {
    //     console.error('ERRO NO SHOW:', error);
    //     resposta.erro = true;
    //     resposta.msg = `Erro na busca: ${error.message}`;
    // }

    // return res.json(resposta);
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
  
  try {
    const body = req.body

    console.log(body)

    const user = await User.findOne({
      where:{ id: body.userId } 
    })

    // Verificar entrada aberta
    const entrada = await Ceics.findOne({
      where: {
        id: body.id,
        saida: null
      },
      order: [['updatedAt', 'DESC']]
    })

    let movimentacao

    if(!entrada) {
      movimentacao = await Ceics.create({
        e_userId: body.userId,
        carroId: body.carroId,
        tipo: body.tipo,
        destino: body.destino,
        entrada: new Date().toISOString()
      })

    } else {
      movimentacao = await entrada.update({
        s_userId: body.userId,
        saida: new Date().toISOString()
      })
    }

    return res.json({ user, movimentacao })

  } catch (e) {
    console.error('ERRO: ',e)
    return res.status(500).json({
      erro: true,
      msg: e.message,
      errors: e.erros
    })
  }
   


  // const dataParking = {
  //   placa: placa,
  //   marcaModelo: marcaModelo,
  //   eCondutor: condutor,
  //   eRg: documento,
  //   destino,
  //   eGradua: gradua,
  //   eOrgao: orgao,
  //   entrada: new Date(),
  //   hEntrada: new Date().toLocaleTimeString(),
  // }

  // const vaga = await Ceics.findOne({
  //   where: [
  //     {
  //       placa: placa
  //     },
  //     {
  //       saida: null
  //     }
  //   ],
  //   order: [['updatedAt', 'DESC']],
  // });

  // if(!vaga){
  //   try {
  //     // var saida = await Ceics.create(dataParking);
  //   } catch (error) {
  //     console.warn(`[erro] Ocorreu o erro: ${error}`);
  //   }
    
  //   const vtrPattern = /^([A-Z][A-Z0-9]{1,5}-\d{3}$|^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$)/;

  //   if (vtrPattern.test(marcaModelo) || vtrPattern.test(placa)) {
  //     const addVtr = {
  //       placa,
  //       prefix: marcaModelo,
  //       owner,
  //       documento
  //     }
  //     try {
  //       const exist = await vtrAdd.findOne({
  //         where: {
  //          [Op.or]: [
  //           {placa: { [Op.iLike]: `%${placa}%`}},
  //           {prefix: { [Op.iLike]: `%${marcaModelo}%`}}
  //          ]
           
  //         }});
  //       if (!exist) {
  //         await vtrAdd.create(addVtr);
  //       } else {
  //         await vtrAdd.update(addVtr, {where: { id: exist.id}});
  //       }
        
  //     } catch (error) {
  //       console.warn(`[erro] Ocorreu o erro: ${error}`);
  //     } 
  //   }
  // } else {
  //   var dados = {
  //     sCondutor: condutor,
  //     sRg: documento,
  //     sGradua: gradua,
  //     sOrgao: orgao,
  //     saida: new Date(),
  //     hSaida: new Date().toLocaleTimeString(),
  //   }
  //   // var saida = await vaga.update(dados);
  // }

  //  return res.json(saida);
  }
}

export default new CeicsController();
