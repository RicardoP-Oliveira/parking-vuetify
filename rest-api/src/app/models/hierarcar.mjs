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

    static associate(models) {
      this.hasMany(models.pedestre, { foreignKey: "graduaId", as: "_pedestres" });
      this.hasMany(models.ceics, { foreignKey: "eGraduaId", as: "_grad" });
    }
}

export default hierarquia;