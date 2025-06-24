import { Model, DataTypes, Op } from 'sequelize';
import User from './user.mjs';
import Orgao from './orgao.mjs';
import Ubm from './ubm.mjs';

  class carro extends Model {
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

      // const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;
      let conditions = [];

      const carAsNumber = parseInt(car, 10);
      if (!isNaN(carAsNumber) &&  carAsNumber > 0) {
        conditions.push({id: carAsNumber});
      }

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
        const veiculo = await this.findOne({
          where: searchCriteria,
          include: [{
            model: User,
            as:'user',
            // attributes:['id', 'rg', 'nGuerra', 'foto', 'fotoUri'],
            include:[
              {
                model: Ubm,
                as: 'ubm',
                // attributes:['id', 'sigla']
              },
              {
                model: Orgao,
                as: 'orgaoU'
              }
            ]
            },
            {
              model: Orgao,
              as: 'orgao'
            }
          ]
        });
        
        return (veiculo);

      } catch (error) {
        console.error('Ocorreu um erro: ', error);
        throw error;
      }
    }
  }

  export default carro;
