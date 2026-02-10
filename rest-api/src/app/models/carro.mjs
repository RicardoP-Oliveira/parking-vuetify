import { Model, DataTypes, Op } from 'sequelize';
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
      userId: DataTypes.INTEGER,
      orgaoId: DataTypes.INTEGER,
      renavam: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'carro',
    });
    return this;
   }

    static associate(models) {
      this.belongsTo(models.user, { foreignKey: "userId", as: "user" });
      this.belongsTo(models.orgao, { foreignKey: "orgaoId", as: "orgao" });
    }

    static async findCar(car) {
      
      let veiculo = null;

      const carAsNumber = parseInt(car, 10);

      if (!isNaN(carAsNumber) &&  carAsNumber > 0) {
        try {
          veiculo = await this.findOne({
            where: { id: carAsNumber},
            include: [{
              model: User,
              as: 'user',
              include: [
                { model: Ubm, as: 'ubm' },
                { model: Orgao, as: 'orgaoU' },
                { model: Document, as: 'docUser'},
                { model: Order, as: 'hierarquia' }
              ]
              },
              {
                model: Orgao,
                as: 'orgao'
              }
            ]
          });
        } catch (error) {
          console.error('Erro ao buscar veículo por ID: ', error);
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
            include: [{
              model: User,
              as:'user',
              include:[
                { model: Ubm, as: 'ubm' },
                { model: Orgao, as: 'orgaoU' },
                { model: Document, as: 'docUser'},
                { model: Order, as: 'hierarquia' }
              ]
              },
              {
                model: Orgao,
                as: 'orgao'
              }
            ]
          });
        } catch (error) {
          console.error('Ocorreu um erro: ', error);
          throw error;
        }
      }

      return (veiculo);

    }
  }

export default Carro;
