import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload.mjs';
import auth from './app/middlewares/auth.mjs'

import usuarioRoutes from './modules/usuario/index.mjs'

import VeiculoController from './app/controllers/VeiculoController.mjs';
import UnidadeController from './app/controllers/UnidadeController.mjs';
import MovimentacaoController from './app/controllers/MovimentacaoController.mjs';
import DestinoController from './app/controllers/DestinoController.mjs';
import TipoDocController from './app/controllers/TipoDocController.mjs'
import TratamentoController from './app/controllers/TratamentoController.mjs';

const routes = new Router();
const upload = multer(uploadConfig.getConfig());



// -----  Rotas de UBM ---- //
routes.get('/ubm',  UnidadeController.index);

routes.get('/ubm/orgaos', UnidadeController.getOrgaos);

routes.get('/ubm/:id', UnidadeController.show);

routes.post('/ubm', UnidadeController.store);

routes.put('/ubm/:id', UnidadeController.update);

routes.delete('/ubm/:id', UnidadeController.destroy);


// -----  Rotas de USUÁRIOS ---- //

routes.use('/user', usuarioRoutes)

// -----  Rotas de CARROS ---- //

routes.get('/carro', VeiculoController.index);

routes.get('/carro/:placa', VeiculoController.show);

// routes.get('/carro/placa/:placa', CarroController.showPlaca);

routes.post('/carro', VeiculoController.store);

routes.put('/carro/:id', VeiculoController.update);

routes.delete('/carro/:id', VeiculoController.destroy);

// -----  Rotas de Estacionamento ---- //

routes.post('/ceics',  auth, MovimentacaoController.cadastrarEntrada);
routes.get('/ceics', MovimentacaoController.index);
routes.get('/ceics/:identificador', MovimentacaoController.show);
routes.put('/ceics/', MovimentacaoController.cadastarSaida);

// ----- Rotas de Destino ----- //
routes.get('/destino', DestinoController.index);

// --- Documentos ----- ///
routes.get('/document', TipoDocController.index);

// ---- Hierarquia ----- //
routes.get('/hierarquia', TratamentoController.index);

export default routes;
