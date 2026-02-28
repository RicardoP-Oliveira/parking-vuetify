'use strict';
import  { Model, DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';

  class User extends Model {

    static init(sequelize){
      super.init({
        documento: DataTypes.STRING,
        n_guerra: DataTypes.STRING,
        ubm_id: DataTypes.INTEGER,
        orgao_id: DataTypes.INTEGER,
        doc_id: DataTypes.INTEGER,
        gradua_id: DataTypes.INTEGER,
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
        modelName: 'User',
        tableName: 'users',
        underscored: true,
        timestamps: true
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
      this.belongsTo(models.Ubm, { foreignKey: "ubm_id", as: "ubm" });
      this.hasMany(models.Carro, { foreignKey: "user_id", as: "carros" });
      this.belongsTo(models.Orgao, { foreignKey: "orgao_id", as: "orgaoU"});
      this.belongsTo(models.documentos, { foreignKey: "doc_id", as: "docUser"})
      this.belongsTo(models.hierarquias, { foreignKey: "gradua_id", as: "hierarquia"})
    }


  }

  export default User


