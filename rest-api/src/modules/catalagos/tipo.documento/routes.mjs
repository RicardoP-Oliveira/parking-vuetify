import { Router } from "express"
import tipoDocController from "./controller/index.mjs"

const routes = new Router()

routes.get('/', (req, res) => tipoDocController.index(req, res))

export default routes