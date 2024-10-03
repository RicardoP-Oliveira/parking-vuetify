import Sequelize  from 'sequelize';
import databaseConfig from '../config/database.mjs';

import Ubm from '../app/models/ubm.mjs';
import User from '../app/models/user.mjs';
import Carro from '../app/models/carro.mjs';
import Ceics from '../app/models/ceics.mjs';
import Orgao from '../app/models/orgao.mjs';

const models = [
  Ubm,
  User,
  Carro,
  Ceics,
  Orgao,
];

class Database {
  constructor()  {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));

  }
}

export default new Database();
