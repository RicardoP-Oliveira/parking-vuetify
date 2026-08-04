import { Model, DataTypes } from 'sequelize';

class Destino extends Model {
  static init(sequelize) {
    super.init(
      {
        unidade_id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          unique: true
        },
        ativo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: 'Destino',
        tableName: 'destinos',
        underscored: true,
        timestamps: true
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Unidade, {
      foreignKey: 'unidade_id',
      as: 'unidade'
    });

    this.hasMany(models.Movimentacao, {
      foreignKey: 'destino_id',
      as: 'movimentacoes'
    });
  }
}

export default Destino;