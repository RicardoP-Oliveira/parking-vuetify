'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ubms', [
      {
        name: "Diretoria Geral de Ensino e Instrução",
        sigla: "DGEI",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Diretoria de Instrução",
        sigla: "DI",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Escola de Comando Bombeiro Militar",
        sigla: "EsCBM",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Academia de Bombeiro Militar D Pedro II",
        sigla: "ABMDP II",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Centro de Formação e Aperfeiçoamento de Praças",
        sigla: "CFAP",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Centro de Instrução Especializada de Bombeiros",
        sigla: "CIEB",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Centro de Treinamento e Reciclagem de Motoristas",
        sigla: "CTRM",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Destacamento de Bombeiro Militar CEICS",
        sigla: "DBM/CEICS",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Odontoclínica Militar Maj Paulo Correia Cardoso",
        sigla: "OMMPCC",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Outro",
        sigla: "Outro",
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ubms', null, {});
  }
};
