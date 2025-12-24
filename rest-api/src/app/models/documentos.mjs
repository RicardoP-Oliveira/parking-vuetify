'user strict';
import { Model, DataTypes } from 'sequelize';

class documentos extends Model {
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
}

export default documentos;