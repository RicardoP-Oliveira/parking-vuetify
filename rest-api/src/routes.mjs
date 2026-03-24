import { Router } from 'express';

import usuarioRoutes from './modules/usuario/index.mjs'
import veiculoRoutes from './modules/veiculo/index.mjs'

import tratamentoRoutes from './modules/catalagos/tratamento/index.mjs'
import orgaoRoutes from './modules/catalagos/orgao/index.mjs'
import tipoDocRoutes from './modules/catalagos/tipo.documento/index.mjs'
import unidadeRoutes from './modules/catalagos/unidade/index.mjs'
import destinoRoutes from './modules/catalagos/destino/index.mjs'


import MovimentacaoController from './app/controllers/MovimentacaoController.mjs';

const routes = new Router();

// -----  Rotas de USUÁRIOS ---- //

routes.use('/user', usuarioRoutes)
routes.use('/veiculo', veiculoRoutes)

routes.use('/tratamento', tratamentoRoutes)
routes.use('/orgao', orgaoRoutes)
routes.use('/tipoDoc', tipoDocRoutes)
routes.use('/unidade', unidadeRoutes)
routes.use('/destino', destinoRoutes)


routes.post('/ceics',  MovimentacaoController.cadastrarEntrada);
routes.get('/ceics', MovimentacaoController.index);
routes.get('/ceics/:identificador', MovimentacaoController.show);
routes.put('/ceics/', MovimentacaoController.cadastarSaida);

// ----- Rotas de Destino ----- //


export default routes;
