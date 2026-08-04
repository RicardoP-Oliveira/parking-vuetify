'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.bulkInsert(
      { tableName: 'tipo_documentos', schema: 'atual' },
      [
        { tipo: 'RG', documento: 'Registro Geral' },
        { tipo: 'CPF', documento: 'Cadastro de Pessoa Física' },
        { tipo: 'Id Func', documento: 'Identidade Funcional' },
        { tipo: 'Matr', documento: 'Matrícula' },
        { tipo: 'CNH', documento: 'Carteira de Habilitação Nacional' }
      ]
    );
  },

  async down (queryInterface  ) {
    await queryInterface.bulkDelete('tipo_documentos', null, {});
  }
};
