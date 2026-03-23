import { Model, DataTypes } from 'sequelize';

class Tratamento extends Model {
  static init(sequelize) {
    super.init(
      {
        sigla: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        nome: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        }
      },
      {
        sequelize,
        modelName: 'Tratamento',
        tableName: 'tratamentos',
        underscored: true,
        timestamps: true
      }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Usuario, {
      foreignKey: 'tratamento_id',
      as: 'usuarios'
    });
  }
}

export default Tratamento;