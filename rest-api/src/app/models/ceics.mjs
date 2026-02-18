'use strict';
import  { Model, DataTypes, Op, Sequelize } from "sequelize";
import User from './user.mjs';
import Orgao from './orgao.mjs';
import Ubm from './ubm.mjs';
import Order from './hierarcar.mjs';
import Document from './documentos.mjs';
import Carro from './carro.mjs';

  class Ceics extends Model {

    static init(sequelize){
      super.init({
        entrada: DataTypes.DATEONLY,
        hEntrada: DataTypes.TIME,
        saida: DataTypes.DATEONLY,
        hSaida: DataTypes.TIME,
        destino: DataTypes.STRING,
        e_userId: DataTypes.INTEGER,
        s_userId: DataTypes.INTEGER,
        carroId: DataTypes.INTEGER,
      }, {
        sequelize,
        modelName: 'ceics',
      });
      return this;
    }

    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "e_userId", as: "entradaId" });
      this.belongsTo(models.user, { foreignKey: "s_userId", as: "saidaId" });
      this.belongsTo(models.carro, { foreignKey: "carroId", as: "carro"});
    }

    static async findCar(car) {

      if (!isNaN(car)) {
        return null;
      }

      try {
        const carro = await Carro.findOne({
          where: {
            [Op.or]: [
              { placa: { [Op.iLike]: `%${car}%`.trim() }},
              { marca: { [Op.iLike]: `%${car}%`.trim() }}
            ]
          },
          attributes: ['id', 'placa', 'marca']
        })

        if (!carro) return null

        const veiculo = await this.findOne({
          where: { carroId: carro.id, saida: null },
           attributes: [
            'id', 'destino', 'e_userId', 'carroId',
            [Sequelize.col('entradaId.orgaoId'), 'e_orgaoId'],
            [Sequelize.col('entradaId.ubmId'), 'e_ubmdId'],
            [Sequelize.col('entradaId.id'), 'e_condutorId'],
            [Sequelize.col('entradaId->ubm.name'), 'e_obm'],
            [Sequelize.col('entradaId.graduaId'), 'e_graduaId'],
            [Sequelize.col('entradaId.docId'), 'e_docId'],
            [Sequelize.col('entradaId.nGuerra'), 'e_condutor'],
            [Sequelize.col('entradaId->docUser.sigla'), 'e_siglaDoc'],
            [Sequelize.col('entradaId->hierarquia.abrev'), 'e_graduaAbrev'],
            [Sequelize.col('entradaId->orgaoU.siglaCurta'), 'e_siglaCurta'],
            [Sequelize.col('entradaId.documento'), 'e_documento'],
            [Sequelize.col('carro.placa'), 'carroPlaca'],
            [Sequelize.col('carro.marca'), 'carroMarca'],
          ],
          include: [
            {
              model: Carro,
              as: 'carro',
              attributes: [],
            },
            {
              model: User,
              as:'entradaId',
              attributes: [],
              include: [
                { model: Order, as: 'hierarquia', attributes: [] },
                { model: Document, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            // { model: Orgao, as: 'orgao', attributes: [] }
          ],
          order: [['createdAt', 'DESC']]
        });

        if (!veiculo) return null

        const dados = veiculo.get({ plain: true })

        dados.e_nomeCompleto = [
          dados.e_graduaAbrev,
          dados.e_siglaCurta,
          dados.e_condutor
        ].filter(Boolean).join(' ').trim()

        return dados;

      } catch (error) {
        console.error('Ocorreu um erro: ', error);
        throw error;
      }
    }

    static async serviceDay(date) {
      const service = await this.findAll({
        where: {
          saida: null 
        },
        order: [['updatedAt', 'DESC']]
      })
    }

  }

  export default Ceics;
