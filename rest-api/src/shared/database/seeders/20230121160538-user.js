'use strict';

const { faker } = require('@faker-js/faker/locale/pt_BR');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 0; i < 15; i++) {
      await queryInterface.bulkInsert('users', [{
        gradua: faker.helpers.arrayElement([
          'Cel',
          'Ten-Cel',
          'Maj',
          'Cap',
          '1º Ten',
          '2º Ten',
          'Asp',
          'CAD',
          'Subten',
          '1º Sgt',
          '2º Sgt',
          '3º Sgt',
          'Cb',
          'Sd']
        ),
        name: faker.name.fullName(),
        rg: Math.ceil((Math.random() * (23550-23500)+23500)),
        nGuerra: faker.name.middleName(),
        ubmId: Math.ceil(Math.random() * 9),
        isAdmin: 2
       }]);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});

  }
};
