// src/models/documentos.mjs
import { Model, DataTypes } from 'sequelize';

class Documentos extends Model {
    static init(sequelize) {
        super.init(
            {
                sigla: DataTypes.STRING,
                name: DataTypes.STRING
            },
            {
                sequelize,
                modelName: 'documentos',
                underscored: true,
            }
        )
        return this;
    }

    static associate(models) {
        this.hasMany(models.User, { foreignKey: "doc_id", as: "users" });
    }
}

export default Documentos;