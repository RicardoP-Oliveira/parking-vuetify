// src/models/ceics.mjs
import  { Model, DataTypes, Op, Sequelize } from "sequelize";
import User from './user.mjs';
import Orgao from './orgao.mjs';
import Ubm from './ubm.mjs';
import Order from './hierarcar.mjs';
import Document from './documentos.mjs';
import Carro from './carro.mjs';
import Target from './target.mjs';

  class Ceics extends Model {

    static init(sequelize){
      super.init({
        entrada: DataTypes.DATE,
        saida: DataTypes.DATE,
        destino_id: DataTypes.INTEGER,
        e_user_id: DataTypes.INTEGER,
        s_user_id: DataTypes.INTEGER,
        carro_id: DataTypes.INTEGER,
        tipo: DataTypes.ENUM('carro','pedestre'),
      }, {
        sequelize,
        modelName: 'ceics',
        underscored: true,
        timestamps: true
      });
      return this;
    }

    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "e_user_id", as: "entrada_id" });
      this.belongsTo(models.User, { foreignKey: "s_user_id", as: "saida_id" });
      this.belongsTo(models.Carro, { foreignKey: "carro_id", as: "carro" });
      this.belongsTo(models.Target, { foreignKey: "destino_id", as: "destinos" });
    }

    static async serviceDay(date) {
      const service = await this.findAll({
        where: {
          saida: null 
        },
        order: [['updated_at', 'DESC']]
      })
    }

  }

  export default Ceics;
