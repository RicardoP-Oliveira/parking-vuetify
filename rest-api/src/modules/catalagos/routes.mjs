import { Router } from 'express'
import destinoRoutes from './destino/routes.mjs'
import orgaoRoutes from './orgao/routes.mjs'
import unidadeRoutes from './unidade/routes.mjs'
import tratamentoRoutes from './tratamento/routes.mjs'
import tipoDocRoutes from './tipo.documento/routes.mjs'

const routes = Router()

routes.use('/destino', destinoRoutes)
routes.use('/orgao', orgaoRoutes)
routes.use('/unidade', unidadeRoutes)
routes.use('/tratamento', tratamentoRoutes)
routes.use('/tipoDoc', tipoDocRoutes)

export default routes