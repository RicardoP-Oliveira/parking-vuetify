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
        modelName: 'ubm',
  });

      return this;
  }

  static associate(models) {
    this.hasMany(models.user, { foreignKey: "ubmId", as: "users"});
  }
}

export default Ubm;

