'use strict';
import { Model, DataTypes } from 'sequelize';
class Pedestre extends Model {

  static init(sequelize){
    super.init({
      entrada: DataTypes.DATEONLY,
      hEntrada: DataTypes.TIME,
      saida: DataTypes.DATEONLY,
      hSaida: DataTypes.TIME,
      name: DataTypes.STRING,
      nDoc: DataTypes.STRING,
      destino: DataTypes.STRING,
      orgaoId: DataTypes.INTEGER,
      ubmId: DataTypes.INTEGER,
      graduaId: DataTypes.INTEGER,
      docId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: 'pedestre',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.user, { foreignKey: "userId", as: "user" });
  }
}

export default Pedestre;