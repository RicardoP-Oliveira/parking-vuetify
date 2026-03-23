import { Model, DataTypes } from 'sequelize';

class Movimentacao extends Model {
  static init(sequelize) {
    super.init({
      tipo: {
        type: DataTypes.ENUM('VEICULO', 'PEDESTRE'),
        allowNull: false
      },
      entrada: {
        type: DataTypes.DATE,
        allowNull: false
      },
      saida: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          isAfterEntrada(value) {
            if (value && this.entrada && value < this.entrada) {
              throw new Error('A saída deve ser igual ou posterior à entrada.')
            }
          }
        }
      },
      user_entrada_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      user_saida_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      veiculo_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      destino_id: {
        type:DataTypes.INTEGER,
        allowNull: false
      }
      
    }, {
      sequelize,
      modelName: 'Movimentacao',
      tableName: 'movimentacoes',
      underscored: true,
      timestamps: true,
      validate: {
        coerenciaTipoVeiculo() {
          if (this.tipo === 'PEDESTRE' && this.veiculo_id) {
            throw new Error('Movimentação do tipo PEDESTRE não pode ter veículo.');
          }
          if (this.tipo === 'VEICULO' && !this.veiculo_id) {
            throw new Error('Movimentação do tipo VEICULO de ter veículo.')
          }
        }
      }
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'user_entrada_id', as: 'entradaUser' })
    this.belongsTo(models.Usuario, { foreignKey: 'user_saida_id', as: 'saidaUser' })
    this.belongsTo(models.Veiculo, { foreignKey: 'veiculo_id', as: 'veiculo' })
    this.belongsTo(models.Destino, { foreignKey: 'destino_id', as: 'destino' })
  }
}

export default Movimentacao