import { Model, DataTypes } from 'sequelize';

class Target extends Model {
  static init(sequelize) {
    super.init(
      {
        target: DataTypes.STRING
      },
      {
        sequelize,
        modelName: 'Target',
        tableName: 'targets',
        underscored: true,
        timestamps: true,
  });

      return this;
  }

}

export default Target;