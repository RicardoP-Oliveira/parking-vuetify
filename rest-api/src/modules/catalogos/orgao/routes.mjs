import { Router } from "express"
import orgaoController from './controller/index.mjs'

const routes = new Router()

routes.get('/', (req, res) => orgaoController.index(req, res))

export default routes