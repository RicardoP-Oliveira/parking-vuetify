//src/models/jierarcar.mjs
import { Model, DataTypes } from 'sequelize';

class Hierarquia extends Model {
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

    // static associate(models) {
    //   this.hasMany(models.pedestre, { foreignKey: "gradua_id", as: "_pedestres" });
    //   this.hasMany(models.ceics, { foreignKey: "eGradua_id", as: "_grad" });
    //   this.hasMany(models.User, { foreignKey: "gradua_id", as: "_user" })
    // }
}

export default Hierarquia;