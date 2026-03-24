import { Router } from 'express'
import tratamentoController from './controller/index.mjs'

const routes = Router()

routes.get('/', (req, res) => tratamentoController.index(req, res))

export default routes