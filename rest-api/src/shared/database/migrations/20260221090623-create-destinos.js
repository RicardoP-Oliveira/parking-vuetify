'use strict';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('destinos', {
      id: {
        type: Sequelize.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      unidade_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'unidades',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      ativo: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('destinos');
  }
};