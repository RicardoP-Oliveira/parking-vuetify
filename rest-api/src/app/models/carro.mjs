import { Model, DataTypes } from 'sequelize';
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

      const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;
      let searchCriteria = {};

      if (!isNaN(car) && car.length > 0) {
        searchCriteria.id = car;
      } else if (placaRegex.test(car)) {
        searchCriteria.placa = car;
      } else {
        searchCriteria.marca = car;
      }

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
        
        return ({veiculo, searchCriteria});

      } catch (error) {
        console.error('Ocorreu um erro: ', error);
        throw error;
      }
    }
  }

  export default carro;
