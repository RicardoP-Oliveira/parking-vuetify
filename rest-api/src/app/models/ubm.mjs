'use strict';

import { Model, DataTypes } from 'sequelize';

class Ubm extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Ubm',
        tableName: 'ubms',
        underscored: true,
        timestamps: true
  });

      return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: "ubm_id", as: "users"});
  }
}

export default Ubm;

