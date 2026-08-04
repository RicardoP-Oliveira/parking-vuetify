import { Router } from 'express'
import veiculoController from './controller/index.mjs'

const routes = Router()

routes.get('/', (req, res) => veiculoController.index(req, res))
routes.get('/:placa', (req, res) => veiculoController.show(req, res))
routes.post('/', (req, res) => veiculoController.store(req, res))
routes.put('/:id', (req, res) => veiculoController.update(req, res))
routes.delete('/:id', (req, res) => veiculoController.destroy(req, res))

export default routes