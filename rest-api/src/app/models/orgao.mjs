'use strict';
import { Model, DataTypes } from 'sequelize';

class orgao extends Model {
  static init(sequelize) {
    super.init(
      {
        orgao: DataTypes.STRING,
        sigla: DataTypes.STRING,
        siglaCurta: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'orgao',
      },
    );

      return this;
  }

  static associate(models) {
    this.hasMany(models.user, { foreignKey: "orgaoId", as: "users" });
    this.hasMany(models.carro, { foreignKey: "orgaoId", as: "carros" });
    this.hasMany(models.pedestre, { foreignKey: "orgaoId", as: "pedestres" });
    this.hasMany(models.ceics, { foreignKey: "eOrgaoId", as: "ceics" })
  }
}

export default orgao;

