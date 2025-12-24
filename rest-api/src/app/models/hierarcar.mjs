'user strict';
import { Model, DataTypes } from 'sequelize';

class hierarquia extends Model {
    static init(sequelize) {
        super.init(
            {
                abrev: DataTypes.STRING,
                hierarquia: DataTypes.STRING
            },
            {
                sequelize,
                modelName: 'hierarquias'
            }
        )
        return this;
    }
}

export default hierarquia;