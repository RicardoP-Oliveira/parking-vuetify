import Sequelize  from 'sequelize';
import databaseConfig from '../config/database.mjs';

import Movimentacao from '../../app/models/Movimentacao.mjs'
import Tipo_Documento from '../../app/models/Tipo_Documento.mjs'
import Tratamento from '../../app/models/Tratamento.mjs'
import Unidade from '../../app/models/Unidade.mjs'
import Usuario from '../../app/models/Usuario.mjs'
import Veiculo from '../../app/models/Veiculo.mjs'
import Orgao from '../../app/models/Orgao.mjs';
import Destino from '../../app/models/Destino.mjs'


const models = [
  Orgao,
  Destino,
  Movimentacao,
  Tipo_Documento,
  Tratamento,
  Unidade,
  Usuario,
  Veiculo
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
