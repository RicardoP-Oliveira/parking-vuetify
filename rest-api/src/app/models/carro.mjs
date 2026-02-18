import { Model, DataTypes, Op, Sequelize } from 'sequelize';
import User from './user.mjs';
import Orgao from './orgao.mjs';
import Ubm from './ubm.mjs';
import Order from './hierarcar.mjs';
import Document from './documentos.mjs';


  class Carro extends Model {
   static init(sequelize){
    super.init({
      placa: DataTypes.STRING,
      marca: DataTypes.STRING,
      modelo: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      orgaoId: DataTypes.INTEGER,
      renavam: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'carro',
    });
    return this;
   }

   static associate(models) {
      this.belongsTo(models.user, { foreignKey: "userId", as: "userCar" });
      this.belongsTo(models.orgao, { foreignKey: "orgaoId", as: "orgao" });
      this.hasMany(models.ceics, { foreignKey: "carroId", as: "movimentos" });
    }

    static async findCar(car) {
      
      let veiculo = null;

      const carAsNumber = parseInt(car, 10);
 
      if (!isNaN(carAsNumber) &&  carAsNumber > 0) {
        try {
          veiculo = await this.findOne({
            where: { id: carAsNumber},
            attributes: [
            'id', 'placa', 'marca', 'userId',
            [Sequelize.col('userCar.ubmId'), 'ubmId'],
            [Sequelize.col('userCar.documento'), 'documento'],
            [Sequelize.col('userCar.nGuerra'), 'nome'],
            [Sequelize.col('userCar.orgaoId'), 'orgaoId'],
            [Sequelize.col('userCar.docId'), 'docId'],
            [Sequelize.col('userCar.graduaId'), 'guaduaId'],
            [Sequelize.col('userCar->docUser.sigla'), 'docSigla'],
            [Sequelize.col('userCar->ubm.name'), 'nomeUbm'],
            [Sequelize.col('userCar->hierarquia.abrev'), 'graduaAbrev'],
            [Sequelize.col('userCar->orgaoU.siglaCurta'), 'orgaoSigla'],
              
          ],
          include: [
            {
              model: User,
              as:'userCar',
              attributes: [],
              include: [
                { model: Order, as: 'hierarquia', attributes: [] },
                { model: Document, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            { model: Orgao, as: 'orgao', attributes: [] }
          ]
          });
        } catch (error) {
          console.error('Erro ao buscar veículo por ID: ', error);
          throw error;
        }
      }

      if(!veiculo) {
        let conditions = [];

        conditions.push({placa: { [Op.iLike]: `%${car}%`}});
        conditions.push({modelo: { [Op.iLike]: `%${car}%`}});

        if (conditions.length === 0) {
          console.warn("Nenhum critério de busca válido gerado para a entrada.");
          return null;
        }

        let searchCriteria = {
          [Op.or]: conditions
        };

        try {
          veiculo = await this.findOne({
            where: searchCriteria,
            attributes: [
            'id', 'placa', 'marca', 'userId',
            [Sequelize.col('userCar.ubmId'), 'ubmId'],
            [Sequelize.col('userCar.documento'), 'documento'],
            [Sequelize.col('userCar.nGuerra'), 'nome'],
            [Sequelize.col('userCar.orgaoId'), 'orgaoId'],
            [Sequelize.col('userCar.docId'), 'docId'],
            [Sequelize.col('userCar.graduaId'), 'guaduaId'],
            [Sequelize.col('userCar->docUser.sigla'), 'docSigla'],
            [Sequelize.col('userCar->ubm.name'), 'nomeUbm'],
            [Sequelize.col('userCar->hierarquia.abrev'), 'graduaAbrev'],
            [Sequelize.col('userCar->orgaoU.siglaCurta'), 'orgaoSigla'],
              
          ],
          include: [
            {
              model: User,
              as:'userCar',
              attributes: [],
              include: [
                { model: Order, as: 'hierarquia', attributes: [] },
                { model: Document, as: 'docUser', attributes: [] },
                { model: Ubm, as: 'ubm', attributes: [] },
                { model: Orgao, as: 'orgaoU', attributes: [] }
              ]
            },
            { model: Orgao, as: 'orgao', attributes: [] }
          ]
          });
        } catch (error) {
          console.error('Ocorreu um erro: ', error);
          throw error;
        }
      }

      const dados = veiculo.get({ plain: true })

      dados.nomeCompleto = [
        dados.graduaAbrev,
        dados.orgaoSigla,
        dados.nome
      ].filter(Boolean).join(' ')



      return dados;
      // return (veiculo)

    }
  }

export default Carro;
