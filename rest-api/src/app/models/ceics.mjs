'use strict';
import  { Model, DataTypes } from "sequelize";

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
      }, {
        sequelize,
        modelName: 'ceics',
      });
      return this;
    }

    static async findCar(car) {

      const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;
      const vtrRegex = /^[A-Z]{1,4}[0-9]?-\d{3}$/;
      let searchCriteria = { saida: null };

      if (!isNaN(car)) {
        return false;
      }
      
      if (placaRegex.test(car)) {
        searchCriteria.placa = car;
      } else if (vtrRegex.test(car)) {
        searchCriteria.marcaModelo = car;
      }

      try {
        const veiculo = await this.findOne({
          where: searchCriteria,
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
