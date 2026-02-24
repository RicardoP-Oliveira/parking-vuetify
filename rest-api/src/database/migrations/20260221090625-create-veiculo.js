/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('veiculos', {
      id: {
        type: Sequelize.BIGSERIAL,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      placa: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      marca: {
        type: Sequelize.STRING,
        allowNull: true
      },
      modelo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      renavam: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prefixo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      orgao_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'orgaos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    // Adicionando constraint para garantir exclusividade user_id x orgao_id
    await queryInterface.addConstraint('veiculos', {
      fields: ['user_id', 'orgao_id'],
      type: 'check',
      where: {
        user_id: { [Sequelize.Op.or]: [Sequelize.literal('NULL'), Sequelize.literal('NOT orgao_id IS NOT NULL')] }
      },
      name: 'chk_user_or_orgao_exclusivo'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('veiculos');
  }
};