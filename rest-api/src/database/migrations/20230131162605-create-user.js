'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gradua: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: 'Sr(ª)'
      },
      tipo_doc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      documento: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      orgaoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "orgaos",
          key: "id"
        }
      },
      nGuerra: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ubmId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: "ubms",
          key: "id"
        },
      },
      idTipoDoc: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: "documentos",
          key: "id"
        },
      },
      idGrad: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: "hierarquias",
          key: "id"
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
}
