import { Router } from "express"
import unidadeController from "./controller/index.mjs"
import UnidadeRepository from "./repository/unidade.repository.mjs"

const routes = new Router()

routes.get('/', (req, res) => unidadeController.index(req, res))
routes.use('/:sigla', (req, res) => unidadeController.show(req, res))

export default routes