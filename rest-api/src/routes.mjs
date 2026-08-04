import { Router } from 'express';

import usuarioRoutes from './modules/usuario/routes/index.mjs'
import veiculoRoutes from './modules/veiculo/index.mjs'

import catalogos from './modules/catalagos/index.mjs'

import movimentacaoRoutes from './modules/movimentacao/routes/index.mjs'

const routes = new Router();

// -----  Rotas de USUÁRIOS ---- //

routes.use('/user', usuarioRoutes)
routes.use('/veiculo', veiculoRoutes)

routes.use('/ceics', movimentacaoRoutes)

routes.use('/', catalogos.routes)

export default routes;