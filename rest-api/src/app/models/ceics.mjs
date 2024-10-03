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
        owner: DataTypes.STRING,
      }, {
        sequelize,
        modelName: 'ceics',
      });
      return this;
    }

    static async findCar(car) {

      const placaRegex = /^[A-Z]{3}[0-9][A-Z0-9]{1}[0-9]{2}$/;
      const vtrRegex = /^[A-Z0-9]{1,4}-\d{3}$/;
      let searchCriteria = { saida: null };

      if (!isNaN(car)) {
        const resposta = {
          erro: true,
          msg: 'Não é permitido pesquisa pelo identificador!'
        }
        return (resposta)
      }
      
      if (placaRegex.test(car)) {
        searchCriteria.placa = car;
      } else if (vtrRegex.test(car)) {
        searchCriteria.marcaModelo = car;
      }

      try {
        const veiculo = await this.findOne({
          where: searchCriteria,
        });

        return(veiculo);

      } catch (error) {
        console.error('Ocorreu um erro: ', error);
        throw error;
      }
    }
  }

  export default ceics;
