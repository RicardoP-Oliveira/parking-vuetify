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
      tratamento_id: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      unidade_id: {
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
    this.belongsTo(models.Tratamento, { foreignKey: 'tratamento_id', as: 'tratamento' })
    this.belongsTo(models.Unidade, { foreignKey: 'unidade_id', as: 'unidade' })
    this.belongsTo(models.Tipo_Documento, { foreignKey: 'tipo_doc_id', as: 'tipoDoc' })
    this.hasMany(models.Veiculo, { foreignKey: 'usuario_id', as: 'veiculos' })
    this.hasMany(models.Movimentacao, { foreignKey: 'user_entrada_id', as: 'movimentacaoEntrada' })
    this.hasMany(models.Movimentacao, { foreignKey: 'user_saida_id', as: 'movimentacaoSaida' })  
  }
}

export default Usuario