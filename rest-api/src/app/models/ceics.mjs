'use strict';
import  { Model, DataTypes, Op } from "sequelize";

  class ceics extends Model {

    static init(sequelize){
      super.init({
        entrada: DataTypes.DATEONLY,
        hEntrada: DataTypes.TIME,
        saida: DataTypes.DATEONLY,
        hSaida: DataTypes.TIME,
        placa: DataTypes.STRING,
        marcaModelo: DataTypes.STRING,
        eCondutor: DataTypes.STRING,
        eRg: DataTypes.STRING,
        sRg: DataTypes.STRING,
        sCondutor: DataTypes.STRING,
        destino: DataTypes.STRING,
        eGradua: DataTypes.STRING,
        eOrgao: DataTypes.STRING,
        sGradua: DataTypes.STRING,
        sOrgao: DataTypes.STRING,
      }, {
        sequelize,
        modelName: 'ceics',
      });
      return this;
    }

    static async findCar(car) {

      if (!isNaN(car)) {
        return null;
      }

      let criteria = { [Op.or]: 
        [
          {placa: { [Op.iLike]: `%${car}%`}},
          {marcaModelo: {[Op.iLike]: `%${car}%`}}
        ],
        saida: null
      };

      try {
        const veiculo = await this.findOne({
          where: criteria,
          order: [['createdAt', 'DESC']]
        });

        return(veiculo);

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

  export default ceics;
