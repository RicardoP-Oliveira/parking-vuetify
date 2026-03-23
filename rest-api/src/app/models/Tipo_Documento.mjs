'user strict';
import { Model, DataTypes } from 'sequelize';

class Tipo_Documento extends Model {
	static init(sequelize) {
		super.init(
			{
				tipo: {
					type: DataTypes.STRING,
					allowNull: false
				},
				documento: {
					type: DataTypes.STRING,
					allowNull: false
				}
			},
			{
				sequelize,
				modelName: 'Tipo_Documento',
				tableName: 'tipo_documentos',
				underscored: true,
				timestamps: true
			}
		)
		return this;
	}

	static associate(models) {
		this.hasMany(models.Usuario, { foreignKey: "tipo_doc_id", as: "users" });
	}
}

export default Tipo_Documento