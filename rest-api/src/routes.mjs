import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload.mjs';
import auth from './app/middlewares/auth.mjs'

import CarroController from './app/controllers/CarroController.mjs';
import UbmController from './app/controllers/UbmController.mjs';
import UserController from './app/controllers/UserController.mjs';
import CeicsController from './app/controllers/CeicsController.mjs';
import SessionController from './app/controllers/SessionController.mjs';
import PedestreController from './app/controllers/PedestreController.mjs';
import ServicoController from './app/controllers/ServicoController.mjs';

const routes = new Router();
const upload = multer(uploadConfig.getConfig());

routes.post('/sessions', SessionController.store);

routes.post('/sessions/validate', auth, SessionController.validate);

// -----  Rotas de UBM ---- //
routes.get('/ubm',  UbmController.index);

routes.get('/ubm/orgaos', UbmController.getOrgaos);

routes.get('/ubm/:id', UbmController.show);

routes.post('/ubm', UbmController.store);

routes.put('/ubm/:id', UbmController.update);

routes.delete('/ubm/:id', UbmController.destroy);


// -----  Rotas de USUÁRIOS ---- //

routes.get('/user', auth, UserController.index);

routes.get('/user/:id', auth, UserController.show);

routes.post('/user', auth,  upload.single('foto'), UserController.store);

routes.patch('/user/:id',  upload.single('foto'), UserController.update);

routes.delete('/user/:id', auth, UserController.destroy);

// -----  Rotas de CARROS ---- //

routes.get('/carro', CarroController.index);

routes.get('/carro/:id', CarroController.show);

routes.get('/carro/placa/:placa', CarroController.showPlaca);

routes.post('/carro', CarroController.store);

routes.put('/carro/:id', CarroController.update);

routes.delete('/carro/:id', CarroController.destroy);

// -----  Rotas de Estacionamento ---- //

routes.post('/ceics',  auth, CeicsController.store);
routes.get('/ceics', auth, CeicsController.index);
routes.get('/ceics/:placa', auth, CeicsController.show);
routes.get('/parking/:placa', auth, CeicsController.parking);

routes.get('/pedestre', auth, PedestreController.index);
routes.post('/pedestre', auth, PedestreController.store);
routes.get('/pedestre/doc/:doc', auth, PedestreController.show);

routes.post('/servico', ServicoController.store);
routes.get('/servico', ServicoController.index);

export default routes;
