'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedestres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
      },
      tDoc: {
        type: Sequelize.STRING,
      },
      nDoc: {
        type: Sequelize.STRING,
        allowNull: false,
        required: true
      },
      entrada: {
        type: Sequelize.DATEONLY,
      },
      hEntrada: {
        type: Sequelize.TIME
      },
      saida: {
        type: Sequelize.DATEONLY,
      },
      hsaida: {
        type: Sequelize.TIME
      },
      destino: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('pedestres');
  }
};