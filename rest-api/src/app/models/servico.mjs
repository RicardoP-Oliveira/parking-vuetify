'use strict';
import  { Model, DataTypes } from "sequelize";

  class servico extends Model {

    static init(sequelize){
      super.init({
        rg: DataTypes.STRING,
        dataInicio: DataTypes.DATE,
        horaInicio: DataTypes.TIME,
	      dataTermino: DataTypes.DATE,
        horaTermino: DataTypes.TIME,
      }, {
        sequelize,
        modelName: 'servico',
      },
      );
      return this;
    }

    static async getData() {
      return await this.findAll({order: [['created_at', 'DESC']], limit: 5});
    }
  }

  export default servico;


