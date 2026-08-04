import { Router } from 'express'
import usuarioController from '../controller/index.mjs'

const routes = Router()

routes.get('/', (req, res) => usuarioController.index(req, res))
routes.get('/:documento', (req, res) => usuarioController.show(req, res))
routes.post('/', (req, res) => usuarioController.store(req, res))
routes.patch('/:id',  (req, res) => usuarioController.update(req, res))
routes.delete('/:id', (req, res) => usuarioController.destroy(req, res))

export default routes