import { Model, DataTypes } from 'sequelize';

class Veiculo extends Model {
  static init(sequelize) {
    super.init({
      placa: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { notEmpty: true }
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: true
      },
      modelo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      renavam: {
        type: DataTypes.STRING,
        allowNull: true
      },
      prefixo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      orgao_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      sequelize,
      modelName: 'Veiculo',
      tableName: 'veiculos',
      underscored: true,
      timestamps: true,
      validate: {
        onlyOneOwner() {
          if (this.usuario_id && this.orgao_id) {
            throw new Error('Veículo deve ter apenas user_id ou orgao_id, não ambos.')
          }
          if (!this.usuario_id && !this.orgao_id) {
            throw new Error('Veículo deve ter user_id ou orgao_id.')
          }
        }
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'user' })
    this.belongsTo(models.Orgao, { foreignKey: 'orgao_id', as: 'orgao' })
    this.hasMany(models.Movimentacao, { foreignKey: 'veiculo_id', as: 'veiculo'})
  }
}

export default Veiculo;