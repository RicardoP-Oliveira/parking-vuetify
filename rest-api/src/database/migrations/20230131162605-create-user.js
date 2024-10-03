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
        onDelete: "CASCADE",
      },
      email: {
	      allowNull: true,
	      type: Sequelize.STRING
      },
      cnh: {
	      allowNull: true,
	      type: Sequelize.STRING
      },
      isAdmin: {
        allowNull: false,
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      foto: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password_hash: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
}
