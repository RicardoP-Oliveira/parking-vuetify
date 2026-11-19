import { Router } from 'express';

import usuarioRoutes from './modules/usuario/routes/index.mjs'
import veiculoRoutes from './modules/veiculo/index.mjs'

import catalogosRoutes from './modules/catalogos/index.mjs'

import movimentacaoRoutes from './modules/movimentacao/routes/index.mjs'

import atualizacaoRoutes from './modules/atualizacao/routes/index.mjs'

const routes = new Router();

// -----  Rotas de USUÁRIOS ---- //

routes.use('/user', usuarioRoutes)
routes.use('/veiculo', veiculoRoutes)

routes.use('/ceics', movimentacaoRoutes)

routes.use('/atualizacao', atualizacaoRoutes)

routes.use('/', catalogosRoutes)

export default routes;