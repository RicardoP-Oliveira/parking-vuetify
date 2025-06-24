import { Model, DataTypes, Op } from 'sequelize';

  class vtradd extends Model {
   static init(sequelize){
    super.init({
      placa: DataTypes.STRING,
      prefix: DataTypes.STRING,
      owner: DataTypes.STRING,
      documento: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'vtradd',
    });
    return this;
   }
  }

export default vtradd;
