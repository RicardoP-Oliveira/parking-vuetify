'use strict';
import { Model, DataTypes } from 'sequelize';
class Pedestre extends Model {

  static init(sequelize){
    super.init({
      entrada: DataTypes.DATEONLY,
      hEntrada: DataTypes.TIME,
      saida: DataTypes.DATEONLY,
      hSaida: DataTypes.TIME,
      // name: DataTypes.STRING,
      // documento: DataTypes.STRING,
      destino: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: 'pedestre',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  }
}

export default Pedestre;