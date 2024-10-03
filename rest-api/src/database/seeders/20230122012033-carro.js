'use strict';

const { faker } = require('@faker-js/faker/locale/pt_BR');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 0; i < 15; i++) {
      await queryInterface.bulkInsert('carros', [{
        placa: faker.random.alpha({count: 3, casing: 'upper'})+
        faker.random.numeric(4),
        modelo: faker.helpers.arrayElement([
          'Sedan',
          'Rat',
          'SUV'
        ]),
        marca: faker.helpers.arrayElement([
          'Renault',
          'Pegout',
          'Chevrolet',
          'Volskwagem',
          'Toyota',
          'BMW',
          'Honda'
        ]),
        userId: Math.ceil(Math.random() * 15),
        // ubmId: Math.ceil(Math.random() * 9),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAK2SURBVO3BQW7ARgwEwR5C//9yx0eeFhAkOTHDqviDNUaxRinWKMUapVijFGuUYo1SrFGKNUqxRinWKMUapVijFGuUYo1SrFEuHkrCb1LpknCi0iWhUzlJwm9SeaJYoxRrlGKNcvEylTcl4Q6VL6m8KQlvKtYoxRqlWKNcfCwJd6jcodIloVPpVLokdCp3JOEOlS8Va5RijVKsUS7+uCScJOH/pFijFGuUYo1y8cepdEm4Q2WSYo1SrFGKNcrFx1R+k8pJErokdCp3qPyXFGuUYo1SrFEuXpaE35SETqVLQqfSJeGOJPyXFWuUYo1SrFHiD/6wJLxJ5S8r1ijFGqVYo1w8lIROpUvCiUqXhDtUuiR0Kl0S7khCp3KShE6lS8KJyhPFGqVYoxRrlIuPqXRJ6JJwotIl4UTliSScJKFT6VS6JHQqXRLeVKxRijVKsUa5eEilS8KJSpeEkyQ8kYQTlS+pdEn4UrFGKdYoxRrl4mUqb1J5QqVLwh1JeELlROVNxRqlWKMUa5SLh5LQqZwk4Y4kdCpPqHRJ6FQ6lS4JnUqXhH9TsUYp1ijFGiX+4A9LQqdykoRO5SQJnUqXhE7lJAknKk8Ua5RijVKsUS4eSsJvUjlJQqdykoROpVPpkvCEypeKNUqxRinWKBcvU3lTEp5IQqfypSQ8ofJEsUYp1ijFGuXiY0m4Q+UOlS4JdyRhkmKNUqxRijXKxR+XhDuS0KmcJKFTuSMJJypvKtYoxRqlWKNcDKPSJaFT6ZLQqTyRhBOVLxVrlGKNUqxRLj6m8iWVJ1S6JHQqXRI6lU7ljiR0Kk8Ua5RijVKsUS5eloTflIQTlTepdEnoVLokdCqdypuKNUqxRinWKPEHa4xijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKP8A2jtDPgCHgj3AAAAAElFTkSuQmCC'
       }]);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('carros', null, {});

  }
};
