'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ceics', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      entrada: {
        type: Sequelize.DATEONLY
      },
      hEntrada: {
        type: Sequelize.TIME
      },
      saida: {
        type: Sequelize.DATEONLY
      },
      hSaida: {
        type: Sequelize.TIME
      },
      placa: {
        allowNull: false,
        type: Sequelize.STRING
      },
      marcaModelo: {
        allowNull: true,
        type: Sequelize.STRING
      },
      eCondutor: {
        allowNull: false,
        type: Sequelize.STRING
      },
      eRg: {
        allowNull: false,
        type: Sequelize.STRING
      },
      sRg: {
        allowNull: true,
        type: Sequelize.STRING
      },
      sCondutor: {
        allowNull: true,
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ceics');
  }
};
