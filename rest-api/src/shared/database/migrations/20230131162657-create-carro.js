'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carros', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      placa: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      marca: {
        allowNull: true,
        type: Sequelize.STRING
      },
      modelo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      userId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
           model: "users",
           key: "id"
        },
      },
      orgaoId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
           model: "orgaos",
           key: "id"
        },
      },
      renavam: {
        allowNull: true,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('carros');
  }
};
