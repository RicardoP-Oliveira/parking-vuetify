// src/models/carro.mjs
import { Model, DataTypes, Op, Sequelize } from 'sequelize';
import User from './user.mjs';
import Orgao from './orgao.mjs';
import Ubm from './ubm.mjs';
import Order from './hierarcar.mjs';
import Document from './documentos.mjs';


  class Carro extends Model {
   static init(sequelize){
    super.init({
      placa: DataTypes.STRING,
      marca: DataTypes.STRING,
      modelo: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      orgao_id: DataTypes.INTEGER,
      renavam: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'Carro',
      tableName: 'carros',
      underscored: true,
      timestamps: true
    });
    return this;
   }

   static associate(models) {
      this.belongsTo(models.User, { foreignKey: "user_id", as: "userCar" });
      this.belongsTo(models.Orgao, { foreignKey: "orgao_id", as: "orgao" });
      this.hasMany(models.ceics, { foreignKey: "carro_id", as: "movimentos" });
    }

    static async findCar(car) {
      
      let veiculo = null;

      const carAsNumber = parseInt(car, 10);
 
      if (!isNaN(carAsNumber) &&  carAsNumber > 0) {
        console.log('[TESTE] ==> ', carAsNumber)
        try {
          veiculo = await this.findOne({
            where: { _id: carAsNumber},
            attributes: [
            '_id', 'placa', 'marca', 'user_id', 'orgao_id',
            [Sequelize.col('userCar.ubm_id'), 'ubm_id'],
            [Sequelize.col('userCar.documento'), 'documento'],
            [Sequelize.col('userCar.n_guerra'), 'nome'],
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
                { model: Document, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            { model: Orgao, as: 'orgao', attributes: [] }
          ]
          });
        } catch (error) {
          console.error('Erro ao buscar veículo por Id: ', error);
          throw error;
        }
      }

      if(!veiculo) {
        let conditions = [];

        conditions.push({placa: { [Op.iLike]: `%${car}%`}});
        conditions.push({modelo: { [Op.iLike]: `%${car}%`}});

        if (conditions.length === 0) {
          console.warn("Nenhum critério de busca válido gerado para a entrada.");
          return null;
        }

        let searchCriteria = {
          [Op.or]: conditions
        };

        try {
          veiculo = await this.findOne({
            where: searchCriteria,
            attributes: [
            '_id', 'placa', 'marca', 'user_id',
            [Sequelize.col('userCar.ubm_id'), 'ubm_id'],
            [Sequelize.col('userCar.documento'), 'documento'],
            [Sequelize.col('userCar.n_guerra'), 'nome'],
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
                { model: Document, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            { model: Orgao, as: 'orgao', attributes: [] }
          ]
          });
        } catch (error) {
          console.error('Ocorreu um erro: ', error);
          throw error;
        }
      }

      const dados = veiculo.get({ plain: true })

      dados.nomeCompleto = [
        dados.graduaAbrev,
        dados.orgaoSigla,
        dados.nome
      ].filter(Boolean).join(' ')



      return dados;
      // return (veiculo)

    }
  }

export default Carro;
