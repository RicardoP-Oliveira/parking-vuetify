'use strict';
import { Model, DataTypes } from 'sequelize';

class orgao extends Model {
  static init(sequelize) {
    super.init(
      {
        orgao: DataTypes.STRING,
        sigla: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'orgao',
      },
    );

      return this;
  }

  static associate(models) {
    this.hasMany(models.user, { foreignKey: "orgaoId", as: "users"});
    this.hasMany(models.carro, { foreignKey: "orgaoId", as: "carros"});
  }
}

export default orgao;

