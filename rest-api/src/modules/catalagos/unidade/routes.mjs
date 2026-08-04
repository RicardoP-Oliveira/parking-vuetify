import { Router } from "express"
import unidadeController from "./controller/index.mjs"

const routes = new Router()

routes.get('/', (req, res) => unidadeController.index(req, res))

export default routes