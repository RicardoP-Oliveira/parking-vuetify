import { Model, DataTypes} from "sequelize"

class Usuario extends Model {

  static init(sequelize) {
    super.init({
      documento: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      orgao_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      trato_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      ubm_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      tipo_doc_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Usuario',
      tableName: 'usuarios',
      underscored: true,
      timestamps: true
    })
    return this
  }
  
  static associate(models) { /** Associações requeridas */
    this.belongsTo(models.Orgao, { foreignKey: 'orgao_id', as: 'orgao' })
    this.belongsTo(models.Trato, { foreignKey: 'trato_id', as: 'trato' })
    this.belongsTo(models.Unidade, { foreignKey: 'ubm_id', as: 'ubm' })
    this.belongsTo(models.TipoDoc, { foreignKey: 'tipo_doc_id', as: 'tipoDoc' })
    this.hasMany(models.Veiculo, { foreignKey: 'user_id', as: 'veiculos' })
    this.hasMany(models.Movimentacao, { foreignKey: 'user_entrada_id', as: 'movimentacaoEntrada' })
    this.hasMany(models.Movimentacao, { foreignKey: 'user_saida_id', as: 'movimentacaoSaida' })  
  }
}