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
      nDoc: DataTypes.STRING,
      destino: DataTypes.STRING,
      orgaoId: DataTypes.INTEGER,
      ubmId: DataTypes.INTEGER,
      graduaId: DataTypes.INTEGER,
      docId: DataTypes.INTEGER,
    }, {
      sequelize,
      modelName: 'pedestre',
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.orgao, { foreignKey: "orgaoId", as: "_orgao" });
    this.belongsTo(models.hierarquias, { foreignKey: "graduaId", as: "_grad" });
    this.belongsTo(models.documentos, { foreignKey: "docId", as: "_doc" });
  }
}

export default pedestre;