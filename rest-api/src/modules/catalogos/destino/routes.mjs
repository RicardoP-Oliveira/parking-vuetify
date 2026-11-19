import { Router } from 'express'
import destinoController from './controller/index.mjs'

const routes = new Router()

routes.get('/', (req, res) => destinoController.index(req, res))

export default routes