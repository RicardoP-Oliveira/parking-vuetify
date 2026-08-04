/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('movimentacoes', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.BIGINT
			},
			tipo: {
				allowNull: false,
				type: Sequelize.ENUM('VEICULO', 'PEDESTRE')
			},
			entrada: {
				allowNull: false,
				type: Sequelize.DATE
			},
			saida: {
				type: Sequelize.DATE
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
			veiculo_id: {
				type: Sequelize.BIGINT,
				references: {
					model: 'veiculos',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL'
			},
			destino_id: {
				allowNull: false,
				type: Sequelize.BIGINT,
				references: {
					model: 'destinos',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'RESTRICT'
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