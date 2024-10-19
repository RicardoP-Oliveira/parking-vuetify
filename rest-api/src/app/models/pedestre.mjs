'use strict';
import { Model, DataTypes } from 'sequelize';
class pedestre extends Model {

  static init(sequelize){
    super.init({
      entrada: DataTypes.DATEONLY,
      hEntrada: DataTypes.TIME,
      saida: DataTypes.DATEONLY,
      hSaida: DataTypes.TIME,
      name: DataTypes.STRING,
      tDoc: DataTypes.STRING,
      nDoc: DataTypes.STRING,
      destino: DataTypes.STRING,
    }, {
      sequelize,
      modelName: 'pedestre',
    });
    return this;
  }
}

export default pedestre;