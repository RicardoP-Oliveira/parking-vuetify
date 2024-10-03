'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ubms', [
      {
        name: "Diretoria Geral de Ensino e Instrução",
        sigla: "DGEI",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Diretoria de Instrução",
        sigla: "DI",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Escola de Comando Bombeiro Militar",
        sigla: "EsCBM",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Academia de Bombeiro Militar D Pedro II",
        sigla: "ABMDP II",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Centro de Formação e Aperfeiçoamento de Praças",
        sigla: "CFAP",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Centro de Instrução Especializada de Bombeiros",
        sigla: "CIEB",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Centro de Treinamento e Reciclagem de Motoristas",
        sigla: "CTRM",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Destacamento de Bombeiro Militar CEICS",
        sigla: "DBM/CEICS",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Odontoclínica Militar Maj Paulo Correia Cardoso",
        sigla: "OMMPCC",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Outro",
        sigla: "Outro",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ubms', null, {});
  }
};
