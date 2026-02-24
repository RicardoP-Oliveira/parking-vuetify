'user strict';
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
                modelName: 'documentos'
            }
        )
        return this;
    }

    static associate(models) {
        this.hasMany(models.User, { foreignKey: "docId", as: "users" });
    }
}

export default Documentos;