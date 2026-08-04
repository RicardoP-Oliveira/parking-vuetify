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
    this.hasMany(models.Usuario, { foreignKey: "orgao_id", as: "usuarios" })
    this.hasMany(models.Veiculo, { foreignKey: "orgao_id", as: "veiculos"})
  }
} 

export default Orgao;

