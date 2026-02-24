import { Model, DataTypes } from 'sequelize';

class Orgao extends Model {
  static init(sequelize) {
    super.init(
      {
        orgao: {
          type: DataTypes.STRING,
          defaultValue: false
        },
        sigla: {
          type: DataTypes.STRING,
          defaultValue: false
        },
        siglaCurta: {
          type: DataTypes.STRING,
          defaultValue: true
        } 
      },
      {
        sequelize,
        modelName: 'Orgao',
        tableName: 'orgaos',
        underscored: false,
        timestamps: true
      },
    );

      return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: "orgaoId", as: "users" });
    this.hasMany(models.Carro, { foreignKey: "orgaoId", as: "carros" });
  }
} 

export default Orgao;

