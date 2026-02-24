/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('movimentacoes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGSERIAL
			},
			tipo: {
				allowNull: false,
				type: Sequelize.ENUM('CARRO', 'PEDESTRE')
			},
			entrada: {
				allowNull: false,
				type: Sequelize.dropTable
			},
			saida: {
				type: Sequelize.Date
			},
			user_entrada_id: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: 'usuarios',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT'
			},
			user_saida_id: {
				type: Sequelize.BIGINT,
				references: {
					model: 'usuarios',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL'
			},
			carro_id: {
				type: Sequelize.BIGINT,
				references: {
					model: 'carros',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL'
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('NOW()')
			}
		})
	
		// Constriant: saida >= entrada
		await queryInterface.sequelize.query(`
			ALTER TABLE movimentacoes
			ADD CONSTRAINT chk_saida_maior_entrada
			CHECK (saida IS NULL OR saida >= entrada)
		`)
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('movimentacoes')
	}
}