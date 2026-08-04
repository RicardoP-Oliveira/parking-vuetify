/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      documento: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING
      },
      orgao_id: {
        type: Sequelize.BIGINT,
        references: {
          model: 'orgaos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tratamento_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'tratamentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      unidade_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'unidades',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      tipo_doc_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'tipo_documentos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios')
  }
}