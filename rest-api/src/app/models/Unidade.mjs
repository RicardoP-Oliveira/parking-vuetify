'use strict';

import { Model, DataTypes } from 'sequelize';

class Unidade extends Model {
  static init(sequelize) {
    super.init(
      {
        sigla: {
          type: DataTypes.STRING,
          allowNull: false
        },
        unidade: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'Unidade',
        tableName: 'unidades',
        underscored: true,
        timestamps: true
  });

      return this;
  }

  static associate(models) {
    this.hasMany(models.Usuario, { foreignKey: "unidade_id", as: "usuarios"});
  }
}

export default Unidade;

