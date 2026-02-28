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
        underscored: true,
        timestamps: true
      },
    );

      return this;
  }

  static associate(models) {
    this.hasMany(models.User, { foreignKey: "orgao_id", as: "users" });
    this.hasMany(models.Carro, { foreignKey: "orgao_id", as: "carros" });
  }
} 

export default Orgao;

