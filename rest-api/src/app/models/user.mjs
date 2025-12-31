'use strict';
import  { Model, DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';

  class user extends Model {

    static init(sequelize){
      super.init({
        gradua: DataTypes.STRING,
        documento: DataTypes.STRING,
        tipo_doc: DataTypes.STRING,
        nGuerra: DataTypes.STRING,
        ubmId: DataTypes.INTEGER,
        orgaoId: DataTypes.INTEGER,
        idTipoDoc: DataTypes.INTEGER,
        idGrad: DataTypes.INTEGER,
        // role: DataTypes.INTEGER,
	      // cnh: DataTypes.STRING,
        // foto: DataTypes.STRING,
	      // email: DataTypes.STRING,
        // password_hash: DataTypes.STRING,
        // password: DataTypes.VIRTUAL,
        // fotoUri: {
        //   type: DataTypes.VIRTUAL,
        //   get() {
        //     if(this.foto){
        //       return `http://localhost:3000/files/${this.foto}`;
        //     }
        //   }
        // }
      }, {
        sequelize,
        modelName: 'user',
      },
      {
        toJSON:{
          virtuals: true,
        }
      },
      );

      this.addHook('beforeSave', async user => {
        if(user.password){
          user.password_hash = await bcrypt.hash(user.password, 8);
        }
      });

      return this;
    }

    checkPassword(password) {
      return bcrypt.compare(password, this.password_hash);
    }

    static async getCmtGuarda(rg) {
      const user = await this.findOne({ where: { documento: rg } });
      const cmtGuarda = `${user.gradua} BM ${user.nGuerra}`
      return cmtGuarda; 
    }
     static associate(models) {
      this.belongsTo(models.ubm, { foreignKey: "ubmId", as: "ubm" });
      this.hasMany(models.carro, { foreignKey: "userId", as: "carros" });
      this.belongsTo(models.orgao, { foreignKey: "orgaoId", as: "orgaoU"});
      this.belongsTo(models.documentos, { foreignKey: "idTipoDoc", as: "tipoDoc"})
      this.belongsTo(models.hierarquias, { foreignKey: "idGrad", as: "hierarquia"})
    }


  }

  export default user


