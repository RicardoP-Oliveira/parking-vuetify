'use strict';

import { Model, DataTypes } from 'sequelize';

class target extends Model {
  static init(sequelize) {
    super.init(
      {
        target: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'target',
  });

      return this;
  }

}

export default target;