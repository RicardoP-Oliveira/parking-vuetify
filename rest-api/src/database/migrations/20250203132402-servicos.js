
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('servicos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rg: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dataInicio: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      horaInicio: {
        allowNull: false,
        type: Sequelize.TIME
      },
      dataTermino: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      horaTermino: {
        allowNull: false,
        type: Sequelize.TIME
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
    await queryInterface.dropTable('servicos');
  }
};